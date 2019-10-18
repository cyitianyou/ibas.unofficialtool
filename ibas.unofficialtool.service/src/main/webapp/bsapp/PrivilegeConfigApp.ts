/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace app {
        /** 应用-系统权限配置 */
        export class PrivilegeConfigApp extends ibas.Application<IPrivilegeConfigView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "7d621881-fefe-45ca-9016-a7284768cfe1";
            /** 应用名称 */
            static APPLICATION_NAME: string = "initialfantasy_app_privilege_config";
            /** 构造函数 */
            constructor() {
                super();
                this.id = PrivilegeConfigApp.APPLICATION_ID;
                this.name = PrivilegeConfigApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                if (!ibas.strings.isEmpty(ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, ""))) {
                    this.view.title = ibas.strings.format("{0}({1})", this.view.title, ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, ""));
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
            protected viewShowed(): void {
                // 视图加载完成
                // 加载平台信息，仅使用（桌面和平板，手机）
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                condition.relationship = ibas.emConditionRelationship.OR;
                condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.PHONE);
                condition.relationship = ibas.emConditionRelationship.OR;
                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchApplicationPlatform({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            this.view.showPlatforms(opRslt.resultObjects);
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });
            }
            /** 查询数据 */
            private fetchRoles(criteria: ibas.ICriteria): void {
                this.busy(true);
                let that: this = this;
                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchRole({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Organization>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                            }
                            that.view.showRoles(opRslt.resultObjects);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            private privileges: ibas.IList<Privilege>;
            /** 查询数据 */
            private fetchPrivileges(criteria: ibas.ICriteria): void {
                this.busy(true);
                let platform: string = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                let condition: ibas.ICondition = criteria.conditions.firstOrDefault(c => c.alias === initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME);
                if (!ibas.objects.isNull(condition)) {
                    platform = condition.value;
                }
                let role: string;
                condition = criteria.conditions.firstOrDefault(c => c.alias === initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME);
                if (!ibas.objects.isNull(condition)) {
                    role = condition.value;
                }
                let that: this = this;
                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchPrivilege({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Privilege>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let values: ibas.IList<Privilege> = new ibas.ArrayList<Privilege>();
                            shell.app.modules.forEach((module) => {
                                let privilege: initialfantasy.bo.Privilege =
                                    opRslt.resultObjects.firstOrDefault(c => c.moduleId === module.id && c.platformId === platform && ibas.strings.isEmpty(c.target));
                                if (ibas.objects.isNull(privilege)) {
                                    privilege = new initialfantasy.bo.Privilege();
                                    privilege.roleCode = role;
                                    privilege.platformId = platform;
                                    privilege.moduleId = module.id;
                                    privilege.authoriseValue = ibas.emAuthoriseType.NONE;
                                }
                                privilege.markOld(); // 权限一样的不保存
                                let uiPrivilege: Privilege = new Privilege(privilege, initialfantasy.bo.emElementType.MODULE);
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
                                    } else if (item instanceof ibas.Application) {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.APPLICATION));
                                    } else if (item instanceof ibas.ServiceMapping) {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.SERVICE));
                                    } else {
                                        uiPrivilege.privileges.add(new Privilege(privilege, initialfantasy.bo.emElementType.OTHER));
                                    }
                                }
                            });
                            that.privileges = ibas.arrays.sort(values, [
                                new ibas.Sort(initialfantasy.bo.Privilege.PROPERTY_MODULEID_NAME, ibas.emSortType.ASCENDING)
                            ]);
                            that.view.showPrivileges(that.privileges);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 保存数据 */
            private savePrivileges(): void {
                if (!(this.privileges instanceof Array)) {
                    return;
                }
                this.busy(true);
                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                ibas.queues.execute(this.privileges,
                    (data, next) => {
                        // 仅保存修改过的
                        if (!(data.data.isDirty)) {
                            next();
                        } else {
                            if (!(data.data.objectKey > 0)) {
                                // 没有主键，则认为是新数据
                                data.data.markNew();
                            }
                            boRepository.savePrivilege({
                                beSaved: data.data,
                                onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Privilege>): void {
                                    if (opRslt.resultCode !== 0) {
                                        next(new Error(opRslt.message));
                                    } else {
                                        if (opRslt.resultObjects.length > 0) {
                                            data.data = opRslt.resultObjects.firstOrDefault();
                                        } else {
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
                        } else {
                            this.messages(ibas.emMessageType.SUCCESS,
                                ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                        }
                        this.view.showPrivileges(this.privileges);
                    }
                );
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 复制权限  */
            private copyPrivileges(): void {
                if (!(this.privileges instanceof Array)) {
                    return;
                }
                // 选择复制的平台
                let that: this = this;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.COMBINATION);
                condition.relationship = ibas.emConditionRelationship.OR;
                condition = criteria.conditions.create();
                condition.alias = initialfantasy.bo.ApplicationPlatform.PROPERTY_PLATFORMCODE_NAME;
                condition.value = ibas.enums.toString(ibas.emPlantform, ibas.emPlantform.PHONE);
                condition.relationship = ibas.emConditionRelationship.OR;
                ibas.servicesManager.runChooseService<initialfantasy.bo.ApplicationPlatform>({
                    title: ibas.strings.format("{0}-{1}", ibas.i18n.prop("initialfantasy_copy_from"), ibas.i18n.prop("bo_privilege_platformid")),
                    boCode: initialfantasy.bo.BO_CODE_APPLICATIONPLATFORM,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: criteria,
                    viewMode: ibas.emViewMode.VIEW,
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.ApplicationPlatform>): void {
                        let platform: initialfantasy.bo.ApplicationPlatform = selecteds.firstOrDefault();
                        criteria = new ibas.Criteria();
                        condition = criteria.conditions.create();
                        condition.alias = "Code";
                        condition.operation = ibas.emConditionOperation.NOT_NULL;
                        ibas.servicesManager.runChooseService<initialfantasy.bo.IRole>({
                            title: ibas.strings.format("{0}-{1}", ibas.i18n.prop("initialfantasy_copy_from"), ibas.i18n.prop("bo_privilege_rolecode")),
                            boCode: initialfantasy.bo.BO_CODE_ROLE,
                            chooseType: ibas.emChooseType.SINGLE,
                            criteria: criteria,
                            viewMode: ibas.emViewMode.VIEW,
                            onCompleted(selecteds: ibas.IList<initialfantasy.bo.IRole>): void {
                                let role: initialfantasy.bo.IRole = selecteds.firstOrDefault();
                                // 查询复制的权限
                                criteria = new ibas.Criteria();
                                condition = criteria.conditions.create();
                                condition.alias = initialfantasy.bo.Privilege.PROPERTY_PLATFORMID_NAME;
                                condition.value = platform.platformCode;
                                condition = criteria.conditions.create();
                                condition.alias = initialfantasy.bo.Privilege.PROPERTY_ROLECODE_NAME;
                                condition.value = role.code;
                                that.busy(true);
                                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                                boRepository.fetchPrivilege({
                                    criteria: criteria,
                                    onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Privilege>): void {
                                        try {
                                            that.busy(false);
                                            if (opRslt.resultCode !== 0) {
                                                throw new Error(opRslt.message);
                                            }
                                            for (let item of that.privileges) {
                                                let data: initialfantasy.bo.IPrivilege = opRslt.resultObjects.firstOrDefault(
                                                    c => ibas.strings.equals(c.moduleId, item.moduleId)
                                                        && ibas.strings.equals(c.target, item.target)
                                                );
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
                                        } catch (error) {
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
            private deletePrivileges(criteria: ibas.ICriteria): void {
                if (criteria.conditions.length === 0) {
                    throw new Error(ibas.i18n.prop("sys_invalid_parameter", "criteria"));
                }
                let that: this = this;
                let boRepository: initialfantasy.bo.IBORepositoryInitialFantasy =
                    bOFactory.createRepository<initialfantasy.bo.IBORepositoryInitialFantasy>(initialfantasy.bo.BO_REPOSITORY_INITIALFANTASY);
                boRepository.fetchPrivilege({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Privilege>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let beDeleteds: ibas.IList<initialfantasy.bo.Privilege> = opRslt.resultObjects;
                            beDeleteds.forEach((value) => {
                                value.delete();
                            });
                            that.messages({
                                type: ibas.emMessageType.QUESTION,
                                title: ibas.i18n.prop(that.name),
                                message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                                actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                                onCompleted(action: ibas.emMessageAction): void {
                                    if (action !== ibas.emMessageAction.YES) {
                                        return;
                                    }
                                    that.busy(true);
                                    ibas.queues.execute(beDeleteds, (data, next) => {
                                        // 处理数据
                                        boRepository.savePrivilege({
                                            beSaved: data,
                                            onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.Privilege>): void {
                                                if (opRslt.resultCode !== 0) {
                                                    next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                                } else {
                                                    next();
                                                }
                                            }
                                        });
                                    }, (error) => {
                                        // 处理完成
                                        if (error instanceof Error) {
                                            that.messages(ibas.emMessageType.ERROR, error.message);
                                        } else {
                                            that.messages(ibas.emMessageType.SUCCESS,
                                                ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                        }
                                        that.privileges = new ibas.ArrayList<Privilege>();
                                        that.view.showPrivileges(that.privileges);
                                        that.busy(false);
                                    });
                                }
                            });
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
            }
            /** 编辑身份权限 */
            private editIdentityPrivileges(role: string | initialfantasy.bo.IRole, platform: string): void {
                role = typeof role !== "string" && role ? role.code : role;
                if (ibas.strings.isEmpty(role)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_identityprivilege_rolecode")));
                    return;
                }
                if (ibas.strings.isEmpty(platform)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_identityprivilege_platformid")));
                    return;
                }
                let privileges: ibas.IList<initialfantasy.bo.IPrivilege> = new ibas.ArrayList<initialfantasy.bo.IPrivilege>();
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
        /** 视图-系统权限 */
        export interface IPrivilegeConfigView extends ibas.IView {
            /** 查询角色 */
            fetchRolesEvent: Function;
            /** 查询权限  */
            fetchPrivilegesEvent: Function;
            /** 保存权限 */
            savePrivilegesEvent: Function;
            /** 删除权限 */
            deletePrivilegesEvent: Function;
            /** 复制权限  */
            copyPrivilegesEvent: Function;
            /** 显示角色 */
            showRoles(datas: initialfantasy.bo.IRole[]): void;
            /** 显示权限 */
            showPrivileges(datas: Privilege[]): void;
            /** 显示平台 */
            showPlatforms(datas: initialfantasy.bo.IApplicationPlatform[]): void;
            /** 编辑身份权限  */
            editIdentityPrivilegesEvent: Function;
        }

        /** 系统权限 */
        export class Privilege extends ibas.Bindable {
            constructor(data: initialfantasy.bo.Privilege, type: initialfantasy.bo.emElementType) {
                super();
                this.data = data;
                this.type = type;
                this.privileges = new ibas.ArrayList();
            }
            registerListener(listener: ibas.IPropertyChangedListener): void {
                this.data.registerListener.apply(this.data, arguments);
            }
            removeListener(listener: ibas.IPropertyChangedListener): void;
            removeListener(id: string): void;
            removeListener(): void;
            removeListener(): void {
                this.data.removeListener.apply(this.data, arguments);
            }
            data: initialfantasy.bo.Privilege;
            type: initialfantasy.bo.emElementType;
            privileges: ibas.IList<Privilege>;
            get isDirty(): boolean {
                return this.data.isDirty;
            }
            get roleCode(): string {
                return this.data.roleCode;
            }
            set roleCode(value: string) {
                this.data.roleCode = value;
            }
            get platformId(): string {
                return this.data.platformId;
            }
            set platformId(value: string) {
                this.data.platformId = value;
            }
            get moduleId(): string {
                return this.data.moduleId;
            }
            set moduleId(value: string) {
                this.data.moduleId = value;
            }
            get target(): string {
                return this.data.target;
            }
            set target(value: string) {
                this.data.target = value;
            }
            get activated(): ibas.emYesNo {
                return this.data.activated;
            }
            set activated(value: ibas.emYesNo) {
                this.data.activated = value;
            }
            get authoriseValue(): ibas.emAuthoriseType {
                return this.data.authoriseValue;
            }
            set authoriseValue(value: ibas.emAuthoriseType) {
                this.data.authoriseValue = value;
            }
            get automatic(): ibas.emYesNo {
                return this.data.automatic;
            }
            set automatic(value: ibas.emYesNo) {
                this.data.automatic = value;
            }
        }
        export class PrivilegeFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "de5b3d3f-70cc-45d5-9c87-d1b61cdb73de";
            /** 功能名称 */
            static FUNCTION_NAME = "initialfantasy_func_privilege";
            /** 构造函数 */
            constructor() {
                super();
                this.id = PrivilegeFunc.FUNCTION_ID;
                this.name = PrivilegeFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                if (!ibas.objects.isNull(bOFactory.createRepository(bo.BO_REPOSITORY_UNOFFICIALTOOL))) {
                    let app: PrivilegeConfigApp = new PrivilegeConfigApp();
                    app.navigation = this.navigation;
                    return app;
                }
                return null;
            }
        }
    }
}