/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path ="../ibas/index.d.ts" />
/// <reference path ="../openui5/types/index.d.ts" />
var loader;
(function (loader) {
    // 解决方法缺失
    if (typeof String.prototype.startsWith === undefined) {
        String.prototype.startsWith = function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        };
    }
    if (typeof String.prototype.endsWith === undefined) {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    // 最小库标记
    loader.SIGN_MIN_LIBRARY = ".min";
    // ibas index路径
    loader.URL_IBAS_INDEX = "ibas/index";
    // ibas 诊断页面路径
    loader.URL_IBAS_DIAGNOSIS = "ibas/diagnosis/index.html";
    let requires;
    (function (requires) {
        /** 运行时标记 */
        requires.runtime = (new Date()).getTime().toString();
        /** 创建require方法 */
        function create() {
            let name = arguments[0], baseUrl = arguments[1], noCache = arguments[2];
            if (noCache) {
                // 不使用缓存
                let runtime = requires.runtime;
                return window.requirejs.config({
                    context: name,
                    baseUrl: baseUrl,
                    urlArgs: function (id, url) {
                        return (url.indexOf("?") === -1 ? "?" : "&") + "_=" + runtime;
                    }
                });
            }
            else {
                return window.requirejs.config({
                    context: name,
                    baseUrl: baseUrl
                });
            }
        }
        requires.create = create;
    })(requires = loader.requires || (loader.requires = {}));
    let openui5;
    (function (openui5) {
        // 官方地址
        openui5.URL_OFFICIAL = "https://openui5.hana.ondemand.com/resources/sap-ui-core.js";
        // 本地路径
        openui5.URL_LOCAL = "openui5/resources/sap-ui-core.js";
        // index路径
        openui5.URL_INDEX = "openui5/index";
        // element标记
        openui5.URL_SCRIPT_ELEMENT_ID = "sap-ui-bootstrap";
        /** 加载 */
        function load(caller) {
            let root = caller.url;
            let domScript = createScriptElement();
            domScript.src = root + openui5.URL_LOCAL;
            // 加载成功
            domScript.onload = domScript.onreadystatechange = function () {
                if (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState) {
                    // 加载扩展库
                    sap.ui.getCore().attachInit(() => {
                        extend(caller);
                    });
                }
            };
            // 加载失败
            domScript.onerror = function () {
                document.getElementById(openui5.URL_SCRIPT_ELEMENT_ID).remove();
                let domScript = createScriptElement();
                domScript.src = openui5.URL_OFFICIAL;
                // 加载成功
                domScript.onload = domScript.onreadystatechange = function () {
                    if (!this.readyState || "loaded" === this.readyState || "complete" === this.readyState) {
                        // 加载扩展库
                        sap.ui.getCore().attachInit(() => {
                            extend(caller);
                        });
                    }
                };
                // 加载失败
                domScript.onerror = function () {
                    if (caller !== undefined && caller !== null) {
                        if (typeof caller === "function") {
                            caller.onError();
                        }
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(domScript);
            };
            document.getElementsByTagName("head")[0].appendChild(domScript);
        }
        openui5.load = load;
        /** 扩展 */
        function extend(caller) {
            requires.create("_", caller.url, caller.noCache)([
                openui5.URL_INDEX + (caller.minLibrary ? loader.SIGN_MIN_LIBRARY : "")
            ], caller.onSuccess, caller.onError);
        }
        openui5.extend = extend;
        /** 创建脚本元素 */
        function createScriptElement() {
            let domScript = document.createElement("script");
            domScript.setAttribute("id", openui5.URL_SCRIPT_ELEMENT_ID);
            domScript.setAttribute("data-sap-ui-bindingSyntax", "complex");
            domScript.setAttribute("data-sap-ui-theme", "sap_belize");
            domScript.setAttribute("data-sap-ui-libs", "sap.m, sap.f, sap.tnt, sap.ui.layout, sap.ui.table, sap.uxap");
            domScript.setAttribute("data-sap-ui-async", "true");
            return domScript;
        }
    })(openui5 = loader.openui5 || (loader.openui5 = {}));
    /** 应用程序 */
    class Application {
        constructor() {
            /** 名称 */
            this.name = "shell";
        }
        /** 运行应用 */
        run() {
            if (typeof arguments[0] === "string") {
                this.root = arguments[0];
            }
            if (this.root === undefined || this.root === null) {
                this.root = document.location.origin
                    + document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/"));
            }
            if (!this.root.endsWith("/")) {
                this.root += "/";
            }
            if (this.ibasRoot === null || this.ibasRoot === undefined) {
                this.ibasRoot = this.root;
            }
            if (this.openui5Root === null || this.openui5Root === undefined) {
                this.openui5Root = this.root;
            }
            requires.create("_", this.ibasRoot, this.noCache)([
                loader.URL_IBAS_INDEX + (this.minLibrary ? loader.SIGN_MIN_LIBRARY : "")
            ], () => {
                // 不使用缓存，设置运行版本
                if (this.noCache === true) {
                    ibas.config.set(ibas.CONFIG_ITEM_RUNTIME_VERSION, requires.runtime);
                }
                // 使用最小库
                if (this.minLibrary === true) {
                    ibas.config.set(ibas.CONFIG_ITEM_USE_MINIMUM_LIBRARY, this.minLibrary);
                }
                // 初始化ibas
                ibas.init(() => {
                    // 加载成功，加载ui5
                    openui5.load({
                        url: this.openui5Root,
                        noCache: this.noCache,
                        minLibrary: this.minLibrary,
                        onError: () => {
                            this.diagnose();
                        },
                        onSuccess: () => {
                            this.show();
                        },
                    });
                });
            }, () => {
                this.diagnose();
            });
        }
        /** 显示视图 */
        show() {
            // 模块require函数
            let require = ibas.requires.create({
                context: ibas.requires.naming(this.name),
                baseUrl: this.root + this.name,
                waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 30)
            });
            require([
                Application.URL_INDEX + (this.minLibrary ? loader.SIGN_MIN_LIBRARY : "")
            ], () => {
                // 加载成功
                let shell = window.shell;
                if (shell === undefined || shell === null) {
                    this.diagnose();
                }
                else {
                    // 加载资源
                    ibas.i18n.load([
                        ibas.strings.format("{0}/languages/openui5.json", ibas.urls.rootUrl("/openui5/index")),
                    ], () => {
                        // 设置语言
                        ibas.i18n.language = sap.ui.getCore().getConfiguration().getLanguageTag();
                        // 重新加载语言
                        ibas.i18n.reload(() => {
                            try {
                                let console = new shell.app.Console();
                                console.module = this.name;
                                console.run();
                            }
                            catch (error) {
                                this.diagnose();
                            }
                        });
                    });
                }
            }, () => {
                this.diagnose();
            });
        }
        /** 诊断错误 */
        diagnose() {
            window.location.href = this.ibasRoot + loader.URL_IBAS_DIAGNOSIS;
        }
    }
    // index路径
    Application.URL_INDEX = "index";
    loader.Application = Application;
})(loader || (loader = {}));
