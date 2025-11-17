#!/bin/bash
set -e

echo "📥 Import IMDB TSV"

import() {
  table=$1
  file="/docker-entrypoint-initdb.d/data/$2"
  echo "➡️ Import $table from $file"

  psql -U admin -d cinecheck -c "\copy $table FROM '$file' WITH (FORMAT text, DELIMITER E'\t', NULL '\N', HEADER true)"
}

import title_akas title.akas.tsv
import title_basics title.basics.tsv
import title_crew title.crew.tsv
import title_episode title.episode.tsv
import title_principals title.principals.tsv
import title_ratings title.ratings.tsv
import name_basics name.basics.tsv

echo "✅ Import terminé"
