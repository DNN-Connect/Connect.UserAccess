import * as React from "react";
import { IRole } from "../../../Models/Role"
import { Localization } from "../../../Localization";
import { RoleGridRow } from "./RoleGridRow";

interface IRoleGridProps {
    localization: Localization;
    roles: IRole[];
    onToggleStatus: (role: IRole, e: any) => void;
};

interface IRoleGridState { };

export class RoleGrid extends React.Component<IRoleGridProps, IRoleGridState> {

    public render(): JSX.Element {
        var rows = this.props.roles.map((item) => {
            return <RoleGridRow key={item.RoleID} role={item} onToggleStatus={(role: IRole, e: any) => this.props.onToggleStatus(role, e)} />
        });
        return (
            <table className="table table-responsive">
                <thead>
                    <tr>
                        <th>{this.props.localization.get("Role")}</th>
                        <th>{this.props.localization.get("Status")}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}
