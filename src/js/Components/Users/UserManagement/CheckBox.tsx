import * as React from "react";

interface ICheckBoxProps {
    propertyName: string;
    value: boolean;
    onClick: (property: string, value: boolean) => void;
    stableValue?: boolean;
};

interface ICheckBoxState {
    updating: boolean;
};

export class CheckBox extends React.Component<ICheckBoxProps, ICheckBoxState> {
    constructor(props: ICheckBoxProps) {
        super(props);
        this.state = {
            updating: false
        };
    }
    private clicked(e: any): void {
        if ((this.props.stableValue == undefined || this.props.stableValue != this.props.value) && !this.state.updating) {
            this.setState({
                updating: true
            }, () => {
                this.props.onClick(this.props.propertyName, !this.props.value)
            });
        }
    }
    public componentWillReceiveProps(nextProps: ICheckBoxProps): void {
        this.setState({
            updating: false
        });
    }
    public render(): JSX.Element {
        var chkBoxClass = "glyphicon glyphicon-";
        if (this.state.updating) {
            chkBoxClass += "refresh";
        } else {
            chkBoxClass += this.props.value ? "check" : "unchecked";
        }
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
