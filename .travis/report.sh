#!/usr/bin/env bash

set -e

repo_url=https://${GITHUB_TOKEN}@github.com/gantsign/stats.git

git clone --single-branch --branch=gh-pages --depth=1 "$repo_url" tmp

push() {
    git config user.email 'gantsignbot@gmail.com'
    git config user.name 'GantSign [bot]'

    git add --verbose .

    git commit --message="\
Updated project data

Using report script.
"

    git push "$repo_url" gh-pages
}

pipenv run python report.py tmp/data

(cd tmp && push)
