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
namespace unofficialtool {
    export namespace bo {
        // 注册业务对象仓库到工厂
        boFactory.register(BO_REPOSITORY_UNOFFICIALTOOL, BORepositoryUnofficialTool);
        // 注册业务对象到工厂
    }
}
