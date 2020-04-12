import Axios, {AxiosResponse} from 'axios';
import {Summary} from '../model/Summary';
import {DownloadSnapshot} from '../model/DownloadSnapshot';

class StatsService {
  getSummary(): Promise<AxiosResponse<Summary>> {
    return Axios.get('data/summary.json');
  }

  getDownloads(): Promise<AxiosResponse<DownloadSnapshot[]>> {
    return Axios.get('data/downloads.json');
  }
}

export default new StatsService();
