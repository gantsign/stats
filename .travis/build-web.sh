#!/usr/bin/env bash

set -e

# Lint
curl -sSLO https://github.com/shyiko/ktlint/releases/download/0.27.0/ktlint &&
  chmod a+x ktlint

./ktlint --color "src/**/*.kt"

# Install nodejs
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install --lts node

# Install dependencies
npm install

# Build web app
unset _JAVA_OPTIONS
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
