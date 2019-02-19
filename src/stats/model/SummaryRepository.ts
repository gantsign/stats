export interface SummaryRepository {

    created_at: string;

    downloads_count?: number | null;

    downloads_url?: string | null;

    latest_release_at?: string | null;

    latest_release_version?: string | null;

    latest_release_url?: string | null;

    commits_since_release?: number | null;

    commits_since_release_url?: string | null;

    name: string;

    open_issues_count: number;

    open_issues_url: string;

    open_pull_requests_count: number;

    open_pull_requests_url: string;

    stargazers_count: number;

    stargazers_url: string;

    url: string;
}
