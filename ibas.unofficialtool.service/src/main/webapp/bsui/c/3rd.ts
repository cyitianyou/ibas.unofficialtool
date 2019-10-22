/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http?://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    export namespace ui {
        export namespace c {
            export class Utils {
                static elementId: number;
                static async convertToReport(data: importexport.bo.ExportTemplate): Promise<reportBro.IReportData> {
                    let report: reportBro.IReportData = {
                        docElements: [],
                        version: 2,
                        parameters: await Utils.convertToParameters(data.boCode),
                        styles: []
                    };
                    // #region documentProperties
                    let documentProperties: reportBro.IDocumentProperties = {
                        orientation: "portrait",
                        pageFormat: "user_defined",
                        unit: "px"
                    };
                    documentProperties.boCode = data.boCode || "";
                    documentProperties.name = data.name || "";
                    documentProperties.pageWidth = (data.width || 0) + "";
                    documentProperties.pageHeight = (data.height || 0) + "";
                    documentProperties.marginLeft = (data.marginLeft || 0) + "";
                    documentProperties.marginRight = (data.marginRight || 0) + "";
                    documentProperties.marginTop = (data.marginTop || 0) + (data.pageHeaderTop || 0) + "";
                    documentProperties.marginBottom = (data.marginBottom || 0) + "";
                    documentProperties.pageHeaderSize = (data.pageHeaderHeight || 0) + "";
                    documentProperties.startSectionSize = (data.startSectionHeight || 0) + "";
                    documentProperties.repetitionSize = (data.repetitionHeaderHeight || 0) + (data.repetitionHeight || 0)
                        + (data.repetitionFooterHeight || 0) + "";
                    documentProperties.endSectionSize = (data.endSectionHeight || 0) + "";
                    documentProperties.pageFooterSize = (data.pageFooterHeight || 0) + "";
                    report.documentProperties = documentProperties;
                    // #endregion
                    Utils.elementId = 1;
                    for (let item of data.pageHeaders.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                            containerId: "0_page_header"
                        };
                        Utils.convertToDocElement(docElement, item);
                        report.docElements.push(docElement);
                    }
                    for (let item of data.startSections.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                            containerId: "0_start_section"
                        };
                        Utils.convertToDocElement(docElement, item);
                        report.docElements.push(docElement);
                    }
                    let tableElement: reportBro.ITableElement = {
                        id: Utils.elementId++,
                        elementType: "table",
                        columns: data.repetitionHeaders.length + "",
                        contentDataRows: [],
                        header: true,
                        footer: false,
                        x: (data.repetitionLeft || 0) - (data.marginLeft || 0),
                        containerId: "0_repetition"
                    };
                    Utils.convertToTableElement(tableElement, data);
                    report.docElements.push(tableElement);
                    for (let item of data.endSections.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                            containerId: "0_end_section"
                        };
                        Utils.convertToDocElement(docElement, item);
                        report.docElements.push(docElement);
                    }
                    for (let item of data.pageFooters.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                            containerId: "0_page_footer"
                        };
                        Utils.convertToDocElement(docElement, item);
                        report.docElements.push(docElement);
                    }
                    return report;
                }
                static convertToTableElement(tableElement: reportBro.ITableElement, data: importexport.bo.ExportTemplate): void {
                    let header: reportBro.ITableBandElement = {
                        id: Utils.elementId++,
                        height: data.repetitionHeaderHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitionHeaders.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionHeaderHeight || 0;
                        header.columnData.push(docElement);
                    }
                    tableElement.headerData = header;
                    let contentDataRow: reportBro.ITableBandElement = {
                        id: Utils.elementId++,
                        height: data.repetitionHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitions.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionHeight || 0;
                        contentDataRow.columnData.push(docElement);
                    }
                    tableElement.contentDataRows.push(contentDataRow);
                    if (data.repetitionFooters.filterDeleted().length > 0) {
                        tableElement.footer = true;
                    }
                    let footer: reportBro.ITableBandElement = {
                        id: Utils.elementId++,
                        height: data.repetitionFooterHeight || 0,
                        elementType: "none",
                        columnData: []
                    };
                    for (let item of data.repetitionFooters.filterDeleted()) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                        };
                        Utils.convertToDocElement(docElement, item);
                        docElement.height = data.repetitionFooterHeight || 0;
                        footer.columnData.push(docElement);
                    }
                    for (let i: number = 0; i < data.repetitionHeaders.length - data.repetitionFooters.length; i++) {
                        let docElement: reportBro.IDocElement = {
                            id: Utils.elementId++,
                            elementType: "table_text",
                            height: data.repetitionFooterHeight || 0
                        };
                        footer.columnData.push(docElement);
                    }
                    tableElement.footerData = footer;

                }
                static convertToDocElement(docElement: reportBro.IDocElement, item: importexport.bo.ExportTemplateItem): void {
                    docElement.width = item.itemWidth || 0;
                    if (docElement.width <= 0 && !!item.itemString) {
                        docElement.width = item.itemString.length * (item.fontSize || 0);
                    }
                    docElement.height = item.itemHeight || 0;
                    docElement.x = item.itemLeft || 0;
                    docElement.y = item.itemTop || 0;
                    if (item.itemType === "IMG") {
                        docElement.elementType = "image";
                        let textElement: reportBro.IImageElement = docElement as reportBro.IImageElement;
                        textElement.sourceType = ibas.enums.toString(importexport.bo.emDataSourceType, item.sourceType);
                        textElement.content = item.itemString || "";
                        textElement.format = item.valueFormat || "";
                    } else {
                        if (!docElement.containerId) {
                            docElement.elementType = "table_text";
                        } else {
                            docElement.elementType = "text";
                        }
                        let textElement: reportBro.ITextElement = docElement as reportBro.ITextElement;
                        textElement.sourceType = ibas.enums.toString(importexport.bo.emDataSourceType, item.sourceType);
                        textElement.content = item.itemString || "";
                        textElement.format = item.valueFormat || "";
                        textElement.font = item.fontName || "Arial";
                        textElement.fontSize = item.fontSize || 12;
                        textElement.horizontalAlignment = ibas.enums.toString(importexport.bo.emJustificationHorizontal, item.justificationHorizontal).toLowerCase();
                        textElement.bold = false;
                        textElement.italic = false;
                        switch (item.textStyle) {
                            case importexport.bo.emTextStyle.REGULAR:
                                break;
                            case importexport.bo.emTextStyle.BOLD:
                                textElement.bold = true;
                                break;
                            case importexport.bo.emTextStyle.ITALIC:
                                textElement.italic = true;
                                break;
                            case importexport.bo.emTextStyle.BOLD_ITALIC:
                                textElement.bold = true;
                                textElement.italic = true;
                                break;
                        }
                    }
                }
                static async convertToParameters(boCode: string): Promise<Array<reportBro.IParameter>> {
                    let promise: Promise<Array<reportBro.IParameter>> = new Promise<Array<reportBro.IParameter>>(resolve => {
                        let parameters: Array<reportBro.IParameter> = [
                            {
                                name: "PAGE_INDEX",
                                description: "当前页码",
                                showOnlyNameType: true,
                                arrayItemType: "string",
                                eval: false,
                                expression: "",
                                id: Utils.elementId++,
                                nullable: false,
                                pattern: "",
                                testData: "1",
                                type: "number",
                            },
                            {
                                name: "PAGE_TOTAL",
                                description: "总页码",
                                showOnlyNameType: true,
                                arrayItemType: "string",
                                eval: false,
                                expression: "",
                                id: Utils.elementId++,
                                nullable: false,
                                pattern: "",
                                testData: "1",
                                type: "number",
                            },
                            {
                                name: "DATA_SIZE",
                                description: "当前行",
                                showOnlyNameType: true,
                                arrayItemType: "string",
                                eval: false,
                                expression: "",
                                id: Utils.elementId++,
                                nullable: false,
                                pattern: "",
                                testData: "1",
                                type: "number",
                            },
                            {
                                name: "DATA_INDEX",
                                description: "总行数",
                                showOnlyNameType: true,
                                arrayItemType: "string",
                                eval: false,
                                expression: "",
                                id: Utils.elementId++,
                                nullable: false,
                                pattern: "",
                                testData: "1",
                                type: "number",
                            },
                            {
                                name: "TIME_NOW",
                                description: "当前时间",
                                showOnlyNameType: true,
                                arrayItemType: "string",
                                eval: false,
                                expression: "",
                                id: Utils.elementId++,
                                nullable: false,
                                pattern: "",
                                testData: "",
                                type: "number",
                            },
                        ];
                        if (ibas.strings.isEmpty(boCode)) {
                            resolve(parameters);
                            return;
                        }
                        let criteria: ibas.Criteria = new ibas.Criteria();
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                        condition.operation = ibas.emConditionOperation.START;
                        condition.value = boCode;
                        let sort: ibas.ISort = criteria.sorts.create();
                        sort.alias = initialfantasy.bo.BOInformation.PROPERTY_CODE_NAME;
                        sort.sortType = ibas.emSortType.ASCENDING;
                        let boRepository: initialfantasy.bo.BORepositoryInitialFantasy = new initialfantasy.bo.BORepositoryInitialFantasy();
                        boRepository.fetchBOInformation({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<initialfantasy.bo.BOInformation>): void {
                                try {
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    let data: initialfantasy.bo.BOInformation = opRslt.resultObjects.firstOrDefault(c => {
                                        return c.code.indexOf(".") < 0;
                                    });
                                    if (!ibas.objects.isNull(data)) {
                                        let convertToParameter: Function =
                                            (data: initialfantasy.bo.BOInformation, prefix: string, parameters: Array<reportBro.IParameter>): void => {
                                                for (let boPropertyInformation of data.boPropertyInformations) {
                                                    if (boPropertyInformation.mapped.indexOf(".") < 0) {
                                                        // 字段
                                                        let parameter: reportBro.IParameter = {
                                                            name: boPropertyInformation.property,
                                                            description: boPropertyInformation.description,
                                                            showOnlyNameType: true,
                                                            arrayItemType: "string",
                                                            eval: false,
                                                            expression: "",
                                                            id: Utils.elementId++,
                                                            nullable: false,
                                                            pattern: "",
                                                            testData: "",
                                                            type: "number",
                                                        };
                                                        parameters.push(parameter);
                                                    } else {
                                                        // 子表
                                                        let dataItem: initialfantasy.bo.BOInformation = opRslt.resultObjects.firstOrDefault(c => {
                                                            return c.code === boPropertyInformation.mapped;
                                                        });
                                                        if (!ibas.objects.isNull(dataItem)) {
                                                            let parameter: reportBro.IParameter = {
                                                                arrayItemType: "string",
                                                                children: [],
                                                                eval: false,
                                                                expression: "",
                                                                id: Utils.elementId++,
                                                                name: boPropertyInformation.property + "[]",
                                                                description: dataItem.description,
                                                                nullable: false,
                                                                pattern: "",
                                                                showOnlyNameType: false,
                                                                testData: "",
                                                                type: "map"
                                                            };
                                                            convertToParameter(dataItem, "", parameter.children);
                                                            parameters.push(parameter);
                                                        }
                                                    }
                                                }
                                            };
                                        convertToParameter(data, "", parameters);
                                        // 主对象
                                    }
                                } catch (error) {
                                }
                                resolve(parameters);
                            }
                        });
                    });
                    return promise;
                }
                static convertToExportTemplate(report: reportBro.IReportData, data: importexport.bo.ExportTemplate): boolean {
                    let documentProperties: reportBro.IDocumentProperties = report.documentProperties;
                    let tableElement: reportBro.ITableElement = report.docElements.find(c => {
                        return c.elementType === "table" && c.containerId === "0_repetition";
                    });
                    if (ibas.objects.isNull(tableElement)) {
                        return false;
                    }
                    let headerBand: reportBro.ITableBandElement = tableElement.headerData;
                    let contentBand: reportBro.ITableBandElement = tableElement.contentDataRows[0];
                    let footerBand: reportBro.ITableBandElement = tableElement.footerData;
                    if (ibas.objects.isNull(headerBand) || ibas.objects.isNull(contentBand) || ibas.objects.isNull(footerBand)) {
                        return false;
                    }
                    Utils.resetExportTemplate(data);
                    data.name = documentProperties.name;
                    data.boCode = documentProperties.boCode;
                    data.dpi = 0;
                    data.marginArea = 0;
                    data.width = ibas.numbers.valueOf(documentProperties.pageWidth);
                    data.height = ibas.numbers.valueOf(documentProperties.pageHeight);
                    data.marginLeft = ibas.numbers.valueOf(documentProperties.marginLeft);
                    data.marginRight = ibas.numbers.valueOf(documentProperties.marginRight);
                    data.marginTop = ibas.numbers.valueOf(documentProperties.marginTop);
                    data.marginBottom = ibas.numbers.valueOf(documentProperties.marginBottom);

                    data.pageHeaderWidth = data.width - data.marginLeft - data.marginRight;
                    data.startSectionWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionHeaderWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionWidth = data.width - data.marginLeft - data.marginRight;
                    data.repetitionFooterWidth = data.width - data.marginLeft - data.marginRight;
                    data.endSectionWidth = data.width - data.marginLeft - data.marginRight;
                    data.pageFooterWidth = data.width - data.marginLeft - data.marginRight;

                    data.pageHeaderHeight = ibas.numbers.valueOf(documentProperties.pageHeaderSize);
                    data.startSectionHeight = ibas.numbers.valueOf(documentProperties.startSectionSize);
                    data.repetitionHeaderHeight = ibas.numbers.valueOf(headerBand.height);
                    data.repetitionHeight = ibas.numbers.valueOf(contentBand.height);
                    data.repetitionFooterHeight = ibas.numbers.valueOf(footerBand.height);
                    data.endSectionHeight = ibas.numbers.valueOf(documentProperties.endSectionSize);
                    data.pageFooterHeight = ibas.numbers.valueOf(documentProperties.pageFooterSize);

                    data.pageHeaderLeft = data.marginLeft;
                    data.startSectionLeft = data.marginLeft;
                    data.repetitionHeaderLeft = data.marginLeft + tableElement.x;
                    data.repetitionLeft = data.marginLeft + tableElement.x;
                    data.repetitionFooterLeft = data.marginLeft + tableElement.x;
                    data.endSectionLeft = data.marginLeft;
                    data.pageFooterLeft = data.marginLeft;

                    data.pageHeaderTop = 0;
                    data.startSectionTop = data.pageHeaderTop + data.pageHeaderHeight;
                    data.repetitionHeaderTop = data.startSectionTop + data.startSectionHeight;
                    data.repetitionTop = data.repetitionHeaderTop + data.repetitionHeaderHeight;
                    data.repetitionFooterTop = data.repetitionTop + data.repetitionHeight;
                    data.endSectionTop = data.repetitionFooterTop + data.repetitionFooterHeight;
                    data.pageFooterTop = data.height - data.marginBottom - data.pageFooterWidth;
                    for (let docElement of report.docElements) {
                        if (docElement.elementType === "image" || docElement.elementType === "text") {
                            Utils.convertToExportTemplateItem(docElement, data);
                        }
                    }
                    let x: number = 0;
                    for (let tableTextElement of headerBand.columnData) {
                        tableTextElement.x = x;
                        Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION_HEADER);
                        x += (tableTextElement.width || 0);
                    }
                    x = 0;
                    for (let tableTextElement of contentBand.columnData) {
                        tableTextElement.x = x;
                        Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION);
                        x += (tableTextElement.width || 0);
                    }
                    if (!!tableElement.footer) {
                        x = 0;
                        for (let tableTextElement of footerBand.columnData) {
                            tableTextElement.x = x;
                            Utils.convertToExportTemplateItem(tableTextElement, data, importexport.bo.emAreaType.REPETITION_FOOTER);
                            x += (tableTextElement.width || 0);
                        }
                    }
                    return true;

                }
                static convertToExportTemplateItem(docElement: reportBro.IImageElement | reportBro.ITextElement,
                    data: importexport.bo.ExportTemplate, areaType?: importexport.bo.emAreaType): void {
                    let item: importexport.bo.ExportTemplateItem;
                    switch (docElement.containerId) {
                        case "0_page_header":
                            item = data.pageHeaders.create();
                            break;
                        case "0_start_section":
                            item = data.startSections.create();
                            break;
                        case "0_end_section":
                            item = data.endSections.create();
                            break;
                        case "0_page_footer":
                            item = data.pageFooters.create();
                            break;
                        default:
                            if (areaType === importexport.bo.emAreaType.REPETITION_HEADER) {
                                item = data.repetitionHeaders.create();
                            } else if (areaType === importexport.bo.emAreaType.REPETITION) {
                                item = data.repetitions.create();
                            } else if (areaType === importexport.bo.emAreaType.REPETITION_FOOTER) {
                                item = data.repetitionFooters.create();
                            } else {
                                return;
                            }
                    }
                    item.itemType = docElement.elementType === "image" ? "IMG" : "TEXT";
                    item.itemVisible = ibas.emYesNo.YES;
                    item.sourceType = ibas.enums.valueOf(importexport.bo.emDataSourceType, docElement.sourceType);
                    item.itemString = docElement.content;
                    item.valueFormat = docElement.format;
                    item.textStyle = importexport.bo.emTextStyle.REGULAR;
                    item.itemLeft = docElement.x || 0;
                    item.itemTop = docElement.y || 0;
                    item.itemWidth = docElement.width;
                    item.itemHeight = item.itemHeight || docElement.height;
                    item.justificationHorizontal = ibas.enums.valueOf(importexport.bo.emJustificationHorizontal, docElement.horizontalAlignment.toUpperCase());
                    if (docElement.elementType === "image") {
                        item.itemType = "IMG";
                    } else {
                        item.itemType = "TEXT";
                        let textElement: reportBro.ITextElement = docElement;
                        item.fontName = textElement.font;
                        item.fontSize = textElement.fontSize;
                        if (!!textElement.bold && !!textElement.italic) {
                            item.textStyle = importexport.bo.emTextStyle.BOLD_ITALIC;
                        } else if (!!textElement.bold) {
                            item.textStyle = importexport.bo.emTextStyle.BOLD;
                        } else if (!!textElement.italic) {
                            item.textStyle = importexport.bo.emTextStyle.ITALIC;
                        }
                    }
                }
                static resetExportTemplate(data: importexport.bo.ExportTemplate): void {
                    for (let item of data.pageHeaders.filterDeleted()) {
                        if (data.pageHeaders.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.pageHeaders.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.startSections.filterDeleted()) {
                        if (data.startSections.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.startSections.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitionHeaders.filterDeleted()) {
                        if (data.repetitionHeaders.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitionHeaders.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitions.filterDeleted()) {
                        if (data.repetitions.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitions.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.repetitionFooters.filterDeleted()) {
                        if (data.repetitionFooters.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.repetitionFooters.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.endSections.filterDeleted()) {
                        if (data.endSections.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.endSections.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                    for (let item of data.pageFooters.filterDeleted()) {
                        if (data.pageFooters.indexOf(item) >= 0) {
                            if (item.isNew) {
                                // 新建的移除集合
                                data.pageFooters.remove(item);
                            } else {
                                // 非新建标记删除
                                item.delete();
                            }
                        }
                    }
                }
            }
        }
    }
}
declare namespace reportBro {
    export interface IReportData {
        docElements?: Array<IDocElement>;
        documentProperties?: IDocumentProperties;
        parameters?: Array<IParameter>;
        styles?: Array<IStyle>;
        version?: number;
    }
    export interface IDocElement {
        elementType?: string;
        id?: number;
        name?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        containerId?: string;
    }
    export interface IImageElement extends IDocElement {
        content?: string;
        sourceType?: string;
        format?: string;
        horizontalAlignment?: string;
    }
    export interface ITextElement extends IDocElement {
        content?: string;
        sourceType?: string;
        format?: string;
        bold?: boolean;
        italic?: boolean;
        horizontalAlignment?: string;
        font?: string;
        fontSize?: number;
    }
    export interface ITableTextElement extends ITextElement {
        colspan?: string;
    }
    export interface ITableBandElement extends IDocElement {
        columnData?: Array<ITableTextElement>;
    }
    export interface ITableElement extends IDocElement {
        columns?: string;
        header?: boolean;
        footer?: boolean;
        contentDataRows?: Array<ITableBandElement>;
        footerData?: ITableBandElement;
        headerData?: ITableBandElement;
    }
    export interface IDocumentProperties {
        boCode?: string;
        contentHeight?: string;
        endSectionSize?: string;
        footer?: boolean;
        footerDisplay?: string;
        footerSize?: string;
        header?: boolean;
        headerDisplay?: string;
        headerSize?: string;
        marginBottom?: string;
        marginLeft?: string;
        marginRight?: string;
        marginTop?: string;
        name?: string;
        orientation?: string;
        pageFooterSize?: string;
        pageFormat?: string;
        pageHeaderSize?: string;
        pageHeight?: string;
        pageWidth?: string;
        patternCurrencySymbol?: string;
        patternLocale?: string;
        repetitionSize?: string;
        startSectionSize?: string;
        unit?: string;
    }
    export interface IParameter {
        children?: Array<IParameter>;
        arrayItemType?: string;
        eval?: boolean;
        expression?: string;
        id?: number;
        name?: string;
        description?: string;
        nullable?: boolean;
        pattern?: string;
        showOnlyNameType?: boolean;
        testData?: string;
        type?: string;
    }
    export interface IStyle {

    }
}