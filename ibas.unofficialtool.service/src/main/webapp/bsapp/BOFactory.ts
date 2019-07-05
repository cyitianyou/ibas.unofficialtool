/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace app {
        /** 配置项-远程系统地址 */
        export const CONFIG_ITEM_REMOTE_SYSTEM_URL: string = "RemoteSystemUrl";
        /** 配置项-远程系统口令 */
        export const CONFIG_ITEM_REMOTE_SYSTEM_TOKEN: string = "RemoteSystemToken";
        export class BOFactory {
            /** 创建远程仓库 */
            public createRepository<B extends ibas.IBORepositoryApplication>(name: string): B {
                let remoteAddress: string = ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, "");
                let remoteToken: string = ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "");
                if (!ibas.strings.isEmpty(remoteAddress) && !ibas.strings.isEmpty(remoteToken)) {
                    let boRepository: B = ibas.boFactory.create<B>(name);
                    boRepository.address = this.toUrl(boRepository.address, remoteAddress);
                    boRepository.token = remoteToken;
                    return boRepository;
                } else {
                    ibas.servicesManager.runApplicationService<ibas.IServiceContract>({
                        proxy: new RemoteConfigServiceProxy({
                        })
                    });
                }
                return null;
            }
            /** 本地仓库地址转换为远程系统仓库地址 */
            protected toUrl(boRepositoryAddress: string, remoteAddress: string): string {
                let boRepository: bo.BORepositoryUnofficialTool = new bo.BORepositoryUnofficialTool();
                let startPart: string = boRepository.address.substring(0, boRepository.address.indexOf("/unofficialtool/"));
                if (!startPart.endsWith("/")) {
                    startPart += "/";
                }
                return boRepositoryAddress.replace(startPart, remoteAddress);
            }
        }
        export const bOFactory: BOFactory = new BOFactory();
    }
}