export class Localization {
    private util: any;
    constructor(dnnUtilities: any) {
        this.util = dnnUtilities;
    }
    get(key: string) {
        let moduleName = "UserAccess";
        return this.util.getResx(moduleName, key);
    }
}
