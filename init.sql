CREATE TABLE public.stock (
    symbol varchar NOT NULL,
    "date" date NOT NULL,
    "time" time NOT NULL,
    "open" numeric NULL,
    high numeric NULL,
    low numeric NULL,
    "close" numeric NULL,
    volume int4 NULL,
    "name" varchar NOT NULL,
    insertdate timestamp NULL DEFAULT CURRENT_DATE,
    CONSTRAINT pk_stock PRIMARY KEY (symbol, date, "time", name)
);

CREATE TABLE public.users (
    email varchar(255) NULL,
    "password" varchar(255) NULL,
    "role" varchar(255) NULL
);

CREATE TABLE public.stats (
    stock varchar NOT NULL,
    times_requested int4 NOT NULL,
    CONSTRAINT newtable_pk PRIMARY KEY (stock)
);