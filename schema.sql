-- to use gen_random_uuid()
-- must be superuser
CREATE EXTENSION pgcrypto;

CREATE TABLE accounts
(
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    balance type money DEFAULT 0,
    PRIMARY KEY (id)
);