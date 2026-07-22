CREATE TABLE movies AS
SELECT 
    title_basics.tconst AS id,
    title_basics.primarytitle AS title,
    title_basics.startyear AS year,
    title_basics.genres,
    title_ratings.averagerating AS rating,
    title_ratings.numvotes AS votes
FROM title_basics
INNER JOIN title_ratings ON title_basics.tconst = title_ratings.tconst
WHERE title_basics.titletype = 'movie'
  AND title_basics.isadult = false;

CREATE TABLE movie_cast AS
SELECT 
    tconst || '_' || nconst || '_' || category AS id,
    tconst AS movie_id,
    nconst AS person_id,
    category AS job
FROM title_principals
WHERE category IN ('actor', 'actress', 'director', 'composer');