package org.colorcoding.ibas.unofficialtool;

import org.colorcoding.ibas.bobas.configuration.ConfigurationFactory;
import org.colorcoding.ibas.bobas.configuration.IConfigurationManager;

/**
 * 我的配置项
 */
public class MyConfiguration extends org.colorcoding.ibas.bobas.MyConfiguration {

    private volatile static IConfigurationManager instance;

    public static IConfigurationManager create() {
        if (instance == null) {
            synchronized (MyConfiguration.class) {
                if (instance == null) {
                    instance = ConfigurationFactory.create().createManager();
                    instance.setConfigSign(MODULE_ID);
                    instance.update();
                }
            }
        }
        return instance;
    }

    public static <P> P getConfigValue(String key, P defaultValue) {
        return create().getConfigValue(key, defaultValue);
    }

    public static String getConfigValue(String key) {
        return create().getConfigValue(key);
    }

    /**
    * 模块标识
    */
    public static final String MODULE_ID = "0732b9f9-6e52-4b5f-bc41-3ce0f4172aa6";

    /**
    * 命名空间
    */
    public static final String NAMESPACE_ROOT = "http://colorcoding.org/ibas/unofficialtool/";

    /**
    * 数据命名空间
    */
    public static final String NAMESPACE_DATA = NAMESPACE_ROOT + "data";

    /**
    * 业务对象命名空间
    */
    public static final String NAMESPACE_BO = NAMESPACE_ROOT + "bo";

    /**
    * 服务命名空间
    */
    public static final String NAMESPACE_SERVICE = NAMESPACE_ROOT + "service";

}
