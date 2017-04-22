import * as React from "react";
import { Localization } from "../../../Localization";
import { DataService } from "../../../Service";

declare var require: any;
let QRCode: any = require("qrcode.react");

interface IQrCodeProps {
    localization: Localization;
};

interface IQrCodeState {
    objectToEncode: any;
};

export class QrCode extends React.Component<IQrCodeProps, IQrCodeState> {
    refs: {
        dialog: any
    }
    constructor(props: IQrCodeProps) {
        super(props);
        this.state = {
            objectToEncode: {}
        }
    }


    public show(): void {
        DataService.getMobileLink((data: any) => {
            this.setState({
                objectToEncode: data
            }, () => {
                $(this.refs.dialog).modal('show');
            });
        });
    }

    public render(): JSX.Element {
        return (
            <div className="modal fade" ref="dialog" role="dialog" aria-labelledby="cmModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="cmModalLabel">{this.props.localization.get("Mobile")}</h4>
                        </div>
                        <div className="modal-body" style={{ textAlign: "center" }}>
                            <QRCode value={JSON.stringify(this.state.objectToEncode)} size={200} level="Q" />
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
