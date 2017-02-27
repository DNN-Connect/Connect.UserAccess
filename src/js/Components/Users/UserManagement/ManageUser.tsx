import * as React from "react";
import { IUser } from "../../../Models/IUser";
import { IRole } from "../../../Models/Role";
import { IRoleGroup } from "../../../Models/RoleGroup";
import { RoleGrid } from "./RoleGrid";
import { CheckBox } from "./CheckBox";
import { Localization } from "../../../Localization";
import { DataService } from "../../../Service";

interface IManageUserProps {
    localization: Localization;
    roleGroups: IRoleGroup[];
};

interface IManageUserState {
    user: IUser,
    currentRoleGroupId: number,
    retrievingRoles: boolean,
    roles: IRole[]
};

export class ManageUser extends React.Component<IManageUserProps, IManageUserState> {
    refs: {
        dialog: any,
        txtNewPassword: any
    }
    constructor(props: IManageUserProps) {
        super(props);
        var initRoles: IRole[] = [];
        this.state = {
            user: {},
            currentRoleGroupId: -1,
            retrievingRoles: false,
            roles: initRoles
        } as IManageUserState;
    }

    public show(user: IUser): void {
        DataService.getUser(user.UserId, (data: IUser) => {
            this.setState({
                user: data,
                retrievingRoles: true
            } as IManageUserState);
            $(this.refs.dialog).modal('show');
            DataService.getRoles(user.UserId, this.state.currentRoleGroupId, (data: IRole[]) => {
                this.setState({
                    retrievingRoles: false,
                    roles: data
                } as IManageUserState);
            }, (error: any) => {
                alert(error);
                this.setState({
                    retrievingRoles: false
                } as IManageUserState);
            })
        })
    }

    setpassWord(e: any): void {
        e.preventDefault();
        if (this.refs.txtNewPassword.value == '') {
            alert(this.props.localization.get("MustEnterPassword"));
            return;
        }
        DataService.updateUserPw(this.state.user.UserId, this.refs.txtNewPassword.value, (data: any) => {
            alert(this.props.localization.get("PasswordChanged"));
            this.refs.txtNewPassword.value = '';
        }, (error: string) => {
            alert(error);
        });
    }

    toggleRoleStatus(role: IRole, e: any): void {
        DataService.setUserRole(this.state.user.UserId, role.RoleID, !role.Status, this.state.currentRoleGroupId, (data: IRole[]) => {
            this.setState({
                roles: data
            } as IManageUserState);
        }, (error: any) => {
            alert(error);
        })
    }

    toggleUserProperty(propertyName: string, newValue: boolean): void {
        DataService.setUserProperty(this.state.user.UserId, propertyName, newValue, (data: IUser) => {
            this.setState({
                user: data
            } as IManageUserState);
        });
    }

    changeRoleGroup(e: HTMLSelectElement) {
        var newGroupId = parseInt(e.options[e.selectedIndex].value);
        this.setState({
            retrievingRoles: true
        } as IManageUserState, () => {
            DataService.getRoles(this.state.user.UserId, newGroupId, (data: IRole[]) => {
                this.setState({
                    retrievingRoles: false,
                    roles: data,
                    currentRoleGroupId: newGroupId
                } as IManageUserState);
            }, (error: any) => {
                alert(error);
                this.setState({
                    retrievingRoles: false
                } as IManageUserState);
            })
        });
    }

    public render(): JSX.Element {
        var roles: JSX.Element = (<span></span>);
        if (this.state.retrievingRoles) {
            roles = (
                <div>{this.props.localization.get("RetrievingData")}</div>
            );
        } else {
            roles = (
                <RoleGrid localization={this.props.localization}
                    roles={this.state.roles}
                    onToggleStatus={(role: IRole, e: any) => this.toggleRoleStatus(role, e)} />
            );
        }
        var groupDropdownOptions = this.props.roleGroups.map((item) => {
            return (
                <option value={item.RoleGroupID} key={item.RoleGroupID}>{item.RoleGroupName}</option>
            )
        });
        var groupDropdown: JSX.Element = <span />;
        if (this.props.roleGroups.length > 2) {
            groupDropdown = (
                <div className="row">
                    <div className="col-sm-12">
                        <select className="form-control"
                            value={this.state.currentRoleGroupId}
                            onChange={e => this.changeRoleGroup(e.target as HTMLSelectElement)}>
                            {groupDropdownOptions}
                        </select>
                    </div>
                </div>
            );
        }
        return (
            <div className="modal fade" ref="dialog" role="dialog" aria-labelledby="cmModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="cmModalLabel">{this.state.user.DisplayName}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-inline">
                                        <div className="form-group">
                                            <input type="text" className="form-control" ref="txtNewPassword" placeholder={this.props.localization.get("NewPassword")} width="300" />
                                        </div>
                                        <div className="form-group">&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <button type="submit" className="btn btn-default" onClick={this.setpassWord.bind(this)}>{this.props.localization.get("SetPassword")}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <dl className="dl-horizontal">
                                        <dt>Username</dt>
                                        <dd>{this.state.user.Username}</dd>
                                        <dt>Email</dt>
                                        <dd>{this.state.user.Email}</dd>
                                        <dt>Authorised</dt>
                                        <dd>
                                            <CheckBox propertyName="Authorised"
                                                value={this.state.user.Authorised}
                                                onClick={(prop: string, val: boolean) => this.toggleUserProperty(prop, val)} />
                                        </dd>
                                        <dt>Deleted</dt>
                                        <dd>
                                            <CheckBox propertyName="IsDeleted"
                                                value={this.state.user.IsDeleted}
                                                onClick={(prop: string, val: boolean) => this.toggleUserProperty(prop, val)} />
                                        </dd>
                                        <dt>Locked Out</dt>
                                        <dd>
                                            <CheckBox propertyName="LockedOut"
                                                value={this.state.user.LockedOut}
                                                stableValue={false}
                                                onClick={(prop: string, val: boolean) => this.toggleUserProperty(prop, val)} />
                                        </dd>
                                        <dt>UpdatePassword</dt>
                                        <dd>
                                            <CheckBox propertyName="UpdatePassword"
                                                value={this.state.user.UpdatePassword}
                                                onClick={(prop: string, val: boolean) => this.toggleUserProperty(prop, val)} />
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                            {groupDropdown}
                            {roles}
                        </div>
                        <div className="modal-footer">
                            <a href="#" id="cmdManageUserCancel" className="btn btn-default" data-dismiss="modal">{this.props.localization.get("Close")}</a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
