package stats.service

import ext.axios.Axios
import ext.axios.AxiosResponse
import stats.model.Summary
import kotlin.js.Promise

class StatsService {

    companion object {
        fun getSummary(): Promise<AxiosResponse<Summary>> = Axios.get("data/summary.json")
    }
}
