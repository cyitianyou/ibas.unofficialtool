/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    /** 模块-标识 */
    unofficialtool.CONSOLE_ID = "0732b9f9-6e52-4b5f-bc41-3ce0f4172aa6";
    /** 模块-名称 */
    unofficialtool.CONSOLE_NAME = "UnofficialTool";
    /** 模块-版本 */
    unofficialtool.CONSOLE_VERSION = "0.1.0";
    let bo;
    (function (bo) {
        /** 业务仓库名称 */
        bo.BO_REPOSITORY_UNOFFICIALTOOL = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, unofficialtool.CONSOLE_NAME);
    })(bo = unofficialtool.bo || (unofficialtool.bo = {}));
    let app;
    (function (app) {
        /** 远程配置服务代理 */
        class RemoteConfigServiceProxy extends ibas.ServiceProxy {
        }
        app.RemoteConfigServiceProxy = RemoteConfigServiceProxy;
    })(app = unofficialtool.app || (unofficialtool.app = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./Data.ts" />
/// <reference path="./BORepository.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let bo;
    (function (bo) {
        /** 数据转换者 */
        class DataConverter extends ibas.DataConverter4j {
            /** 创建业务对象转换者 */
            createConverter() {
                return new BOConverter;
            }
        }
        bo.DataConverter = DataConverter;
        /** 模块业务对象工厂 */
        bo.boFactory = new ibas.BOFactory();
        /** 业务对象转换者 */
        class BOConverter extends ibas.BOConverter {
            /** 模块对象工厂 */
            factory() {
                return bo.boFactory;
            }
            /**
             * 自定义解析
             * @param data 远程数据
             * @returns 本地数据
             */
            customParsing(data) {
                return data;
            }
            /**
             * 转换数据
             * @param boName 对象名称
             * @param property 属性名称
             * @param value 值
             * @returns 转换的值
             */
            convertData(boName, property, value) {
                return super.convertData(boName, property, value);
            }
            /**
             * 解析数据
             * @param boName 对象名称
             * @param property 属性名称
             * @param value 值
             * @returns 解析的值
             */
            parsingData(boName, property, value) {
                return super.parsingData(boName, property, value);
            }
        }
    })(bo = unofficialtool.bo || (unofficialtool.bo = {}));
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
    let bo;
    (function (bo) {
        /** 业务对象仓库 */
        class BORepositoryUnofficialTool extends ibas.BORepositoryApplication {
            /** 创建此模块的后端与前端数据的转换者 */
            createConverter() {
                return new bo.DataConverter;
            }
            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller) {
                if (!this.address.endsWith("/")) {
                    this.address += "/";
                }
                let fileRepository = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("upload", caller);
            }
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller) {
                if (!this.address.endsWith("/")) {
                    this.address += "/";
                }
                let fileRepository = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
        }
        bo.BORepositoryUnofficialTool = BORepositoryUnofficialTool;
    })(bo = unofficialtool.bo || (unofficialtool.bo = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../api/index.ts" />
/// <reference path="./DataConverter.ts" />
/// <reference path="./BORepository.ts" />
var unofficialtool;
(function (unofficialtool) {
    let bo;
    (function (bo) {
        // 注册业务对象仓库到工厂
        bo.boFactory.register(bo.BO_REPOSITORY_UNOFFICIALTOOL, bo.BORepositoryUnofficialTool);
        // 注册业务对象到工厂
    })(bo = unofficialtool.bo || (unofficialtool.bo = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let app;
    (function (app) {
        /** 示例应用-配置远程地址 */
        class RemoteConfigService extends ibas.ServiceApplication {
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigService.APPLICATION_ID;
                this.name = RemoteConfigService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 运行服务 */
            runService(contract) {
                this.show();
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
                this.view.configEvent = this.config;
            }
            /** 视图显示后 */
            viewShowed() {
                // 视图加载完成
                this.view.showConfig();
            }
            /** 设置 */
            config(data) {
                let that = this;
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
                    app.bOFactory.testConfig({
                        url: data.url,
                        user: data.userName,
                        password: data.password,
                        onCompleted(opRslt) {
                            try {
                                that.busy(false);
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let user = opRslt.resultObjects.firstOrDefault();
                                if (!ibas.objects.isNull(user)) {
                                    // 设置默认用户口令
                                    ibas.config.set(ibas.CONFIG_ITEM_USER_TOKEN, user.token);
                                    // 更新配置项目
                                    for (let item of opRslt.informations) {
                                        if (ibas.strings.equalsIgnoreCase(item.tag, "CONFIG_ITEM")) {
                                            if (ibas.strings.equalsIgnoreCase(item.name, ibas.CONFIG_ITEM_COMPANY)) {
                                                // 设置公司代码
                                                ibas.config.set(ibas.CONFIG_ITEM_COMPANY, item.content);
                                            }
                                            if (ibas.strings.equalsIgnoreCase(item.name, ibas.CONFIG_ITEM_APPROVAL_WAY)) {
                                                // 设置审批方法
                                                ibas.config.set(ibas.CONFIG_ITEM_APPROVAL_WAY, item.content);
                                            }
                                            if (ibas.strings.equalsIgnoreCase(item.name, ibas.CONFIG_ITEM_ORGANIZATION_WAY)) {
                                                // 设置组织方式
                                                ibas.config.set(ibas.CONFIG_ITEM_ORGANIZATION_WAY, item.content);
                                            }
                                            if (ibas.strings.equalsIgnoreCase(item.name, ibas.CONFIG_ITEM_OWNERSHIP_WAY)) {
                                                // 设置权限判断方式
                                                ibas.config.set(ibas.CONFIG_ITEM_OWNERSHIP_WAY, item.content);
                                            }
                                        }
                                    }
                                    // 注册运行变量
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_ID, user.id);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_CODE, user.code);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_NAME, user.name);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_SUPER, user.super);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_BELONG, user.belong);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_TOKEN, user.token);
                                    ibas.variablesManager.register(ibas.VARIABLE_NAME_USER_IDENTITIES, user.identities);
                                    ibas.config.set(app.CONFIG_ITEM_REMOTE_SYSTEM_URL, data.url);
                                    ibas.config.set(app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, user.token);
                                    ibas.config.get = function () {
                                        let value = ibas.Configuration.prototype.get.apply(ibas.config, arguments);
                                        let key = arguments[0];
                                        if (key.startsWith("repositoryAddress|")) {
                                            value = ibas.urls.normalize(value);
                                            value = value.replace(ibas.urls.rootUrl() + "/", data.url);
                                        }
                                        return value;
                                    };
                                    that.view.showConfig();
                                }
                            }
                            catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                }
                catch (error) {
                    this.messages(error);
                }
            }
        }
        /** 应用标识 */
        RemoteConfigService.APPLICATION_ID = "0d88ef14-8969-466a-8da4-78ba93b9924a";
        /** 应用名称 */
        RemoteConfigService.APPLICATION_NAME = "unofficialtool_app_remoteconfig";
        app.RemoteConfigService = RemoteConfigService;
        /** 配置远程地址服务 */
        class RemoteConfigServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigService.APPLICATION_ID;
                this.name = RemoteConfigService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = app.RemoteConfigServiceProxy;
            }
            /** 创建服务实例 */
            create() {
                return new RemoteConfigService();
            }
        }
        app.RemoteConfigServiceMapping = RemoteConfigServiceMapping;
        class RemoteConfigFunc extends ibas.ModuleFunction {
            /** 构造函数 */
            constructor() {
                super();
                this.id = RemoteConfigFunc.FUNCTION_ID;
                this.name = RemoteConfigFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default() {
                ibas.servicesManager.runApplicationService({
                    proxy: new app.RemoteConfigServiceProxy({})
                });
                return null;
            }
        }
        /** 功能标识 */
        RemoteConfigFunc.FUNCTION_ID = "18513898-9c46-40f4-a2ba-ed938a9d4f98";
        /** 功能名称 */
        RemoteConfigFunc.FUNCTION_NAME = "unofficialtool_app_remoteconfig";
        app.RemoteConfigFunc = RemoteConfigFunc;
    })(app = unofficialtool.app || (unofficialtool.app = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var unofficialtool;
(function (unofficialtool) {
    let app;
    (function (app) {
        /** 配置项-远程系统地址 */
        app.CONFIG_ITEM_REMOTE_SYSTEM_URL = "RemoteSystemUrl";
        /** 配置项-远程系统口令 */
        app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN = "RemoteSystemToken";
        class BOFactory {
            /** 创建远程仓库 */
            createRepository(name) {
                let remoteAddress = ibas.config.get(app.CONFIG_ITEM_REMOTE_SYSTEM_URL, "");
                let remoteToken = ibas.config.get(app.CONFIG_ITEM_REMOTE_SYSTEM_TOKEN, "");
                if (!ibas.strings.isEmpty(remoteAddress) && !ibas.strings.isEmpty(remoteToken)) {
                    let boRepository = ibas.boFactory.create(name);
                    boRepository.address = this.toUrl(boRepository.address, remoteAddress);
                    boRepository.token = remoteToken;
                    return boRepository;
                }
                else {
                    ibas.servicesManager.runApplicationService({
                        proxy: new app.RemoteConfigServiceProxy({})
                    });
                }
                return null;
            }
            /** 测试远程配置 */
            testConfig(caller) {
                ibas.config.set(ibas.CONFIG_ITEM_OFFLINE_MODE, false);
                let boRepositoryShell = shell.bo.repository.create().constructor;
                ibas.config.set(ibas.strings.format(ibas.CONFIG_ITEM_TEMPLATE_OFFLINE_MODE, boRepositoryShell.name), false);
                shell.bo.boFactory.register(shell.bo.BO_REPOSITORY_CONNECT, boRepositoryShell);
                shell.bo.boFactory.register(shell.bo.BO_REPOSITORY_SHELL, boRepositoryShell);
                let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_CONNECT);
                boRepository.address = this.toUrl(boRepository.address, caller.url);
                boRepository.userConnect(caller);
            }
            /** 本地仓库地址转换为远程系统仓库地址 */
            toUrl(boRepositoryAddress, remoteAddress) {
                let boRepository = new unofficialtool.bo.BORepositoryUnofficialTool();
                let startPart = boRepository.address.substring(0, boRepository.address.indexOf("/unofficialtool/"));
                if (!startPart.endsWith("/")) {
                    startPart += "/";
                }
                return boRepositoryAddress.replace(startPart, remoteAddress);
            }
        }
        app.BOFactory = BOFactory;
        app.bOFactory = new BOFactory();
    })(app = unofficialtool.app || (unofficialtool.app = {}));
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
    let app;
    (function (app_1) {
        /** 应用-系统权限配置 */
        class PrivilegeConfigApp extends ibas.Application {
            /** 构造函数 */
            constructor() {
                super();
                this.id = PrivilegeConfigApp.APPLICATION_ID;
                this.name = PrivilegeConfigApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                if (!ibas.strings.isEmpty(ibas.config.get(app_1.CONFIG_ITEM_REMOTE_SYSTEM_URL, ""))) {
                    this.view.title = ibas.strings.format("{0}({1})", this.view.title, ibas.config.get(app_1.CONFIG_ITEM_REMOTE_SYSTEM_URL, ""));
                }
                // 其他事件
                this.view.fetchPrivilegesEvent = this.fetchPrivileges;
                this.view.fetchRolesEvent = this.fetchRoles;
                this.view.savePrivilegesEvent = this.savePrivileges;
                this.view.copyPrivilegesEvent = this.copyPrivileges;
                this.view.deletePrivilegesEvent = this.deletePrivileges;
                this.view.editIdentityPrivilegesEvent = this.editIdentityPrivileges;
            }
            /** 视图显示后 */
            viewShowed() {
                // 视图加载完成
                // 加载平台信息，仅使用（桌面和平板，手机）
                let criteria = new ibas.Criteria();
                let condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                condition.relationship = ibas.emConditionRelationship.OR;
                condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.PHONE);
                condition.relationship = ibas.emConditionRelationship.OR;
                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchApplicationPlatform({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            this.view.showPlatforms(opRslt.resultObjects);
                        }
                        catch (error) {
                            this.messages(error);
                        }
                    }
                });
            }
            /** 查询数据 */
            fetchRoles(criteria) {
                this.busy(true);
                let that = this;
                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchRole({
                    criteria: criteria,
                    onCompleted(opRslt) {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                            }
                            that.view.showRoles(opRslt.resultObjects);
                        }
                        catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 查询数据 */
            fetchPrivileges(criteria) {
                this.busy(true);
                let platform = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                let condition = criteria.conditions.firstOrDefault(c => c.alias === initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME);
                if (!ibas.objects.isNull(condition)) {
                    platform = condition.value;
                }
                let role;
                condition = criteria.conditions.firstOrDefault(c => c.alias === initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME);
                if (!ibas.objects.isNull(condition)) {
                    role = condition.value;
                }
                let that = this;
                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchPrivilege({
                    criteria: criteria,
                    onCompleted(opRslt) {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let values = new ibas.ArrayList();
                            shell.app.modules.forEach((module) => {
                                let privilege = opRslt.resultObjects.firstOrDefault(c => c.moduleId === module.id && c.platformId === platform && ibas.strings.isEmpty(c.target));
                                if (ibas.objects.isNull(privilege)) {
                                    privilege = new initialfantasy.bo.Privilege();
                                    privilege.roleCode = role;
                                    privilege.platformId = platform;
                                    privilege.moduleId = module.id;
                                    privilege.authoriseValue = ibas.emAuthoriseType.NONE;
                                }
                                privilege.markOld(); // 权限一样的不保存
                                let uiPrivilege = new Privilege(privilege, initialfantasy.bo.emElementType.MODULE);
                                values.add(uiPrivilege);
                                for (let item of module.elements()) {
                                    privilege = opRslt.resultObjects.firstOrDefault(c => c.moduleId === module.id && c.platformId === platform && c.target === item.id);
                                    if (ibas.objects.isNull(privilege)) {
                                        privilege = new initialfantasy.bo.Privilege();
                                        privilege.roleCode = role;
                                        privilege.platformId = platform;
                                        privilege.moduleId = module.id;
                                        privilege.target = item.id;
                                        privilege.authoriseValue = ibas.emAuthoriseType.ALL;
                                    }
                                    privilege.markOld(); // 权限一样的不保存
                                    if (item instanceof ibas.ModuleFunction) {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.FUNCTION));
                                    }
                                    else if (item instanceof ibas.Application) {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.APPLICATION));
                                    }
                                    else if (item instanceof ibas.ServiceMapping) {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.SERVICE));
                                    }
                                    else {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.OTHER));
                                    }
                                }
                            });
                            that.privileges = ibas.arrays.sort(values, [
                                new ibas.Sort(initialfantasy.bo.Privilege.PROPERTY_MODULEID_NAME, ibas.emSortType.ASCENDING)
                            ]);
                            that.view.showPrivileges(that.privileges);
                        }
                        catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 保存数据 */
            savePrivileges() {
                if (!(this.privileges instanceof Array)) {
                    return;
                }
                this.busy(true);
                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                ibas.queues.execute(this.privileges, (data, next) => {
                    // 仅保存修改过的
                    if (!(data.data.isDirty)) {
                        next();
                    }
                    else {
                        if (!(data.data.objectKey > 0)) {
                            // 没有主键，则认为是新数据
                            data.data.markNew();
                        }
                        boRepository.savePrivilege({
                            beSaved: data.data,
                            onCompleted(opRslt) {
                                if (opRslt.resultCode !== 0) {
                                    next(new Error(opRslt.message));
                                }
                                else {
                                    if (opRslt.resultObjects.length > 0) {
                                        data.data = opRslt.resultObjects.firstOrDefault();
                                    }
                                    else {
                                        data.data.logInst++;
                                        data.data.markOld(true);
                                    }
                                    next();
                                }
                            }
                        });
                    }
                }, (error) => {
                    this.busy(false);
                    if (error instanceof Error) {
                        this.messages(error);
                    }
                    else {
                        this.messages(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                    }
                    this.view.showPrivileges(this.privileges);
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 复制权限  */
            copyPrivileges() {
                if (!(this.privileges instanceof Array)) {
                    return;
                }
                // 选择复制的平台
                let that = this;
                let criteria = new ibas.Criteria();
                let condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                condition.relationship = ibas.emConditionRelationship.OR;
                condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.PHONE);
                condition.relationship = ibas.emConditionRelationship.OR;
                ibas.servicesManager.runChooseService({
                    title: ibas.strings.format("{0}-{1}", ibas.i18n.prop("initialfantasy_copy_from"), ibas.i18n.prop("bo_privilege_platformid")),
                    boCode: initialfantasy.bo.BO_CODE_APPLICATIONPLATFORM,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: criteria,
                    viewMode: ibas.emViewMode.VIEW,
                    onCompleted(selecteds) {
                        let platform = selecteds.firstOrDefault();
                        criteria = new ibas.Criteria();
                        condition = criteria.conditions.create();
                        condition.alias = "Code";
                        condition.operation = ibas.emConditionOperation.NOT_NULL;
                        ibas.servicesManager.runChooseService({
                            title: ibas.strings.format("{0}-{1}", ibas.i18n.prop("initialfantasy_copy_from"), ibas.i18n.prop("bo_privilege_rolecode")),
                            boCode: initialfantasy.bo.BO_CODE_ROLE,
                            chooseType: ibas.emChooseType.SINGLE,
                            criteria: criteria,
                            viewMode: ibas.emViewMode.VIEW,
                            onCompleted(selecteds) {
                                let role = selecteds.firstOrDefault();
                                // 查询复制的权限
                                criteria = new ibas.Criteria();
                                condition = criteria.conditions.create();
                                condition.alias = initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME;
                                condition.value = platform.platformCode;
                                condition = criteria.conditions.create();
                                condition.alias = initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME;
                                condition.value = role.code;
                                that.busy(true);
                                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                                boRepository.fetchPrivilege({
                                    criteria: criteria,
                                    onCompleted(opRslt) {
                                        try {
                                            that.busy(false);
                                            if (opRslt.resultCode !== 0) {
                                                throw new Error(opRslt.message);
                                            }
                                            for (let item of that.privileges) {
                                                let data = opRslt.resultObjects.firstOrDefault(c => ibas.strings.equals(c.moduleId, item.moduleId)
                                                    && ibas.strings.equals(c.target, item.target));
                                                if (ibas.objects.isNull(data)) {
                                                    continue;
                                                }
                                                item.data.isLoading = true;
                                                item.authoriseValue = data.authoriseValue;
                                                item.activated = data.activated;
                                                item.automatic = data.automatic;
                                                item.data.isLoading = false;
                                                if (item.data.isDirty === false) {
                                                    item.data.markDirty();
                                                }
                                            }
                                            that.proceeding(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_sucessful"));
                                            that.view.showPrivileges(that.privileges);
                                        }
                                        catch (error) {
                                            that.messages(error);
                                        }
                                    }
                                });
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("initialfantasy_copying_privilege"));
                            }
                        });
                    }
                });
            }
            /** 删除权限 */
            deletePrivileges(criteria) {
                if (criteria.conditions.length === 0) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "criteria"));
                }
                let that = this;
                let boRepository = app_1.bOFactory.createRepository(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchPrivilege({
                    criteria: criteria,
                    onCompleted(opRslt) {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let beDeleteds = opRslt.resultObjects;
                            beDeleteds.forEach((value) => {
                                value.delete();
                            });
                            that.messages({
                                type: ibas.emMessageType.QUESTION,
                                title: ibas.i18n.prop(that.name),
                                message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                                actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                                onCompleted(action) {
                                    if (action !== ibas.emMessageAction.YES) {
                                        return;
                                    }
                                    that.busy(true);
                                    ibas.queues.execute(beDeleteds, (data, next) => {
                                        // 处理数据
                                        boRepository.savePrivilege({
                                            beSaved: data,
                                            onCompleted(opRslt) {
                                                if (opRslt.resultCode !== 0) {
                                                    next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                                }
                                                else {
                                                    next();
                                                }
                                            }
                                        });
                                    }, (error) => {
                                        // 处理完成
                                        if (error instanceof Error) {
                                            that.messages(ibas.emMessageType.ERROR, error.message);
                                        }
                                        else {
                                            that.messages(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                        }
                                        that.privileges = new ibas.ArrayList();
                                        that.view.showPrivileges(that.privileges);
                                        that.busy(false);
                                    });
                                }
                            });
                        }
                        catch (error) {
                            that.messages(error);
                        }
                    }
                });
            }
            /** 编辑身份权限 */
            editIdentityPrivileges(role, platform) {
                role = typeof role !== "string" && role ? role.code : role;
                if (ibas.strings.isEmpty(role)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data", ibas.i18n.prop("bo_identityprivilege_rolecode")));
                    return;
                }
                if (ibas.strings.isEmpty(platform)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data", ibas.i18n.prop("bo_identityprivilege_platformid")));
                    return;
                }
                let privileges = new ibas.ArrayList();
                for (let item of this.privileges) {
                    if (item.data.isDirty) {
                        this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please") +
                            ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("bo_privilege"));
                        return;
                    }
                    privileges.add(item.data);
                }
                // ibas.servicesManager.runApplicationService<IIdentityPrivilegeConfigContract>({
                //     proxy: new IdentityPrivilegeConfigServiceProxy({
                //         platform: platform,
                //         role: role,
                //         privileges: privileges,
                //     })
                // });
            }
        }
        /** 应用标识 */
        PrivilegeConfigApp.APPLICATION_ID = "7d621881-fefe-45ca-9016-a7284768cfe1";
        /** 应用名称 */
        PrivilegeConfigApp.APPLICATION_NAME = "initialfantasy_app_privilege_config";
        app_1.PrivilegeConfigApp = PrivilegeConfigApp;
        /** 系统权限 */
        class Privilege extends ibas.Bindable {
            constructor(data, type) {
                super();
                this.data = data;
                this.type = type;
                this.privileges = new ibas.ArrayList();
            }
            registerListener(listener) {
                this.data.registerListener.apply(this.data, arguments);
            }
            removeListener() {
                this.data.removeListener.apply(this.data, arguments);
            }
            get isDirty() {
                return this.data.isDirty;
            }
            get roleCode() {
                return this.data.roleCode;
            }
            set roleCode(value) {
                this.data.roleCode = value;
            }
            get platformId() {
                return this.data.platformId;
            }
            set platformId(value) {
                this.data.platformId = value;
            }
            get moduleId() {
                return this.data.moduleId;
            }
            set moduleId(value) {
                this.data.moduleId = value;
            }
            get target() {
                return this.data.target;
            }
            set target(value) {
                this.data.target = value;
            }
            get activated() {
                return this.data.activated;
            }
            set activated(value) {
                this.data.activated = value;
            }
            get authoriseValue() {
                return this.data.authoriseValue;
            }
            set authoriseValue(value) {
                this.data.authoriseValue = value;
            }
            get automatic() {
                return this.data.automatic;
            }
            set automatic(value) {
                this.data.automatic = value;
            }
        }
        app_1.Privilege = Privilege;
        class PrivilegeFunc extends ibas.ModuleFunction {
            /** 构造函数 */
            constructor() {
                super();
                this.id = PrivilegeFunc.FUNCTION_ID;
                this.name = PrivilegeFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default() {
                if (!ibas.objects.isNull(app_1.bOFactory.createRepository(unofficialtool.bo.BO_REPOSITORY_UNOFFICIALTOOL))) {
                    let app = new PrivilegeConfigApp();
                    app.navigation = this.navigation;
                    return app;
                }
                return null;
            }
        }
        /** 功能标识 */
        PrivilegeFunc.FUNCTION_ID = "de5b3d3f-70cc-45d5-9c87-d1b61cdb73de";
        /** 功能名称 */
        PrivilegeFunc.FUNCTION_NAME = "initialfantasy_func_privilege";
        app_1.PrivilegeFunc = PrivilegeFunc;
    })(app = unofficialtool.app || (unofficialtool.app = {}));
})(unofficialtool || (unofficialtool = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../borep/index.ts" />
/// <reference path="./RemoteConfigService.ts" />
/// <reference path="./BOFactory.ts" />
/// <reference path="./PrivilegeConfigApp.ts" />
var unofficialtool;
(function (unofficialtool) {
    let app;
    (function (app) {
        /** 属性-导航 */
        const PROPERTY_NAVIGATION = Symbol("navigation");
        /** 模块控制台 */
        class Console extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor() {
                super();
                this.id = unofficialtool.CONSOLE_ID;
                this.name = unofficialtool.CONSOLE_NAME;
                this.version = unofficialtool.CONSOLE_VERSION;
            }
            /** 创建视图导航 */
            navigation() {
                return this[PROPERTY_NAVIGATION];
            }
            /** 初始化 */
            registers() {
                // 注册功能
                this.register(new app.RemoteConfigFunc());
                this.register(new app.PrivilegeFunc());
                // 注册服务应用
                this.register(new app.RemoteConfigServiceMapping());
                // 注册常驻应用
            }
            /** 运行 */
            run() {
                // 加载语言-框架默认
                ibas.i18n.load([
                    this.rootUrl + "resources/languages/unofficialtool.json",
                    this.rootUrl + "resources/languages/bos.json"
                ], () => {
                    // 设置资源属性
                    this.description = ibas.i18n.prop(this.name.toLowerCase());
                    this.icon = ibas.i18n.prop(this.name.toLowerCase() + "_icon");
                    // 先加载ui导航
                    let uiModules = [];
                    if (!ibas.config.get(ibas.CONFIG_ITEM_DISABLE_PLATFORM_VIEW, false)) {
                        if (this.plantform === ibas.emPlantform.PHONE) {
                            // 使用m类型视图
                            uiModules.push("index.ui.m");
                        }
                    }
                    // 默认使用视图
                    if (uiModules.length === 0) {
                        // 使用c类型视图
                        uiModules.push("index.ui.c");
                    }
                    // 加载视图库
                    this.loadUI(uiModules, (ui) => {
                        // 设置导航
                        this[PROPERTY_NAVIGATION] = new ui.Navigation();
                        // 调用初始化
                        this.initialize();
                    });
                    // 保留基类方法
                    super.run();
                });
            }
        }
        app.Console = Console;
    })(app = unofficialtool.app || (unofficialtool.app = {}));
})(unofficialtool || (unofficialtool = {}));
//# sourceMappingURL=index.js.map