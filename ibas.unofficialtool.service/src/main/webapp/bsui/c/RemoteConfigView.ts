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
                /** 设置事件 */
                configEvent: Function;
                private dialog: sap.m.Dialog;
                draw(): any {
                    let that: this = this;
                    this.dialog = new sap.m.Dialog("", {
                        title: this.application.description,
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
                                    new sap.m.Label("", { text: ibas.i18n.prop("unofficialtool_ui_config_url") }),
                                    new sap.extension.m.Input("", {
                                    }).bindProperty("bindingValue", {
                                        path: "url",
                                        type: new sap.extension.data.Alphanumeric({
                                        })
                                    }).bindProperty("editable", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_username")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {
                                    }).bindProperty("bindingValue", {
                                        path: "userName",
                                        type: new sap.extension.data.Alphanumeric({
                                        })
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_password")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {
                                        type: sap.m.InputType.Password
                                    }).bindProperty("bindingValue", {
                                        path: "password",
                                        type: new sap.extension.data.Alphanumeric({
                                        })
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_token")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return !ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "token",
                                        type: new sap.extension.data.Alphanumeric({
                                        })
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data: string): boolean {
                                            return !ibas.strings.isEmpty(data);
                                        }
                                    }),
                                ]
                            })
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_reset"),
                                press: function (oEvent: sap.ui.base.Event): void {
                                    ibas.config.set(app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "");
                                    that.showConfig();
                                }
                            }).bindProperty("visible", {
                                path: "token",
                                formatter(data: string): boolean {
                                    return !ibas.strings.isEmpty(data);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_confirm"),
                                press: function (oEvent: sap.ui.base.Event): void {
                                    let data: {
                                        url: string,
                                        userName: string,
                                        password: string,
                                        token: string
                                    } = that.dialog.getBindingContext().getObject();
                                    that.fireViewEvents(that.configEvent, data);
                                }
                            }).bindProperty("visible", {
                                path: "token",
                                formatter(data: string): boolean {
                                    return ibas.strings.isEmpty(data);
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
                /** 显示视图 */
                showConfig(): void {
                    let data: {
                        url: string,
                        userName: string,
                        password: string,
                        token: string
                    } = {
                        url: ibas.config.get(app.CONFIG_ITEM_REMOTE_SYSTEM_URL, ""),
                        userName: "",
                        password: "",
                        token: ibas.config.get(app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "")
                    };
                    this.dialog.setModel(new sap.ui.model.json.JSONModel(data));
                    this.dialog.bindObject("/");
                }
            }
        }
    }
}