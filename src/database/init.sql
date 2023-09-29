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
