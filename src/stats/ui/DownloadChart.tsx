import * as React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import { IDataFrame } from 'data-forge';
import Measure, { ContentRect } from 'react-measure';

const Plotly = require('plotly.js-basic-dist');
const Plot = createPlotlyComponent(Plotly);

interface DownloadChartProps {
  downloadsDf: IDataFrame;

  repositoryName: string;

  variant: 'count' | 'delta';
}

interface DownloadChartState {
  width: number;

  height: number;
}

class DownloadChart extends React.Component<
  DownloadChartProps,
  DownloadChartState
> {
  onResize = (dimensions: ContentRect) => {
    const bounds = dimensions.bounds;
    if (!bounds) {
      return;
    }
    this.setState({
      width: bounds.width,
      height: bounds.height,
    });
  };

  render(): React.ReactNode {
    const repositoryName = this.props.repositoryName;

    const variant = this.props.variant;

    const columnName =
      variant === 'count' ? 'downloads_count' : 'downloads_delta';
    const variantLabel =
      variant === 'count' ? 'Download count' : 'Downloads / day';

    const downloadsDf = this.props.downloadsDf
      .where(row => row.repository_name === repositoryName)
      .setIndex('data_at')
      .subset([columnName]);

    const data: Plotly.Data[] = [
      {
        x: downloadsDf.getIndex().toArray(),
        y: downloadsDf.getSeries(columnName).toArray(),
        type: 'scatter',
      },
    ];
    return (
      <Measure bounds onResize={this.onResize}>
        {({ measureRef }) => {
          const state: DownloadChartState = this.state || {
            width: 800,
            height: 600,
          };
          const layout: Partial<Plotly.Layout> = {
            width: state.width,
            height: state.height - 50,
            title: repositoryName,
            xaxis: { title: 'Date' },
            yaxis: { title: variantLabel },
          };
          return (
            <div ref={measureRef} style={{ height: '100%' }}>
              <Plot data={data} layout={layout} />
            </div>
          );
        }}
      </Measure>
    );
  }
}

export default DownloadChart;
