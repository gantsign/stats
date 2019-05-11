import { SummaryRepository } from './SummaryRepository';

export interface Summary {
  data_at: string;

  repositories: SummaryRepository[];

  total_downloads_count: number;

  total_stargazers_count: number;

  total_open_issues_count: number;

  total_open_issues_url: string;

  total_open_pull_requests_count: number;

  total_open_pull_requests_url: string;

  total_commits_since_release: number;

  url: string;
}
