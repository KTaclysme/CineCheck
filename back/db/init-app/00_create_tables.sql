CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT,
    pword TEXT,

    CONSTRAINT unique_users UNIQUE (email)
);

CREATE TABLE user_rating (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    tconst TEXT NOT NULL,
    personalrating FLOAT,
    watched BOOLEAN DEFAULT FALSE,
    favorite BOOLEAN DEFAULT FALSE,

    CONSTRAINT unique_user_film UNIQUE (userid, tconst)
);

ALTER TABLE user_rating
ADD CONSTRAINT fk_user
FOREIGN KEY (userid)
REFERENCES "users"(id)
ON DELETE CASCADE;

CREATE INDEX idx_userid ON user_rating(userid);