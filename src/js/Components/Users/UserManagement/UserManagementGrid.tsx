import * as React from "react";
import { IGridColumn } from "../../IGridColumn";
import { GridHeader } from "../../Generic/Grids/GridHeader";
import { Pager } from "../../Generic/Grids/Pager";
import { IUser } from "../../../Models/IUser";
import { IRole } from "../../../Models/Role";
import { IRoleGroup } from "../../../Models/RoleGroup";
import { UserManagementGridRow } from "./UserManagementGridRow";
import { ManageUser } from "./ManageUser";
import { DataService } from "../../../Service";
import { Localization } from "../../../Localization";

interface IUserManagementGridProps {
    util: any
};

interface IUserManagementGridState {
    nrRecords: number;
    currentPage: number;
    pageSize: number;
    data: IUser[];
    columns: IGridColumn[];
    sortColumn: string;
    sortOrder: string;
    searchText: string;
    searchTextChanged: boolean;
    roleGroups: IRoleGroup[];
};

export class UserManagementGrid extends React.Component<IUserManagementGridProps, IUserManagementGridState> {
    private pageSizes: number[] = [2, 5, 10, 25, 50];
    private service: DataService = new DataService();
    private localization: Localization = new Localization(this.props.util);
    refs: {
        ddPageSize: any;
        txtSearch: any;
        manageDialog: ManageUser;
    }
    constructor(props: IUserManagementGridProps) {
        super(props);
        this.state = {
            nrRecords: 0,
            currentPage: 0,
            pageSize: 10,
            data: [],
            columns: [
                { name: "UserId", visible: true, sortable: true, width: 70, showHeader: true },
                { name: "FirstName", visible: true, sortable: true, width: 100, showHeader: true },
                { name: "LastName", visible: true, sortable: true, width: 100, showHeader: true },
                { name: "DisplayName", visible: true, sortable: true, showHeader: true },
                { name: "Email", visible: true, sortable: true, width: 100, showHeader: true },
                { name: "Username", visible: true, sortable: true, width: 150, showHeader: true },
                { name: "onmanage", visible: true, sortable: false, width: 40, showHeader: false },
            ],
            sortColumn: "LastName",
            sortOrder: "asc",
            searchText: "",
            searchTextChanged: false,
            roleGroups: []
        }
        DataService.searchUsers(this.state.searchText, this.state.sortColumn, this.state.sortOrder, 0, this.state.pageSize, (data: any) => {
            this.setState({
                currentPage: 0,
                data: data.data,
                nrRecords: data.TotalCount
            } as IUserManagementGridState);
        });
        DataService.getRoleGroups((data: IRoleGroup[]) => {
            if (data.length > 0) {
                data.unshift({
                    RoleGroupID: -1,
                    RoleGroupName: "Global Roles"
                });
                data.unshift({
                    RoleGroupID: -2,
                    RoleGroupName: "All Roles"
                });
            }
            this.setState({
                roleGroups: data
            } as IUserManagementGridState);
        });
    }

    sortHeader(columnName: string, sortDirection: string): void {
        DataService.searchUsers(this.state.searchText, columnName, sortDirection, 0, this.state.pageSize, (data: any) => {
            this.setState({
                sortColumn: columnName,
                sortOrder: sortDirection,
                data: data.data
            } as IUserManagementGridState);
        });
    }

    changePageSize(): void {
        var el = this.refs.ddPageSize;
        var newSize = parseInt(el.options[el.selectedIndex].value);
        DataService.searchUsers(this.state.searchText, this.state.sortColumn, this.state.sortOrder, 0, newSize, (data: any) => {
            this.setState({
                pageSize: newSize,
                currentPage: 0,
                data: data.data
            } as IUserManagementGridState);
        });
    }

    search(): void {
        var txt = this.state.searchText;
        DataService.searchUsers(txt, this.state.sortColumn, this.state.sortOrder, 0, this.state.pageSize, (data: any) => {
            this.setState({
                currentPage: 0,
                data: data.data,
                nrRecords: data.TotalCount,
                searchText: txt,
                searchTextChanged: false
            } as IUserManagementGridState);
        });
    }

    onClearSearch(e: any): void {
        this.setState({
            searchText: ""
        } as IUserManagementGridState);
        DataService.searchUsers("", this.state.sortColumn, this.state.sortOrder, 0, this.state.pageSize, (data: any) => {
            this.setState({
                currentPage: 0,
                data: data.data,
                nrRecords: data.TotalCount,
                searchText: "",
                searchTextChanged: false
            } as IUserManagementGridState);
        });
    }

    onSearchTextChange() {
        this.setState({
            searchText: this.refs.txtSearch.value,
            searchTextChanged: true
        } as IUserManagementGridState);
    }

    changePage(pageNr: number, e: any) {
        e.preventDefault();
        DataService.searchUsers(this.state.searchText, this.state.sortColumn, this.state.sortOrder, pageNr, this.state.pageSize, (data: any) => {
            this.setState({
                currentPage: pageNr,
                data: data.data
            } as IUserManagementGridState);
        });
    }

    onManageUser(user: IUser, e: any): void {
        e.preventDefault();
        this.refs.manageDialog.show(user);
    }

    public componentDidUpdate(s1: IUserManagementGridState, s2: IUserManagementGridState, s3: IUserManagementGridState): void {
        if (this.state.searchTextChanged) {
            this.search();
        }
    }

    public render(): JSX.Element {
        var rows = this.state.data.map((user: IUser) => {
            return <UserManagementGridRow User={user} key={user.UserId.toString()}
                OnManageUser={(user: IUser, e:any) => this.onManageUser(user, e)} />;
        });
        var that = this;
        var headers = this.state.columns.map((item) => {
            return (item.visible) ? <GridHeader header={item} key={item.name} localization={this.localization}
                sortColumn={this.state.sortColumn} sortOrder={this.state.sortOrder} sortHeader={this.sortHeader.bind(this)} /> : null;
        });
        var ddSizes = this.pageSizes.map((item) => {
            return <option value={item.toString()} key={item.toString()} selected>{item}</option>;
        });
        var nrPages = Math.floor(this.state.nrRecords / this.state.pageSize) + 1;
        var searchBoxStyle = {
            height: "auto"
        };
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-12 col-sm-4 form-inline">
                        <div className="form-group">
                            <label>{this.localization.get("DisplayRows")}</label>&nbsp;
                            <select className="form-control" 
                                    onChange={this.changePageSize.bind(this)} 
                                    value={this.state.pageSize}
                                    ref="ddPageSize">
                                {ddSizes}
                            </select>
                        </div>
                        <div className="form-group">
                            &nbsp;&nbsp;
                        </div>
                        <div className="form-group">
                            <label>{this.localization.get("Total")}</label>&nbsp;
                            <span>{this.state.nrRecords}</span>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 form-inline">
                        <div className="form-group">
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder={this.localization.get("Search")}
                                ref="txtSearch" onChange={this.onSearchTextChange.bind(this)}
                                style={searchBoxStyle} value={this.state.searchText} />
                            <span className="input-group-btn">
                                <button type="button" className="btn btn-default" onClick={this.onClearSearch.bind(this)}>
                                    <span className="glyphicon glyphicon-remove"></span>&nbsp;
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <table className="table formamed-table">
                            <thead>
                                <tr>
                                    {headers}
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Pager pagerSize={7}
                            currentPage={this.state.currentPage}
                            totalPages={nrPages}
                            changePage={this.changePage.bind(this)} />
                    </div>
                </div>
                <ManageUser localization={this.localization}
                     roleGroups={this.state.roleGroups} ref="manageDialog" />
            </div>
        );
    }
}
