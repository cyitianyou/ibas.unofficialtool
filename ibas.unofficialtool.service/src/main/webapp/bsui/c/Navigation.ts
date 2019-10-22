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
namespace unofficialtool {
    export namespace ui {
        let require: Require = ibas.requires.create({
            context: ibas.requires.naming(CONSOLE_NAME),
        });
        require([
            "3rdparty/reportbro/ext/autosize",
            "css!3rdparty/reportbro/reportbro",
            "css!3rdparty/reportbro/ext/spectrum",
            "3rdparty/reportbro/ext/JsBarcode.all.min",
            "3rdparty/reportbro/ext/spectrum",
            "3rdparty/reportbro/reportbro"
        ], function (autosize: any): void {
            (window as any).autosize = autosize;
        });
        /** 视图导航 */
        export class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            protected newView(id: string): ibas.IView {
                let view: ibas.IView = null;
                switch (id) {
                    case app.RemoteConfigService.APPLICATION_ID:
                        view = new c.RemoteConfigView();
                        break;
                    case app.PrivilegeConfigApp.APPLICATION_ID:
                        view = new c.PrivilegeConfigView();
                        break;
                    case app.ExportTemplateEditApp.APPLICATION_ID:
                        view = new c.ExportTemplateEditView();
                        break;
                    default:
                        shell.app.modules.forEach(module => {
                            if (module.id === CONSOLE_ID) { return; }
                            if (!!view) { return; }
                            if (module instanceof ibas.ModuleConsole) {
                                let navigation: ibas.IViewNavigation = module.navigation();
                                if (navigation instanceof ibas.ViewNavigation && typeof (navigation as any).newView === "function") {
                                    view = (navigation as any).newView(id);
                                }
                            }
                        });
                        break;
                }
                return view;
            }
        }
    }
}
