package stats.ui.summarytable

import react.RState
import stats.model.Summary

interface SummaryTableState : RState {
    var summary: Summary?
    var orderBy: String?
    var order: String?
}
