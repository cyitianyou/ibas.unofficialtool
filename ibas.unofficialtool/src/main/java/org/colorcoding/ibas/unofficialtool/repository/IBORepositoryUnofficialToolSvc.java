package org.colorcoding.ibas.unofficialtool.repository;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.unofficialtool.bo.example.*;

/**
* UnofficialTool仓库服务
*/
public interface IBORepositoryUnofficialToolSvc extends IBORepositorySmartService {


    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-例子
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<Example> fetchExample(ICriteria criteria, String token);

    /**
     * 保存-例子
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<Example> saveExample(Example bo, String token);

    //--------------------------------------------------------------------------------------------//

}
