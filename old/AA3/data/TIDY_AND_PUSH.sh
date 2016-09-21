#!usr/bin/sh

# Tidy the data, then move all of it to the appropriate spots

cd /Users/reed/graphicacy/IN_PROGRESS/AA3/data
Rscript tidy_all_states.r
cp ./FINAL-9-21-14/tidied/All_states_TIDY.csv ../real_interactive/app/data/
cp ./FINAL-9-21-14/question_metadata_TIDY.csv ../real_interactive/app/data/