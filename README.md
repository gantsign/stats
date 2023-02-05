# GantSign open-source project statistics

[![Build](https://github.com/gantsign/stats/workflows/Build/badge.svg)](https://github.com/gantsign/stats/actions?query=workflow%3ABuild)

Project to collect and display information from
[GitHub](https://developer.github.com/v3/) and
[Ansible Galaxy](https://galaxy.ansible.com/api/v1/) to provide and overview of
GantSign open-source projects.

## Web interface

You can view the web interface at
[https://gantsign.com/stats](https://gantsign.com/stats).

## Gathering data

Dependencies:
* Linux (e.g. Ubuntu Xenial)
* Python 3.8 (you can install this using https://github.com/pyenv/pyenv)

If you'd like to gather the data for yourself you need to run the following
from the project root:

```bash
# Install pipenv
sudo pip install pipenv

# Install project dependencies
pipenv install

# Set your GitHub token (no additional permissions necessary)
export GH_TOKEN=<YOUR GITHUB TOKEN HERE>

# Run the report
pipenv run python report.py
```

### Built using

* [Python 3](https://www.python.org)
* [pandas](https://pandas.pydata.org/)
* [Pipenv](https://github.com/pypa/pipenv)
* [PyGithub](https://github.com/PyGithub/PyGithub)
* [tqdm](https://github.com/tqdm/tqdm)
* [Pylint](https://www.pylint.org)
* [YAPF](https://github.com/google/yapf)
* [Rope](https://github.com/python-rope/rope)

## To build the web application

Dependencies:
* Node.js 18 (you can install this using https://github.com/creationix/nvm)

To build the web interface run the following from the project root:

```bash
npm run build
```

You can also run a local development server using:

```bash
npm start
```

### Built using

* [TypeScript](https://www.typescriptlang.org)
* [Node.js](https://nodejs.org)
* [React](https://reactjs.org)
* [Material-UI](https://material-ui.com)
* [Axios](https://www.npmjs.com/package/axios)
* [SemVer](https://www.npmjs.com/package/semver)
* [Create React App](https://facebook.github.io/create-react-app/)
* [TSLint](https://palantir.github.io/tslint/)

## License

This software is licensed under the terms in the file named "LICENSE" in the
root directory of this project. This project has dependencies that are under
different licenses.

## Author Information

John Freeman

GantSign Ltd.
Company No. 06109112 (registered in England)
