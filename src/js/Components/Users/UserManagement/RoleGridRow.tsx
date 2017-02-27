import * as React from "react";
import { IRole } from "../../../Models/Role";

interface IRoleGridRowProps {
    role: IRole;
    onToggleStatus: (role: IRole, e: any) => void;
};

interface IRoleGridRowState { };

export class RoleGridRow extends React.Component<IRoleGridRowProps, IRoleGridRowState> {
    public render(): JSX.Element {
        var style = {
            color: "#333",
            cursor: "pointer"
        };
        var chkBoxClass = "glyphicon glyphicon-";
        chkBoxClass += this.props.role.Status ? "check" : "unchecked";
        return (
            <tr>
                <td>{this.props.role.RoleName}</td>
                <td style={style} onClick={(e: any) => this.props.onToggleStatus(this.props.role, e)}>
                    <span>
                        <i className={chkBoxClass} />
                    </span>
                </td>
            </tr>
        );
    }
}
