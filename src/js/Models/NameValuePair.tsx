export interface INameValuePair {
    Name: string,
    Value: string
}

export class NameValuePair implements INameValuePair {
    Name: string;
    Value: string;
    constructor(name: string, value: string) {
        this.Name = name;
        this.Value = value;
    }
}