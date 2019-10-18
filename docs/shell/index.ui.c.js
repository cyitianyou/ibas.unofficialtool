/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../index.d.ts" />
var shell;
(function (shell) {
    let ui;
    (function (ui_1) {
        ui_1.UI_APP = "__UI_APP";
        ui_1.UI_DATA_KEY_VIEW = "__UI_DATA_KEY_VIEW";
        ui_1.UI_DATA_KEY_HASH = "__UI_DATA_KEY_HASH";
        /**
         * 视图-显示者-默认
         */
        class ViewShower {
            /** 显示视图 */
            show(view) {
                if (!(view instanceof ibas.View)) {
                    throw new Error(ibas.i18n.prop("shell_invalid_ui"));
                }
                let viewContent = view.draw();
                if (ibas.objects.isNull(viewContent)) {
                    ibas.logger.log(ibas.emMessageLevel.WARN, "shower: empty view.");
                    return;
                }
                if (viewContent instanceof sap.ui.core.Element) {
                    viewContent.addCustomData(new sap.ui.core.CustomData("", {
                        key: ui_1.UI_DATA_KEY_VIEW,
                        value: view,
                        writeToDom: false,
                    }));
                }
                if (view.application instanceof shell.app.MainApp) {
                    viewContent.placeAt("content");
                }
                else if (view.application instanceof shell.app.WelcomeApp) {
                    if (viewContent instanceof sap.m.Dialog) {
                        let pView = null;
                        viewContent.open();
                        // 隐藏app
                        let app = sap.ui.getCore().byId(ui_1.UI_APP);
                        if (app instanceof sap.m.App) {
                            app.setVisible(false);
                            let page = app.getCurrentPage();
                            for (let item of page.getCustomData()) {
                                if (item.getKey() === ui_1.UI_DATA_KEY_VIEW) {
                                    pView = item.getValue();
                                }
                            }
                            if (pView instanceof ibas.View) {
                                pView.isDisplayed = false;
                            }
                        }
                        viewContent.attachAfterClose(null, () => {
                            // 重新显示app
                            if (app instanceof sap.m.App) {
                                app.setVisible(true);
                                if (pView instanceof ibas.View) {
                                    pView.isDisplayed = true;
                                }
                                // 界面显示后，没有触发导航事件
                                app.fireAfterNavigate(undefined);
                                pView = null;
                            }
                        });
                    }
                }
                else if (view.application instanceof shell.app.LoginApp) {
                    let app = sap.ui.getCore().byId(ui_1.UI_APP);
                    if (app instanceof sap.m.App) {
                        app.addPage(viewContent);
                        app.to(viewContent);
                    }
                }
                else if (view.application instanceof shell.app.CenterApp) {
                    let app = sap.ui.getCore().byId(ui_1.UI_APP);
                    if (app instanceof sap.m.App) {
                        app.addPage(viewContent);
                        app.to(viewContent);
                    }
                }
                view.id = viewContent.getId();
                ibas.views.displayed.call(view);
            }
            /** 清理资源 */
            destroy(view) {
                let ui = sap.ui.getCore().byId(view.id);
                if (!ibas.objects.isNull(ui)) {
                    if (ui.getParent() && ui.getParent().getId() === ui_1.UI_APP) {
                        let app = sap.ui.getCore().byId(ui_1.UI_APP);
                        if (app instanceof sap.m.App) {
                            app.setInitialPage(undefined);
                        }
                    }
                    if (ui instanceof sap.m.Dialog) {
                        ui.close();
                    }
                    else {
                        ui.destroy(true);
                    }
                    if (view instanceof ibas.View) {
                        ibas.views.closed.call(view);
                    }
                }
                // 销毁忙对话框
                if (!ibas.objects.isNull(this.busyDialog)) {
                    this.busyDialog.destroy(true);
                    this.busyDialog = undefined;
                }
            }
            /** 设置忙状态 */
            busy(view, busy, msg) {
                if (busy) {
                    if (ibas.objects.isNull(this.busyDialog)) {
                        this.busyDialog = new sap.m.BusyDialog("");
                    }
                    this.busyDialog.setTitle(view.title);
                    this.busyDialog.setText(msg);
                    this.busyDialog.open();
                }
                else {
                    if (!ibas.objects.isNull(this.busyDialog)) {
                        this.busyDialog.close(false);
                        this.busyDialog.destroy(true);
                        this.busyDialog = undefined;
                    }
                }
            }
            /** 进程消息 */
            proceeding(view, type, msg) {
                this.messages({
                    type: type,
                    message: msg
                });
            }
            /** 对话消息 */
            messages(caller) {
                sap.extension.m.MessageBox.show(caller.message, {
                    type: caller.type,
                    title: caller.title,
                    actions: caller.actions,
                    onCompleted: caller.onCompleted,
                });
            }
        }
        ui_1.ViewShower = ViewShower;
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /**
             * 视图-入口
             */
            class MainView extends ibas.View {
                /** 绘制视图 */
                draw() {
                    let that = this;
                    // 键盘按钮按下
                    ibas.browserEventManager.registerListener({
                        eventType: ibas.emBrowserEventType.KEYDOWN,
                        onEventFired: (event) => {
                            that.onKeyDown(event);
                        }
                    });
                    // 哈希值变化
                    ibas.browserEventManager.registerListener({
                        eventType: ibas.emBrowserEventType.HASHCHANGE,
                        onEventFired: (event) => {
                            that.onHashChanged(event);
                        }
                    });
                    // touch事件
                    let touch = {
                        target: null,
                        startPoint: null,
                        direction: ibas.emTouchMoveDirection.NONE,
                        start: function (event) {
                            touch.target = event.target;
                            touch.startPoint = event.touches[0];
                            touch.direction = ibas.emTouchMoveDirection.NONE;
                        },
                        move: function (event) {
                            if (touch.target === event.target) {
                                if (touch.direction === ibas.emTouchMoveDirection.NONE) { // do once at start
                                    let point = event.touches[0];
                                    let offsetX = point.screenX - touch.startPoint.screenX;
                                    let offsetY = point.screenY - touch.startPoint.screenY;
                                    if (Math.abs(offsetY) > Math.abs(offsetX)) {
                                        if (offsetY > 0) {
                                            touch.direction = ibas.emTouchMoveDirection.DOWN;
                                        }
                                        else {
                                            touch.direction = ibas.emTouchMoveDirection.UP;
                                        }
                                    }
                                    else {
                                        if (offsetX > 0) {
                                            touch.direction = ibas.emTouchMoveDirection.RIGHT;
                                        }
                                        else {
                                            touch.direction = ibas.emTouchMoveDirection.LEFT;
                                        }
                                    }
                                    that.onTouchMove(touch.direction, event);
                                }
                            }
                        },
                        end: function (event) {
                            touch.target = null;
                            touch.startPoint = null;
                            touch.direction = ibas.emTouchMoveDirection.NONE;
                        }
                    };
                    ibas.browserEventManager.registerListener({
                        eventType: ibas.emBrowserEventType.TOUCHSTART,
                        onEventFired: touch.start
                    });
                    ibas.browserEventManager.registerListener({
                        eventType: ibas.emBrowserEventType.TOUCHMOVE,
                        onEventFired: touch.move
                    });
                    ibas.browserEventManager.registerListener({
                        eventType: ibas.emBrowserEventType.TOUCHEND,
                        onEventFired: touch.end
                    });
                    // 语言变化监听
                    ibas.i18n.registerListener({
                        onLanguageChanged(language) {
                            if (ibas.strings.isEmpty(language)) {
                                return;
                            }
                            if (ibas.strings.isWith(language, "zh_", "") || ibas.strings.isWith(language, "zh-", "")) {
                                sap.ui.getCore().getConfiguration().setLanguage(language);
                            }
                            else {
                                sap.ui.getCore().getConfiguration().setLanguage(language.split("-")[0]);
                            }
                        }
                    });
                    // 配置变化
                    ibas.config.registerListener({
                        onConfigurationChanged(name, value) {
                            if (ibas.strings.equals(ibas.CONFIG_ITEM_PLANTFORM, name)) {
                                // 平台变化，修改控件紧缩模式
                                let body = jQuery(document.body);
                                if (value === ibas.emPlantform.DESKTOP) {
                                    body.toggleClass("sapUiSizeCompact", true).toggleClass("sapUiSizeCozy", false).toggleClass("sapUiSizeCondensed", false);
                                    // 桌面平台，使用紧凑视图
                                    ibas.config.set(openui5.CONFIG_ITEM_COMPACT_SCREEN, true);
                                }
                                else {
                                    body.toggleClass("sapUiSizeCompact", false).toggleClass("sapUiSizeCozy", true).toggleClass("sapUiSizeCondensed", false);
                                    // 使用舒适视图
                                    ibas.config.set(openui5.CONFIG_ITEM_COMPACT_SCREEN, false);
                                }
                            }
                        }
                    });
                    // 设置默认平台
                    if (sap.ui.Device.system.phone) {
                        ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.PHONE);
                    }
                    else if (sap.ui.Device.system.desktop) {
                        ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.DESKTOP);
                    }
                    else if (sap.ui.Device.system.tablet) {
                        ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.TABLET);
                    }
                    else {
                        ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, ibas.emPlantform.COMBINATION);
                    }
                    return new sap.m.App(ui.UI_APP, {
                        autoFocus: false,
                        afterNavigate() {
                            let page = this.getCurrentPage();
                            if (!ibas.objects.isNull(page)) {
                                for (let item of page.getCustomData()) {
                                    if (ibas.strings.equals(item.getKey(), ui.UI_DATA_KEY_VIEW)) {
                                        let data = item.getValue();
                                        if (data instanceof ibas.View) {
                                            if (data.application instanceof shell.app.CenterApp
                                                || data.application instanceof shell.app.ShellApplication) {
                                                // 主页改变，切换服务显示者
                                                ibas.servicesManager.viewShower = function () {
                                                    return data.application;
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                /** 获取当前View */
                currentView() {
                    let app = sap.ui.getCore().byId(ui.UI_APP);
                    if (app instanceof sap.m.App) {
                        let page = app.getCurrentPage();
                        if (!ibas.objects.isNull(page)) {
                            for (let item of page.getCustomData()) {
                                if (ibas.strings.equals(item.getKey(), ui.UI_DATA_KEY_VIEW)) {
                                    let data = item.getValue();
                                    if (data instanceof ibas.View) {
                                        return data;
                                    }
                                }
                            }
                        }
                    }
                    return null;
                }
                /** 按钮按下时 */
                onKeyDown(event) {
                    let view = this.currentView();
                    if (view instanceof ibas.View) {
                        if (!view.isDisplayed) {
                            return;
                        }
                        if (view.isBusy) {
                            return;
                        }
                        ibas.views.keyDown.call(view, event);
                    }
                }
                /** 地址栏哈希值变化 */
                onHashChanged(event) {
                    let view = this.currentView();
                    if (view instanceof ibas.View) {
                        if (!view.isDisplayed) {
                            return;
                        }
                        if (view.isBusy) {
                            return;
                        }
                        ibas.views.hashChanged.call(view, event);
                    }
                }
                /** 手指触控移动 */
                onTouchMove(direction, event) {
                    let view = this.currentView();
                    if (view instanceof ibas.View) {
                        if (!view.isDisplayed) {
                            return;
                        }
                        if (view.isBusy) {
                            return;
                        }
                        ibas.views.touchMove.call(view, direction, event);
                    }
                }
            }
            c.MainView = MainView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /** 配置项目-默认用户 */
            c.CONFIG_ITEM_DEFAULT_USER = "defaultUser";
            /** 配置项目-默认用户密码 */
            c.CONFIG_ITEM_DEFAULT_PASSWORD = "defaultPassword";
            /** 配置项目-覆盖的版权声明 */
            c.CONFIG_ITEM_COVERED_COPYRIGHT = "copyright";
            /**
             * 视图-登陆
             */
            class LoginView extends ibas.View {
                /** 用户 */
                get user() {
                    return this.txtUser.getValue();
                }
                set user(value) {
                    this.txtUser.setValue(value);
                }
                /** 密码 */
                get password() {
                    return this.txtPassword.getValue();
                }
                set password(value) {
                    this.txtPassword.setValue(value);
                }
                /** 绘制视图 */
                draw() {
                    // 设置应用名称
                    document.title = ibas.config.get(shell.app.CONFIG_ITEM_APPLICATION_NAME, ibas.i18n.prop("shell_name"));
                    let user = ibas.config.get(c.CONFIG_ITEM_DEFAULT_USER);
                    let password = ibas.config.get(c.CONFIG_ITEM_DEFAULT_PASSWORD);
                    let that = this;
                    return new sap.ui.layout.form.SimpleForm("", {
                        content: [
                            new sap.m.Title("", {
                                text: document.title,
                                level: sap.ui.core.TitleLevel.H1,
                                titleStyle: sap.ui.core.TitleLevel.H1,
                                textAlign: sap.ui.core.TextAlign.Center,
                            }),
                            new sap.m.Label("", {
                                text: ibas.i18n.prop("shell_user")
                            }),
                            this.txtUser = new sap.m.Input("", {
                                value: !ibas.strings.isEmpty(user) ? user : "",
                            }),
                            new sap.m.Label("", {
                                text: ibas.i18n.prop("shell_password")
                            }),
                            this.txtPassword = new sap.m.Input("", {
                                value: !ibas.strings.isEmpty(password) ? password : "",
                                type: "Password"
                            }),
                            new sap.m.Label("", {
                                text: ibas.i18n.prop("shell_language")
                            }),
                            this.getLanguageItems(new sap.m.Select("", {
                                items: [],
                                change: function (event) {
                                    let selectedItem = event.getParameter("selectedItem");
                                    if (selectedItem instanceof sap.ui.core.Item) {
                                        ibas.i18n.language = selectedItem.getKey();
                                        that.application.destroy();
                                        ibas.i18n.reload(() => {
                                            that.application.description = ibas.i18n.prop(that.application.name);
                                            that.application.show();
                                        });
                                    }
                                }
                            })),
                            new sap.m.Label("", {
                                text: ibas.i18n.prop("shell_plantform")
                            }),
                            new sap.m.Select("", {
                                items: [
                                    new sap.ui.core.ListItem("", {
                                        key: ibas.emPlantform.DESKTOP,
                                        text: ibas.enums.describe(ibas.emPlantform, ibas.emPlantform.DESKTOP),
                                    }),
                                    new sap.ui.core.ListItem("", {
                                        key: ibas.emPlantform.PHONE,
                                        text: ibas.enums.describe(ibas.emPlantform, ibas.emPlantform.PHONE),
                                    }),
                                    new sap.ui.core.ListItem("", {
                                        key: ibas.emPlantform.TABLET,
                                        text: ibas.enums.describe(ibas.emPlantform, ibas.emPlantform.TABLET),
                                    }),
                                ],
                                selectedKey: ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM),
                                change: function () {
                                    ibas.config.set(ibas.CONFIG_ITEM_PLANTFORM, parseInt(this.getSelectedKey(), 0));
                                    that.fireViewEvents(that.closeEvent);
                                    that.application.show();
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_login"),
                                type: sap.m.ButtonType.Accept,
                                press: function () {
                                    that.fireViewEvents(that.loginEvent);
                                }
                            }),
                            new sap.m.Label("", {}),
                            new sap.m.Title("", {
                                text: ibas.config.get(c.CONFIG_ITEM_COVERED_COPYRIGHT, ibas.i18n.prop("shell_copyright")),
                                level: sap.ui.core.TitleLevel.H6,
                                titleStyle: sap.ui.core.TitleLevel.H6,
                                textAlign: sap.ui.core.TextAlign.End
                            })
                        ]
                    });
                }
                /** 按钮按下时 */
                onKeyDown(event) {
                    if (ibas.objects.isNull(event)) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        this.fireViewEvents(this.loginEvent);
                    }
                }
                getLanguageItems(select) {
                    jQuery.ajax({
                        url: ibas.urls.rootUrl("shell/index") + "/languages.json",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            if (Array.isArray(data)) {
                                for (let item of data) {
                                    if (typeof item === "string") {
                                        select.addItem(new sap.ui.core.Item("", {
                                            key: item,
                                            text: item
                                        }));
                                    }
                                    else if (typeof item === "object") {
                                        let names = Object.keys(item);
                                        if (names.length > 0) {
                                            select.addItem(new sap.ui.core.Item("", {
                                                key: names[0],
                                                text: item[names[0]]
                                            }));
                                        }
                                    }
                                }
                            }
                            select.setSelectedKey(ibas.i18n.language);
                        },
                    });
                    return select;
                }
            }
            c.LoginView = LoginView;
            /**
             * 视图-登陆
             */
            class BigLoginView extends LoginView {
                /** 绘制视图 */
                draw() {
                    let form = super.draw();
                    let splitter = new sap.ui.layout.Splitter("", {
                        orientation: sap.ui.core.Orientation.Vertical,
                        contentAreas: [
                            // 头部空白
                            new sap.ui.layout.Splitter("", {
                                layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                    resizable: false,
                                    size: "15%",
                                }),
                            }),
                            new sap.ui.layout.Splitter("", {
                                layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                    resizable: false,
                                    size: "80%",
                                }),
                                contentAreas: [
                                    new sap.ui.layout.Splitter("", {
                                        layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                            resizable: false,
                                            size: "auto",
                                        }),
                                    }),
                                    new sap.ui.layout.Splitter("", {
                                        layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                            resizable: false,
                                            size: "460px",
                                        }),
                                        contentAreas: [
                                            new sap.ui.layout.Splitter("", {
                                                layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                                    resizable: false,
                                                    size: "auto",
                                                }),
                                                orientation: sap.ui.core.Orientation.Vertical,
                                                contentAreas: [
                                                    form
                                                ]
                                            }),
                                        ]
                                    }),
                                    new sap.ui.layout.Splitter("", {
                                        layoutData: new sap.ui.layout.SplitterLayoutData("", {
                                            resizable: false,
                                            size: "auto",
                                        }),
                                    }),
                                ]
                            }),
                        ]
                    });
                    // 重新赋值id
                    this.id = splitter.getId();
                    return splitter;
                }
            }
            c.BigLoginView = BigLoginView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /**
             * 视图-欢迎
             */
            class WelcomeView extends ibas.DialogView {
                /** 绘制视图 */
                draw() {
                    let form = new sap.extension.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretch: true,
                        // showHeader: false,
                        horizontalScrolling: false,
                        verticalScrolling: true,
                        content: [
                            this.page = new sap.m.Page("", {
                                enableScrolling: false,
                                showNavButton: false,
                                showHeader: false,
                                content: []
                            })
                        ],
                        endButton: new sap.m.Button("", {
                            text: ibas.i18n.prop("shell_close"),
                            type: sap.m.ButtonType.Transparent,
                            enabled: false,
                            press: () => {
                                this.fireViewEvents(this.closeEvent);
                            }
                        })
                    });
                    setTimeout(() => {
                        if (form instanceof sap.m.Dialog && form.isOpen()) {
                            form.getEndButton().setEnabled(true);
                            form = null;
                        }
                    }, 3000);
                    return form;
                }
                /** 显示内容 */
                showContent(content) {
                    if (ibas.strings.isWith(content, "http", undefined)) {
                        let html = new sap.ui.core.HTML("", {
                            content: ibas.strings.format(`<iframe src="{0}" width="100%" height="100%" frameborder="no" style="border:0px;" scrolling="no"></iframe>`, content),
                            preferDOM: false,
                            sanitizeContent: true,
                            visible: true,
                        });
                        this.page.addContent(html);
                    }
                    else if (ibas.strings.isWith(content, undefined, ".jpg")
                        || ibas.strings.isWith(content, undefined, ".png")
                        || ibas.strings.isWith(content, undefined, ".bmp")) {
                        let image = new sap.m.Image("", {
                            height: "100%",
                            width: "100%",
                            src: content,
                        });
                        this.page.addContent(image);
                    }
                    else if (!ibas.strings.isEmpty(content)) {
                        this.page.addContent(new sap.m.Text("", {
                            height: "100%",
                            width: "100%",
                            text: content,
                        }));
                    }
                    else {
                        let msgPage = new sap.m.MessagePage("", {
                            icon: "sap-icon://fob-watch",
                            text: ibas.i18n.prop("shell_system_preparing"),
                            description: "",
                            showHeader: false,
                        });
                        this.page.addContent(msgPage);
                        setTimeout(() => {
                            if (this.isDisplayed === true && msgPage.getVisible() === true) {
                                msgPage.setText(ibas.i18n.prop("shell_system_prepared"));
                            }
                        }, 3000);
                    }
                }
                /** 按钮按下时 */
                onKeyDown(event) {
                    if (ibas.objects.isNull(event)) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        this.fireViewEvents(this.closeEvent);
                    }
                }
            }
            c.WelcomeView = WelcomeView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c_1) {
            /**
             * 视图-关于
             */
            class AboutView extends ibas.View {
                /** 绘制视图 */
                draw() {
                    this.form = new sap.m.Page("", {
                        showHeader: false,
                        enableScrolling: true,
                        content: [this.form]
                    });
                    return this.form;
                }
                text(...values) {
                    let builder = new ibas.StringBuilder();
                    for (let item of values) {
                        if (ibas.strings.isEmpty(item)) {
                            continue;
                        }
                        if (builder.length > 0) {
                            builder.append(", ");
                        }
                        builder.append(item);
                    }
                    return builder.toString();
                }
                /** 显示库信息 */
                showLibraries(components) {
                    let list = new sap.m.List("", {
                        headerText: "Libraries",
                    });
                    // 添加UI组件
                    let version = sap.ui.getCore().getConfiguration().getVersion();
                    components.add(new shell.app.Component("openui5", version.toString(), "© SAP SE, made available under Apache License 2.0.", "sap-icon://sap-ui5"));
                    for (let item of components) {
                        list.addItem(new sap.m.FeedListItem("", {
                            icon: item.icon ? item.icon : "sap-icon://technical-object",
                            text: this.text(item.name, item.copyright),
                            info: item.version,
                        }));
                    }
                    this.form.addContent(list);
                }
                /** 显示应用信息 */
                showApplications(components) {
                    let list = new sap.m.List("", {
                        headerText: "Applications",
                    });
                    for (let item of components) {
                        list.addItem(new sap.m.FeedListItem("", {
                            icon: item.icon ? item.icon : ibas.config.get("defalutModuleIcon"),
                            text: this.text(item.name, item.copyright),
                            info: item.version,
                            iconPress(oControlEvent) {
                                // 按钮按下，查询此模块资源消耗
                                let feedListItem = oControlEvent.getSource();
                                if (feedListItem.getBusy()) {
                                    return;
                                }
                                feedListItem.setBusy(true);
                                let monitor = new shell.app.ModuleMonitor();
                                monitor.monitor({
                                    name: item.name,
                                    onCompleted(opRslt) {
                                        feedListItem.setBusy(false);
                                        if (opRslt.resultCode !== 0 || opRslt.informations.length === 0) {
                                            return;
                                        }
                                        let builder = new ibas.StringBuilder();
                                        builder.append("memory: ");
                                        builder.append("used ");
                                        builder.append(opRslt.informations.firstOrDefault(c => shell.app.ModuleMonitor.RUNTIME_INFORMATION_USED_MEMORY === c.name).content.toLowerCase());
                                        builder.append(", total ");
                                        builder.append(opRslt.informations.firstOrDefault(c => shell.app.ModuleMonitor.RUNTIME_INFORMATION_TOTAL_MEMORY === c.name).content.toLowerCase());
                                        builder.append(", max ");
                                        builder.append(opRslt.informations.firstOrDefault(c => shell.app.ModuleMonitor.RUNTIME_INFORMATION_MAX_MEMORY === c.name).content.toLowerCase());
                                        builder.append(".");
                                        feedListItem.setTimestamp(builder.toString());
                                    }
                                });
                            }
                        }));
                    }
                    this.form.insertContent(list, 0);
                }
            }
            c_1.AboutView = AboutView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /**
             * 视图-帮助
             */
            class HelpView extends ibas.UrlView {
                /** 绘制视图 */
                draw() {
                    return null;
                }
            }
            c.HelpView = HelpView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui_2) {
        let c;
        (function (c_2) {
            /** 配置项目-状态消息延迟时间 */
            c_2.CONFIG_ITEM_STATUS_MESSAGES_DELAY = "statusDelay";
            /** 配置项目-全屏模式 */
            c_2.CONFIG_ITEM_FULL_SCREEN = "fullScreen";
            /** 配置项目-全屏模式-设备 */
            c_2.CONFIG_ITEM_FULL_SCREEN_ON_PLANTFORM = c_2.CONFIG_ITEM_FULL_SCREEN + "|{0}";
            /** 配置项目-不允许登出 */
            c_2.CONFIG_ITEM_NO_LOGOUT = "noLogOut";
            /** 配置项目-功能分组 */
            c_2.CONFIG_ITEM_GROUP_FUNCTONS = "groupFunctions";
            /** 配置项目-欢迎页面图片 */
            c_2.CONFIG_ITEM_WELCOME_PAGE_IMAGE = "welcomeImage";
            /** 配置项目-欢迎页面地址 */
            c_2.CONFIG_ITEM_WELCOME_PAGE_URL = "welcomeUrl";
            /** 配置项目-收缩功能列表 */
            c_2.CONFIG_ITEM_SHRINK_FUNCTION_LIST = "shrinkFunction";
            /** 配置项目-最大消息数 */
            c_2.CONFIG_ITEM_MAX_MESSAGE_COUNT = "messageCount";
            /** 配置项目-隐藏无功能模块 */
            c_2.CONFIG_ITEM_HIDE_NO_FUNCTION_MODULE = "hideModule";
            const UI_MAIN_MENU = "__UI_MAIN_MENU";
            const UI_MAIN_BACK = "__UI_MAIN_BACK";
            const UI_MAIN_TITLE = "__UI_MAIN_TITLE";
            const UI_BUSY_DIALOG = "__UI_BUSY_DIALOG";
            /**
             * 视图-中心
             */
            class CenterView extends ibas.View {
                /** 绘制视图 */
                draw() {
                    let that = this;
                    let mainPage = new sap.tnt.ToolPage("", {
                        sideExpanded: !ibas.config.get(c_2.CONFIG_ITEM_SHRINK_FUNCTION_LIST, true)
                    });
                    this.mainHeader = new sap.tnt.ToolHeader("", {
                        content: [
                            // 收缩菜单钮
                            new sap.m.Button(UI_MAIN_MENU, {
                                tooltip: ibas.i18n.prop("shell_apps_menu"),
                                icon: "sap-icon://menu2",
                                type: sap.m.ButtonType.Transparent,
                                layoutData: new sap.m.OverflowToolbarLayoutData("", {
                                    priority: sap.m.OverflowToolbarPriority.NeverOverflow
                                }),
                                press: function () {
                                    mainPage.setSideExpanded(!mainPage.getSideExpanded());
                                }
                            }),
                            // 回退单钮
                            new sap.m.Button(UI_MAIN_BACK, {
                                icon: "sap-icon://nav-back",
                                tooltip: ibas.i18n.prop("shell_close_view"),
                                type: sap.m.ButtonType.Transparent,
                                visible: false,
                                layoutData: new sap.m.OverflowToolbarLayoutData("", {
                                    priority: sap.m.OverflowToolbarPriority.NeverOverflow
                                }),
                                press: function () {
                                    let page = that.pageContainer.getCurrentPage();
                                    if (page instanceof sap.m.Page) {
                                        for (let item of page.getCustomData()) {
                                            if (ibas.strings.equals(item.getKey(), ui_2.UI_DATA_KEY_VIEW)) {
                                                let data = item.getValue();
                                                if (data instanceof ibas.View) {
                                                    if (data.closeEvent instanceof Function) {
                                                        data.closeEvent.apply(data.application);
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }),
                            // 标题
                            new sap.m.Title(UI_MAIN_TITLE, {
                                visible: false,
                                layoutData: new sap.m.OverflowToolbarLayoutData("", {
                                    priority: sap.m.OverflowToolbarPriority.NeverOverflow
                                }),
                                textAlign: sap.ui.core.TextAlign.Left,
                            }),
                            // 分隔符
                            new sap.m.ToolbarSpacer("", { width: "20px" }),
                            new sap.tnt.ToolHeaderUtilitySeparator(""),
                            new sap.m.ToolbarSpacer("", {
                                layoutData: new sap.m.OverflowToolbarLayoutData("", {
                                    priority: sap.m.OverflowToolbarPriority.NeverOverflow,
                                    minWidth: "20px"
                                })
                            }),
                            // 系统服务
                            new sap.m.Button("", {
                                tooltip: this.title,
                                type: sap.m.ButtonType.Transparent,
                                width: "auto",
                                text: ibas.strings.isEmpty(ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_NAME)) ?
                                    ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE) : ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_NAME),
                                icon: ibas.config.get(ibas.CONFIG_ITEM_OFFLINE_MODE) ? "sap-icon://appear-offline" : "sap-icon://donut-chart",
                                layoutData: new sap.m.OverflowToolbarLayoutData("", {
                                    priority: sap.m.OverflowToolbarPriority.NeverOverflow
                                }),
                                press: function (event) {
                                    let popover = new sap.m.Popover("", {
                                        showHeader: false,
                                        placement: sap.m.PlacementType.Bottom,
                                        content: [
                                            new sap.m.Button("", {
                                                text: ibas.i18n.prop("shell_help"),
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://sys-help",
                                                press: function () {
                                                    that.fireViewEvents(that.helpEvent);
                                                    popover.close();
                                                }
                                            }),
                                            new sap.m.Button("", {
                                                text: ibas.i18n.prop("shell_about"),
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://world",
                                                press: function () {
                                                    that.fireViewEvents(that.aboutEvent);
                                                    popover.close();
                                                }
                                            }),
                                            new sap.m.Button("", {
                                                text: ibas.i18n.prop("shell_logout"),
                                                type: sap.m.ButtonType.Transparent,
                                                icon: "sap-icon://system-exit",
                                                visible: !ibas.config.get(c_2.CONFIG_ITEM_NO_LOGOUT, false),
                                                press: function () {
                                                    that.fireViewEvents(that.closeEvent);
                                                }
                                            })
                                        ]
                                    });
                                    popover.addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                    popover.openBy(event.getSource(), true);
                                }
                            }),
                        ]
                    });
                    // 消息历史框
                    this.messageHistory = new sap.m.MessagePopover("", {
                        initiallyExpanded: false,
                        placement: sap.m.VerticalPlacementType.Top,
                    });
                    // 消息条
                    this.messagePopover = new sap.m.Popover("", {
                        contentWidth: "auto",
                        showHeader: false,
                        placement: sap.m.PlacementType.HorizontalPreferredRight,
                    });
                    this.messagePopover.addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                    this.navigation = new sap.tnt.SideNavigation("", {
                        item: new sap.tnt.NavigationList(),
                        fixedItem: new sap.tnt.NavigationList("", {
                            items: [
                                new sap.tnt.NavigationListItem("", {
                                    text: ibas.i18n.prop("shell_messages_history"),
                                    icon: "sap-icon://message-popup",
                                    select: function (event) {
                                        that.messageHistory.openBy(event.getSource());
                                    }
                                }),
                            ],
                        })
                    });
                    this.pageContainer = new sap.m.NavContainer("", {
                        autoFocus: false,
                        pages: [
                            this.drawWelcomePage()
                        ],
                        afterNavigate() {
                            let page = this.getCurrentPage();
                            if (page instanceof sap.m.Page) {
                                if (page.getShowHeader() === false && page.getCustomData().length > 0) {
                                    // 全屏模式
                                    let title = sap.ui.getCore().byId(UI_MAIN_TITLE);
                                    if (title instanceof sap.m.Title) {
                                        title.setVisible(true);
                                        title.setText(page.getTitle());
                                    }
                                    let button = sap.ui.getCore().byId(UI_MAIN_BACK);
                                    if (button instanceof sap.m.Button) {
                                        button.setVisible(true);
                                    }
                                    if (mainPage.getSideExpanded() === false && ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE) {
                                        // 手机模式，全屏时隐藏menu按钮
                                        let button = sap.ui.getCore().byId(UI_MAIN_MENU);
                                        if (button instanceof sap.m.Button) {
                                            button.setVisible(false);
                                        }
                                    }
                                }
                                // 切换hash值
                                for (let item of page.getCustomData()) {
                                    if (ibas.strings.equals(item.getKey(), ui_2.UI_DATA_KEY_HASH)) {
                                        let data = item.getValue();
                                        if (typeof data === "string") {
                                            if (!(ibas.strings.equals(data, window.location.hash))) {
                                                window.history.pushState(null, null, data);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            else if (page instanceof sap.m.MessagePage) {
                                let button = sap.ui.getCore().byId(UI_MAIN_MENU);
                                if (button instanceof sap.m.Button) {
                                    button.setVisible(true);
                                }
                                let title = sap.ui.getCore().byId(UI_MAIN_TITLE);
                                if (title instanceof sap.m.Title) {
                                    title.setVisible(false);
                                    title.setText(null);
                                }
                                button = sap.ui.getCore().byId(UI_MAIN_BACK);
                                if (button instanceof sap.m.Button) {
                                    button.setVisible(false);
                                }
                                // 切换hash值
                                window.history.pushState(null, null, "#");
                            }
                        },
                    });
                    mainPage.setHeader(this.mainHeader);
                    mainPage.setSideContent(this.navigation);
                    mainPage.addMainContent(this.pageContainer);
                    return mainPage;
                }
                /** 创建窗体容器页 */
                drawPage(view) {
                    let page = new sap.m.Page("", {
                        title: ibas.strings.isEmpty(view.title) ? view.id : view.title,
                        enableScrolling: false,
                        showNavButton: false,
                        customData: [
                            new sap.ui.core.CustomData("", {
                                key: ui_2.UI_DATA_KEY_VIEW,
                                value: view,
                                writeToDom: false,
                            }),
                            new sap.ui.core.CustomData("", {
                                key: ui_2.UI_DATA_KEY_HASH,
                                value: window.location.hash,
                                writeToDom: false,
                            })
                        ]
                    });
                    // 全屏，当前平台
                    let fullScreen = ibas.config.get(ibas.strings.format(c_2.CONFIG_ITEM_FULL_SCREEN_ON_PLANTFORM, ibas.enums.toString(ibas.emPlantform, ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM))));
                    // 全屏，整体
                    if (ibas.objects.isNull(fullScreen)) {
                        fullScreen = ibas.config.get(c_2.CONFIG_ITEM_FULL_SCREEN, false);
                    }
                    if (fullScreen) {
                        // 全屏
                        page.setShowHeader(false);
                    }
                    else {
                        // 非全屏
                        // 退出钮
                        page.addHeaderContent(new sap.m.Button("", {
                            icon: "sap-icon://inspect-down",
                            tooltip: ibas.i18n.prop("shell_close_view"),
                            type: sap.m.ButtonType.Transparent,
                            press: function () {
                                if (view.closeEvent instanceof Function) {
                                    if (view instanceof ibas.View) {
                                        view.closeEvent.apply(view.application);
                                    }
                                    else {
                                        view.closeEvent();
                                    }
                                }
                            }
                        }));
                        // 接管title属性定义
                        Object.defineProperty(view, "title", {
                            get: function () {
                                return page.getTitle();
                            },
                            set: function (value) {
                                page.setTitle(value);
                            }
                        });
                    }
                    return page;
                }
                /** 创建欢迎页 */
                drawWelcomePage() {
                    let name = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_NAME);
                    if (ibas.objects.isNull(name)) {
                        name = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE);
                    }
                    if (ibas.objects.isNull(name)) {
                        name = ibas.i18n.prop("shell_user_unknown");
                    }
                    let welcomeImage = ibas.config.get(c_2.CONFIG_ITEM_WELCOME_PAGE_IMAGE);
                    if (ibas.strings.isEmpty(welcomeImage)) {
                        welcomeImage = "sap-icon://hello-world";
                    }
                    else if (welcomeImage.startsWith("sap-icon://")) {
                        // sap图标
                    }
                    else if (welcomeImage.startsWith("https://") || welcomeImage.startsWith("http://")) {
                        // 网络图标
                    }
                    else {
                        // 补全地址，shell目录内
                        welcomeImage = ibas.urls.rootUrl(shell.app.Console.ROOT_FILE_NAME) + "/" + welcomeImage;
                    }
                    let viewContent = new sap.m.MessagePage("", {
                        text: ibas.i18n.prop("shell_welcome_page", name, ibas.config.get(shell.app.CONFIG_ITEM_APPLICATION_NAME, ibas.i18n.prop("shell_name"))),
                        customDescription: new sap.m.Link("", {
                            target: "_blank",
                            text: ibas.config.get(c_2.CONFIG_ITEM_WELCOME_PAGE_URL),
                            href: ibas.config.get(c_2.CONFIG_ITEM_WELCOME_PAGE_URL)
                        }),
                        description: "",
                        showHeader: false,
                        showNavButton: false,
                        icon: welcomeImage,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return viewContent;
                }
                /** 显示状态消息 */
                showStatusMessage(type, message) {
                    // 记录历史消息
                    message = message.replace(/\{(.+?)\}/g, function (value) {
                        return ibas.businessobjects.describe(value);
                    });
                    let uiType = openui5.utils.toMessageType(type);
                    this.messageHistory.insertItem(new sap.m.MessagePopoverItem("", {
                        type: uiType,
                        title: message,
                    }).setTitle(message), 0);
                    if (ibas.objects.isNull(this.messageCount)) {
                        this.messageCount = ibas.config.get(c_2.CONFIG_ITEM_MAX_MESSAGE_COUNT, 50);
                    }
                    if (this.messageHistory.getItems().length > this.messageCount) {
                        this.messageHistory.removeItem(this.messageHistory.getItems().length - 1);
                    }
                    this.messageTime = ibas.dates.now().getTime();
                    // 视图没有显示，则不显示消息
                    if (this.isDisplayed === false) {
                        return;
                    }
                    this.messagePopover.destroyContent();
                    this.messagePopover.addContent(new sap.m.MessageStrip("", {
                        type: uiType,
                        showIcon: true,
                        showCloseButton: false
                    }).setText(message));
                    if (!this.messagePopover.isOpen()) {
                        this.messagePopover.openBy(this.navigation.getFixedItem(), true);
                    }
                    // 延迟清除消息
                    if (ibas.objects.isNull(this.statusDelay)) {
                        this.statusDelay = ibas.config.get(c_2.CONFIG_ITEM_STATUS_MESSAGES_DELAY, 2) * 1000;
                    }
                    setTimeout(() => {
                        if (ibas.dates.now().getTime() >= (this.messageTime + this.statusDelay)) {
                            if (this.messagePopover.isOpen()) {
                                this.messagePopover.close();
                            }
                        }
                    }, this.statusDelay);
                }
                /** 对话消息 */
                showMessageBox(caller) {
                    sap.extension.m.MessageBox.show(caller.message, {
                        type: caller.type,
                        title: caller.title,
                        actions: caller.actions,
                        onCompleted: caller.onCompleted,
                    });
                }
                /** 显示模块 */
                showModule(module) {
                    let nvList = this.navigation.getItem();
                    nvList.addItem(new sap.tnt.NavigationListItem("", {
                        key: module.name,
                        text: module.description,
                        icon: module.icon,
                        expanded: false,
                        visible: !ibas.config.get(c_2.CONFIG_ITEM_HIDE_NO_FUNCTION_MODULE, true),
                        select() {
                            // 展开菜单
                            this.setExpanded(!this.getExpanded());
                        }
                    }));
                    // 延迟排序模块
                    if (ibas.objects.isNull(this.statusDelay)) {
                        this.statusDelay = ibas.config.get(c_2.CONFIG_ITEM_STATUS_MESSAGES_DELAY, 2) * 1000;
                    }
                    // 计算模块位置并添加
                    if (ibas.objects.isNull(this.moduleTime)) {
                        this.moduleTime = ibas.dates.now().getTime();
                        setTimeout(() => {
                            if (ibas.dates.now().getTime() >= this.messageTime + this.statusDelay / 2) {
                                this.messageTime = ibas.dates.now().getTime();
                                this.showStatusMessage(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_sorting_modules"));
                                let items = new ibas.ArrayList();
                                items.add(nvList.getItems());
                                items = items.sort((c, b) => {
                                    return c.getKey().localeCompare(b.getKey());
                                });
                                nvList.removeAllItems();
                                for (let item of items) {
                                    nvList.addItem(item);
                                }
                                // 重置
                                delete (this.moduleTime);
                            }
                        }, this.statusDelay / 2);
                    }
                    else {
                        this.moduleTime = ibas.dates.now().getTime();
                    }
                }
                /** 显示模块功能 */
                showModuleFunction(module, func) {
                    let nvList = this.navigation.getItem();
                    let nvItem = null;
                    for (let item of nvList.getItems()) {
                        if (item.getKey() === module) {
                            nvItem = item;
                            break;
                        }
                    }
                    if (ibas.objects.isNull(nvItem)) {
                        throw new Error(ibas.strings.format("not found module [{0}].", module));
                    }
                    // 设置模块可见
                    nvItem.setVisible(true);
                    let mdNVItem = nvItem;
                    if (ibas.config.get(c_2.CONFIG_ITEM_GROUP_FUNCTONS, false) && !ibas.strings.isEmpty(func.category)) {
                        // 菜单分组
                        for (let item of nvItem.getItems()) {
                            if (item.getKey() === ibas.strings.format("{0}_{1}", nvItem.getKey(), func.category)) {
                                mdNVItem = item;
                                break;
                            }
                        }
                        if (mdNVItem === nvItem) {
                            // 不存在分组，新建一个
                            mdNVItem = new sap.tnt.NavigationListItem("", {
                                key: ibas.strings.format("{0}_{1}", nvItem.getKey(), func.category),
                                text: ibas.i18n.prop(func.category),
                                expanded: false,
                                hasExpander: true,
                            });
                            nvItem.addItem(mdNVItem);
                        }
                    }
                    mdNVItem.addItem(new sap.tnt.NavigationListItem("", {
                        key: func.name,
                        text: func.description,
                        select() {
                            ibas.urls.changeHash(ibas.strings.format("{0}{1}", ibas.URL_HASH_SIGN_FUNCTIONS, func.id));
                        }
                    }));
                }
                /** 设置忙状态 */
                busyView(view, busy, msg) {
                    let ui = sap.ui.getCore().byId(view.id);
                    if (ui instanceof sap.m.Page) {
                        // 视图自身可设置忙状态
                        for (let item of ui.getContent()) {
                            if (item instanceof sap.m.SplitContainer) {
                                let page = item.getCurrentMasterPage();
                                if (page instanceof sap.ui.core.Control) {
                                    page.setBusy(busy);
                                }
                                page = item.getCurrentDetailPage();
                                if (page instanceof sap.ui.core.Control) {
                                    page.setBusy(busy);
                                }
                            }
                            else {
                                if (item.getBusy() !== busy) {
                                    item.setBusy(busy);
                                }
                            }
                        }
                    }
                    else if (ui instanceof sap.m.TabContainerItem) {
                        for (let item of ui.getContent()) {
                            if (item.getBusy() !== busy) {
                                item.setBusy(busy);
                            }
                        }
                    }
                    else if (ui instanceof sap.m.Dialog) {
                        for (let item of ui.getContent()) {
                            if (item.getBusy() !== busy) {
                                item.setBusy(busy);
                            }
                        }
                    }
                    else {
                        // 视图不能设置忙状态，使用全局对话框
                        let busyDialog = sap.ui.getCore().byId(UI_BUSY_DIALOG);
                        if (busy === true) {
                            if (!(busyDialog instanceof sap.m.BusyDialog)) {
                                busyDialog = new sap.m.BusyDialog(UI_BUSY_DIALOG, {
                                    title: view.title,
                                    text: msg
                                });
                            }
                            busyDialog.open();
                        }
                        else {
                            if (busyDialog instanceof sap.m.BusyDialog) {
                                busyDialog.destroy();
                            }
                        }
                    }
                }
                /** 显示视图 */
                showView(view) {
                    if (view instanceof ibas.DialogView) {
                        // 对话框视图
                        this.showDialogView(view);
                    }
                    else if (view instanceof ibas.BarView) {
                        // 工具条视图
                        this.showBarView(view);
                    }
                    else if (view instanceof shell.app.ShellView) {
                        this.showShellView(view);
                    }
                    else if (view instanceof ibas.TabView) {
                        // 页签视图
                        let page = this.pageContainer.getCurrentPage();
                        let container = page instanceof sap.m.Page ? page.getContent()[0] : null;
                        if (!(page instanceof sap.m.Page && container instanceof sap.m.TabContainer)) {
                            page = new sap.m.Page("", {
                                showHeader: false,
                            });
                            let pageContainer = this.pageContainer;
                            container = new sap.m.TabContainer("", {
                                itemClose: function () {
                                    view.closeEvent.apply(view.application);
                                    if (container.getItems().length === 1) {
                                        setTimeout(() => {
                                            pageContainer.back(null);
                                            container.destroy();
                                        }, 100);
                                    }
                                }
                            });
                            page.addContent(container);
                            pageContainer.addPage(page);
                            setTimeout(() => pageContainer.to(page.getId()), 100);
                        }
                        let containerItem = new sap.m.TabContainerItem("", {
                            name: view.title,
                            key: view.id,
                            modified: false,
                            content: [
                                view.draw()
                            ],
                            customData: [
                                new sap.ui.core.CustomData("", {
                                    key: ui_2.UI_DATA_KEY_VIEW,
                                    value: view,
                                    writeToDom: false,
                                })
                            ]
                        });
                        view.id = containerItem.getId();
                        container.addItem(containerItem);
                        container.setSelectedItem(containerItem);
                    }
                    else {
                        // 主页面中的视图
                        // 获取历史视图
                        let container = this.pageContainer.getPage(view.id);
                        if (ibas.objects.isNull(container)) {
                            // 不存在历史，绘制新的
                            container = this.drawPage(view);
                            if (view instanceof ibas.UrlView) {
                                // 视图为地址视图
                                this.showUrlView(view, container);
                            }
                            else if (view instanceof ibas.View) {
                                // 一般视图
                                this.showCommonView(view, container);
                            }
                            else {
                                throw new Error(ibas.i18n.prop("shell_invalid_ui"));
                            }
                            view.id = container.getId();
                            let pageContainer = this.pageContainer.addPage(container);
                            setTimeout(() => pageContainer.to(container.getId()), 100);
                        }
                        else {
                            // 存在页面直接跳转
                            this.pageContainer.backToPage(container.getId());
                        }
                    }
                    if (view instanceof ibas.View) {
                        ibas.views.displayed.call(view);
                    }
                }
                showShellView(view) {
                    let app = sap.ui.getCore().byId(ui_2.UI_APP);
                    if (app instanceof sap.m.App) {
                        view.showQueryPanel = (view, embeddedView) => {
                            this.showQueryPanel(view, embeddedView);
                        };
                        view.showDialogView = (view) => {
                            this.showDialogView(view);
                        };
                        let page = new sap.m.Page("", {
                            enableScrolling: false,
                            showHeader: false,
                            showSubHeader: false,
                            showNavButton: false,
                            customData: [
                                new sap.ui.core.CustomData("", {
                                    key: ui_2.UI_DATA_KEY_VIEW,
                                    value: view,
                                    writeToDom: false,
                                }),
                            ],
                            content: [
                                view.draw()
                            ]
                        });
                        app.addPage(page);
                        app.to(page.getId());
                        view.id = page.getId();
                    }
                    else {
                        throw new Error("Method not implemented.");
                    }
                }
                /** 显示对话框视图 */
                showDialogView(view) {
                    let title;
                    // 设置标题
                    if (!ibas.objects.isNull(view.title)) {
                        title = view.title;
                    }
                    else if (!ibas.objects.isNull(view.id)) {
                        title = view.id;
                    }
                    let viewContent = view.draw();
                    if (!(viewContent instanceof sap.m.Dialog)) {
                        viewContent = new sap.extension.m.Dialog("", {
                            title: title,
                            type: sap.m.DialogType.Standard,
                            state: sap.ui.core.ValueState.None,
                            // resizable: true,
                            // draggable: true,
                            stretchOnPhone: true,
                            horizontalScrolling: true,
                            verticalScrolling: true,
                            content: [
                                viewContent
                            ],
                            buttons: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_confirm"),
                                    press() {
                                        view.confirm();
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_exit"),
                                    press() {
                                        if (view.closeEvent instanceof Function) {
                                            view.closeEvent.apply(view.application);
                                        }
                                    }
                                })
                            ]
                        });
                    }
                    // 修改id号
                    view.id = viewContent.getId();
                    viewContent.open();
                    // 添加查询面板
                    if (view instanceof ibas.BOQueryView || view instanceof ibas.BOQueryDialogView) {
                        let queryView = {
                            /** 嵌入查询面板 */
                            embedded(view) {
                                viewContent.setSubHeader(null);
                                viewContent.setSubHeader(view);
                            }
                        };
                        this.showQueryPanel(view, queryView);
                    }
                }
                /** 显示工具条视图 */
                showBarView(view) {
                    let viewContent = view.draw();
                    if (viewContent instanceof sap.m.QuickView) {
                        // 快速视图
                        viewContent.attachAfterClose(null, function () {
                            ibas.views.closed.call(view);
                        });
                        view.id = viewContent.getId();
                        viewContent.openBy(sap.ui.getCore().byId(view.barId));
                    }
                    else if (viewContent instanceof sap.m.Dialog) {
                        // 对话框视图
                        // 添加关闭事件
                        viewContent.attachAfterClose(null, function () {
                            ibas.views.closed.call(view);
                        });
                        view.id = viewContent.getId();
                        viewContent.open();
                    }
                    else if (viewContent instanceof sap.ui.core.Control) {
                        // 弹出层
                        let popover;
                        if (viewContent instanceof sap.m.ResponsivePopover) {
                            popover = viewContent;
                        }
                        else {
                            popover = new sap.m.ResponsivePopover("", {
                                showHeader: false,
                                placement: sap.m.PlacementType.Bottom,
                                content: [viewContent]
                            });
                        }
                        // 添加关闭事件
                        popover.attachAfterClose(null, function () {
                            // 设置视图未显示
                            ibas.views.closed.call(view);
                            popover.destroy(false);
                        });
                        // 设置视图紧凑
                        popover.addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                        view.id = popover.getId();
                        popover.openBy(sap.ui.getCore().byId(view.barId));
                    }
                    else {
                        setTimeout(function () {
                            ibas.views.closed.call(view);
                        }, 100);
                    }
                }
                /** 显示地址视图 */
                showUrlView(view, container) {
                    if (view.isInside) {
                        // 内部打开
                        // 添加外部打开钮
                        container.insertHeaderContent(new sap.m.Button("", {
                            icon: "sap-icon://forward",
                            tooltip: ibas.i18n.prop("shell_jump"),
                            type: sap.m.ButtonType.Transparent,
                            press: function () {
                                window.open(view.url);
                            }
                        }), 0);
                        let viewContent = new sap.ui.core.HTML("", {
                            content: ibas.strings.format(`<iframe src="{0}" width="99%" height="99%" scrolling="no"></iframe>`, view.url),
                            preferDOM: true,
                            sanitizeContent: false,
                            visible: true,
                        });
                        container.addContent(viewContent);
                    }
                    else {
                        // 外部打开
                        let viewContent = new sap.m.MessagePage("", {
                            customDescription: new sap.m.Link("", {
                                target: "_blank",
                                text: view.url,
                                href: view.url
                            }),
                            text: ibas.i18n.prop("shell_url_new_window_opened"),
                            description: "",
                            // title: "",
                            showHeader: false,
                            showNavButton: false,
                            icon: "sap-icon://documents",
                            textDirection: sap.ui.core.TextDirection.Inherit
                        });
                        container.addContent(viewContent);
                        window.open(view.url);
                    }
                }
                /** 显示一般视图 */
                showCommonView(view, container) {
                    let viewContent = view.draw();
                    if (view instanceof ibas.BOQueryView) {
                        // 添加查询面板
                        let queryView = {
                            /** 嵌入查询面板 */
                            embedded(view) {
                                container.setSubHeader(null);
                                container.setSubHeader(view);
                                container.setShowSubHeader(true);
                            }
                        };
                        this.showQueryPanel(view, queryView);
                    }
                    container.addContent(viewContent);
                }
                /** 显示查询面板 */
                showQueryPanel(view, embeddedView) {
                    let queryPanel = new shell.app.QueryPanel();
                    if (ibas.objects.isNull(queryPanel)) {
                        // 查询面板无效，不添加
                        this.showStatusMessage(ibas.emMessageType.ERROR, ibas.i18n.prop("shell_invalid_query_panel"));
                    }
                    else {
                        // 设置视图导航
                        queryPanel.navigation = this.application.navigation;
                        queryPanel.viewShower = this.application;
                        // 判断面板嵌入位置
                        if (view instanceof ibas.BOQueryViewWithPanel) {
                            // 视图继承嵌入接口
                            embeddedView = view;
                        }
                        // 查询面板位置，先添加提示
                        let strip = new sap.m.Toolbar("", {
                            design: sap.m.ToolbarDesign.Auto,
                            content: [
                                new sap.m.MessageStrip("", {
                                    text: ibas.i18n.prop("shell_initialize_query_panel"),
                                    type: sap.ui.core.MessageType.Warning
                                })
                            ]
                        });
                        embeddedView.embedded(strip);
                        // 运行查询面板，初始化完成添加到视图
                        // 监听查询面板
                        queryPanel.register(view);
                        queryPanel.run(function () {
                            // 清理提示
                            strip.destroy(true);
                            // 嵌入查询面板
                            embeddedView.embedded(queryPanel.view.drawBar());
                            // 嵌入刷新条
                            if (typeof view.embeddedPuller === "function") {
                                view.embeddedPuller(queryPanel.view.drawPuller());
                            }
                            // 触发工具条显示完成事件
                            queryPanel.view.barShowedEvent.apply(queryPanel);
                            // 如果自动查询，则调用
                            if (view.autoQuery === true) {
                                queryPanel.view.searchEvent.apply(queryPanel);
                            }
                        });
                    }
                }
                /** 显示常驻视图 */
                showResidentView(view) {
                    let bar = view.drawBar();
                    if (bar instanceof sap.ui.core.Control) {
                        view.barId = bar.getId();
                        this.mainHeader.insertContent(bar, this.mainHeader.getContent().length - 1);
                        // 触发工具条显示完成事件
                        if (view instanceof ibas.BarView) {
                            view.barShowedEvent.apply(view.application);
                        }
                    }
                }
                /** 清理资源 */
                destroyView(view) {
                    if (ibas.objects.isNull(view)) {
                        return;
                    }
                    if (view instanceof CenterView) {
                        // 自身销毁，从浏览器缓存刷新页面
                        document.location.replace(document.location.origin + document.location.pathname);
                        view.isDisplayed = false;
                        view.onClosed();
                        return;
                    }
                    let viewContent = sap.ui.getCore().byId(view.id);
                    if (viewContent instanceof sap.m.TabContainerItem) {
                        // 页签的不做处理
                    }
                    else if (viewContent instanceof sap.m.Dialog) {
                        viewContent.close();
                        viewContent.destroy();
                    }
                    else if (!ibas.objects.isNull(viewContent)) {
                        let parent = viewContent.getParent();
                        if (parent instanceof sap.m.NavContainer) {
                            parent.back(null);
                            viewContent.destroy();
                        }
                        viewContent.destroy(true);
                    }
                    if (view instanceof ibas.View) {
                        ibas.views.closed.call(view);
                    }
                }
                /** 地址栏哈希值变化 */
                onHashChanged(event) {
                    if (ibas.objects.isNull(event) || ibas.objects.isNull(event.newURL)) {
                        return;
                    }
                    if (event.newURL.indexOf(ibas.URL_HASH_SIGN_VIEWS) >= 0) {
                        let url = event.newURL.substring(event.newURL.indexOf(ibas.URL_HASH_SIGN_VIEWS) + ibas.URL_HASH_SIGN_VIEWS.length);
                        let viewId = url.substring(0, url.indexOf("/"));
                        for (let item of this.pageContainer.getPages()) {
                            if (!(ibas.strings.equals(item.getId(), viewId))) {
                                continue;
                            }
                            for (let cusData of item.getCustomData()) {
                                if (!(ibas.strings.equals(cusData.getKey(), ui_2.UI_DATA_KEY_VIEW))) {
                                    continue;
                                }
                                let data = cusData.getValue();
                                if (data instanceof ibas.View) {
                                    // 通知视图事件
                                    ibas.views.hashChanged.call(data, event);
                                }
                                break;
                            }
                            break;
                        }
                    }
                    else if (event.newURL.indexOf(ibas.URL_HASH_SIGN_FUNCTIONS) >= 0) {
                        let url = event.newURL.substring(event.newURL.indexOf(ibas.URL_HASH_SIGN_FUNCTIONS) + ibas.URL_HASH_SIGN_FUNCTIONS.length);
                        let index = url.indexOf("/") < 0 ? url.length : url.indexOf("/");
                        this.fireViewEvents(this.activateFunctionEvent, url.substring(0, index));
                    }
                }
                currentPageView() {
                    let page = this.pageContainer.getCurrentPage();
                    if (ibas.objects.isNull(page)) {
                        return;
                    }
                    if (page instanceof sap.m.Page && page.getContent()[0] instanceof sap.m.TabContainer) {
                        // 当前页面是页签时，则为选中的页签
                        page = page.getContent()[0];
                        if (page instanceof sap.m.TabContainer) {
                            page = sap.ui.getCore().byId(page.getSelectedItem());
                            if (ibas.objects.isNull(page)) {
                                return;
                            }
                        }
                    }
                    for (let item of page.getCustomData()) {
                        if (ibas.strings.equals(item.getKey(), ui_2.UI_DATA_KEY_VIEW)) {
                            let data = item.getValue();
                            if (data instanceof ibas.View) {
                                return data;
                            }
                        }
                    }
                    return;
                }
                /** 按钮按下时 */
                onKeyDown(event) {
                    // 获取当前窗体
                    let view = this.currentPageView();
                    if (!ibas.objects.isNull(view)) {
                        ibas.views.keyDown.call(view, event);
                    }
                }
                /** 当手指移动时 */
                onTouchMove(direction, event) {
                    // 获取当前窗体
                    let view = this.currentPageView();
                    if (!ibas.objects.isNull(view)) {
                        ibas.views.touchMove.call(view, direction, event);
                    }
                }
            }
            c_2.CenterView = CenterView;
        })(c = ui_2.c || (ui_2.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        let c;
        (function (c) {
            /**
             * 视图-查询面板
             */
            class QueryPanelView extends ibas.PanelView {
                /** 查询内容 */
                get searchContent() {
                    return this.search.getValue();
                }
                set searchContent(value) {
                    this.search.setValue(value);
                }
                /** 查询内容 */
                get usingQuery() {
                    return this.baseOn.getSelectedKey();
                }
                set usingQuery(value) {
                    this.baseOn.setSelectedKey(value);
                }
                /** 绘制工具条视图 */
                drawBar() {
                    let that = this;
                    return new sap.m.Toolbar("", {
                        width: "100%",
                        design: sap.m.ToolbarDesign.Auto,
                        content: [
                            this.search = new sap.m.SearchField("", {
                                search: function () {
                                    that.fireViewEvents(that.searchEvent);
                                }
                            }),
                            this.baseOn = new sap.m.Select("", {
                                width: "55%",
                                maxWidth: "55%",
                                visible: this.selectable
                            }),
                            this.config = new sap.m.Button("", {
                                icon: "sap-icon://filter",
                                type: sap.m.ButtonType.Transparent,
                                press: function () {
                                    that.fireViewEvents(that.showFullViewEvent);
                                },
                                visible: this.configurable
                            })
                        ]
                    });
                }
                /** 绘制拉动条视图 */
                drawPuller() {
                    let that = this;
                    return new sap.m.PullToRefresh("", {
                        refresh: function (event) {
                            that.fireViewEvents(that.searchEvent);
                        }
                    });
                }
                /** 显示可用查询 */
                showQueries(datas) {
                    this.baseOn.removeAllItems();
                    for (let item of datas) {
                        this.baseOn.addItem(new sap.ui.core.Item("", {
                            key: item.key,
                            text: item.value
                        }));
                    }
                    if (this.baseOn.getItems().length > 0) {
                        this.baseOn.setSelectedKey("0");
                    }
                }
                /** 显示查询内容 */
                showQuery(data) {
                    this.boName = data.target;
                    this.form.setModel(new sap.ui.model.json.JSONModel(data));
                }
                /** 显示查询条件 */
                showQueryConditions(datas) {
                    if (ibas.objects.isNull(this.table)) {
                        // 尚未初始化表格
                        if (!ibas.objects.isNull(this.boName)) {
                            let that = this;
                            let boRepository = shell.bo.repository.create();
                            boRepository.fetchBOInfos({
                                boCode: this.boName,
                                onCompleted(opRslt) {
                                    let boInfo = opRslt.resultObjects.firstOrDefault();
                                    if (ibas.objects.isNull(boInfo)) {
                                        that.table = that.createTable([]);
                                        that.form.addContent(that.table);
                                    }
                                    else {
                                        that.table = that.createTable(boInfo.properties);
                                        that.form.addContent(that.table);
                                    }
                                    that.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                                }
                            });
                        }
                        else {
                            this.table = this.createTable([]);
                            this.form.addContent(this.table);
                            this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                        }
                    }
                    else {
                        this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    }
                }
                getCharListItem(char) {
                    // 获取重复的字符
                    let count = 4;
                    let items = [];
                    items.push(new sap.ui.core.ListItem("", {
                        key: 0,
                        text: "",
                    }));
                    let vChar = char;
                    for (let i = 1; i < count; i++) {
                        items.push(new sap.ui.core.ListItem("", {
                            key: i,
                            text: vChar,
                        }));
                        vChar = vChar + char;
                    }
                    return items;
                }
                getPropertyListItem(properies) {
                    let items = [];
                    items.push(new sap.ui.core.ListItem("", {
                        key: "",
                        text: ibas.i18n.prop("shell_please_chooose_data", ""),
                    }));
                    if (!ibas.objects.isNull(properies)) {
                        for (let property of properies) {
                            if (ibas.strings.isEmpty(property.editType)) {
                                continue;
                            }
                            items.push(new sap.ui.core.ListItem("", {
                                key: property.property,
                                text: property.description,
                            }));
                        }
                    }
                    return items;
                }
                createTable(properies) {
                    let that = this;
                    let table = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_add"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    press: function () {
                                        that.fireViewEvents(that.addQueryConditionEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function () {
                                        let selected = openui5.utils.getSelecteds(that.table).firstOrDefault();
                                        that.fireViewEvents(that.removeQueryConditionEvent, selected);
                                    }
                                })
                            ]
                        }),
                        visibleRowCount: 5,
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_relationship"),
                                width: "100px",
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emConditionRelationship)
                                }).bindProperty("selectedKey", {
                                    path: "relationship",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_bracketopen"),
                                width: "100px",
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: this.getCharListItem("(")
                                }).bindProperty("selectedKey", {
                                    path: "bracketOpen",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_alias"),
                                width: "200px",
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: this.getPropertyListItem(properies)
                                }).bindProperty("selectedKey", {
                                    path: "alias",
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_operation"),
                                width: "140px",
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: openui5.utils.createComboBoxItems(ibas.emConditionOperation)
                                }).bindProperty("selectedKey", {
                                    path: "operation",
                                    type: "sap.ui.model.type.Integer"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_value"),
                                width: "120px",
                                template: new sap.m.Input("", {}).bindProperty("value", {
                                    path: "value"
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("shell_query_condition_bracketclose"),
                                width: "100px",
                                template: new sap.m.Select("", {
                                    width: "100%",
                                    items: this.getCharListItem(")")
                                }).bindProperty("selectedKey", {
                                    path: "bracketClose",
                                    type: "sap.ui.model.type.Integer"
                                })
                            })
                        ]
                    });
                    return table;
                }
                /** 关闭之后 */
                onClosed() {
                    super.onClosed();
                    if (this.form != null) {
                        this.form.destroy(true);
                        this.form = null;
                    }
                    if (this.table != null) {
                        this.table.destroy(true);
                        this.table = null;
                    }
                    this.boName = null;
                }
                /** 绘制视图 */
                draw() {
                    let that = this;
                    this.form = new sap.extension.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.ToolbarSpacer("", { width: "5px" }),
                                new sap.m.Label("", {
                                    text: ibas.i18n.prop("shell_query_name"),
                                }),
                                new sap.m.Input("", {}).bindProperty("value", {
                                    path: "/name"
                                }),
                                new sap.m.ToolbarSpacer("", { width: "15px" }),
                                new sap.m.RatingIndicator("", {
                                    maxValue: 5,
                                    tooltip: ibas.i18n.prop("shell_query_order"),
                                }).bindProperty("value", {
                                    path: "/order"
                                }),
                                new sap.m.ToolbarSpacer("", { width: "5px" })
                            ]
                        }),
                        content: [
                            this.table
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_delete"),
                                type: sap.m.ButtonType.Transparent,
                                // icon: "sap-icon://create",
                                press: function () {
                                    that.fireViewEvents(that.deleteQueryEvent);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_save"),
                                type: sap.m.ButtonType.Transparent,
                                // icon: "sap-icon://accept",
                                press: function () {
                                    that.fireViewEvents(that.saveQueryEvent);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                // icon: "sap-icon://inspect-down",
                                press: function () {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ]
                    });
                    return this.form;
                }
            }
            c.QueryPanelView = QueryPanelView;
        })(c = ui.c || (ui.c = {}));
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./MainView.ts" />
/// <reference path="./LoginView.ts" />
/// <reference path="./WelcomeView.ts" />
/// <reference path="./AboutView.ts" />
/// <reference path="./HelpView.ts" />
/// <reference path="./CenterView.ts" />
/// <reference path="./QueryPanelView.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
/// <reference path="./center/index.ts" />
var shell;
(function (shell) {
    let ui;
    (function (ui) {
        /**
         * 视图导航
         */
        class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            newView(id) {
                let view = null;
                switch (id) {
                    case shell.app.MainApp.APPLICATION_ID:
                        view = new ui.c.MainView();
                        break;
                    case shell.app.WelcomeApp.APPLICATION_ID:
                        view = new ui.c.WelcomeView();
                        break;
                    case shell.app.LoginApp.APPLICATION_ID:
                        view = new ui.c.BigLoginView();
                        break;
                    case shell.app.CenterApp.APPLICATION_ID:
                        view = new ui.c.CenterView();
                        break;
                    case shell.app.AboutApp.APPLICATION_ID:
                        view = new ui.c.AboutView();
                        break;
                    case shell.app.HelpApp.APPLICATION_ID:
                        view = new ui.c.HelpView();
                        break;
                    case shell.app.QueryPanel.APPLICATION_ID:
                        view = new ui.c.QueryPanelView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
        ui.Navigation = Navigation;
    })(ui = shell.ui || (shell.ui = {}));
})(shell || (shell = {}));
//# sourceMappingURL=index.ui.c.js.map