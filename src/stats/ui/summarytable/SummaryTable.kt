package stats.ui.summarytable

import ext.materialui.core.MProps
import ext.materialui.core.paper
import ext.materialui.core.styles.muiThemeProvider
import ext.materialui.core.styles.withStyles
import ext.materialui.core.table
import ext.materialui.core.tableBody
import ext.materialui.core.tableCell
import ext.materialui.core.tableFooter
import ext.materialui.core.tableHead
import ext.materialui.core.tableRow
import ext.materialui.core.tableSortLabel
import ext.materialui.core.tooltip
import ext.semver.Semver
import kotlinext.js.js
import react.RBuilder
import react.RComponent
import react.RState
import react.dom.a
import react.dom.div
import react.dom.h2
import react.key
import react.setState
import stats.model.Summary
import stats.model.SummaryRepository
import stats.service.StatsService
import stats.ui.darkTheme
import stats.ui.parseIsoDateToMillis
import stats.ui.reformatIsoAsLocaleDate
import stats.ui.reformatIsoAsLocaleDatetime
import stats.ui.toLocaleString

private class Column(
    val id: String,
    val name: String,
    val numeric: Boolean = false,
    val accessor: (repo: SummaryRepository) -> String,
    val linkAccessor: (repo: SummaryRepository) -> String? = { _ -> null },
    val comparator: Comparator<SummaryRepository>,
    val totalAccessor: (summary: Summary) -> String = { _ -> "" },
    val totalLinkAccessor: (summary: Summary) -> String? = { _ -> null }
)

private val columns = arrayOf(
    Column(
        id = "name",
        name = "Name",
        accessor = SummaryRepository::name,
        linkAccessor = SummaryRepository::url,
        comparator = compareBy { repo: SummaryRepository -> repo.name.replace('_', '-') }),
    Column(
        id = "createdAt",
        name = "Created",
        accessor = { repo -> repo.createdAt.reformatIsoAsLocaleDate() },
        comparator = compareBy { repo: SummaryRepository -> repo.createdAt.parseIsoDateToMillis() },
        totalAccessor = { summary -> "${summary.repositories.size} projects" },
        totalLinkAccessor = Summary::url
    ),
    Column(
        id = "openIssuesCount",
        name = "Open issues",
        numeric = true,
        accessor = { repo -> repo.openIssuesCount.toLocaleString() },
        linkAccessor = SummaryRepository::openIssuesUrl,
        comparator = compareBy(SummaryRepository::openIssuesCount),
        totalAccessor = { summary -> summary.totalOpenIssuesCount.toLocaleString() },
        totalLinkAccessor = Summary::totalOpenIssuesUrl
    ),
    Column(
        id = "openPullRequestsCount",
        name = "Open PRs",
        numeric = true,
        accessor = { repo -> repo.openPullRequestsCount.toLocaleString() },
        linkAccessor = SummaryRepository::openPullRequestsUrl,
        comparator = compareBy(SummaryRepository::openPullRequestsCount),
        totalAccessor = { summary -> summary.totalOpenPullRequestsCount.toLocaleString() },
        totalLinkAccessor = Summary::totalOpenPullRequestsUrl
    ),
    Column(
        id = "latestReleaseVersion",
        name = "Release",
        accessor = { repo -> repo.latestReleaseVersion ?: "" },
        linkAccessor = SummaryRepository::latestReleaseUrl,
        comparator = compareBy(
            selector = SummaryRepository::latestReleaseVersion,
            comparator = Semver.comparator()
        )
    ),
    Column(
        id = "latestReleaseAt",
        name = "Release date",
        accessor = { repo -> repo.latestReleaseAt.reformatIsoAsLocaleDate() },
        comparator = compareBy { repo: SummaryRepository -> repo.latestReleaseAt.parseIsoDateToMillis() }),
    Column(
        id = "commitsSinceRelease",
        name = "Commits since release",
        numeric = true,
        accessor = { repo -> repo.commitsSinceRelease.toLocaleString() },
        linkAccessor = SummaryRepository::commitsSinceReleaseUrl,
        comparator = compareBy(SummaryRepository::commitsSinceRelease),
        totalAccessor = { summary -> summary.totalCommitsSinceRelease.toLocaleString() }),
    Column(
        id = "stargazersCount",
        name = "Stars",
        numeric = true,
        accessor = { repo -> repo.stargazersCount.toLocaleString() },
        linkAccessor = SummaryRepository::stargazersUrl,
        comparator = compareBy(SummaryRepository::stargazersCount),
        totalAccessor = { summary -> summary.totalStargazersCount.toLocaleString() }),
    Column(
        id = "downloadsCount",
        name = "Downloads",
        numeric = true,
        accessor = { repo -> repo.downloadsCount.toLocaleString() },
        linkAccessor = SummaryRepository::downloadsUrl,
        comparator = compareBy(SummaryRepository::downloadsCount),
        totalAccessor = { summary -> summary.totalDownloadsCount.toLocaleString() })
)

private val columnMapping = columns.associateBy(Column::id)

private interface TotalRowProps : MProps {
    var classes: dynamic
    var summary: Summary?
}

private class TotalRow : RComponent<TotalRowProps, RState>() {
    override fun RBuilder.render() {
        val summary = props.summary ?: return
        val classes = props.classes
        tableRow {
            attrs {
                className = classes.totals
            }
            tableCell {
                attrs {
                    numeric = false
                }
                +"Totals"
            }
            columns
                .filter { it.id != "name" }
                .forEach {
                    tableCell {
                        attrs {
                            numeric = it.numeric
                        }
                        val url = it.totalLinkAccessor(summary)
                        if (url != null) {
                            a(classes = classes.totalLink, href = url) {
                                +it.totalAccessor(summary)
                            }
                        } else {
                            +it.totalAccessor(summary)
                        }
                    }
                }
        }
    }
}

private val styledTotalRow = withStyles<TotalRowProps, TotalRow> { theme: dynamic ->
    js {
        totals = js {
            backgroundColor = theme.palette.grey["300"]
        }
        totalLink = js {
            fontWeight = theme.typography.caption.fontWeight
            color = theme.typography.caption.color
            textDecoration = "none"
            this["&:focus, &:visited, &:link, &:active"] = js {
                color = theme.typography.caption.color
                textDecoration = "none"
            }
            this["&:hover"] = js {
                color = theme.typography.caption.color
                textDecoration = "underline"
            }
        }
    }
}

private fun RBuilder.totalRow(summary: Summary) = styledTotalRow {
    attrs {
        this.summary = summary
    }
}

class SummaryTable : RComponent<SummaryTableProps, SummaryTableState>() {

    init {
        state.order = "asc"
        state.orderBy = "name"
        StatsService.getSummary().then {
            if (it.status == 200) {
                setState {
                    summary = it.data
                }
            }
        }
    }

    private fun sortBy(columnId: String) {
        val currentOrderBy = state.orderBy ?: "name"
        val currentOrder = state.order ?: "asc"

        val order = if (currentOrderBy == columnId) {
            if (currentOrder == "desc") {
                "asc"
            } else {
                "desc"
            }
        } else {
            if (columnId == "name") {
                "asc"
            } else {
                "desc"
            }
        }

        state.orderBy = columnId
        state.order = order
        setState(state)
    }

    private fun createSortHandler(columnId: String): () -> Unit = {
        sortBy(columnId)
    }

    override fun RBuilder.render() {
        val summary = state.summary ?: return
        val classes = props.classes
        val orderBy = state.orderBy ?: "name"
        val order = state.order ?: "asc"
        val repositories = summary.repositories
        val comparator = (columnMapping[orderBy] ?: columns[0]).comparator
        var sortedRepositories = repositories.sortedWith(comparator)
        if (order == "desc") {
            sortedRepositories = sortedRepositories.reversed()
        }

        paper {
            attrs {
                className = classes.root as? String
            }
            table {
                attrs {
                    padding = "dense"
                }
                tableHead {
                    muiThemeProvider {
                        attrs {
                            theme = darkTheme
                        }
                        tableRow {
                            attrs {
                                className = classes.header as? String
                            }
                            tableCell {
                                attrs {
                                    colSpan = columns.size
                                }
                                h2(classes = classes.title as? String) {
                                    +"GantSign open-source project statistics"
                                }
                                div(classes = classes.subtitle as? String) {
                                    +"Last updated: ${summary.dataAt.reformatIsoAsLocaleDatetime()}"
                                }
                            }
                        }
                        tableRow {
                            attrs {
                                className = classes.header as? String
                            }
                            for (column in columns) {
                                tableCell {
                                    attrs {
                                        key = column.id
                                        numeric = column.numeric
                                        sortDirection = if (orderBy == column.id) order else false
                                    }
                                    tooltip {
                                        attrs {
                                            title = "Sort"
                                            placement =
                                                if (column.numeric) "bottom-end" else "bottom-start"
                                            enterDelay = 300
                                        }
                                        tableSortLabel {
                                            attrs {
                                                active = orderBy == column.id
                                                direction = order
                                                onClick = createSortHandler(column.id)
                                            }
                                            +column.name
                                        }
                                    }
                                }
                            }
                        }
                    }
                    totalRow(summary)
                }
                tableFooter {
                    totalRow(summary)
                }
                tableBody {
                    for (repository in sortedRepositories) {
                        tableRow {
                            attrs {
                                key = repository.name
                                className = classes.row as? String
                            }

                            for (column in columns) {
                                tableCell {
                                    attrs {
                                        numeric = column.numeric
                                    }
                                    val link = column.linkAccessor(repository)
                                    if (link != null) {
                                        a(classes = classes.bodyLink as? String, href = link) {
                                            +column.accessor(repository)
                                        }
                                    } else {
                                        +column.accessor(repository)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

private val styledSummaryTable = withStyles<SummaryTableProps, SummaryTable> { theme: dynamic ->
    js {
        root = js {
            overflowX = "auto"
        }
        row = js {
            this["&:nth-of-type(odd)"] = js {
                backgroundColor = theme.palette.background.default
            }
        }
        header = js {
            backgroundColor = theme.palette.primary.dark
        }
        title = js {
            fontSize = theme.typography.title.fontSize
            fontWeight = theme.typography.title.fontSize
            fontFamily = theme.typography.title.fontFamily
            lineHeight = theme.typography.title.lineHeight
            color = theme.palette.common.white
        }
        subtitle = js {
            fontSize = theme.typography.caption.fontSize
            fontWeight = theme.typography.caption.fontSize
            fontFamily = theme.typography.caption.fontFamily
            lineHeight = theme.typography.caption.lineHeight
            color = theme.palette.common.white
        }
        bodyLink = js {
            fontWeight = theme.typography.body1.fontWeight
            color = theme.typography.body1.color
            textDecoration = "none"
            this["&:focus, &:visited, &:link, &:active"] = js {
                color = theme.typography.body1.color
                textDecoration = "none"
            }
            this["&:hover"] = js {
                color = theme.typography.body1.color
                textDecoration = "underline"
            }
        }
    }
}

fun RBuilder.summaryTable() = styledSummaryTable {}
