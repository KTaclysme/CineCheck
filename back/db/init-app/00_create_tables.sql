CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    pword TEXT NOT NULL,

    CONSTRAINT unique_users UNIQUE (email)
);

CREATE TABLE user_rating (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    tconst TEXT NOT NULL,
    personalrating NUMERIC(2,1),
    watched BOOLEAN NOT NULL DEFAULT FALSE,
    favorite BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT unique_user_film UNIQUE (userid, tconst),

    CONSTRAINT fk_user
        FOREIGN KEY (userid)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT check_film_rating
        CHECK (
            personalrating IS NULL
            OR personalrating BETWEEN 1 AND 5
        )
);

CREATE TABLE user_person_rating (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    nconst TEXT NOT NULL,
    personalrating NUMERIC(2,1),
    favorite BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT unique_user_person UNIQUE (userid, nconst),

    CONSTRAINT fk_user_person
        FOREIGN KEY (userid)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT check_person_rating
        CHECK (
            personalrating IS NULL
            OR personalrating BETWEEN 1 AND 5
        )
);

CREATE INDEX idx_user_rating_userid
    ON user_rating(userid);

CREATE INDEX idx_user_person_rating_userid
    ON user_person_rating(userid);