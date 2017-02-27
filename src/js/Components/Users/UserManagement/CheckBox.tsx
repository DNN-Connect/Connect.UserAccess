import * as React from "react";

interface ICheckBoxProps {
    propertyName: string;
    value: boolean;
    onClick: (property: string, value: boolean) => void;
    stableValue?: boolean;
};

interface ICheckBoxState { };

export class CheckBox extends React.Component<ICheckBoxProps, ICheckBoxState> {
    private clicked(e: any): void {
        if (this.props.stableValue == undefined || this.props.stableValue != this.props.value) {
            this.props.onClick(this.props.propertyName, !this.props.value)
        }
    }
    public render(): JSX.Element {
        var chkBoxClass = "glyphicon glyphicon-";
        chkBoxClass += this.props.value ? "check" : "unchecked";
        var style = {};
        if (this.props.stableValue == undefined || this.props.stableValue != this.props.value) {
            style = {
                cursor: "pointer"
            };
        }
        return (
            <span style={style} onClick={e => this.clicked(e)}>
                <i className={chkBoxClass} />
            </span>
        );
    }
}
