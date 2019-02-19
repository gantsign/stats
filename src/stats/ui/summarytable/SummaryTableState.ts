import {Summary} from "../../model/Summary";
import {SortDirection} from "@material-ui/core/TableCell";

export interface SummaryTableState {
    summary?: Summary;
    orderBy?: string;
    order?: SortDirection;
}
