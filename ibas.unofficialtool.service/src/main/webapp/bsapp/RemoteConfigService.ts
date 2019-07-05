/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace app {
        /** 示例应用-配置远程地址 */
        export class RemoteConfigService extends ibas.ServiceApplication<IRemoteConfigView, ibas.IServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string = "0d88ef14-8969-466a-8da4-78ba93b9924a";
            /** 应用名称 */
            static APPLICATION_NAME: string = "unofficialtool_app_remoteconfig";
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigService.APPLICATION_ID;
                this.name = RemoteConfigService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 运行服务 */
            runService(contract: ibas.IServiceContract): void {
                this.show();
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
            }
        }
        /** 示例视图-配置远程地址 */
        export interface IRemoteConfigView extends ibas.IView {
        }
        /** 配置远程地址服务 */
        export class RemoteConfigServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigService.APPLICATION_ID;
                this.name = RemoteConfigService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = RemoteConfigServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new RemoteConfigService();
            }
        }
    }
}