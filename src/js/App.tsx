import * as React from "react";
import * as ReactDOM from "react-dom";
import { UserManagementGrid } from "./Components/Users/UserManagement/UserManagementGrid";

if ((window as any).connect == undefined) {
    (window as any).connect = {};
}
(window as any).connect.useraccess = {};

(window as any).connect.useraccess.init = (util: any, params: any) => {
    (window as any).connect.useraccess.util = util;
    (window as any).connect.useraccess.params = params;
    $('.user-access').each((i, el) => {
        ReactDOM.render(<UserManagementGrid util={util} />, el);
    });
}

(window as any).connect.useraccess.load = (params: any) => {
    (window as any).connect.useraccess.params = params;
}
