#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import pathlib
import sys
import time
import urllib.request
from datetime import datetime
from socket import timeout

import pandas as pd
from github import Github
from pandas import json_normalize
from tqdm import tqdm

organization = 'gantsign'

github_token = os.environ['GH_TOKEN']

g = Github(github_token, timeout=20, retry=5)


def format_iso_datetime(value):
    return value.strftime('%Y-%m-%dT%H:%M:%SZ')


def normalize_repo_name(name):
    return name.replace('_', '-')


data_at = format_iso_datetime(datetime.utcnow())

if len(sys.argv) == 2:
    data_dir = pathlib.Path(sys.argv[1])
else:
    data_dir = pathlib.Path('public') / 'data'

data_dir.mkdir(parents=True, exist_ok=True)

galaxy_server = 'https://galaxy.ansible.com'
role_prefix = 'ansible-role-'


def get_galaxy_namespace():
    url = galaxy_server + '/api/v1/namespaces/?name=' + organization

    for _ in range(0, 3):
        try:
            with urllib.request.urlopen(url, timeout=10) as url_connection:
                if url_connection.getcode() != 200:
                    time.sleep(10)
                    continue

                galaxy_response = json.loads(url_connection.read().decode())
                results = galaxy_response.get('results')
                if results is None or len(results) != 1:
                    return None
                return results[0].get('id')
        except timeout:
            time.sleep(10)
    return None


galaxy_namespace = get_galaxy_namespace()


def get_ansible_downloads(repo_name):
    role_name = repo_name[len(role_prefix):]

    if galaxy_namespace is None:
        return None, role_name

    role_name = repo_name[len(role_prefix):]

    url = galaxy_server + '/api/v1/roles/?namespace=%i&name=%s' % (
        galaxy_namespace, role_name)

    for _ in range(0, 3):
        try:
            with urllib.request.urlopen(url, timeout=10) as url_connection:
                if url_connection.getcode() != 200:
                    time.sleep(10)
                    continue

                galaxy_response = json.loads(url_connection.read().decode())
                results = galaxy_response.get('results')
                if results is None or len(results) != 1:
                    return None, role_name
                return results[0].get('download_count'), role_name
        except timeout:
            time.sleep(10)
    return None, role_name


def copy_dict(src, keys):
    result = {}
    for key in keys:
        result[key] = src[key]
    return result


def update_repo_history(repo, repos_history_df):
    history_dir = data_dir / 'history'
    history_dir.mkdir(parents=True, exist_ok=True)

    repo_data_file = history_dir / (repo['name'] + '.json')

    if repo_data_file.exists():
        with repo_data_file.open('r') as infile:
            repo_data = json.load(infile)
            repo_history = repo_data['history']
    else:
        repo_history = []
        repo_data = copy_dict(repo, [
            'name', 'github_url', 'created_at', 'open_issues_url',
            'open_pull_requests_url', 'stargazers_url'
        ])
        repo_data['history'] = repo_history

    repo_data['url'] = repo['url']
    repo_data['ansible_url'] = repo['ansible_url']
    repo_data['downloads_url'] = repo['downloads_url']

    stats = copy_dict(repo, [
        'open_issues_count', 'open_pull_requests_count', 'stargazers_count',
        'latest_release_version', 'latest_release_at', 'latest_release_url',
        'commits_since_release', 'commits_since_release_url', 'downloads_count'
    ])
    stats['data_at'] = data_at
    repo_history.append(stats)

    repo_history_df = json_normalize(repo_history)
    repo_history_df.data_at = pd.to_datetime(repo_history_df.data_at)
    repo_history_df['repository_name'] = repo['name']
    if 'downloads_count' in repo_history_df:
        repo_history_df[
            'downloads_delta'] = repo_history_df.downloads_count.fillna(
                0).diff().shift(-1)
    repos_history_df = pd.concat([repos_history_df, repo_history_df], sort=True)

    with repo_data_file.open('w') as outfile:
        json.dump(
            repo_data,
            outfile,
            sort_keys=True,
            indent=4,
            separators=(',', ': '))

    return repos_history_df


def update_repo_data():
    repos = list(g.get_organization(organization).get_repos())

    repos_history_df = pd.DataFrame(columns=[
        'repository_name', 'data_at', 'downloads_count', 'downloads_delta',
        'open_issues_count', 'open_pull_requests_count', 'stargazers_count'
    ])
    result_repos = []
    for repo in tqdm(
            iterable=repos, desc='Processing repositories', unit='repo'):
        if repo.archived:
            continue

        time.sleep(1)

        try:
            latest_release = repo.get_latest_release()
        except:
            latest_release = None

        github_url = 'https://github.com/%s/%s' % (organization, repo.name)
        url = github_url
        open_issues_url = github_url + '/issues'
        open_pull_requests_url = github_url + '/pulls'
        stargazers_url = github_url + '/stargazers'
        downloads_url = None
        ansible_url = None

        downloads_count = None
        if normalize_repo_name(repo.name).startswith(role_prefix):
            downloads_count, role_name = get_ansible_downloads(repo.name)
            if downloads_count is not None:
                ansible_url = 'https://galaxy.ansible.com/%s/%s' % (
                    organization, role_name)
                url = ansible_url
                downloads_url = url
        else:
            for release in repo.get_releases():
                for asset in release.get_assets():
                    if downloads_count is None:
                        downloads_count = 0
                    downloads_count += asset.download_count

        open_pull_requests_count = 0
        open_pull_requests = repo.get_pulls(state='open')
        if open_pull_requests is not None:
            open_pull_requests_count = len(list(open_pull_requests))

        # the issues count on the repo includes pull requests
        open_issues_count = repo.open_issues_count - open_pull_requests_count

        created_at = format_iso_datetime(repo.created_at)

        latest_release_version = None
        latest_release_at = None
        latest_release_url = None
        commits_since_release = None
        commits_since_release_url = None
        if latest_release is not None:
            latest_release_version = latest_release.title
            latest_release_at = format_iso_datetime(latest_release.created_at)
            latest_release_url = github_url + '/releases/tag/' + latest_release.tag_name
            comparision = repo.compare(latest_release.tag_name, 'master')
            commits_since_release = comparision.ahead_by
            commits_since_release_url = comparision.html_url

        result_repo = {
            'name': repo.name,
            'url': url,
            'github_url': github_url,
            'ansible_url': ansible_url,
            'open_issues_count': open_issues_count,
            'open_issues_url': open_issues_url,
            'open_pull_requests_count': open_pull_requests_count,
            'open_pull_requests_url': open_pull_requests_url,
            'stargazers_count': repo.stargazers_count,
            'stargazers_url': stargazers_url,
            'created_at': created_at,
            'latest_release_version': latest_release_version,
            'latest_release_at': latest_release_at,
            'latest_release_url': latest_release_url,
            'commits_since_release': commits_since_release,
            'commits_since_release_url': commits_since_release_url,
            'downloads_count': downloads_count,
            'downloads_url': downloads_url
        }
        result_repos.append(result_repo)
        repos_history_df = update_repo_history(result_repo, repos_history_df)

    result_repos = sorted(
        result_repos, key=lambda repo: normalize_repo_name(repo['name']))
    return result_repos, repos_history_df


def write_summary(repos):
    total_downloads_count = 0
    total_stargazers_count = 0
    total_open_issues_count = 0
    total_open_pull_requests_count = 0
    total_commits_since_release = 0

    for repo in repos:
        downloads = repo.get('downloads_count')
        if downloads is not None:
            total_downloads_count += downloads

        stargazers = repo.get('stargazers_count')
        if stargazers is not None:
            total_stargazers_count += stargazers

        issues = repo.get('open_issues_count')
        if issues is not None:
            total_open_issues_count += issues

        pulls = repo.get('open_pull_requests_count')
        if pulls is not None:
            total_open_pull_requests_count += pulls

        commits = repo.get('commits_since_release')
        if commits is not None:
            total_commits_since_release += commits

    total_open_issues_url = 'https://github.com/issues?q=is%3Aopen+is%3Aissue+archived%3Afalse+user%3A' + organization
    total_open_pull_requests_url = 'https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+user%3A' + organization

    summary = {
        'total_downloads_count': total_downloads_count,
        'total_stargazers_count': total_stargazers_count,
        'total_open_issues_count': total_open_issues_count,
        'total_open_issues_url': total_open_issues_url,
        'total_open_pull_requests_count': total_open_pull_requests_count,
        'total_open_pull_requests_url': total_open_pull_requests_url,
        'total_commits_since_release': total_commits_since_release,
        'data_at': data_at,
        'repositories': repos,
        'url': 'https://github.com/%s?type=source' % organization
    }

    summary_file = data_dir / 'summary.json'

    with summary_file.open('w') as outfile:
        json.dump(
            summary, outfile, sort_keys=True, indent=4, separators=(',', ': '))


def write_downloads(repos_history_df):
    downloads = repos_history_df.filter(
        ['data_at', 'repository_name', 'downloads_count', 'downloads_delta'],
        axis=1).dropna().to_json(
            orient='records', date_format='iso')

    downloads_file = data_dir / 'downloads.json'

    with downloads_file.open('w') as outfile:
        json.dump(
            json.loads(downloads),
            outfile,
            sort_keys=True,
            indent=4,
            separators=(',', ': '))


repo_data, repos_history_df = update_repo_data()

write_summary(repo_data)
write_downloads(repos_history_df)
