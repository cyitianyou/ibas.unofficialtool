/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    /** 模块-标识 */
    const CONSOLE_ID: string;
    /** 模块-名称 */
    const CONSOLE_NAME: string;
    /** 模块-版本 */
    const CONSOLE_VERSION: string;
    namespace bo {
        /** 业务仓库名称 */
        const BO_REPOSITORY_IMPORTEXPORT: string;
        /** 业务对象编码-数据导出模板 */
        const BO_CODE_EXPORTTEMPLATE: string;
        enum emAreaType {
            /**
             * 页眉
             */
            PAGE_HEADER = 0,
            /**
             * 开始区
             */
            START_SECTION = 1,
            /**
             * 重复区头
             */
            REPETITION_HEADER = 2,
            /**
             * 重复区
             */
            REPETITION = 3,
            /**
             * 重复区脚
             */
            REPETITION_FOOTER = 4,
            /**
             * 结束区
             */
            END_SECTION = 5,
            /**
             * 页脚区
             */
            PAGE_FOOTER = 6
        }
        enum emDataSourceType {
            /**
             * 文本
             */
            TEXT = 0,
            /**
             * 路径
             */
            PATH = 1,
            /**
             * 查询
             */
            QUERY = 2
        }
        enum emJustificationHorizontal {
            /**
             * 靠右
             */
            RIGHT = 0,
            /**
             * 靠左
             */
            LEFT = 1,
            /**
             * 中间
             */
            CENTER = 2
        }
        enum emJustificationVertical {
            /**
             * 靠上
             */
            TOP = 0,
            /**
             * 靠下
             */
            BOTTOM = 1,
            /**
             * 中间
             */
            CENTER = 2
        }
        enum emTextStyle {
            /**
             * 常规
             */
            REGULAR = 0,
            /**
             * 粗体
             */
            BOLD = 1,
            /**
             * 斜体
             */
            ITALIC = 2,
            /**
             * 粗斜体
             */
            BOLD_ITALIC = 3
        }
        /** 数据导出调用者 */
        interface IDataExportCaller<T> extends ibas.IMethodCaller<T> {
            /** 导出的数据 */
            data?: object | object[];
            /** 数据查询 */
            criteria?: ibas.ICriteria;
            /** 内容类型 */
            contentType?: string;
        }
        /** 数据导出者 */
        interface IDataExporter {
            /** 名称 */
            name: string;
            /** 描述 */
            description: string;
            /** 导出 */
            export(caller: IDataExportCaller<any>): void;
        }
    }
    namespace app {
        /** 服务码-业务对象打印 */
        const SERVICE_CATEGORY_BO_PRINT: string;
        /** 服务码-数据表打印 */
        const SERVICE_CATEGORY_DATATABLE_PRINT: string;
        /** 数据打印服务契约 */
        interface IDataPrintServiceContract extends ibas.IBOServiceContract {
            /** 模板 */
            template: number | ibas.ICondition[];
            /** 业务对象 */
            businessObject?: string;
            /** 内容 */
            content?: string;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** ImportExport 业务仓库 */
        interface IBORepositoryImportExport extends ibas.IBORepositoryApplication {
            /**
             * 获取业务对象架构
             * @param caller 调用者
             */
            schema(caller: ISchemaMethodCaller<string>): void;
            /**
             * 导入
             * @param caller 调用者
             */
            import(caller: IImportFileCaller): void;
            /**
             * 数据导出调用者
             * @param caller 调用者
             */
            export(caller: IExportFileCaller): void;
            /**
             * 查询 获取数据导出者
             * @param fetcher 查询者
             */
            fetchDataExporter(fetcher: ibas.IFetchCaller<bo.IDataExporter>): void;
            /**
             * 查询 数据导出模板
             * @param fetcher 查询者
             */
            fetchExportTemplate(fetcher: ibas.IFetchCaller<bo.IExportTemplate>): void;
            /**
             * 保存 数据导出模板
             * @param saver 保存者
             */
            saveExportTemplate(saver: ibas.ISaveCaller<bo.IExportTemplate>): void;
        }
        /**
         * 业务对象架构相关调用者
         */
        interface ISchemaMethodCaller<P> extends ibas.IMethodCaller<P> {
            /** 业务对象编码 */
            boCode: string;
            /** 结构类型 */
            type: string;
        }
        /**
         * 文件导入调用者
         */
        interface IImportFileCaller extends ibas.IUploadFileCaller<string> {
        }
        /**
         * 数据导出调用者
         */
        interface IExportFileCaller extends ibas.IMethodCaller<Blob> {
            /** 转换者 */
            transformer: string;
            /** 模板 */
            template?: string;
            /** 查询 */
            criteria?: ibas.ICriteria;
            /** 内容类型 */
            contentType?: string;
            /** 内容 */
            content?: any;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** 导出模板 */
        interface IExportTemplate extends ibas.IBOSimple {
            /** 编号 */
            objectKey: number;
            /** 类型 */
            objectCode: string;
            /** 实例号（版本） */
            logInst: number;
            /** 数据源 */
            dataSource: string;
            /** 服务系列 */
            series: number;
            /** 创建日期 */
            createDate: Date;
            /** 创建时间 */
            createTime: number;
            /** 修改日期 */
            updateDate: Date;
            /** 修改时间 */
            updateTime: number;
            /** 创建用户 */
            createUserSign: number;
            /** 修改用户 */
            updateUserSign: number;
            /** 创建动作标识 */
            createActionId: string;
            /** 更新动作标识 */
            updateActionId: string;
            /** 数据所有者 */
            dataOwner: number;
            /** 团队成员 */
            teamMembers: string;
            /** 数据所属组织 */
            organization: string;
            /** 名称 */
            name: string;
            /** 已激活的 */
            activated: ibas.emYesNo;
            /** 语言 */
            language: string;
            /** 类型 */
            category: string;
            /** 关联的业务对象 */
            boCode: string;
            /** 关联的应用 */
            applicationId: string;
            /** 注释 */
            notes: string;
            /** 输出宽度 */
            width: number;
            /** 输出高度 */
            height: number;
            /** 输出像素 */
            dpi: number;
            /** 左边距 */
            marginLeft: number;
            /** 右边距 */
            marginRight: number;
            /** 上边距 */
            marginTop: number;
            /** 下边距 */
            marginBottom: number;
            /** 区域间隔 */
            marginArea: number;
            /** 页眉-左坐标 */
            pageHeaderLeft: number;
            /** 页眉-上坐标 */
            pageHeaderTop: number;
            /** 页眉-宽度 */
            pageHeaderWidth: number;
            /** 页眉-高度 */
            pageHeaderHeight: number;
            /** 开始部分-左坐标 */
            startSectionLeft: number;
            /** 开始部分-上坐标 */
            startSectionTop: number;
            /** 开始部分-宽度 */
            startSectionWidth: number;
            /** 开始部分-高度 */
            startSectionHeight: number;
            /** 重复区域头-左坐标 */
            repetitionHeaderLeft: number;
            /** 重复区域头-上坐标 */
            repetitionHeaderTop: number;
            /** 重复区域头-宽度 */
            repetitionHeaderWidth: number;
            /** 重复区域头-高度 */
            repetitionHeaderHeight: number;
            /** 重复区域-左坐标 */
            repetitionLeft: number;
            /** 重复区域-上坐标 */
            repetitionTop: number;
            /** 重复区域-宽度 */
            repetitionWidth: number;
            /** 重复区域-高度 */
            repetitionHeight: number;
            /** 重复区域脚-左坐标 */
            repetitionFooterLeft: number;
            /** 重复区域脚-上坐标 */
            repetitionFooterTop: number;
            /** 重复区域脚-宽度 */
            repetitionFooterWidth: number;
            /** 重复区域脚-高度 */
            repetitionFooterHeight: number;
            /** 结束部分-左坐标 */
            endSectionLeft: number;
            /** 结束部分-上坐标 */
            endSectionTop: number;
            /** 结束部分-宽度 */
            endSectionWidth: number;
            /** 结束部分-高度 */
            endSectionHeight: number;
            /** 页脚-左坐标 */
            pageFooterLeft: number;
            /** 页脚-上坐标 */
            pageFooterTop: number;
            /** 页脚-宽度 */
            pageFooterWidth: number;
            /** 页脚-高度 */
            pageFooterHeight: number;
            /** 导出模板-页眉 */
            pageHeaders: IExportTemplateItems;
            /** 导出模板-开始区 */
            startSections: IExportTemplateItems;
            /** 导出模板-重复区头 */
            repetitionHeaders: IExportTemplateItems;
            /** 导出模板-重复区 */
            repetitions: IExportTemplateItems;
            /** 导出模板-重复区脚 */
            repetitionFooters: IExportTemplateItems;
            /** 导出模板-结束区 */
            endSections: IExportTemplateItems;
            /** 导出模板-页脚区 */
            pageFooters: IExportTemplateItems;
        }
        /** 导出模板-项 集合 */
        interface IExportTemplateItems extends ibas.IBusinessObjects<IExportTemplateItem> {
            /** 创建并添加子项 */
            create(): IExportTemplateItem;
        }
        /** 导出模板-项 */
        interface IExportTemplateItem extends ibas.IBOSimpleLine {
            /** 编号 */
            objectKey: number;
            /** 类型 */
            objectCode: string;
            /** 行号 */
            lineId: number;
            /** 数据源 */
            dataSource: string;
            /** 实例号（版本） */
            logInst: number;
            /** 创建日期 */
            createDate: Date;
            /** 创建时间 */
            createTime: number;
            /** 修改日期 */
            updateDate: Date;
            /** 修改时间 */
            updateTime: number;
            /** 创建用户 */
            createUserSign: number;
            /** 修改用户 */
            updateUserSign: number;
            /** 创建动作标识 */
            createActionId: string;
            /** 更新动作标识 */
            updateActionId: string;
            /** 区域 */
            area: emAreaType;
            /** 项标识 */
            itemID: string;
            /** 项类型 */
            itemType: string;
            /** 项左坐标 */
            itemLeft: number;
            /** 项上坐标 */
            itemTop: number;
            /** 数据源 */
            sourceType: emDataSourceType;
            /** 项字符串 */
            itemString: string;
            /** 显示格式 */
            valueFormat: string;
            /** 项是否可见 */
            itemVisible: ibas.emYesNo;
            /** 项宽度 */
            itemWidth: number;
            /** 项高度 */
            itemHeight: number;
            /** 左边距 */
            marginLeft: number;
            /** 右边距 */
            marginRight: number;
            /** 上边距 */
            marginTop: number;
            /** 下边距 */
            marginBottom: number;
            /** 左线长度 */
            lineLeft: number;
            /** 右线长度 */
            lineRight: number;
            /** 上线长度 */
            lineTop: number;
            /** 下线长度 */
            lineBottom: number;
            /** 字体名称 */
            fontName: string;
            /** 字体大小 */
            fontSize: number;
            /** 文本样式 */
            textStyle: emTextStyle;
            /** 水平对齐方式 */
            justificationHorizontal: emJustificationHorizontal;
            /** 竖直对齐方式 */
            justificationVertical: emJustificationVertical;
            /** 背景色-红 */
            backgroundRed: number;
            /** 背景色-绿 */
            backgroundGreen: number;
            /** 背景色-蓝 */
            backgroundBlue: number;
            /** 前景色-红 */
            foregroundRed: number;
            /** 前景色-绿 */
            foregroundGreen: number;
            /** 前景色-蓝 */
            foregroundBlue: number;
            /** 高亮显示色-红 */
            markerRed: number;
            /** 高亮显示色-绿 */
            markerGreen: number;
            /** 高亮显示色-蓝 */
            markerBlue: number;
            /** 框架色-红 */
            borderRed: number;
            /** 框架色-绿 */
            borderGreen: number;
            /** 框架色-蓝 */
            borderBlue: number;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** 导出模板 */
        class ExportTemplate extends ibas.BOSimple<ExportTemplate> implements IExportTemplate {
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 映射的属性名称-编号 */
            static PROPERTY_OBJECTKEY_NAME: string;
            /** 获取-编号 */
            /** 设置-编号 */
            objectKey: number;
            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string;
            /** 获取-类型 */
            /** 设置-类型 */
            objectCode: string;
            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string;
            /** 获取-实例号（版本） */
            /** 设置-实例号（版本） */
            logInst: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            dataSource: string;
            /** 映射的属性名称-服务系列 */
            static PROPERTY_SERIES_NAME: string;
            /** 获取-服务系列 */
            /** 设置-服务系列 */
            series: number;
            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string;
            /** 获取-创建日期 */
            /** 设置-创建日期 */
            createDate: Date;
            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string;
            /** 获取-创建时间 */
            /** 设置-创建时间 */
            createTime: number;
            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string;
            /** 获取-修改日期 */
            /** 设置-修改日期 */
            updateDate: Date;
            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string;
            /** 获取-修改时间 */
            /** 设置-修改时间 */
            updateTime: number;
            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string;
            /** 获取-创建用户 */
            /** 设置-创建用户 */
            createUserSign: number;
            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string;
            /** 获取-修改用户 */
            /** 设置-修改用户 */
            updateUserSign: number;
            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string;
            /** 获取-创建动作标识 */
            /** 设置-创建动作标识 */
            createActionId: string;
            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string;
            /** 获取-更新动作标识 */
            /** 设置-更新动作标识 */
            updateActionId: string;
            /** 映射的属性名称-数据所有者 */
            static PROPERTY_DATAOWNER_NAME: string;
            /** 获取-数据所有者 */
            /** 设置-数据所有者 */
            dataOwner: number;
            /** 映射的属性名称-团队成员 */
            static PROPERTY_TEAMMEMBERS_NAME: string;
            /** 获取-团队成员 */
            /** 设置-团队成员 */
            teamMembers: string;
            /** 映射的属性名称-数据所属组织 */
            static PROPERTY_ORGANIZATION_NAME: string;
            /** 获取-数据所属组织 */
            /** 设置-数据所属组织 */
            organization: string;
            /** 映射的属性名称-名称 */
            static PROPERTY_NAME_NAME: string;
            /** 获取-名称 */
            /** 设置-名称 */
            name: string;
            /** 映射的属性名称-已激活的 */
            static PROPERTY_ACTIVATED_NAME: string;
            /** 获取-已激活的 */
            /** 设置-已激活的 */
            activated: ibas.emYesNo;
            /** 映射的属性名称-语言 */
            static PROPERTY_LANGUAGE_NAME: string;
            /** 获取-语言 */
            /** 设置-语言 */
            language: string;
            /** 映射的属性名称-类型 */
            static PROPERTY_CATEGORY_NAME: string;
            /** 获取-类型 */
            /** 设置-类型 */
            category: string;
            /** 映射的属性名称-关联的业务对象 */
            static PROPERTY_BOCODE_NAME: string;
            /** 获取-关联的业务对象 */
            /** 设置-关联的业务对象 */
            boCode: string;
            /** 映射的属性名称-关联的应用 */
            static PROPERTY_APPLICATIONID_NAME: string;
            /** 获取-关联的应用 */
            /** 设置-关联的应用 */
            applicationId: string;
            /** 映射的属性名称-注释 */
            static PROPERTY_NOTES_NAME: string;
            /** 获取-注释 */
            /** 设置-注释 */
            notes: string;
            /** 映射的属性名称-输出宽度 */
            static PROPERTY_WIDTH_NAME: string;
            /** 获取-输出宽度 */
            /** 设置-输出宽度 */
            width: number;
            /** 映射的属性名称-输出高度 */
            static PROPERTY_HEIGHT_NAME: string;
            /** 获取-输出高度 */
            /** 设置-输出高度 */
            height: number;
            /** 映射的属性名称-输出像素 */
            static PROPERTY_DPI_NAME: string;
            /** 获取-输出像素 */
            /** 设置-输出像素 */
            dpi: number;
            /** 映射的属性名称-左边距 */
            static PROPERTY_MARGINLEFT_NAME: string;
            /** 获取-左边距 */
            /** 设置-左边距 */
            marginLeft: number;
            /** 映射的属性名称-右边距 */
            static PROPERTY_MARGINRIGHT_NAME: string;
            /** 获取-右边距 */
            /** 设置-右边距 */
            marginRight: number;
            /** 映射的属性名称-上边距 */
            static PROPERTY_MARGINTOP_NAME: string;
            /** 获取-上边距 */
            /** 设置-上边距 */
            marginTop: number;
            /** 映射的属性名称-下边距 */
            static PROPERTY_MARGINBOTTOM_NAME: string;
            /** 获取-下边距 */
            /** 设置-下边距 */
            marginBottom: number;
            /** 映射的属性名称-区域间隔 */
            static PROPERTY_MARGINAREA_NAME: string;
            /** 获取-区域间隔 */
            /** 设置-区域间隔 */
            marginArea: number;
            /** 映射的属性名称-页眉-左坐标 */
            static PROPERTY_PAGEHEADERLEFT_NAME: string;
            /** 获取-页眉-左坐标 */
            /** 设置-页眉-左坐标 */
            pageHeaderLeft: number;
            /** 映射的属性名称-页眉-上坐标 */
            static PROPERTY_PAGEHEADERTOP_NAME: string;
            /** 获取-页眉-上坐标 */
            /** 设置-页眉-上坐标 */
            pageHeaderTop: number;
            /** 映射的属性名称-页眉-宽度 */
            static PROPERTY_PAGEHEADERWIDTH_NAME: string;
            /** 获取-页眉-宽度 */
            /** 设置-页眉-宽度 */
            pageHeaderWidth: number;
            /** 映射的属性名称-页眉-高度 */
            static PROPERTY_PAGEHEADERHEIGHT_NAME: string;
            /** 获取-页眉-高度 */
            /** 设置-页眉-高度 */
            pageHeaderHeight: number;
            /** 映射的属性名称-开始部分-左坐标 */
            static PROPERTY_STARTSECTIONLEFT_NAME: string;
            /** 获取-开始部分-左坐标 */
            /** 设置-开始部分-左坐标 */
            startSectionLeft: number;
            /** 映射的属性名称-开始部分-上坐标 */
            static PROPERTY_STARTSECTIONTOP_NAME: string;
            /** 获取-开始部分-上坐标 */
            /** 设置-开始部分-上坐标 */
            startSectionTop: number;
            /** 映射的属性名称-开始部分-宽度 */
            static PROPERTY_STARTSECTIONWIDTH_NAME: string;
            /** 获取-开始部分-宽度 */
            /** 设置-开始部分-宽度 */
            startSectionWidth: number;
            /** 映射的属性名称-开始部分-高度 */
            static PROPERTY_STARTSECTIONHEIGHT_NAME: string;
            /** 获取-开始部分-高度 */
            /** 设置-开始部分-高度 */
            startSectionHeight: number;
            /** 映射的属性名称-重复区域头-左坐标 */
            static PROPERTY_REPETITIONHEADERLEFT_NAME: string;
            /** 获取-重复区域头-左坐标 */
            /** 设置-重复区域头-左坐标 */
            repetitionHeaderLeft: number;
            /** 映射的属性名称-重复区域头-上坐标 */
            static PROPERTY_REPETITIONHEADERTOP_NAME: string;
            /** 获取-重复区域头-上坐标 */
            /** 设置-重复区域头-上坐标 */
            repetitionHeaderTop: number;
            /** 映射的属性名称-重复区域头-宽度 */
            static PROPERTY_REPETITIONHEADERWIDTH_NAME: string;
            /** 获取-重复区域头-宽度 */
            /** 设置-重复区域头-宽度 */
            repetitionHeaderWidth: number;
            /** 映射的属性名称-重复区域头-高度 */
            static PROPERTY_REPETITIONHEADERHEIGHT_NAME: string;
            /** 获取-重复区域头-高度 */
            /** 设置-重复区域头-高度 */
            repetitionHeaderHeight: number;
            /** 映射的属性名称-重复区域-左坐标 */
            static PROPERTY_REPETITIONLEFT_NAME: string;
            /** 获取-重复区域-左坐标 */
            /** 设置-重复区域-左坐标 */
            repetitionLeft: number;
            /** 映射的属性名称-重复区域-上坐标 */
            static PROPERTY_REPETITIONTOP_NAME: string;
            /** 获取-重复区域-上坐标 */
            /** 设置-重复区域-上坐标 */
            repetitionTop: number;
            /** 映射的属性名称-重复区域-宽度 */
            static PROPERTY_REPETITIONWIDTH_NAME: string;
            /** 获取-重复区域-宽度 */
            /** 设置-重复区域-宽度 */
            repetitionWidth: number;
            /** 映射的属性名称-重复区域-高度 */
            static PROPERTY_REPETITIONHEIGHT_NAME: string;
            /** 获取-重复区域-高度 */
            /** 设置-重复区域-高度 */
            repetitionHeight: number;
            /** 映射的属性名称-重复区域脚-左坐标 */
            static PROPERTY_REPETITIONFOOTERLEFT_NAME: string;
            /** 获取-重复区域脚-左坐标 */
            /** 设置-重复区域脚-左坐标 */
            repetitionFooterLeft: number;
            /** 映射的属性名称-重复区域脚-上坐标 */
            static PROPERTY_REPETITIONFOOTERTOP_NAME: string;
            /** 获取-重复区域脚-上坐标 */
            /** 设置-重复区域脚-上坐标 */
            repetitionFooterTop: number;
            /** 映射的属性名称-重复区域脚-宽度 */
            static PROPERTY_REPETITIONFOOTERWIDTH_NAME: string;
            /** 获取-重复区域脚-宽度 */
            /** 设置-重复区域脚-宽度 */
            repetitionFooterWidth: number;
            /** 映射的属性名称-重复区域脚-高度 */
            static PROPERTY_REPETITIONFOOTERHEIGHT_NAME: string;
            /** 获取-重复区域脚-高度 */
            /** 设置-重复区域脚-高度 */
            repetitionFooterHeight: number;
            /** 映射的属性名称-结束部分-左坐标 */
            static PROPERTY_ENDSECTIONLEFT_NAME: string;
            /** 获取-结束部分-左坐标 */
            /** 设置-结束部分-左坐标 */
            endSectionLeft: number;
            /** 映射的属性名称-结束部分-上坐标 */
            static PROPERTY_ENDSECTIONTOP_NAME: string;
            /** 获取-结束部分-上坐标 */
            /** 设置-结束部分-上坐标 */
            endSectionTop: number;
            /** 映射的属性名称-结束部分-宽度 */
            static PROPERTY_ENDSECTIONWIDTH_NAME: string;
            /** 获取-结束部分-宽度 */
            /** 设置-结束部分-宽度 */
            endSectionWidth: number;
            /** 映射的属性名称-结束部分-高度 */
            static PROPERTY_ENDSECTIONHEIGHT_NAME: string;
            /** 获取-结束部分-高度 */
            /** 设置-结束部分-高度 */
            endSectionHeight: number;
            /** 映射的属性名称-页脚-左坐标 */
            static PROPERTY_PAGEFOOTERLEFT_NAME: string;
            /** 获取-页脚-左坐标 */
            /** 设置-页脚-左坐标 */
            pageFooterLeft: number;
            /** 映射的属性名称-页脚-上坐标 */
            static PROPERTY_PAGEFOOTERTOP_NAME: string;
            /** 获取-页脚-上坐标 */
            /** 设置-页脚-上坐标 */
            pageFooterTop: number;
            /** 映射的属性名称-页脚-宽度 */
            static PROPERTY_PAGEFOOTERWIDTH_NAME: string;
            /** 获取-页脚-宽度 */
            /** 设置-页脚-宽度 */
            pageFooterWidth: number;
            /** 映射的属性名称-页脚-高度 */
            static PROPERTY_PAGEFOOTERHEIGHT_NAME: string;
            /** 获取-页脚-高度 */
            /** 设置-页脚-高度 */
            pageFooterHeight: number;
            /** 映射的属性名称-导出模板-页眉 */
            static PROPERTY_PAGEHEADERS_NAME: string;
            /** 获取-导出模板-页眉 */
            /** 设置-导出模板-页眉 */
            pageHeaders: ExportTemplateItems;
            /** 映射的属性名称-导出模板-开始区 */
            static PROPERTY_STARTSECTIONS_NAME: string;
            /** 获取-导出模板-开始区 */
            /** 设置-导出模板-开始区 */
            startSections: ExportTemplateItems;
            /** 映射的属性名称-导出模板-重复区头 */
            static PROPERTY_REPETITIONHEADERS_NAME: string;
            /** 获取-导出模板-重复区头 */
            /** 设置-导出模板-重复区头 */
            repetitionHeaders: ExportTemplateItems;
            /** 映射的属性名称-导出模板-重复区 */
            static PROPERTY_REPETITIONS_NAME: string;
            /** 获取-导出模板-重复区 */
            /** 设置-导出模板-重复区 */
            repetitions: ExportTemplateItems;
            /** 映射的属性名称-导出模板-重复区脚 */
            static PROPERTY_REPETITIONFOOTERS_NAME: string;
            /** 获取-导出模板-重复区脚 */
            /** 设置-导出模板-重复区脚 */
            repetitionFooters: ExportTemplateItems;
            /** 映射的属性名称-导出模板-结束区 */
            static PROPERTY_ENDSECTIONS_NAME: string;
            /** 获取-导出模板-结束区 */
            /** 设置-导出模板-结束区 */
            endSections: ExportTemplateItems;
            /** 映射的属性名称-导出模板-页脚区 */
            static PROPERTY_PAGEFOOTERS_NAME: string;
            /** 获取-导出模板-页脚区 */
            /** 设置-导出模板-页脚区 */
            pageFooters: ExportTemplateItems;
            /** 初始化数据 */
            protected init(): void;
        }
        /** 导出模板-项 集合 */
        class ExportTemplateItems extends ibas.BusinessObjects<ExportTemplateItem, ExportTemplate> implements IExportTemplateItems {
            constructor(parent: ExportTemplate, areaType: emAreaType);
            private areaType;
            /** 创建并添加子项 */
            create(): ExportTemplateItem;
            protected afterAdd(item: ExportTemplateItem): void;
        }
        /** 导出模板-项 */
        class ExportTemplateItem extends ibas.BOSimpleLine<ExportTemplateItem> implements IExportTemplateItem {
            /** 构造函数 */
            constructor();
            /** 映射的属性名称-编号 */
            static PROPERTY_OBJECTKEY_NAME: string;
            /** 获取-编号 */
            /** 设置-编号 */
            objectKey: number;
            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string;
            /** 获取-类型 */
            /** 设置-类型 */
            objectCode: string;
            /** 映射的属性名称-行号 */
            static PROPERTY_LINEID_NAME: string;
            /** 获取-行号 */
            /** 设置-行号 */
            lineId: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            dataSource: string;
            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string;
            /** 获取-实例号（版本） */
            /** 设置-实例号（版本） */
            logInst: number;
            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string;
            /** 获取-创建日期 */
            /** 设置-创建日期 */
            createDate: Date;
            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string;
            /** 获取-创建时间 */
            /** 设置-创建时间 */
            createTime: number;
            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string;
            /** 获取-修改日期 */
            /** 设置-修改日期 */
            updateDate: Date;
            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string;
            /** 获取-修改时间 */
            /** 设置-修改时间 */
            updateTime: number;
            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string;
            /** 获取-创建用户 */
            /** 设置-创建用户 */
            createUserSign: number;
            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string;
            /** 获取-修改用户 */
            /** 设置-修改用户 */
            updateUserSign: number;
            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string;
            /** 获取-创建动作标识 */
            /** 设置-创建动作标识 */
            createActionId: string;
            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string;
            /** 获取-更新动作标识 */
            /** 设置-更新动作标识 */
            updateActionId: string;
            /** 映射的属性名称-区域 */
            static PROPERTY_AREA_NAME: string;
            /** 获取-区域 */
            /** 设置-区域 */
            area: emAreaType;
            /** 映射的属性名称-项标识 */
            static PROPERTY_ITEMID_NAME: string;
            /** 获取-项标识 */
            /** 设置-项标识 */
            itemID: string;
            /** 映射的属性名称-项类型 */
            static PROPERTY_ITEMTYPE_NAME: string;
            /** 获取-项类型 */
            /** 设置-项类型 */
            itemType: string;
            /** 映射的属性名称-项左坐标 */
            static PROPERTY_ITEMLEFT_NAME: string;
            /** 获取-项左坐标 */
            /** 设置-项左坐标 */
            itemLeft: number;
            /** 映射的属性名称-项上坐标 */
            static PROPERTY_ITEMTOP_NAME: string;
            /** 获取-项上坐标 */
            /** 设置-项上坐标 */
            itemTop: number;
            /** 映射的属性名称-数据源 */
            static PROPERTY_SOURCETYPE_NAME: string;
            /** 获取-数据源 */
            /** 设置-数据源 */
            sourceType: emDataSourceType;
            /** 映射的属性名称-项字符串 */
            static PROPERTY_ITEMSTRING_NAME: string;
            /** 获取-项字符串 */
            /** 设置-项字符串 */
            itemString: string;
            /** 映射的属性名称-显示格式 */
            static PROPERTY_VALUEFORMAT_NAME: string;
            /** 获取-显示格式 */
            /** 设置-显示格式 */
            valueFormat: string;
            /** 映射的属性名称-项是否可见 */
            static PROPERTY_ITEMVISIBLE_NAME: string;
            /** 获取-项是否可见 */
            /** 设置-项是否可见 */
            itemVisible: ibas.emYesNo;
            /** 映射的属性名称-项宽度 */
            static PROPERTY_ITEMWIDTH_NAME: string;
            /** 获取-项宽度 */
            /** 设置-项宽度 */
            itemWidth: number;
            /** 映射的属性名称-项高度 */
            static PROPERTY_ITEMHEIGHT_NAME: string;
            /** 获取-项高度 */
            /** 设置-项高度 */
            itemHeight: number;
            /** 映射的属性名称-左边距 */
            static PROPERTY_MARGINLEFT_NAME: string;
            /** 获取-左边距 */
            /** 设置-左边距 */
            marginLeft: number;
            /** 映射的属性名称-右边距 */
            static PROPERTY_MARGINRIGHT_NAME: string;
            /** 获取-右边距 */
            /** 设置-右边距 */
            marginRight: number;
            /** 映射的属性名称-上边距 */
            static PROPERTY_MARGINTOP_NAME: string;
            /** 获取-上边距 */
            /** 设置-上边距 */
            marginTop: number;
            /** 映射的属性名称-下边距 */
            static PROPERTY_MARGINBOTTOM_NAME: string;
            /** 获取-下边距 */
            /** 设置-下边距 */
            marginBottom: number;
            /** 映射的属性名称-左线长度 */
            static PROPERTY_LINELEFT_NAME: string;
            /** 获取-左线长度 */
            /** 设置-左线长度 */
            lineLeft: number;
            /** 映射的属性名称-右线长度 */
            static PROPERTY_LINERIGHT_NAME: string;
            /** 获取-右线长度 */
            /** 设置-右线长度 */
            lineRight: number;
            /** 映射的属性名称-上线长度 */
            static PROPERTY_LINETOP_NAME: string;
            /** 获取-上线长度 */
            /** 设置-上线长度 */
            lineTop: number;
            /** 映射的属性名称-下线长度 */
            static PROPERTY_LINEBOTTOM_NAME: string;
            /** 获取-下线长度 */
            /** 设置-下线长度 */
            lineBottom: number;
            /** 映射的属性名称-字体名称 */
            static PROPERTY_FONTNAME_NAME: string;
            /** 获取-字体名称 */
            /** 设置-字体名称 */
            fontName: string;
            /** 映射的属性名称-字体大小 */
            static PROPERTY_FONTSIZE_NAME: string;
            /** 获取-字体大小 */
            /** 设置-字体大小 */
            fontSize: number;
            /** 映射的属性名称-文本样式 */
            static PROPERTY_TEXTSTYLE_NAME: string;
            /** 获取-文本样式 */
            /** 设置-文本样式 */
            textStyle: emTextStyle;
            /** 映射的属性名称-水平对齐方式 */
            static PROPERTY_JUSTIFICATIONHORIZONTAL_NAME: string;
            /** 获取-水平对齐方式 */
            /** 设置-水平对齐方式 */
            justificationHorizontal: emJustificationHorizontal;
            /** 映射的属性名称-竖直对齐方式 */
            static PROPERTY_JUSTIFICATIONVERTICAL_NAME: string;
            /** 获取-竖直对齐方式 */
            /** 设置-竖直对齐方式 */
            justificationVertical: emJustificationVertical;
            /** 映射的属性名称-背景色-红 */
            static PROPERTY_BACKGROUNDRED_NAME: string;
            /** 获取-背景色-红 */
            /** 设置-背景色-红 */
            backgroundRed: number;
            /** 映射的属性名称-背景色-绿 */
            static PROPERTY_BACKGROUNDGREEN_NAME: string;
            /** 获取-背景色-绿 */
            /** 设置-背景色-绿 */
            backgroundGreen: number;
            /** 映射的属性名称-背景色-蓝 */
            static PROPERTY_BACKGROUNDBLUE_NAME: string;
            /** 获取-背景色-蓝 */
            /** 设置-背景色-蓝 */
            backgroundBlue: number;
            /** 映射的属性名称-前景色-红 */
            static PROPERTY_FOREGROUNDRED_NAME: string;
            /** 获取-前景色-红 */
            /** 设置-前景色-红 */
            foregroundRed: number;
            /** 映射的属性名称-前景色-绿 */
            static PROPERTY_FOREGROUNDGREEN_NAME: string;
            /** 获取-前景色-绿 */
            /** 设置-前景色-绿 */
            foregroundGreen: number;
            /** 映射的属性名称-前景色-蓝 */
            static PROPERTY_FOREGROUNDBLUE_NAME: string;
            /** 获取-前景色-蓝 */
            /** 设置-前景色-蓝 */
            foregroundBlue: number;
            /** 映射的属性名称-高亮显示色-红 */
            static PROPERTY_MARKERRED_NAME: string;
            /** 获取-高亮显示色-红 */
            /** 设置-高亮显示色-红 */
            markerRed: number;
            /** 映射的属性名称-高亮显示色-绿 */
            static PROPERTY_MARKERGREEN_NAME: string;
            /** 获取-高亮显示色-绿 */
            /** 设置-高亮显示色-绿 */
            markerGreen: number;
            /** 映射的属性名称-高亮显示色-蓝 */
            static PROPERTY_MARKERBLUE_NAME: string;
            /** 获取-高亮显示色-蓝 */
            /** 设置-高亮显示色-蓝 */
            markerBlue: number;
            /** 映射的属性名称-框架色-红 */
            static PROPERTY_BORDERRED_NAME: string;
            /** 获取-框架色-红 */
            /** 设置-框架色-红 */
            borderRed: number;
            /** 映射的属性名称-框架色-绿 */
            static PROPERTY_BORDERGREEN_NAME: string;
            /** 获取-框架色-绿 */
            /** 设置-框架色-绿 */
            borderGreen: number;
            /** 映射的属性名称-框架色-蓝 */
            static PROPERTY_BORDERBLUE_NAME: string;
            /** 获取-框架色-蓝 */
            /** 设置-框架色-蓝 */
            borderBlue: number;
            /** 初始化数据 */
            protected init(): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** 数据转换者 */
        class DataConverter extends ibas.DataConverter4j {
            /**
             * 解析业务对象数据
             * @param data 目标类型
             * @param sign 特殊标记
             * @returns 本地类型
             */
            parsing(data: any, sign: string): any;
            /** 创建业务对象转换者 */
            protected createConverter(): ibas.BOConverter;
        }
        /** 数据导出信息 */
        interface IDataExportInfo {
            /** 转换者 */
            Transformer: string;
            /** 模板 */
            Template: string;
            /** 描述 */
            Description: string;
        }
        /** 模块业务对象工厂 */
        const boFactory: ibas.BOFactory;
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** 数据导出者 */
        abstract class DataExporter<T extends IDataExportResult> implements bo.IDataExporter {
            /** 名称 */
            name: string;
            /** 描述 */
            description: string;
            /** 导出 */
            abstract export(caller: bo.IDataExportCaller<T>): void;
        }
        /** 数据导出结果 */
        interface IDataExportResult {
            /** 内容 */
            content: any;
        }
        /** 数据导出结果 */
        abstract class DataExportResult<T> implements IDataExportResult {
            /** 内容 */
            content: T;
        }
        /** 数据导出结果-文件 */
        class DataExportResultBlob extends DataExportResult<Blob> {
            constructor(contect: Blob);
            /** 名称 */
            fileName: string;
        }
        /** 数据导出结果-文件 */
        class DataExportResultString extends DataExportResult<string> {
            constructor();
            constructor(name: string, contect: string);
            /** 文件名称 */
            fileName: string;
        }
        /** 数据导出者-json */
        class DataExporterJson extends DataExporter<DataExportResultString> {
            static MODE_SIGN: string;
            constructor();
            /** 导出 */
            export(caller: bo.IDataExportCaller<DataExportResultString>): void;
        }
        /** 数据导出者-服务 */
        class DataExporterService extends DataExporter<IDataExportResult> {
            constructor();
            /** 模板 */
            template: string;
            /** 导出 */
            export(caller: bo.IDataExportCaller<IDataExportResult>): void;
        }
        /** 数据表导出者-json */
        class DataTableExporterJson extends DataExporter<DataExportResultString> {
            static MODE_SIGN: string;
            constructor();
            /** 导出 */
            export(caller: bo.IDataExportCaller<DataExportResultString>): void;
        }
        /** 数据表导出者-csv */
        class DataTableExporterCSV extends DataExporter<DataExportResultString> {
            static MODE_SIGN: string;
            constructor();
            /** 导出 */
            export(caller: bo.IDataExportCaller<DataExportResultString>): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
        /** 数据导入&导出 业务仓库 */
        class BORepositoryImportExport extends ibas.BORepositoryApplication implements IBORepositoryImportExport {
            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter;
            /**
             * 导入
             * @param caller 调用者
             */
            import(caller: IImportFileCaller): void;
            /**
             * 导出
             * @param caller 调用者
             */
            export(caller: IExportFileCaller): void;
            /**
             * 获取业务对象架构
             * @param caller 调用者
             */
            schema(caller: ISchemaMethodCaller<string>): void;
            /**
             * 查询 获取数据导出者
             * @param fetcher 查询者
             */
            fetchDataExporter(fetcher: ibas.IFetchCaller<bo.IDataExporter>): void;
            /**
             * 查询 数据导出模板
             * @param fetcher 查询者
             */
            fetchExportTemplate(fetcher: ibas.IFetchCaller<bo.ExportTemplate>): void;
            /**
             * 保存 数据导出模板
             * @param saver 保存者
             */
            saveExportTemplate(saver: ibas.ISaveCaller<bo.ExportTemplate>): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace bo {
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 数据导出 */
        class DataExportApp extends ibas.Application<IDataExportView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 运行,覆盖原方法 */
            run(): void;
            private criteria;
            /** 获取Schema */
            schema(type: string): void;
            /** 导出 */
            export(exporter: bo.IDataExporter): void;
            /** 选择业务对象事件 */
            private chooseBusinessObject;
            private addQueryCondition;
            private removeQueryCondition;
        }
        /** 数据导出-视图 */
        interface IDataExportView extends ibas.IView {
            /** 获取Schema，参数1，类型（xml,json） */
            schemaEvent: Function;
            /** 显示查询 */
            showCriteria(criteria: ibas.ICriteria): void;
            /** 显示数据导出者 */
            showExporters(exporters: bo.IDataExporter[]): void;
            /** 显示结果 */
            showResluts(results: bo.IDataExportResult[]): void;
            /** 选择业务对象 */
            chooseBusinessObjectEvent: Function;
            /** 导出 */
            exportEvent: Function;
            /** 添加条件 */
            addConditionEvent: Function;
            /** 移出条件 */
            removeConditionEvent: Function;
            /** 显示结果 */
            showConditions(conditions: ibas.ICondition[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        class DataExportFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 数据导出服务 */
        class DataExportService extends ibas.ServiceApplication<IDataExportServiceView, ibas.IBOServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 运行服务 */
            runService(contract: ibas.IBOServiceContract): void;
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 导出的数据 */
            private exportDatas;
            /** 导出数据，参数1：使用的方式 */
            private exportData;
        }
        /** 数据导出服务-视图 */
        interface IDataExportServiceView extends ibas.IView {
            /** 显示数据导出者 */
            showExporters(exporters: bo.IDataExporter[]): void;
            /** 导出数据，参数1：使用的方式 */
            exportDataEvent: Function;
            /** 显示结果 */
            showResluts(results: bo.IDataExportResult[]): void;
        }
        /** 数据导出服务映射 */
        class DataExportServiceMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
        /** 数据表导出服务 */
        class DataTableExportService extends ibas.ServiceApplication<IDataExportServiceView, ibas.IDataTableServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 运行服务 */
            runService(contract: ibas.IDataTableServiceContract): void;
            /** 导出的数据 */
            private exportDataTable;
            /** 导出数据，参数1：使用的方式 */
            private exportData;
        }
        /** 数据表导出服务映射 */
        class DataTableExportServiceMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        class ExportTemplateFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 列表应用-导出模板 */
        class ExportTemplateListApp extends ibas.BOListApplication<IExportTemplateListView, bo.ExportTemplate> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 新建数据 */
            protected newData(): void;
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.ExportTemplate): void;
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.ExportTemplate): void;
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.ExportTemplate | bo.ExportTemplate[]): void;
        }
        /** 视图-导出模板 */
        interface IExportTemplateListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.ExportTemplate[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 选择应用-导出模板 */
        class ExportTemplateChooseApp extends ibas.BOChooseService<IExportTemplateChooseView, bo.ExportTemplate> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void;
            /** 新建数据 */
            protected newData(): void;
        }
        /** 视图-导出模板 */
        interface IExportTemplateChooseView extends ibas.IBOChooseView {
            /** 显示数据 */
            showData(datas: bo.ExportTemplate[]): void;
        }
        /** 导出模板选择服务映射 */
        class ExportTemplateChooseServiceMapping extends ibas.BOChooseServiceMapping {
            /** 构造函数 */
            constructor();
            /** 创建服务实例 */
            create(): ibas.IBOChooseService<bo.ExportTemplate>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 编辑应用-导出模板 */
        class ExportTemplateEditApp extends ibas.BOEditApplication<IExportTemplateEditView, bo.ExportTemplate> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string;
            /** 构造函数 */
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            run(): void;
            run(data: bo.ExportTemplate): void;
            /** 待编辑的数据 */
            protected editData: bo.ExportTemplate;
            /** 保存数据 */
            protected saveData(): void;
            /** 删除数据 */
            protected deleteData(): void;
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void;
            /** 添加导出模板-项事件 */
            protected addPageHeader(): void;
            /** 删除导出模板-项事件 */
            protected removePageHeader(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addStartSection(): void;
            /** 删除导出模板-项事件 */
            protected removeStartSection(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addRepetitionHeader(): void;
            /** 删除导出模板-项事件 */
            protected removeRepetitionHeader(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addRepetition(): void;
            /** 删除导出模板-项事件 */
            protected removeRepetition(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addRepetitionFooter(): void;
            /** 删除导出模板-项事件 */
            protected removeRepetitionFooter(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addEndSection(): void;
            /** 删除导出模板-项事件 */
            protected removeEndSection(items: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            protected addPageFooter(): void;
            /** 删除导出模板-项事件 */
            protected removePageFooter(items: bo.ExportTemplateItem[]): void;
            /** 选择业务对象事件 */
            private chooseBusinessObject;
        }
        /** 视图-导出模板 */
        interface IExportTemplateEditView extends ibas.IBOEditView {
            /** 选择业务对象 */
            chooseBusinessObjectEvent: Function;
            /** 显示数据 */
            showExportTemplate(data: bo.ExportTemplate): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加导出模板-项事件 */
            addPageHeaderEvent: Function;
            /** 删除导出模板-项事件 */
            removePageHeaderEvent: Function;
            /** 显示数据-页眉 */
            showPageHeaders(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addStartSectionEvent: Function;
            /** 删除导出模板-项事件 */
            removeStartSectionEvent: Function;
            /** 显示数据-开始区域 */
            showStartSections(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addRepetitionHeaderEvent: Function;
            /** 删除导出模板-项事件 */
            removeRepetitionHeaderEvent: Function;
            /** 显示数据-重复区头 */
            showRepetitionHeaders(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addRepetitionEvent: Function;
            /** 删除导出模板-项事件 */
            removeRepetitionEvent: Function;
            /** 显示数据-重复区 */
            showRepetitions(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addRepetitionFooterEvent: Function;
            /** 删除导出模板-项事件 */
            removeRepetitionFooterEvent: Function;
            /** 显示数据-重复区脚 */
            showRepetitionFooters(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addEndSectionEvent: Function;
            /** 删除导出模板-项事件 */
            removeEndSectionEvent: Function;
            /** 显示数据-结束区域 */
            showEndSections(datas: bo.ExportTemplateItem[]): void;
            /** 添加导出模板-项事件 */
            addPageFooterEvent: Function;
            /** 删除导出模板-项事件 */
            removePageFooterEvent: Function;
            /** 显示数据-页脚 */
            showPageFooters(datas: bo.ExportTemplateItem[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 数据导入 */
        class DataImportApp extends ibas.Application<IDataImportView> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            /** 运行,覆盖原方法 */
            run(): void;
            /** 导入 */
            import(data: FormData): void;
        }
        /** 数据导入-视图 */
        interface IDataImportView extends ibas.IView {
            /** 导入 */
            importEvent: Function;
            /** 显示结果 */
            showResults(results: any[]): void;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        class DataImportFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID: string;
            /** 功能名称 */
            static FUNCTION_NAME: string;
            /** 构造函数 */
            constructor();
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 数据打印 */
        abstract class AbstractDataPrintService<T extends ibas.IServiceContract> extends ibas.ServiceApplication<IDataPrintView, T> {
            /** 注册视图 */
            protected registerView(): void;
            /** 视图显示后 */
            protected viewShowed(): void;
            protected printData: any[];
            /** 预览 */
            private preview;
            /** 打印 */
            private print;
        }
        /** 数据打印-视图 */
        interface IDataPrintView extends ibas.IView {
            /** 打印 */
            printEvent: Function;
            /** 预览 */
            previewEvent: Function;
            /** 显示数据导出者 */
            showExporters(exporters: bo.IDataExporter[]): void;
            /** 显示内容 */
            showContent(content: Blob, width: string, height: string): void;
        }
        /** 数据打印 */
        class DataPrintService extends AbstractDataPrintService<IDataPrintServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 运行服务 */
            runService(contract: IDataPrintServiceContract): void;
        }
        /** 数据打印映射 */
        class DataPrintServiceMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
        /** 数据表格打印 */
        class DataTablePrintService extends AbstractDataPrintService<ibas.IDataTableServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string;
            /** 应用名称 */
            static APPLICATION_NAME: string;
            constructor();
            /** 运行服务 */
            runService(contract: ibas.IDataTableServiceContract): void;
        }
        /** 数据表格打印映射 */
        class DataTablePrintServiceMapping extends ibas.ServiceMapping {
            constructor();
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract>;
        }
    }
}
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
declare namespace importexport {
    namespace app {
        /** 模块控制台 */
        class Console extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor();
            /** 创建视图导航 */
            navigation(): ibas.IViewNavigation;
            /** 初始化 */
            protected registers(): void;
            /** 运行 */
            run(): void;
        }
    }
}
