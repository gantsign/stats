import * as React from 'react';
import {
  AppBar,
  Dialog,
  IconButton,
  InputLabel,
  MenuItem,
  MuiThemeProvider,
  Select,
  Slide,
  Theme,
  Toolbar,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {TransitionProps} from '@material-ui/core/transitions';
import {DownloadSnapshot} from '../model/DownloadSnapshot';
import * as DataForge from 'data-forge';
import {IDataFrame} from 'data-forge';
import DownloadChart from './DownloadChart';
import {darkTheme} from './App';
import CloseIcon from '@material-ui/icons/Close';
import {StyleRules} from '@material-ui/core/styles';

interface DownloadsDialogProps extends WithStyles {
  repositoryName: string | null;

  downloads: DownloadSnapshot[];

  open: boolean;

  onClose?: React.ReactEventHandler<{}>;
}

interface DownloadsDialogState {
  repositoryName?: string | null;

  variant: 'count' | 'delta';
}

function DialogTransition(props: TransitionProps) {
  return <Slide direction="up" {...props} />;
}

class DownloadsDialogBase extends React.Component<DownloadsDialogProps, DownloadsDialogState> {
  componentDidMount(): void {
    this.setState({
      repositoryName: this.props.repositoryName,
      variant: 'count',
    });
  }

  componentDidUpdate(prevProps: Readonly<DownloadsDialogProps>): void {
    if (prevProps.repositoryName !== this.props.repositoryName) {
      this.setState({
        repositoryName: this.props.repositoryName,
        variant: 'count',
      });
    }
  }

  repoChanged = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const state = this.state;
    if (!state) {
      return;
    }
    const repositoryName = String(event.target.value);
    const variant = state.variant;

    this.setState({
      repositoryName,
      variant,
    });
  };

  variantChanged = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const state = this.state;
    if (!state) {
      return;
    }
    const repositoryName = state.repositoryName;
    const variant: 'count' | 'delta' = event.target.value === 'count' ? 'count' : 'delta';

    this.setState({
      repositoryName,
      variant,
    });
  };

  render(): React.ReactNode {
    const state = this.state;
    if (!state) {
      return <></>;
    }

    const downloads = this.props.downloads;

    const repositoryName = state.repositoryName || '';
    const variant = state.variant;

    const downloadsDf: IDataFrame = new DataForge.DataFrame({
      values: downloads,
    }).parseDates(['data_at']);

    const repoNames: string[] = downloadsDf
      .getSeries('repository_name')
      .distinct()
      .toArray()
      .sort((nameA: string, nameB: string): number => {
        const nameNormA = nameA.replace('_', '-');
        const nameNormB = nameB.replace('_', '-');
        return nameNormA.localeCompare(nameNormB);
      });

    const open = this.props.open;

    const classes = this.props.classes;

    return (
      <Dialog open={open} fullScreen={true} TransitionComponent={DialogTransition}>
        <AppBar position="static">
          <Toolbar>
            <MuiThemeProvider theme={darkTheme}>
              <IconButton aria-label="Close" className={classes.closeButton} onClick={this.props.onClose}>
                <CloseIcon />
              </IconButton>
              <InputLabel htmlFor="repo">Repository</InputLabel>&nbsp;
              <Select
                value={repositoryName}
                onChange={this.repoChanged}
                inputProps={{
                  name: 'repo',
                  id: 'repo',
                }}
              >
                {repoNames.map(name => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              &nbsp;&nbsp;
              <InputLabel htmlFor="variant">View</InputLabel>&nbsp;
              <Select
                value={variant}
                onChange={this.variantChanged}
                inputProps={{
                  name: 'variant',
                  id: 'variant',
                }}
              >
                <MenuItem value="count">Download count</MenuItem>
                <MenuItem value="delta">Downloads / day</MenuItem>
              </Select>
            </MuiThemeProvider>
          </Toolbar>
        </AppBar>
        {(() => {
          if (!repositoryName) {
            return <></>;
          }
          return <DownloadChart downloadsDf={downloadsDf} repositoryName={repositoryName} variant={variant} />;
        })()}
      </Dialog>
    );
  }
}

const styles = (theme: Theme): StyleRules => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});
const DownloadsDialog = withStyles(styles)(DownloadsDialogBase);

export default DownloadsDialog;
