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

CREATE TABLE user_person_rating (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    nconst TEXT NOT NULL,
    personalrating FLOAT,
    favorite BOOLEAN DEFAULT FALSE,

    CONSTRAINT unique_user_person UNIQUE (userid, nconst),
    CONSTRAINT fk_user_person FOREIGN KEY (userid) REFERENCES "users"(id) ON DELETE CASCADE
);

ALTER TABLE user_rating
ADD CONSTRAINT fk_user
FOREIGN KEY (userid)
REFERENCES "users"(id)
ON DELETE CASCADE;

CREATE INDEX idx_userid ON user_rating(userid);
CREATE INDEX idx_user_person_userid ON user_person_rating(userid);