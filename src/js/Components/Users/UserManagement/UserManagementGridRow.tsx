import * as React from "react";
import { IUser } from "../../../Models/IUser";

interface IUserManagementGridRowProps {
    User: IUser;
    key: string;
    OnManageUser: (user: IUser, e: any) => void;
};

interface IUserManagementGridRowState { };

export class UserManagementGridRow extends React.Component<IUserManagementGridRowProps, IUserManagementGridRowState> {
    public render(): JSX.Element {
        return (
            <tr>
                <td>{this.props.User.UserId}</td>
                <td>{this.props.User.FirstName}</td>
                <td>{this.props.User.LastName}</td>
                <td>{this.props.User.DisplayName}</td>
                <td>{this.props.User.Email}</td>
                <td>{this.props.User.Username}</td>
                <td>
                    <a onClick={e => this.props.OnManageUser(this.props.User, e)} className="btn btn-sm btn-default">
                        <span className="glyphicon glyphicon-list-alt"></span>&nbsp;
                    </a>
                </td>
            </tr>
        );
    }
}
