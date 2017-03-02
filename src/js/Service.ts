export class DataService {
    constructor() {
    };
    static getServiceFramework(controller: string): any {
        let sf = (window as any).connect.useraccess.util.sf;
        sf.moduleRoot = "PersonaBar";
        sf.controller = controller;
        return sf;
    }
    public static getRoleGroups(success: Function, fail?: Function): void {
        const sf = this.getServiceFramework("UserAccess");
        sf.get("RoleGroups", {}, success, fail);
    }
    public static getRoles(userId: number, roleGroupId: number, success: Function, fail?: Function): void {
        const sf = this.getServiceFramework("UserAccess");
        sf.get("Roles", { userId: userId, roleGroupId: roleGroupId }, success, fail);
    }
    public static getUser(userId: number, success: Function, fail?: Function): void {
        const sf = this.getServiceFramework("UserAccess");
        sf.get("GetUser", { userId: userId }, success, fail);
    }
    public static resetPw(userId: number, success: Function, fail?: Function) {
        const sf = this.getServiceFramework("UserAccess");
        sf.post("ResetPw", { userId: userId }, success, fail);
    }
	public static searchUsers(searchText: string, orderByField: string, sortOrder: string, pageIndex: number, pageSize: number, success: Function, fail?: Function): void {
        const sf = this.getServiceFramework("UserAccess");
        sf.get("Search", { searchText: searchText, orderByField: orderByField, sortOrder: sortOrder, pageIndex: pageIndex, pageSize: pageSize }, success, fail);
	}
    public static setUserProperty(userId: number, propertyName: string, newValue: boolean, success: Function, fail?: Function): void {
        const sf = this.getServiceFramework("UserAccess");
        sf.post("UserProperty", { userId: userId, propertyName: propertyName, newValue: newValue }, success, fail);
    }
    public static setUserRole(userId: number, roleId: number, value: boolean, roleGroupId: number, success: Function, fail?: Function) {
        const sf = this.getServiceFramework("UserAccess");
        sf.post("UserRole", { userId: userId, roleId: roleId, value: value, roleGroupId: roleGroupId }, success, fail);
    }
    public static updateUserPw(userId: number, newPw: string, success: Function, fail?: Function) {
        const sf = this.getServiceFramework("UserAccess");
        sf.post("SetPw", { userId: userId, npw: newPw }, success, fail);
    }
}
