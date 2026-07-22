DROP INDEX IF EXISTS idx_movies_title;
CREATE INDEX idx_movies_title ON movies(title);

DROP INDEX IF EXISTS idx_movies_rating_votes;
CREATE INDEX idx_movies_rating_votes ON movies(rating DESC, votes DESC);

DROP INDEX IF EXISTS idx_cast_movie_id;
CREATE INDEX idx_cast_movie_id ON movie_cast(movie_id);

DROP INDEX IF EXISTS idx_cast_person_id;
CREATE INDEX idx_cast_person_id ON movie_cast(person_id);

DROP INDEX IF EXISTS idx_cast_job;
CREATE INDEX idx_cast_job ON movie_cast(job);