/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var openui5;
(function (openui5) {
    let datatype;
    (function (datatype) {
        /**
         * 数据类型基类
         */
        class DataType extends sap.ui.model.SimpleType {
            constructor(settings) {
                super();
                this.description = "";
                if (!ibas.objects.isNull(settings)) {
                    this.description = settings.description;
                    if (settings.validate instanceof Function) {
                        this.validate = settings.validate;
                    }
                    if (settings.formatValue instanceof Function) {
                        this.formatValue = settings.formatValue;
                    }
                    if (settings.parseValue instanceof Function) {
                        this.parseValue = settings.parseValue;
                    }
                }
            }
            formatValue(oValue) {
                return oValue;
            }
            parseValue(oValue) {
                return oValue;
            }
            validate(oValue, managedObject) {
                let result = new ValidateResult();
                result.status = true;
                return result;
            }
            validateValue(oValue) {
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
            fireValidationError(managedObject, message) {
                if (managedObject !== null && managedObject !== undefined
                    && managedObject instanceof sap.ui.core.Element) {
                    let arg = {
                        element: managedObject,
                        message: message,
                    };
                    return sap.ui.getCore().fireValidationError(arg);
                }
            }
        }
        datatype.DataType = DataType;
        /**
         * 未知基类
         */
        class Unknown extends DataType {
            constructor(settings) {
                super(settings);
            }
        }
        datatype.Unknown = Unknown;
        /**
         * 字母数字类型
         */
        class Alphanumeric extends DataType {
            /**
             * 字母数字类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                this.notEmpty = false;
                this.maxLength = null;
                this.minLength = null;
                if (!ibas.objects.isNull(settings)) {
                    this.notEmpty = settings.notEmpty;
                    this.maxLength = settings.maxLength;
                    this.minLength = settings.minLength;
                }
            }
            validate(oValue, managedObject) {
                let result = new ValidateResult();
                result.status = true;
                if (this.notEmpty && !validation.isNotEmpty(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_not_empty_error", this.description);
                    this.fireValidationError(managedObject, result.message);
                    return result;
                }
                if (!!this.maxLength && (!oValue || oValue.length > this.maxLength)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_max_length_error", this.description, this.maxLength);
                    this.fireValidationError(managedObject, result.message);
                    return result;
                }
                if (!!this.minLength && (!oValue || oValue.length < this.minLength)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_min_length_error", this.description, this.minLength);
                    this.fireValidationError(managedObject, result.message);
                    return result;
                }
                return result;
            }
        }
        datatype.Alphanumeric = Alphanumeric;
        /**
         * 数字类型
         */
        class Numeric extends DataType {
            /**
             * 数字类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                this.minValue = undefined;
                this.maxValue = undefined;
                if (!ibas.objects.isNull(settings)) {
                    this.minValue = settings.minValue;
                    this.maxValue = settings.maxValue;
                }
            }
            formatValue(oValue) {
                if (ibas.objects.isNull(oValue)) {
                    return "";
                }
                return oValue.toString();
            }
            parseValue(oValue) {
                return Number.parseInt(oValue, 0);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isNumeric(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_numeric_error");
                    this.fireValidationError(managedObject, result.message);
                }
                if (validation.isNotEmpty(oValue) && this.minValue !== undefined && !(oValue > this.minValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_numeric_minvalue_error", this.description, this.minValue);
                    this.fireValidationError(managedObject, result.message);
                }
                if (validation.isNotEmpty(oValue) && this.maxValue !== undefined && !(oValue < this.maxValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_numeric_maxvalue_error", this.description, this.maxValue);
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Numeric = Numeric;
        /**
         * 小数类型
         */
        class Decimal extends DataType {
            /**
             * 小数类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                this.minValue = undefined;
                this.maxValue = undefined;
                this.decimalPlaces = undefined;
                if (!ibas.objects.isNull(settings)) {
                    this.decimalPlaces = settings.decimalPlaces;
                }
                if (ibas.objects.isNull(this.decimalPlaces)) {
                    this.decimalPlaces = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES, 6);
                }
            }
            formatValue(oValue) {
                if (ibas.objects.isNull(oValue)) {
                    return "";
                }
                return oValue.toFixed(this.decimalPlaces);
            }
            parseValue(oValue) {
                if (ibas.strings.isEmpty(oValue)) {
                    return undefined;
                }
                if (ibas.objects.isNull(this.decimalPlaces)) {
                    return Number.parseFloat(oValue);
                }
                let pow = Math.pow(10, this.decimalPlaces);
                return Math.round(Number.parseFloat(oValue) * pow) / pow;
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (isNaN(oValue) && !ibas.objects.isNull(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_decimal_error");
                    this.fireValidationError(managedObject, result.message);
                }
                if (!validation.isDecimal(oValue, this.decimalPlaces)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_decimal_decimalPlaces_error", this.description, this.decimalPlaces);
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Decimal = Decimal;
        /**
         * 日期类型
         */
        class DateTime extends DataType {
            /**
             * 日期类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                if (!ibas.objects.isNull(settings)) {
                    this.format = settings.format;
                }
            }
            formatValue(oValue) {
                if (ibas.objects.instanceOf(oValue, Date)) {
                    return oValue;
                }
                return null;
            }
            parseValue(oValue) {
                if (ibas.objects.instanceOf(oValue, Date)) {
                    return oValue;
                }
                return ibas.dates.valueOf(oValue);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isDate(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_datetime_error", this.description);
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.DateTime = DateTime;
        /**
         * 时间类型
         */
        class Time extends DataType {
            /**
             * 时间类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                if (!ibas.objects.isNull(settings)) {
                    this.format = settings.format;
                }
            }
            formatValue(oValue) {
                if (validation.isTime(oValue)) {
                    let time = oValue;
                    let hour = time / 100;
                    let minute = time % 100;
                    let date = new Date();
                    date.setHours(hour, minute, 0, 0);
                    if (ibas.strings.isEmpty(this.format)) {
                        return date;
                    }
                    else {
                        return ibas.dates.toString(date, this.format);
                    }
                }
                return oValue;
            }
            parseValue(oValue) {
                if (ibas.objects.instanceOf(oValue, Date)) {
                    return oValue.getHours() * 100 + oValue.getMinutes();
                }
                return 0;
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (ibas.objects.instanceOf(oValue, Date)) {
                    return result;
                }
                if (!validation.isTime(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_time_error", this.description);
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Time = Time;
        /**
         * 价格类型
         */
        class Price extends Decimal {
            /**
             * 价格类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                // 取此类型小数位设置
                let tmp = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_PRICE);
                if (!ibas.objects.isNull(tmp)) {
                    this.decimalPlaces = tmp;
                }
            }
        }
        datatype.Price = Price;
        /**
         * 数量类型
         */
        class Quantity extends Decimal {
            /**
             * 数量类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                // 取此类型小数位设置
                let tmp = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_QUANTITY);
                if (!ibas.objects.isNull(tmp)) {
                    this.decimalPlaces = tmp;
                }
            }
        }
        datatype.Quantity = Quantity;
        /**
         * 率类型
         */
        class Rate extends Decimal {
            /**
             * 率类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                // 取此类型小数位设置
                let tmp = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_RATE);
                if (!ibas.objects.isNull(tmp)) {
                    this.decimalPlaces = tmp;
                }
            }
        }
        datatype.Rate = Rate;
        /**
         * 总计类型
         */
        class Sum extends Decimal {
            /**
             * 总计类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                // 取此类型小数位设置
                let tmp = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_SUM);
                if (!ibas.objects.isNull(tmp)) {
                    this.decimalPlaces = tmp;
                }
            }
        }
        datatype.Sum = Sum;
        /**
         * 单位数量类型
         */
        class Measurement extends Decimal {
            /**
             * 单位数量类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
                // 取此类型小数位设置
                let tmp = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_MEASUREMENT);
                if (!ibas.objects.isNull(tmp)) {
                    this.decimalPlaces = tmp;
                }
            }
        }
        datatype.Measurement = Measurement;
        /**
         * 百分比类型
         */
        class Percentage extends Decimal {
            /**
             * 百分比类型
             * @param settings 设置
             */
            constructor() {
                super();
                this.decimalPlaces = 2;
            }
            formatValue(oValue) {
                if (ibas.objects.isNull(oValue) || typeof oValue !== "number") {
                    return "";
                }
                let value = oValue;
                let result = "";
                // 保留小数位
                if (!ibas.objects.isNull(this.decimalPlaces)) {
                    let pow = Math.pow(10, this.decimalPlaces);
                    value = Math.round(value * pow) / pow;
                    value = value * 100;
                    if (this.decimalPlaces >= 2) {
                        result = value.toFixed(this.decimalPlaces - 2);
                    }
                    else {
                        result = value.toFixed();
                    }
                }
                else {
                    value = value * 100;
                    result = value.toFixed();
                }
                return result + "%";
            }
            parseValue(oValue) {
                let isPercentage = false;
                let value = oValue;
                let result = null;
                if (oValue.endsWith("%")) {
                    isPercentage = true;
                    value = oValue.substring(0, oValue.length - 1);
                }
                result = Number.parseFloat(value);
                if (isPercentage) {
                    result = result / 100.0;
                }
                if (!ibas.objects.isNull(this.decimalPlaces)) {
                    let pow = Math.pow(10, this.decimalPlaces);
                    result = Math.round(result * pow) / pow;
                }
                return result;
            }
        }
        datatype.Percentage = Percentage;
        /**
         * 邮箱类型
         */
        class Email extends Alphanumeric {
            /**
             * 邮箱类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isEmail(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_email_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Email = Email;
        /**
         * 电话类型
         */
        class Phone extends Alphanumeric {
            /**
             * 电话类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isTelephone(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_phone_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Phone = Phone;
        /**
         * 连接类型
         */
        class Link extends Alphanumeric {
            /**
             * 连接类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
        }
        datatype.Link = Link;
        /**
         * 地址类型
         */
        class Address extends Alphanumeric {
            /**
             * 地址类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
        }
        datatype.Address = Address;
        /**
         * 图片类型
         */
        class Image extends DataType {
        }
        datatype.Image = Image;
        /**
         * Bytes类型
         */
        class Bytes extends DataType {
        }
        datatype.Bytes = Bytes;
        /**
         * Memo类型
         */
        class Memo extends DataType {
        }
        datatype.Memo = Memo;
        /**
         * 移动电话类型
         */
        class Mobile extends Alphanumeric {
            /**
             * 移动电话类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isMobile(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_phone_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Mobile = Mobile;
        /**
         * 联系电话类型(手机/电话)
         */
        class Telphone extends Alphanumeric {
            /**
             * 联系电话类型(手机/电话)
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isTelephone(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_phone_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Telphone = Telphone;
        /**
         * 邮编类型
         */
        class ZipCode extends Alphanumeric {
            /**
             * 邮编类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isZipCode(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_zip_code_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.ZipCode = ZipCode;
        /**
         * URL地址类型
         */
        class Url extends Alphanumeric {
            /**
             * URL地址类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isUrl(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_url_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Url = Url;
        /**
         * 密码类型
         * 以字母开头，长度在6-12之间，只能包含字符、数字和下划线
         */
        class Password extends Alphanumeric {
            /**
             * 密码类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isPassword(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_password_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.Password = Password;
        /**
         * 身份证号码类型
         */
        class PersonalID extends Alphanumeric {
            /**
             * 身份证号码类型
             * @param settings 设置
             */
            constructor(settings) {
                super(settings);
            }
            validate(oValue, managedObject) {
                let result = super.validate(oValue, managedObject);
                if (!validation.isPersonalID(oValue)) {
                    result.status = false;
                    result.message = ibas.i18n.prop("ui5_data_types_personalid_error");
                    this.fireValidationError(managedObject, result.message);
                }
                return result;
            }
            validateValue(oValue) {
                super.validateValue(oValue);
                let result = this.validate(oValue);
                if (!result.status) {
                    throw new sap.ui.model.ValidateException(result.message);
                }
            }
        }
        datatype.PersonalID = PersonalID;
        /**
         * 验证结果
         */
        class ValidateResult {
        }
        datatype.ValidateResult = ValidateResult;
    })(datatype = openui5.datatype || (openui5.datatype = {}));
    /**
     * 基础验证方法
     */
    let validation;
    (function (validation) {
        /**
         * 是否为空
         */
        function isNotEmpty(value) {
            return (value !== null && value !== undefined && value !== "");
        }
        validation.isNotEmpty = isNotEmpty;
        /**
         * 是否数字类型
         */
        function isNumeric(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                value = value.toString();
            }
            let result = value.match(/^[-\+]?\d+(\.\d+)?$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isNumeric = isNumeric;
        /**
         * 是否小数类型
         */
        function isDecimal(value, decimalPlaces) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (decimalPlaces === undefined || decimalPlaces === null || decimalPlaces < 0) {
                // 获取配制文件中小数位数
                decimalPlaces = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES, 6);
            }
            if (typeof value !== "string") { // 必须为string类型
                value = value.toString();
            }
            let rValue = "^(([1-9]\d*)|(([0-9]{1}|[1-9]+)\.[0-9]{1," + decimalPlaces + "}))$";
            let pValue = new RegExp(rValue);
            let result = value.match(pValue);
            if (result === null) {
                return true;
            }
            return true;
        }
        validation.isDecimal = isDecimal;
        /**
         * 是否字母和数字
         */
        function isAlphanumeric(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                value = value.toString();
            }
            let result = value.match(/[a-zA-Z0-9]+/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isAlphanumeric = isAlphanumeric;
        /**
         * 是否Email地址
         */
        function isEmail(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isEmail = isEmail;
        /**
         * 是否电话类型
         */
        function isPhone(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isPhone = isPhone;
        /**
         * 匹配移动电话类型
         */
        function isMobile(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(14\d{9})|(15\d{9})|(16\d{9})|(17\d{9})|(18\d{9}))$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isMobile = isMobile;
        /**
         * 联系电话(手机/电话皆可)验证
         */
        function isTelephone(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (validation.isMobile(value) || validation.isPhone(value)) {
                return true;
            }
            return false;
        }
        validation.isTelephone = isTelephone;
        /**
         * 匹配英文
         */
        function isEnglish(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^[A-Za-z]+$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isEnglish = isEnglish;
        /**
         * 匹配邮编
         */
        function isZipCode(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^[0-9]{6}$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isZipCode = isZipCode;
        /**
         * 匹配URL地址
         */
        function isUrl(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"])*$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isUrl = isUrl;
        /**
         * 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
         */
        function isPassword(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^[a-zA-Z]\w{6,12}$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isPassword = isPassword;
        /**
         * 匹配身份证号码
         */
        function isPersonalID(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (isNaN(value)) {
                return false;
            }
            if (typeof value !== "string") { // 必须为string类型
                value = value.toString();
            }
            let len = value.length;
            let re;
            if (len === 15) {
                re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
            }
            else if (len === 18) {
                re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
            }
            else {
                return false;
            }
            let a = value.match(re);
            if (a != null) {
                let D;
                let B;
                if (len === 15) {
                    D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
                    B = D.getYear().tostring() === a[3] && (D.getMonth() + 1) === Number(a[4]) && D.getDate() === Number(a[5]);
                }
                else {
                    D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
                    B = D.getFullYear().tostring() === a[3] && (D.getMonth() + 1) === Number(a[4]) && D.getDate() === Number(a[5]);
                }
                if (!B) {
                    return false;
                }
            }
            if (!re.test(value)) {
                return false;
            }
            return true;
        }
        validation.isPersonalID = isPersonalID;
        /**
         * 匹配汉字
         */
        function isChinese(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^[\u4e00-\u9fa5]+$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isChinese = isChinese;
        /**
         * 匹配中文字符(包括汉字和字符)
         */
        function isChineseChar(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value !== "string") { // 必须为string类型
                return false;
            }
            let result = value.match(/^[\u0391-\uFFE5]+$/);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isChineseChar = isChineseChar;
        /**
         * 日期
         */
        function isDate(value) {
            if (value === null || value === "" || value === undefined) {
                return true;
            }
            if (typeof value.getTime === "function") {
                return true;
            }
            // tslint:disable-next-line:max-line-length
            let rValue = "^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$";
            let pValue = new RegExp(rValue);
            let result = value.match(pValue);
            if (result === null) {
                return false;
            }
            return true;
        }
        validation.isDate = isDate;
        /**
         * 时间
         * ibas的时间类型使用int类型表示,个位和十位表示分钟,百位和千位表示小时
         * 如 1130表示 11:30, 808表示08:08, 3表示00:03
         */
        function isTime(value) {
            if (typeof value !== "number") { // 必须为数值类型
                return false;
            }
            let time = value;
            let hour = Math.floor(time / 100);
            let minute = time % 100;
            if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                return true;
            }
            return false;
        }
        validation.isTime = isTime;
    })(validation = openui5.validation || (openui5.validation = {}));
})(openui5 || (openui5 = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var openui5;
(function (openui5) {
    /** 工具集 */
    let utils;
    (function (utils) {
        /** 配置项目-列表表格可视行数 */
        utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT = "tableRow|List";
        /** 配置项目-子项表格可视行数 */
        utils.CONFIG_ITEM_ITEM_TABLE_VISIBLE_ROW_COUNT = "tableRow|Item";
        /**
         * 获取枚举类型map
         * @param data 枚举类型
         */
        function getEnumMap(data) {
            let map = new Map();
            for (let item in data) {
                if (ibas.objects.isNull(item)) {
                    continue;
                }
                let key = item;
                let text = data[key];
                if (typeof item !== "string" || typeof text !== "string") {
                    continue;
                }
                if (map.has(text)) {
                    continue;
                }
                map.set(key, text);
            }
            return map;
        }
        utils.getEnumMap = getEnumMap;
        /**
         * 创建下拉框可选项
         * @param data 枚举类型
         * @param blank 是否创建空白项
         */
        function createComboBoxItems(data, blank = false) {
            let items = new Array();
            if (blank === true) {
                items.push(new sap.ui.core.ListItem("", {
                    key: "",
                    text: ibas.i18n.prop("shell_please_chooose_data", ""),
                    additionalText: ""
                }));
            }
            for (let item of getEnumMap(data)) {
                items.push(new sap.ui.core.ListItem("", {
                    key: item[0],
                    text: ibas.enums.describe(data, item[1]),
                    additionalText: item[1]
                }));
            }
            return items;
        }
        utils.createComboBoxItems = createComboBoxItems;
        /** 获取表格或者列表选中的对象 */
        function getSelecteds(container) {
            let selecteds = new ibas.ArrayList();
            if (container instanceof sap.m.List) {
                if (container.getMode() === sap.m.ListMode.None) {
                    let item = container.getSwipedItem();
                    if (!ibas.objects.isNull(item)) {
                        selecteds.push(item.getBindingContext().getObject());
                    }
                }
                else {
                    for (let item of container.getSelectedContexts(undefined)) {
                        selecteds.push(item.getObject());
                    }
                }
            }
            else if (container instanceof sap.ui.table.Table) {
                for (let item of container.getSelectedIndices()) {
                    selecteds.push(container.getContextByIndex(item).getObject());
                }
            }
            return selecteds;
        }
        utils.getSelecteds = getSelecteds;
        /** 获取表格或者列表未选中的对象 */
        function getUnSelecteds(container) {
            let selecteds = new ibas.ArrayList();
            if (container instanceof sap.m.List) {
                for (let item of container.getItems()) {
                    selecteds.push(item.getBindingContext().getObject());
                }
                if (container.getMode() === sap.m.ListMode.None) {
                    if (!ibas.objects.isNull(container.getSwipedItem())) {
                        selecteds.remove(container.getSwipedItem().getBindingContext().getObject());
                    }
                }
                else {
                    for (let item of container.getSelectedContexts(undefined)) {
                        selecteds.remove(item.getObject());
                    }
                }
            }
            else if (container instanceof sap.ui.table.Table) {
                let index = 0;
                let context = container.getContextByIndex(index);
                while (!ibas.objects.isNull(context)) {
                    selecteds.push(context.getObject());
                    context = container.getContextByIndex(++index);
                }
                for (let item of container.getSelectedIndices()) {
                    selecteds.remove(container.getContextByIndex(item).getObject());
                }
            }
            return selecteds;
        }
        utils.getUnSelecteds = getUnSelecteds;
        /** 回转消息框值 */
        function toMessageAction(data) {
            switch (data) {
                case sap.m.MessageBox.Action.ABORT:
                    return ibas.emMessageAction.ABORT;
                case sap.m.MessageBox.Action.CANCEL:
                    return ibas.emMessageAction.CANCEL;
                case sap.m.MessageBox.Action.CLOSE:
                    return ibas.emMessageAction.CLOSE;
                case sap.m.MessageBox.Action.DELETE:
                    return ibas.emMessageAction.DELETE;
                case sap.m.MessageBox.Action.IGNORE:
                    return ibas.emMessageAction.IGNORE;
                case sap.m.MessageBox.Action.NO:
                    return ibas.emMessageAction.NO;
                case sap.m.MessageBox.Action.RETRY:
                    return ibas.emMessageAction.RETRY;
                case sap.m.MessageBox.Action.YES:
                    return ibas.emMessageAction.YES;
                default:
                    return ibas.emMessageAction.OK;
            }
        }
        utils.toMessageAction = toMessageAction;
        /** 转换消息框动作值 */
        function toMessageBoxAction(data) {
            let toValue = function (data) {
                switch (data) {
                    case ibas.emMessageAction.ABORT:
                        return sap.m.MessageBox.Action.ABORT;
                    case ibas.emMessageAction.CANCEL:
                        return sap.m.MessageBox.Action.CANCEL;
                    case ibas.emMessageAction.CLOSE:
                        return sap.m.MessageBox.Action.CLOSE;
                    case ibas.emMessageAction.DELETE:
                        return sap.m.MessageBox.Action.DELETE;
                    case ibas.emMessageAction.IGNORE:
                        return sap.m.MessageBox.Action.IGNORE;
                    case ibas.emMessageAction.NO:
                        return sap.m.MessageBox.Action.NO;
                    case ibas.emMessageAction.RETRY:
                        return sap.m.MessageBox.Action.RETRY;
                    case ibas.emMessageAction.YES:
                        return sap.m.MessageBox.Action.YES;
                    default:
                        return sap.m.MessageBox.Action.OK;
                }
            };
            if (data instanceof Array) {
                let values = [];
                for (let item of data) {
                    values.push(toValue(item));
                }
                return values;
            }
            else {
                return toValue(data);
            }
        }
        utils.toMessageBoxAction = toMessageBoxAction;
        /** 转换消息类型值  */
        function toMessageBoxIcon(data) {
            switch (data) {
                case ibas.emMessageType.ERROR:
                    return sap.m.MessageBox.Icon.ERROR;
                case ibas.emMessageType.INFORMATION:
                    return sap.m.MessageBox.Icon.INFORMATION;
                case ibas.emMessageType.QUESTION:
                    return sap.m.MessageBox.Icon.QUESTION;
                case ibas.emMessageType.SUCCESS:
                    return sap.m.MessageBox.Icon.SUCCESS;
                case ibas.emMessageType.WARNING:
                    return sap.m.MessageBox.Icon.WARNING;
                default:
                    return sap.m.MessageBox.Icon.NONE;
            }
        }
        utils.toMessageBoxIcon = toMessageBoxIcon;
        /** 转换消息类型值 */
        function toMessageType(type) {
            let uiType = sap.ui.core.MessageType.None;
            if (type === ibas.emMessageType.ERROR) {
                uiType = sap.ui.core.MessageType.Error;
            }
            else if (type === ibas.emMessageType.QUESTION) {
                uiType = sap.ui.core.MessageType.Warning;
            }
            else if (type === ibas.emMessageType.SUCCESS) {
                uiType = sap.ui.core.MessageType.Success;
            }
            else if (type === ibas.emMessageType.WARNING) {
                uiType = sap.ui.core.MessageType.Warning;
            }
            else if (type === ibas.emMessageType.INFORMATION) {
                uiType = sap.ui.core.MessageType.Information;
            }
            return uiType;
        }
        utils.toMessageType = toMessageType;
        /** 监听模型变化，并刷新控件 */
        function refreshModelChanged(managedObject, data) {
            if (ibas.objects.isNull(managedObject) || ibas.objects.isNull(data)) {
                return;
            }
            let datas = ibas.arrays.create(data);
            for (let item of datas) {
                if (item.registerListener !== undefined) {
                    item.registerListener({
                        id: managedObject.getId(),
                        propertyChanged(property) {
                            let model = managedObject.getModel(undefined);
                            if (!ibas.objects.isNull(model)) {
                                model.refresh(false);
                            }
                        }
                    });
                }
            }
        }
        utils.refreshModelChanged = refreshModelChanged;
        /** 自动触发下一个结果集查询 */
        function triggerNextResults(trigger) {
            if (ibas.objects.isNull(trigger) || ibas.objects.isNull(trigger.listener)) {
                return;
            }
            if (trigger.listener instanceof (sap.m.ListBase)) {
                // 绑定触发一次的事件
                trigger.listener.attachEvent("updateFinished", undefined, function (oEvent) {
                    if (this.getBusy()) {
                        // 忙状态不监听
                        return;
                    }
                    let model = this.getModel(undefined);
                    if (!ibas.objects.isNull(model)) {
                        let data = model.getData();
                        if (!ibas.objects.isNull(data) && !ibas.objects.isNull(this.getGrowingInfo())) {
                            if (this.getGrowingInfo().total === this.getGrowingInfo().actual) {
                                if (!ibas.objects.isNull(data)) {
                                    let modelData = data.rows; // 与绑定对象的路径有关
                                    let dataCount = modelData instanceof Array ? modelData.length : 0;
                                    let visibleRow = this.getGrowingThreshold(); // 当前显示条数
                                    if (dataCount <= 0 || dataCount < visibleRow) {
                                        return;
                                    }
                                    // 调用事件
                                    this.setBusy(true);
                                    trigger.next.call(trigger.next, modelData[modelData.length - 1]);
                                }
                            }
                        }
                    }
                });
            }
            else if (trigger.listener instanceof (sap.ui.table.Table)) {
                trigger.listener.attachEvent("_rowsUpdated", undefined, function (oEvent) {
                    if (this.getBusy()) {
                        // 忙状态不监听
                        return;
                    }
                    let model = this.getModel(undefined);
                    if (!ibas.objects.isNull(model)) {
                        let data = model.getData();
                        if (!ibas.objects.isNull(data)) {
                            let dataCount = data.length;
                            if (dataCount === undefined) {
                                // 存在绑定的对象路径问题
                                dataCount = data.rows.length;
                                if (dataCount !== undefined) {
                                    // 此路径存在数据
                                    data = data.rows;
                                }
                            }
                            let visibleRow = this.getVisibleRowCount();
                            if (dataCount > 0 && dataCount > visibleRow) {
                                let firstRow = this.getFirstVisibleRow(); // 当前页的第一行
                                if (firstRow === (dataCount - visibleRow)) {
                                    // 调用事件
                                    this.setBusy(true);
                                    trigger.next.call(trigger.next, data[data.length - 1]);
                                }
                            }
                        }
                    }
                });
            }
            // 绑定触发一次的事件
        }
        utils.triggerNextResults = triggerNextResults;
        /** 改变控件编辑状态 */
        function changeControlEditable(ctrl, editable) {
            if (ctrl instanceof sap.m.InputBase) {
                ctrl.setEditable(editable);
            }
            else if (ctrl instanceof sap.m.Select) {
                ctrl.setEnabled(editable);
            }
            else if (ctrl instanceof sap.m.Button) {
                ctrl.setEnabled(editable);
            }
            else if (ctrl instanceof sap.m.CheckBox) {
                ctrl.setEnabled(editable);
            }
            else if (ctrl instanceof sap.ui.table.Table) {
                ctrl.setEditable(editable);
                for (let row of ctrl.getRows()) {
                    for (let cell of row.getCells()) {
                        this.changeControlEditable(cell, editable);
                    }
                }
                for (let item of ctrl.getExtension()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (ctrl instanceof sap.m.Toolbar || ctrl instanceof sap.m.OverflowToolbar) {
                for (let item of ctrl.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (ctrl instanceof sap.ui.layout.form.SimpleForm) {
                for (let item of ctrl.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (ctrl instanceof sap.ui.layout.VerticalLayout) {
                for (let item of ctrl.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (ctrl instanceof sap.m.Page) {
                for (let item of ctrl.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (ctrl instanceof sap.m.FlexBox) {
                for (let item of ctrl.getItems()) {
                    this.changeControlEditable(item, editable);
                }
            }
        }
        utils.changeControlEditable = changeControlEditable;
        /** 改变窗体内控件编辑状态 */
        function changeFormEditable(form, editable) {
            if (form instanceof sap.ui.layout.form.SimpleForm) {
                for (let item of form.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (form instanceof sap.ui.layout.VerticalLayout) {
                for (let item of form.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
            else if (form instanceof sap.m.Page) {
                for (let item of form.getContent()) {
                    this.changeControlEditable(item, editable);
                }
            }
        }
        utils.changeFormEditable = changeFormEditable;
        /** 改变工具条保存状态 */
        function changeToolbarSavable(toolbar, savable) {
            for (let item of toolbar.getContent()) {
                if (item instanceof sap.m.Button) {
                    if (item.getIcon() === "sap-icon://save") {
                        item.setEnabled(savable);
                    }
                }
            }
        }
        utils.changeToolbarSavable = changeToolbarSavable;
        /** 改变工具条删除状态 */
        function changeToolbarDeletable(toolbar, deletable) {
            for (let item of toolbar.getContent()) {
                if (item instanceof sap.m.Button) {
                    if (item.getIcon() === "sap-icon://delete") {
                        item.setEnabled(deletable);
                    }
                }
            }
        }
        utils.changeToolbarDeletable = changeToolbarDeletable;
        /** 转换选择类型  */
        function toSelectionMode(data) {
            switch (data) {
                case ibas.emChooseType.SINGLE:
                    return sap.ui.table.SelectionMode.Single;
                case ibas.emChooseType.MULTIPLE:
                    return sap.ui.table.SelectionMode.MultiToggle;
                default:
                    return sap.ui.table.SelectionMode.None;
            }
        }
        utils.toSelectionMode = toSelectionMode;
        /** 改变表格选择方式（复选框单选）  */
        function changeSelectionStyle(table, chooseType) {
            if (!(table instanceof sap.ui.table.Table)) {
                return;
            }
            if (chooseType === ibas.emChooseType.SINGLE) {
                table.setEnableSelectAll(false);
                table.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
                table.attachRowSelectionChange(undefined, function (oEvent) {
                    this.setSelectedIndex(this.getSelectedIndex());
                });
            }
            if (chooseType === ibas.emChooseType.MULTIPLE) {
                table.setEnableSelectAll(true);
            }
        }
        utils.changeSelectionStyle = changeSelectionStyle;
        /** 转换选择类型  */
        function toListMode(data) {
            switch (data) {
                case ibas.emChooseType.SINGLE:
                    return sap.m.ListMode.SingleSelectMaster;
                case ibas.emChooseType.MULTIPLE:
                    return sap.m.ListMode.MultiSelect;
                default:
                    return sap.m.ListMode.None;
            }
        }
        utils.toListMode = toListMode;
        /**
         * 验证控件绑定属性是否合法
         */
        function validateControlBoundProperty() {
            /** 遍历展开控件内容 */
            function traverseContents() {
                let managedObject = arguments[0];
                let managedObjects = [];
                if (ibas.objects.isNull(managedObject)) {
                    return null;
                }
                if (managedObject instanceof sap.m.Panel) {
                    managedObjects.push(managedObject.getHeaderToolbar());
                }
                if (managedObject.getContent instanceof Function) {
                    for (let content of managedObject.getContent().reverse()) {
                        managedObjects.push(content);
                    }
                }
                else if (managedObject instanceof sap.ui.table.Table) {
                    for (let row of managedObject.getRows().reverse()) {
                        for (let cell of row.getCells()) {
                            managedObjects.push(cell);
                        }
                    }
                }
                else if (managedObject instanceof sap.m.Wizard) {
                    for (let step of managedObject.getSteps().reverse()) {
                        managedObjects.push(step);
                    }
                }
                else if (managedObject instanceof sap.m.ListBase) {
                    for (let listItem of managedObject.getItems().reverse()) {
                        managedObjects.push(listItem);
                    }
                }
                else if (managedObject instanceof sap.m.ColumnListItem) {
                    for (let cell of managedObject.getCells().reverse()) {
                        managedObjects.push(cell);
                    }
                }
                else if (managedObject instanceof sap.m.FlexBox) {
                    for (let item of managedObject.getItems().reverse()) {
                        managedObjects.push(item);
                    }
                }
                else {
                    return managedObject;
                }
                return managedObjects;
            }
            /** 获取控件验证值 */
            function getValidationValue(managedObject) {
                if (managedObject instanceof sap.m.InputBase || managedObject instanceof sap.m.DatePicker) {
                    return managedObject.getValue();
                }
                if (managedObject instanceof sap.m.Select) {
                    return managedObject.getSelectedKey();
                }
                if (managedObject instanceof sap.m.DateRangeSelection || managedObject instanceof sap.m.TimePicker) {
                    return managedObject.getDateValue();
                }
                return null;
            }
            /** 检查控件验证类型 */
            function checkControlBindingInfoType(managedObject) {
                let bindingInfo = null;
                if (!!managedObject && typeof managedObject.getBindingContext === "function") {
                    /** 控件当前有绑定内容才判断绑定类型 */
                    if (!!managedObject.getBindingContext()) {
                        /** 获取值类型,根据不同控件的绑定值添加 */
                        let bindingTypes = ["value", "dateValue", "secondDateValue", "selectedKey"];
                        for (let type of bindingTypes) {
                            let info = managedObject.getBindingInfo(type);
                            if (!!info && !!info.type && info.type.validate instanceof Function) {
                                bindingInfo = info;
                                break;
                            }
                        }
                    }
                }
                return !!bindingInfo ? bindingInfo.type : null;
            }
            let validateResult = new openui5.datatype.ValidateResult();
            validateResult.status = true;
            let argument = arguments[0];
            let managedObjects = [];
            if (ibas.objects.isNull(argument)) {
                return validateResult;
            }
            if (argument instanceof Array) {
                managedObjects = argument;
            }
            else {
                managedObjects = [argument];
            }
            for (let managedObject of managedObjects) {
                let content = traverseContents(managedObject);
                if (ibas.objects.isNull(content)) {
                }
                else if (content instanceof Array) {
                    let stepResult = validateControlBoundProperty(content);
                    if (!stepResult.status) {
                        validateResult.message = stepResult.message;
                        validateResult.status = stepResult.status;
                    }
                }
                else {
                    let bindingInfoType = checkControlBindingInfoType(content);
                    if (!!bindingInfoType) {
                        let validationValue = getValidationValue(content); // 界面值
                        validationValue = bindingInfoType.parseValue(validationValue); // 转为BO中属性值
                        let vResult = bindingInfoType.validate(validationValue, managedObject);
                        if (!vResult.status) {
                            validateResult.message = vResult.message;
                            validateResult.status = vResult.status;
                            bindingInfoType.fireValidationError(managedObject, validateResult.message);
                        }
                        else {
                            if (managedObject instanceof sap.ui.core.Element) {
                                sap.ui.getCore().fireValidationSuccess({
                                    element: managedObject
                                });
                            }
                        }
                    }
                }
            }
            return validateResult;
        }
        utils.validateControlBoundProperty = validateControlBoundProperty;
        /**
         * 初始化自定义字段UI
         * @param page 页面page
         * @param mainLayout 页面主布局
         */
        function drawUserFieldPage(page, mainLayout) {
            let split = new sap.ui.unified.SplitContainer("", {
                showSecondaryContent: true,
                secondaryContentWidth: "100%",
                content: [
                    new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                    })
                ],
                secondaryContent: [
                    mainLayout
                ]
            });
            let subHeader = page.getSubHeader();
            if (ibas.objects.isNull(subHeader)) {
                subHeader = new sap.m.Toolbar("");
                page.setSubHeader(subHeader);
            }
            if (ibas.objects.instanceOf(subHeader, sap.m.Toolbar)) {
                subHeader.addContent(new sap.m.ToolbarSpacer(""));
                subHeader.addContent(new sap.m.Button("", {
                    type: sap.m.ButtonType.Transparent,
                    icon: "sap-icon://filter-fields",
                    press: function () {
                        if (split.getSecondaryContentSize() === "100%") {
                            split.setSecondaryContentSize("80%");
                        }
                        else {
                            split.setSecondaryContentSize("100%");
                        }
                    }
                }));
            }
            page.removeAllContent();
            page.addContent(split);
        }
        utils.drawUserFieldPage = drawUserFieldPage;
        function loadUserFields() {
            let container = arguments[0];
            let boCode = ibas.config.applyVariables(arguments[1]);
            let boName = ibas.config.applyVariables(arguments[2]);
            let readOnly = arguments[3];
            if (typeof boName === "boolean") {
                readOnly = Boolean(boName);
                boName = undefined;
            }
            if (ibas.objects.isNull(readOnly)) {
                readOnly = false;
            }
            if (ibas.objects.isNull(container) || ibas.objects.isNull(boCode)) {
                return;
            }
            let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
            boRepository.fetchBOInfos({
                boCode: boCode,
                boName: boName,
                onCompleted(opRslt) {
                    let boInfo = opRslt.resultObjects.firstOrDefault();
                    if (ibas.objects.isNull(boInfo)) {
                        return;
                    }
                    if (ibas.objects.isNull(boInfo.properties)) {
                        return;
                    }
                    let properties = new ibas.ArrayList();
                    for (let item of boInfo.properties) {
                        if (item.systemed) {
                            continue;
                        }
                        properties.add(item);
                    }
                    let bo;
                    if (container instanceof sap.m.Page) {
                        container.attachModelContextChange(null, function (oEvent) {
                            if (!ibas.objects.isNull(oEvent.getSource()) && !ibas.objects.isNull(oEvent.getSource().getModel())) {
                                bo = oEvent.getSource().getModel().getData();
                                if (!ibas.objects.isNull(bo)) {
                                    registerUserField(bo, properties);
                                }
                            }
                        });
                        let split = container.getContent()[0];
                        if (split instanceof sap.ui.unified.SplitContainer) {
                            let userFieldForm = split.getContent()[0];
                            if (userFieldForm instanceof sap.ui.layout.form.SimpleForm) {
                                userFieldForm.removeAllContent();
                                if (properties.length <= 0) {
                                    // 如果对象没有自定义字段，打开自定义字段层按钮不显示
                                    let toolbar = container.getSubHeader();
                                    if (toolbar instanceof sap.m.Toolbar) {
                                        let controls = toolbar.getContent();
                                        let userFieldButton = controls[controls.length - 1];
                                        if (!ibas.objects.isNull(userFieldButton) && userFieldButton instanceof sap.m.Button) {
                                            userFieldButton.setVisible(false);
                                        }
                                    }
                                }
                                else {
                                    for (let index = 0; index < properties.length; index++) {
                                        let property = properties[index];
                                        userFieldForm.addContent(new sap.m.Label("", { text: property.description }));
                                        let control = createUserFieldControl(property, ibas.strings.format("userFields/{0}/value", index), readOnly);
                                        if (!ibas.objects.isNull(control)) {
                                            userFieldForm.addContent(control);
                                        }
                                    }
                                    if (!ibas.objects.isNull(container.getBindingContext())) {
                                        if (!ibas.objects.isNull(container.getBindingContext().getObject())) {
                                            bo = container.getBindingContext().getObject();
                                            registerUserField(bo, properties);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (container instanceof sap.ui.table.Table) {
                        container.attachModelContextChange(null, function (oEvent) {
                            if (!ibas.objects.isNull(oEvent.getSource()) && !ibas.objects.isNull(oEvent.getSource().getModel())) {
                                if (!ibas.objects.isNull(oEvent.getSource().getModel().getData().rows)) {
                                    bo = oEvent.getSource().getModel().getData().rows[0];
                                    if (!ibas.objects.isNull(properties)) {
                                        registerUserField(bo, properties);
                                    }
                                }
                            }
                        });
                        // 查询属性信息回调函数
                        registerUserField(bo, properties);
                        for (let index = 0; index < properties.length; index++) {
                            let property = properties[index];
                            let column = new sap.ui.table.Column("", {
                                label: property.description
                            });
                            let control = createUserFieldControl(property, ibas.strings.format("userFields/{0}/value", index), readOnly);
                            if (!ibas.objects.isNull(control)) {
                                column.setTemplate(control);
                                container.addColumn(column);
                            }
                        }
                    }
                    else if (container instanceof sap.ui.layout.form.SimpleForm) {
                        container.attachModelContextChange(null, function (oEvent) {
                            if (!ibas.objects.isNull(oEvent.getSource()) && !ibas.objects.isNull(oEvent.getSource().getModel())) {
                                bo = oEvent.getSource().getModel().getData();
                                if (!ibas.objects.isNull(bo)) {
                                    registerUserField(bo, properties);
                                }
                            }
                        });
                        // 如果对象没有自定义字段并且容器中无内容则容器不显示
                        if (properties.length <= 0) {
                            let formContent = container.getContent();
                            if (ibas.objects.isNull(formContent) || formContent.length <= 0) {
                                container.setVisible(false);
                            }
                        }
                        else {
                            for (let index = 0; index < properties.length; index++) {
                                let property = properties[index];
                                container.addContent(new sap.m.Label("", { text: property.description }));
                                let control = createUserFieldControl(property, ibas.strings.format("userFields/{0}/value", index), readOnly);
                                if (!ibas.objects.isNull(control)) {
                                    container.addContent(control);
                                }
                            }
                            if (!ibas.objects.isNull(container.getBindingContext())) {
                                if (!ibas.objects.isNull(container.getBindingContext().getObject())) {
                                    bo = container.getBindingContext().getObject();
                                    registerUserField(bo, properties);
                                }
                            }
                        }
                    }
                }
            });
        }
        utils.loadUserFields = loadUserFields;
        /**
         * 注册对象自定义字段
         * @param bo 对象实例
         * @param properties 对象自定义字段信息
         */
        function registerUserField(bo, properties) {
            if (ibas.objects.isNull(bo)) {
                return;
            }
            let boType = bo;
            if (boType instanceof ibas.BusinessObject) {
                // 对象实例
                if (ibas.objects.isNull(properties)) {
                    return;
                }
                for (let item of properties) {
                    bo.userFields.register(item.property, ibas.enums.valueOf(ibas.emDbFieldType, item.dataType));
                }
            }
            else if (boType instanceof Function) {
                // 对象类型
                let boCode;
                if (!ibas.objects.isNull(bo.BUSINESS_OBJECT_CODE)) {
                    // 如果目标是对象，则尝试使用其编码
                    boCode = ibas.config.applyVariables(bo.BUSINESS_OBJECT_CODE);
                }
                else if (!ibas.objects.isNull(bo.name)) {
                    // 如果目标是对象，则尝试使用其名称
                    boCode = bo.name;
                }
                let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                boRepository.fetchBOInfos({
                    boCode: boCode,
                    onCompleted(opRslt) {
                        let register = function (data) {
                            if (!(data instanceof ibas.BusinessObject)) {
                                return;
                            }
                            let boInfo = opRslt.resultObjects.firstOrDefault(c => c.name === ibas.objects.nameOf(data));
                            if (!ibas.objects.isNull(boInfo)) {
                                for (let item of boInfo.properties) {
                                    data.userFields.register(item.property, ibas.enums.valueOf(ibas.emDbFieldType, item.dataType));
                                }
                            }
                            for (let item in data) {
                                if (ibas.objects.isNull(item)) {
                                    continue;
                                }
                                let itemData = data[item];
                                if (itemData instanceof ibas.BusinessObject) {
                                    register(itemData);
                                }
                                else if (itemData instanceof ibas.BusinessObjects) {
                                    register(itemData.create());
                                }
                            }
                        };
                        register(new boType);
                    }
                });
            }
        }
        utils.registerUserField = registerUserField;
        /**
         * 获取显示自定义字段控件
         * @param userFieldInfo BOPropertyInformation属性信息
         * @param bindingPath 属性绑定路径 bindProperty("dateValue", { path: bindingPath});
         * @param readOnly 是否只读
         */
        function createUserFieldControl(userFieldInfo, bindingPath, readOnly = false) {
            if (ibas.strings.isEmpty(bindingPath) || userFieldInfo.authorised === ibas.emAuthoriseType.NONE) {
                return null;
            }
            if (userFieldInfo.authorised === ibas.emAuthoriseType.READ) {
                readOnly = true;
            }
            let control = sap.extension.factories.newComponent(userFieldInfo, readOnly === true ? "Text" : "Input");
            if (!ibas.strings.isEmpty(bindingPath)) {
                if (control instanceof sap.ui.core.Control) {
                    let bindingInfo = control.getBindingInfo("bindingValue");
                    if (bindingInfo && bindingInfo.parts instanceof Array) {
                        for (let item of bindingInfo.parts) {
                            item.path = bindingPath;
                        }
                    }
                }
            }
            return control;
        }
        utils.createUserFieldControl = createUserFieldControl;
    })(utils = openui5.utils || (openui5.utils = {}));
})(openui5 || (openui5 = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let repository;
        (function (repository) {
            /**
             * 查询数据
             * @param boRepository 仓库实例
             * @param dataInfo 数据信息
             * @param criteria 查询
             * @param onCompleted 完成事件
             */
            function fetch(boRepository, dataInfo, criteria, onCompleted) {
                try {
                    if (!(boRepository instanceof ibas.BORepositoryApplication)) {
                        throw new Error(ibas.i18n.prop("sys_invalid_parameter", "boRepository"));
                    }
                    let boName;
                    if (typeof dataInfo.type === "function") {
                        boName = ibas.objects.nameOf(dataInfo.type);
                    }
                    else if (typeof dataInfo.type === "object") {
                        boName = ibas.objects.nameOf(dataInfo.type);
                    }
                    else if (typeof dataInfo.type === "string") {
                        boName = dataInfo.type;
                    }
                    if (ibas.strings.isEmpty(boName)) {
                        throw new Error(ibas.i18n.prop("sys_invalid_parameter", "dataInfo.type"));
                    }
                    let propertyKey = dataInfo.key;
                    if (ibas.strings.isEmpty(propertyKey)) {
                        throw new Error(ibas.i18n.prop("sys_invalid_parameter", "dataInfo.key"));
                    }
                    let propertyText = dataInfo.text;
                    if (ibas.strings.isEmpty(propertyText)) {
                        propertyText = propertyKey;
                    }
                    let methodName = ibas.strings.format("fetch{0}", boName);
                    let method = boRepository[methodName];
                    if (!(method instanceof Function)) {
                        throw new Error(ibas.i18n.prop("sys_invalid_parameter", methodName));
                    }
                    method.call(boRepository, {
                        criteria: criteria,
                        onCompleted(opRslt) {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let values = new ibas.ArrayList();
                                for (let item of opRslt.resultObjects) {
                                    let keys = propertyValues(item, propertyKey);
                                    let texts = propertyValues(item, propertyText);
                                    for (let index = 0; index < keys.length; index++) {
                                        // 值全部转为字符类型
                                        values.add(new ibas.KeyText(String(keys[index]), index < texts.length ? String(texts[index]) : ""));
                                    }
                                }
                                if (onCompleted instanceof Function) {
                                    onCompleted(values);
                                }
                            }
                            catch (error) {
                                if (onCompleted instanceof Function) {
                                    onCompleted(error);
                                }
                            }
                        }
                    });
                }
                catch (error) {
                    if (onCompleted instanceof Function) {
                        onCompleted(error);
                    }
                }
            }
            repository.fetch = fetch;
            /**
             * 获取数据属性值
             * @param data 数据
             * @param property 属性(items.code | code)
             */
            function propertyValues(data, property) {
                let values = new ibas.ArrayList();
                let path = property.split(".")[0];
                let value = data[path];
                if (!ibas.objects.isNull(value)) {
                    if (path.length < property.length) {
                        property = property.substring(path.length);
                        if (value instanceof Array) {
                            for (let item of propertyValues(value, property)) {
                                values.add(item);
                            }
                        }
                    }
                    else {
                        values.add(value);
                    }
                }
                return values;
            }
            repository.propertyValues = propertyValues;
            /**
             * 批量查询数据，排队等待查询（等待15毫秒或30个条件）
             * @param boRepository 仓库实例
             * @param dataInfo 数据信息
             * @param criteria 查询
             * @param onCompleted 完成事件
             */
            function batchFetch(boRepository, dataInfo, criteria, onCompleted) {
                let batchTask = batchTaskManager.create(boRepository, dataInfo);
                batchTask.addTask(criteria, onCompleted);
                if (!batchTask.isRunning()) {
                    batchTask.do();
                }
            }
            repository.batchFetch = batchFetch;
            class BatchTask extends ibas.Action {
                constructor() {
                    super();
                    this.tasks = new ibas.ArrayList();
                    this.cachedDatas = new Map();
                }
                /** 进行 */
                do() {
                    super.do();
                    // 过期回收
                    setTimeout(() => {
                        this.done();
                    }, this.getConfig(BatchTask.CONFIG_ITEM_EXPIRATION_TIME, 900000));
                }
                run() {
                    this.id = String(setInterval(() => {
                        // 没有任务退出
                        if (this.tasks.length === 0) {
                            return;
                        }
                        // 合并查询条件
                        let tasks = new ibas.ArrayList();
                        let criteria = new ibas.Criteria();
                        for (let task of this.tasks) {
                            if (ibas.objects.isNull(task)) {
                                continue;
                            }
                            if (ibas.objects.isNull(task.criteria)) {
                                continue;
                            }
                            let rValues = new ibas.ArrayList();
                            let newItem;
                            for (let item of task.criteria.conditions) {
                                // 复制查询条件
                                if (item.alias === task.dataInfo.key) {
                                    let value = this.cachedDatas.get(item.value);
                                    if (!ibas.objects.isNull(value)) {
                                        rValues.add(value);
                                        continue;
                                    }
                                }
                                criteria.conditions.add(newItem = ibas.objects.clone(item));
                                if (item === task.criteria.conditions.firstOrDefault()) {
                                    newItem.relationship = ibas.emConditionRelationship.OR;
                                    if (item.bracketOpen > 0 && task.criteria.conditions.length > 1) {
                                        newItem.bracketOpen++;
                                    }
                                }
                                else if (item === task.criteria.conditions.lastOrDefault()) {
                                    if (item.bracketClose > 0 && task.criteria.conditions.length > 1) {
                                        newItem.bracketClose++;
                                    }
                                }
                            }
                            if (rValues.length > 0 && rValues.length >= task.criteria.conditions.length && task.onCompleted instanceof Function) {
                                task.onCompleted(rValues);
                            }
                            else {
                                tasks.add(task);
                            }
                        }
                        this.tasks = new ibas.ArrayList();
                        // 没有需要查询
                        if (criteria.conditions.length === 0) {
                            return;
                        }
                        fetch(this.boRepository, this.dataInfo, criteria, (values) => {
                            if (values instanceof Error) {
                                for (let task of tasks) {
                                    if (task.onCompleted instanceof Function) {
                                        task.onCompleted(values);
                                    }
                                }
                            }
                            else {
                                for (let value of values) {
                                    this.cachedDatas.set(value.key, value);
                                }
                                for (let task of tasks) {
                                    if (task && task.criteria) {
                                        let rValues = new ibas.ArrayList();
                                        for (let item of task.criteria.conditions) {
                                            if (item.alias === task.dataInfo.key) {
                                                let value = this.cachedDatas.get(item.value);
                                                if (!ibas.objects.isNull(value)) {
                                                    rValues.add(value);
                                                }
                                                else {
                                                    // 没有查到数据，则原始值
                                                    rValues.add(new ibas.KeyText(item.value, item.value));
                                                }
                                            }
                                        }
                                        if (rValues.length === 0) {
                                            continue;
                                        }
                                        if (task.onCompleted instanceof Function) {
                                            task.onCompleted(rValues);
                                        }
                                    }
                                }
                            }
                        });
                    }, this.getConfig(BatchTask.CONFIG_ITEM_WAITTING_TIME, 30)));
                    return false;
                }
                addTask(criteria, onCompleted) {
                    let task = new Task();
                    task.boRepository = this.boRepository;
                    task.dataInfo = this.dataInfo;
                    task.criteria = criteria;
                    task.onCompleted = onCompleted;
                    this.tasks.add(task);
                }
            }
            /** 等待时间 */
            BatchTask.CONFIG_ITEM_WAITTING_TIME = "waittingTime";
            /** 过期时间 */
            BatchTask.CONFIG_ITEM_EXPIRATION_TIME = "expirationTime";
            class Task {
            }
            class BatchTaskManager {
                create(boRepository, dataInfo) {
                    if (ibas.objects.isNull(this.batchTasks)) {
                        this.batchTasks = new Map();
                    }
                    let values = this.batchTasks.get(boRepository);
                    if (ibas.objects.isNull(values)) {
                        this.batchTasks.set(boRepository, values = new Map());
                    }
                    let value = values.get(dataInfo.type);
                    if (ibas.objects.isNull(value)) {
                        value = new BatchTask();
                        value.boRepository = boRepository;
                        value.dataInfo = dataInfo;
                        value.addConfig(BatchTask.CONFIG_ITEM_WAITTING_TIME, 30);
                        value.addConfig(BatchTask.CONFIG_ITEM_EXPIRATION_TIME, 600000);
                        value.onDone = function () {
                            values.delete(dataInfo.type);
                            if (values.size === 0) {
                                batchTaskManager.batchTasks.delete(boRepository);
                                values = null;
                            }
                            clearInterval(Number(value.id));
                            value = null;
                        };
                        values.set(dataInfo.type, value);
                    }
                    return value;
                }
            }
            const batchTaskManager = new BatchTaskManager();
        })(repository = extension.repository || (extension.repository = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        /**
         * 工具集
         */
        let utils;
        (function (utils) {
            /**
             * 解析业务仓库
             * @param value 值
             */
            function repository(value) {
                let boRepository;
                if (typeof value === "string") {
                    boRepository = ibas.boFactory.create(value);
                }
                else if (value instanceof ibas.BORepositoryApplication) {
                    boRepository = value;
                }
                else if (value instanceof Function) {
                    boRepository = new value;
                }
                return boRepository;
            }
            utils.repository = repository;
            /**
             * 解析数据信息
             * @param value 值
             */
            function dataInfo(value) {
                let dataInfo = { type: undefined, key: undefined, text: undefined };
                if (typeof value === "string") {
                    dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables(value));
                }
                else if (typeof value === "function") {
                    dataInfo.type = value;
                }
                else if (typeof value === "object") {
                    for (let item in dataInfo) {
                        if (!item) {
                            continue;
                        }
                        dataInfo[item] = value[item];
                    }
                }
                if (dataInfo.type && (!dataInfo.key || !dataInfo.text)) {
                    if (ibas.objects.isAssignableFrom(dataInfo.type, ibas.BOMasterData)) {
                        if (!dataInfo.key) {
                            dataInfo.key = ibas.BO_PROPERTY_NAME_CODE;
                        }
                        if (!dataInfo.text) {
                            dataInfo.text = ibas.BO_PROPERTY_NAME_NAME;
                        }
                    }
                    else if (ibas.objects.isAssignableFrom(dataInfo.type, ibas.BODocument)) {
                        if (!dataInfo.key) {
                            dataInfo.key = ibas.BO_PROPERTY_NAME_DOCENTRY;
                        }
                    }
                    else if (ibas.objects.isAssignableFrom(dataInfo.type, ibas.BOSimple)) {
                        if (!dataInfo.key) {
                            dataInfo.key = ibas.BO_PROPERTY_NAME_OBJECTKEY;
                        }
                    }
                }
                return dataInfo;
            }
            utils.dataInfo = dataInfo;
            /**
             * 解析查询
             * @param value 值
             */
            function criteria(value) {
                let criteria;
                if (value instanceof ibas.Criteria) {
                    criteria = value;
                }
                else if (value instanceof Array) {
                    criteria = new ibas.Criteria();
                    for (let item of value) {
                        if (item instanceof ibas.Condition) {
                            criteria.conditions.add(item);
                        }
                    }
                }
                return criteria;
            }
            utils.criteria = criteria;
            /** 检查绑定信息 */
            function checkBindingInfo(sName, oBindingInfo) {
                if (ibas.strings.equals(sName, "bindingValue") && !ibas.objects.isNull(oBindingInfo) && !ibas.objects.isNull(oBindingInfo.path)) {
                    if (!oBindingInfo.formatter && !oBindingInfo.type) {
                        ibas.logger.log(ibas.emMessageLevel.WARN, "{0}: [{1} -> {2}] not specify the type of binding.", this.getId(), sName, oBindingInfo.path);
                        return false;
                    }
                }
                return true;
            }
            utils.checkBindingInfo = checkBindingInfo;
        })(utils = extension.utils || (extension.utils = {}));
        /**
         * 变量
         */
        let variables;
        (function (variables) {
            /**
             * 值
             */
            const VALUES = new Map();
            /**
             * 获取值
             * @param keys 键，可以多个
             */
            function get(...keys) {
                if (!keys || keys.length < 1) {
                    throw new RangeError("keys count.");
                }
                let key;
                let values = VALUES;
                for (let i = 0; i < keys.length; i++) {
                    key = keys[i];
                    if ((i + 1) < keys.length) {
                        let tValues = values.get(key);
                        if (!(tValues instanceof Map)) {
                            return undefined;
                        }
                        values = tValues;
                    }
                    else {
                        break;
                    }
                }
                return values.get(key);
            }
            variables.get = get;
            /**
             * 设置值
             * @param value 值
             * @param keys  键，可以多个
             */
            function set(value, ...keys) {
                if (!keys || keys.length < 1) {
                    throw new RangeError("keys count.");
                }
                let key;
                let values = VALUES;
                for (let i = 0; i < keys.length; i++) {
                    key = keys[i];
                    if ((i + 1) < keys.length) {
                        let tValues = values.get(key);
                        if (ibas.objects.isNull(tValues)) {
                            tValues = new Map();
                            values.set(key, tValues);
                        }
                        if (!(tValues instanceof Map)) {
                            throw new TypeError("key values.");
                        }
                        values = tValues;
                    }
                    else {
                        break;
                    }
                }
                values.set(key, value);
            }
            variables.set = set;
        })(variables = extension.variables || (extension.variables = {}));
        /** 页面操作集 */
        let pages;
        (function (pages) {
            /**
             * 改变页面控件状态
             */
            function changeStatus(page) {
                let model = page && page.getModel() ? page.getModel().getData() : null;
                if (model instanceof ibas.BOMasterData || model instanceof ibas.BOMasterDataLine) {
                    if (!model.isNew) {
                        nonEditable(page.getSubHeader(), ["!"]);
                        for (let item of page.getContent()) {
                            nonEditable(item, ["Code"]);
                        }
                    }
                }
                else if (model instanceof ibas.BODocument) {
                    if (model.getProperty("DocumentStatus") === ibas.emDocumentStatus.CLOSED) {
                        nonEditable(page.getSubHeader(), ["sap-icon://save", "sap-icon://delete", "sap-icon://create"]);
                        for (let item of page.getContent()) {
                            nonEditable(item, []);
                        }
                    }
                }
                else if (model instanceof ibas.BODocumentLine) {
                    if (model.getProperty("LineStatus") === ibas.emDocumentStatus.CLOSED) {
                        nonEditable(page.getSubHeader(), ["sap-icon://save", "sap-icon://delete", "sap-icon://create"]);
                        for (let item of page.getContent()) {
                            nonEditable(item, []);
                        }
                    }
                }
            }
            pages.changeStatus = changeStatus;
            function checkBinding(control, properties) {
                if (control instanceof sap.m.Button || control instanceof sap.m.MenuButton) {
                    let binding = control.getIcon();
                    for (let item of properties) {
                        if (ibas.strings.equalsIgnoreCase(item, binding)) {
                            return true;
                        }
                    }
                }
                else {
                    let binding = control.getBinding("bindingValue");
                    if (binding instanceof sap.ui.model.Binding) {
                        let sPath = binding.getPath();
                        for (let item of properties) {
                            if (ibas.strings.equalsIgnoreCase(item, sPath)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            function nonEditable(control, properties) {
                if (!(properties instanceof Array)) {
                    properties = [];
                }
                if (control instanceof sap.m.InputBase) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            control.setEditable(false);
                        }
                    }
                    else {
                        control.setEditable(false);
                    }
                }
                else if (control instanceof sap.m.Select) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            try {
                                control.setEditable(false);
                            }
                            catch (error) {
                                control.setEnabled(false);
                            }
                        }
                    }
                    else {
                        try {
                            control.setEditable(false);
                        }
                        catch (error) {
                            control.setEnabled(false);
                        }
                    }
                }
                else if (control instanceof sap.m.CheckBox) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            control.setEditable(false);
                        }
                    }
                    else {
                        control.setEditable(false);
                    }
                }
                else if (control instanceof sap.extension.core.EditableControl) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            control.setEditable(false);
                        }
                    }
                    else {
                        control.setEditable(false);
                    }
                }
                else if (control instanceof sap.m.Button || control instanceof sap.m.MenuButton) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            control.setEnabled(false);
                        }
                    }
                    else {
                        control.setEnabled(false);
                    }
                }
                else if (control instanceof sap.ui.table.Table) {
                    if (properties.length > 0) {
                        if (checkBinding(control, properties)) {
                            control.setEditable(false);
                        }
                    }
                    else {
                        control.setEditable(false);
                    }
                    if (control.getEditable() === false) {
                        for (let row of control.getRows()) {
                            for (let cell of row.getCells()) {
                                nonEditable(cell, properties);
                            }
                        }
                        properties = Array.from(properties);
                        properties.push("sap-icon://add");
                        properties.push("sap-icon://less");
                        if (control.getExtension instanceof Function) {
                            for (let item of control.getExtension()) {
                                nonEditable(item, properties);
                            }
                        }
                        if (control.getToolbar instanceof Function) {
                            nonEditable(control.getToolbar(), properties);
                        }
                    }
                }
                else if (control instanceof sap.m.Page) {
                    for (let item of control.getContent()) {
                        nonEditable(item, properties);
                    }
                }
                else if (control instanceof sap.ui.layout.form.SimpleForm) {
                    for (let item of control.getContent()) {
                        nonEditable(item, properties);
                    }
                }
                else if (control instanceof sap.ui.layout.VerticalLayout) {
                    for (let item of control.getContent()) {
                        nonEditable(item, properties);
                    }
                }
                else if (control instanceof sap.ui.layout.DynamicSideContent) {
                    for (let item of control.getMainContent()) {
                        nonEditable(item, properties);
                    }
                    for (let item of control.getSideContent()) {
                        nonEditable(item, properties);
                    }
                }
                else if (control instanceof sap.m.Toolbar) {
                    for (let item of control.getContent()) {
                        nonEditable(item, properties);
                    }
                }
            }
        })(pages = extension.pages || (extension.pages = {}));
        /** 表格操作集 */
        let tables;
        (function (tables) {
            /**
             * 参照table列绑定，创建对象
             * @param table 参照表格
             * @param data 数据（csv转换数组）
             * @param type 返回对象类型
             */
            function parseObject(table, datas, type = {}) {
                let jsons = new ibas.ArrayList();
                if (datas instanceof Array && datas.length > 1) {
                    let titles = datas[0];
                    if (titles instanceof Array && titles.length > 0) {
                        let properties = new Array(titles.length);
                        for (let i = 0; i < titles.length; i++) {
                            let title = titles[i];
                            for (let column of table.getColumns()) {
                                let label = column.getLabel();
                                if (label instanceof sap.m.Label) {
                                    if (title === label.getText()) {
                                        let template = column.getTemplate();
                                        if (template instanceof sap.ui.core.Control) {
                                            let bindingInfo = template.getBindingInfo("bindingValue");
                                            if (bindingInfo && bindingInfo.parts instanceof Array) {
                                                properties[i] = bindingInfo.parts[0];
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        for (let i = 1; i < datas.length; i++) {
                            let data = datas[i];
                            if (data instanceof Array && data.length === properties.length) {
                                let json = new type;
                                for (let j = 0; j < data.length; j++) {
                                    let value = data[j];
                                    let property = properties[j];
                                    if (!ibas.strings.isEmpty(property)) {
                                        if (property.type instanceof sap.extension.data.Type) {
                                            json[property.path] = property.type.parseValue(value, typeof value);
                                        }
                                        else {
                                            json[property.path] = value;
                                        }
                                    }
                                }
                                jsons.add(json);
                            }
                        }
                    }
                }
                return jsons;
            }
            tables.parseObject = parseObject;
        })(tables = extension.tables || (extension.tables = {}));
        /** 数据操作集 */
        let datas;
        (function (datas) {
            /** 默认检查的属性 */
            const CHECK_PROPERTIES = ["value", "dataValue", "selectedKey", "bindingValue"];
            /**
             * 验证数据
             * @param element 被验证元素
             * @returns 是否通过
             */
            function validate(element, chkProperies) {
                return new extension.data.Validator(ibas.arrays.create(element), ibas.arrays.create(CHECK_PROPERTIES, chkProperies)).valid();
            }
            datas.validate = validate;
        })(datas = extension.datas || (extension.datas = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let data;
        (function (data) {
            /**
             * 数据类型基类
             */
            class Type extends sap.ui.model.SimpleType {
                constructor(setting) {
                    super();
                    if (!ibas.objects.isNull(setting)) {
                        this.onValidated = setting.onValidated;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    return oValue;
                }
                /**
                 * 验证值
                 * @param oValue 值
                 */
                validateValue(oValue) {
                    try {
                        this.validate(oValue);
                    }
                    catch (error) {
                        if (this.onValidated instanceof Function) {
                            let result = this.onValidated(error);
                            if (!(result instanceof sap.ui.model.ValidateException)) {
                                result = new sap.ui.model.ValidateException(error.message);
                            }
                            throw result;
                        }
                        else {
                            throw new sap.ui.model.ValidateException(error.message);
                        }
                    }
                }
            }
            data.Type = Type;
            /**
             * 未知类型
             */
            class Unknown extends Type {
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.formatValue = setting.formatValue;
                        this.parseValue = setting.parseValue;
                        this._validate = setting.validate;
                    }
                }
                validate(oValue) {
                    if (this._validate instanceof Function) {
                        this._validate(oValue);
                    }
                }
            }
            data.Unknown = Unknown;
            /**
             * 字母数字类型
             */
            class Alphanumeric extends Type {
                /**
                 * 字母数字类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.notEmpty = setting.notEmpty;
                        this.maxLength = setting.maxLength;
                        this.minLength = setting.minLength;
                        this.regExp = setting.regExp;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        // 需要字符串类型
                        if (ibas.objects.isNull(oValue)) {
                            return undefined;
                        }
                        return ibas.strings.valueOf(oValue);
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (ibas.objects.isNull(oValue)) {
                        return undefined;
                    }
                    return ibas.strings.valueOf(oValue);
                }
                /** 验证数据 */
                validate(oValue) {
                    if (this.notEmpty === true) {
                        if (ibas.strings.isEmpty(oValue)) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_is_empty"));
                        }
                    }
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (typeof oValue === "string") {
                        if (this.maxLength && oValue.length > this.maxLength) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_length_more_than", this.maxLength));
                        }
                        if (this.minLength && oValue.length < this.minLength) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_length_less_than", this.minLength));
                        }
                        if (this.regExp) {
                            if (oValue.match(this.regExp) === null) {
                                throw new RangeError(ibas.i18n.prop("openui5_data_value_not_match", this.regExp.source));
                            }
                        }
                    }
                    else {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            data.Alphanumeric = Alphanumeric;
            /**
             * 数字类型
             */
            class Numeric extends Type {
                /**
                 * 数字类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.minValue = setting.minValue;
                        this.maxValue = setting.maxValue;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        // 需要字符串类型
                        if (ibas.objects.isNull(oValue)) {
                            return undefined;
                        }
                        return ibas.numbers.toString(oValue, 0);
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (typeof oValue === "number") {
                        return Math.floor(oValue);
                    }
                    else if (typeof oValue === "string") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        return ibas.numbers.toInt(oValue);
                    }
                    return 0;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (typeof oValue === "number" && !isNaN(oValue)) {
                        if (this.minValue && oValue < this.minValue) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_less_than", this.minValue));
                        }
                        if (this.maxValue && oValue > this.maxValue) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_more_than", this.maxValue));
                        }
                    }
                    else {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            data.Numeric = Numeric;
            /**
             * 小数类型
             */
            class Decimal extends Type {
                /**
                 * 小数类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.minValue = setting.minValue;
                        this.maxValue = setting.maxValue;
                        this.decimalPlaces = setting.decimalPlaces;
                    }
                    if (ibas.objects.isNull(this.decimalPlaces)) {
                        this.decimalPlaces = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES, 6);
                        this.decimalPlaces = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES + "|" + ibas.objects.nameOf(this), this.decimalPlaces);
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        // 需要字符串类型
                        if (ibas.objects.isNull(oValue)) {
                            return undefined;
                        }
                        return ibas.numbers.toString(oValue, this.decimalPlaces);
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (typeof oValue === "number") {
                        return ibas.numbers.round(oValue, this.decimalPlaces);
                    }
                    else if (typeof oValue === "string") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        return ibas.numbers.round(ibas.numbers.valueOf(oValue), this.decimalPlaces);
                    }
                    return 0.0;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (typeof oValue === "number" && !isNaN(oValue)) {
                        if (this.minValue && oValue < this.minValue) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_less_than", this.minValue));
                        }
                        if (this.maxValue && oValue > this.maxValue) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_more_than", this.maxValue));
                        }
                    }
                    else {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            data.Decimal = Decimal;
            /**
             * 价格类型
             */
            class Price extends Decimal {
                /**
                 * 价格类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                }
            }
            data.Price = Price;
            /**
             * 数量类型
             */
            class Quantity extends Decimal {
                /**
                 * 数量类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                }
            }
            data.Quantity = Quantity;
            /**
             * 率类型
             */
            class Rate extends Decimal {
                /**
                 * 率类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                }
            }
            data.Rate = Rate;
            /**
             * 总计类型
             */
            class Sum extends Decimal {
                /**
                 * 总计类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                }
            }
            data.Sum = Sum;
            /**
             * 单位数量类型
             */
            class Measurement extends Decimal {
                /**
                 * 单位数量类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                }
            }
            data.Measurement = Measurement;
            /**
             * 百分比类型
             */
            class Percentage extends Decimal {
                /**
                 * 百分比类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (ibas.objects.isNull(this.decimalPlaces)) {
                        this.decimalPlaces = 2;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        oValue = ibas.numbers.round(oValue * 100, this.decimalPlaces - 2);
                        return oValue + "%";
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (typeof oValue === "string") {
                        if (ibas.strings.isWith(oValue, undefined, "%")) {
                            oValue = oValue.substring(0, oValue.length - 1);
                        }
                        oValue = parseFloat(oValue) / 100;
                        return super.parseValue(oValue, sInternalType);
                    }
                    return super.parseValue.apply(this, arguments);
                }
            }
            data.Percentage = Percentage;
            /**
             * 日期时间类型
             */
            class Date extends Type {
                /**
                 * 日期时间类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.format = setting.format;
                    }
                    if (ibas.strings.isEmpty(this.format)) {
                        this.format = Date.DEFAULT_FORMAT;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        if (ibas.objects.isNull(oValue)) {
                            return undefined;
                        }
                        if (this.format) {
                            return ibas.dates.toString(oValue, this.format);
                        }
                        else {
                            return ibas.dates.toString(oValue);
                        }
                    }
                    else if (sInternalType === "number") {
                        return ibas.dates.valueOf(oValue).getTime();
                    }
                    else if (sInternalType === "Date") {
                        if (typeof oValue === "string" || typeof oValue === "number") {
                            return ibas.dates.valueOf(oValue);
                        }
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (ibas.dates.isDate(oValue)) {
                        return oValue;
                    }
                    else if (typeof oValue === "string" || typeof oValue === "number") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        return ibas.dates.valueOf(oValue);
                    }
                    return undefined;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (!ibas.dates.isDate(oValue)) {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            /**
             * 默认格式：yyyy-MM-dd
             */
            Date.DEFAULT_FORMAT = ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE, "yyyy-MM-dd");
            data.Date = Date;
            /**
             * 时间类型
             */
            class Time extends Type {
                /**
                 * 时间类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.format = setting.format;
                    }
                    if (ibas.strings.isEmpty(this.format)) {
                        this.format = Time.DEFAULT_FORMAT;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        if (typeof oValue === "number") {
                            let hour = Math.floor(oValue / 100);
                            let minute = oValue - (hour * 100);
                            return this.format.replace("HH", ibas.strings.fill(hour, 2, "0"))
                                .replace("mm", ibas.strings.fill(minute, 2, "0"));
                        }
                    }
                    else if (sInternalType === "Date" && !ibas.objects.isNull(oValue)) {
                        let value = 0;
                        if (typeof oValue === "number") {
                            value = oValue;
                        }
                        else if (typeof oValue === "string") {
                            value = parseInt(oValue.replace(":", ""), 0);
                        }
                        let hour = Math.floor(value / 100);
                        let minute = value - (hour * 100);
                        value = (hour * 60 * 60 * 1000) + (minute * 60 * 1000);
                        return ibas.dates.valueOf(ibas.dates.valueOf(0).setHours(hour, minute));
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (typeof oValue === "number") {
                        return oValue;
                    }
                    else if (typeof oValue === "string") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        let builder = new ibas.StringBuilder();
                        for (let item of oValue) {
                            if (!ibas.numbers.isNumber(item)) {
                                continue;
                            }
                            builder.append(item);
                        }
                        oValue = builder.toString();
                        if (oValue.length > 4) {
                            if (oValue.length <= 6) {
                                oValue = oValue.substring(0, oValue.length - 2);
                            }
                            else {
                                oValue = oValue.substring(0, 4);
                            }
                        }
                        return ibas.numbers.toInt(oValue);
                    }
                    else if (ibas.dates.isDate(oValue)) {
                        return parseInt(ibas.dates.toString(oValue, "HHmm"), 0);
                    }
                    return undefined;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (typeof oValue === "number") {
                        if (!(oValue >= 0 && oValue <= 2400)) {
                            throw new RangeError(ibas.i18n.prop("openui5_data_value_not_between", 0, 2400));
                        }
                    }
                    else {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            /**
             * 默认格式：HH:mm
             */
            Time.DEFAULT_FORMAT = ibas.config.get(ibas.CONFIG_ITEM_FORMAT_TIME, "HH:mm");
            data.Time = Time;
            /**
             * 日期时间类型
             */
            class DateTime extends Type {
                /**
                 * 日期时间类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.format = setting.format;
                    }
                    if (ibas.strings.isEmpty(this.format)) {
                        this.format = Date.DEFAULT_FORMAT;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        if (ibas.objects.isNull(oValue)) {
                            return undefined;
                        }
                        if (this.format) {
                            return ibas.dates.toString(oValue, this.format);
                        }
                        else {
                            return ibas.dates.toString(oValue);
                        }
                    }
                    else if (sInternalType === "number") {
                        return ibas.dates.valueOf(oValue).getTime();
                    }
                    else if (sInternalType === "Date") {
                        if (typeof oValue === "string" || typeof oValue === "number") {
                            return ibas.dates.valueOf(oValue);
                        }
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (ibas.dates.isDate(oValue)) {
                        return oValue;
                    }
                    else if (typeof oValue === "string" || typeof oValue === "number") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        return ibas.dates.valueOf(oValue);
                    }
                    return undefined;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    if (!ibas.dates.isDate(oValue)) {
                        throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                    }
                }
            }
            /**
             * 默认格式：yyyy-MM-dd HH:ss
             */
            DateTime.DEFAULT_FORMAT = Date.DEFAULT_FORMAT + " " + Time.DEFAULT_FORMAT;
            data.DateTime = DateTime;
            /**
             * 枚举类型
             */
            class Enum extends Type {
                /**
                 * 枚举类型
                 * @param setting 设置
                 */
                constructor(setting) {
                    super(setting);
                    if (!ibas.objects.isNull(setting)) {
                        this.enumType = setting.enumType;
                        this.describe = setting.describe;
                    }
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "string") {
                        if (this.describe === true) {
                            return ibas.enums.describe(this.enumType, oValue);
                        }
                        return ibas.strings.valueOf(oValue);
                    }
                    return oValue;
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (this.describe === true) {
                        throw new Error("Method not implemented.");
                    }
                    if (typeof oValue === "string") {
                        if (ibas.strings.isEmpty(oValue)) {
                            return undefined;
                        }
                        return ibas.enums.valueOf(this.enumType, oValue);
                    }
                    else if (typeof oValue === "number") {
                        return oValue;
                    }
                    return undefined;
                }
                /** 验证数据 */
                validate(oValue) {
                    if (ibas.objects.isNull(oValue)) {
                        return;
                    }
                    // 判断是否存在此值
                    if (!ibas.objects.isNull(this.enumType[oValue])) {
                        return;
                    }
                    for (let item in this.enumType) {
                        if (this.enumType[item] === oValue) {
                            return;
                        }
                    }
                    throw new TypeError(ibas.i18n.prop("openui5_data_value_type_error", ibas.objects.nameOf(this)));
                }
            }
            data.Enum = Enum;
            /**
             * 是否类型
             */
            class YesNo extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emYesNo,
                        describe: describe,
                    });
                }
                /**
                 * 格式化值到视图
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                formatValue(oValue, sInternalType) {
                    if (sInternalType === "boolean") {
                        return oValue === ibas.emYesNo.YES ? true : false;
                    }
                    else {
                        return super.formatValue(oValue, sInternalType);
                    }
                }
                /**
                 * 格式化值到模型
                 * @param oValue 值
                 * @param sInternalType 视图类型
                 */
                parseValue(oValue, sInternalType) {
                    if (typeof oValue === "boolean") {
                        return oValue === true ? ibas.emYesNo.YES : ibas.emYesNo.NO;
                    }
                    else {
                        return super.parseValue(oValue, sInternalType);
                    }
                }
            }
            data.YesNo = YesNo;
            /**
             * 单据状态类型
             */
            class DocumentStatus extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emDocumentStatus,
                        describe: describe,
                    });
                }
            }
            data.DocumentStatus = DocumentStatus;
            /**
             * 对象状态类型
             */
            class BOStatus extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emBOStatus,
                        describe: describe,
                    });
                }
            }
            data.BOStatus = BOStatus;
            /**
             * 审批状态类型
             */
            class ApprovalStatus extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emApprovalStatus,
                        describe: describe,
                    });
                }
            }
            data.ApprovalStatus = ApprovalStatus;
            /**
             * 审批结果类型
             */
            class ApprovalResult extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emApprovalResult,
                        describe: describe,
                    });
                }
            }
            data.ApprovalResult = ApprovalResult;
            /**
             * 审批步骤状态类型
             */
            class ApprovalStepStatus extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emApprovalStepStatus,
                        describe: describe,
                    });
                }
            }
            data.ApprovalStepStatus = ApprovalStepStatus;
            /**
             * 权限类型类型
             */
            class AuthoriseType extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emAuthoriseType,
                        describe: describe,
                    });
                }
            }
            data.AuthoriseType = AuthoriseType;
            /**
             * 条件操作类型
             */
            class ConditionOperation extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emConditionOperation,
                        describe: describe,
                    });
                }
            }
            data.ConditionOperation = ConditionOperation;
            /**
             * 条件关系类型
             */
            class ConditionRelationship extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emConditionRelationship,
                        describe: describe,
                    });
                }
            }
            data.ConditionRelationship = ConditionRelationship;
            /**
             * 排序方式类型
             */
            class SortType extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emSortType,
                        describe: describe,
                    });
                }
            }
            data.SortType = SortType;
            /**
             * 方向类型
             */
            class Direction extends Enum {
                /**
                 * 构造
                 * @param describe 使用描述，当true时，显示语言描述，但不能使用双向绑定
                 */
                constructor(describe) {
                    super({
                        enumType: ibas.emDirection,
                        describe: describe,
                    });
                }
            }
            data.Direction = Direction;
            class ValidatorItem {
                constructor(element, property) {
                    this.element = element;
                    this.property = property;
                }
                check() {
                    try {
                        this.error = null;
                        checkValueType.call(this.element, this.property);
                    }
                    catch (error) {
                        this.error = error;
                    }
                    return this.error ? false : true;
                }
            }
            function checkValueType(property) {
                let bindingInfo = this.getBindingInfo(property);
                if (bindingInfo && bindingInfo.parts instanceof Array) {
                    let pValue = this.getProperty(property);
                    for (let item of bindingInfo.parts) {
                        let type = item.type;
                        if (typeof type === "function") {
                            type = new type;
                        }
                        if (type instanceof Type) {
                            try {
                                type.validateValue(type.parseValue(pValue, typeof pValue));
                            }
                            catch (error) {
                                throw error;
                            }
                        }
                    }
                }
            }
            class Validator {
                constructor(elements, properties) {
                    this.properties = ibas.arrays.create(properties);
                    this.elements = ibas.arrays.create(elements);
                }
                validItems(elements) {
                    if (elements instanceof Array) {
                        for (let element of elements) {
                            if (element instanceof sap.m.InputBase) {
                                for (let property of this.properties) {
                                    let vItem = new ValidatorItem(element, property);
                                    if (!vItem.check()) {
                                        this.items.push(vItem);
                                        element.setValueState(sap.ui.core.ValueState.Error);
                                        element.setValueStateText(vItem.error.message);
                                    }
                                }
                            }
                            else if (element instanceof sap.ui.layout.DynamicSideContent) {
                                this.validItems(element.getMainContent());
                                this.validItems(element.getSideContent());
                            }
                            else if (element instanceof sap.m.Page) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.m.FlexBox) {
                                this.validItems(element.getItems());
                            }
                            else if (element instanceof sap.m.ListBase) {
                                this.validItems(element.getItems());
                            }
                            else if (element instanceof sap.m.Panel) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.m.Wizard) {
                                for (let item of element.getSteps()) {
                                    this.validItems(item.getContent());
                                }
                            }
                            else if (element instanceof sap.m.TabContainer) {
                                this.validItems(element.getItems());
                            }
                            else if (element instanceof sap.m.TabContainerItem) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.layout.BlockLayout) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.layout.FixFlex) {
                                this.validItems(element.getFixContent());
                            }
                            else if (element instanceof sap.ui.layout.Grid) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.layout.Splitter) {
                                this.validItems(element.getContentAreas());
                            }
                            else if (element instanceof sap.ui.layout.HorizontalLayout) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.layout.VerticalLayout) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.layout.cssgrid.CSSGrid) {
                                this.validItems(element.getItems());
                            }
                            else if (element instanceof sap.ui.layout.form.SimpleForm) {
                                this.validItems(element.getContent());
                            }
                            else if (element instanceof sap.ui.table.Table) {
                                for (let row of element.getRows()) {
                                    this.validItems(row.getCells());
                                }
                            }
                        }
                    }
                }
                getErrors() {
                    let errors = [];
                    if (this.items instanceof Array) {
                        for (let item of this.items) {
                            if (item.error) {
                                errors.push(item.error);
                            }
                        }
                    }
                    return errors;
                }
                valid() {
                    this.items = [];
                    this.validItems(this.elements);
                    if (this.items && this.items.length > 0) {
                        return false;
                    }
                    return true;
                }
            }
            data.Validator = Validator;
        })(data = extension.data || (extension.data = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let model;
        (function (model) {
            model.DATA_ROWS = "rows";
            /**
             * json模型
             */
            sap.ui.model.json.JSONModel.extend("sap.extension.model.JSONModel", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /**
                 * 设置数据
                 */
                setData(oData, bMerge) {
                    if (oData instanceof ibas.Bindable) {
                        oData.registerListener({
                            id: this.getId(),
                            propertyChanged: () => {
                                this.refresh(false);
                            }
                        });
                    }
                    else if (oData instanceof Array) {
                        for (let value of oData) {
                            if (value instanceof ibas.Bindable) {
                                value.registerListener({
                                    id: this.getId(),
                                    propertyChanged: () => {
                                        this.refresh(false);
                                    }
                                });
                            }
                        }
                    }
                    else if (oData instanceof Object) {
                        for (let item in oData) {
                            if (!item) {
                                continue;
                            }
                            let values = oData[item];
                            if (values instanceof ibas.Bindable) {
                                values.registerListener({
                                    id: this.getId(),
                                    propertyChanged: () => {
                                        this.refresh(false);
                                    }
                                });
                            }
                            else if (values instanceof Array) {
                                for (let value of values) {
                                    if (value instanceof ibas.Bindable) {
                                        value.registerListener({
                                            id: this.getId(),
                                            propertyChanged: () => {
                                                this.refresh(false);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    sap.ui.model.json.JSONModel.prototype.setData.apply(this, arguments);
                },
                /**
                 * 增加数据
                 * @param oData 数据
                 */
                addData(oData, path) {
                    let sData = this.getData();
                    if (ibas.strings.isEmpty(path)) {
                        // 空路径，默认使用row
                        if (!(sData instanceof Array)) {
                            sData = sData[model.DATA_ROWS];
                        }
                    }
                    else if (!ibas.strings.equals("/", path)) {
                        sData = sData[path];
                    }
                    if (sData === oData) {
                        // 同一个集合时，强行更新
                        this.refresh(false);
                    }
                    else if (sData instanceof Array) {
                        if (oData instanceof Array) {
                            for (let data of oData) {
                                if (data instanceof ibas.Bindable) {
                                    data.registerListener({
                                        id: this.getId(),
                                        propertyChanged: () => {
                                            this.refresh(false);
                                        }
                                    });
                                }
                                sData.push(data);
                            }
                        }
                        else {
                            if (oData instanceof ibas.Bindable) {
                                oData.registerListener({
                                    id: this.getId(),
                                    propertyChanged: () => {
                                        this.refresh(false);
                                    }
                                });
                            }
                            sData.push(oData);
                        }
                    }
                    else {
                        // 非集合
                        this.setData(oData);
                    }
                    this.refresh(false);
                },
                size() {
                    let sData = this.getData();
                    if (sData instanceof Array) {
                        return sData.length;
                    }
                    else if (sData[model.DATA_ROWS] instanceof Array) {
                        return sData[model.DATA_ROWS].length;
                    }
                    else if (!ibas.objects.isNull(sData)) {
                        return 1;
                    }
                    return 0;
                },
                /** 退出 */
                destroy() {
                    let data = this.getData();
                    if (data instanceof ibas.Bindable) {
                        data.removeListener(this.getId());
                    }
                    else if (data instanceof Array) {
                        for (let item of data) {
                            if (item instanceof ibas.Bindable) {
                                item.removeListener(this.getId());
                            }
                        }
                    }
                    else if (data instanceof Object) {
                        for (let item in data) {
                            if (!item) {
                                continue;
                            }
                            let values = data[item];
                            if (values instanceof ibas.Bindable) {
                                values.removeListener(this.getId());
                            }
                            else if (values instanceof Array) {
                                for (let value of values) {
                                    if (value instanceof ibas.Bindable) {
                                        value.removeListener(this.getId());
                                    }
                                }
                            }
                        }
                    }
                    sap.ui.model.json.JSONModel.prototype.destroy.apply(this, arguments);
                },
            });
        })(model = extension.model || (extension.model = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let core;
        (function (core) {
            /**
             * 控件
             */
            sap.ui.core.Control.extend("sap.extension.core.Control", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
            /**
             * 可编辑控件
             */
            core.Control.extend("sap.extension.core.EditableControl", {
                metadata: {
                    properties: {
                        /** 是否可编辑 */
                        editable: { type: "boolean", defaultValue: true },
                    },
                    events: {}
                },
                renderer: {},
            });
        })(core = extension.core || (extension.core = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 输入框
             */
            sap.m.Input.extend("sap.extension.m.Input", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                        /** 仅值选择，不可输入 */
                        valueHelpOnly: { type: "boolean", defaultValue: true },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Input.prototype.setValue.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setValue(value) {
                    return this.setBindingValue(value);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.Input.prototype.bindProperty.apply(this, arguments);
                    return this;
                },
                /** 重新点击 */
                ontap(oEvent) {
                    let control = oEvent ? oEvent.srcControl : null;
                    if (control instanceof sap.ui.core.Control && ibas.strings.isWith(control.getId(), undefined, "-vhi")) {
                        // 仅点击选择图标才调用，值选择
                        sap.m.Input.prototype.ontap.apply(this, arguments);
                    }
                    else {
                        // 不调用选值窗体
                        sap.m.InputBase.prototype.ontap.apply(this, arguments);
                    }
                },
                /** 初始化 */
                init() {
                    this.attachBrowserEvent("keydown", clearSelection);
                    sap.m.Input.prototype.init.apply(this, arguments);
                },
                exit() {
                    this.detachBrowserEvent("keydown", clearSelection);
                    sap.m.Input.prototype.exit.apply(this, arguments);
                }
            });
            // 但仅选择数据时，清除已选择值
            function clearSelection(event) {
                if (event.keyCode === 8 || event.keyCode === 46) {
                    // backspace key
                    if (event.currentTarget && event.currentTarget.id) {
                        let source = sap.ui.getCore().byId(event.currentTarget.id);
                        if (source instanceof m.Input) {
                            if (source.getShowValueHelp() && source.getValueHelpOnly()) {
                                source.setBindingValue(null);
                            }
                        }
                    }
                }
            }
            /**
             * 业务仓库数据-输入框
             */
            m.Input.extend("sap.extension.m.RepositoryInput", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取业务仓库实例
                 */
                getRepository() {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value) {
                    return this.setProperty("repository", extension.utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", extension.utils.dataInfo(value));
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setSelectedKey(value) {
                    return this.setBindingValue(value);
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setSelectedItem(value) {
                    sap.m.Input.prototype.setSelectedItem.apply(this, arguments);
                    if (value instanceof sap.ui.core.Item) {
                        this.setProperty("bindingValue", value.getKey());
                        this.setTooltip(ibas.strings.format("{0} - {1}", value.getKey(), value.getText()));
                    }
                    else {
                        this.destroyTooltip();
                    }
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setValue(value) {
                    sap.m.Input.prototype.setValue.apply(this, arguments);
                    return this;
                },
                /**
                 * 添加建议项目后，设置为显示建议项目
                 * @param oItem
                 */
                addSuggestionItem(oItem) {
                    m.Input.prototype.addSuggestionItem.apply(this, arguments);
                    if (!this.getShowSuggestion()) {
                        this.setShowSuggestion(true);
                    }
                    return this;
                },
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (this.getSelectedKey() !== value) {
                        this.setProperty("selectedKey", value);
                        this.setProperty("bindingValue", value);
                        let item;
                        if (ibas.strings.isEmpty(value)) {
                            this.updateDomValue("");
                        }
                        else if (!ibas.objects.isNull(item = this.getSuggestionItemByKey(String(value)))) {
                            this.setSelectedItem(item);
                            this.updateDomValue(item.getText());
                        }
                        else if (ibas.objects.isNull(item) && !ibas.strings.isEmpty(value)) {
                            // 没有此建议值
                            let dataInfo = this.getDataInfo();
                            if (ibas.objects.isNull(dataInfo)) {
                                return this;
                            }
                            let criteria = new ibas.Criteria();
                            criteria.noChilds = true;
                            for (let item of String(value).split(ibas.DATA_SEPARATOR)) {
                                let condition = criteria.conditions.create();
                                condition.alias = dataInfo.key;
                                condition.value = item;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                            let editable = false, enabled = false;
                            !this.getEditable() ? this.setEditable(true) : editable = true;
                            !this.getEnabled() ? this.setEnabled(true) : enabled = true;
                            extension.repository.batchFetch(this.getRepository(), this.getDataInfo(), criteria, (values) => {
                                if (values instanceof Error) {
                                    ibas.logger.log(values);
                                    let item = new sap.ui.core.ListItem("", {
                                        key: value,
                                        text: value,
                                    });
                                    this.addSuggestionItem(item);
                                    this.setSelectedItem(item);
                                    this.updateDomValue(item.getText());
                                }
                                else {
                                    let keyBudilder = new ibas.StringBuilder();
                                    keyBudilder.map(null, "");
                                    keyBudilder.map(undefined, "");
                                    let textBudilder = new ibas.StringBuilder();
                                    textBudilder.map(null, "");
                                    textBudilder.map(undefined, "");
                                    for (let item of values) {
                                        if (keyBudilder.length > 0) {
                                            keyBudilder.append(ibas.DATA_SEPARATOR);
                                        }
                                        if (textBudilder.length > 0) {
                                            textBudilder.append(ibas.DATA_SEPARATOR);
                                            textBudilder.append(" ");
                                        }
                                        keyBudilder.append(item.key);
                                        textBudilder.append(item.text);
                                    }
                                    let item = new sap.ui.core.ListItem("", {
                                        key: keyBudilder.toString(),
                                        text: textBudilder.toString(),
                                    });
                                    this.addSuggestionItem(item);
                                    this.setSelectedItem(item);
                                    this.updateDomValue(item.getText());
                                }
                                if (this.getEditable() && editable === false) {
                                    this.setEditable(editable);
                                }
                                if (this.getEnabled() && enabled === false) {
                                    this.setEnabled(enabled);
                                }
                            });
                        }
                    }
                    return this;
                }
            });
            /**
             * 业务仓库数据-选择输入框
             */
            m.RepositoryInput.extend("sap.extension.m.SelectionInput", {
                metadata: {
                    properties: {
                        /** 选择方式 */
                        chooseType: { type: "int", defaultValue: ibas.emChooseType.SINGLE },
                        /** 查询条件 */
                        criteria: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取选择类型
                 */
                getChooseType() {
                    return this.getProperty("chooseType");
                },
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value) {
                    return this.setProperty("chooseType", value);
                },
                /**
                 * 获取查询
                 */
                getCriteria() {
                    return this.getProperty("criteria");
                },
                /**
                 * 设置查询
                 * @param value 查询
                 */
                setCriteria(value) {
                    return this.setProperty("criteria", extension.utils.criteria(value));
                },
                /** 初始化 */
                init() {
                    // 调用基类构造
                    m.RepositoryInput.prototype.init.apply(this, arguments);
                    // 自身事件监听
                    this.attachValueHelpRequest(null, function (event) {
                        let that = event.getSource();
                        if (that instanceof m.SelectionInput) {
                            let boCode, dataInfo = that.getDataInfo();
                            if (typeof dataInfo.type === "function") {
                                boCode = dataInfo.type.BUSINESS_OBJECT_CODE;
                            }
                            else if (typeof dataInfo.type === "object") {
                                boCode = ibas.objects.typeOf(dataInfo.type).BUSINESS_OBJECT_CODE;
                            }
                            else if (typeof dataInfo.type === "string") {
                                boCode = ibas.config.applyVariables(dataInfo.type);
                            }
                            if (ibas.strings.isEmpty(boCode)) {
                                throw new Error(ibas.i18n.prop("sys_invalid_parameter", "boCode"));
                            }
                            ibas.servicesManager.runChooseService({
                                boCode: boCode,
                                chooseType: that.getChooseType(),
                                criteria: that.getCriteria(),
                                onCompleted: (selecteds) => {
                                    let keyProperty = that.getDataInfo().key;
                                    let textProperty = that.getDataInfo().text;
                                    let keyBudilder = new ibas.StringBuilder();
                                    keyBudilder.map(null, "");
                                    keyBudilder.map(undefined, "");
                                    let textBudilder = new ibas.StringBuilder();
                                    textBudilder.map(null, "");
                                    textBudilder.map(undefined, "");
                                    for (let item of selecteds) {
                                        if (keyBudilder.length > 0) {
                                            keyBudilder.append(ibas.DATA_SEPARATOR);
                                        }
                                        if (textBudilder.length > 0) {
                                            textBudilder.append(ibas.DATA_SEPARATOR);
                                            textBudilder.append(" ");
                                        }
                                        keyBudilder.append(item[keyProperty]);
                                        textBudilder.append(item[textProperty]);
                                    }
                                    let item = new sap.ui.core.ListItem("", {
                                        key: keyBudilder.toString(),
                                        text: textBudilder.toString(),
                                    });
                                    that.addSuggestionItem(item);
                                    that.setSelectedItem(item);
                                    that.updateDomValue(item.getText());
                                    that = null;
                                }
                            });
                        }
                    });
                }
            });
            /**
             * 超级文本框
             */
            sap.m.TextArea.extend("sap.extension.m.TextArea", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.TextArea.prototype.setValue.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setValue(value) {
                    return this.setBindingValue(value);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.TextArea.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 用户数据-输入框
             */
            m.SelectionInput.extend("sap.extension.m.UserInput", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.SelectionInput.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.UserInput, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.UserInput, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let criteria = this.getCriteria();
                    if (ibas.objects.isNull(criteria)) {
                        criteria = extension.variables.get(m.UserInput, "criteria");
                        if (ibas.objects.isNull(criteria)) {
                            criteria = [
                                new ibas.Condition("Activated", ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES.toString())
                            ];
                            extension.variables.set(criteria, m.UserInput, "criteria");
                        }
                        this.setCriteria(criteria);
                    }
                    return this;
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    if (ibas.strings.equals(sName, "bindingValue") && !ibas.objects.isNull(oBindingInfo)) {
                        // 构建数据信息，根据绑定的数据类型
                        let dataInfo = this.getDataInfo();
                        if (ibas.objects.isNull(dataInfo)) {
                            let infoName = "dataInfoCode", infoKey = "Code";
                            // 允许多选或绑定类型为数值型时，使用DocEntry
                            if (this.getChooseType() === ibas.emChooseType.MULTIPLE
                                || oBindingInfo.type instanceof extension.data.Numeric) {
                                infoName = "dataInfo_DocEntry";
                                infoKey = "DocEntry";
                            }
                            dataInfo = extension.variables.get(m.UserInput, infoName);
                            if (ibas.objects.isNull(dataInfo)) {
                                dataInfo = {
                                    type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER")),
                                    key: infoKey,
                                    text: "Name",
                                };
                                extension.variables.set(dataInfo, m.UserInput, infoName);
                            }
                            this.setDataInfo(dataInfo);
                        }
                        else {
                            if (!dataInfo.type) {
                                dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER"));
                            }
                            else if (!dataInfo.key) {
                                dataInfo.key = oBindingInfo.type instanceof extension.data.Numeric ? "DocEntry" : "Code";
                            }
                            else if (!dataInfo.text) {
                                dataInfo.text = "Name";
                            }
                        }
                    }
                    m.SelectionInput.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 组织数据-输入框
             */
            m.SelectionInput.extend("sap.extension.m.OrganizationInput", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.SelectionInput.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.OrganizationInput, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.OrganizationInput, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.OrganizationInput, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION")),
                                key: "Code",
                                text: "Name",
                            };
                            extension.variables.set(dataInfo, m.OrganizationInput, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Name";
                        }
                    }
                    let criteria = this.getCriteria();
                    if (ibas.objects.isNull(criteria)) {
                        criteria = extension.variables.get(m.OrganizationInput, "criteria");
                        if (ibas.objects.isNull(criteria)) {
                            criteria = [
                                new ibas.Condition("Activated", ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES.toString())
                            ];
                            extension.variables.set(criteria, m.OrganizationInput, "criteria");
                        }
                        this.setCriteria(criteria);
                    }
                    return this;
                }
            });
            /**
             * 角色数据-输入框
             */
            m.OrganizationInput.extend("sap.extension.m.RoleInput", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    // todo:角色非组织实现时
                    m.OrganizationInput.prototype.applySettings.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 业务对象数据-输入框
             */
            m.SelectionInput.extend("sap.extension.m.BusinessObjectInput", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.SelectionInput.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.BusinessObjectInput, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.BusinessObjectInput, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.BusinessObjectInput, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO")),
                                key: "Code",
                                text: "Description"
                            };
                            extension.variables.set(dataInfo, m.BusinessObjectInput, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Description";
                        }
                    }
                    return this;
                }
            });
            /**
             * 图标-输入框
             */
            m.Input.extend("sap.extension.m.IconInput", {
                metadata: {
                    properties: {
                        /** 显示选择钮 */
                        showValueHelp: { type: "boolean", defaultValue: true },
                    },
                    aggregations: {},
                    events: {}
                },
                renderer: {},
                /** 初始化 */
                init() {
                    // 调用基类构造
                    m.Input.prototype.init.apply(this, arguments);
                    // 自身事件监听
                    this.attachValueHelpRequest(null, function (event) {
                        let that = event.getSource();
                        if (that instanceof m.IconInput) {
                            let selectDialog = new sap.m.SelectDialog("", {
                                title: ibas.i18n.prop("openui5_please_select_icon"),
                                items: {
                                    path: "/",
                                    template: new sap.m.StandardListItem("", {
                                        title: {
                                            path: "name",
                                        },
                                        icon: {
                                            path: "name",
                                        }
                                    })
                                },
                                search: function (event) {
                                    let source = event.getSource();
                                    if (source instanceof sap.m.SelectDialog) {
                                        let oBinding = source.getBinding("items");
                                        if (oBinding instanceof sap.ui.model.json.JSONListBinding) {
                                            let value = event.getParameter("value");
                                            oBinding.filter([
                                                new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, value)
                                            ]);
                                        }
                                    }
                                },
                                confirm(event) {
                                    let value = event.getParameter("selectedItem").getTitle();
                                    that.setBindingValue(value);
                                    setTimeout(() => {
                                        selectDialog.destroy();
                                        selectDialog = undefined;
                                        that = undefined;
                                    }, 5);
                                },
                                cancel() {
                                    setTimeout(() => {
                                        selectDialog.destroy();
                                        selectDialog = undefined;
                                        that = undefined;
                                    }, 5);
                                }
                            });
                            let icons = new ibas.ArrayList();
                            for (let item of sap.ui.core.IconPool.getIconNames(undefined)) {
                                icons.add({
                                    name: ibas.strings.format("sap-icon://{0}", item)
                                });
                            }
                            selectDialog.setModel(new sap.ui.model.json.JSONModel(icons));
                            selectDialog.open(undefined);
                        }
                    });
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    m.Input.prototype.setBindingValue.apply(this, arguments);
                    if (ibas.strings.isWith(value, "sap-icon://", undefined)) {
                        let icon = this.getAggregation("_beginIcon", undefined);
                        if (icon instanceof Array && icon.length > 0) {
                            icon = icon[0];
                            if (icon instanceof sap.ui.core.Icon) {
                                icon.setSrc(value);
                            }
                        }
                        else {
                            icon = this.addBeginIcon(value);
                        }
                    }
                    return this;
                },
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 选择框
             */
            sap.m.Select.extend("sap.extension.m.Select", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Select.prototype.setSelectedKey.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /** 重写此方法，设置选中值 */
                setSelection(value) {
                    sap.m.Select.prototype.setSelection.apply(this, arguments);
                    this.setProperty("bindingValue", this.getSelectedKey());
                    return this;
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.Select.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 枚举数据-选择框
             */
            m.Select.extend("sap.extension.m.EnumSelect", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取枚举类型
                 */
                getEnumType() {
                    return this.getProperty("enumType");
                },
                /**
                 * 设置枚举类型
                 * @param value 枚举类型
                 */
                setEnumType(value) {
                    return this.setProperty("enumType", value);
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    return m.Select.prototype.setBindingValue.apply(this, arguments);
                },
                /** 重构设置 */
                applySettings() {
                    m.Select.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.loadItems();
                    }
                    return this;
                },
                /**
                 * 加载可选值
                 */
                loadItems() {
                    this.destroyItems();
                    let enumType = this.getEnumType();
                    if (ibas.objects.isNull(enumType)) {
                        return this;
                    }
                    for (let item in enumType) {
                        if (ibas.objects.isNull(item)) {
                            continue;
                        }
                        let key = item;
                        let text = enumType[key];
                        if (typeof key !== "string" || typeof text !== "string") {
                            continue;
                        }
                        if (!isNaN(Number(key))) {
                            key = Number(key);
                        }
                        this.addItem(new sap.ui.core.ListItem("", {
                            key: key,
                            text: ibas.enums.describe(enumType, key),
                            additionalText: text
                        }));
                    }
                    return this;
                }
            });
            /**
             * 业务仓库数据-选择框
             */
            m.Select.extend("sap.extension.m.RepositorySelect", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 查询条件 */
                        criteria: { type: "any" },
                        /** 空白数据 */
                        blankData: { type: "any", defaultValue: {} },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取业务仓库实例
                 */
                getRepository() {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value) {
                    return this.setProperty("repository", extension.utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", extension.utils.dataInfo(value));
                },
                /**
                 * 获取查询
                 */
                getCriteria() {
                    return this.getProperty("criteria");
                },
                /**
                 * 设置查询
                 * @param value 查询
                 */
                setCriteria(value) {
                    return this.setProperty("criteria", extension.utils.criteria(value));
                },
                /**
                 * 获取空白数据
                 */
                getBlankData() {
                    return this.getProperty("blankData");
                },
                /**
                 * 设置空白数据（未设置使用默认，无效值则为不使用）
                 * @param value 空白数据；undefined表示不使用
                 */
                setBlankData(value) {
                    return this.setProperty("blankData", value);
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    return m.Select.prototype.setBindingValue.apply(this, arguments);
                },
                /** 重构设置 */
                applySettings() {
                    m.Select.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.loadItems();
                    }
                    return this;
                },
                /**
                 * 加载可选值
                 */
                loadItems() {
                    this.destroyItems();
                    extension.repository.fetch(this.getRepository(), this.getDataInfo(), this.getCriteria(), (values) => {
                        if (values instanceof Error) {
                            ibas.logger.log(values);
                        }
                        else {
                            let blankData = this.getBlankData();
                            if (blankData !== false && !ibas.objects.isNull(blankData)) {
                                if (!blankData.key) {
                                    blankData.key = "";
                                }
                                if (!blankData.text) {
                                    blankData.text = ibas.i18n.prop("openui5_please_select_data");
                                }
                                this.addItem(new sap.ui.core.ListItem("", {
                                    key: blankData.key,
                                    text: blankData.text
                                }));
                            }
                            for (let item of values) {
                                this.addItem(new sap.ui.core.ListItem("", {
                                    key: item.key,
                                    text: item.text
                                }));
                            }
                            if (this.getItems().length > 0) {
                                if (!ibas.strings.isEmpty(this.getSelectedKey())) {
                                }
                                else {
                                    this.setSelectedItem(this.getFirstItem());
                                }
                            }
                        }
                    });
                    return this;
                }
            });
            /**
             * 对象属性可选值-选择框
             */
            m.Select.extend("sap.extension.m.PropertySelect", {
                metadata: {
                    properties: {
                        /** 对象数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性名称 */
                        propertyName: { type: "string" },
                        /** 空白数据 */
                        blankData: { type: "any", defaultValue: { key: "", text: ibas.i18n.prop("openui5_please_select_data") } },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性名称
                 */
                getPropertyName() {
                    return this.getProperty("propertyName");
                },
                /**
                 * 设置属性名称
                 * @param value 属性名称
                 */
                setPropertyName(value) {
                    return this.setProperty("propertyName", value);
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    return m.Select.prototype.setBindingValue.apply(this, arguments);
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    m.Select.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.loadItems();
                    }
                    return this;
                },
                /**
                 * 加载可选值
                 */
                loadItems() {
                    let boInfo = this.getDataInfo();
                    if (typeof boInfo === "string") {
                        boInfo = {
                            code: boInfo,
                            name: undefined,
                        };
                    }
                    else if (typeof boInfo === "function") {
                        boInfo = {
                            code: ibas.objects.typeOf(boInfo).BUSINESS_OBJECT_CODE,
                            name: undefined,
                        };
                    }
                    if (!boInfo || !boInfo.code) {
                        return this;
                    }
                    let propertyName = this.getPropertyName();
                    if (ibas.strings.isEmpty(propertyName)) {
                        // 未设置属性则使用绑定的
                        propertyName = this.getBindingPath("bindingValue");
                    }
                    if (ibas.strings.isEmpty(propertyName)) {
                        return this;
                    }
                    let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                    boRepository.fetchBOInfos({
                        boCode: ibas.config.applyVariables(boInfo.code),
                        boName: boInfo.name,
                        onCompleted: (opRslt) => {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let boName;
                                if (propertyName.indexOf(".") > 0) {
                                    // 属性带路径，则取名称
                                    boName = propertyName.split(".")[0];
                                }
                                for (let data of opRslt.resultObjects) {
                                    if (boName && !ibas.strings.equalsIgnoreCase(data.name, boName)) {
                                        continue;
                                    }
                                    this.addItem(new sap.ui.core.ListItem("", {
                                        key: "",
                                        text: ibas.i18n.prop("openui5_please_select_data")
                                    }));
                                    for (let property of data.properties) {
                                        if (ibas.strings.equalsIgnoreCase(propertyName, property.property)) {
                                            if (property.values instanceof Array) {
                                                for (let item of property.values) {
                                                    this.addItem(new sap.ui.core.ListItem("", {
                                                        key: item.value,
                                                        text: item.description
                                                    }));
                                                }
                                            }
                                        }
                                    }
                                    return;
                                }
                            }
                            catch (error) {
                                ibas.logger.log(error);
                            }
                        }
                    });
                    return this;
                }
            });
            /**
             * 对象服务系列-选择框
             */
            m.Select.extend("sap.extension.m.SeriesSelect", {
                metadata: {
                    properties: {
                        /** 对象编码 */
                        objectCode: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取对象编码
                 */
                getObjectCode() {
                    return this.getProperty("objectCode");
                },
                /**
                 * 设置对象编码
                 * @param value 对象编码
                 */
                setObjectCode(value) {
                    return this.setProperty("objectCode", ibas.config.applyVariables(value));
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    // 修正-1值
                    if (ibas.strings.equals(value, "-1")) {
                        value = "0";
                    }
                    return m.Select.prototype.setBindingValue.apply(this, arguments);
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (mSettings && mSettings.objectCode) {
                        mSettings.objectCode = ibas.config.applyVariables(mSettings.objectCode);
                    }
                    m.Select.prototype.applySettings.apply(this, arguments);
                    if (this.getItems().length === 0) {
                        this.loadItems();
                    }
                    return this;
                },
                /**
                 * 加载可选值
                 */
                loadItems() {
                    this.destroyItems();
                    let objectCode = this.getObjectCode();
                    if (ibas.strings.isEmpty(objectCode)) {
                        return this;
                    }
                    let boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                    let dataInfo = {
                        type: "BOSeriesNumbering",
                        key: "Series",
                        text: "SeriesName",
                    };
                    let criteria = new ibas.Criteria();
                    let condition = criteria.conditions.create();
                    condition.alias = "ObjectCode";
                    condition.value = objectCode;
                    condition = criteria.conditions.create();
                    condition.alias = "Locked";
                    condition.value = ibas.emYesNo.NO.toString();
                    let sort = criteria.sorts.create();
                    sort.alias = "Series";
                    sort.sortType = ibas.emSortType.DESCENDING;
                    extension.repository.fetch(boRepository, dataInfo, criteria, (values) => {
                        this.addItem(new sap.ui.core.ListItem("", {
                            key: 0,
                            text: ibas.i18n.prop("openui5_manual_series")
                        }));
                        if (values instanceof Error) {
                            ibas.logger.log(values);
                        }
                        else {
                            for (let item of values) {
                                this.addItem(new sap.ui.core.ListItem("", {
                                    key: item.key,
                                    text: item.text
                                }));
                            }
                            if (this.getItems().length > 0) {
                                if (!ibas.strings.isEmpty(this.getSelectedKey())) {
                                }
                                else {
                                    this.setSelectedItem(this.getFirstItem());
                                }
                            }
                        }
                    });
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 文本框
             */
            sap.m.Text.extend("sap.extension.m.Text", {
                metadata: {
                    properties: {
                        /** 是否换行 */
                        wrapping: { type: "boolean", defaultValue: false },
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Text.prototype.setText.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setText(value) {
                    return sap.m.Text.prototype.setText.apply(this, arguments);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.Text.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 业务仓库数据-文本框
             */
            m.Text.extend("sap.extension.m.RepositoryText", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取业务仓库实例
                 */
                getRepository() {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value) {
                    return this.setProperty("repository", extension.utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", extension.utils.dataInfo(value));
                },
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (this.getBindingValue() !== value) {
                        m.Text.prototype.setBindingValue.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let dataInfo = this.getDataInfo();
                            if (ibas.objects.isNull(dataInfo)) {
                                return this;
                            }
                            let criteria = new ibas.Criteria();
                            criteria.noChilds = true;
                            for (let item of String(value).split(ibas.DATA_SEPARATOR)) {
                                let condition = criteria.conditions.create();
                                condition.alias = dataInfo.key;
                                condition.value = item;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                            extension.repository.batchFetch(this.getRepository(), this.getDataInfo(), criteria, (values) => {
                                if (values instanceof Error) {
                                    ibas.logger.log(values);
                                }
                                else {
                                    let keyBudilder = new ibas.StringBuilder();
                                    keyBudilder.map(null, "");
                                    keyBudilder.map(undefined, "");
                                    let textBudilder = new ibas.StringBuilder();
                                    textBudilder.map(null, "");
                                    textBudilder.map(undefined, "");
                                    for (let item of values) {
                                        if (keyBudilder.length > 0) {
                                            keyBudilder.append(ibas.DATA_SEPARATOR);
                                        }
                                        if (textBudilder.length > 0) {
                                            textBudilder.append(ibas.DATA_SEPARATOR);
                                            textBudilder.append(" ");
                                        }
                                        keyBudilder.append(item.key);
                                        textBudilder.append(item.text);
                                    }
                                    this.setText(textBudilder.toString());
                                }
                            });
                        }
                    }
                    return this;
                },
            });
            /**
             * 对象属性可选值-文本框
             */
            m.Text.extend("sap.extension.m.PropertyText", {
                metadata: {
                    properties: {
                        /** 对象数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性名称 */
                        propertyName: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性名称
                 */
                getPropertyName() {
                    return this.getProperty("propertyName");
                },
                /**
                 * 设置属性名称
                 * @param value 属性名称
                 */
                setPropertyName(value) {
                    return this.setProperty("propertyName", value);
                },
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (this.getBindingValue() !== value) {
                        m.Text.prototype.setBindingValue.apply(this, arguments);
                        if (ibas.strings.isEmpty(value)) {
                            return this;
                        }
                        let boInfo = this.getDataInfo();
                        if (typeof boInfo === "string") {
                            boInfo = {
                                code: boInfo,
                                name: undefined,
                            };
                        }
                        else if (typeof boInfo === "function") {
                            boInfo = {
                                code: ibas.objects.typeOf(boInfo).BUSINESS_OBJECT_CODE,
                                name: undefined,
                            };
                        }
                        if (!boInfo || !boInfo.code) {
                            return this;
                        }
                        let propertyName = this.getPropertyName();
                        if (ibas.strings.isEmpty(propertyName)) {
                            // 未设置属性则使用绑定的
                            propertyName = this.getBindingPath("bindingValue");
                        }
                        if (ibas.strings.isEmpty(propertyName)) {
                            return this;
                        }
                        let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                        boRepository.fetchBOInfos({
                            boCode: ibas.config.applyVariables(boInfo.code),
                            boName: boInfo.name,
                            onCompleted: (opRslt) => {
                                try {
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    let boName;
                                    if (propertyName.indexOf(".") > 0) {
                                        // 属性带路径，则取名称
                                        boName = propertyName.split(".")[0];
                                    }
                                    for (let data of opRslt.resultObjects) {
                                        if (boName && !ibas.strings.equalsIgnoreCase(data.name, boName)) {
                                            continue;
                                        }
                                        for (let property of data.properties) {
                                            if (ibas.strings.equalsIgnoreCase(propertyName, property.property)) {
                                                if (property.values instanceof Array) {
                                                    for (let item of property.values) {
                                                        if (ibas.strings.equals(item.value, value)) {
                                                            this.setText(item.description);
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        return;
                                    }
                                }
                                catch (error) {
                                    ibas.logger.log(error);
                                }
                            }
                        });
                    }
                },
            });
            /**
             * 数据转换-文本框
             */
            m.Text.extend("sap.extension.m.ConversionText", {
                metadata: {
                    properties: {},
                    events: {
                        "convert": {
                            parameters: {
                                value: {
                                    type: "string",
                                },
                                done: {
                                    type: "function",
                                },
                                bindingData: {
                                    type: "any",
                                }
                            }
                        },
                    },
                },
                renderer: {},
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (this.getBindingValue() !== value) {
                        m.Text.prototype.setBindingValue.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let done = (newValue) => {
                                this.setText(newValue);
                            };
                            let bindingData = this.getBindingContext().getObject();
                            this.fireConvert({
                                value: value,
                                done: done,
                                bindingData: bindingData,
                            });
                        }
                    }
                    return this;
                }
            });
            /**
             * 用户数据-文本框
             */
            m.RepositoryText.extend("sap.extension.m.UserText", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryText.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.UserText, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.UserText, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.UserText, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER")),
                                key: "DocEntry",
                                text: "Name",
                            };
                            extension.variables.set(dataInfo, m.UserText, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "DocEntry";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Name";
                        }
                    }
                    return this;
                }
            });
            /**
             * 组织数据-文本框
             */
            m.RepositoryText.extend("sap.extension.m.OrganizationText", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryText.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.OrganizationText, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.OrganizationText, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.OrganizationText, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION")),
                                key: "Code",
                                text: "Name",
                            };
                            extension.variables.set(dataInfo, m.OrganizationText, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Name";
                        }
                    }
                    return this;
                }
            });
            /**
             * 角色数据-文本框
             */
            m.OrganizationText.extend("sap.extension.m.RoleText", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.OrganizationText.prototype.applySettings.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 业务对象数据-文本框
             */
            m.RepositoryText.extend("sap.extension.m.BusinessObjectText", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryText.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.BusinessObjectText, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.BusinessObjectText, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.BusinessObjectText, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO")),
                                key: "Code",
                                text: "Description",
                            };
                            extension.variables.set(dataInfo, m.BusinessObjectText, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Description";
                        }
                    }
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 链接框
             */
            sap.m.Link.extend("sap.extension.m.Link", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Link.prototype.setText.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setText(value) {
                    return sap.m.Link.prototype.setText.apply(this, arguments);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.Link.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 数据链接框
             */
            m.Link.extend("sap.extension.m.DataLink", {
                metadata: {
                    properties: {
                        /** 对象编码 */
                        objectCode: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取对象编码
                 */
                getObjectCode() {
                    return this.getProperty("objectCode");
                },
                /**
                 * 设置对象编码
                 * @param value 对象编码
                 */
                setObjectCode(value) {
                    return this.setProperty("objectCode", ibas.config.applyVariables(value));
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (mSettings && mSettings.objectCode) {
                        mSettings.objectCode = ibas.config.applyVariables(mSettings.objectCode);
                    }
                    m.Link.prototype.applySettings.apply(this, arguments);
                    return this;
                },
                /** 初始化 */
                init() {
                    // 调用基类构造
                    m.Link.prototype.init.apply(this, arguments);
                    // 监听事件
                    this.attachPress(undefined, function (event) {
                        let source = event.getSource();
                        if (source instanceof m.DataLink) {
                            let objectCode = source.getObjectCode();
                            let value = source.getBindingValue();
                            if (ibas.strings.isEmpty(objectCode) || ibas.strings.isEmpty(value)) {
                                return;
                            }
                            ibas.servicesManager.runLinkService({
                                boCode: objectCode,
                                linkValue: value
                            });
                        }
                    });
                }
            });
            /**
             * 业务仓库数据-连接框
             */
            m.DataLink.extend("sap.extension.m.RepositoryLink", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取业务仓库实例
                 */
                getRepository() {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value) {
                    return this.setProperty("repository", extension.utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", extension.utils.dataInfo(value));
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (this.getBindingValue() !== value) {
                        m.DataLink.prototype.setBindingValue.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let dataInfo = this.getDataInfo();
                            if (ibas.objects.isNull(dataInfo)) {
                                return this;
                            }
                            let criteria = new ibas.Criteria();
                            for (let item of String(value).split(ibas.DATA_SEPARATOR)) {
                                let condition = criteria.conditions.create();
                                condition.alias = dataInfo.key;
                                condition.value = item;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                            extension.repository.batchFetch(this.getRepository(), this.getDataInfo(), criteria, (values) => {
                                if (values instanceof Error) {
                                    ibas.logger.log(values);
                                }
                                else {
                                    let keyBudilder = new ibas.StringBuilder();
                                    keyBudilder.map(null, "");
                                    keyBudilder.map(undefined, "");
                                    let textBudilder = new ibas.StringBuilder();
                                    textBudilder.map(null, "");
                                    textBudilder.map(undefined, "");
                                    for (let item of values) {
                                        if (keyBudilder.length > 0) {
                                            keyBudilder.append(ibas.DATA_SEPARATOR);
                                        }
                                        if (textBudilder.length > 0) {
                                            textBudilder.append(ibas.DATA_SEPARATOR);
                                            textBudilder.append(" ");
                                        }
                                        keyBudilder.append(item.key);
                                        textBudilder.append(item.text);
                                    }
                                    this.setText(textBudilder.toString());
                                }
                            });
                        }
                    }
                    return this;
                },
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /** 改变表格选择风格 */
            function changeSelectionStyle(event) {
                if (!(this instanceof sap.m.ListBase)) {
                    return;
                }
                let selected = event.getParameter("selected");
                let item = event.getParameter("listItem");
                if (selected === true) {
                    this.removeSelections(true);
                    this.setSelectedItem(item, true);
                }
            }
            m.changeSelectionStyle = changeSelectionStyle;
            /**
             * 获取可视行数
             * @param defalutCount 默认值（未配置返回）
             */
            function visibleRowCount(count) {
                return ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, count);
            }
            m.visibleRowCount = visibleRowCount;
            /**
             * 列表
             */
            sap.m.List.extend("sap.extension.m.List", {
                metadata: {
                    properties: {
                        /** 选择方式 */
                        chooseType: { type: "int", defaultValue: ibas.emChooseType.MULTIPLE },
                    },
                    events: {
                        "nextDataSet": {
                            parameters: {
                                data: {
                                    type: "any",
                                }
                            }
                        }
                    }
                },
                renderer: {},
                /**
                 * 获取选择类型
                 */
                getChooseType() {
                    return this.getProperty("chooseType");
                },
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value) {
                    this.detachSelectionChange(changeSelectionStyle);
                    if (value === ibas.emChooseType.SINGLE) {
                        this.setMode(sap.m.ListMode.MultiSelect);
                        this.attachSelectionChange(undefined, changeSelectionStyle);
                    }
                    else if (value === ibas.emChooseType.MULTIPLE) {
                        this.setMode(sap.m.ListMode.MultiSelect);
                    }
                    else {
                        this.setMode(sap.m.ListMode.None);
                    }
                    return this.setProperty("chooseType", value);
                },
                /**
                 * 获取选择的数据
                 */
                getSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    if (this.getMode() === sap.m.ListMode.None) {
                        let item = this.getSwipedItem();
                        if (!ibas.objects.isNull(item)) {
                            selecteds.push(item.getBindingContext().getObject());
                        }
                    }
                    else {
                        for (let item of this.getSelectedContexts(undefined)) {
                            selecteds.push(item.getObject());
                        }
                    }
                    return selecteds;
                },
                /**
                 * 获取未选择的数据
                 */
                getUnSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    for (let item of this.getItems()) {
                        selecteds.push(item.getBindingContext().getObject());
                    }
                    if (this.getMode() === sap.m.ListMode.None) {
                        if (!ibas.objects.isNull(this.getSwipedItem())) {
                            selecteds.remove(this.getSwipedItem().getBindingContext().getObject());
                        }
                    }
                    else {
                        for (let item of this.getSelectedContexts(undefined)) {
                            selecteds.remove(item.getObject());
                        }
                    }
                    return selecteds;
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (!mSettings.includeItemInSelection) {
                        mSettings.includeItemInSelection = true;
                    }
                    if (!mSettings.growing) {
                        mSettings.growing = true;
                    }
                    if (!mSettings.growingScrollToLoad) {
                        mSettings.growingScrollToLoad = true;
                    }
                    sap.m.List.prototype.applySettings.apply(this, arguments);
                    return this;
                },
                init() {
                    // 基类初始化
                    sap.m.List.prototype.init.apply(this, arguments);
                    // 监听行变化事件
                    this.attachEvent("updateFinished", undefined, () => {
                        if (this.getBusy()) {
                            // 忙状态不监听
                            return;
                        }
                        let model = this.getModel(undefined);
                        if (!ibas.objects.isNull(model)) {
                            let data = model.getData();
                            if (!ibas.objects.isNull(data) && !ibas.objects.isNull(this.getGrowingInfo())) {
                                if (this.getGrowingInfo().total === this.getGrowingInfo().actual) {
                                    if (!ibas.objects.isNull(data)) {
                                        let modelData = data.rows; // 与绑定对象的路径有关
                                        let dataCount = modelData instanceof Array ? modelData.length : 0;
                                        let visibleRow = this.getGrowingThreshold(); // 当前显示条数
                                        if (dataCount <= 0 || dataCount < visibleRow) {
                                            return;
                                        }
                                        // 调用事件
                                        this.setBusy(true);
                                        this.fireNextDataSet({ data: modelData[modelData.length - 1] });
                                    }
                                }
                            }
                        }
                    });
                },
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.m.List.prototype.exit.apply(this, arguments);
                }
            });
        })(m = extension.m || (extension.m = {}));
        let f;
        (function (f) {
            /**
             * 列表
             */
            sap.f.GridList.extend("sap.extension.f.GridList", {
                metadata: {
                    properties: {
                        /** 选择方式 */
                        chooseType: { type: "int", defaultValue: ibas.emChooseType.MULTIPLE },
                    },
                    events: {
                        "nextDataSet": {
                            parameters: {
                                data: {
                                    type: "any",
                                }
                            }
                        }
                    }
                },
                renderer: {},
                /**
                 * 获取选择类型
                 */
                getChooseType() {
                    return this.getProperty("chooseType");
                },
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value) {
                    this.detachSelectionChange(m.changeSelectionStyle);
                    if (value === ibas.emChooseType.SINGLE) {
                        this.setMode(sap.m.ListMode.MultiSelect);
                        this.attachSelectionChange(undefined, m.changeSelectionStyle);
                    }
                    else if (value === ibas.emChooseType.MULTIPLE) {
                        this.setMode(sap.m.ListMode.MultiSelect);
                    }
                    else {
                        this.setMode(sap.m.ListMode.None);
                    }
                    return this.setProperty("chooseType", value);
                },
                /**
                 * 获取选择的数据
                 */
                getSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    if (this.getMode() === sap.m.ListMode.None) {
                        let item = this.getSwipedItem();
                        if (!ibas.objects.isNull(item)) {
                            selecteds.push(item.getBindingContext().getObject());
                        }
                    }
                    else {
                        for (let item of this.getSelectedContexts(undefined)) {
                            selecteds.push(item.getObject());
                        }
                    }
                    return selecteds;
                },
                /**
                 * 获取未选择的数据
                 */
                getUnSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    for (let item of this.getItems()) {
                        selecteds.push(item.getBindingContext().getObject());
                    }
                    if (this.getMode() === sap.m.ListMode.None) {
                        if (!ibas.objects.isNull(this.getSwipedItem())) {
                            selecteds.remove(this.getSwipedItem().getBindingContext().getObject());
                        }
                    }
                    else {
                        for (let item of this.getSelectedContexts(undefined)) {
                            selecteds.remove(item.getObject());
                        }
                    }
                    return selecteds;
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (!mSettings.includeItemInSelection) {
                        mSettings.includeItemInSelection = true;
                    }
                    if (!mSettings.growing) {
                        mSettings.growing = true;
                    }
                    if (!mSettings.growingScrollToLoad) {
                        mSettings.growingScrollToLoad = true;
                    }
                    sap.f.GridList.prototype.applySettings.apply(this, arguments);
                    return this;
                },
                init() {
                    // 基类初始化
                    sap.f.GridList.prototype.init.apply(this, arguments);
                    // 监听行变化事件
                    this.attachEvent("updateFinished", undefined, () => {
                        if (this.getBusy()) {
                            // 忙状态不监听
                            return;
                        }
                        let model = this.getModel(undefined);
                        if (!ibas.objects.isNull(model)) {
                            let data = model.getData();
                            if (!ibas.objects.isNull(data) && !ibas.objects.isNull(this.getGrowingInfo())) {
                                if (this.getGrowingInfo().total === this.getGrowingInfo().actual) {
                                    if (!ibas.objects.isNull(data)) {
                                        let modelData = data.rows; // 与绑定对象的路径有关
                                        let dataCount = modelData instanceof Array ? modelData.length : 0;
                                        let visibleRow = this.getGrowingThreshold(); // 当前显示条数
                                        if (dataCount <= 0 || dataCount < visibleRow) {
                                            return;
                                        }
                                        // 调用事件
                                        this.setBusy(true);
                                        this.fireNextDataSet({ data: modelData[modelData.length - 1] });
                                    }
                                }
                            }
                        }
                    });
                },
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.m.List.prototype.exit.apply(this, arguments);
                }
            });
            if (sap.f.GridListItem) {
                sap.f.GridListItem.extend("sap.extension.f.GridListItem", {
                    metadata: {
                        properties: {},
                        events: {}
                    },
                    renderer: {},
                });
            }
        })(f = extension.f || (extension.f = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 复选框
             */
            sap.m.CheckBox.extend("sap.extension.m.CheckBox", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "boolean" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.CheckBox.prototype.setSelected.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setSelected(value) {
                    return this.setBindingValue(value);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.CheckBox.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 下拉框
             */
            sap.m.ComboBox.extend("sap.extension.m.ComboBox", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Select.prototype.setSelectedKey.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /** 重写此方法，设置选中值 */
                setSelection(value) {
                    sap.m.ComboBox.prototype.setSelection.apply(this, arguments);
                    this.setProperty("bindingValue", this.getSelectedKey());
                    return this;
                },
                /**
                 * 销毁可选项
                 */
                destroyItems() {
                    sap.m.ComboBox.prototype.destroyItems.apply(this, arguments);
                    this.setValue(undefined);
                    return this;
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.ComboBox.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 日期选择框
             */
            sap.m.DatePicker.extend("sap.extension.m.DatePicker", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "Date" },
                        /** 值模板 */
                        valueFormat: { type: "string", group: "Data", defaultValue: extension.data.Date.DEFAULT_FORMAT },
                        /** 显示模板 */
                        displayFormat: { type: "string", group: "Appearance", defaultValue: extension.data.Date.DEFAULT_FORMAT },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.DatePicker.prototype.setDateValue.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setDateValue(value) {
                    return this.setBindingValue(value);
                },
                /** 初始化 */
                init() {
                    sap.m.DatePicker.prototype.init.apply(this, arguments);
                    this.attachChange(undefined, function (event) {
                        let that = event.getSource();
                        if (that instanceof m.DatePicker) {
                            let oldValue = that.getBindingValue();
                            let newValue = that.getDateValue();
                            if (oldValue !== newValue) {
                                that.setProperty("bindingValue", newValue);
                            }
                            that = null;
                        }
                    });
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.DatePicker.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 时间选择框
             */
            sap.m.TimePicker.extend("sap.extension.m.TimePicker", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "Date" },
                        /** 值模板 */
                        valueFormat: { type: "string", group: "Data", defaultValue: extension.data.Time.DEFAULT_FORMAT },
                        /** 显示模板 */
                        displayFormat: { type: "string", group: "Appearance", defaultValue: extension.data.Time.DEFAULT_FORMAT },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.TimePicker.prototype.setDateValue.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置值
                 * @param value 值
                 */
                setDateValue(value) {
                    return this.setBindingValue(value);
                },
                /** 初始化 */
                init() {
                    sap.m.TimePicker.prototype.init.apply(this, arguments);
                    this.attachChange(undefined, function (event) {
                        let that = event.getSource();
                        if (that instanceof m.TimePicker) {
                            let oldValue = that.getBindingValue();
                            let newValue = that.getDateValue();
                            if (oldValue !== newValue) {
                                that.setProperty("bindingValue", newValue);
                            }
                            that = null;
                        }
                    });
                },
                /** 重构设置 */
                applySettings(mSettings) {
                    if (!mSettings.valueFormat) {
                        mSettings.valueFormat = extension.data.Time.DEFAULT_FORMAT;
                    }
                    if (!mSettings.displayFormat) {
                        mSettings.displayFormat = extension.data.Time.DEFAULT_FORMAT;
                    }
                    sap.m.TimePicker.prototype.applySettings.apply(this, arguments);
                    return this;
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.TimePicker.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 分段按钮
             */
            sap.m.SegmentedButton.extend("sap.extension.m.SegmentedButton", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    if (value !== this.getSelectedKey()) {
                        sap.m.SegmentedButton.prototype.setSelectedKey.apply(this, arguments);
                    }
                    return this.setProperty("bindingValue", value);
                },
                init() {
                    // 调用基类构造
                    sap.m.SegmentedButton.prototype.init.apply(this, arguments);
                    // 监听事件
                    this.attachSelectionChange(undefined, function (event) {
                        let source = event.getSource();
                        if (source instanceof m.SegmentedButton) {
                            source.setBindingValue(source.getSelectedKey());
                        }
                    });
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.SegmentedButton.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 分段按钮-枚举
             */
            m.SegmentedButton.extend("sap.extension.m.EnumSegmentedButton", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取枚举类型
                 */
                getEnumType() {
                    return this.getProperty("enumType");
                },
                /**
                 * 设置枚举类型
                 * @param value 枚举类型
                 */
                setEnumType(value) {
                    return this.setProperty("enumType", value);
                },
                /**
                 * 加载可选值
                 */
                loadItems() {
                    this.destroyItems();
                    let enumType = this.getEnumType();
                    if (ibas.objects.isNull(enumType)) {
                        return this;
                    }
                    for (let item in enumType) {
                        if (ibas.objects.isNull(item)) {
                            continue;
                        }
                        let key = item;
                        let text = enumType[key];
                        if (typeof key !== "string" || typeof text !== "string") {
                            continue;
                        }
                        if (!isNaN(Number(key))) {
                            key = Number(key);
                        }
                        this.addItem(new sap.m.SegmentedButtonItem("", {
                            key: key,
                            text: ibas.enums.describe(enumType, key),
                        }));
                    }
                    return this;
                },
                /** 渲染之后 */
                onAfterRendering() {
                    if (this.getItems().length === 0) {
                        this.loadItems();
                    }
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 开关框
             */
            sap.m.Switch.extend("sap.extension.m.Switch", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "boolean" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取绑定值
                 */
                getBindingValue() {
                    return this.getProperty("bindingValue");
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setBindingValue(value) {
                    sap.m.Switch.prototype.setState.apply(this, arguments);
                    this.setProperty("bindingValue", value);
                    return this;
                },
                /**
                 * 设置绑定值
                 * @param value 值
                 */
                setState(value) {
                    return this.setBindingValue(value);
                },
                /** 重写绑定 */
                bindProperty(sName, oBindingInfo) {
                    extension.utils.checkBindingInfo.apply(this, arguments);
                    sap.m.Switch.prototype.bindProperty.apply(this, arguments);
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let table;
        (function (table_1) {
            /** 改变表格选择风格 */
            function changeSelectionStyle() {
                if (!(this instanceof sap.ui.table.Table)) {
                    return;
                }
                this.setSelectedIndex(this.getSelectedIndex());
            }
            /**
             * 获取可视行数
             * @param defalutCount 默认值（未配置返回）
             */
            function visibleRowCount(count) {
                return ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, count);
            }
            table_1.visibleRowCount = visibleRowCount;
            // 表格的选择插件
            const ID_TABLE_PLUGIN_CHOOSE = function () {
                let version = sap.ui.getCore().getConfiguration().getVersion();
                if (version && version.getMajor() >= 1 && version.getMinor() >= 67) {
                    return "{0}_plg_chs";
                }
                return undefined;
            }();
            /**
             * 表格
             */
            sap.ui.table.Table.extend("sap.extension.table.Table", {
                metadata: {
                    properties: {
                        /** 行选择 */
                        selectionBehavior: { type: "string", defaultValue: sap.ui.table.SelectionBehavior.Row },
                        /** 选择方式 */
                        chooseType: { type: "int", defaultValue: ibas.emChooseType.MULTIPLE },
                    },
                    events: {
                        "nextDataSet": {
                            parameters: {
                                data: {
                                    type: "any",
                                }
                            }
                        }
                    }
                },
                renderer: {},
                /**
                 * 获取选择类型
                 */
                getChooseType() {
                    return this.getProperty("chooseType");
                },
                /**
                 * 设置选择类型
                 * @param value 选择类型
                 */
                setChooseType(value) {
                    this.detachRowSelectionChange(changeSelectionStyle);
                    this.setProperty("chooseType", value);
                    if (value === ibas.emChooseType.SINGLE) {
                        this.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
                        this.setEnableSelectAll(false);
                        this.attachRowSelectionChange(undefined, changeSelectionStyle);
                    }
                    else if (value === ibas.emChooseType.MULTIPLE) {
                        this.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
                        this.setEnableSelectAll(true);
                    }
                    else {
                        this.setSelectionMode(sap.ui.table.SelectionMode.None);
                        this.setEnableSelectAll(false);
                    }
                    return this;
                },
                /**
                 * 重写设置是否全选
                 */
                setEnableSelectAll(value) {
                    if (!ibas.strings.isEmpty(ID_TABLE_PLUGIN_CHOOSE)) {
                        this.removePlugin(ibas.strings.format(ID_TABLE_PLUGIN_CHOOSE, this.getId()));
                        if (this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                            if (value === false) {
                                this.addPlugin(new sap.ui.table.plugins.MultiSelectionPlugin(ibas.strings.format(ID_TABLE_PLUGIN_CHOOSE, this.getId()), {
                                    showHeaderSelector: true,
                                }));
                                return this.setProperty("enableSelectAll", value);
                            }
                        }
                    }
                    return sap.ui.table.Table.prototype.setEnableSelectAll.apply(this, arguments);
                },
                /**
                 * 选中索引（兼容方法），-1 表示未选中
                 * @returns number
                 */
                getSelectedIndex() {
                    if (sap.ui.table.Table.prototype.getSelectedIndex) {
                        return sap.ui.table.Table.prototype.getSelectedIndex.apply(this, arguments);
                    }
                    let selecteds = this.getSelectedIndices();
                    if (selecteds && selecteds.length > 0) {
                        return selecteds[0];
                    }
                    return -1;
                },
                /**
                 * 获取选择的数据
                 */
                getSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    for (let item of this.getSelectedIndices()) {
                        selecteds.push(this.getContextByIndex(item).getObject());
                    }
                    return selecteds;
                },
                /**
                 * 获取未选择的数据
                 */
                getUnSelecteds() {
                    let selecteds = new ibas.ArrayList();
                    let index = 0;
                    let context = this.getContextByIndex(index);
                    while (!ibas.objects.isNull(context)) {
                        selecteds.push(context.getObject());
                        context = this.getContextByIndex(++index);
                    }
                    for (let item of this.getSelectedIndices()) {
                        selecteds.remove(this.getContextByIndex(item).getObject());
                    }
                    return selecteds;
                },
                init() {
                    // 基类初始化
                    sap.ui.table.Table.prototype.init.apply(this, arguments);
                    // 监听行变化事件
                    this.attachEvent("_rowsUpdated", undefined, () => {
                        if (!this.hasListeners("nextDataSet")) {
                            // 没有下个数据集监听
                            return;
                        }
                        if (this.getBusy()) {
                            // 忙状态不监听
                            return;
                        }
                        let model = this.getModel(undefined);
                        if (!ibas.objects.isNull(model)) {
                            let data = model.getData();
                            if (!ibas.objects.isNull(data)) {
                                let dataCount = data.length;
                                if (dataCount === undefined) {
                                    // 存在绑定的对象路径问题
                                    dataCount = data.rows.length;
                                    if (dataCount !== undefined) {
                                        // 此路径存在数据
                                        data = data.rows;
                                    }
                                }
                                let visibleRow = this.getVisibleRowCount();
                                if (dataCount > 0 && dataCount > visibleRow) {
                                    let firstRow = this.getFirstVisibleRow(); // 当前页的第一行
                                    if (firstRow === (dataCount - visibleRow)) {
                                        // 调用事件
                                        this.setBusy(true);
                                        this.fireNextDataSet({ data: data[data.length - 1] });
                                    }
                                }
                            }
                        }
                    });
                },
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.ui.table.Table.prototype.exit.apply(this, arguments);
                },
                // 1.70以上兼容问题
                setSelectionMode() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.setSelectionMode.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.setSelectionMode.apply(this, arguments);
                },
                setSelectedIndex() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.setSelectedIndex.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.setSelectedIndex.apply(this, arguments);
                },
                clearSelection() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.clearSelection.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.clearSelection.apply(this, arguments);
                },
                selectAll() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.selectAll.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.selectAll.apply(this, arguments);
                },
                getSelectedIndices() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.getSelectedIndices.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.getSelectedIndices.apply(this, arguments);
                },
                addSelectionInterval() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.addSelectionInterval.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.addSelectionInterval.apply(this, arguments);
                },
                setSelectionInterval() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.setSelectionInterval.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.setSelectionInterval.apply(this, arguments);
                },
                removeSelectionInterval() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.removeSelectionInterval.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.removeSelectionInterval.apply(this, arguments);
                },
                isIndexSelected() {
                    // tslint:disable-next-line: no-string-literal
                    if (this["_hasSelectionPlugin"] && this.getChooseType() === ibas.emChooseType.MULTIPLE) {
                        let plugin = this.getPlugins()[0];
                        if (plugin instanceof sap.ui.table.plugins.MultiSelectionPlugin) {
                            return plugin.isIndexSelected.apply(plugin, arguments);
                        }
                    }
                    return sap.ui.table.Table.prototype.isIndexSelected.apply(this, arguments);
                },
            });
            /**
             * 表格列
             */
            sap.ui.table.Column.extend("sap.extension.table.Column", {
                metadata: {
                    properties: {
                        /** 列宽 */
                        width: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "10rem" },
                    },
                    events: {}
                },
                setTemplate(value) {
                    if (value instanceof sap.m.Select) {
                        value.setWidth("100%");
                    }
                    else if (value instanceof sap.m.ComboBox) {
                        value.setWidth("100%");
                    }
                    sap.ui.table.Column.prototype.setTemplate.apply(this, arguments);
                    return this;
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (!mSettings.autoResizable) {
                        mSettings.autoResizable = true;
                    }
                    return sap.ui.table.Column.prototype.applySettings.apply(this, arguments);
                }
            });
            /**
             * 数据表格
             */
            table_1.Table.extend("sap.extension.table.DataTable", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter() {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value) {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings() {
                    table_1.Table.prototype.applySettings.apply(this, arguments);
                    let dataInfo = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    }
                    else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyColumns.call(this, dataInfo);
                        }
                        else {
                            let info = dataInfo;
                            let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    }
                                    else {
                                        propertyColumns.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    let model = this.getModel();
                    // 判断是否有有效模型
                    if (model && model.getData()) {
                        let data = model.getData();
                        if (!(data.rows instanceof Array && data.rows.length > 0)) {
                            model = undefined;
                        }
                    }
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        }
                        else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                for (let column of this.getColumns()) {
                                    if (column instanceof table_1.DataColumn) {
                                        let template = column.getTemplate();
                                        if (template instanceof sap.ui.core.Control) {
                                            let bindingInfo = template.getBindingInfo("bindingValue");
                                            if (!ibas.objects.isNull(bindingInfo)) {
                                                extension.userfields.check(userFields, bindingInfo);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return table_1.Table.prototype.setModel.apply(this, arguments);
                },
                init() {
                    table_1.Table.prototype.init.apply(this, arguments);
                    this.attachPaste(undefined, function (event) {
                        let table = event.getSource();
                        if (table instanceof table_1.DataTable) {
                        }
                    });
                }
            });
            function propertyColumns(boInfo) {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter = this.getPropertyFilter();
                let properties = new ibas.ArrayList();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                // 只读列表（遍历列，存在输入框则非只读）
                let readonly = true;
                for (let column of this.getColumns()) {
                    if (column instanceof table_1.DataColumn) {
                        let template = column.getTemplate();
                        if (template instanceof sap.ui.core.Control) {
                            if (template instanceof sap.m.InputBase) {
                                readonly = false;
                                break;
                            }
                        }
                    }
                }
                // 创建未存在的列
                for (let property of properties) {
                    this.addColumn(new table_1.DataColumn("", {
                        label: property.description,
                        template: extension.factories.newComponent(property, readonly ? "Text" : "Input"),
                    }));
                }
            }
            /**
             * 数据表格列
             */
            table_1.Column.extend("sap.extension.table.DataColumn", {
                metadata: {
                    properties: {
                        /** 属性信息 */
                        propertyInfo: { type: "any" },
                    },
                    events: {}
                },
                /**
                 * 获取属性信息
                 */
                getPropertyInfo() {
                    return this.getProperty("propertyInfo");
                },
                /**
                 * 设置属性信息
                 * @param value 值
                 */
                setPropertyInfo(value) {
                    return this.setProperty("propertyInfo", value);
                }
            });
        })(table = extension.table || (extension.table = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 页
             */
            sap.m.Page.extend("sap.extension.m.Page", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    this.bindObject("/");
                    sap.m.Page.prototype.setModel.apply(this, arguments);
                    return this;
                },
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.m.Page.prototype.exit.apply(this, arguments);
                }
            });
            /**
             * 数据页
             */
            m.Page.extend("sap.extension.m.DataPage", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter() {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value) {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings() {
                    m.Page.prototype.applySettings.apply(this, arguments);
                    // 重新构建区域
                    let content = this.removeAllContent();
                    this.addContent(new sap.ui.layout.DynamicSideContent(this.getId() + "_contentSplit", {
                        showMainContent: true,
                        showSideContent: false,
                        mainContent: [
                            new sap.ui.layout.VerticalLayout(this.getId() + "_commonSplit", {
                                width: "100%",
                                content: content
                            })
                        ],
                        sideContent: [
                            new sap.ui.layout.form.SimpleForm(this.getId() + "_extendSplit", {
                                width: "100%",
                                editable: true,
                            }),
                        ]
                    }));
                    // 设置其他属性
                    let dataInfo = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    }
                    else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyControls.call(this, dataInfo);
                        }
                        else {
                            let info = dataInfo;
                            let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    }
                                    else {
                                        propertyControls.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    let model = this.getModel();
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        }
                        else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                let splitter = sap.ui.getCore().byId(this.getId() + "_extendSplit");
                                if (splitter instanceof sap.ui.layout.form.SimpleForm) {
                                    for (let item of splitter.getContent()) {
                                        let bindingInfo = item.getBindingInfo("bindingValue");
                                        if (!ibas.objects.isNull(bindingInfo)) {
                                            extension.userfields.check(userFields, bindingInfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return m.Page.prototype.setModel.apply(this, arguments);
                },
            });
            function propertyControls(boInfo) {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter = this.getPropertyFilter();
                let properties = new ibas.ArrayList();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                // 创建自定义字段按钮
                if (properties.length > 0) {
                    let shower = sap.ui.getCore().byId(this.getId() + "_shower");
                    if (ibas.objects.isNull(shower)) {
                        shower = new sap.m.Button(this.getId() + "_shower", {
                            type: sap.m.ButtonType.Transparent,
                            icon: "sap-icon://filter-fields",
                            press: () => {
                                let split = sap.ui.getCore().byId(this.getId() + "_contentSplit");
                                if (split instanceof sap.ui.layout.DynamicSideContent) {
                                    split.setShowSideContent(!split.getShowSideContent(), false);
                                }
                            }
                        });
                        let bar = this.getSubHeader();
                        if (ibas.objects.isNull(bar)) {
                            this.setSubHeader(bar = new sap.m.Toolbar("", {}));
                        }
                        if (bar instanceof sap.m.Toolbar) {
                            bar.addContent(new sap.m.ToolbarSpacer(""));
                            bar.addContent(shower);
                        }
                        else if (bar instanceof sap.m.Bar) {
                            bar.insertContentRight(shower, bar.getContentRight().length - 1);
                        }
                    }
                }
                // 创建未存在的控件
                let splitter = sap.ui.getCore().byId(this.getId() + "_extendSplit");
                if (splitter instanceof sap.ui.layout.form.SimpleForm) {
                    for (let property of properties) {
                        splitter.addContent(new sap.m.Label("", {
                            text: property.description
                        }));
                        splitter.addContent(extension.factories.newComponent(property, "Input"));
                    }
                }
            }
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /** 下拉框-行政地区 */
            m.ComboBox.extend("sap.extension.m.RegionComboBox", {
                metadata: {
                    properties: {
                        /** 语言 */
                        language: { type: "string", defaultValue: ibas.config.get(ibas.CONFIG_ITEM_LANGUAGE_CODE, "zh_CN") },
                        /** 数据地址 */
                        dataUrl: { type: "string", },
                        /** 过滤器（属性名称或方法） */
                        filter: { type: "any", defaultValue: undefined },
                    },
                    events: {}
                },
                renderer: {},
                setSelectedItem(value) {
                    m.ComboBox.prototype.setSelectedItem.apply(this, arguments);
                    this.fireSelectionChange({
                        selectedItem: value
                    });
                    this.fireChange({
                        value: value.getText()
                    });
                    return this;
                },
                initItems(group, selector) {
                    this.destroyItems();
                    let url = this.getDataUrl();
                    if (ibas.strings.isEmpty(url)) {
                        return this;
                    }
                    if (!ibas.strings.isWith(url, "http", undefined)) {
                        let builder = new ibas.StringBuilder();
                        builder.map(null, "");
                        builder.map(undefined, "");
                        builder.append(ibas.urls.rootUrl("/openui5/index"));
                        builder.append("/");
                        builder.append("datas");
                        builder.append("/");
                        builder.append(this.getLanguage());
                        builder.append("/");
                        builder.append(url);
                        url = builder.toString();
                    }
                    let that = this;
                    jQuery.ajax({
                        url: url,
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        cache: true,
                        success: function (data) {
                            if (data instanceof Array) {
                                let property = that.getFilter();
                                let filter = typeof property === "function" ? property
                                    : typeof property === "string" ? (data) => {
                                        return data[property] === group;
                                    } : undefined;
                                for (let item of data) {
                                    if (ibas.objects.isNull(item)) {
                                        continue;
                                    }
                                    if (!ibas.strings.isEmpty(group)) {
                                        if (filter instanceof Function && !filter(item)) {
                                            continue;
                                        }
                                    }
                                    that.newItem(item);
                                }
                            }
                            if (selector instanceof Function) {
                                selector(that);
                            }
                            else {
                                let text = that.getValue();
                                if (!ibas.strings.isEmpty(text)) {
                                    for (let item of that.getItems()) {
                                        if (ibas.strings.equals(item.getText(), text)) {
                                            that.setSelectedItem(item);
                                            break;
                                        }
                                    }
                                }
                            }
                            that = null;
                        },
                    });
                    return this;
                },
                newItem(data) {
                    if (data && data.code && data.name) {
                        this.addItem(new sap.ui.core.ListItem("", {
                            key: data.code,
                            text: data.name,
                        }));
                    }
                    return this;
                }
            });
            /** 下拉框-地区-国家 */
            m.RegionComboBox.extend("sap.extension.m.CountryComboBox", {
                metadata: {
                    properties: {
                        /** 数据地址 */
                        dataUrl: { type: "string", defaultValue: "country.json" },
                        /** 过滤器（属性名称或方法） */
                        filter: { type: "any", defaultValue: undefined },
                    },
                    events: {}
                },
                renderer: {},
            });
            /** 下拉框-地区-省 */
            m.RegionComboBox.extend("sap.extension.m.ProvinceComboBox", {
                metadata: {
                    properties: {
                        /** 数据地址 */
                        dataUrl: { type: "string", defaultValue: "province.json" },
                        /** 过滤器（属性名称或方法） */
                        filter: { type: "any", defaultValue: undefined },
                    },
                    events: {}
                },
                renderer: {},
            });
            /** 下拉框-地区-市 */
            m.RegionComboBox.extend("sap.extension.m.CityComboBox", {
                metadata: {
                    properties: {
                        /** 数据地址 */
                        dataUrl: { type: "string", defaultValue: "city.json" },
                        /** 过滤器（属性名称或方法） */
                        filter: { type: "any", defaultValue: "provinceCode" },
                    },
                    events: {}
                },
                renderer: {},
            });
            /** 下拉框-地区-区 */
            m.RegionComboBox.extend("sap.extension.m.DistrictComboBox", {
                metadata: {
                    properties: {
                        /** 数据地址 */
                        dataUrl: { type: "string", defaultValue: "district.json" },
                        /** 过滤器（属性名称或方法） */
                        filter: { type: "any", defaultValue: "cityCode" },
                    },
                    events: {}
                },
                renderer: {},
            });
            /**
             * 地址区
             */
            extension.core.EditableControl.extend("sap.extension.m.AddressArea", {
                metadata: {
                    properties: {
                        /** 语言 */
                        language: { type: "string", defaultValue: ibas.config.get(ibas.CONFIG_ITEM_LANGUAGE_CODE, "zh_CN") },
                        /** 国家 */
                        country: { type: "string" },
                        /** 省 */
                        province: { type: "string" },
                        /** 市 */
                        city: { type: "string" },
                        /** 区 */
                        district: { type: "string" },
                        /** 街道 */
                        street: { type: "string" },
                        /** 邮编 */
                        zipCode: { type: "string" },
                        /** 全地址（省市区街道） */
                        address: { type: "string" },
                        /** 国家-是否可见 */
                        countryVisible: { type: "boolean", defaultValue: false },
                        /** 省-是否可见 */
                        provinceVisible: { type: "boolean", defaultValue: true },
                        /** 市-是否可见 */
                        cityVisible: { type: "boolean", defaultValue: true },
                        /** 区-是否可见 */
                        districtVisible: { type: "boolean", defaultValue: true },
                        /** 街道-是否可见 */
                        streetVisible: { type: "boolean", defaultValue: true },
                        /** 邮编-是否可见 */
                        zipCodeVisible: { type: "boolean", defaultValue: false },
                    },
                    aggregations: {
                        "_country": { type: "sap.extension.m.CountryComboBox", multiple: false },
                        "_province": { type: "sap.extension.m.ProvinceComboBox", multiple: false },
                        "_city": { type: "sap.extension.m.CityComboBox", multiple: false },
                        "_district": { type: "sap.extension.m.DistrictComboBox", multiple: false },
                        "_street": { type: "sap.extension.m.Input", multiple: false },
                        "_zipcode": { type: "sap.extension.m.Input", multiple: false },
                    },
                    events: {
                        "addressChange": {
                            parameters: {
                                trigger: {
                                    type: "string",
                                },
                                address: {
                                    type: "string",
                                }
                            }
                        },
                    },
                },
                renderer: function (oRm, oControl) {
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.write(">");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_country", undefined));
                    oRm.write("</div>");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_province", undefined));
                    oRm.write("</div>");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_city", undefined));
                    oRm.write("</div>");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_district", undefined));
                    oRm.write("</div>");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_street", undefined));
                    oRm.write("</div>");
                    oRm.write("<div>");
                    oRm.renderControl(oControl.getAggregation("_zipcode", undefined));
                    oRm.write("</div>");
                    oRm.write("</div>");
                },
                init() {
                    sap.ui.core.Control.prototype.init.apply(this, arguments);
                    this.setAggregation("_country", new m.CountryComboBox("", {
                        visible: this.getCountryVisible(),
                        language: this.getLanguage(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_country"),
                        selectionChange: (event) => {
                            this.setBusy(true);
                            let combobox = event.getSource();
                            let country = combobox.getSelectedKey();
                            if (ibas.objects.isNull(country)) {
                                country = "";
                            }
                            this.getAggregation("_province", undefined)
                                .setDataUrl(ibas.strings.format("{0}/{1}", country, "province.json"))
                                .initItems(undefined, (combobox) => {
                                let text = this.getProvince();
                                if (!ibas.strings.isEmpty(text)) {
                                    for (let item of combobox.getItems()) {
                                        if (ibas.strings.equals(item.getText(), text)) {
                                            combobox.setSelectedItem(item);
                                            return;
                                        }
                                    }
                                    combobox.setValue(text);
                                }
                            });
                            this.getAggregation("_city", undefined)
                                .setDataUrl(ibas.strings.format("{0}/{1}", country, "city.json"))
                                .destroyItems();
                            this.getAggregation("_district", undefined)
                                .setDataUrl(ibas.strings.format("{0}/{1}", country, "district.json"))
                                .destroyItems();
                            this.setBusy(false);
                        },
                        change: (event) => {
                            let combobox = event.getSource();
                            this.setProperty("country", combobox.getValue());
                            this.setAddress();
                        }
                    }).initItems(undefined, (combobox) => {
                        let text = this.getCountry();
                        if (!ibas.strings.isEmpty(text)) {
                            for (let item of combobox.getItems()) {
                                if (ibas.strings.equals(item.getText(), text)) {
                                    combobox.setSelectedItem(item);
                                    break;
                                }
                            }
                        }
                        else if (this.getCountryVisible() === false) {
                            if (combobox.getItems().length > 0) {
                                combobox.setSelectedItem(combobox.getFirstItem());
                            }
                        }
                    }));
                    this.setAggregation("_province", new m.ProvinceComboBox("", {
                        visible: this.getProvinceVisible(),
                        language: this.getLanguage(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_province"),
                        selectionChange: (event) => {
                            this.setBusy(true);
                            let combobox = event.getSource();
                            this.getAggregation("_city", undefined).initItems(combobox.getSelectedKey(), (combobox) => {
                                let text = this.getCity();
                                if (!ibas.strings.isEmpty(text)) {
                                    for (let item of combobox.getItems()) {
                                        if (ibas.strings.equals(item.getText(), text)) {
                                            combobox.setSelectedItem(item);
                                            return;
                                        }
                                    }
                                    combobox.setValue(text);
                                }
                            });
                            this.getAggregation("_district", undefined).destroyItems();
                            this.setBusy(false);
                        },
                        change: (event) => {
                            let combobox = event.getSource();
                            this.setProperty("province", combobox.getValue());
                            this.setAddress();
                        }
                    }));
                    this.setAggregation("_city", new m.CityComboBox("", {
                        visible: this.getCityVisible(),
                        language: this.getLanguage(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_city"),
                        selectionChange: (event) => {
                            this.setBusy(true);
                            let combobox = event.getSource();
                            this.getAggregation("_district", undefined).initItems(combobox.getSelectedKey(), (combobox) => {
                                let text = this.getDistrict();
                                if (!ibas.strings.isEmpty(text)) {
                                    for (let item of combobox.getItems()) {
                                        if (ibas.strings.equals(item.getText(), text)) {
                                            combobox.setSelectedItem(item);
                                            return;
                                        }
                                    }
                                    combobox.setValue(text);
                                }
                            });
                            this.setBusy(false);
                        },
                        change: (event) => {
                            let combobox = event.getSource();
                            this.setProperty("city", combobox.getValue());
                            this.setAddress();
                        }
                    }));
                    this.setAggregation("_district", new m.DistrictComboBox("", {
                        visible: this.getDistrictVisible(),
                        language: this.getLanguage(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_district"),
                        selectionChange: (event) => {
                            this.setBusy(true);
                            // 不显示街道时，触发地址变化
                            if (this.getStreetVisible() !== true) {
                                this.setAddress();
                            }
                            this.setBusy(false);
                        },
                        change: (event) => {
                            let combobox = event.getSource();
                            this.setProperty("district", combobox.getValue());
                            this.setAddress();
                        }
                    }));
                    this.setAggregation("_street", new m.Input("", {
                        visible: this.getStreetVisible(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_street"),
                        change: (event) => {
                            this.setBusy(true);
                            let input = event.getSource();
                            this.setProperty("street", input.getValue());
                            // 显示街道时，触发地址变化
                            if (this.getStreetVisible() === true) {
                                this.setAddress();
                            }
                            this.setBusy(false);
                        }
                    }));
                    this.setAggregation("_zipcode", new m.Input("", {
                        visible: this.getZipCodeVisible(),
                        width: "100%",
                        placeholder: ibas.i18n.prop("openui5_zipcode"),
                        change: (event) => {
                            this.setBusy(true);
                            let input = event.getSource();
                            this.setProperty("zipcode", input.getValue());
                            this.setBusy(false);
                        }
                    }));
                },
                /** 是否可编辑 */
                getLanguage() {
                    return this.getProperty("language");
                },
                /** 是否可编辑 */
                getEditable() {
                    return this.getProperty("editable");
                },
                /** 国家 */
                getCountry() {
                    return this.getProperty("country");
                },
                /** 省 */
                getProvince() {
                    return this.getProperty("province");
                },
                /** 市 */
                getCity() {
                    return this.getProperty("city");
                },
                /** 区 */
                getDistrict() {
                    return this.getProperty("district");
                },
                /** 街道 */
                getStreet() {
                    return this.getProperty("street");
                },
                /** 邮编 */
                getZipCode() {
                    return this.getProperty("zipCode");
                },
                /** 国家 */
                getCountryVisible() {
                    return this.getProperty("countryVisible");
                },
                /** 省 */
                getProvinceVisible() {
                    return this.getProperty("provinceVisible");
                },
                /** 市 */
                getCityVisible() {
                    return this.getProperty("cityVisible");
                },
                /** 区 */
                getDistrictVisible() {
                    return this.getProperty("districtVisible");
                },
                /** 街道 */
                getStreetVisible() {
                    return this.getProperty("streetVisible");
                },
                /** 邮编 */
                getZipCodeVisible() {
                    return this.getProperty("zipCodeVisible");
                },
                /** 全地址 */
                getAddress() {
                    return this.getProperty("address");
                },
                /** 语言 */
                setLanguage(value) {
                    this.setProperty("language", value);
                    return this;
                },
                /** 是否可编辑 */
                setEditable(value) {
                    this.setProperty("editable", value);
                    this.getAggregation("_country", undefined).setEditable(value);
                    this.getAggregation("_province", undefined).setEditable(value);
                    this.getAggregation("_city", undefined).setEditable(value);
                    this.getAggregation("_district", undefined).setEditable(value);
                    this.getAggregation("_street", undefined).setEditable(value);
                    this.getAggregation("_zipcode", undefined).setEditable(value);
                    return this;
                },
                /** 国家 */
                setCountry(value) {
                    this.setProperty("country", value);
                    this.getAggregation("_country", undefined).setValue(value);
                    return this;
                },
                /** 省 */
                setProvince(value) {
                    this.setProperty("province", value);
                    this.getAggregation("_province", undefined).setValue(value);
                    return this;
                },
                /** 市 */
                setCity(value) {
                    this.setProperty("city", value);
                    this.getAggregation("_city", undefined).setValue(value);
                    return this;
                },
                /** 区 */
                setDistrict(value) {
                    this.setProperty("district", value);
                    this.getAggregation("_district", undefined).setValue(value);
                    return this;
                },
                /** 街道 */
                setStreet(value) {
                    this.setProperty("street", value);
                    this.getAggregation("_street", undefined).setValue(value);
                    return this;
                },
                /** 邮编 */
                setZipCode(value) {
                    this.setProperty("zipCode", value);
                    this.getAggregation("_zipcode", undefined).setValue(value);
                    return this;
                },
                /** 全地址 */
                setAddress() {
                    let builder = new ibas.StringBuilder();
                    builder.map(undefined, "");
                    builder.map(null, "");
                    let contorl = this.getAggregation("_country", undefined);
                    if (contorl.getVisible() === true) {
                        builder.append(contorl.getValue());
                    }
                    contorl = this.getAggregation("_province", undefined);
                    if (contorl.getVisible() === true) {
                        builder.append(contorl.getValue());
                    }
                    contorl = this.getAggregation("_city", undefined);
                    if (contorl.getVisible() === true) {
                        builder.append(contorl.getValue());
                    }
                    contorl = this.getAggregation("_district", undefined);
                    if (contorl.getVisible() === true) {
                        builder.append(contorl.getValue());
                    }
                    contorl = this.getAggregation("_street", undefined);
                    if (contorl.getVisible() === true) {
                        builder.append(contorl.getValue());
                    }
                    let value = builder.toString();
                    this.setProperty("address", value);
                    this.fireAddressChange({ address: value });
                    return this;
                },
                /** 国家 */
                setCountryVisible(value) {
                    this.setProperty("countryVisible", value);
                    this.getAggregation("_country", undefined).setVisible(value);
                    return this;
                },
                /** 省 */
                setProvinceVisible(value) {
                    this.setProperty("provinceVisible", value);
                    this.getAggregation("_province", undefined).setVisible(value);
                    return this;
                },
                /** 市 */
                setCityVisible(value) {
                    this.setProperty("cityVisible", value);
                    this.getAggregation("_city", undefined).setVisible(value);
                    return this;
                },
                /** 区 */
                setDistrictVisible(value) {
                    this.setProperty("districtVisible", value);
                    this.getAggregation("_district", undefined).setVisible(value);
                    return this;
                },
                /** 街道 */
                setStreetVisible(value) {
                    this.setProperty("streetVisible", value);
                    this.getAggregation("_street", undefined).setVisible(value);
                    return this;
                },
                /** 邮编 */
                setZipCodeVisible(value) {
                    this.setProperty("zipCodeVisible", value);
                    this.getAggregation("_zipcode", undefined).setVisible(value);
                    return this;
                },
                /** 设置监听地址改变事件 */
                attachAddressChange(oData, fnFunction, oListener) {
                    this.attachEvent("addressChange", oData, fnFunction, oListener);
                    return this;
                },
                /** 取消监听地址改变事件 */
                detachAddressChange(fnFunction, oListener) {
                    this.detachEvent("addressChange", fnFunction, oListener);
                    return this;
                },
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let uxap;
        (function (uxap) {
            /**
             * 对象页
             */
            sap.uxap.ObjectPageLayout.extend("sap.extension.uxap.ObjectPageLayout", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    this.bindObject("/");
                    sap.uxap.ObjectPageLayout.prototype.setModel.apply(this, arguments);
                    return this;
                },
                /** 设置头 */
                setHeaderTitle(oHeaderTitle) {
                    sap.uxap.ObjectPageLayout.prototype.setHeaderTitle.apply(this, arguments);
                    if (oHeaderTitle instanceof sap.uxap.ObjectPageHeader) {
                        if (oHeaderTitle.getNavigationBar() instanceof sap.ui.core.Control) {
                            oHeaderTitle.getNavigationBar().addStyleClass("sapMTBStandard");
                        }
                    }
                    return this;
                },
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.uxap.ObjectPageLayout.prototype.exit.apply(this, arguments);
                }
            });
            /**
             * 数据页
             */
            uxap.ObjectPageLayout.extend("sap.extension.uxap.DataObjectPageLayout", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter() {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value) {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings() {
                    uxap.ObjectPageLayout.prototype.applySettings.apply(this, arguments);
                    // 设置其他属性
                    let dataInfo = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    }
                    else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyControls.call(this, dataInfo);
                        }
                        else {
                            let info = dataInfo;
                            let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    }
                                    else {
                                        propertyControls.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    let model = this.getModel();
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        }
                        else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                let section = sap.ui.getCore().byId(this.getId() + "_extendSection");
                                if (section instanceof sap.uxap.ObjectPageSubSection) {
                                    for (let item of section.getBlocks()) {
                                        let bindingInfo = item.getBindingInfo("text");
                                        if (!ibas.objects.isNull(bindingInfo)) {
                                            extension.userfields.check(userFields, bindingInfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return uxap.ObjectPageLayout.prototype.setModel.apply(this, arguments);
                },
            });
            function propertyControls(boInfo) {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter = this.getPropertyFilter();
                let properties = new ibas.ArrayList();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                if (properties.length > 0) {
                    let section = new sap.uxap.ObjectPageSubSection(this.getId() + "_extendSection", {
                        blocks: [],
                    });
                    for (let property of properties) {
                        section.addBlock(extension.factories.newComponent(property, "Object"));
                    }
                    this.addSection(new sap.uxap.ObjectPageSection("", {
                        title: ibas.i18n.prop("openui5_object_other_properties"),
                        subSections: [
                            section
                        ]
                    }));
                }
            }
        })(uxap = extension.uxap || (extension.uxap = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 对象标识符
             */
            sap.m.ObjectIdentifier.extend("sap.extension.m.ObjectIdentifier", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 对象属性
             */
            sap.m.ObjectAttribute.extend("sap.extension.m.ObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
            /**
             * 业务仓库数据-对象属性
             */
            m.ObjectAttribute.extend("sap.extension.m.RepositoryObjectAttribute", {
                metadata: {
                    properties: {
                        /** 业务仓库 */
                        repository: { type: "any" },
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取业务仓库实例
                 */
                getRepository() {
                    return this.getProperty("repository");
                },
                /**
                 * 设置业务仓库
                 * @param value 业务仓库实例；业务仓库名称
                 */
                setRepository(value) {
                    return this.setProperty("repository", extension.utils.repository(value));
                },
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", extension.utils.dataInfo(value));
                },
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setText(value) {
                    if (this.getText() !== value) {
                        m.ObjectAttribute.prototype.setText.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let dataInfo = this.getDataInfo();
                            if (ibas.objects.isNull(dataInfo)) {
                                return this;
                            }
                            let criteria = new ibas.Criteria();
                            criteria.noChilds = true;
                            for (let item of String(value).split(ibas.DATA_SEPARATOR)) {
                                let condition = criteria.conditions.create();
                                condition.alias = dataInfo.key;
                                condition.value = item;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                            extension.repository.batchFetch(this.getRepository(), this.getDataInfo(), criteria, (values) => {
                                if (values instanceof Error) {
                                    ibas.logger.log(values);
                                }
                                else {
                                    let keyBudilder = new ibas.StringBuilder();
                                    keyBudilder.map(null, "");
                                    keyBudilder.map(undefined, "");
                                    let textBudilder = new ibas.StringBuilder();
                                    textBudilder.map(null, "");
                                    textBudilder.map(undefined, "");
                                    for (let item of values) {
                                        if (keyBudilder.length > 0) {
                                            keyBudilder.append(ibas.DATA_SEPARATOR);
                                        }
                                        if (textBudilder.length > 0) {
                                            textBudilder.append(ibas.DATA_SEPARATOR);
                                            textBudilder.append(" ");
                                        }
                                        keyBudilder.append(item.key);
                                        textBudilder.append(item.text);
                                    }
                                    m.ObjectAttribute.prototype.setText.call(this, textBudilder.toString());
                                }
                            });
                        }
                    }
                    return this;
                },
            });
            /**
             * 对象属性可选值-对象属性
             */
            m.ObjectAttribute.extend("sap.extension.m.PropertyObjectAttribute", {
                metadata: {
                    properties: {
                        /** 对象数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性名称 */
                        propertyName: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性名称
                 */
                getPropertyName() {
                    return this.getProperty("propertyName");
                },
                /**
                 * 设置属性名称
                 * @param value 属性名称
                 */
                setPropertyName(value) {
                    return this.setProperty("propertyName", value);
                },
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setText(value) {
                    if (this.getText() !== value) {
                        m.ObjectAttribute.prototype.setText.apply(this, arguments);
                        if (ibas.strings.isEmpty(value)) {
                            return this;
                        }
                        let boInfo = this.getDataInfo();
                        if (typeof boInfo === "string") {
                            boInfo = {
                                code: boInfo,
                                name: undefined,
                            };
                        }
                        else if (typeof boInfo === "function") {
                            boInfo = {
                                code: ibas.objects.typeOf(boInfo).BUSINESS_OBJECT_CODE,
                                name: undefined,
                            };
                        }
                        if (!boInfo || !boInfo.code) {
                            return this;
                        }
                        let propertyName = this.getPropertyName();
                        if (ibas.strings.isEmpty(propertyName)) {
                            // 未设置属性则使用绑定的
                            propertyName = this.getBindingPath("bindingValue");
                        }
                        if (ibas.strings.isEmpty(propertyName)) {
                            return this;
                        }
                        let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                        boRepository.fetchBOInfos({
                            boCode: ibas.config.applyVariables(boInfo.code),
                            boName: boInfo.name,
                            onCompleted: (opRslt) => {
                                try {
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    let boName;
                                    if (propertyName.indexOf(".") > 0) {
                                        // 属性带路径，则取名称
                                        boName = propertyName.split(".")[0];
                                    }
                                    for (let data of opRslt.resultObjects) {
                                        if (boName && !ibas.strings.equalsIgnoreCase(data.name, boName)) {
                                            continue;
                                        }
                                        for (let property of data.properties) {
                                            if (ibas.strings.equalsIgnoreCase(propertyName, property.property)) {
                                                if (property.values instanceof Array) {
                                                    for (let item of property.values) {
                                                        if (ibas.strings.equals(item.value, value)) {
                                                            m.ObjectAttribute.prototype.setText.call(this, item.description);
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        return;
                                    }
                                }
                                catch (error) {
                                    ibas.logger.log(error);
                                }
                            }
                        });
                    }
                },
            });
            /**
             * 数据转换-对象属性
             */
            m.ObjectAttribute.extend("sap.extension.m.ConversionObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {
                        "convert": {
                            parameters: {
                                value: {
                                    type: "string",
                                },
                                done: {
                                    type: "function",
                                },
                                bindingData: {
                                    type: "any",
                                }
                            }
                        },
                    },
                },
                renderer: {},
                /**
                 * 设置选中值
                 * @param value 值
                 */
                setText(value) {
                    if (this.getText() !== value) {
                        m.ObjectAttribute.prototype.setText.apply(this, arguments);
                        if (!ibas.strings.isEmpty(value)) {
                            let done = (newValue) => {
                                m.ObjectAttribute.prototype.setText.call(this, newValue);
                            };
                            let bindingData = this.getBindingContext().getObject();
                            this.fireConvert({
                                value: value,
                                done: done,
                                bindingData: bindingData,
                            });
                        }
                    }
                    return this;
                }
            });
            /**
             * 用户数据-对象属性
             */
            m.RepositoryObjectAttribute.extend("sap.extension.m.UserObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryObjectAttribute.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.UserObjectAttribute, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.UserObjectAttribute, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.UserObjectAttribute, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER")),
                                key: "DocEntry",
                                text: "Name",
                            };
                            extension.variables.set(dataInfo, m.UserObjectAttribute, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_USER"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "DocEntry";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Name";
                        }
                    }
                    return this;
                }
            });
            /**
             * 组织数据-对象属性
             */
            m.RepositoryObjectAttribute.extend("sap.extension.m.OrganizationObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryObjectAttribute.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.OrganizationObjectAttribute, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.OrganizationObjectAttribute, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.OrganizationObjectAttribute, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION")),
                                key: "Code",
                                text: "Name",
                            };
                            extension.variables.set(dataInfo, m.OrganizationObjectAttribute, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_ORGANIZATION"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Name";
                        }
                    }
                    return this;
                }
            });
            /**
             * 角色数据-对象属性
             */
            m.OrganizationObjectAttribute.extend("sap.extension.m.RoleObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.OrganizationObjectAttribute.prototype.applySettings.apply(this, arguments);
                    return this;
                }
            });
            /**
             * 业务对象数据-对象属性
             */
            m.RepositoryObjectAttribute.extend("sap.extension.m.BusinessObjectObjectAttribute", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 重构设置 */
                applySettings() {
                    m.RepositoryObjectAttribute.prototype.applySettings.apply(this, arguments);
                    let boRepository = this.getRepository();
                    if (ibas.objects.isNull(boRepository)) {
                        boRepository = extension.variables.get(m.BusinessObjectObjectAttribute, "repository");
                        if (ibas.objects.isNull(boRepository)) {
                            boRepository = ibas.boFactory.create("BORepositoryInitialFantasy");
                            extension.variables.set(boRepository, m.BusinessObjectObjectAttribute, "repository");
                        }
                        this.setRepository(boRepository);
                    }
                    let dataInfo = this.getDataInfo();
                    if (ibas.objects.isNull(dataInfo)) {
                        dataInfo = extension.variables.get(m.BusinessObjectObjectAttribute, "dataInfo");
                        if (ibas.objects.isNull(dataInfo)) {
                            dataInfo = {
                                type: ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO")),
                                key: "Code",
                                text: "Description",
                            };
                            extension.variables.set(dataInfo, m.BusinessObjectObjectAttribute, "dataInfo");
                        }
                        this.setDataInfo(dataInfo);
                    }
                    else {
                        if (!dataInfo.type) {
                            dataInfo.type = ibas.boFactory.classOf(ibas.config.applyVariables("${Company}_SYS_BOINFO"));
                        }
                        else if (!dataInfo.key) {
                            dataInfo.key = "Code";
                        }
                        else if (!dataInfo.text) {
                            dataInfo.text = "Description";
                        }
                    }
                    return this;
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 对象状态
             */
            sap.m.ObjectStatus.extend("sap.extension.m.ObjectStatus", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
            /**
             * 对象枚举状态
             */
            m.ObjectStatus.extend("sap.extension.m.ObjectEnumStatus", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取枚举类型
                 */
                getEnumType() {
                    return this.getProperty("enumType");
                },
                /**
                 * 设置枚举类型
                 * @param value 枚举类型
                 */
                setEnumType(value) {
                    return this.setProperty("enumType", value);
                },
                /**
                 * 设置文本，并修改状态及图标值
                 * @param value 值
                 */
                setText(value) {
                    m.ObjectStatus.prototype.setText.apply(this, arguments);
                    let context = this.getBindingContext();
                    if (context instanceof sap.ui.model.Context) {
                        let value = ibas.objects.propertyValue(context.getObject(), this.getBindingPath("text"));
                        if (!ibas.objects.isNull(value)) {
                            if (this.toState instanceof Function) {
                                this.setState(this.toState(value));
                            }
                            if (this.toIcon instanceof Function) {
                                this.setIcon(this.toIcon(value));
                            }
                        }
                    }
                    return this;
                },
                /** 重构设置 */
                applySettings(mSetting) {
                    if (mSetting) {
                        if (mSetting.toState instanceof Function) {
                            this.toState = mSetting.toState;
                            delete (mSetting.toState);
                        }
                        if (mSetting.toIcon instanceof Function) {
                            this.toIcon = mSetting.toIcon;
                            delete (mSetting.toIcon);
                        }
                    }
                    m.ObjectStatus.prototype.applySettings.apply(this, arguments);
                    return this;
                },
            });
            /**
             * 对象单据状态
             */
            m.ObjectEnumStatus.extend("sap.extension.m.ObjectDocumentStatus", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any", defalut: ibas.emDocumentStatus },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 转为状态值
                 * @param data 枚举值
                 */
                toState(data) {
                    if (data === ibas.emDocumentStatus.RELEASED) {
                        return sap.ui.core.ValueState.Information;
                    }
                    else if (data === ibas.emDocumentStatus.FINISHED) {
                        return sap.ui.core.ValueState.Success;
                    }
                    else if (data === ibas.emDocumentStatus.CLOSED) {
                        return sap.ui.core.ValueState.Success;
                    }
                    else {
                        return sap.ui.core.ValueState.None;
                    }
                },
                /**
                 * 转为图标值
                 * @param data 枚举值
                 */
                toIcon(data) {
                    if (data === ibas.emDocumentStatus.RELEASED) {
                        return "sap-icon://status-in-process";
                    }
                    else if (data === ibas.emDocumentStatus.FINISHED) {
                        return "sap-icon://status-completed";
                    }
                    else if (data === ibas.emDocumentStatus.CLOSED) {
                        return "sap-icon://status-critical";
                    }
                    else {
                        return "sap-icon://status-inactive";
                    }
                }
            });
            function negative(value) {
                if (this.getNegative() === true) {
                    if (value === ibas.emYesNo.NO) {
                        return ibas.emYesNo.YES;
                    }
                    else {
                        return ibas.emYesNo.NO;
                    }
                }
                return value;
            }
            /**
             * 对象是否状态
             */
            m.ObjectEnumStatus.extend("sap.extension.m.ObjectYesNoStatus", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any", defalut: ibas.emYesNo },
                        /** 相反的 */
                        negative: { type: "boolean", defalut: false },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 转为状态值
                 * @param data 枚举值
                 */
                toState(data) {
                    if (negative.call(this, data) === ibas.emYesNo.NO) {
                        return sap.ui.core.ValueState.Error;
                    }
                    else {
                        return sap.ui.core.ValueState.Success;
                    }
                },
                /**
                 * 转为图标值
                 * @param data 枚举值
                 */
                toIcon(data) {
                    if (negative.call(this, data) === ibas.emYesNo.NO) {
                        return "sap-icon://sys-cancel";
                    }
                    else {
                        return "sap-icon://sys-enter";
                    }
                }
            });
            /**
             * 对象审批状态
             */
            m.ObjectEnumStatus.extend("sap.extension.m.ObjectApprovalStatus", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any", defalut: ibas.emApprovalStatus },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 转为状态值
                 * @param data 枚举值
                 */
                toState(data) {
                    if (data === ibas.emApprovalStatus.APPROVED) {
                        return sap.ui.core.ValueState.Success;
                    }
                    else if (data === ibas.emApprovalStatus.CANCELLED) {
                        return sap.ui.core.ValueState.Error;
                    }
                    else if (data === ibas.emApprovalStatus.PROCESSING) {
                        return sap.ui.core.ValueState.Information;
                    }
                    else if (data === ibas.emApprovalStatus.REJECTED) {
                        return sap.ui.core.ValueState.Error;
                    }
                    else {
                        return sap.ui.core.ValueState.None;
                    }
                },
                /**
                 * 转为图标值
                 * @param data 枚举值
                 */
                toIcon(data) {
                    if (data === ibas.emApprovalStatus.APPROVED) {
                        return "sap-icon://accept";
                    }
                    else if (data === ibas.emApprovalStatus.CANCELLED) {
                        return "sap-icon://cancel";
                    }
                    else if (data === ibas.emApprovalStatus.PROCESSING) {
                        return "sap-icon://status-in-process";
                    }
                    else if (data === ibas.emApprovalStatus.REJECTED) {
                        return "sap-icon://decline";
                    }
                    else {
                        return "sap-icon://status-positive";
                    }
                }
            });
            /**
             * 对象状态
             */
            m.ObjectEnumStatus.extend("sap.extension.m.ObjectBOStatus", {
                metadata: {
                    properties: {
                        /** 枚举类型 */
                        enumType: { type: "any", defalut: ibas.emBOStatus },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 转为状态值
                 * @param data 枚举值
                 */
                toState(data) {
                    if (data === ibas.emBOStatus.OPEN) {
                        return sap.ui.core.ValueState.Information;
                    }
                    else {
                        return sap.ui.core.ValueState.Success;
                    }
                },
                /**
                 * 转为图标值
                 * @param data 枚举值
                 */
                toIcon(data) {
                    if (data === ibas.emBOStatus.OPEN) {
                        return "sap-icon://status-in-process";
                    }
                    else {
                        return "sap-icon://status-critical";
                    }
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 对象数值
             */
            sap.m.ObjectNumber.extend("sap.extension.m.ObjectNumber", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 表格
             */
            sap.m.Table.extend("sap.extension.m.Table", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                /** 退出 */
                exit() {
                    let model = this.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        model.destroy();
                    }
                    sap.m.Table.prototype.exit.apply(this, arguments);
                }
            });
            /**
             * 表格列
             */
            sap.m.Column.extend("sap.extension.m.Column", {
                metadata: {
                    properties: {},
                    events: {}
                },
                /** 重构设置 */
                applySettings(mSettings, oScope) {
                    if (mSettings) {
                        if (typeof mSettings.header === "string") {
                            mSettings.header = new sap.m.Text("", {
                                text: mSettings.header
                            });
                        }
                    }
                    return sap.m.Column.prototype.applySettings.apply(this, arguments);
                }
            });
            /**
             * 数据表格
             */
            m.Table.extend("sap.extension.m.DataTable", {
                metadata: {
                    properties: {
                        /** 数据信息 */
                        dataInfo: { type: "any" },
                        /** 属性过滤器 */
                        propertyFilter: { type: "function" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取数据信息
                 */
                getDataInfo() {
                    return this.getProperty("dataInfo");
                },
                /**
                 * 设置数据信息
                 * @param value 数据信息
                 */
                setDataInfo(value) {
                    return this.setProperty("dataInfo", value);
                },
                /**
                 * 获取属性过滤器
                 */
                getPropertyFilter() {
                    return this.getProperty("propertyFilter");
                },
                /**
                 * 设置属性过滤器
                 * @param value 过滤器
                 */
                setPropertyFilter(value) {
                    return this.setProperty("propertyFilter", value);
                },
                /** 重构设置 */
                applySettings() {
                    m.Table.prototype.applySettings.apply(this, arguments);
                    let dataInfo = this.getDataInfo();
                    if (typeof dataInfo === "string") {
                        dataInfo = {
                            code: dataInfo,
                        };
                    }
                    else if (typeof dataInfo === "function") {
                        dataInfo = {
                            code: dataInfo.BUSINESS_OBJECT_CODE,
                            name: ibas.objects.nameOf(dataInfo),
                        };
                    }
                    if (typeof dataInfo === "object") {
                        if (dataInfo.properties instanceof Array) {
                            propertyColumns.call(this, dataInfo);
                        }
                        else {
                            let info = dataInfo;
                            let boRepository = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                            boRepository.fetchBOInfos({
                                boCode: ibas.config.applyVariables(info.code),
                                boName: info.name,
                                onCompleted: (opRslt) => {
                                    if (opRslt.resultCode !== 0) {
                                        ibas.logger.log(new Error(opRslt.message));
                                    }
                                    else {
                                        propertyColumns.call(this, opRslt.resultObjects.firstOrDefault());
                                    }
                                }
                            });
                        }
                    }
                    return this;
                },
                /**
                 * 设置模型
                 * @param oModel 数据模型
                 * @param sName 名称
                 */
                setModel(oModel, sName) {
                    let model = this.getModel();
                    // 判断是否有有效模型
                    if (model && model.getData()) {
                        let data = model.getData();
                        if (!(data.rows instanceof Array && data.rows.length > 0)) {
                            model = undefined;
                        }
                    }
                    // 没有设置过模型，则更新控件绑定信息
                    if (ibas.objects.isNull(model) && !ibas.objects.isNull(oModel)) {
                        // 获取对象信息
                        let data = oModel.getData();
                        if (data instanceof Array) {
                            data = data[0];
                        }
                        else if (data.rows instanceof Array) {
                            data = data.rows[0];
                        }
                        if (!ibas.objects.isNull(data)) {
                            let userFields = data.userFields;
                            if (!ibas.objects.isNull(userFields)) {
                                let bindingInfo = this.getBindingInfo("items");
                                if (bindingInfo && bindingInfo.template instanceof sap.m.ColumnListItem) {
                                    let template = bindingInfo.template;
                                    for (let item of template.getCells()) {
                                        let bindingInfo = item.getBindingInfo("text");
                                        if (!ibas.objects.isNull(bindingInfo)) {
                                            extension.userfields.check(userFields, bindingInfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return m.Table.prototype.setModel.apply(this, arguments);
                }
            });
            function propertyColumns(boInfo) {
                if (!boInfo || !(boInfo.properties instanceof Array)) {
                    return;
                }
                // 查询未存在的属性
                let filter = this.getPropertyFilter();
                let properties = new ibas.ArrayList();
                for (let item of boInfo.properties) {
                    if (item.editSize <= 0) {
                        continue;
                    }
                    if (item.authorised === ibas.emAuthoriseType.NONE) {
                        continue;
                    }
                    if (filter instanceof Function) {
                        if (filter(item) === false) {
                            continue;
                        }
                    }
                    properties.add(item);
                }
                // 创建未存在的列
                let bindingInfo = this.getBindingInfo("items");
                if (bindingInfo && bindingInfo.template instanceof sap.m.ColumnListItem) {
                    let template = bindingInfo.template;
                    for (let property of properties) {
                        this.addColumn(new m.Column("", {
                            header: property.description,
                        }));
                        template.addCell(extension.factories.newComponent(property, "Object.2"));
                    }
                }
            }
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let core;
        (function (core) {
            /**
             * HTML
             */
            sap.ui.core.HTML.extend("sap.extension.core.HTML", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
            /**
             * HTML
             */
            core.HTML.extend("sap.extension.core.FrameHTML", {
                metadata: {
                    properties: {
                        /** 框架源 */
                        frameSrc: { type: "string" },
                        /** 框架宽 */
                        frameWidth: { type: "string", defaultValue: "100%" },
                        /** 框架高 */
                        frameHeight: { type: "string", defaultValue: "100%" },
                    },
                    events: {}
                },
                renderer: {},
                /**
                 * 获取框架标识
                 */
                getFrameId() {
                    return ibas.strings.format("{0}_frame", this.getId());
                },
                /**
                 * 设置框架源
                 * @param value 值
                 */
                setFrameSrc(value) {
                    let url = this.getFrameSrc();
                    if (!ibas.strings.isEmpty(url)) {
                        URL.revokeObjectURL(url);
                    }
                    if (value instanceof Blob) {
                        url = URL.createObjectURL(value);
                    }
                    else {
                        url = value;
                    }
                    if (!ibas.strings.isEmpty(url)) {
                        let iframe = new ibas.StringBuilder();
                        iframe.append("<iframe");
                        iframe.append(" id=\"");
                        iframe.append(this.getFrameId());
                        iframe.append("\"");
                        iframe.append(" width=\"");
                        iframe.append(this.getFrameWidth());
                        iframe.append("\"");
                        iframe.append(" height=\"");
                        iframe.append(this.getFrameHeight());
                        iframe.append("\"");
                        iframe.append(" src=\"");
                        iframe.append(url);
                        iframe.append("\"");
                        iframe.append(" frameborder=\"no\"");
                        iframe.append(" border=\"0\"");
                        // iframe.append(" scrolling=\"no\"");
                        iframe.append(">");
                        iframe.append("</iframe>");
                        this.setContent(iframe.toString());
                    }
                    this.setProperty("frameSrc", url);
                    return this;
                },
                setContent(value) {
                    let url = this.getFrameSrc();
                    if (!ibas.strings.isEmpty(url)) {
                        URL.revokeObjectURL(url);
                    }
                    return core.HTML.prototype.setContent.apply(this, arguments);
                },
                /** 退出 */
                exit() {
                    let url = this.getFrameSrc();
                    if (!ibas.strings.isEmpty(url)) {
                        URL.revokeObjectURL(url);
                    }
                    core.HTML.prototype.exit.apply(this, arguments);
                }
            });
        })(core = extension.core || (extension.core = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            let MessageBox;
            (function (MessageBox) {
                function error(vMessage, mOptions) {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.ERROR,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.ERROR) {
                        mOptions.type = ibas.emMessageType.ERROR;
                    }
                    show(vMessage, mOptions);
                }
                MessageBox.error = error;
                function information(vMessage, mOptions) {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.INFORMATION,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.INFORMATION) {
                        mOptions.type = ibas.emMessageType.INFORMATION;
                    }
                    show(vMessage, mOptions);
                }
                MessageBox.information = information;
                function success(vMessage, mOptions) {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.SUCCESS,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.SUCCESS) {
                        mOptions.type = ibas.emMessageType.SUCCESS;
                    }
                    show(vMessage, mOptions);
                }
                MessageBox.success = success;
                function warning(vMessage, mOptions) {
                    if (ibas.objects.isNull(mOptions)) {
                        mOptions = {
                            type: ibas.emMessageType.WARNING,
                        };
                    }
                    if (mOptions.type !== ibas.emMessageType.WARNING) {
                        mOptions.type = ibas.emMessageType.WARNING;
                    }
                    show(vMessage, mOptions);
                }
                MessageBox.warning = warning;
                function show(vMessage, mOptions) {
                    jQuery.sap.require("sap.m.MessageBox");
                    if (!ibas.strings.isEmpty(vMessage)) {
                        vMessage = vMessage.replace(/\{(.+?)\}/g, function (value) {
                            return ibas.businessobjects.describe(value);
                        });
                    }
                    sap.m.MessageBox.show(vMessage, {
                        title: mOptions.title,
                        icon: toMessageBoxIcon(mOptions.type),
                        actions: toMessageBoxAction(mOptions.actions),
                        onClose(oAction) {
                            if (mOptions.onCompleted instanceof Function) {
                                mOptions.onCompleted(toMessageAction(oAction));
                            }
                        }
                    });
                }
                MessageBox.show = show;
                /** 转换消息类型值  */
                function toMessageBoxIcon(data) {
                    switch (data) {
                        case ibas.emMessageType.ERROR:
                            return sap.m.MessageBox.Icon.ERROR;
                        case ibas.emMessageType.INFORMATION:
                            return sap.m.MessageBox.Icon.INFORMATION;
                        case ibas.emMessageType.QUESTION:
                            return sap.m.MessageBox.Icon.QUESTION;
                        case ibas.emMessageType.SUCCESS:
                            return sap.m.MessageBox.Icon.SUCCESS;
                        case ibas.emMessageType.WARNING:
                            return sap.m.MessageBox.Icon.WARNING;
                        default:
                            return sap.m.MessageBox.Icon.NONE;
                    }
                }
                /** 转换消息框动作值 */
                function toMessageBoxAction(data) {
                    let toValue = function (data) {
                        switch (data) {
                            case ibas.emMessageAction.ABORT:
                                return sap.m.MessageBox.Action.ABORT;
                            case ibas.emMessageAction.CANCEL:
                                return sap.m.MessageBox.Action.CANCEL;
                            case ibas.emMessageAction.CLOSE:
                                return sap.m.MessageBox.Action.CLOSE;
                            case ibas.emMessageAction.DELETE:
                                return sap.m.MessageBox.Action.DELETE;
                            case ibas.emMessageAction.IGNORE:
                                return sap.m.MessageBox.Action.IGNORE;
                            case ibas.emMessageAction.NO:
                                return sap.m.MessageBox.Action.NO;
                            case ibas.emMessageAction.RETRY:
                                return sap.m.MessageBox.Action.RETRY;
                            case ibas.emMessageAction.YES:
                                return sap.m.MessageBox.Action.YES;
                            default:
                                return sap.m.MessageBox.Action.OK;
                        }
                    };
                    if (data instanceof Array) {
                        let values = [];
                        for (let item of data) {
                            values.push(toValue(item));
                        }
                        return values;
                    }
                    else {
                        return toValue(data);
                    }
                }
                /** 回转消息框值 */
                function toMessageAction(data) {
                    switch (data) {
                        case sap.m.MessageBox.Action.ABORT:
                            return ibas.emMessageAction.ABORT;
                        case sap.m.MessageBox.Action.CANCEL:
                            return ibas.emMessageAction.CANCEL;
                        case sap.m.MessageBox.Action.CLOSE:
                            return ibas.emMessageAction.CLOSE;
                        case sap.m.MessageBox.Action.DELETE:
                            return ibas.emMessageAction.DELETE;
                        case sap.m.MessageBox.Action.IGNORE:
                            return ibas.emMessageAction.IGNORE;
                        case sap.m.MessageBox.Action.NO:
                            return ibas.emMessageAction.NO;
                        case sap.m.MessageBox.Action.RETRY:
                            return ibas.emMessageAction.RETRY;
                        case sap.m.MessageBox.Action.YES:
                            return ibas.emMessageAction.YES;
                        default:
                            return ibas.emMessageAction.OK;
                    }
                }
            })(MessageBox = m.MessageBox || (m.MessageBox = {}));
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 分词器
             */
            sap.m.Tokenizer.extend("sap.extension.m.Tokenizer", {
                metadata: {
                    properties: {
                        /** 绑定值 */
                        bindingValue: { type: "string" },
                    },
                    events: {}
                },
                renderer: {},
            });
            /**
             * 业务对象Tokenizer
             * 字符串以separator分隔,显示token
             */
            m.Tokenizer.extend("sap.extension.m.TokenizerSeparator", {
                metadata: {
                    properties: {
                        /** 分隔符 */
                        separator: { type: "string", defaultValue: "," },
                    },
                    events: {
                        "deleteToken": {
                            parameters: {}
                        }
                    },
                },
                renderer: {},
                /**
                 * 加载业务对象集合
                 * @param selecteds 业务对象KeyText集合
                 */
                loadTokens(items) {
                    this.removeAllTokens();
                    if (items instanceof Array) {
                        let that = this;
                        for (let item of items) {
                            if (!(item instanceof ibas.KeyText)) {
                                continue;
                            }
                            this.addToken(new sap.m.Token("", {
                                key: item.key,
                                text: item.text,
                                deselect: function () {
                                    that.setBindingValue(that.getBindingValue());
                                },
                                delete: function (event) {
                                    let token = event.getSource();
                                    if (token instanceof sap.m.Token) {
                                        let tokens = that.getBindingValue().split(that.getSeparator());
                                        let separator = that.getSeparator();
                                        let key = token.getKey();
                                        let builder = new ibas.StringBuilder();
                                        builder.map(undefined, "");
                                        builder.map(null, "");
                                        for (let item of tokens) {
                                            if (item === key) {
                                                continue;
                                            }
                                            if (builder.length > 0) {
                                                builder.append(separator);
                                            }
                                            builder.append(item);
                                        }
                                        that.setBindingValue(builder.toString());
                                        that.fireDeleteToken();
                                    }
                                }
                            }));
                        }
                    }
                },
                setBindingValue(value) {
                    if (!ibas.strings.isEmpty(value)) {
                        let values = new ibas.ArrayList();
                        for (let text of value.split(this.getSeparator())) {
                            if (ibas.strings.isEmpty(text)) {
                                continue;
                            }
                            values.add(new ibas.KeyText(text));
                        }
                        this.loadTokens(values);
                    }
                    else {
                        this.removeAllTokens();
                    }
                    this.setProperty("bindingValue", value);
                },
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 导航控件
             */
            sap.m.Wizard.extend("sap.extension.m.Wizard", {
                metadata: {
                    properties: {},
                    events: {
                        // 导航跳转时触发事件，step参数为跳转的步骤
                        "toStep": {
                            parameters: {
                                items: {
                                    step: sap.m.WizardStep
                                }
                            }
                        }
                    }
                },
                renderer: {},
                _handleStepChanged: function (event) {
                    let previousStepIndex = ((typeof event === "number") ? event : event.getParameter("current")) - 2;
                    let previousStep = this._stepPath[previousStepIndex];
                    let subsequentStep = this._getNextStep(previousStep, previousStepIndex);
                    let focusFirstElement = sap.ui.Device.system.desktop ? true : false;
                    this.goToStep(subsequentStep, focusFirstElement);
                    // 从标签点击步骤时，event类型为标签的object类型，只有标签点击时触发自定义事件
                    if (typeof event !== "number") {
                        this.fireToStep({ step: subsequentStep });
                    }
                },
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let f;
        (function (f) {
            /**
             * 卡片
             */
            sap.f.Card.extend("sap.extension.f.Card", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
            });
            /**
             * 卡片-工具条头
             */
            sap.f.cards.Header.extend("sap.extension.f.cards.ToolbarHeader", {
                metadata: {
                    properties: {},
                    aggregations: {
                        "toolbar": { type: "sap.m.Toolbar", multiple: false },
                    },
                    events: {},
                },
                renderer(oRm, oControl) {
                    let sStatus = oControl.getStatusText();
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    //  oRm.writeAttribute("tabindex", "0");
                    oRm.write(">");
                    oRm.write("<div");
                    oRm.addClass("sapFCardHeader");
                    // accessibility state
                    oRm.writeAccessibilityState(oControl, {
                        role: "group",
                        labelledby: { value: oControl._getHeaderAccessibility(), append: true },
                    });
                    oRm.writeClasses();
                    oRm.write(">");
                    if (oControl.getIconSrc() || oControl.getIconInitials()) {
                        oRm.renderControl(oControl._getAvatar());
                    }
                    if (oControl.getTitle()) {
                        oRm.write("<div");
                        oRm.addClass("sapFCardHeaderText");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<div");
                        oRm.addClass("sapFCardHeaderTextFirstLine");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.write("<div");
                        oRm.addClass("sapFCardHeaderTitle");
                        oRm.writeClasses();
                        oRm.write(">");
                        oRm.renderControl(oControl._getTitle());
                        oRm.write("</div>");
                        if (sStatus) {
                            oRm.write("<span");
                            oRm.addClass("sapFCardStatus");
                            oRm.writeClasses();
                            oRm.write(">");
                            oRm.writeEscaped(sStatus, undefined);
                            oRm.write("</span>");
                        }
                        oRm.write("</div>");
                        if (oControl.getSubtitle()) {
                            oRm.renderControl(oControl._getSubtitle());
                        }
                        oRm.write("</div>");
                    }
                    oRm.write("</div>");
                    if (oControl.getToolbar()) {
                        oRm.write("<div");
                        oRm.addStyle("padding", "0 0.75rem 0.5rem 0.75rem");
                        oRm.writeStyles();
                        oRm.write(">");
                        oRm.renderControl(oControl.getToolbar());
                        oRm.write("</div>");
                    }
                    oRm.write("</div>");
                },
                /** 重构设置 */
                applySettings(mSetting) {
                    if (mSetting && mSetting.toolbar instanceof sap.m.Toolbar) {
                        let toolbar = mSetting.toolbar;
                        toolbar.setStyle(sap.m.ToolbarStyle.Clear);
                        toolbar.setDesign(sap.m.ToolbarDesign.Auto);
                    }
                    sap.f.cards.Header.prototype.applySettings.apply(this, arguments);
                    return this;
                },
            });
        })(f = extension.f || (extension.f = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        let m;
        (function (m) {
            /**
             * 对话框
             */
            sap.m.Dialog.extend("sap.extension.m.Dialog", {
                metadata: {
                    properties: {},
                    events: {}
                },
                renderer: {},
                onAfterRendering() {
                    sap.m.Dialog.prototype.onAfterRendering.apply(this, arguments);
                    let dom = this.$("scrollCont");
                    if (dom) {
                        dom.css("padding", "0rem");
                    }
                }
            });
        })(m = extension.m || (extension.m = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
var sap;
(function (sap) {
    let extension;
    (function (extension) {
        /** 组件工厂 */
        let factories;
        (function (factories) {
            /**
             * 创建属性组件
             * @param property 属性信息
             * @param textView 文本视图
             */
            function newComponent(property, mode) {
                // 创建绑定信息
                let bindInfo = {
                    path: property.property[0].toLowerCase() + property.property.substring(1)
                };
                if (property.property === "DocumentStatus" || property.property === "LineStatus") {
                    bindInfo.type = new sap.extension.data.DocumentStatus(mode === "Text" ? true : false);
                }
                else if (property.property === "ApprovalStatus") {
                    bindInfo.type = new sap.extension.data.ApprovalStatus(mode === "Text" ? true : false);
                }
                else if (property.property === "Direction") {
                    bindInfo.type = new sap.extension.data.Direction(mode === "Text" ? true : false);
                }
                else if (property.property === "Canceled" || property.property === "Referenced"
                    || property.property === "Locked" || property.property === "Transfered"
                    || property.property === "Activated" || property.property === "Deleted") {
                    bindInfo.type = new sap.extension.data.YesNo(mode === "Text" ? true : false);
                }
                else if (property.dataType === "Numeric") {
                    bindInfo.type = new sap.extension.data.Numeric();
                }
                else if (property.dataType === "Date") {
                    if (property.editType === "Time") {
                        bindInfo.type = new sap.extension.data.Time();
                    }
                    else {
                        bindInfo.type = new sap.extension.data.Date();
                    }
                }
                else if (property.dataType === "Decimal") {
                    if (property.editType === "Rate") {
                        bindInfo.type = new sap.extension.data.Rate();
                    }
                    else if (property.editType === "Sum") {
                        bindInfo.type = new sap.extension.data.Sum();
                    }
                    else if (property.editType === "Price") {
                        bindInfo.type = new sap.extension.data.Price();
                    }
                    else if (property.editType === "Quantity") {
                        bindInfo.type = new sap.extension.data.Quantity();
                    }
                    else if (property.editType === "Percentage") {
                        bindInfo.type = new sap.extension.data.Percentage();
                    }
                    else if (property.editType === "Measurement") {
                        bindInfo.type = new sap.extension.data.Measurement();
                    }
                    else {
                        bindInfo.type = new sap.extension.data.Decimal();
                    }
                }
                else {
                    bindInfo.type = new sap.extension.data.Alphanumeric();
                }
                if (mode === "Text") {
                    if (property.values instanceof Array && property.values.length > 0) {
                        // 可选值
                        bindInfo.type = new sap.extension.data.Unknown({
                            formatValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.value === oValue) {
                                            return item.description;
                                        }
                                    }
                                }
                                return oValue;
                            },
                            parseValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.description === oValue) {
                                            return item.value;
                                        }
                                    }
                                }
                                return oValue;
                            }
                        });
                    }
                    return new sap.extension.m.Text("", {}).bindProperty("bindingValue", bindInfo);
                }
                else if (mode === "Input") {
                    if (bindInfo.type instanceof sap.extension.data.Date) {
                        return new sap.extension.m.DatePicker("", {
                            editable: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                        }).bindProperty("bindingValue", bindInfo);
                    }
                    else if (bindInfo.type instanceof sap.extension.data.Time) {
                        return new sap.extension.m.TimePicker("", {
                            editable: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                        }).bindProperty("bindingValue", bindInfo);
                    }
                    else if (bindInfo.type instanceof sap.extension.data.Decimal) {
                        return new sap.extension.m.Input("", {
                            type: sap.m.InputType.Number,
                            editable: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                        }).bindProperty("bindingValue", bindInfo);
                    }
                    else if (bindInfo.type instanceof sap.extension.data.Numeric) {
                        return new sap.extension.m.Input("", {
                            type: sap.m.InputType.Number,
                            editable: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                        }).bindProperty("bindingValue", bindInfo);
                    }
                    else if (property.values instanceof Array && property.values.length > 0) {
                        let items = new ibas.ArrayList();
                        items.add(new sap.ui.core.ListItem("", {
                            key: "",
                            text: ibas.i18n.prop("openui5_please_select_data")
                        }));
                        for (let item of property.values) {
                            items.add(new sap.ui.core.ListItem("", {
                                key: item.value,
                                text: item.description
                            }));
                        }
                        return new sap.extension.m.Select("", {
                            enabled: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                            items: items
                        }).bindProperty("bindingValue", bindInfo);
                    }
                    else {
                        return new sap.extension.m.Input("", {
                            editable: property.authorised === ibas.emAuthoriseType.ALL ? true : false,
                        }).bindProperty("bindingValue", bindInfo);
                    }
                }
                else if (mode === "Object") {
                    if (property.values instanceof Array && property.values.length > 0) {
                        // 可选值
                        bindInfo.type = new sap.extension.data.Unknown({
                            formatValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.value === oValue) {
                                            return item.description;
                                        }
                                    }
                                }
                                return oValue;
                            },
                            parseValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.description === oValue) {
                                            return item.value;
                                        }
                                    }
                                }
                                return oValue;
                            }
                        });
                    }
                    return new sap.extension.m.ObjectAttribute("", {
                        title: property.description,
                        text: bindInfo,
                    });
                }
                else if (mode === "Object.2") {
                    if (property.values instanceof Array && property.values.length > 0) {
                        // 可选值
                        bindInfo.type = new sap.extension.data.Unknown({
                            formatValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.value === oValue) {
                                            return item.description;
                                        }
                                    }
                                }
                                return oValue;
                            },
                            parseValue(oValue, sInternalType) {
                                if (sInternalType === "string") {
                                    for (let item of property.values) {
                                        if (item.description === oValue) {
                                            return item.value;
                                        }
                                    }
                                }
                                return oValue;
                            }
                        });
                    }
                    return new sap.extension.m.ObjectAttribute("", {
                        text: bindInfo,
                    });
                }
                else {
                    return null;
                }
            }
            factories.newComponent = newComponent;
        })(factories = extension.factories || (extension.factories = {}));
        /** 用户字段相关 */
        let userfields;
        (function (userfields) {
            function toDbFieldType(type) {
                if (type instanceof sap.extension.data.Numeric) {
                    return ibas.emDbFieldType.NUMERIC;
                }
                else if (type instanceof sap.extension.data.Decimal) {
                    return ibas.emDbFieldType.DECIMAL;
                }
                else if (type instanceof sap.extension.data.Date) {
                    return ibas.emDbFieldType.DATE;
                }
                else if (type instanceof sap.extension.data.DateTime) {
                    return ibas.emDbFieldType.DATE;
                }
                else if (type instanceof sap.extension.data.Time) {
                    return ibas.emDbFieldType.NUMERIC;
                }
                return ibas.emDbFieldType.ALPHANUMERIC;
            }
            /**
             * 检查用户字段（注册或更新绑定信息）
             * @param bindingInfo 绑定信息
             * @param userFields 用户字段
             * @returns 是否更新绑定信息
             */
            function check(userFields, bindingInfo) {
                if (bindingInfo && bindingInfo.parts instanceof Array) {
                    for (let item of bindingInfo.parts) {
                        if (ibas.strings.isWith(item.path, "u_", undefined)) {
                            let name = item.path;
                            name = name[0].toUpperCase() + name.substring(1);
                            let userField = userFields.register(name, toDbFieldType(item.type));
                            if (!ibas.objects.isNull(userField)) {
                                let index = userFields.indexOf(userField);
                                item.path = ibas.strings.format("userFields/{0}/value", index);
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            userfields.check = check;
        })(userfields = extension.userfields || (extension.userfields = {}));
    })(extension = sap.extension || (sap.extension = {}));
})(sap || (sap = {}));
/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="./types/index.d.ts" />
/// <reference path="./datatypes.ts" />
/// <reference path="./utils.ts" />
/// <reference path="./extensions/BORepository.ts" />
/// <reference path="./extensions/Common.ts" />
/// <reference path="./extensions/DataType.ts" />
/// <reference path="./extensions/components/Model.d.ts" />
/// <reference path="./extensions/components/Model.ts" />
/// <reference path="./extensions/components/Control.d.ts" />
/// <reference path="./extensions/components/Control.ts" />
/// <reference path="./extensions/components/Input.d.ts" />
/// <reference path="./extensions/components/Input.ts" />
/// <reference path="./extensions/components/Select.d.ts" />
/// <reference path="./extensions/components/Select.ts" />
/// <reference path="./extensions/components/Text.d.ts" />
/// <reference path="./extensions/components/Text.ts" />
/// <reference path="./extensions/components/Link.d.ts" />
/// <reference path="./extensions/components/Link.ts" />
/// <reference path="./extensions/components/List.d.ts" />
/// <reference path="./extensions/components/List.ts" />
/// <reference path="./extensions/components/CheckBox.d.ts" />
/// <reference path="./extensions/components/CheckBox.ts" />
/// <reference path="./extensions/components/ComboBox.d.ts" />
/// <reference path="./extensions/components/ComboBox.ts" />
/// <reference path="./extensions/components/DateTimePicker.d.ts" />
/// <reference path="./extensions/components/DateTimePicker.ts" />
/// <reference path="./extensions/components/SegmentedButton.d.ts" />
/// <reference path="./extensions/components/SegmentedButton.ts" />
/// <reference path="./extensions/components/Switch.d.ts" />
/// <reference path="./extensions/components/Switch.ts" />
/// <reference path="./extensions/components/Table.d.ts" />
/// <reference path="./extensions/components/Table.ts" />
/// <reference path="./extensions/components/Page.d.ts" />
/// <reference path="./extensions/components/Page.ts" />
/// <reference path="./extensions/components/AddressArea.d.ts" />
/// <reference path="./extensions/components/AddressArea.ts" />
/// <reference path="./extensions/components/ObjectPageLayout.d.ts" />
/// <reference path="./extensions/components/ObjectPageLayout.ts" />
/// <reference path="./extensions/components/ObjectIdentifier.d.ts" />
/// <reference path="./extensions/components/ObjectIdentifier.ts" />
/// <reference path="./extensions/components/ObjectAttribute.d.ts" />
/// <reference path="./extensions/components/ObjectAttribute.ts" />
/// <reference path="./extensions/components/ObjectStatus.d.ts" />
/// <reference path="./extensions/components/ObjectStatus.ts" />
/// <reference path="./extensions/components/ObjectNumber.d.ts" />
/// <reference path="./extensions/components/ObjectNumber.ts" />
/// <reference path="./extensions/components/Table.m.d.ts" />
/// <reference path="./extensions/components/Table.m.ts" />
/// <reference path="./extensions/components/HTML.d.ts" />
/// <reference path="./extensions/components/HTML.ts" />
/// <reference path="./extensions/components/MessageBox.ts" />
/// <reference path="./extensions/components/Tokenizer.d.ts" />
/// <reference path="./extensions/components/Tokenizer.ts" />
/// <reference path="./extensions/components/Wizard.d.ts" />
/// <reference path="./extensions/components/Wizard.ts" />
/// <reference path="./extensions/components/Card.d.ts" />
/// <reference path="./extensions/components/Card.ts" />
/// <reference path="./extensions/components/Dialog.d.ts" />
/// <reference path="./extensions/components/Dialog.ts" />
/// <reference path="./extensions/components/Factory.ts" />
var openui5;
(function (openui5) {
    /** 配置项目-紧缩屏幕 */
    openui5.CONFIG_ITEM_COMPACT_SCREEN = "compactScreen";
    // ui 触发错误验证
    sap.ui.getCore().attachValidationError(undefined, (oEvent) => {
        let control = oEvent.getParameter("element");
        let message = oEvent.getParameter("message");
        if (control && control.setValueState) {
            control.setValueState("Error");
            if (message) {
                control.setValueStateText(message);
            }
            control.focus();
        }
    });
    // ui 触发正确验证
    sap.ui.getCore().attachValidationSuccess(undefined, (oEvent) => {
        let control = oEvent.getParameter("element");
        if (control && control.setValueState) {
            control.setValueState("None");
        }
    });
})(openui5 || (openui5 = {}));
//# sourceMappingURL=index.js.map