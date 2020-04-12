import React, {Suspense} from 'react';
import {createMuiTheme} from '@material-ui/core';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChartLine} from '@fortawesome/free-solid-svg-icons';
import {AxiosResponse} from 'axios';
import {Summary} from '../model/Summary';
import StatsService from '../service/StatsService';
import {DownloadSnapshot} from '../model/DownloadSnapshot';

const SummaryTable = React.lazy(() => import('./SummaryTable'));
const DownloadsDialog = React.lazy(() => import('./DownloadsDialog'));

library.add(faChartLine);

interface AppState {
  summary?: Summary | null;

  downloads?: DownloadSnapshot[];

  showDownloadChart?: boolean;

  repositoryName?: string;

  errorMessage?: string;
}

class App extends React.Component<{}, AppState> {
  componentDidMount(): void {
    (async () => {
      const summaryPromise = StatsService.getSummary();
      const downloadsPromise = StatsService.getDownloads();

      const summaryResponse: AxiosResponse<Summary> = await summaryPromise;
      if (summaryResponse.status !== 200) {
        console.log(
          `Summary request failed: [${summaryResponse.status} ${summaryResponse.statusText}] ${summaryResponse.data}`
        );
        this.setState({
          errorMessage: 'Unable to access repository data, please try again later.',
        });
        return;
      }

      const downloadsResponse: AxiosResponse<DownloadSnapshot[]> = await downloadsPromise;
      if (downloadsResponse.status !== 200) {
        console.log(
          `Downloads request failed: [${downloadsResponse.status} ${downloadsResponse.statusText}] ${downloadsResponse.data}`
        );
        this.setState({
          errorMessage: 'Unable to access repository data, please try again later.',
        });
        return;
      }

      this.setState({
        summary: summaryResponse.data,
        downloads: downloadsResponse.data,
      });
    })();
  }

  showChart = (repositoryName: string) => {
    console.log(repositoryName);
    const state = this.state;
    const summary = state ? state.summary : null;
    const downloads = state ? state.downloads : [];

    this.setState({
      downloads,
      summary,
      showDownloadChart: true,
      repositoryName,
    });
  };

  dialogClosed = () => {
    const state = this.state;
    const summary = state ? state.summary : null;
    const downloads = state ? state.downloads : [];
    const repositoryName = state.repositoryName;

    this.setState({
      downloads,
      summary,
      showDownloadChart: false,
      repositoryName,
    });
  };

  render() {
    const state = this.state;
    if (!state) {
      return <div>Loading...</div>;
    }
    const errorMessage = state.errorMessage;
    if (errorMessage) {
      return <div>{errorMessage}</div>;
    }
    const summary = state.summary || null;
    const downloads = state.downloads || [];
    if (!summary) {
      return <div>Loading...</div>;
    }

    const repositoryName = state.repositoryName || null;
    const showDownloadChart = state.showDownloadChart || false;

    return (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <SummaryTable summary={summary} onShowDownloadsChart={repositoryName => this.showChart(repositoryName)} />
        </Suspense>
        <Suspense fallback={<></>}>
          <DownloadsDialog
            open={showDownloadChart}
            downloads={downloads}
            repositoryName={repositoryName}
            onClose={this.dialogClosed}
          />
        </Suspense>
      </>
    );
  }
}

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export const parseIsoDateToMillis = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }
  return Date.parse(value);
};

export const reformatIsoAsLocaleDate = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }
  return new Date(value).toLocaleDateString();
};

export const reformatIsoAsLocaleDatetime = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const toLocaleString = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return value.toLocaleString();
};

export default App;
