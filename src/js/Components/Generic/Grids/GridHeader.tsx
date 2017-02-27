import * as React from "react";
import { IGridColumn } from "../../IGridColumn";
import { Localization } from "../../../Localization";

interface IGridHeaderProps {
    header: IGridColumn;
    localization: Localization;
    key: string;
    sortColumn: string;
    sortOrder: string;
    sortHeader: (columnName: string, sortDirection: string) => void;
};

interface IGridHeaderState { };

export class GridHeader extends React.Component<IGridHeaderProps, IGridHeaderState> {
    constructor(props: IGridHeaderProps) {
        super(props);
    }
    sortHeader() {
        if (this.props.header.sortable) {
            var direction = (this.props.sortColumn == this.props.header.name && this.props.sortOrder == "asc") ? "desc" : "asc";
            this.props.sortHeader(this.props.header.name, direction);
        }
    }
    public render(): JSX.Element {
        var sortIcon: JSX.Element = (<span />);
        if (this.props.header.sortable) {
            var classnames = "pull-right glyphicon";
            if (this.props.sortColumn == this.props.header.name) {
                classnames += (this.props.sortOrder == "desc") ? " glyphicon-menu-up" : " glyphicon-menu-down";
            } else {
                classnames += " unsorted";
            }
            sortIcon = <span className={classnames}></span>;
        }
        var style: any = {};
        if (this.props.header.width != undefined) {
            style.width = this.props.header.width + 'px';
        }
        var headText = this.props.header.showHeader ? this.props.localization.get(this.props.header.name) : null;
        return (
            <th className={this.props.header.sortable ? "clickable" : ""} onClick={this.sortHeader.bind(this)} style={style}>
                {headText}&nbsp;
       {sortIcon}
            </th>
        );

    }
}

