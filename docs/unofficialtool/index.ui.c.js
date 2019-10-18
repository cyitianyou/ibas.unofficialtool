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
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
/// <reference path="./RemoteConfigView.ts" />
/// <reference path="./PrivilegeConfigView.ts" />
var unofficialtool;
(function (unofficialtool) {
    let ui;
    (function (ui) {
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
                    default:
                        break;
                }
                return view;
            }
        }
        ui.Navigation = Navigation;
    })(ui = unofficialtool.ui || (unofficialtool.ui = {}));
})(unofficialtool || (unofficialtool = {}));
//# sourceMappingURL=index.ui.c.js.map