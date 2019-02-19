#!/usr/bin/env bash

set -e

# Install dependencies
npm install

# Build web app
npm run build

if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
    # Deploy changes

    repo_url=https://${GITHUB_TOKEN}@github.com/gantsign/stats.git

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
