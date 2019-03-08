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
            readonly comparator: (a: SummaryRepository, b: SummaryRepository) => number,
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
            (repo: SummaryRepository): string => {
                return repo.name;
            },
            (repo: SummaryRepository): string | null => {
                return repo.url;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const nameA = a.name.replace('_', '-');
                const nameB = b.name.replace('_', '-');
                return nameA.localeCompare(nameB);
            },
            (): string => {
                return "";
            },
            (): string | null => {
                return null;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "createdAt",
            "Created",
            false,
            (repo: SummaryRepository): string => {
                return reformatIsoAsLocaleDate(repo.created_at);
            },
            (): string | null => {
                return null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const createdAtA = parseIsoDateToMillis(a.created_at) || 0;
                const createdAtB = parseIsoDateToMillis(b.created_at) || 0;
                return createdAtA - createdAtB;
            },
            (summary: Summary): string => {
                return `${summary.repositories.length} projects`;
            },
            (summary: Summary): string | null => {
                return summary.url;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "openIssuesCount",
            "Open issues",
            true,
            (repo: SummaryRepository): string => {
                return toLocaleString(repo.open_issues_count);
            },
            (repo: SummaryRepository): string | null => {
                return repo.open_issues_url;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const openIssuesCountA = a.open_issues_count || 0;
                const openIssuesCountB = b.open_issues_count || 0;
                return openIssuesCountA - openIssuesCountB;
            },
            (summary: Summary): string => {
                return toLocaleString(summary.total_open_issues_count);
            },
            (summary: Summary): string | null => {
                return summary.total_open_issues_url;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "openPullRequestsCount",
            "Open PRs",
            true,
            (repo: SummaryRepository): string => {
                return toLocaleString(repo.open_pull_requests_count);
            },
            (repo: SummaryRepository): string | null => {
                return repo.open_pull_requests_url;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const openPullRequestsCountA = a.open_pull_requests_count || 0;
                const openPullRequestsCountB = b.open_pull_requests_count || 0;
                return openPullRequestsCountA - openPullRequestsCountB;
            },
            (summary: Summary): string => {
                return toLocaleString(summary.total_open_pull_requests_count);
            },
            (summary: Summary): string | null => {
                return summary.total_open_pull_requests_url;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "latestReleaseVersion",
            "Release",
            false,
            (repo: SummaryRepository): string => {
                return repo.latest_release_version || "";
            },
            (repo: SummaryRepository): string | null => {
                return repo.latest_release_url || null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                let latestReleaseVersionA: string | undefined | null = a.latest_release_version;
                if (!latestReleaseVersionA) {
                    latestReleaseVersionA = null;
                }
                let latestReleaseVersionB: string | undefined | null = b.latest_release_version;
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
            (): string => {
                return "";
            },
            (): string | null => {
                return null;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "latestReleaseAt",
            "Release date",
            false,
            (repo: SummaryRepository): string => {
                return reformatIsoAsLocaleDate(repo.latest_release_at);
            },
            (): string | null => {
                return null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const latestReleaseAtA = parseIsoDateToMillis(a.latest_release_at) || 0;
                const latestReleaseAtB = parseIsoDateToMillis(b.latest_release_at) || 0;
                return latestReleaseAtA - latestReleaseAtB;
            },
            (): string => {
                return "";
            },
            (): string | null => {
                return null;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "commitsSinceRelease",
            "Commits since release",
            true,
            (repo: SummaryRepository): string => {
                return toLocaleString(repo.commits_since_release);
            },
            (repo: SummaryRepository): string | null => {
                return repo.commits_since_release_url || null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const commitsSinceReleaseA = a.commits_since_release || 0;
                const commitsSinceReleaseB = b.commits_since_release || 0;
                return commitsSinceReleaseA - commitsSinceReleaseB;
            },
            (summary: Summary): string => {
                return toLocaleString(summary.total_commits_since_release);
            },
            (): string | null => {
                return null;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "stargazersCount",
            "Stars",
            true,
            (repo: SummaryRepository): string => {
                return toLocaleString(repo.stargazers_count);
            },
            (repo: SummaryRepository): string | null => {
                return repo.stargazers_url || null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const stargazersCountA = a.stargazers_count || 0;
                const stargazersCountB = b.stargazers_count || 0;
                return stargazersCountA - stargazersCountB;
            },
            (summary: Summary): string => {
                return toLocaleString(summary.total_stargazers_count);
            },
            (): string | null => {
                return null;
            },
            () => {
                return null;
            }
    ),
    new Column(
            "downloadsCount",
            "Downloads",
            true,
            (repo: SummaryRepository): string => {
                return toLocaleString(repo.downloads_count);
            },
            (repo: SummaryRepository): string | null => {
                return repo.downloads_url || null;
            },
            (a: SummaryRepository, b: SummaryRepository): number => {
                const downloadsCountA = a.downloads_count || 0;
                const downloadsCountB = b.downloads_count || 0;
                return downloadsCountA - downloadsCountB;
            },
            (summary: Summary): string => {
                return toLocaleString(summary.total_downloads_count);
            },
            (): string | null => {
                return null;
            },
            (repo: SummaryRepository, props: SummaryTableProps) => {
                return repo.downloads_count ? (
                        <IconButton
                                onClick={() => props.onShowDownloadsChart(repo.name)}
                                className={props.classes.chartIcon}
                                disableRipple={true}>
                            <FontAwesomeIcon icon="chart-line"/>
                        </IconButton>
                ) : null;
            }
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
                    .filter((column: Column) => {
                        return column.id !== "name";
                    })
                    .map((column: Column) => {
                        const url = column.totalLinkAccessor(summary);
                        const contents = url
                                ? (<a className={classes.totalLink}
                                      href={url}>{column.totalAccessor(summary)}</a>)
                                : column.totalAccessor(summary);
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

const totalRowStyles = (theme: Theme): StyleRules => {
    return {
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
    };
};

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
            return (<div>Loading...</div>);
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
                            {sortedRepositories.map((repository: SummaryRepository) => {
                                return (
                                        <TableRow key={repository.name} className={classes.row}>
                                            {columns.map((column: Column) => {
                                                const link = column.linkAccessor(repository);
                                                const contents = link ?
                                                        (<a className={classes.bodyLink}
                                                            href={link}>{column.accessor(repository)}</a>)
                                                        : column.accessor(repository);
                                                return (
                                                        <TableCell key={column.id}
                                                                   align={column.numeric ? "right" : "left"}>
                                                            {contents}
                                                            {column.iconAccessor(repository, this.props) || ""}
                                                        </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
        );
    }
}

const styles = (theme: Theme): StyleRules => {
    return {
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
    };
};
const SummaryTable = withStyles(styles)(SummaryTableBase);

export default SummaryTable;
