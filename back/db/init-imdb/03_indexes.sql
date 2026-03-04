CREATE INDEX IF NOT EXISTS idx_tconst ON imdb_transform(tconst);
CREATE INDEX IF NOT EXISTS idx_nconst ON imdb_transform(nconst);
CREATE INDEX IF NOT EXISTS idx_primarytitle ON imdb_transform(primarytitle);
CREATE INDEX IF NOT EXISTS idx_primaryname ON imdb_transform(primaryname);
CREATE INDEX IF NOT EXISTS idx_averageRating ON imdb_transform(averageRating);
CREATE INDEX IF NOT EXISTS idx_numVotes ON imdb_transform(numVotes);