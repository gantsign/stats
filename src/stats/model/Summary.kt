package stats.model

external interface Summary {

    @JsName("data_at")
    var dataAt: String

    var repositories: Array<SummaryRepository>

    @JsName("total_downloads_count")
    var totalDownloadsCount: Int

    @JsName("total_stargazers_count")
    var totalStargazersCount: Int

    @JsName("total_open_issues_count")
    var totalOpenIssuesCount: Int

    @JsName("total_open_issues_url")
    var totalOpenIssuesUrl: String

    @JsName("total_open_pull_requests_count")
    var totalOpenPullRequestsCount: Int

    @JsName("total_open_pull_requests_url")
    var totalOpenPullRequestsUrl: String

    @JsName("total_commits_since_release")
    var totalCommitsSinceRelease: Int

    var url: String
}
