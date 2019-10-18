/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    /** 模块-标识 */
    shell.CONSOLE_ID = "00000000-ibas-cc01-00000000000000000";
    /** 模块-名称 */
    shell.CONSOLE_NAME = "shell";
    /** 模块-版本 */
    shell.CONSOLE_VERSION = "0.2.0";
    let bo;
    (function (bo) {
        /** 业务仓库名称 */
        bo.BO_REPOSITORY_SHELL = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, shell.CONSOLE_NAME);
        /** 登录仓库名称 */
        bo.BO_REPOSITORY_CONNECT = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, "Connect");
    })(bo = shell.bo || (shell.bo = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./Data.ts" />
/// <reference path="./bo/System.ts" />
/// <reference path="./BORepository.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let bo;
    (function (bo) {
        /**
         * 用户
         */
        class User {
        }
        bo.User = User;
        /**
         * 用户模块
         */
        class UserModule {
        }
        bo.UserModule = UserModule;
        /**
         * 用户权限
         */
        class UserPrivilege {
        }
        bo.UserPrivilege = UserPrivilege;
        /**
         * 用户查询
         */
        class UserQuery {
        }
        bo.UserQuery = UserQuery;
        /** 业务对象信息 */
        class BOInfo {
        }
        bo.BOInfo = BOInfo;
        /** 业务对象属性信息 */
        class BOPropertyInfo {
        }
        bo.BOPropertyInfo = BOPropertyInfo;
        /** 业务对象属性值 */
        class BOPropertyValue {
        }
        bo.BOPropertyValue = BOPropertyValue;
    })(bo = shell.bo || (shell.bo = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./DataDeclaration.ts" />
var shell;
(function (shell) {
    let bo;
    (function (bo) {
        /**
         * Shel 模块的数据转换者
         */
        class DataConverter extends ibas.DataConverter4j {
            createConverter() {
                return null;
            }
            /**
             * 转换数据
             * @param data 当前类型数据
             * @param sign 操作标记
             * @returns 转换的数据
             */
            convert(data, sign) {
                if (ibas.objects.instanceOf(data, bo.User)) {
                    let newData = data;
                    let remote = {
                        type: bo.User.name,
                        Id: newData.id,
                        Code: newData.code,
                        Name: newData.name,
                        Super: newData.super,
                        Token: newData.token,
                        Belong: newData.belong,
                        Identities: ibas.strings.valueOf(newData.identities)
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.UserModule)) {
                    let newData = data;
                    let remote = {
                        type: bo.UserModule.name,
                        Id: newData.id,
                        Name: newData.name,
                        Repository: newData.repository,
                        Address: newData.address,
                        Category: newData.category,
                        Console: newData.console,
                        Index: newData.index,
                        Authorise: ibas.enums.toString(ibas.emAuthoriseType, newData.authorise),
                        Runtime: newData.runtime
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.UserPrivilege)) {
                    let newData = data;
                    let remote = {
                        type: bo.UserPrivilege.name,
                        Source: ibas.enums.toString(ibas.emPrivilegeSource, newData.source),
                        Target: newData.target,
                        Value: ibas.enums.toString(ibas.emAuthoriseType, newData.value),
                        Automatic: newData.automatic === true ? "YES" : "NO"
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.UserQuery)) {
                    let newData = data;
                    let rCriteria = undefined;
                    if (!ibas.objects.isNull(newData.criteria)) {
                        rCriteria = this.convert(newData.criteria, null);
                    }
                    let remote = {
                        type: bo.UserQuery.name,
                        Id: newData.id,
                        Name: newData.name,
                        Order: newData.order,
                        User: newData.user,
                        Criteria: JSON.stringify(rCriteria)
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.BOInfo)) {
                    let newData = data;
                    let properties = [];
                    for (let item of newData.properties) {
                        properties.push(this.convert(item, null));
                    }
                    let remote = {
                        type: bo.BOInfo.name,
                        Code: newData.code,
                        Name: newData.name,
                        Type: newData.type,
                        Properties: properties
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.BOPropertyInfo)) {
                    let newData = data;
                    let values = [];
                    for (let item of newData.values) {
                        values.push(this.convert(item, null));
                    }
                    let remote = {
                        type: bo.BOPropertyInfo.name,
                        Property: newData.property,
                        DataType: newData.dataType,
                        EditType: newData.editType,
                        EditSize: newData.editSize,
                        Searched: newData.searched,
                        Systemed: newData.systemed,
                        Description: newData.description,
                        Authorised: ibas.enums.toString(ibas.emAuthoriseType, newData.authorised),
                        Values: values
                    };
                    return remote;
                }
                else if (ibas.objects.instanceOf(data, bo.BOPropertyValue)) {
                    let newData = data;
                    let remote = {
                        type: bo.BOPropertyInfo.name,
                        Value: newData.value,
                        Description: newData.description
                    };
                    return remote;
                }
                else {
                    return super.convert(data, sign);
                }
            }
            /**
             * 解析数据
             * @param data 原始数据
             * @param sign 操作标记
             * @returns 当前类型数据
             */
            parsing(data, sign) {
                if (data.type === bo.User.name) {
                    let remote = data;
                    let newData = new bo.User();
                    newData.id = remote.Id;
                    newData.code = remote.Code;
                    newData.name = remote.Name;
                    newData.super = remote.Super;
                    newData.token = remote.Token !== undefined ? remote.Token : remote.Password;
                    newData.belong = remote.Belong;
                    newData.identities = new ibas.ArrayList();
                    if (!ibas.strings.isEmpty(remote.Identities)) {
                        for (let item of remote.Identities.split(ibas.DATA_SEPARATOR)) {
                            if (newData.identities.contain(item)) {
                                continue;
                            }
                            newData.identities.add(item);
                        }
                    }
                    return newData;
                }
                else if (data.type === bo.UserModule.name) {
                    let remote = data;
                    let newData = new bo.UserModule();
                    newData.id = remote.Id;
                    newData.name = remote.Name;
                    newData.repository = remote.Repository;
                    newData.address = remote.Address;
                    newData.category = remote.Category;
                    newData.console = remote.Console;
                    newData.index = remote.Index;
                    newData.authorise = ibas.enums.valueOf(ibas.emAuthoriseType, remote.Authorise);
                    newData.runtime = remote.Runtime;
                    return newData;
                }
                else if (data.type === bo.UserPrivilege.name) {
                    let remote = data;
                    let newData = new bo.UserPrivilege();
                    newData.source = ibas.enums.valueOf(ibas.emPrivilegeSource, remote.Source);
                    newData.target = remote.Target;
                    newData.value = ibas.enums.valueOf(ibas.emAuthoriseType, remote.Value);
                    newData.automatic = remote.Automatic === "YES" ? true : false;
                    return newData;
                }
                else if (data.type === bo.UserQuery.name) {
                    let remote = data;
                    let newData = new bo.UserQuery();
                    newData.id = remote.Id;
                    newData.name = remote.Name;
                    newData.order = remote.Order;
                    if (!ibas.objects.isNull(remote.Criteria) || remote.Criteria.length > 0) {
                        let jCriteria = JSON.parse(remote.Criteria);
                        if (!ibas.objects.isNull(jCriteria)) {
                            jCriteria.type = ibas.Criteria.name;
                            newData.criteria = this.parsing(jCriteria, null);
                        }
                    }
                    return newData;
                }
                else if (data.type === bo.BOInfo.name) {
                    let remote = data;
                    let newData = new bo.BOInfo();
                    newData.code = remote.Code;
                    newData.name = remote.Name;
                    newData.type = remote.Type;
                    newData.properties = new Array();
                    if (remote.Properties instanceof Array) {
                        for (let item of remote.Properties) {
                            item.type = bo.BOPropertyInfo.name;
                            newData.properties.push(this.parsing(item, null));
                        }
                    }
                    return newData;
                }
                else if (data.type === bo.BOPropertyInfo.name) {
                    let remote = data;
                    let newData = new bo.BOPropertyInfo();
                    newData.property = remote.Property;
                    newData.description = remote.Description;
                    newData.dataType = remote.DataType;
                    newData.editType = remote.EditType;
                    newData.editSize = remote.EditSize;
                    newData.searched = remote.Searched;
                    newData.systemed = remote.Systemed;
                    newData.authorised = ibas.strings.isEmpty(remote.Authorised) ? ibas.emAuthoriseType.NONE : ibas.enums.valueOf(ibas.emAuthoriseType, remote.Authorised);
                    newData.values = new Array();
                    if (remote.Values instanceof Array) {
                        for (let item of remote.Values) {
                            item.type = bo.BOPropertyValue.name;
                            newData.values.push(this.parsing(item, null));
                        }
                    }
                    return newData;
                }
                else if (data.type === bo.BOPropertyValue.name) {
                    let remote = data;
                    let newData = new bo.BOPropertyValue();
                    newData.value = remote.Value;
                    newData.description = remote.Description;
                    return newData;
                }
                else if (sign === "saveUserQuery") {
                    // 此方法返回值，没有标记类型
                    data.type = ibas.OperationMessage.name;
                    return super.parsing(data, sign);
                }
                else {
                    return super.parsing(data, sign);
                }
            }
        }
        bo.DataConverter = DataConverter;
        /** 模块业务对象工厂 */
        bo.boFactory = new ibas.BOFactory();
    })(bo = shell.bo || (shell.bo = {}));
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
    let bo;
    (function (bo) {
        let repository;
        (function (repository) {
            /** 创建业务仓库 */
            function create() {
                if (ibas.config.get(ibas.CONFIG_ITEM_OFFLINE_MODE, false)) {
                    return new BORepositoryShellOffline();
                }
                else {
                    return new BORepositoryShell();
                }
            }
            repository.create = create;
        })(repository = bo.repository || (bo.repository = {}));
        /** 配置项目-连接方式 */
        bo.CONFIG_ITEM_CONNECTION_WAY = "connectionWay";
        /** 连接方式-用户密码 */
        bo.CONNECTION_WAY_USER_PASSWORD = "USER_PASSWORD";
        /** 连接方式-用户口令 */
        bo.CONNECTION_WAY_USER_TOKEN = "USER_TOKEN";
        /**
         * 业务仓库-壳-远程
         */
        class BORepositoryShell extends ibas.BORepositoryApplication {
            /**
             * 创建此模块的后端与前端数据的转换者
             */
            createConverter() {
                return new bo.DataConverter();
            }
            /** 创建远程仓库 */
            createRemoteRepository() {
                let boRepository = new ibas.BORepositoryAjax();
                boRepository.address = this.address;
                boRepository.token = this.token;
                boRepository.converter = this.createConverter();
                return boRepository;
            }
            /**
             * 用户密码登录
             * @param caller 用户密码登录调用者
             */
            userConnect(caller) {
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                // 使用此模块库加载器
                let require = ibas.requires.create({
                    context: ibas.requires.naming(shell.CONSOLE_NAME),
                });
                let minLibrary = ibas.config.get(ibas.CONFIG_ITEM_USE_MINIMUM_LIBRARY, false);
                require(["../ibas/3rdparty/crypto-js" + (minLibrary ? ibas.SIGN_MIN_LIBRARY : "")], function (cryptoJS) {
                    let method = ibas.strings.format("userConnect?user={0}&password={1}", caller.user, cryptoJS.MD5(caller.password));
                    remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                        if (opRslt.resultCode === 0) {
                            ibas.config.set(bo.CONFIG_ITEM_CONNECTION_WAY, bo.CONNECTION_WAY_USER_PASSWORD);
                        }
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    });
                }, function (error) {
                    // 加载js库失败
                    let opRslt = new ibas.OperationResult();
                    opRslt.resultCode = -901;
                    opRslt.message = error.message;
                    caller.onCompleted(opRslt);
                });
            }
            /**
             * 用户口令登录
             * @param caller 用户口令登录调用者
             */
            tokenConnect(caller) {
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                let method = ibas.strings.format("tokenConnect?token={0}", caller.token);
                remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                    if (opRslt.resultCode === 0) {
                        ibas.config.set(bo.CONFIG_ITEM_CONNECTION_WAY, bo.CONNECTION_WAY_USER_TOKEN);
                    }
                    caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                });
            }
            /**
             * 查询用户模块
             * @param caller 用户检索调用者
             */
            fetchUserModules(caller) {
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                let method = ibas.strings.format("fetchUserModules?user={0}&platform={1}&token={2}", caller.user, caller.platform, this.token);
                remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                    caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                });
            }
            /**
             * 查询用户角色权限
             * @param caller 用户检索调用者
             */
            fetchUserPrivileges(caller) {
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                let method = ibas.strings.format("fetchUserPrivileges?user={0}&platform={1}&token={2}", caller.user, caller.platform, this.token);
                remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                    caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                });
            }
            /**
             * 查询用户查询
             * @param caller 调用者
             */
            fetchUserQueries(caller) {
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                let method = ibas.strings.format("fetchUserQueries?user={0}&queryId={1}&token={2}", caller.user, caller.queryId, this.token);
                remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                    caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                });
            }
            /**
             * 保存用户查询
             * @param caller 调用者
             */
            saveUserQuery(caller) {
                this.save("UserQuery", caller);
            }
            /**
             * 业务对象信息查询
             * @param caller 调用者
             */
            fetchBOInfos(caller) {
                if (ibas.objects.isNull(caller.boCode)) {
                    // 没有查询条件，直接返回
                    caller.onCompleted(new ibas.OperationResult());
                    return;
                }
                if (!caller.noCached) {
                    // 优先使用缓存数据
                    let data = boInfoCache.get(caller.boCode);
                    if (data instanceof DataWrapping) {
                        if (data.check() && data.data === EMPTY_BOINFO) {
                            // 代理数据，等待返回方法
                            setTimeout(() => this.fetchBOInfos(caller), WAITING_TIME);
                        }
                        else {
                            let opRsltInfo = new ibas.OperationResult();
                            if (ibas.strings.isEmpty(caller.boName)) {
                                // 不要求名称，则直接返回
                                opRsltInfo.addResults(data.data);
                            }
                            else {
                                // 要求名称，则全局查询
                                for (let item of boInfoCache.values()) {
                                    if (!(ibas.strings.equals(item.data.code, caller.boCode)
                                        || ibas.strings.isWith(item.data.code, caller.boCode + ".", null))) {
                                        continue;
                                    }
                                    if (!ibas.strings.equals(item.data.name, caller.boName)) {
                                        continue;
                                    }
                                    opRsltInfo.addResults(item.data);
                                }
                            }
                            caller.onCompleted(opRsltInfo);
                        }
                        return;
                    }
                    else {
                        // 创建代理数据，减少方法请求次数
                        boInfoCache.set(caller.boCode, new DataWrapping(EMPTY_BOINFO));
                    }
                }
                let remoteRepository = this.createRemoteRepository();
                if (ibas.objects.isNull(remoteRepository)) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "remoteRepository"));
                }
                let method = ibas.strings.format("fetchBOInfos?boCode={0}&token={1}", caller.boCode, this.token);
                remoteRepository.callRemoteMethod(method, undefined, (opRslt) => {
                    if (opRslt.resultCode === 0) {
                        let opRsltInfo = new ibas.OperationResult();
                        for (let item of opRslt.resultObjects) {
                            boInfoCache.set(item.code, new DataWrapping(item));
                            if (!ibas.strings.isEmpty(caller.boName)) {
                                if (!(ibas.strings.equals(item.code, caller.boCode)
                                    || ibas.strings.isWith(item.code, caller.boCode + ".", null))) {
                                    continue;
                                }
                                if (!ibas.strings.equals(item.name, caller.boName)) {
                                    continue;
                                }
                            }
                            else {
                                if (!ibas.strings.equals(item.code, caller.boCode)) {
                                    continue;
                                }
                            }
                            opRsltInfo.addResults(item);
                        }
                        caller.onCompleted(opRsltInfo);
                    }
                    else {
                        // 出错了
                        caller.onCompleted(opRslt);
                    }
                });
            }
        }
        /** 空数据 */
        const EMPTY_BOINFO = {
            name: "__EMPTY__",
            code: "__EMPTY__",
            type: "__EMPTY__",
            properties: [],
        };
        /** 过期时间 */
        const EXPIRED_TIME = 900000;
        /** 等待时间 */
        const WAITING_TIME = 30;
        /** 业务对象信息缓存 */
        const boInfoCache = new Map();
        /** 数据容器 */
        class DataWrapping {
            constructor(data) {
                this.data = data;
                if (this.data === null || this.data === EMPTY_BOINFO) {
                    this.time = (WAITING_TIME * 3) + ibas.dates.now().getTime();
                }
                else {
                    this.time = EXPIRED_TIME + ibas.dates.now().getTime();
                }
            }
            /** 检查数据是否有效 */
            check() {
                if (ibas.objects.isNull(this.data)) {
                    return false;
                }
                if (this.time < ibas.dates.now().getTime()) {
                    return false;
                }
                return true;
            }
        }
        /**
         * 业务仓库应用
         */
        class BORepositoryShellOffline extends BORepositoryShell {
            constructor() {
                super();
                // 重新获取离线状态
                let name = super.constructor.name;
                // 获取此仓库离线状态
                this.offline = ibas.config.get(ibas.CONFIG_ITEM_OFFLINE_MODE + "|" + name, this.offline);
            }
            /**
             * 创建此模块的后端与前端数据的转换者
             */
            createConverter() {
                return new bo.DataConverter();
            }
            /**
             * 用户登录
             * @param caller 登录者
             */
            userConnect(caller) {
                let criteria = new ibas.Criteria();
                let condition = criteria.conditions.create();
                condition.alias = "code";
                condition.value = caller.user;
                condition = criteria.conditions.create();
                condition.alias = "token";
                condition.value = caller.password;
                let fetchCaller = {
                    criteria: criteria,
                    onCompleted(opRsltFetch) {
                        let user = opRsltFetch.resultObjects.firstOrDefault();
                        let opRslt = new ibas.OperationResult();
                        if (ibas.objects.isNull(user)) {
                            opRslt.resultCode = -1;
                            opRslt.message = ibas.i18n.prop("shell_user_and_password_not_match");
                        }
                        else {
                            opRslt.resultCode = 0;
                            opRslt.userSign = ibas.uuids.random();
                            opRslt.resultObjects.add(user);
                        }
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    }
                };
                this.fetch("User", fetchCaller);
            }
            /**
             * 用户口令登录
             * @param caller 用户口令登录者
             */
            tokenConnect(caller) {
                let criteria = new ibas.Criteria();
                let condition = criteria.conditions.create();
                condition.alias = "token";
                condition.value = caller.token;
                let fetchCaller = {
                    criteria: criteria,
                    onCompleted(opRsltFetch) {
                        let user = opRsltFetch.resultObjects.firstOrDefault();
                        let opRslt = new ibas.OperationResult();
                        if (ibas.objects.isNull(user)) {
                            opRslt.resultCode = -1;
                            opRslt.message = ibas.i18n.prop("shell_user_and_password_not_match");
                        }
                        else {
                            opRslt.resultCode = 0;
                            opRslt.userSign = ibas.uuids.random();
                            opRslt.resultObjects.add(user);
                        }
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    }
                };
                this.fetch("User", fetchCaller);
            }
            /**
             * 查询用户模块
             * @param caller 用户检索者
             */
            fetchUserModules(caller) {
                let fetchCaller = {
                    criteria: null,
                    onCompleted(opRslt) {
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    }
                };
                this.fetch("UserModule", fetchCaller);
            }
            /**
             * 查询用户角色权限
             * @param caller 用户检索者
             */
            fetchUserPrivileges(caller) {
                let fetchCaller = {
                    criteria: null,
                    onCompleted(opRslt) {
                        caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                    }
                };
                this.fetch("UserPrivilege", fetchCaller);
            }
            /**
             * 查询用户查询
             * @param caller 调用者
             */
            fetchUserQueries(caller) {
                let criteria = new ibas.Criteria();
                let condition = criteria.conditions.create();
                condition.alias = "id";
                condition.value = caller.queryId;
                let fetchCaller = {
                    criteria: criteria,
                    onCompleted: caller.onCompleted,
                };
                this.fetch("UserQuery", fetchCaller);
            }
            /**
             * 业务对象信息查询
             * @param caller 调用者
             */
            fetchBOInfos(caller) {
                let criteria = new ibas.Criteria();
                if (!ibas.strings.isEmpty(caller.boCode)) {
                    let condition = criteria.conditions.create();
                    condition.alias = "code";
                    condition.value = caller.boCode;
                }
                if (criteria.conditions.length === 0) {
                    // 无效的参数
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "boCode"));
                }
                let fetchCaller = {
                    criteria: criteria,
                    onCompleted: caller.onCompleted,
                };
                this.fetch("BOInfo", fetchCaller);
            }
        }
        // 注册业务对象仓库到工厂
        if (!ibas.config.get(ibas.CONFIG_ITEM_OFFLINE_MODE, false)) {
            bo.boFactory.register(bo.BO_REPOSITORY_CONNECT, BORepositoryShell);
            bo.boFactory.register(bo.BO_REPOSITORY_SHELL, BORepositoryShell);
        }
        else {
            bo.boFactory.register(bo.BO_REPOSITORY_CONNECT, BORepositoryShellOffline);
            bo.boFactory.register(bo.BO_REPOSITORY_SHELL, BORepositoryShellOffline);
        }
    })(bo = shell.bo || (shell.bo = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../api/index.ts" />
/// <reference path="./bo/System.ts" />
/// <reference path="./DataConverter.ts" />
/// <reference path="./BORepository.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let app;
    (function (app_1) {
        /**
         * 用户壳应用
         */
        class ShellApplication extends ibas.AbstractApplication {
            /** 注册视图，重载需要回掉此方法 */
            registerView() {
                this.view.closeEvent = this.close;
                this.view.activateFunctionEvent = this.activateFunction;
            }
            run() {
                this.show();
            }
            show() {
                if (arguments.length === 0) {
                    // 显示自身视图时
                    if (!ibas.objects.isNull(this.viewShower)) {
                        if (ibas.objects.isNull(this.view)) {
                            throw new Error(ibas.i18n.prop("sys_invalid_view", this.name));
                        }
                        if (!ibas.objects.isNull(this.description)) {
                            this.view.title = this.description;
                        }
                        else {
                            this.view.title = this.name;
                        }
                        this.viewShower.show(this.view);
                        if (this.view instanceof ibas.View) {
                            this.view.isDisplayed = true;
                        }
                        this.viewShowed();
                    }
                    else {
                        throw new Error(ibas.i18n.prop("sys_invalid_view_shower", this.name));
                    }
                }
                else {
                    // 显示应用视图时
                    this.showView(arguments[0]);
                }
            }
            destroy() {
                if (arguments.length === 1) {
                    this.view.destroyView(arguments[0]);
                }
                else {
                    super.destroy();
                }
            }
            /** 视图显示后 */
            viewShowed() {
                // 构建功能检索
                this[PROPERTY_FUNCTIONS] = new Map();
                app.modules.forEach((module) => {
                    for (let item of module.elements()) {
                        if (item instanceof ibas.ModuleFunction) {
                            this[PROPERTY_FUNCTIONS].set(item.id, item);
                        }
                    }
                });
            }
            /** 关闭视图 */
            close() {
                if (!ibas.objects.isNull(this.view)) {
                    if (!ibas.objects.isNull(this.viewShower)) {
                        this.viewShower.destroy(this.view);
                    }
                }
            }
            busy(view, busy, msg) {
                if (this.isViewShowed()) {
                    this.view.busyView(view, busy, msg);
                }
            }
            proceeding(view, type, msg) {
                if (this.isViewShowed()) {
                    this.view.showStatusMessage(type, msg);
                }
            }
            messages(caller) {
                if (this.isViewShowed()) {
                    this.view.showMessageBox(caller);
                }
            }
            showView(view) {
                if (this.isViewShowed()) {
                    this.view.showView(view);
                }
            }
            /** 视图事件-激活功能 */
            activateFunction(id) {
                if (ibas.objects.isNull(this[PROPERTY_FUNCTIONS])) {
                    return;
                }
                if (this[PROPERTY_FUNCTIONS].has(id)) {
                    let func = this[PROPERTY_FUNCTIONS].get(id);
                    let app = func.default();
                    if (ibas.objects.isNull(app)) {
                        return;
                    }
                    if (ibas.objects.isNull(app.navigation)) {
                        app.navigation = func.navigation;
                    }
                    app.viewShower = this;
                    app.run();
                }
            }
        }
        app_1.ShellApplication = ShellApplication;
        const PROPERTY_FUNCTIONS = Symbol("functions");
        /** 用户壳视图 */
        class ShellView extends ibas.View {
            /** 地址栏哈希值变化 */
            onHashChanged(event) {
                super.onHashChanged(event);
                if (event.newURL.indexOf(ibas.URL_HASH_SIGN_FUNCTIONS) >= 0) {
                    let url = event.newURL.substring(event.newURL.indexOf(ibas.URL_HASH_SIGN_FUNCTIONS) + ibas.URL_HASH_SIGN_FUNCTIONS.length);
                    let index = url.indexOf("/") < 0 ? url.length : url.indexOf("/");
                    this.fireViewEvents(this.activateFunctionEvent, url.substring(0, index));
                }
            }
        }
        app_1.ShellView = ShellView;
    })(app = shell.app || (shell.app = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./Shells.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var shell;
(function (shell) {
    let app;
    (function (app) {
        /** 配置项目-应用名称 */
        app.CONFIG_ITEM_APPLICATION_NAME = "application";
        /**
         * 应用-系统入口
         */
        class MainApp extends ibas.Application {
            constructor() {
                super();
                this.id = MainApp.APPLICATION_ID;
                this.name = MainApp.APPLICATION_NAME;
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            viewShowed() {
                let loginApp = new app.LoginApp();
                loginApp.viewShower = this.viewShower;
                loginApp.navigation = this.navigation;
                loginApp.run();
            }
        }
        /** 应用标识 */
        MainApp.APPLICATION_ID = "cbd51fd3-63b4-4777-9aad-9c2f303b56f8";
        /** 应用名称 */
        MainApp.APPLICATION_NAME = "shell_app_main";
        app.MainApp = MainApp;
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app) {
        /** 配置项目-欢迎内容 */
        app.CONFIG_ITEM_WELCOME_CONTENT = "welcomeContent";
        /**
         * 欢迎应用
         */
        class WelcomeApp extends ibas.Application {
            constructor() {
                super();
                this.id = WelcomeApp.APPLICATION_ID;
                this.name = WelcomeApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            viewShowed() {
                let content = ibas.config.get(app.CONFIG_ITEM_WELCOME_CONTENT);
                if (!ibas.strings.isEmpty(content)) {
                    this.view.showContent(content);
                }
                else {
                    this.view.showContent("");
                }
            }
        }
        /** 应用标识 */
        WelcomeApp.APPLICATION_ID = "e868ea10-7985-45a7-839e-32b903bd374a";
        /** 应用名称 */
        WelcomeApp.APPLICATION_NAME = "shell_app_welcome";
        app.WelcomeApp = WelcomeApp;
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app) {
        /** 应用-登陆 */
        class LoginApp extends ibas.Application {
            constructor() {
                super();
                this.id = LoginApp.APPLICATION_ID;
                this.name = LoginApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
                this.view.loginEvent = this.login;
            }
            /** 视图显示后 */
            viewShowed() {
            }
            /** 运行 */
            run() {
                let userTokenParam = ibas.urls.param(ibas.CONFIG_ITEM_USER_TOKEN);
                if (!ibas.objects.isNull(userTokenParam)) {
                    let userToken = userTokenParam.text;
                    ibas.logger.log(ibas.emMessageLevel.DEBUG, "app: user login system,token is [{0}].", userToken);
                    let boRepository = shell.bo.repository.create();
                    boRepository.tokenConnect({
                        caller: this,
                        token: userToken,
                        onCompleted: this.onConnectCompleted,
                    });
                    // 发送登录连接请求后,清除地址栏中的查询参数信息,并且不保留浏览器历史记录
                    window.history.replaceState(null, null, window.location.pathname + window.location.hash);
                }
                else {
                    super.run.apply(this, arguments);
                }
            }
            /** 登录系统 */
            login() {
                if (ibas.strings.isEmpty(this.view.user) || ibas.strings.isEmpty(this.view.password)) {
                    throw new Error(ibas.i18n.prop("shell_please_input_user_and_password"));
                }
                this.busy(true, ibas.i18n.prop("shell_logging_system"));
                let boRepository = shell.bo.repository.create();
                boRepository.userConnect({
                    caller: this,
                    user: this.view.user,
                    password: this.view.password,
                    onCompleted: this.onConnectCompleted,
                });
                ibas.logger.log(ibas.emMessageLevel.DEBUG, "app: user [{0}] login system.", this.view.user);
            }
            onConnectCompleted(opRslt) {
                try {
                    this.busy(false);
                    if (ibas.objects.isNull(opRslt)) {
                        throw new Error();
                    }
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    let user = opRslt.resultObjects.firstOrDefault();
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
                    // 加载权限
                    userPrivilegeManager.load({
                        user: user.code,
                        platform: ibas.enums.toString(ibas.emPlantform, this.plantform),
                        onCompleted: (error) => {
                            if (error instanceof Error) {
                                this.messages(error);
                            }
                            else {
                                // 启动系统中心
                                let centerApp = new app.CenterApp();
                                centerApp.viewShower = this.viewShower;
                                centerApp.navigation = this.navigation;
                                centerApp.run(user);
                                this.destroy();
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
        LoginApp.APPLICATION_ID = "9b1da07a-89a4-4008-97da-80c34b7f2eb8";
        /** 应用名称 */
        LoginApp.APPLICATION_NAME = "shell_app_login";
        app.LoginApp = LoginApp;
        /** 用户权限管理员 */
        class UserPrivilegeManager {
            constructor() {
                this.userPrivileges = new ibas.ArrayList();
            }
            /** 判断是否可以运行应用 */
            canRun(element) {
                let run = true;
                if (ibas.objects.isNull(this.userPrivileges)) {
                    return run;
                }
                if (element instanceof ibas.BOApplication) {
                    // 应用是业务对象应用，根据应用类型设置权限
                    for (let item of this.userPrivileges) {
                        if (item.source !== ibas.emPrivilegeSource.BUSINESS_OBJECT) {
                            continue;
                        }
                        if (item.target !== element.boCode) {
                            continue;
                        }
                        if (item.value === ibas.emAuthoriseType.READ) {
                            if (app instanceof ibas.BOListApplication) {
                                run = true;
                            }
                            else if (app instanceof ibas.BOChooseApplication) {
                                run = true;
                            }
                            else if (app instanceof ibas.BOViewApplication) {
                                run = true;
                            }
                            else if (app instanceof ibas.BOEditApplication) {
                                run = false;
                            }
                        }
                        else {
                            run = item.value === ibas.emAuthoriseType.NONE ? false : true;
                        }
                        break;
                    }
                }
                // 应用设置，覆盖之前设置
                for (let item of this.userPrivileges) {
                    if (item.source === ibas.emPrivilegeSource.BUSINESS_OBJECT) {
                        continue;
                    }
                    if (item.target !== element.id) {
                        continue;
                    }
                    if (element instanceof ibas.ModuleConsole) {
                        run = item.value === ibas.emAuthoriseType.ALL ? true : false;
                    }
                    else {
                        run = item.value === ibas.emAuthoriseType.NONE ? false : true;
                    }
                    break;
                }
                return run;
            }
            /** 加载权限 */
            load(loader) {
                if (!ibas.objects.isNull(this.userPrivileges) && this.userPrivileges.length > 0) {
                    // 已初始化不在处理
                    return;
                }
                let boRepository = shell.bo.repository.create();
                boRepository.fetchUserPrivileges({
                    user: loader.user,
                    platform: loader.platform,
                    onCompleted: (opRslt) => {
                        if (opRslt.resultCode !== 0) {
                            if (loader.onCompleted instanceof Function) {
                                loader.onCompleted(new Error(opRslt.message));
                            }
                        }
                        else {
                            let configed = ibas.config.get(app.CONFIG_ITEM_AUTO_ACTIVETED_FUNCTION) ? true : false;
                            for (let item of opRslt.resultObjects) {
                                this.userPrivileges.add(item);
                                if (item.automatic === true && !configed
                                    && item.source === ibas.emPrivilegeSource.APPLICATION
                                    && item.value === ibas.emAuthoriseType.ALL) {
                                    // 没有配置，则使用权限设置
                                    ibas.config.set(app.CONFIG_ITEM_AUTO_ACTIVETED_FUNCTION, item.target);
                                }
                            }
                            if (loader.onCompleted instanceof Function) {
                                loader.onCompleted(undefined);
                            }
                        }
                    }
                });
            }
        }
        const userPrivilegeManager = new UserPrivilegeManager();
        /** 权限管理员 */
        let privileges;
        (function (privileges) {
            /**
             * 是否允许运行
             * @param element 元素
             */
            function canRun(element) {
                return userPrivilegeManager.canRun(element);
            }
            privileges.canRun = canRun;
        })(privileges = app.privileges || (app.privileges = {}));
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app) {
        /**
         * 关于应用
         */
        class AboutApp extends ibas.Application {
            constructor() {
                super();
                this.id = AboutApp.APPLICATION_ID;
                this.name = AboutApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            viewShowed() {
                let libraries = new ibas.ArrayList();
                let copyright = ibas.i18n.prop("shell_license");
                libraries.add(new Component("ibas", ibas.about.version, copyright, ibas.i18n.prop("shell_icon")));
                libraries.add(new Component(shell.CONSOLE_NAME, shell.CONSOLE_VERSION, copyright, ibas.i18n.prop("shell_icon")));
                libraries.add(new Component("requirejs", "2.3.6", "© jQuery foundation and other contributors, released under the MIT license."));
                libraries.add(new Component("require-css", "0.1.10", "© Guy Bedford, released under the MIT license."));
                libraries.add(new Component("cryptojs", "3.1.9", "© Evan Vosberg, released under the MIT license."));
                libraries.add(new Component("spin.js", "2.3.2", "© Felix Gnass, released under the MIT license."));
                this.view.showLibraries(libraries);
                let applications = new ibas.ArrayList();
                app.modules.forEach((module) => {
                    applications.add(new Component(module.name, module.version, module.copyright, module.icon));
                });
                this.view.showApplications(applications);
            }
        }
        /** 应用标识 */
        AboutApp.APPLICATION_ID = "414b87e2-f9b7-425d-b1d7-7aeadfa2670e";
        /** 应用名称 */
        AboutApp.APPLICATION_NAME = "shell_app_about";
        app.AboutApp = AboutApp;
        /** 组件信息 */
        class Component {
            constructor() {
                if (arguments.length > 0) {
                    this.name = arguments[0];
                }
                if (arguments.length > 1) {
                    this.version = arguments[1];
                }
                if (arguments.length > 2) {
                    this.copyright = arguments[2];
                }
                if (arguments.length > 3) {
                    this.icon = arguments[3];
                }
            }
        }
        app.Component = Component;
        /** 模块信息检查 */
        class ModuleMonitor {
            /** 观察 */
            monitor(caller) {
                let name = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, caller.name);
                let address = ibas.config.get(ibas.strings.format(ibas.CONFIG_ITEM_TEMPLATE_REMOTE_REPOSITORY_ADDRESS, name));
                if (!ibas.objects.isNull(address)) {
                    address = ibas.urls.normalize(address);
                    let index = address.indexOf("/services/");
                    if (index > 0) {
                        address = address.substring(0, index) + "/services/monitor/";
                        // 用户口令，先获取仓库口令
                        let token = ibas.config.get(ibas.strings.format(ibas.CONFIG_ITEM_TEMPLATE_USER_TOKEN, name));
                        // 没有仓库口令，则使用全局口令
                        if (ibas.strings.isEmpty(token)) {
                            token = ibas.config.get(ibas.CONFIG_ITEM_USER_TOKEN);
                        }
                        let boRepository = new RemoteRepository();
                        boRepository.converter = new DataConverter();
                        boRepository.address = address;
                        boRepository.token = token;
                        let method = ibas.strings.format("diagnosing?token={0}", token);
                        boRepository.callRemoteMethod(method, undefined, (opRslt) => {
                            caller.onCompleted.call(ibas.objects.isNull(caller.caller) ? caller : caller.caller, opRslt);
                        });
                    }
                }
            }
        }
        ModuleMonitor.RUNTIME_INFORMATION_MAX_MEMORY = "MAX_MEMORY";
        ModuleMonitor.RUNTIME_INFORMATION_TOTAL_MEMORY = "TOTAL_MEMORY";
        ModuleMonitor.RUNTIME_INFORMATION_FREE_MEMORY = "FREE_MEMORY";
        ModuleMonitor.RUNTIME_INFORMATION_USED_MEMORY = "USED_MEMORY";
        app.ModuleMonitor = ModuleMonitor;
        class RemoteRepository extends ibas.RemoteRepositoryAjax {
            createHttpRequest(method) {
                let methodUrl = this.methodUrl(method);
                let xhr = new XMLHttpRequest();
                xhr.open("GET", methodUrl, true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.responseType = "json";
                return xhr;
            }
        }
        class DataConverter extends ibas.DataConverter4j {
            createConverter() {
                return null;
            }
        }
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app) {
        /** 配置项目-帮助地址 */
        app.CONFIG_ITEM_HELP_URL = "helpUrl";
        /** 配置项目-内部浏览帮助 */
        app.CONFIG_ITEM_HELP_INSIDE = "helpInside";
        /**
         * 应用-帮助
         */
        class HelpApp extends ibas.Application {
            constructor() {
                super();
                this.id = HelpApp.APPLICATION_ID;
                this.name = HelpApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            viewShowed() {
                //
            }
            /** 运行 */
            run() {
                this.view.url = ibas.config.get(app.CONFIG_ITEM_HELP_URL);
                this.view.isInside = ibas.config.get(app.CONFIG_ITEM_HELP_INSIDE, true);
                super.run.apply(this, arguments);
            }
        }
        /** 应用标识 */
        HelpApp.APPLICATION_ID = "ac17a471-01f2-455f-9193-ddbfcaf81c0f";
        /** 应用名称 */
        HelpApp.APPLICATION_NAME = "shell_app_help";
        app.HelpApp = HelpApp;
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app_2) {
        /** 配置项目-自动激活的功能 */
        app_2.CONFIG_ITEM_AUTO_ACTIVETED_FUNCTION = "autoFunction";
        /** 配置项目-总激活欢迎应用 */
        app_2.CONFIG_ITEM_ALWAYS_ACTIVETED_WELCOME = "alwaysWelcome";
        /** 应用-中心 */
        class CenterApp extends ibas.AbstractApplication {
            constructor() {
                super();
                this.id = CenterApp.APPLICATION_ID;
                this.name = CenterApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 显示视图 */
            show() {
                if (arguments.length === 0) {
                    // 显示自身视图时
                    if (!ibas.objects.isNull(this.viewShower)) {
                        if (ibas.objects.isNull(this.view)) {
                            throw new Error(ibas.i18n.prop("sys_invalid_view", this.name));
                        }
                        if (!ibas.objects.isNull(this.description)) {
                            this.view.title = this.description;
                        }
                        else {
                            this.view.title = this.name;
                        }
                        this.viewShower.show(this.view);
                        if (this.view instanceof ibas.View) {
                            this.view.isDisplayed = true;
                        }
                        this.viewShowed();
                    }
                    else {
                        throw new Error(ibas.i18n.prop("sys_invalid_view_shower", this.name));
                    }
                }
                else {
                    // 显示应用视图时
                    this.showView(arguments[0]);
                }
            }
            /** 注册视图 */
            registerView() {
                // 注册视图事件
                this.view.activateFunctionEvent = this.activateFunction;
                this.view.aboutEvent = this.about;
                this.view.helpEvent = this.help;
                this.view.closeEvent = this.close;
            }
            /** 运行 */
            run() {
                // 初始化
                this.show();
                if (arguments[0] instanceof shell.bo.User) {
                    setTimeout(() => this.init(arguments[0]), 150);
                }
            }
            /** 视图显示后 */
            viewShowed() {
            }
            /** 帮助 */
            help() {
                let app = new app_2.HelpApp();
                app.navigation = this.navigation;
                app.viewShower = this;
                app.run();
            }
            /** 关于 */
            about() {
                let app = new app_2.AboutApp();
                app.navigation = this.navigation;
                app.viewShower = this;
                app.run();
            }
            /** 初始化用户相关 */
            init(user) {
                if (ibas.objects.isNull(user)) {
                    return;
                }
                // 加载用户相关
                ibas.logger.log(ibas.emMessageLevel.DEBUG, "center: initializing user [{0} - {1}]'s modules.", user.id, user.code);
                // 如当前模块包含Hash指向的功能,激活
                let hashFuncId = null;
                if (window.location.hash.startsWith(ibas.URL_HASH_SIGN_FUNCTIONS)) {
                    let url = window.location.hash.substring(ibas.URL_HASH_SIGN_FUNCTIONS.length);
                    let index = url.indexOf("/") < 0 ? url.length : url.indexOf("/");
                    hashFuncId = url.substring(0, index);
                }
                if (ibas.strings.isEmpty(hashFuncId)) {
                    hashFuncId = ibas.config.get(app_2.CONFIG_ITEM_AUTO_ACTIVETED_FUNCTION);
                    if (!ibas.strings.isEmpty(hashFuncId)) {
                        ibas.urls.changeHash(ibas.strings.format("{0}{1}", ibas.URL_HASH_SIGN_FUNCTIONS, hashFuncId));
                    }
                }
                // 存在自动打开功能，则显示欢迎页面
                let appWelcome = null;
                if (!ibas.strings.isEmpty(hashFuncId) || ibas.config.get(app_2.CONFIG_ITEM_ALWAYS_ACTIVETED_WELCOME) === true) {
                    appWelcome = new app_2.WelcomeApp();
                    appWelcome.viewShower = this.viewShower;
                    appWelcome.navigation = this.navigation;
                    appWelcome.description = ibas.strings.format("{0} - {1}", appWelcome.description, user.name ? user.name : user.code);
                    appWelcome.run();
                }
                this.view.showStatusMessage(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_initialize_user_modules", ibas.strings.isEmpty(user.name) ? user.code : user.name));
                // 权限加载成功，加载模块
                moduleConsoleManager.load({
                    user: user.code,
                    platform: ibas.enums.toString(ibas.emPlantform, this.plantform),
                    onError: (error) => {
                        this.view.showMessageBox({
                            title: this.description,
                            type: ibas.emMessageType.ERROR,
                            message: ibas.config.get(ibas.CONFIG_ITEM_DEBUG_MODE, false) ? error.stack : error.message
                        });
                    },
                    onStatusMessage: (type, message) => {
                        this.view.showStatusMessage(type, message);
                    },
                    onCompleted: (console) => {
                        // 设置跳过方法
                        console.isSkip = function (element) {
                            // 没权限，跳过元素
                            return !app_2.privileges.canRun(element);
                        };
                        // 有效模块控制台
                        console.addListener(() => {
                            // 显示模块
                            this.view.showModule(console);
                            // 模块可用，才加载功能和应用
                            if (app_2.privileges.canRun(console)) {
                                // 处理功能
                                for (let func of console.functions()) {
                                    if (ibas.objects.isNull(func.viewShower)) {
                                        func.viewShower = this;
                                    }
                                    // 注册功能事件响应
                                    moduleFunctions.set(func.id, func);
                                    this.view.showModuleFunction(console.name, func);
                                    if (ibas.strings.equals(func.id, hashFuncId)) {
                                        // hash值是当前功能，则激活
                                        setTimeout(() => {
                                            this.activateFunction(func.id);
                                            // 功能加载后，自动关闭欢迎
                                            if (appWelcome instanceof ibas.Application) {
                                                setTimeout(() => {
                                                    appWelcome.destroy();
                                                }, 1000);
                                            }
                                        }, 1000);
                                    }
                                }
                                // 处理应用
                                for (let app of console.applications()) {
                                    // 显示常驻应用
                                    if (ibas.objects.instanceOf(app, ibas.ResidentApplication)) {
                                        if (ibas.objects.isNull(app.viewShower)) {
                                            app.viewShower = this;
                                        }
                                        this.view.showResidentView(app.view);
                                    }
                                }
                            }
                            // 处理服务
                            for (let service of console.services()) {
                                ibas.servicesManager.register(service);
                                // 如当前注册的服务为Hash指向的服务,激活
                                if (ibas.strings.isWith(window.location.hash, ibas.URL_HASH_SIGN_SERVICES, undefined)) {
                                    let url = window.location.hash.substring(ibas.URL_HASH_SIGN_SERVICES.length);
                                    let index = url.indexOf("/") < 0 ? url.length : url.indexOf("/");
                                    let id = url.substring(0, index);
                                    if (ibas.strings.equals(service.id, id)) {
                                        setTimeout(() => ibas.urls.changeHash(window.location.hash), 1000);
                                    }
                                }
                            }
                            // 注册元素描述
                            ibas.i18n.add(console.id, console.description);
                            for (let item of console.elements()) {
                                ibas.i18n.add(item.id, item.description);
                            }
                        });
                        console.run();
                    }
                });
            }
            /** 视图事件-激活功能 */
            activateFunction(id) {
                if (ibas.objects.isNull(moduleFunctions)) {
                    return;
                }
                if (moduleFunctions.has(id)) {
                    let func = moduleFunctions.get(id);
                    let app = func.default();
                    if (ibas.objects.isNull(app)) {
                        return;
                    }
                    if (ibas.objects.isNull(app.navigation)) {
                        app.navigation = func.navigation;
                    }
                    if (ibas.objects.isNull(app.viewShower)) {
                        app.viewShower = this;
                    }
                    app.run();
                }
            }
            /** 关闭视图 */
            close() {
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_exit_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted: (action) => {
                        if (action === ibas.emMessageAction.YES) {
                            this.view.destroyView(this.view);
                            window.location.hash = "";
                        }
                    }
                });
            }
            /** 清理资源 */
            destroy() {
                if (arguments.length === 0) {
                    super.destroy();
                }
                else {
                    this.view.destroyView(arguments[0]);
                }
            }
            /** 设置忙状态 */
            busy(view, busy, msg) {
                this.view.busyView(view, busy, msg);
            }
            /** 设置消息 */
            proceeding(view, type, msg) {
                this.view.showStatusMessage(type, msg);
            }
            /** 对话消息 */
            messages(caller) {
                this.view.showMessageBox(caller);
            }
            /** 显示视图，可重载并添加权限控制 */
            showView(view) {
                if (view instanceof ibas.View) {
                    if (!app_2.privileges.canRun(view.application)) {
                        throw new Error(ibas.i18n.prop("shell_application_not_allowed_run", ibas.objects.isNull(view.application.description) ? view.application.name : view.application.description));
                    }
                    this.view.showView(view);
                }
            }
        }
        /** 应用标识 */
        CenterApp.APPLICATION_ID = "c1ec9ee1-1138-4358-8323-c579f1e4be37";
        /** 应用名称 */
        CenterApp.APPLICATION_NAME = "shell_app_center";
        app_2.CenterApp = CenterApp;
        const moduleFunctions = new Map();
        class ModuleConsoleManager {
            constructor() {
                // 获取是否压缩配置
                this.minLibrary = ibas.config.get(ibas.CONFIG_ITEM_USE_MINIMUM_LIBRARY, false);
            }
            load(loader) {
                let that = this;
                let boRepository = shell.bo.repository.create();
                boRepository.fetchUserModules({
                    user: loader.user,
                    platform: loader.platform,
                    onCompleted(opRslt) {
                        if (opRslt.resultCode !== 0) {
                            loader.onError(new Error(opRslt.message));
                        }
                        else {
                            // 加载模块
                            that.modules = new ibas.ArrayList();
                            that.faildModules = new ibas.ArrayList();
                            that.consoles = new ibas.ArrayList();
                            // 完善模块信息
                            for (let module of opRslt.resultObjects) {
                                if (that.modules.firstOrDefault(c => c.id === module.id) !== null) {
                                    continue;
                                }
                                // 补充模块初始值
                                if (ibas.objects.isNull(module.authorise)) {
                                    module.authorise = ibas.emAuthoriseType.ALL;
                                }
                                // 模块入口地址
                                if (ibas.strings.isEmpty(module.address)) {
                                    // 模块地址无效，不再加载
                                    loader.onStatusMessage(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_invalid_module_address", module.name));
                                    continue;
                                }
                                module.address = ibas.urls.normalize(module.address);
                                if (!module.address.endsWith("/")) {
                                    module.address += "/";
                                }
                                // 模块索引文件
                                if (ibas.strings.isEmpty(module.index)) {
                                    module.index = "index";
                                }
                                // 模块控制台名称
                                if (ibas.strings.isEmpty(module.console)) {
                                    module.console = "Console";
                                }
                                if (module.console.indexOf(".") < 0) {
                                    // 没有命名空间，补全
                                    module.console = ibas.strings.format("{0}.app.{1}", module.name.toLowerCase(), module.console);
                                }
                                ibas.logger.log(ibas.emMessageLevel.DEBUG, "center: module: [{0}], root: [{1}], console: [{2}].", module.name, module.address, module.console);
                                that.modules.add(module);
                            }
                            let onUncaughtError = function (event) {
                                if (event.error instanceof ReferenceError && !ibas.objects.isNull(that.modules)) {
                                    let urlIndex = event.filename.split("?")[0];
                                    let module = that.modules.firstOrDefault(c => ibas.strings.isWith(urlIndex, ibas.urls.normalize((ibas.strings.isWith(c.address, "/", undefined) ? "..." + c.address : c.address) + c.index), ".js"));
                                    if (!ibas.objects.isNull(module)) {
                                        // 卸载加载失败模块
                                        ibas.requires.create({
                                            context: ibas.requires.naming(module.name)
                                        }).undef(module.index + (that.minLibrary ? ibas.SIGN_MIN_LIBRARY : ""));
                                        // 添加失败清单
                                        for (let item of that.modules) {
                                            if (item.name !== module.name) {
                                                continue;
                                            }
                                            if (item.index !== module.index) {
                                                continue;
                                            }
                                            if (that.faildModules.contain(item)) {
                                                continue;
                                            }
                                            that.faildModules.add(item);
                                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "center: module: [{0}|{1}] will be reload.", item.name, item.console);
                                        }
                                        // 移出失败模块
                                        for (let item of that.faildModules) {
                                            that.modules.remove(item);
                                        }
                                    }
                                }
                            };
                            // 监听模块加载错误
                            window.addEventListener("error", onUncaughtError);
                            // 加载模块文件
                            for (let module of that.modules) {
                                loader.onStatusMessage(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_initialize_module", ibas.strings.isEmpty(module.name) ? module.id : module.name));
                                // 模块require函数
                                that.require(module, function () {
                                    try {
                                        let consoleClass = window;
                                        for (let tmp of module.console.split(".")) {
                                            if (ibas.objects.isNull(consoleClass)) {
                                                break;
                                            }
                                            consoleClass = consoleClass[tmp];
                                        }
                                        if (!ibas.objects.isAssignableFrom(consoleClass, ibas.ModuleConsole)) {
                                            throw new TypeError(ibas.i18n.prop("shell_invalid_module_console", module.console));
                                        }
                                        let console = new consoleClass();
                                        if (!(ibas.objects.instanceOf(console, ibas.ModuleConsole))) {
                                            throw new ReferenceError(module.console);
                                        }
                                        // 设置模块名称
                                        console.module = module.name.toLowerCase();
                                        // 设置模块根地址
                                        console.rootUrl = module.address;
                                        // 设置仓库地址
                                        if (!ibas.strings.isEmpty(module.repository)) {
                                            let done = console.setRepository(module.repository);
                                            // 注册模块业务仓库默认地址，创建实例时默认取此地址
                                            if (!ibas.objects.isNull(console.name) && done) {
                                                module.repository = ibas.urls.normalize(module.repository);
                                                let repositoryName = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, console.name);
                                                let configName = ibas.strings.format(ibas.CONFIG_ITEM_TEMPLATE_REMOTE_REPOSITORY_ADDRESS, repositoryName);
                                                ibas.config.set(configName, module.repository);
                                                ibas.logger.log(ibas.emMessageLevel.DEBUG, "repository: register [{0}]'s default address [{1}].", repositoryName, module.repository);
                                            }
                                        }
                                        loader.onCompleted(console);
                                        that.consoles.add(console);
                                    }
                                    catch (error) {
                                        loader.onStatusMessage(ibas.emMessageType.ERROR, error.message);
                                    }
                                    finally {
                                        that.modules.remove(module);
                                        ibas.logger.log(ibas.emMessageLevel.DEBUG, "center: module: [{0}|{1}] was loaded.", module.name, module.console);
                                        if (that.modules.length === 0) {
                                            if (that.faildModules.length === 0) {
                                                that.modules.clear();
                                                that.faildModules.clear();
                                                window.removeEventListener("error", onUncaughtError);
                                            }
                                            else {
                                                for (let item of that.faildModules) {
                                                    that.modules.add(item);
                                                }
                                                that.faildModules.clear();
                                                for (let item of that.modules) {
                                                    that.require(item);
                                                }
                                            }
                                        }
                                    }
                                }, function (error) {
                                    that.modules.remove(module);
                                    if (error instanceof Error) {
                                        loader.onStatusMessage(ibas.emMessageType.ERROR, ibas.i18n.prop("shell_invalid_module_index", ibas.strings.isEmpty(module.name) ? module.id : module.name));
                                    }
                                });
                            }
                        }
                    }
                });
            }
            /**
             * 加载模块
             * @param requireConfig 配置
             * @param module 模块
             * @param success 成功时
             * @param fail 失败时
             */
            require(module, success, fail) {
                ibas.logger.log(ibas.emMessageLevel.DEBUG, "center: module: [{0}|{1}] begin to reload.", module.name, module.console);
                ibas.requires.require({
                    context: ibas.requires.naming(module.name),
                    baseUrl: module.address,
                    map: {
                        "*": {
                            "css": ibas.strings.format("{0}/3rdparty/require-css{1}.js", ibas.urls.rootUrl("/ibas/index"), (this.minLibrary ? ibas.SIGN_MIN_LIBRARY : ""))
                        }
                    },
                    waitSeconds: ibas.config.get(ibas.requires.CONFIG_ITEM_WAIT_SECONDS, 10),
                }, module.index + (this.minLibrary ? ibas.SIGN_MIN_LIBRARY : ""), success, fail);
            }
        }
        const moduleConsoleManager = new ModuleConsoleManager();
        let modules;
        (function (modules) {
            /**
             * 迭代模块
             * @param caller 调用方法
             */
            function forEach(caller) {
                if (!(moduleConsoleManager.consoles instanceof Array)) {
                    return;
                }
                for (let item of moduleConsoleManager.consoles) {
                    caller(item);
                }
            }
            modules.forEach = forEach;
        })(modules = app_2.modules || (app_2.modules = {}));
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app) {
        /** 配置项目-可配置查询 */
        const CONFIG_ITEM_QUERY_PANEL_CONFIGURABLE = "queryPanelConfigurable";
        /** 配置项目-可配置查询-设备 */
        const CONFIG_ITEM_QUERY_PANEL_CONFIGURABLE_ON_PLANTFORM = CONFIG_ITEM_QUERY_PANEL_CONFIGURABLE + "|{0}";
        /** 配置项目-可选择查询 */
        const CONFIG_ITEM_QUERY_PANEL_SELECTABLE = "queryPanelSelectable";
        /** 配置项目-可选择查询-设备 */
        const CONFIG_ITEM_QUERY_PANEL_SELECTABLE_ON_PLANTFORM = CONFIG_ITEM_QUERY_PANEL_SELECTABLE + "|{0}";
        /**
         * 查询面板
         */
        class QueryPanel extends ibas.BarApplication {
            constructor() {
                super();
                this.id = QueryPanel.APPLICATION_ID;
                this.name = QueryPanel.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 初始化 */
            init(callBack) {
                if (callBack instanceof Function) {
                    setTimeout(callBack, 5);
                }
            }
            /** 注册视图 */
            registerView() {
                super.registerView();
                // 注册视图事件
                this.view.searchEvent = this.search;
                this.view.deleteQueryEvent = this.deleteQuery;
                this.view.saveQueryEvent = this.saveQuery;
                this.view.addQueryConditionEvent = this.addQueryCondition;
                this.view.removeQueryConditionEvent = this.removeQueryCondition;
            }
            /** 视图显示后 */
            viewShowed() {
                this.editQuery = this.currentQuery();
                if (ibas.objects.isNull(this.editQuery)) {
                    this.editQuery = new shell.bo.UserQuery();
                    this.editQuery.id = this.listener.queryId;
                    this.editQuery.name = ibas.i18n.prop("shell_data_new") + ibas.i18n.prop("shell_query");
                    this.editQuery.order = 1;
                    this.queries.add(this.editQuery);
                    this.showQueries();
                    this.view.usingQuery = (this.queries.length - 1).toString();
                }
                this.editQuery.target = this.targetName;
                if (ibas.objects.isNull(this.editQuery.criteria)) {
                    this.editQuery.criteria = new ibas.Criteria();
                    this.editQuery.criteria.businessObject = this.editQuery.target;
                }
                this.view.showQuery(this.editQuery);
                this.view.showQueryConditions(this.editQuery.criteria.conditions);
            }
            /** 工具条显示完成 */
            barShowed() {
                this.showQueries();
            }
            showQueries() {
                if (ibas.objects.isNull(this.queries)) {
                    return;
                }
                let keyValues = new Array();
                for (let index = 0; index < this.queries.length; index++) {
                    keyValues.push(new ibas.KeyValue(index.toString(), this.queries[index].name));
                }
                this.view.showQueries(keyValues);
            }
            deleteQuery() {
                let that = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action) {
                        if (action === ibas.emMessageAction.YES) {
                            // 去除查询后保存，表示删除
                            that.editQuery.criteria = null;
                            that.saveQuery();
                        }
                    }
                });
            }
            saveQuery() {
                try {
                    this.editQuery.user = ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE);
                    let that = this;
                    let boRepository = shell.bo.repository.create();
                    boRepository.saveUserQuery({
                        beSaved: this.editQuery,
                        onCompleted(opRslt) {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                that.messages(ibas.emMessageType.SUCCESS, ibas.i18n.prop("shell_sucessful"));
                                // 操作成功，刷新数据，关闭界面
                                if (ibas.objects.isNull(that.editQuery.criteria)) {
                                    // 没查询，表示删除
                                    that.queries.remove(that.editQuery);
                                    that.barShowed();
                                }
                                that.close();
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
            addQueryCondition() {
                this.editQuery.criteria.conditions.create();
                this.view.showQueryConditions(this.editQuery.criteria.conditions);
            }
            removeQueryCondition(condition) {
                this.editQuery.criteria.conditions.remove(condition);
                this.view.showQueryConditions(this.editQuery.criteria.conditions);
            }
            /** 运行 参数，初始化回调 */
            run() {
                let callBack = arguments[0];
                if (!(callBack instanceof Function)) {
                    callBack = function () {
                        // 回掉方法
                    };
                }
                if (!ibas.objects.isNull(this.listener) && !ibas.objects.isNull(this.listener.usingCriteria)) {
                    this.queries = new ibas.ArrayList();
                    this.queries.add({
                        id: this.listener.queryId,
                        name: ibas.i18n.prop("shell_query_exclusive"),
                        criteria: this.listener.usingCriteria,
                        order: 0,
                    });
                    this.init(callBack);
                }
                else {
                    let that = this;
                    let boRepository = shell.bo.repository.create();
                    boRepository.fetchUserQueries({
                        user: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE),
                        queryId: this.listener.queryId,
                        onCompleted: function (opRslt) {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                that.queries = new ibas.ArrayList();
                                for (let item of opRslt.resultObjects) {
                                    that.queries.add(item);
                                }
                                that.init(callBack);
                            }
                            catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                }
            }
            /** 注册监听 */
            register(listener) {
                this.listener = listener;
                if (!ibas.objects.isNull(this.listener)) {
                    this.view.configurable = this.listener.configurable;
                    this.view.selectable = this.listener.selectable;
                }
                if (typeof this.view.selectable !== "boolean") {
                    this.view.selectable = ibas.config.get(ibas.strings.format(CONFIG_ITEM_QUERY_PANEL_SELECTABLE_ON_PLANTFORM, ibas.enums.toString(ibas.emPlantform, ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM))));
                }
                if (typeof this.view.selectable !== "boolean") {
                    this.view.selectable = ibas.config.get(CONFIG_ITEM_QUERY_PANEL_SELECTABLE, true);
                }
                if (typeof this.view.configurable !== "boolean") {
                    this.view.configurable = ibas.config.get(ibas.strings.format(CONFIG_ITEM_QUERY_PANEL_CONFIGURABLE_ON_PLANTFORM, ibas.enums.toString(ibas.emPlantform, ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM))));
                }
                if (typeof this.view.configurable !== "boolean") {
                    this.view.configurable = ibas.config.get(CONFIG_ITEM_QUERY_PANEL_CONFIGURABLE, true);
                }
            }
            get targetName() {
                let boName = null;
                if (!ibas.objects.isNull(this.listener.queryTarget)) {
                    boName = this.listener.queryTarget;
                    if (!ibas.objects.isNull(boName) && typeof boName !== "string") {
                        if (!ibas.objects.isNull(boName.BUSINESS_OBJECT_CODE)) {
                            // 如果目标是对象，则尝试使用其编码
                            boName = ibas.config.applyVariables(boName.BUSINESS_OBJECT_CODE);
                        }
                        else if (!ibas.objects.isNull(boName.name)) {
                            // 如果目标是对象，则尝试使用其名称
                            boName = boName.name;
                        }
                    }
                }
                return boName;
            }
            currentQuery() {
                if (!ibas.objects.isNull(this.queries)) {
                    for (let index = 0; index < this.queries.length; index++) {
                        if (index.toString() === this.view.usingQuery) {
                            return this.queries[index];
                        }
                    }
                }
                return null;
            }
            currentCriteria() {
                let query = this.currentQuery();
                let criteria;
                if (!ibas.objects.isNull(query)) {
                    criteria = query.criteria;
                }
                if (ibas.objects.isNull(criteria)) {
                    criteria = new ibas.Criteria();
                }
                return criteria;
            }
            /** 查询 */
            search() {
                this.busy(true);
                let criteria = this.currentCriteria();
                // 克隆新的，防止被污染
                criteria = criteria.clone();
                // 修正查询数量
                ibas.criterias.resultCount(criteria);
                // 根据目标类型，修正排序条件
                ibas.criterias.sorts(criteria, this.listener.queryTarget);
                // 没有查询条件且有查询内容，尝试从注册信息添加
                let that = this;
                if ((criteria.conditions.length === 0
                    || criteria.conditions.firstOrDefault(c => c.operation === ibas.emConditionOperation.CONTAIN) == null)
                    && !ibas.objects.isNull(this.listener.queryTarget) && !ibas.strings.isEmpty(this.view.searchContent)) {
                    let boName = this.targetName;
                    if (!ibas.objects.isNull(boName)) {
                        let boRepository = shell.bo.repository.create();
                        boRepository.fetchBOInfos({
                            boCode: boName,
                            onCompleted(opRslt) {
                                if (opRslt.resultCode !== 0) {
                                    that.messages(ibas.emMessageType.WARNING, opRslt.message);
                                }
                                if (criteria.conditions.length > 1) {
                                    criteria.conditions.firstOrDefault().bracketOpen += 1;
                                    criteria.conditions.lastOrDefault().bracketClose += 1;
                                }
                                // 检索到了查询字段
                                let firstCondition = null;
                                let lastCondition = null;
                                for (let boItem of opRslt.resultObjects) {
                                    for (let boProperty of boItem.properties) {
                                        if (!boProperty.searched) {
                                            continue;
                                        }
                                        let condition = criteria.conditions.create();
                                        condition.alias = boProperty.property;
                                        condition.value = that.view.searchContent;
                                        condition.operation = ibas.emConditionOperation.CONTAIN;
                                        // 修正查询关系为或
                                        condition.relationship = ibas.emConditionRelationship.OR;
                                        if (firstCondition === null) {
                                            firstCondition = condition;
                                        }
                                        lastCondition = condition;
                                    }
                                }
                                if (firstCondition !== lastCondition) {
                                    firstCondition.bracketOpen = 1;
                                    firstCondition.relationship = ibas.emConditionRelationship.AND;
                                    lastCondition.bracketClose = 1;
                                }
                                // 没有查询字段，则查询主键
                                if (criteria.conditions.length === 0) {
                                    ibas.criterias.conditions(criteria, that.listener.queryTarget, that.view.searchContent);
                                }
                                that.fireQuery(criteria);
                            }
                        });
                    }
                }
                else {
                    this.fireQuery(criteria);
                }
            }
            /** 通知查询事件 */
            fireQuery(criteria) {
                if (!ibas.objects.isNull(this.listener)) {
                    // 给查询条件赋值
                    for (let item of criteria.conditions) {
                        if (item.operation === ibas.emConditionOperation.IS_NULL
                            || item.operation === ibas.emConditionOperation.NOT_NULL
                            || !ibas.strings.isEmpty(item.comparedAlias)) {
                            continue;
                        }
                        if (ibas.strings.isEmpty(item.value)) {
                            item.value = this.view.searchContent;
                        }
                        else if (ibas.strings.isWith(item.value, "${", "}")) {
                            item.value = ibas.variablesManager.getValue(item.value);
                        }
                    }
                    this.listener.query(criteria);
                }
                this.busy(false);
            }
        }
        /** 应用标识 */
        QueryPanel.APPLICATION_ID = "69e3d786-5bf5-451d-b660-3eb485171af5";
        /** 应用名称 */
        QueryPanel.APPLICATION_NAME = "shell_query";
        app.QueryPanel = QueryPanel;
    })(app = shell.app || (shell.app = {}));
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
    let app;
    (function (app_3) {
        /** 功能-系统中心 */
        class CenterFunc extends ibas.ModuleFunction {
            constructor(viewShower) {
                super();
                this.viewShower = viewShower;
            }
            /** 默认功能 */
            default() {
                let app = new app_3.MainApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                return app;
            }
        }
        app_3.CenterFunc = CenterFunc;
    })(app = shell.app || (shell.app = {}));
})(shell || (shell = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./MainApp.ts" />
/// <reference path="./WelcomeApp.ts" />
/// <reference path="./LoginApp.ts" />
/// <reference path="./AboutApp.ts" />
/// <reference path="./HelpApp.ts" />
/// <reference path="./CenterApp.ts" />
/// <reference path="./QueryPanel.ts" />
/// <reference path="./CenterFunc.ts" />
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../borep/index.ts" />
/// <reference path="./common/index.ts" />
/// <reference path="./center/index.ts" />
var shell;
(function (shell) {
    let app;
    (function (app_4) {
        /** 属性-导航 */
        const PROPERTY_NAVIGATION = Symbol("navigation");
        /** 模块控制台 */
        class Console extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor() {
                super();
                this.id = shell.CONSOLE_ID;
                this.name = shell.CONSOLE_NAME;
                this.version = shell.CONSOLE_VERSION;
                this.copyright = ibas.i18n.prop("shell_license");
            }
            /** 视图导航 */
            navigation() {
                return this[PROPERTY_NAVIGATION];
            }
            /** 初始化 */
            registers() {
                // 注册功能
                this.register(new app_4.CenterFunc(this.viewShower));
            }
            /** 运行 */
            run() {
                // 获取壳根地址
                let rootUrl = ibas.urls.rootUrl(Console.ROOT_FILE_NAME);
                // 加载语言-壳
                ibas.i18n.load([
                    ibas.strings.format("{0}/resources/languages/shell.json", rootUrl)
                ], () => {
                    // 设置资源属性
                    this.description = ibas.i18n.prop(this.name);
                    this.icon = ibas.strings.format("{0}/resources/images/logo_small.png", rootUrl);
                    // 加载视图显示者
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
                    this.loadUI(uiModules, (ui) => {
                        // 设置视图显示者
                        this.viewShower = new ui.ViewShower();
                        // 设置导航
                        this[PROPERTY_NAVIGATION] = new ui.Navigation();
                        // 调用初始化
                        this.initialize();
                        // 调用入口应用
                        let app = this.default().default();
                        app.show();
                    });
                    // 保留基类方法
                    super.run();
                });
            }
        }
        /** 根文件名称 */
        Console.ROOT_FILE_NAME = "shell/index";
        app_4.Console = Console;
    })(app = shell.app || (shell.app = {}));
})(shell || (shell = {}));
//# sourceMappingURL=index.js.map