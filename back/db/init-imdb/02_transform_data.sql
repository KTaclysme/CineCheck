CREATE TABLE imdb_transform AS
SELECT 
    title_principals.tconst || '_' || title_principals.nconst as pk_imdb,
    title_principals.tconst,
    title_principals.nconst,
    name_basics.primaryname,
    name_basics.birthyear,
    name_basics.deathyear,
    title_principals.category,
    title_basics.genres,
    title_basics.primarytitle,
    title_basics.startyear,
    title_ratings.averagerating,
    title_ratings.numvotes
FROM name_basics
INNER JOIN title_principals
    ON title_principals.nconst = name_basics.nconst
INNER JOIN title_basics
    ON title_principals.tconst = title_basics.tconst
INNER JOIN title_ratings
    ON title_basics.tconst = title_ratings.tconst
WHERE title_basics.titletype = 'movie'
    AND title_basics.isadult = false
    AND title_ratings.averagerating IS NOT NULL
    AND title_principals.category IN ('actor','actress','director','composer');