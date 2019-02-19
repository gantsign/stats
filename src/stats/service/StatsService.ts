import Axios, {AxiosResponse} from "axios";
import {Summary} from "../model/Summary";

class StatsService {
    getSummary(): Promise<AxiosResponse<Summary>> {
        return Axios.get("data/summary.json");
    }
}

export default new StatsService();
