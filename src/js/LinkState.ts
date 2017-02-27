function createHandler(component: any, key: string, property: string) {
    return (e: any) => {
        const el: any = e.target;
        const value: any = el.type === 'checkbox' ? el.checked : el.value;
        var obj = component.state[key];
        obj[property] = value;
        component.setState({
            [key]: obj
        });
    };
}

export function linkState(component: any, key: string, property: string) {
    return createHandler(component, key, property);
};