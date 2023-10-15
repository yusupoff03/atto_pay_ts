create extension if not exists "uuid-ossp";

DROP TABLE IF EXISTS customer cascade;
DROP TABLE IF EXISTS customer_device cascade;


create table if not exists customer(
id uuid primary key default uuid_generate_v4(),
name varchar(64) not null,
phone varchar(12) not null unique,
photo_url varchar(256),
hashed_password text not null,
reg_date timestamp not null default now(),
is_blocked boolean not null default false,
safe_login_after int not null default 0,
last_login_attempt timestamp
);

create table if not exists customer_device(
id serial primary key,
customer_id uuid not null references customer(id),
device_id varchar(64) not null,
constraint unique_customer_device unique(customer_id, device_id)
);
create table if not exists customer_card(
id uuid primary key default uuid_generate_v4(),
customer_id uuid not null references customer(id),
name varchar(64) not null,
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
reg_date timestamp not null default now(),
is_blocked boolean not null default false,
safe_login_after int not null default 0
);
create table if not exists service_category(
id serial primary key,
code varchar(64) not null unique,
name jsonb not null
);

create table if not exists service(
id uuid primary key default uuid_generate_v4(),
name varchar (64),
price double precision ,
merchant_id uuid references merchant(id),
category_id serial references service_category(id),
logo_url varchar(256),
isActive Boolean default false,
constraint unique_merchant_category unique (merchant_id, category_id)
);
create table if not exists error(
id serial primary key,
name varchar(64) not null unique,
message jsonb not null,
http_code int not null
);
insert into error(name, message, http_code) values
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
('SERVICE_NOT_FOUND', '{"en": "Service not found", "uz": "Xizmat topilmadi", "ru": "Услуга не найдена"}', 404);

