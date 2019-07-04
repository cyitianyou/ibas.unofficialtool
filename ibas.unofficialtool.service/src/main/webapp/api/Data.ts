/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace unofficialtool {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "0732b9f9-6e52-4b5f-bc41-3ce0f4172aa6";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "UnofficialTool";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";

    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_UNOFFICIALTOOL: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
    }

    export namespace app {

    }
}
