var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            class RemoteConfigView extends ibas.DialogView {
                draw() {
                    let that = this;
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
                                    new sap.extension.m.Input("", {}).bindProperty("bindingValue", {
                                        path: "url",
                                        type: new sap.extension.data.Alphanumeric({})
                                    }).bindProperty("editable", {
                                        path: "token",
                                        formatter(data) {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_username")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {}).bindProperty("bindingValue", {
                                        path: "userName",
                                        type: new sap.extension.data.Alphanumeric({})
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_password")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {
                                        type: sap.m.InputType.Password
                                    }).bindProperty("bindingValue", {
                                        path: "password",
                                        type: new sap.extension.data.Alphanumeric({})
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.m.Label("", {
                                        text: ibas.i18n.prop("unofficialtool_ui_config_token")
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return !ibas.strings.isEmpty(data);
                                        }
                                    }),
                                    new sap.extension.m.Input("", {
                                        editable: false,
                                    }).bindProperty("bindingValue", {
                                        path: "token",
                                        type: new sap.extension.data.Alphanumeric({})
                                    }).bindProperty("visible", {
                                        path: "token",
                                        formatter(data) {
                                            return !ibas.strings.isEmpty(data);
                                        }
                                    }),
                                ]
                            })
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_reset"),
                                press: function (oEvent) {
                                    ibas.config.set(unofficialtool.app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "");
                                    that.showConfig();
                                }
                            }).bindProperty("visible", {
                                path: "token",
                                formatter(data) {
                                    return !ibas.strings.isEmpty(data);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_confirm"),
                                press: function (oEvent) {
                                    let data = that.dialog.getBindingContext().getObject();
                                    that.fireViewEvents(that.configEvent, data);
                                }
                            }).bindProperty("visible", {
                                path: "token",
                                formatter(data) {
                                    return ibas.strings.isEmpty(data);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press: function () {
                                    that.dialog.close();
                                }
                            })
                        ]
                    });
                    return this.dialog;
                }
                /** 显示视图 */
                showConfig() {
                    let data = {
                        url: ibas.config.get(unofficialtool.app.CONFIG_ITEM_REMOTE_SYSTEM_URL, ""),
                        userName: "",
                        password: "",
                        token: ibas.config.get(unofficialtool.app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "")
                    };
                    this.dialog.setModel(new sap.ui.model.json.JSONModel(data));
                    this.dialog.bindObject("/");
                }
            }
            c.RemoteConfigView = RemoteConfigView;
        })(c = ui.c || (ui.c = {}));
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
        let c;
        (function (c_1) {
            /**
             * 视图-系统权限配置
             */
            class PrivilegeConfigView extends ibas.BOQueryViewWithPanel {
                /** 返回查询的对象 */
                get queryTarget() {
                    return initialfantasy.bo.Organization;
                }
                get fetchDataEvent() {
                    return this.fetchRolesEvent;
                }
                set fetchDataEvent(value) {
                    this.fetchRolesEvent = value;
                }
                /** 绘制视图 */
                draw() {
                    let that = this;
                    this.tableRoles = new sap.extension.m.List("", {
                        chooseType: ibas.emChooseType.SINGLE,
                        growingThreshold: sap.extension.table.visibleRowCount(15),
                        mode: sap.m.ListMode.SingleSelectMaster,
                        items: {
                            path: "/rows",
                            template: new sap.m.ObjectListItem("", {
                                title: "{name}",
                                firstStatus: new sap.m.ObjectStatus("", {
                                    text: {
                                        path: "activated",
                                        formatter(value) {
                                            if (value === ibas.emYesNo.YES) {
                                                return ibas.i18n.prop("shell_available");
                                            }
                                            return ibas.i18n.prop("shell_unavailable");
                                        }
                                    },
                                    state: {
                                        path: "activated",
                                        formatter(data) {
                                            return data === ibas.emYesNo.YES ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Warning;
                                        }
                                    },
                                }),
                                attributes: [
                                    new sap.m.ObjectAttribute("", {
                                        text: "{code}"
                                    }),
                                ]
                            })
                        },
                        selectionChange() {
                            that.fireFetchPrivilegesEvent();
                        },
                        nextDataSet(event) {
                            // 查询下一个数据集
                            let data = event.getParameter("data");
                            if (ibas.objects.isNull(data)) {
                                return;
                            }
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        },
                    });
                    this.pageRoles = new sap.m.Page("", {
                        showHeader: false,
                        content: [
                            this.tableRoles
                        ],
                        floatingFooter: true,
                        footer: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("bo_identityprivilege"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://edit",
                                    press: function () {
                                        let role = that.tableRoles.getSelecteds().firstOrDefault();
                                        let platform = that.selectPlatforms.getSelectedKey();
                                        that.fireViewEvents(that.editIdentityPrivilegesEvent, role, platform);
                                    }
                                }),
                            ]
                        }),
                    });
                    this.tablePrivileges = new sap.ui.table.TreeTable("", {
                        expandFirstLevel: true,
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        rowActionCount: 2,
                        selectionMode: sap.ui.table.SelectionMode.Single,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_ITEM_TABLE_VISIBLE_ROW_COUNT, 10),
                        visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Fixed,
                        rows: {
                            path: "/",
                            parameters: {
                                arrayNames: [
                                    "privileges"
                                ]
                            }
                        },
                        rowSettingsTemplate: new sap.ui.table.RowSettings("", {}).bindProperty("highlight", {
                            path: "isDirty",
                            formatter(value) {
                                if (!!value) {
                                    return sap.ui.core.MessageType.Warning;
                                }
                                else {
                                    return sap.ui.core.MessageType.Information;
                                }
                            }
                        }),
                        columns: [
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_moduleid"),
                                template: new sap.extension.m.Text("", {
                                    tooltip: {
                                        path: "moduleId"
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "moduleId",
                                    formatter(data) {
                                        return ibas.i18n.prop(data);
                                    }
                                }),
                            }),
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_target"),
                                width: "16rem",
                                template: new sap.extension.m.Text("", {
                                    tooltip: {
                                        path: "target"
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "target",
                                    formatter(data) {
                                        if (ibas.strings.isEmpty(data)) {
                                            return data;
                                        }
                                        return ibas.i18n.prop(data);
                                    }
                                }),
                            }),
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_applicationelement_elementtype"),
                                width: "8rem",
                                template: new sap.extension.m.Text("", {}).bindProperty("bindingValue", {
                                    path: "type",
                                    type: new sap.extension.data.Enum({
                                        enumType: initialfantasy.bo.emElementType,
                                        describe: true,
                                    }),
                                })
                            }),
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_activated"),
                                width: "6rem",
                                template: new sap.extension.m.CheckBox("", {}).bindProperty("bindingValue", {
                                    path: "activated",
                                    type: new sap.extension.data.YesNo()
                                })
                            }),
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_authorisevalue"),
                                width: "8rem",
                                template: new sap.extension.m.EnumSelect("", {
                                    enumType: ibas.emAuthoriseType,
                                }).bindProperty("bindingValue", {
                                    path: "authoriseValue",
                                    type: new sap.extension.data.AuthoriseType()
                                })
                            }),
                            new sap.extension.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_automatic"),
                                width: "6rem",
                                template: new sap.extension.m.CheckBox("", {}).bindProperty("bindingValue", {
                                    path: "automatic",
                                    type: new sap.extension.data.YesNo()
                                })
                            }),
                        ]
                    });
                    this.pagePrivileges = new sap.m.Page("", {
                        showHeader: true,
                        customHeader: new sap.m.Toolbar("", {
                            content: [
                                this.facetFilter = new sap.m.FacetFilter("", {
                                    type: sap.m.FacetFilterType.Simple,
                                    showPersonalization: true,
                                    showReset: true,
                                    visible: false,
                                    reset: function (oEvent) {
                                        let oFacetFilter = oEvent.getSource();
                                        if (oFacetFilter instanceof sap.m.FacetFilter) {
                                            for (let item of oFacetFilter.getLists()) {
                                                item.removeSelectedKeys();
                                            }
                                            that.filterPrivileges(null);
                                        }
                                    },
                                    confirm: function (oEvent) {
                                        let oFacetFilter = oEvent.getSource();
                                        if (oFacetFilter instanceof sap.m.FacetFilter && oFacetFilter.getLists() instanceof Array) {
                                            let mFacetFilterLists = oFacetFilter.getLists().filter((oList) => {
                                                return oList.getSelectedItems().length;
                                            });
                                            if (mFacetFilterLists.length) {
                                                let oFilter = new sap.ui.model.Filter(mFacetFilterLists.map(function (oList) {
                                                    return new sap.ui.model.Filter(oList.getSelectedItems().map(function (oItem) {
                                                        return new sap.ui.model.Filter(oList.getKey(), sap.ui.model.FilterOperator.EQ, oItem.getKey());
                                                    }), false);
                                                }), true);
                                                that.filterPrivileges(oFilter);
                                            }
                                            else {
                                                that.filterPrivileges(null);
                                            }
                                        }
                                        else {
                                            that.filterPrivileges(null);
                                        }
                                    },
                                }),
                                new sap.m.ToolbarSpacer(""),
                                this.selectPlatforms = new sap.m.Select("", {
                                    width: "auto",
                                    change() {
                                        that.fireFetchPrivilegesEvent();
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("initialfantasy_copy_from"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://copy",
                                    press: function () {
                                        that.fireViewEvents(that.copyPrivilegesEvent);
                                    },
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    buttonMode: sap.m.MenuButtonMode.Split,
                                    useDefaultActionOnly: true,
                                    defaultAction() {
                                        that.fireViewEvents(that.savePrivilegesEvent);
                                    },
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_delete"),
                                                icon: "sap-icon://delete",
                                                press: function () {
                                                    let role = that.tableRoles.getSelecteds().firstOrDefault();
                                                    if (!ibas.objects.isNull(role)) {
                                                        let criteria = new ibas.Criteria();
                                                        let condition = criteria.conditions.create();
                                                        condition.alias = initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME;
                                                        condition.value = that.selectPlatforms.getSelectedKey();
                                                        condition = criteria.conditions.create();
                                                        condition.alias = initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME;
                                                        condition.value = role.code;
                                                        that.fireViewEvents(that.deletePrivilegesEvent, criteria);
                                                    }
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [
                            this.tablePrivileges
                        ],
                        floatingFooter: true,
                        footer: new sap.m.Toolbar("", {
                            content: [
                                this.check = new sap.m.CheckBox("", {
                                    text: ibas.i18n.prop("shell_reverse"),
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Text("", {
                                    text: ibas.i18n.prop("shell_batch"),
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.i18n.prop("bo_privilege_activated"),
                                    icon: "sap-icon://validate",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                        // new sap.m.MenuItem("", {
                                        //     text: ibas.enums.describe(ibas.emYesNo, ibas.emYesNo.YES),
                                        //     icon: "sap-icon://accept",
                                        //     press: function (): void {
                                        //         for (let item of that.check.getSelected() ?
                                        //             that.tablePrivileges.getUnSelecteds<initialfantasy.bo.IPrivilege>() :
                                        //             that.tablePrivileges.getSelecteds<initialfantasy.bo.IPrivilege>()) {
                                        //             item.activated = ibas.emYesNo.YES;
                                        //         }
                                        //     }
                                        // }),
                                        // new sap.m.MenuItem("", {
                                        //     text: ibas.enums.describe(ibas.emYesNo, ibas.emYesNo.NO),
                                        //     icon: "sap-icon://decline",
                                        //     press: function (): void {
                                        //         for (let item of that.check.getSelected() ?
                                        //             that.tablePrivileges.getUnSelecteds<initialfantasy.bo.IPrivilege>() :
                                        //             that.tablePrivileges.getSelecteds<initialfantasy.bo.IPrivilege>()) {
                                        //             item.activated = ibas.emYesNo.NO;
                                        //         }
                                        //     }
                                        // }),
                                        ],
                                    })
                                }),
                                new sap.m.MenuButton("", {
                                    text: ibas.i18n.prop("bo_privilege_authorisevalue"),
                                    icon: "sap-icon://bullet-text",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                        // new sap.m.MenuItem("", {
                                        //     text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.ALL),
                                        //     icon: "sap-icon://multiselect-all",
                                        //     press: function (): void {
                                        //         for (let item of that.check.getSelected() ?
                                        //             that.tablePrivileges.getUnSelecteds<initialfantasy.bo.IPrivilege>() :
                                        //             that.tablePrivileges.getSelecteds<initialfantasy.bo.IPrivilege>()) {
                                        //             item.authoriseValue = ibas.emAuthoriseType.ALL;
                                        //         }
                                        //     }
                                        // }),
                                        // new sap.m.MenuItem("", {
                                        //     text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.READ),
                                        //     icon: "sap-icon://multi-select",
                                        //     press: function (): void {
                                        //         for (let item of that.check.getSelected() ?
                                        //             that.tablePrivileges.getUnSelecteds<initialfantasy.bo.IPrivilege>() :
                                        //             that.tablePrivileges.getSelecteds<initialfantasy.bo.IPrivilege>()) {
                                        //             item.authoriseValue = ibas.emAuthoriseType.READ;
                                        //         }
                                        //     }
                                        // }),
                                        // new sap.m.MenuItem("", {
                                        //     text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.NONE),
                                        //     icon: "sap-icon://multiselect-none",
                                        //     press: function (): void {
                                        //         for (let item of that.check.getSelected() ?
                                        //             that.tablePrivileges.getUnSelecteds<initialfantasy.bo.IPrivilege>() :
                                        //             that.tablePrivileges.getSelecteds<initialfantasy.bo.IPrivilege>()) {
                                        //             item.authoriseValue = ibas.emAuthoriseType.NONE;
                                        //         }
                                        //     }
                                        // }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                    });
                    return new sap.m.SplitContainer("", {
                        masterPages: [
                            this.pageRoles,
                        ],
                        detailPages: [
                            this.pagePrivileges
                        ],
                    });
                }
                fireFetchPrivilegesEvent() {
                    let role = this.tableRoles.getSelecteds().firstOrDefault();
                    if (!ibas.objects.isNull(role)) {
                        let criteria = new ibas.Criteria();
                        let condition = criteria.conditions.create();
                        condition.alias = initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME;
                        condition.value = this.selectPlatforms.getSelectedKey();
                        condition = criteria.conditions.create();
                        condition.alias = initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME;
                        condition.value = role.code;
                        this.fireViewEvents(this.fetchPrivilegesEvent, criteria);
                    }
                }
                /** 嵌入查询面板 */
                embedded(view) {
                    if (view instanceof sap.m.Toolbar) {
                        view.setDesign(sap.m.ToolbarDesign.Transparent);
                        view.setHeight("100%");
                    }
                    this.pageRoles.addHeaderContent(view);
                    this.pageRoles.setShowHeader(true);
                }
                showRoles(datas) {
                    let model = this.tableRoles.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    }
                    else {
                        // 未绑定过数据
                        this.tableRoles.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.tableRoles.setBusy(false);
                }
                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria) {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.tableRoles.setBusy(true);
                        this.tableRoles.setModel(null);
                    }
                }
                /** 显示数据 */
                showPrivileges(datas) {
                    // this.tablePrivileges.setFirstVisibleRow(0);
                    this.tablePrivileges.setModel(new sap.extension.model.JSONModel({ privileges: datas }));
                    // this.refreshPrivilegeFilter(datas);
                }
                /** 刷新过滤器 */
                refreshPrivilegeFilter(datas) {
                    this.facetFilter.removeAllLists();
                    if (datas.length === 0) {
                        this.facetFilter.setVisible(false);
                        return;
                    }
                    let moduleIdFacetFilterList = new sap.m.FacetFilterList("", {
                        title: ibas.i18n.prop("bo_privilege_moduleid"),
                        key: "moduleId",
                    });
                    for (let item of datas.filter(c => { return ibas.strings.isEmpty(c.target); })) {
                        moduleIdFacetFilterList.addItem(new sap.m.FacetFilterItem("", {
                            text: ibas.i18n.prop(item.moduleId),
                            key: item.moduleId
                        }));
                    }
                    this.facetFilter.addList(moduleIdFacetFilterList);
                    let targetFacetFilterList = new sap.m.FacetFilterList("", {
                        title: ibas.i18n.prop("bo_applicationelement_elementtype"),
                        key: "type",
                        items: [
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(initialfantasy.bo.emElementType, initialfantasy.bo.emElementType.FUNCTION),
                                key: initialfantasy.bo.emElementType.FUNCTION
                            }),
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(initialfantasy.bo.emElementType, initialfantasy.bo.emElementType.APPLICATION),
                                key: initialfantasy.bo.emElementType.APPLICATION
                            }),
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(initialfantasy.bo.emElementType, initialfantasy.bo.emElementType.MODULE),
                                key: initialfantasy.bo.emElementType.MODULE
                            }),
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(initialfantasy.bo.emElementType, initialfantasy.bo.emElementType.SERVICE),
                                key: initialfantasy.bo.emElementType.SERVICE
                            }),
                        ]
                    });
                    this.facetFilter.addList(targetFacetFilterList);
                    let authoriseTypeFacetFilterList = new sap.m.FacetFilterList("", {
                        title: ibas.i18n.prop("bo_privilege_authorisevalue"),
                        key: "authoriseValue",
                        items: [
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.ALL),
                                key: ibas.emAuthoriseType.ALL
                            }),
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.NONE),
                                key: ibas.emAuthoriseType.NONE
                            }),
                            new sap.m.FacetFilterItem("", {
                                text: ibas.enums.describe(ibas.emAuthoriseType, ibas.emAuthoriseType.READ),
                                key: ibas.emAuthoriseType.READ
                            }),
                        ]
                    });
                    this.facetFilter.addList(authoriseTypeFacetFilterList);
                    this.facetFilter.setVisible(true);
                }
                filterPrivileges(filter) {
                    let dataBinding = this.tablePrivileges.getBinding("");
                    dataBinding.filter(filter);
                }
                /** 显示平台 */
                showPlatforms(datas) {
                    for (let item of datas) {
                        this.selectPlatforms.addItem(new sap.ui.core.ListItem("", {
                            key: item.platformCode,
                            text: item.platformDescription,
                            additionalText: item.platformId
                        }));
                        if (ibas.strings.isEmpty(this.selectPlatforms.getSelectedKey())) {
                            this.selectPlatforms.setSelectedKey(item.platformCode);
                        }
                    }
                }
            }
            c_1.PrivilegeConfigView = PrivilegeConfigView;
        })(c = ui.c || (ui.c = {}));
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http?://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
        let c;
        (function (c_2) {
            class Utils {
                static convertToReport(data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let report = {
                            docElements: [],
                            version: 2,
                            parameters: yield Utils.convertToParameters(data.boCode),
                            styles: []
                        };
                        // #region documentProperties
                        let documentProperties = {
                            orientation: "portrait",
                            pageFormat: "user_defined",
                            unit: "px"
                        };
                        documentProperties.boCode = data.boCode || "";
                        documentProperties.name = data.name || "";
                        documentProperties.pageWidth = (data.width || 0) + "";
                        documentProperties.pageHeight = (data.height || 0) + "";
                        documentProperties.marginLeft = (data.marginLeft || 0) + "";
                        documentProperties.marginRight = (data.marginRight || 0) + "";
                        documentProperties.marginTop = (data.marginTop || 0) + (data.pageHeaderTop || 0) + "";
                        documentProperties.marginBottom = (data.marginBottom || 0) + "";
                        documentProperties.pageHeaderSize = (data.pageHeaderHeight || 0) + "";
                        documentProperties.startSectionSize = (data.startSectionHeight || 0) + "";
                        documentProperties.repetitionSize = (data.repetitionHeaderHeight || 0) + (data.repetitionHeight || 0)
                            + (data.repetitionFooterHeight || 0) + "";
                        documentProperties.endSectionSize = (data.endSectionHeight || 0) + "";
                        documentProperties.pageFooterSize = (data.pageFooterHeight || 0) + "";
                        report.documentProperties = documentProperties;
                        // #endregion
                        Utils.elementId = 1;
                        for (let item of data.pageHeaders.filterDeleted()) {
                            let docElement = {
                                id: Utils.elementId++,
                                containerId: "0_page_header"
                            };
                            Utils.convertToDocElement(docElement, item);
                            report.docElements.push(docElement);
                        }
                        for (let item of data.startSections.filterDeleted()) {
                            let docElement = {
                                id: Utils.elementId++,
                                containerId: "0_start_section"
                            };
                            Utils.convertToDocElement(docElement, item);
                            report.docElements.push(docElement);
                        }
                        let tableElement = {
                            id: Utils.elementId++,
                            elementType: "table",
                            columns: data.repetitionHeaders.length + "",
                            contentDataRows: [],
                            header: true,
                            footer: false,
                            x: (data.repetitionLeft || 0) - (data.marginLeft || 0),
                            containerId: "0_repetition"
                        };
                        Utils.convertToTableElement(tableElement, data);
                        report.docElements.push(tableElement);
                        for (let item of data.endSections.filterDeleted()) {
                            let docElement = {
                                id: Utils.elementId++,
                                containerId: "0_end_section"
                            };
                            Utils.convertToDocElement(docElement, item);
                            report.docElements.push(docElement);
                        }
                        for (let item of data.pageFooters.filterDeleted()) {
                            let docElement = {
                                id: Utils.elementId++,
                                containerId: "0_page_footer"
                            };
                            Utils.convertToDocElement(docElement, item);
                            report.docElements.push(docElement);
                        }
                        return report;
                    });
                }
                static convertToTableElement(tableElement, data) {
                    let header = {
                        id: Utils.elementId++,
                        height: data.repetitionHeaderHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitionHeaders.filterDeleted()) {
                        let docElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionHeaderHeight || 0;
                        header.columnData.push(docElement);
                    }
                    tableElement.headerData = header;
                    let contentDataRow = {
                        id: Utils.elementId++,
                        height: data.repetitionHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitions.filterDeleted()) {
                        let docElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionHeight || 0;
                        contentDataRow.columnData.push(docElement);
                    }
                    tableElement.contentDataRows.push(contentDataRow);
                    if (data.repetitionFooters.filterDeleted().length > 0) {
                        tableElement.footer = true;
                    }
                    let footer = {
                        id: Utils.elementId++,
                        height: data.repetitionFooterHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitionFooters.filterDeleted()) {
                        let docElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionFooterHeight || 0;
                        footer.columnData.push(docElement);
                    }
                    for (let i = 0; i < data.repetitionHeaders.length - data.repetitionFooters.length; i++) {
                        let docElement = {
                            id: Utils.elementId++,
                            elementType: "table_text",
                            height: data.repetitionFooterHeight || 0
                        };
                        footer.columnData.push(docElement);
                    }
                    tableElement.footerData = footer;
                }
                static convertToDocElement(docElement, item) {
                    docElement.width = item.itemWidth || 0;
                    if (docElement.width <= 0 && !!item.itemString) {
                        docElement.width = item.itemString.length * (item.fontSize || 0);
                    }
                    docElement.height = item.itemHeight || 0;
                    docElement.x = item.itemLeft || 0;
                    docElement.y = item.itemTop || 0;
                    if (item.itemType === "IMG") {
                        docElement.elementType = "image";
                        let textElement = docElement;
                        textElement.sourceType = ibas.enums.toString(importexport.bo.emDataSourceType, item.sourceType);
                        textElement.content = item.itemString || "";
                        textElement.format = item.valueFormat || "";
                    }
                    else {
                        if (!docElement.containerId) {
                            docElement.elementType = "table_text";
                        }
                        else {
                            docElement.elementType = "text";
                        }
                        let textElement = docElement;
                        textElement.sourceType = ibas.enums.toString(importexport.bo.emDataSourceType, item.sourceType);
                        textElement.content = item.itemString || "";
                        textElement.format = item.valueFormat || "";
                        textElement.font = item.fontName || "Arial";
                        textElement.fontSize = item.fontSize || 12;
                        textElement.horizontalAlignment = ibas.enums.toString(importexport.bo.emJustificationHorizontal, item.justificationHorizontal).toLowerCase();
                        textElement.bold = false;
                        textElement.italic = false;
                        switch (item.textStyle) {
                            case importexport.bo.emTextStyle.REGULAR:
                                break;
                            case importexport.bo.emTextStyle.BOLD:
                                textElement.bold = true;
                                break;
                            case importexport.bo.emTextStyle.ITALIC:
                                textElement.italic = true;
                                break;
                            case importexport.bo.emTextStyle.BOLD_ITALIC:
                                textElement.bold = true;
                                textElement.italic = true;
                                break;
                        }
                    }
                }
                static convertToParameters(boCode) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let promise = new Promise(resolve => {
                            let parameters = [
                                {
                                    name: "PAGE_INDEX",
                                    description: "当前页码",
                                    showOnlyNameType: true,
                                    arrayItemType: "string",
                                    eval: false,
                                    expression: "",
                                    id: Utils.elementId++,
                                    nullable: false,
                                    pattern: "",
                                    testData: "1",
                                    type: "number",
                                },
                                {
                                    name: "PAGE_TOTAL",
                                    description: "总页码",
                                    showOnlyNameType: true,
                                    arrayItemType: "string",
                                    eval: false,
                                    expression: "",
                                    id: Utils.elementId++,
                                    nullable: false,
                                    pattern: "",
                                    testData: "1",
                                    type: "number",
                                },
                                {
                                    name: "DATA_SIZE",
                                    description: "当前行",
                                    showOnlyNameType: true,
                                    arrayItemType: "string",
                                    eval: false,
                                    expression: "",
                                    id: Utils.elementId++,
                                    nullable: false,
                                    pattern: "",
                                    testData: "1",
                                    type: "number",
                                },
                                {
                                    name: "DATA_INDEX",
                                    description: "总行数",
                                    showOnlyNameType: true,
                                    arrayItemType: "string",
                                    eval: false,
                                    expression: "",
                                    id: Utils.elementId++,
                                    nullable: false,
                                    pattern: "",
                                    testData: "1",
                                    type: "number",
                                },
                                {
                                    name: "TIME_NOW",
                                    description: "当前时间",
                                    showOnlyNameType: true,
                                    arrayItemType: "string",
                                    eval: false,
                                    expression: "",
                                    id: Utils.elementId++,
                                    nullable: false,
                                    pattern: "",
                                    testData: "",
                                    type: "number",
                                },
                            ];
                            if (ibas.strings.isEmpty(boCode)) {
                                resolve(parameters);
                                return;
                            }
                            let criteria = new ibas.Criteria();
                            let condition = criteria.conditions.create();
                            condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                            condition.operation = ibas.emConditionOperation.START;
                            condition.value = boCode;
                            let sort = criteria.sorts.create();
                            sort.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                            sort.sortType = ibas.emSortType.ASCENDING;
                            let boRepository = new initialfantasy.bo.BORepositoryInitialFantasy();
                            boRepository.fetchBOInformation({
                                criteria: criteria,
                                onCompleted(opRslt) {
                                    try {
                                        if (opRslt.resultCode !== 0) {
                                            throw new Error(opRslt.message);
                                        }
                                        let data = opRslt.resultObjects.firstOrDefault(c => {
                                            return c.code.indexOf(".") < 0;
                                        });
                                        if (!ibas.objects.isNull(data)) {
                                            let convertToParameter = (data, prefix, parameters) => {
                                                for (let boPropertyInformation of data.boPropertyInformations) {
                                                    if (boPropertyInformation.mapped.indexOf(".") < 0) {
                                                        // 字段
                                                        let parameter = {
                                                            name: boPropertyInformation.property,
                                                            description: boPropertyInformation.description,
                                                            showOnlyNameType: true,
                                                            arrayItemType: "string",
                                                            eval: false,
                                                            expression: "",
                                                            id: Utils.elementId++,
                                                            nullable: false,
                                                            pattern: "",
                                                            testData: "",
                                                            type: "number",
                                                        };
                                                        parameters.push(parameter);
                                                    }
                                                    else {
                                                        // 子表
                                                        let dataItem = opRslt.resultObjects.firstOrDefault(c => {
                                                            return c.code === boPropertyInformation.mapped;
                                                        });
                                                        if (!ibas.objects.isNull(dataItem)) {
                                                            let parameter = {
                                                                arrayItemType: "string",
                                                                children: [],
                                                                eval: false,
                                                                expression: "",
                                                                id: Utils.elementId++,
                                                                name: boPropertyInformation.property + "[]",
                                                                description: dataItem.description,
                                                                nullable: false,
                                                                pattern: "",
                                                                showOnlyNameType: false,
                                                                testData: "",
                                                                type: "map"
                                                            };
                                                            convertToParameter(dataItem, "", parameter.children);
                                                            parameters.push(parameter);
                                                        }
                                                    }
                                                }
                                            };
                                            convertToParameter(data, "", parameters);
                                            // 主对象
                                        }
                                    }
                                    catch (error) {
                                    }
                                    resolve(parameters);
                                }
                            });
                        });
                        return promise;
                    });
                }
                static convertToExportTemplate(report, data) {
                    let documentProperties = report.documentProperties;
                    let tableElement = report.docElements.find(c => {
                        return c.elementType === "table" && c.containerId === "0_repetition";
                    });
                    if (ibas.objects.isNull(tableElement)) {
                        return false;
                    }
                    let headerBand = tableElement.headerData;
                    let contentBand = tableElement.contentDataRows[0];
                    let footerBand = tableElement.footerData;
                    if (ibas.objects.isNull(headerBand) || ibas.objects.isNull(contentBand) || ibas.objects.isNull(footerBand)) {
                        return false;
                    }
                    Utils.resetExportTemplate(data);
                    data.name = documentProperties.name;
                    data.boCode = documentProperties.boCode;
                    data.dpi = 0;
                    data.marginArea = 0;
                    data.width = ibas.numbers.valueOf(documentProperties.pageWidth);
                    data.height = ibas.numbers.valueOf(documentProperties.pageHeight);
                    data.marginLeft = ibas.numbers.valueOf(documentProperties.marginLeft);
                    data.marginRight = ibas.numbers.valueOf(documentProperties.marginRight);
                    data.marginTop = ibas.numbers.valueOf(documentProperties.marginTop);
                    data.marginBottom = ibas.numbers.valueOf(documentProperties.marginBottom);
                    data.pageHeaderWidth = data.width - data.marginLeft - data.marginRight;
                    data.startSectionWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionHeaderWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionFooterWidth = data.width - data.marginLeft - data.marginRight;
                    data.endSectionWidth = data.width - data.marginLeft - data.marginRight;
                    data.pageFooterWidth = data.width - data.marginLeft - data.marginRight;
                    data.pageHeaderHeight = ibas.numbers.valueOf(documentProperties.pageHeaderSize);
                    data.startSectionHeight = ibas.numbers.valueOf(documentProperties.startSectionSize);
                    data.repetitionHeaderHeight = ibas.numbers.valueOf(headerBand.height);
                    data.repetitionHeight = ibas.numbers.valueOf(contentBand.height);
                    data.repetitionFooterHeight = ibas.numbers.valueOf(footerBand.height);
                    data.endSectionHeight = ibas.numbers.valueOf(documentProperties.endSectionSize);
                    data.pageFooterHeight = ibas.numbers.valueOf(documentProperties.pageFooterSize);
                    data.pageHeaderLeft = data.marginLeft;
                    data.startSectionLeft = data.marginLeft;
                    data.repetitionHeaderLeft = data.marginLeft + tableElement.x;
                    data.repetitionLeft = data.marginLeft + tableElement.x;
                    data.repetitionFooterLeft = data.marginLeft + tableElement.x;
                    data.endSectionLeft = data.marginLeft;
                    data.pageFooterLeft = data.marginLeft;
                    data.pageHeaderTop = 0;
                    data.startSectionTop = data.pageHeaderTop + data.pageHeaderHeight;
                    data.repetitionHeaderTop = data.startSectionTop + data.startSectionHeight;
                    data.repetitionTop = data.repetitionHeaderTop + data.repetitionHeaderHeight;
                    data.repetitionFooterTop = data.repetitionTop + data.repetitionHeight;
                    data.endSectionTop = data.repetitionFooterTop + data.repetitionFooterHeight;
                    data.pageFooterTop = data.height - data.marginBottom - data.pageFooterWidth;
                    for (let docElement of report.docElements) {
                        if (docElement.elementType === "image" || docElement.elementType === "text") {
                            Utils.convertToExportTemplateItem(docElement, data);
                        }
                    }
                    let x = 0;
                    for (let tableTextElement of headerBand.columnData) {
                        tableTextElement.x = x;
                        Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION_HEADER);
                        x += (tableTextElement.width || 0);
                    }
                    x = 0;
                    for (let tableTextElement of contentBand.columnData) {
                        tableTextElement.x = x;
                        Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION);
                        x += (tableTextElement.width || 0);
                    }
                    if (!!tableElement.footer) {
                        x = 0;
                        for (let tableTextElement of footerBand.columnData) {
                            tableTextElement.x = x;
                            Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION_FOOTER);
                            x += (tableTextElement.width || 0);
                        }
                    }
                    return true;
                }
                static convertToExportTemplateItem(docElement, data, areaType) {
                    let item;
                    switch (docElement.containerId) {
                        case "0_page_header":
                            item = data.pageHeaders.create();
                            break;
                        case "0_start_section":
                            item = data.startSections.create();
                            break;
                        case "0_end_section":
                            item = data.endSections.create();
                            break;
                        case "0_page_footer":
                            item = data.pageFooters.create();
                            break;
                        default:
                            if (areaType === importexport.bo.emAreaType.REPETITION_HEADER) {
                                item = data.repetitionHeaders.create();
                            }
                            else if (areaType === importexport.bo.emAreaType.REPETITION) {
                                item = data.repetitions.create();
                            }
                            else if (areaType === importexport.bo.emAreaType.REPETITION_FOOTER) {
                                item = data.repetitionFooters.create();
                            }
                            else {
                                return;
                            }
                    }
                    item.itemType = docElement.elementType === "image" ? "IMG" : "TEXT";
                    item.itemVisible = ibas.emYesNo.YES;
                    item.sourceType = ibas.enums.valueOf(importexport.bo.emDataSourceType, docElement.sourceType);
                    item.itemString = docElement.content;
                    item.valueFormat = docElement.format;
                    item.textStyle = importexport.bo.emTextStyle.REGULAR;
                    item.itemLeft = docElement.x || 0;
                    item.itemTop = docElement.y || 0;
                    item.itemWidth = docElement.width;
                    item.itemHeight = item.itemHeight || docElement.height;
                    item.justificationHorizontal = ibas.enums.valueOf(importexport.bo.emJustificationHorizontal, docElement.horizontalAlignment.toUpperCase());
                    if (docElement.elementType === "image") {
                        item.itemType = "IMG";
                    }
                    else {
                        item.itemType = "TEXT";
                        let textElement = docElement;
                        item.fontName = textElement.font;
                        item.fontSize = textElement.fontSize;
                        if (!!textElement.bold && !!textElement.italic) {
                            item.textStyle = importexport.bo.emTextStyle.BOLD_ITALIC;
                        }
                        else if (!!textElement.bold) {
                            item.textStyle = importexport.bo.emTextStyle.BOLD;
                        }
                        else if (!!textElement.italic) {
                            item.textStyle = importexport.bo.emTextStyle.ITALIC;
                        }
                    }
                }
                static resetExportTemplate(data) {
                    for (let item of data.pageHeaders.filterDeleted()) {
                        if (data.pageHeaders.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.pageHeaders.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.startSections.filterDeleted()) {
                        if (data.startSections.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.startSections.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitionHeaders.filterDeleted()) {
                        if (data.repetitionHeaders.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitionHeaders.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitions.filterDeleted()) {
                        if (data.repetitions.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitions.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitionFooters.filterDeleted()) {
                        if (data.repetitionFooters.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitionFooters.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.endSections.filterDeleted()) {
                        if (data.endSections.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.endSections.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.pageFooters.filterDeleted()) {
                        if (data.pageFooters.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.pageFooters.remove(item);
                            }
                            else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                }
            }
            c_2.Utils = Utils;
        })(c = ui.c || (ui.c = {}));
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./3rd.ts" />
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /** 编辑视图-导出模板 */
            class ExportTemplateEditView extends ibas.BOEditView {
                /** 绘制视图 */
                draw() {
                    let that = this;
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: importexport.bo.ExportTemplate.BUSINESS_OBJECT_CODE,
                        },
                        content: [
                            new sap.ui.core.HTML("", {
                                preferDOM: false,
                                content: "<div class=\"reportbro\"></div>",
                                afterRendering() {
                                }
                            })
                        ]
                    });
                }
                onDisplayed() {
                    super.onDisplayed();
                    let mainPage = sap.ui.getCore().byId("__page0");
                    if (mainPage instanceof sap.tnt.ToolPage) {
                        mainPage.setSideExpanded(false);
                        this.mainHeader = mainPage.getHeader();
                        this.sideContent = mainPage.getSideContent();
                        mainPage.setHeader(null);
                        mainPage.setSideContent(null);
                    }
                }
                onClosed() {
                    super.onClosed();
                    let mainPage = sap.ui.getCore().byId("__page0");
                    if (mainPage instanceof sap.tnt.ToolPage) {
                        mainPage.setHeader(this.mainHeader);
                        mainPage.setSideContent(this.sideContent);
                    }
                }
                /** 显示数据 */
                showExportTemplate(data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let that = this;
                        let report = yield c.Utils.convertToReport(data);
                        setTimeout(() => {
                            $(".reportbro").empty();
                            $(".reportbro").data("reportBro", null);
                            $(".reportbro").reportBro({
                                // 字体
                                additionalFonts: [
                                    { name: "Arial", value: "Arial" }
                                ],
                                // 选择业务对象
                                chooseBOCodeEvent(callback) {
                                    that.fireViewEvents(that.chooseBusinessObjectEvent, (boCode, boDescription) => __awaiter(this, void 0, void 0, function* () {
                                        let parameters = yield c.Utils.convertToParameters(boCode);
                                        $(".reportbro").reportBro("reloadParameters", parameters);
                                        callback(boCode);
                                    }));
                                },
                                // 保存事件
                                saveCallback() {
                                    let report = $(".reportbro").reportBro("getReport");
                                    if (c.Utils.convertToExportTemplate(report, data)) {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }
                            });
                            $(".reportbro").reportBro("load", report);
                        }, 100);
                    });
                }
            }
            c.ExportTemplateEditView = ExportTemplateEditView;
        })(c = ui.c || (ui.c = {}));
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
/// <reference path="./RemoteConfigView.ts" />
/// <reference path="./PrivilegeConfigView.ts" />
/// <reference path="./ExportTemplateEditView.ts" />
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
        let require = ibas.requires.create({
            context: ibas.requires.naming(unofficialtool.CONSOLE_NAME),
        });
        require([
            "3rdparty/reportbro/ext/autosize",
            "css!3rdparty/reportbro/reportbro",
            "css!3rdparty/reportbro/ext/spectrum",
            "3rdparty/reportbro/ext/JsBarcode.all.min",
            "3rdparty/reportbro/ext/spectrum",
            "3rdparty/reportbro/reportbro"
        ], function (autosize) {
            window.autosize = autosize;
        });
        /** 视图导航 */
        class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            newView(id) {
                let view = null;
                switch (id) {
                    case unofficialtool.app.RemoteConfigService.APPLICATION_ID:
                        view = new ui.c.RemoteConfigView();
                        break;
                    case unofficialtool.app.PrivilegeConfigApp.APPLICATION_ID:
                        view = new ui.c.PrivilegeConfigView();
                        break;
                    case unofficialtool.app.ExportTemplateEditApp.APPLICATION_ID:
                        view = new ui.c.ExportTemplateEditView();
                        break;
                    default:
                        shell.app.modules.forEach(module => {
                            if (module.id === unofficialtool.CONSOLE_ID) {
                                return;
                            }
                            if (!!view) {
                                return;
                            }
                            if (module instanceof ibas.ModuleConsole) {
                                let navigation = module.navigation();
                                if (navigation instanceof ibas.ViewNavigation && typeof navigation.newView === "function") {
                                    view = navigation.newView(id);
                                }
                            }
                        });
                        break;
                }
                return view;
            }
        }
        ui.Navigation = Navigation;
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
//# sourceMappingURL=index.ui.c.js.map