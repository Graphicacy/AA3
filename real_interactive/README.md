# Afterschool Alliance's America After 3PM

## Authors

A project by Collaborative Communications Group

Designed and built by Graphicacy

## Prerequisites

* Ruby/Bundler
* Jekyll 1.4.3
* Node.js/Grunt

## Running Locally

* getting set up: bundle install
* starting the server: grunt serve
* building project: grunt build
* save updated dist files: zip -r -X name_of_build_date_of_build.zip dist
* move updated zipped file to parent directory

## Deploying

Deploying a staging server on github pages:

* add `_includes` folder to _config.yml, `include: [..., '_includes']`
* remove `dist` from .gitignore file
* make sure githib knows about dist folder: git add dist && git commit -m "Initial dist subtree commit"
* push to gh-pages branch on github: git subtree push --prefix dist origin gh-pages

## Notes

The csv data files in AA3/real_interactive/app/data can also be found in AA3/data/FINAL-9-21-14. Any updates to the data should be made in both places. 

