/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace app {
        /** 编辑应用-导出模板 */
        export class ExportTemplateEditApp extends ibas.BOEditApplication<IExportTemplateEditView, importexport.bo.ExportTemplate> {

            /** 应用标识 */
            static APPLICATION_ID: string = "999a6a5e-c002-472b-8ff8-a37c6c2db6e7";
            /** 应用名称 */
            static APPLICATION_NAME: string = "unofficialtool_app_exporttemplate_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = importexport.bo.ExportTemplate.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ExportTemplateEditApp.APPLICATION_ID;
                this.name = ExportTemplateEditApp.APPLICATION_NAME;
                this.boCode = ExportTemplateEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
                if (!ibas.strings.isEmpty(ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, ""))) {
                    this.description = ibas.strings.format("{0}({1})", this.description, ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, ""));
                }
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.chooseBusinessObjectEvent = this.chooseBusinessObject;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new importexport.bo.ExportTemplate();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showExportTemplate(this.editData);
            }
            run(): void;
            run(data: importexport.bo.ExportTemplate): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], importexport.bo.ExportTemplate)) {
                    let data: importexport.bo.ExportTemplate = arguments[0];
                    // 新对象直接编辑
                    if (data.isNew) {
                        that.editData = data;
                        that.show();
                        return;
                    }
                    // 尝试重新查询编辑对象
                    let criteria: ibas.ICriteria = data.criteria();
                    if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                        // 有效的查询对象查询
                        let boRepository: importexport.bo.BORepositoryImportExport = new importexport.bo.BORepositoryImportExport();
                        boRepository.fetchExportTemplate({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<importexport.bo.ExportTemplate>): void {
                                let data: importexport.bo.ExportTemplate;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, importexport.bo.ExportTemplate)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    that.show();
                                } else {
                                    // 数据重新检索无效
                                    that.messages({
                                        type: ibas.emMessageType.WARNING,
                                        message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                        onCompleted(): void {
                                            that.show();
                                        }
                                    });
                                }
                            }
                        });
                        return; // 退出
                    }
                }
                super.run.apply(this, arguments);
            }
            /** 待编辑的数据 */
            protected editData: importexport.bo.ExportTemplate;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: importexport.bo.BORepositoryImportExport = new importexport.bo.BORepositoryImportExport();
                boRepository.saveExportTemplate({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<importexport.bo.ExportTemplate>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                            }
                            // 刷新当前视图
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 删除数据 */
            protected deleteData(): void {
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action === ibas.emMessageAction.YES) {
                            that.editData.delete();
                            that.saveData();
                        }
                    }
                });
            }
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void {
                let that: this = this;
                let createData: Function = function (): void {
                    if (clone) {
                        // 克隆对象
                        that.editData = that.editData.clone();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new importexport.bo.ExportTemplate();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                        that.viewShowed();
                    }
                };
                if (that.editData.isDirty) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("shell_data_not_saved_continue"),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                createData();
                            }
                        }
                    });
                } else {
                    createData();
                }
            }
            /** 选择业务对象事件 */
            private chooseBusinessObject(callback: Function): void {
                let that: this = this;
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = "Code";
                condition.value = ".";
                condition.operation = ibas.emConditionOperation.NOT_CONTAIN;
                ibas.servicesManager.runChooseService<initialfantasy.bo.IBOInformation>({
                    boCode: initialfantasy.bo.BO_CODE_BOINFORMATION,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<initialfantasy.bo.IBOInformation>): void {
                        let selected: initialfantasy.bo.IBOInformation = selecteds.firstOrDefault();
                        callback(selected.code, selected.description);
                    }
                });
            }
        }
        /** 视图-导出模板 */
        export interface IExportTemplateEditView extends ibas.IBOEditView {
            /** 选择业务对象 */
            chooseBusinessObjectEvent: Function;
            /** 显示数据 */
            showExportTemplate(data: importexport.bo.ExportTemplate): void;
        }
        export class ExportTemplateFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "86024fe1-b84d-4402-9da6-492b68376d69";
            /** 功能名称 */
            static FUNCTION_NAME = "unofficialtool_func_exporttemplate";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ExportTemplateFunc.FUNCTION_ID;
                this.name = ExportTemplateFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                if (!ibas.objects.isNull(bOFactory.createRepository(bo.BO_REPOSITORY_UNOFFICIALTOOL))) {
                    let app: importexport.app.ExportTemplateListApp = new importexport.app.ExportTemplateListApp();
                    app.navigation = this.navigation;
                    (<any>app).newData = function (): void {
                        let app: ExportTemplateEditApp = new ExportTemplateEditApp();
                        app.navigation = this.navigation;
                        app.viewShower = this.viewShower;
                        app.run();
                    };
                    (<any>app).editData = function (data: importexport.bo.ExportTemplate): void {
                        // 检查目标数据
                        if (ibas.objects.isNull(data)) {
                            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                                ibas.i18n.prop("shell_data_edit")
                            ));
                            return;
                        }
                        let app: ExportTemplateEditApp = new ExportTemplateEditApp();
                        app.navigation = this.navigation;
                        app.viewShower = this.viewShower;
                        app.run(data);
                    };
                    app.description = ibas.strings.format("{0}({1})",
                        ibas.i18n.prop("unofficialtool_app_exporttemplate_list"),
                        ibas.config.get(CONFIG_ITEM_REMOTE_SYSTEM_URL, "")
                    );
                    return app;
                }
                return null;
            }
        }
    }
}
