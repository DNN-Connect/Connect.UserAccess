import * as React from "react";

interface IPagerProps {
    pagerSize: number;
    currentPage: number;
    totalPages: number;
    changePage: (pageNr: number, e: any) => void;
};

interface IPagerState { };

export class Pager extends React.Component<IPagerProps, IPagerState> {
    constructor(props: IPagerProps) {
        super(props);
    }
    public render(): JSX.Element {
        var nr: number = this.props.pagerSize;
        var brkt: number = Math.floor((nr - 1) / 2);
        var tot: number = this.props.totalPages;
        var crt: number = this.props.currentPage + 1;
        var pageNrs: number[] = [];
        if (tot < 2) { return (<span />); }
        if (tot < nr + 1) {
            for (var i = 1; i < tot + 1; i++) {
                pageNrs.push(i);
            }
        }
        else if (crt < brkt + 1) {
            for (var i = 1; i < nr + 1; i++) {
                pageNrs.push(i);
            }
        }
        else if (tot - crt < brkt + 1) {
            for (var i = tot - nr + 1; i < tot + 1; i++) {
                pageNrs.push(i);
            }
        }
        else {
            for (var i = crt - brkt; i < crt + brkt + 1; i++) {
                pageNrs.push(i);
            }
        }
        var pages = pageNrs.map((item) => {
            return (
                <li className={(item == crt) ? "active" : ""} key={item.toString()}>
                    <a href="#" onClick={this.props.changePage.bind(null, item - 1)}>{item}</a>
                </li>
            );
        });
        return (
            <ul className="right pagination">
                <li className={(pageNrs[0] == 1) ? "disabled" : ""}>
                    <a href="#" aria-label="First" onClick={this.props.changePage.bind(null, 0)}>
                        <span aria-hidden="true" className="glyphicon glyphicon-fast-backward"></span>&nbsp;
                      </a>
                </li>
                <li className={(crt == 1) ? "disabled" : ""}>
                    <a href="#" aria-label="Previous" onClick={this.props.changePage.bind(null, crt - 2)}>
                        <span aria-hidden="true" className="glyphicon glyphicon-backward"></span>&nbsp;
                    </a>
                </li>
                {pages}
                <li className={(crt == tot) ? "disabled" : ""}>
                    <a href="#" aria-label="Next" onClick={this.props.changePage.bind(null, crt)}>
                        <span aria-hidden="true" className="glyphicon glyphicon-forward"></span>&nbsp;
                    </a>
                </li>
                <li className={(pageNrs[pageNrs.length - 1] == tot) ? "disabled" : ""}>
                    <a href="#" aria-label="Last" onClick={this.props.changePage.bind(null, tot - 1)}>
                        <span aria-hidden="true" className="glyphicon glyphicon-fast-forward"></span>&nbsp;
                    </a>
                </li>
            </ul>
        );
    }
}

