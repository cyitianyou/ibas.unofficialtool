/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace ui {
        export namespace c {
            export class RemoteConfigView extends ibas.DialogView {
                private dialog: sap.m.Dialog;
                draw(): any {
                    let that: this = this;
                    this.dialog = new sap.m.Dialog("", {
                        title: ibas.i18n.prop("shell_confirm"),
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: false,
                        verticalScrolling: false,
                        content: [
                            new sap.ui.layout.form.SimpleForm("", {
                                editable: true,
                                content: [
                                    new sap.m.Toolbar("", { visible: false }),
                                ]
                            })
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_confirm"),
                                press: function (oEvent: sap.ui.base.Event): void {
                                    that.dialog.close();
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.dialog.close();
                                }
                            })
                        ]
                    });
                    return this.dialog;
                }

            }
        }
    }
}