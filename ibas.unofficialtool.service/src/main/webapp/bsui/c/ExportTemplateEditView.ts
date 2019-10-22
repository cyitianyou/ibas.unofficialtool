/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./3rd.ts" />
namespace unofficialtool {
    export namespace ui {
        export namespace c {
            /** 编辑视图-导出模板 */
            export class ExportTemplateEditView extends ibas.BOEditView implements app.IExportTemplateEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 选择业务对象 */
                chooseBusinessObjectEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: importexport.bo.ExportTemplate.BUSINESS_OBJECT_CODE,
                        },
                        content: [
                            new sap.ui.core.HTML("", {
                                preferDOM: false,
                                content: "<div class=\"reportbro\"></div>",
                                afterRendering(): void {
                                }
                            })
                        ]
                    });
                }
                mainHeader: sap.tnt.IToolHeader;
                sideContent: sap.tnt.SideNavigation;
                onDisplayed(): void {
                    super.onDisplayed();
                    let mainPage: sap.ui.core.Element = sap.ui.getCore().byId("__page0");
                    if (mainPage instanceof sap.tnt.ToolPage) {
                        mainPage.setSideExpanded(false);
                        this.mainHeader = mainPage.getHeader();
                        this.sideContent = mainPage.getSideContent();
                        mainPage.setHeader(null);
                        mainPage.setSideContent(null);
                    }
                }
                onClosed(): void {
                    super.onClosed();
                    let mainPage: sap.ui.core.Element = sap.ui.getCore().byId("__page0");
                    if (mainPage instanceof sap.tnt.ToolPage) {
                        mainPage.setHeader(this.mainHeader);
                        mainPage.setSideContent(this.sideContent);
                    }
                }
                private page: sap.extension.m.Page;
                /** 显示数据 */
                async showExportTemplate(data: importexport.bo.ExportTemplate): Promise<void> {
                    let that: this = this;
                    let report: reportBro.IReportData = await Utils.convertToReport(data);
                    setTimeout(() => {
                        $(".reportbro").empty();
                        $(".reportbro").data("reportBro", null);
                        $(".reportbro").reportBro({
                            // 字体
                            additionalFonts: [
                                { name: "Arial", value: "Arial" }
                            ],
                            // 选择业务对象
                            chooseBOCodeEvent(callback: Function): void {
                                that.fireViewEvents(that.chooseBusinessObjectEvent, async (boCode: string, boDescription: string) => {
                                    let parameters: Array<reportBro.IParameter> = await Utils.convertToParameters(boCode);
                                    $(".reportbro").reportBro("reloadParameters", parameters);
                                    callback(boCode);
                                });
                            },
                            // 保存事件
                            saveCallback(): void {
                                let report: reportBro.IReportData = $(".reportbro").reportBro("getReport");
                                if (Utils.convertToExportTemplate(report, data)) {
                                    that.fireViewEvents(that.saveDataEvent);
                                }
                            }
                        });
                        $(".reportbro").reportBro("load", report);
                    }, 100);
                }
            }
        }
    }
}