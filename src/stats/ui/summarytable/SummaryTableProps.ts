import {Summary} from "../../model/Summary";

export interface SummaryTableProps {

    summary: Summary;

    classes: any;

    onShowDownloadsChart: (repositoryName: string) => void;
}
