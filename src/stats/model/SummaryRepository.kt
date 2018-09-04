package stats.model

external interface SummaryRepository {

    @JsName("created_at")
    var createdAt: String

    @JsName("downloads_count")
    var downloadsCount: Int?

    @JsName("downloads_url")
    var downloadsUrl: String?

    @JsName("latest_release_at")
    var latestReleaseAt: String?

    @JsName("latest_release_version")
    var latestReleaseVersion: String?

    @JsName("latest_release_url")
    var latestReleaseUrl: String?

    @JsName("commits_since_release")
    var commitsSinceRelease: Int?

    @JsName("commits_since_release_url")
    var commitsSinceReleaseUrl: String?

    var name: String

    @JsName("open_issues_count")
    var openIssuesCount: Int

    @JsName("open_issues_url")
    var openIssuesUrl: String

    @JsName("open_pull_requests_count")
    var openPullRequestsCount: Int

    @JsName("open_pull_requests_url")
    var openPullRequestsUrl: String

    @JsName("stargazers_count")
    var stargazersCount: Int

    @JsName("stargazers_url")
    var stargazersUrl: String

    var url: String
}
