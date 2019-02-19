import React, {Component} from 'react';
import SummaryTable from "./summarytable/SummaryTable";
import {createMuiTheme} from "@material-ui/core";

class App extends Component {
    render() {
        return <SummaryTable/>;
    }
}

export const darkTheme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

export const parseIsoDateToMillis = (value: string | null | undefined): number | null => {
    if (!value) {
        return null;
    }
    return Date.parse(value);
};

export const reformatIsoAsLocaleDate = (value: string | null | undefined): string => {
    if (!value) {
        return "";
    }
    return new Date(value).toLocaleDateString();
};

export const reformatIsoAsLocaleDatetime = (value: string | null | undefined): string => {
    if (!value) {
        return "";
    }
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const toLocaleString = (value: number | null | undefined): string => {
    if (value == null || value === undefined) {
        return "";
    }
    return value.toLocaleString();
};

export default App;
