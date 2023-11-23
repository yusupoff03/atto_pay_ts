create extension if not exists "uuid-ossp";

DROP TABLE IF EXISTS customer cascade;
DROP TABLE IF EXISTS customer_device cascade;
DROP TABLE IF EXISTS merchant cascade;
DROP TABLE IF EXISTS service cascade;
DROP TABLE IF EXISTS message cascade;


create table if not exists customer(
id uuid primary key default uuid_generate_v4(),
name varchar(64) not null,
phone varchar(12) not null unique,
image_url varchar(256),
hashed_password text not null,
reg_date timestamp not null default now(),
gender varchar(1),
birth_date date,
lang varchar(2) not null default 'ru'
);

create table if not exists customer_device(
id serial primary key,
customer_id uuid not null references customer(id),
device_id varchar(64) not null,
name varchar(128) not null,
last_login timestamp not null default now(),
constraint unique_customer_device unique(customer_id, device_id)
);
create table if not exists customer_card(
id uuid primary key default uuid_generate_v4(),
customer_id uuid not null references customer(id),
name varchar(64) not null,
owner_name varchar(64),
pan varchar(16) not null unique,
expiry_month varchar(2) not null,
expiry_year varchar(2) not null,
balance numeric(10, 2) not null default 1000000,
constraint unique_customer_pan unique(customer_id, pan)
);
create table if not exists currency(
id uuid primary key default uuid_generate_v4(),
name varchar not null,
abbreviation varchar
);
create table if not exists merchant(
id uuid primary key default uuid_generate_v4(),
name varchar(30) not null,
email varchar(64) not null unique,
hashed_password text not null,
lang varchar(2) not null default 'ru',
balance numeric(12, 2) not null default (random() * 3000000),
reg_date timestamp not null default now()
);
create table if not exists service_category(
id serial primary key,
code varchar(64) not null unique,
name jsonb not null
);

create table if not exists service (
id uuid primary key default uuid_generate_v4(),
merchant_id uuid not null references merchant(id),
category_id int not null references service_category(id),
name varchar(64) not null,
image_url varchar(256),
is_active boolean not null default false,
public_key varchar(64) not null unique,
deleted boolean not null default false
);
create table if not exists service_field (
id uuid primary key default uuid_generate_v4(),
service_id uuid not null references service(id),
name varchar(64) not null,
type varchar(16) not null,
order_num int default 0,
constraint unique_service_field unique(service_id, name)
);
create table if not exists message(
name varchar(64) not null unique,
message jsonb not null,
http_code int not null
);
create table if not exists customer_saved_service(
customer_id uuid not null references customer(id),
service_id uuid not null references service(id),
constraint unique_customer_service unique(customer_id, service_id)
);
create table if not exists transfer (
id uuid primary key default uuid_generate_v4(),
owner_id uuid not null,
type varchar(16) not null,
amount int not null,
created_at timestamp not null default now(),
sender_pan varchar(16),
sender_id uuid,
receiver_pan varchar(16),
receiver_id uuid
);
create table if not exists payment (
id uuid primary key default uuid_generate_v4(),
owner_id uuid not null,
type varchar(16) not null,
amount int not null,
created_at timestamp not null default now(),
sender_id uuid not null,
receiver_id uuid not null,
fields jsonb
);
create or replace function mask_credit_card(pan varchar(16))
returns varchar(16) as $$
  begin return concat(left(pan,6),'******',right(pan,4));
    end;
  $$ language plpgsql;
-- creates new service with fields
create or replace procedure create_service(
  _merchant_id uuid,
  _category_id int,
  _name varchar(64),
  _is_active boolean,
  _public_key varchar(64),
  _fields jsonb,
  out error_code varchar(64),
  out error_message text,
  out success_message jsonb
) as $$
declare
  service_id uuid;
begin
  begin
    insert into service (merchant_id, category_id, name, is_active, public_key)
    values (_merchant_id, _category_id, _name, _is_active, _public_key)
    returning id into service_id;

    begin
      for i in 0..jsonb_array_length(_fields) - 1 loop
          insert into service_field (service_id, name, type, order_num)
          values (service_id, _fields->i->>'name', _fields->i->>'type', (_fields->i->>'order')::int);
        end loop;
    exception
      when unique_violation then
        rollback;
        error_code := 'SAME_FIELD_NAME';
        return;
    end;

    select message from message where name = 'SERVICE_CREATED' into success_message;
  exception
    when others then
      rollback;
      error_code := 'DATABASE_ERROR';
      error_message := sqlerrm;
      return;
  end;

  commit;
end;
$$ language plpgsql;
create or replace procedure delete_card(
  _card_id uuid,
  _customer_id uuid,
  out error_code varchar(64),
  out error_message text
) as $$
begin
  begin
    delete from transactions where owner_id = _customer_id and (sender->>'id')::uuid = _card_id or (receiver->>'id')::uuid = _card_id;

    delete from customer_card where id = _card_id and customer_id = _customer_id;
    if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
    end if;
  exception
    when others then
      rollback;
      error_code := 'DATABASE_ERROR';
      error_message := sqlerrm;
      return;
  end;

  commit;
end;
$$ language plpgsql;
create or replace procedure pay_for_service(
  _customer_id uuid,
  _card_id uuid,
  _service_id uuid,
  _amount int,
  _details jsonb,
  out payment_id uuid,
  out error_code varchar(64),
  out error_message text,
  out success_message jsonb
)
as $$
declare
  service_row service;
  card_row customer_card;
  merchant_row merchant;
  service_fields jsonb := '[]';
  details jsonb := '{}';
  key_exists boolean := false;
begin
  begin
    select * into service_row from service where id = _service_id and deleted = false;
    if not found then
      error_code := 'SERVICE_NOT_FOUND';
      return;
    end if;

    if not service_row.is_active then
      error_code := 'SERVICE_NOT_ACTIVE';
      return;
    end if;

    select * into card_row from customer_card where id = _card_id and customer_id = _customer_id;
    if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
    end if;

    if card_row.balance < _amount then
      error_code := 'INSUFFICIENT_FUNDS';
      return;
    end if;

    -- save service_field names
    select jsonb_agg(jsonb_build_object('id', id, 'name', name)) into service_fields from service_field where service_id = _service_id;

    -- loop service_fields and check if all required fields are provided, then add them to details
    if jsonb_array_length(service_fields) > 0 then
      for i in 0..jsonb_array_length(service_fields) - 1 loop
          -- key_exists variable
          select exists(select 1 from jsonb_each(_details) where key = service_fields->i->>'id') into key_exists;

          if not key_exists then
            error_code := 'VALIDATION_ERROR';
            error_message := service_fields;
            return;
          end if;

          -- add service_fields to details
          if key_exists then
            details := details || jsonb_build_object(service_fields->i->>'id', _details->(service_fields->i->>'id'));
          end if;
        end loop;
    end if;

    insert into payment (owner_id, type, amount, sender_id, receiver_id, fields)
    values (_customer_id, 'expense', _amount, card_row.id, _service_id, details)
    returning id into payment_id;

    insert into payment (owner_id, type, amount, sender_id, receiver_id, fields)
    values (service_row.merchant_id, 'income', _amount, _customer_id, _service_id, details);

    update customer_card set balance = balance - _amount where id = _card_id;
    update merchant set balance = balance + _amount where id = service_row.merchant_id;

    select message from message where name = 'PAYMENT_SUCCESS' into success_message;
  exception
    when others then
      rollback;
      error_code := 'TRANSACTION_ERROR';
      error_message := sqlerrm;
      return;
  end;

  commit;
end;
$$ language plpgsql;
create or replace procedure transfer_money_to_self(
  _customer_id uuid,
  _from_card_id uuid,
  _to_card_id uuid,
  _amount int,
  out transfer_id uuid,
  out error_code varchar(64),
  out error_message text,
  out success_message jsonb
) as $$
declare
sender_card customer_card;
  receiver_card customer_card;
begin
begin
select * into sender_card from customer_card where id = _from_card_id and customer_id = _customer_id;
if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
end if;

select * into receiver_card from customer_card where id = _to_card_id and customer_id = _customer_id;
if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
end if;

    if sender_card.balance < _amount then
      error_code := 'INSUFFICIENT_FUNDS';
      return;
end if;

insert into transfer (owner_id, type, amount, sender_id, receiver_pan, receiver_id)
values (_customer_id, 'expense', _amount, _from_card_id, receiver_card.pan, receiver_card.customer_id)
  returning id into transfer_id;

insert into transfer (owner_id, type, amount, sender_pan, sender_id, receiver_id)
values (_customer_id, 'income', _amount, sender_card.pan, sender_card.customer_id, _to_card_id);

update customer_card set balance = balance - _amount where id = sender_card.id;
update customer_card set balance = balance + _amount where id = receiver_card.id;

select message from message where name = 'TRANSFER_SUCCESS' into success_message;
exception
    when others then
      rollback;
      error_code := 'TRANSACTION_ERROR';
      error_message := sqlerrm;
      return;
end;

commit;
end;
$$ language plpgsql;
create or replace procedure transfer_money(
  _customer_id uuid,
  _from_card_id uuid,
  _to_pan varchar(16),
  _amount int,
  out transfer_id uuid,
  out error_code varchar(64),
  out error_message text,
  out success_message jsonb
) as $$
declare
sender_card customer_card;
  receiver_card customer_card;
begin
begin
select * into sender_card from customer_card where id = _from_card_id and customer_id = _customer_id;
if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
end if;

select * into receiver_card from customer_card where pan = _to_pan;
if not found then
      error_code := 'CARD_NOT_FOUND';
      return;
end if;

    if sender_card.id = receiver_card.id then
      error_code := 'SAME_CARD';
      return;
end if;

    if sender_card.balance < _amount then
      error_code := 'INSUFFICIENT_FUNDS';
      return;
end if;

insert into transfer (owner_id, type, amount, sender_id, receiver_pan, receiver_id)
values (_customer_id, 'expense', _amount, _from_card_id, receiver_card.pan, receiver_card.customer_id)
  returning id into transfer_id;

insert into transfer (owner_id, type, amount, sender_pan, sender_id, receiver_id)
values (receiver_card.customer_id, 'income', _amount, sender_card.pan, sender_card.customer_id, receiver_card.id);

update customer_card set balance = balance - _amount where id = sender_card.id;
update customer_card set balance = balance + _amount where id = receiver_card.id;

select message from message where name = 'TRANSFER_SUCCESS' into success_message;
exception
    when others then
      rollback;
      error_code := 'TRANSACTION_ERROR';
      error_message := sqlerrm;
      return;
end;

commit;
end;
$$ language plpgsql;
create or replace function get_transactions(
  _customer_id uuid,
  _from timestamp,
  _to timestamp,
  _page int default 1,
  _limit int default 20,
  _card_id uuid default null,
  _service_id uuid default null
)
  returns table (
                  total_count int,
                  id uuid,
                  owner_id uuid,
                  type varchar(16),
                  action text,
                  amount int,
                  created_at timestamp,
                  sender jsonb,
                  receiver jsonb
                ) as $$
declare
  total_count int := 0;
begin
  drop table if exists alltransactions;

  create temp table alltransactions AS (
    -- expense transfer
    select t.id, t.owner_id, t.type, 'transfer' as action, t.amount, t.created_at,
           jsonb_build_object('id', own_card.id, 'name', own_card.name, 'pan', mask_credit_card(own_card.pan)) as sender,
           jsonb_build_object('name', receiver_customer.name, 'image_url', receiver_customer.image_url, 'pan', mask_credit_card(t.receiver_pan)) as receiver
    from transfer t
           join customer_card own_card on own_card.id = t.sender_id
           join customer receiver_customer on receiver_customer.id = t.receiver_id
    where t.owner_id = _customer_id and t.created_at between _from and _to
    union all
    -- expense payment
    select p.id, p.owner_id, p.type, 'payment' as action, p.amount, p.created_at,
           jsonb_build_object('id', own_card.id, 'name', own_card.name, 'pan', mask_credit_card(own_card.pan)) as sender,
           jsonb_build_object('id', s.id, 'name', s.name, 'image_url', s.image_url) as receiver
    from payment p
           join customer_card own_card on own_card.id = p.sender_id
           join service s on s.id = p.receiver_id
    where p.owner_id = _customer_id and p.created_at between _from and _to
    union all
    -- income transfer
    select t.id, t.owner_id, t.type, 'transfer' as action, t.amount, t.created_at,
           jsonb_build_object('name', sender_customer.name, 'image_url', sender_customer.image_url, 'pan', mask_credit_card(t.sender_pan)) as sender,
           jsonb_build_object('id', own_card.id, 'name', own_card.name, 'pan', mask_credit_card(own_card.pan)) as receiver
    from transfer t
           join customer sender_customer on sender_customer.id = t.sender_id
           join customer_card own_card on own_card.id = t.receiver_id
    where t.owner_id = _customer_id and t.created_at between _from and _to
  );

  select count(*) into total_count from alltransactions
  where (_card_id is null or (alltransactions.sender->>'id')::uuid = _card_id or (alltransactions.receiver->>'id')::uuid = _card_id)
    and (_service_id is null or (alltransactions.receiver->>'id')::uuid = _service_id);

  return query
    select total_count, alltransactions.*
    from alltransactions
    order by alltransactions.created_at desc, (alltransactions.type = 'income') desc
    limit _limit offset (_page - 1) * _limit;
end;
$$ language plpgsql;
insert into message(name, message, http_code) values
('VALIDATION_ERROR', '{"en": "Invalid input for {0}", "uz": "{0} uchun notog''ri kiritish", "ru": "Неверный ввод для {0}"}', 400),
('DATABASE_ERROR', '{"en": "Database error", "uz": "Ma''lumotlar bazasi xatosi", "ru": "Ошибка базы данных"}', 500),
('NUMBER_TAKEN', '{"en": "This phone number is already registered", "uz": "Bu telefon raqami allaqachon ro''yhatdan o''tgan", "ru": "Этот номер телефона уже зарегистрирован"}', 409),
('USER_NOT_FOUND', '{"en": "User not found", "uz": "Foydalanuvchi topilmadi", "ru": "Пользователь не найден"}', 404),
('WRONG_PASSWORD', '{"en": "Wrong password", "uz": "Noto''g''ri parol", "ru": "Неверный пароль"}', 401),
('MISSING_TOKEN', '{"en": "Missing token", "uz": "Token topilmadi", "ru": "Отсутствует токен"}', 401),
('INVALID_TOKEN', '{"en": "Invalid token", "uz": "Noto''g''ri token", "ru": "Неверный токен"}', 401),
('EXPIRED_TOKEN', '{"en": "Expired token", "uz": "Muddati o''tgan token", "ru": "Истекший токен"}', 401),
('INVALID_EXPIRY_DATE', '{"en": "Invalid expiration date", "uz": "Amal qilish muddati noto''g''ri", "ru": "Неверный срок действия"}', 400),
('CARD_EXPIRED', '{"en": "Card expired", "uz": "Karta muddati tugagan", "ru": "Срок действия карты истек"}', 400),
('CARD_ALREADY_ADDED', '{"en": "Card already added", "uz": "Karta allaqachon qo''shilgan", "ru": "Карта уже добавлена"}', 409),
('CARD_BELONGS_TO_ANOTHER', '{"en": "Card belongs to another user", "uz": "Karta boshqa foydalanuvchiga tegishli", "ru": "Карта принадлежит другому пользователю"}', 403),
('CARD_NOT_FOUND', '{"en": "Card not found", "uz": "Karta topilmadi", "ru": "Карта не найдена"}', 404),
('ERROR', '{"en": "Internal server error", "uz": "Server xatosi", "ru": "Ошибка сервера"}', 500),
('FILE_EXTENSION_ERROR', '{"en": "This type of file is not allowed", "uz": "Bu turga ega fayllar ruxsat etilmagan", "ru": "Этот тип файла не разрешен"}', 400),
('FILE_UPLOAD_ERROR', '{"en": "Error while uploading file", "uz": "Fayl yuklashda xatolik", "ru": "Ошибка при загрузке файла"}', 500),
('FILE_NOT_ATTACHED', '{"en": "File is not provided", "uz": "Fayl berilmagan", "ru": "Файл не предоставлен"}', 400),
('FILE_DELETE_ERROR', '{"en": "Error while deleting file", "uz": "Fayl o''chirishda xatolik", "ru": "Ошибка при удалении файла"}', 500),
('FILE_NOT_FOUND', '{"en": "File not found", "uz": "Fayl topilmadi", "ru": "Файл не найден"}', 404),
('FILE_READER_ERROR', '{"en": "Error while reading file", "uz": "Faylni o''qishda xatolik", "ru": "Ошибка при чтении файла"}', 500),
('USER_BLOCKED', '{"en": "User is blocked, try again after {0} seconds", "uz": "Foydalanuvchi bloklangan, {0} sekunddan keyin urinib ko''ring", "ru": "Пользователь заблокирован, попробуйте снова через {0} секунд"}', 403),
('WRONG_OTP', '{"en": "Wrong verification code", "uz": "Tekshirish kodi noto''g''ri", "ru": "Неверный код подтверждения"}', 400),
('EXPIRED_OTP', '{"en": "Verification code is expired", "uz": "Tasdiqlash kodi eskirgan", "ru": "Код подтверждения истек"}', 400),
('EMAIL_TAKEN', '{"en": "This email address is already registered", "uz": "Bu elektron pochta allaqachon ro''yxatdan o''tgan", "ru": "Этот адрес электронной почты уже зарегистрирован"}', 400),
('NOT_ALLOWED', '{"en": "Not allowed", "uz": "Ruxsat etilmagan", "ru": "Не разрешено"}', 403),
('SERVICE_ALREADY_EXISTS', '{"en": "Adding multiple services in one category is not allowed", "uz": "Bitta kategoriyada bir nechta xizmat qo''shib bo''lmaydi", "ru": "Нельзя добавить несколько услуг в одну категорию"}', 409),
('SERVICE_NOT_FOUND', '{"en": "Service not found", "uz": "Xizmat topilmadi", "ru": "Услуга не найдена"}', 404),
('INSUFFICIENT_FUNDS', '{"en": "Insufficient funds", "uz": "Mablag'' yetarli emas", "ru": "Недостаточно средств"}', 400),
('TRANSACTION_ERROR', '{"en": "Transaction error", "uz": "Tranzaksiyada xatolik", "ru": "Ошибка транзакции"}', 500),
('SAME_CARD', '{"en": "You cannot transfer money to the same card", "uz": "Bitta kartaga pul o''tkazib bo''lmaydi", "ru": "Нельзя перевести деньги на ту же карту"}', 400),
('SERVICE_NOT_ACTIVE', '{"en": "Service not available", "uz": "Xizmat mavjud emas", "ru": "Услуга недоступна"}', 400),
('PROFILE_UPDATED', '{"en": "Profile updated successfully", "uz": "Profil muvaffaqiyatli yangilandi", "ru": "Профиль успешно обновлен"}', 200),
('CARD_ADDED', '{"en": "Card added successfully", "uz": "Karta muvaffaqiyatli qo''shildi", "ru": "Карта успешно добавлена"}', 200),
('CARD_UPDATED', '{"en": "Card updated successfully", "uz": "Karta muvaffaqiyatli yangilandi", "ru": "Карта успешно обновлена"}', 200),
('CARD_DELETED', '{"en": "Card deleted successfully", "uz": "Karta muvaffaqiyatli o''chirildi", "ru": "Карта успешно удалена"}', 200),
('SERVICE_CREATED', '{"en": "Service created successfully", "uz": "Xizmat muvaffaqiyatli yaratildi", "ru": "Услуга успешно создана"}', 200),
('SERVICE_UPDATED', '{"en": "Service updated successfully", "uz": "Xizmat muvaffaqiyatli yangilandi", "ru": "Услуга успешно обновлена"}', 200),
('SERVICE_DELETED', '{"en": "Service deleted successfully", "uz": "Xizmat muvaffaqiyatli o''chirildi", "ru": "Услуга успешно удалена"}', 200),
('PAYMENT_SUCCESS', '{"en": "Payment successful", "uz": "To''lov muvaffaqiyatli amalga oshirildi", "ru": "Оплата прошла успешно"}', 200),
('TRANSFER_SUCCESS', '{"en": "Money transferred successfully", "uz": "Pul muvaffaqiyatli o''tkazildi", "ru": "Деньги успешно переведены"}', 200),
('CODE_ALREADY_SENT', '{"en": "Verification code already sent", "uz": "Tasdiqlash kodi allaqachon yuborilgan", "ru": "Код подтверждения уже отправлен"}', 409),
('SAME_FIELD_NAME', '{"en": "Field name cannot be same", "uz": "Maydon nomi bir xil bo''lishi mumkin emas", "ru": "Название поля не может быть одинаковым"}', 409),
('TOO_MANY_TRIES', '{"en": "Too many tries", "uz": "Juda ko''p urinishlar", "ru": "Слишком много попыток"}', 403),
('TRY_AGAIN_AFTER', '{"en": "Try again after {0} seconds", "uz": "{0} sekunddan keyin urinib ko''ring", "ru": "Попробуйте снова через {0} секунд"}', 403),
('INVALID_CARD_NUMBER','{"en": "Incorrect card number", "uz": "Karta raqami xato kiritildi", "ru": "Неверный номер карты"}', 400),
('ALLOWED_FOR_TRUSTED', '{"en": "This action is allowed only for trusted devices", "uz": "Ushbu amal faqat ishonchli qurilmalar uchun ruxsat etilgan", "ru": "Это действие разрешено только для доверенных устройств"}', 403),
('UNTRUST_SUCCESS', '{"en": "Removed from trusted devices", "uz": "Ishonchli qurilmalardan olib tashlandi", "ru": "Удалено из доверенных устройств"}', 200),
('SESSIONS_ENDED', '{"en": "Terminated all other sessions", "uz": "Boshqa sessiyalarni tugatildi", "ru": "Завершены все другие сессии"}', 200),
('QR_LOGIN_SUCCESS', '{"en": "QR login successful", "uz": "QR login muvaffaqiyatli amalga oshirildi", "ru": "QR логин прошел успешно"}', 200)
on conflict do nothing;

insert into service_category(code, name) values
('MOBILE_OPERATORS', '{"en": "Mobile operators", "uz": "Mobil aloqa operatorlari", "ru": "Мобильные операторы"}'),
('INTERNET', '{"en": "Internet", "uz": "Internet", "ru": "Интернет"}'),
('TV', '{"en": "TV", "uz": "TV", "ru": "ТВ"}'),
('TELEPHONY', '{"en": "Telephony", "uz": "Telefoniya", "ru": "Телефония"}'),
('UTILITIES', '{"en": "Utilities", "uz": "Komunal xizmatlar", "ru": "Коммунальные услуги"}'),
('TAXI', '{"en": "Taxi", "uz": "Taksi", "ru": "Такси"}'),
('TRANSPORT', '{"en": "Transport", "uz": "Transport", "ru": "Транспорт"}'),
('ENTERTAINMENT', '{"en": "Entertainment", "uz": "Ko''ngilochar xizmatlar", "ru": "Развлечения"}'),
('EDUCATION', '{"en": "Education", "uz": "Ta''lim", "ru": "Образование"}'),
('GOVERNMENT', '{"en": "Government services", "uz": "Davlat xizmatlari", "ru": "Государственные услуги"}'),
('ONLINE_SERVICES', '{"en": "Online services", "uz": "Onlayn xizmatlar", "ru": "Онлайн услуги"}'),
('INSURANCE', '{"en": "Insurance", "uz": "Sug''urta", "ru": "Страхование"}'),
('BANKS', '{"en": "Banks", "uz": "Banklar", "ru": "Банки"}'),
('AIRLINE_TRAIN_TICKETS', '{"en": "Airline and train tickets", "uz": "Avia va temir yo''l chiptalari", "ru": "Авиа и ж/д билеты"}'),
('REAL_ESTATE', '{"en": "Real estate", "uz": "Uy-joy", "ru": "Недвижимость"}'),
('MEDICINE', '{"en": "Medicine", "uz": "Tibbiyot", "ru": "Медицина"}'),
('TOURISM', '{"en": "Tourism", "uz": "Turizm", "ru": "Туризм"}'),
('SPORT', '{"en": "Sport", "uz": "Sport", "ru": "Спорт"}'),
('E_COMMERCE', '{"en": "E-commerce", "uz": "Internet magazinlar", "ru": "Интернет магазины"}'),
('OTHER', '{"en": "Other", "uz": "Boshqa", "ru": "Другое"}'),
('USER_SAVED', '{"en": "Saved services", "uz": "Saqlangan xizmatlar", "ru": "Сохраненные услуги"}')
on conflict do nothing;
