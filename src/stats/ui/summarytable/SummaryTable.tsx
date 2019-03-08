import React from 'react';
import {
    IconButton,
    MuiThemeProvider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TableSortLabel,
    Theme,
    Tooltip,
    withStyles
} from "@material-ui/core";
import {SummaryTableProps} from "./SummaryTableProps";
import {SummaryTableState} from "./SummaryTableState";
import {SortDirection} from "@material-ui/core/TableCell";
import {SummaryRepository} from "../../model/SummaryRepository";
import {
    darkTheme,
    parseIsoDateToMillis,
    reformatIsoAsLocaleDate,
    reformatIsoAsLocaleDatetime,
    toLocaleString
} from "../App";
import {StyleRules} from "@material-ui/core/styles";
import {Summary} from "../../model/Summary";
import Semver from "semver";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Column {
    constructor(
            readonly id: string,
            readonly name: string,
            readonly numeric: boolean,
            readonly accessor: (repo: SummaryRepository) => string,
            readonly linkAccessor: (repo: SummaryRepository) => string | null,
            readonly comparator: (repoA: SummaryRepository, repoB: SummaryRepository) => number,
            readonly totalAccessor: (summary: Summary) => string,
            readonly totalLinkAccessor: (summary: Summary) => string | null,
            readonly iconAccessor: (repo: SummaryRepository, props: SummaryTableProps) => JSX.Element | null
    ) {
    }
}

const columns: Column[] = [
    new Column(
            "name",
            "Name",
            false,
            repo => repo.name,
            repo => repo.url,
            (repoA, repoB) => {
                const nameA = repoA.name.replace('_', '-');
                const nameB = repoB.name.replace('_', '-');
                return nameA.localeCompare(nameB);
            },
            () => "",
            () => null,
            () => null
    ),
    new Column(
            "createdAt",
            "Created",
            false,
            repo => reformatIsoAsLocaleDate(repo.created_at),
            () => null,
            (repoA, repoB) => {
                const createdAtA = parseIsoDateToMillis(repoA.created_at) || 0;
                const createdAtB = parseIsoDateToMillis(repoB.created_at) || 0;
                return createdAtA - createdAtB;
            },
            summary => `${summary.repositories.length} projects`,
            summary => summary.url,
            () => null
    ),
    new Column(
            "openIssuesCount",
            "Open issues",
            true,
            repo => toLocaleString(repo.open_issues_count),
            repo => repo.open_issues_url,
            (repoA, repoB) => {
                const openIssuesCountA = repoA.open_issues_count || 0;
                const openIssuesCountB = repoB.open_issues_count || 0;
                return openIssuesCountA - openIssuesCountB;
            },
            summary => toLocaleString(summary.total_open_issues_count),
            summary => summary.total_open_issues_url,
            () => null
    ),
    new Column(
            "openPullRequestsCount",
            "Open PRs",
            true,
            repo => toLocaleString(repo.open_pull_requests_count),
            repo => repo.open_pull_requests_url,
            (repoA, repoB) => {
                const openPullRequestsCountA = repoA.open_pull_requests_count || 0;
                const openPullRequestsCountB = repoB.open_pull_requests_count || 0;
                return openPullRequestsCountA - openPullRequestsCountB;
            },
            summary => toLocaleString(summary.total_open_pull_requests_count),
            summary => summary.total_open_pull_requests_url,
            () => null
    ),
    new Column(
            "latestReleaseVersion",
            "Release",
            false,
            repo => repo.latest_release_version || "",
            repo => repo.latest_release_url || null,
            (repoA, repoB) => {
                let latestReleaseVersionA: string | undefined | null = repoA.latest_release_version;
                if (!latestReleaseVersionA) {
                    latestReleaseVersionA = null;
                }
                let latestReleaseVersionB: string | undefined | null = repoB.latest_release_version;
                if (!latestReleaseVersionB) {
                    latestReleaseVersionB = null;
                }
                if (latestReleaseVersionA == null && latestReleaseVersionB == null) {
                    return 0;
                }
                if (latestReleaseVersionA == null || latestReleaseVersionB == null) {
                    return latestReleaseVersionA == null ? -1 : 1;
                }
                return Semver.compare(latestReleaseVersionA, latestReleaseVersionB);
            },
            () => "",
            () => null,
            () => null
    ),
    new Column(
            "latestReleaseAt",
            "Release date",
            false,
            repo => reformatIsoAsLocaleDate(repo.latest_release_at),
            () => null,
            (repoA, repoB) => {
                const latestReleaseAtA = parseIsoDateToMillis(repoA.latest_release_at) || 0;
                const latestReleaseAtB = parseIsoDateToMillis(repoB.latest_release_at) || 0;
                return latestReleaseAtA - latestReleaseAtB;
            },
            () => "",
            () => null,
            () => null
    ),
    new Column(
            "commitsSinceRelease",
            "Commits since release",
            true,
            repo => toLocaleString(repo.commits_since_release),
            repo => repo.commits_since_release_url || null,
            (repoA, repoB) => {
                const commitsSinceReleaseA = repoA.commits_since_release || 0;
                const commitsSinceReleaseB = repoB.commits_since_release || 0;
                return commitsSinceReleaseA - commitsSinceReleaseB;
            },
            summary => toLocaleString(summary.total_commits_since_release),
            () => null,
            () => null
    ),
    new Column(
            "stargazersCount",
            "Stars",
            true,
            repo => toLocaleString(repo.stargazers_count),
            repo => repo.stargazers_url || null,
            (repoA, repoB) => {
                const stargazersCountA = repoA.stargazers_count || 0;
                const stargazersCountB = repoB.stargazers_count || 0;
                return stargazersCountA - stargazersCountB;
            },
            summary => toLocaleString(summary.total_stargazers_count),
            () => null,
            () => null
    ),
    new Column(
            "downloadsCount",
            "Downloads",
            true,
            repo => toLocaleString(repo.downloads_count),
            repo => repo.downloads_url || null,
            (repoA, repoB) => {
                const downloadsCountA = repoA.downloads_count || 0;
                const downloadsCountB = repoB.downloads_count || 0;
                return downloadsCountA - downloadsCountB;
            },
            summary => toLocaleString(summary.total_downloads_count),
            () => null,
            (repo, props) =>
                    repo.downloads_count ? (
                            <IconButton
                                    onClick={() => props.onShowDownloadsChart(repo.name)}
                                    className={props.classes.chartIcon}
                                    disableRipple={true}>
                                <FontAwesomeIcon icon="chart-line"/>
                            </IconButton>
                    ) : null
    ),
];

interface ColumnMap {
    [key: string]: Column;
}

const columnMapping: ColumnMap = columns.reduce((map: ColumnMap, column: Column): ColumnMap => {
    map[column.id] = column;
    return map;
}, {});


interface TotalRowProps {
    classes: any;
    summary?: Summary;
}

class TotalRowBase extends React.Component<TotalRowProps, {}> {
    render() {
        const summary = this.props.summary;
        if (!summary) {
            return;
        }
        const classes = this.props.classes;

        return (
                <TableRow className={classes.totals}>
                    <TableCell key="totals">Totals</TableCell>
                    {columns
                    .filter((column: Column) => column.id !== "name")
                    .map((column: Column) => {
                        const url = column.totalLinkAccessor(summary);
                        const contents = url ? <a className={classes.totalLink}
                                                  href={url}>{column.totalAccessor(summary)}</a> : column.totalAccessor(summary);
                        return (
                                <TableCell key={column.id}
                                           align={column.numeric ? "right" : "left"}>
                                    {contents}
                                </TableCell>
                        );
                    })}
                </TableRow>
        );
    }
}

const totalRowStyles = (theme: Theme): StyleRules => ({
    totals: {
        backgroundColor: theme.palette.grey["300"]
    },
    totalLink: {
        fontWeight: theme.typography.caption.fontWeight,
        color: theme.typography.caption.color,
        textDecoration: "none",
        "&:focus, &:visited, &:link, &:active": {
            color: theme.typography.caption.color,
            textDecoration: "none"
        },
        "&:hover": {
            color: theme.typography.caption.color,
            textDecoration: "underline"
        }
    }
});

const TotalRow = withStyles(totalRowStyles)(TotalRowBase);

class SummaryTableBase extends React.Component<SummaryTableProps, SummaryTableState> {

    componentDidMount(): void {
        this.setState({
            orderBy: "name",
            order: "asc"
        });
    }

    sortBy = (columnId: string) => {
        const currentOrderBy: string = this.state.orderBy || "name";
        const currentOrder: SortDirection = this.state.order || "asc";

        const order: SortDirection = currentOrderBy === columnId ?
                (currentOrder === "desc" ? "asc" : "desc")
                : (columnId === "name" ? "asc" : "desc");

        this.setState({
            orderBy: columnId,
            order
        });
    };

    render() {
        const state = this.state;
        if (!state) {
            return <div>Loading...</div>;
        }
        const summary = this.props.summary;
        const classes: any = this.props.classes;
        const orderBy: string = state.orderBy || "name";
        const order: SortDirection = state.order || "asc";
        const repositories: SummaryRepository[] = summary.repositories;
        const comparator = (columnMapping[orderBy] || columns[0]).comparator;

        const sortedRepositories = [...repositories];
        sortedRepositories.sort(comparator);
        if (order === "desc") {
            sortedRepositories.reverse();
        }

        return (
                <Paper className={classes.root}>
                    <Table padding="dense">
                        <TableHead>
                            <MuiThemeProvider theme={darkTheme}>
                                <TableRow className={classes.header}>
                                    <TableCell colSpan={columns.length}>
                                        <h2 className={classes.title}>
                                            GantSign open-source project statistics
                                        </h2>
                                        <div className={classes.subtitle}>
                                            Last
                                            updated: {reformatIsoAsLocaleDatetime(summary.data_at)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className={classes.header}>
                                    {columns.map((column: Column) => {
                                        const sortDirection: SortDirection = orderBy === column.id ? order : false;
                                        const tooltipPlacement = column.numeric ? "bottom-end" : "bottom-start";
                                        const sortActive = orderBy === column.id;

                                        return (
                                                <TableCell key={column.id}
                                                           align={column.numeric ? "right" : "left"}
                                                           sortDirection={sortDirection}>
                                                    <Tooltip title="Sort"
                                                             placement={tooltipPlacement}
                                                             enterDelay={300}>
                                                        <TableSortLabel active={sortActive}
                                                                        direction={order}
                                                                        onClick={() => this.sortBy(column.id)}>
                                                            {column.name}
                                                        </TableSortLabel>
                                                    </Tooltip>
                                                </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </MuiThemeProvider>
                            <TotalRow summary={summary}/>
                        </TableHead>
                        <TableFooter>
                            <TotalRow summary={summary}/>
                        </TableFooter>
                        <TableBody>
                            {sortedRepositories.map((repository: SummaryRepository) =>
                                    <TableRow key={repository.name} className={classes.row}>
                                        {columns.map((column: Column) => {
                                            const link = column.linkAccessor(repository);
                                            const contents = link ? <a className={classes.bodyLink}
                                                                       href={link}>{column.accessor(repository)}</a> : column.accessor(repository);
                                            return (
                                                    <TableCell key={column.id}
                                                               align={column.numeric ? "right" : "left"}>
                                                        {contents}
                                                        {column.iconAccessor(repository, this.props) || ""}
                                                    </TableCell>
                                            );
                                        })}
                                    </TableRow>)}
                        </TableBody>
                    </Table>
                </Paper>
        );
    }
}

const styles = (theme: Theme): StyleRules => ({
    root: {
        overflowX: "auto"
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        }
    },
    header: {
        backgroundColor: theme.palette.primary.dark
    },
    title: {
        fontSize: theme.typography.title.fontSize,
        fontWeight: theme.typography.title.fontWeight,
        fontFamily: theme.typography.title.fontFamily,
        lineHeight: theme.typography.title.lineHeight,
        color: theme.palette.common.white
    },
    subtitle: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: theme.typography.caption.fontWeight,
        fontFamily: theme.typography.caption.fontFamily,
        lineHeight: theme.typography.caption.lineHeight,
        color: theme.palette.common.white
    },
    bodyLink: {
        fontWeight: theme.typography.body1.fontWeight,
        color: theme.typography.body1.color,
        textDecoration: "none",
        "&:focus, &:visited, &:link, &:active": {
            color: theme.typography.body1.color,
            textDecoration: "none"
        },
        "&:hover": {
            color: theme.typography.body1.color,
            textDecoration: "underline"
        }
    },
    chartIcon: {
        padding: 0,
        paddingLeft: "0.25em",
        borderRadius: 0
    }
});
const SummaryTable = withStyles(styles)(SummaryTableBase);

export default SummaryTable;
