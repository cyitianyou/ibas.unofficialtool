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
                this.view.configEvent = this.config;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.view.showConfig();
            }
            /** 设置 */
            private config(data: { url: string, userName: string, password: string, token: string }): void {
                let that: this = this;
                try {
                    if (ibas.strings.isEmpty(data.url)) {
                        throw new Error(ibas.i18n.prop("unofficialtool_msg_config_item_not_null", ibas.i18n.prop("unofficialtool_ui_config_url")));
                    }
                    if (ibas.strings.isEmpty(data.userName)) {
                        throw new Error(ibas.i18n.prop("unofficialtool_msg_config_item_not_null", ibas.i18n.prop("unofficialtool_ui_config_username")));
                    }
                    if (ibas.strings.isEmpty(data.password)) {
                        throw new Error(ibas.i18n.prop("unofficialtool_msg_config_item_not_null", ibas.i18n.prop("unofficialtool_ui_config_password")));
                    }
                    this.busy(true);
                    if (!data.url.endsWith("/")) {
                        data.url += "/";
                    }
                    bOFactory.testConfig({
                        url: data.url,
                        user: data.userName,
                        password: data.password,
                        onCompleted(opRslt: ibas.IOperationResult<shell.bo.IUser>): void {
                            try {
                                that.busy(false);
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let user: shell.bo.IUser = opRslt.resultObjects.firstOrDefault();
                                if (!ibas.objects.isNull(user)) {
                                    ibas.config.set(CONFIG_ITEM_REMOTE_SYSTEM_URL, data.url);
                                    ibas.config.set(CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, user.token);
                                    that.view.showConfig();
                                }
                            } catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                } catch (error) {
                    this.messages(error);
                }
            }
        }
        /** 示例视图-配置远程地址 */
        export interface IRemoteConfigView extends ibas.IView {
            /** 显示视图 */
            showConfig(): void;
            /** 设置事件 */
            configEvent: Function;
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
        export class RemoteConfigFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "18513898-9c46-40f4-a2ba-ed938a9d4f98";
            /** 功能名称 */
            static FUNCTION_NAME = "unofficialtool_app_remoteconfig";
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigFunc.FUNCTION_ID;
                this.name = RemoteConfigFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                ibas.servicesManager.runApplicationService<ibas.IServiceContract>({
                    proxy: new RemoteConfigServiceProxy({
                    })
                });
                return null;
            }
        }
    }
}