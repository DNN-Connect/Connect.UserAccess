import * as React from "react";
import { linkState } from "../LinkState";
import { DataService } from "../Service";

interface IMyComponentProps {};

interface IMyComponentState {};

export class MyComponent extends React.Component<IMyComponentProps, IMyComponentState> {
    public render(): JSX.Element {
        return (<span>Body</span>);
    }
}
