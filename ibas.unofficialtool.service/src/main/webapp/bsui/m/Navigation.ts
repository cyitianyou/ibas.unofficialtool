/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
namespace unofficialtool {
    export namespace ui {
        /** 视图导航 */
        export class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            protected newView(id: string): ibas.IView {
                let view: ibas.IView = null;
                switch (id) {
                    default:
                        break;
                }
                return view;
            }
        }
    }
}
