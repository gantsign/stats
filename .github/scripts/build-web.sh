#!/usr/bin/env bash

set -e

# Install dependencies
npm ci

# Check if files are properly formatted
npm run fix
if [[ $(git status --porcelain=v1 --untracked-files=no | \
        grep --invert-match 'package-lock.json') ]]; then
    echo "Source files not properly formatted, reformat and push again."
    git status --porcelain=v1 --untracked-files=no | \
        grep --invert-match 'package-lock.json'
    exit 1
fi

# Build web app
npm run build

if [ "${GITHUB_REF##*/}" == "master" ]; then
    # Deploy changes

    repo_url=https://${GH_TOKEN}@github.com/gantsign/stats.git

    git clone --single-branch --branch=gh-pages --depth=1 "$repo_url" tmp

    rm -rf tmp/static

    cp -r build/* tmp/


    push() {
        git config user.email 'gantsignbot@gmail.com'
        git config user.name 'GantSign [bot]'

        git add --verbose .

        if [[ "$(git status --porcelain)" == "" ]]; then
            return 0
        fi

        git commit --message="\
Updated web application

New application build.
"

        git push "$repo_url" gh-pages
    }

    (cd tmp && push)
fi
