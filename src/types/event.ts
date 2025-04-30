export type TCustomEvent = {
  id: string;
  // 触发事件的动作
  eventAction?: EEventAction;
  // 事件的类型
  eventType?: EEventType;
  // 事件的目标
  eventTargets?: IEventTarget[];
  /**
   * 事件名称
   */
  eventName?: string;
};

export type TCustomEvents = TCustomEvent[];

export enum EEventAction {
  // 鼠标点击
  ON_CLICK = 'onClick',
  // 鼠标双击
  // ON_DOULE_CLICK = 'onDoubleClick',
  // 值发生变化
  VALUE_CHANGE = 'valueChange',
  // 聚焦
  ON_FOCUS = 'onFocus',
  // 失去焦点
  ON_BLUR = 'onBlur',
  // 组件加载后
  ON_LOADED = 'onLoaded',
  // 编辑器加载后
  FORM_LOADED = 'formLoaded',
  // 分页切换时
  PAGINATION_CHANGE = 'paginationChange',
  // 搜索
  ON_SEARCH = 'onSearch',
}
export const eventActionInChinese: Record<EEventAction, string> = {
  [EEventAction.ON_CLICK]: '鼠标单击',
  // [EEventAction.ON_DOULE_CLICK]: '鼠标双击',
  [EEventAction.VALUE_CHANGE]: '值发生变化',
  [EEventAction.ON_FOCUS]: '获得焦点',
  [EEventAction.ON_BLUR]: '失去焦点',
  [EEventAction.ON_LOADED]: '组件加载后',
  [EEventAction.FORM_LOADED]: '编辑器加载后',
  [EEventAction.PAGINATION_CHANGE]: '分页切换',
  [EEventAction.ON_SEARCH]: '搜索',
};

/**
 * 组件事件操作动作
 */
export enum EEventType {
  /**
   * 更新服务
   */
  UPDATE_SERVICE = 'refreshService',
  /**
   * 关联服务
   */
  LINK_SERVICE = 'linkService',
  /**
   * 设置组件
   */
  SETTING_VALUE = 'settingValue',
  /**
   * 表单校验
   */
  VALIDATE = 'validate',
  /**
   * 链接跳转
   */
  JMUP = 'jump',

  /**
   * 自定义js
   */
  CUSTOM_JS = 'customJs',
}

export const eventTypeChinese = {
  [EEventType.UPDATE_SERVICE]: '更新服务',
  [EEventType.LINK_SERVICE]: '关联服务',
  [EEventType.SETTING_VALUE]: '设置组件',
  [EEventType.VALIDATE]: '表单校验',
  [EEventType.JMUP]: '跳转链接',
  [EEventType.CUSTOM_JS]: '自定义js',
};

/**
 * 事件动作
 */
export enum EChangeStatePayload {
  SHOW = 'show',
  HIDDEN = 'hidden',
  // DISABLE = 'disable',
  UPDATE = 'update',
  CLEAR_DATA = 'clear_data',
  CLEAR_PARAMS = 'clear_paramsms',
  APPEND = 'append',
  SYNC = 'sync',
  REFRESH = 'refresh',
  NOT_REFRESH = 'not_refresh',
  CUSTOM = 'custom',
  SUBMIT = 'submit',
  NULL = 'null',
  RESET_PAGE = 'reset_page',
  SET_ATTRIBUTE = 'set_attribute',
  UPLOAD_SCHEMA = 'upload_schema',
}

export const changeStatePayloadInChinese = {
  [EChangeStatePayload.UPDATE]: '更新',
  [EChangeStatePayload.CLEAR_DATA]: '清空data',
  [EChangeStatePayload.CLEAR_PARAMS]: '清空params',
  [EChangeStatePayload.APPEND]: '拼接',
  [EChangeStatePayload.SYNC]: '同步表单值',
  [EChangeStatePayload.RESET_PAGE]: '重置页码',
  [EChangeStatePayload.CUSTOM]: '自定义',
  [EChangeStatePayload.REFRESH]: '刷新',
  [EChangeStatePayload.NOT_REFRESH]: '不刷新',
  [EChangeStatePayload.SUBMIT]: '提交表单',
  [EChangeStatePayload.UPLOAD_SCHEMA]: '上传Schema',
  [EChangeStatePayload.NULL]: '无',
  [EChangeStatePayload.SET_ATTRIBUTE]: '设置属性值',
  [EChangeStatePayload.SHOW]: '显示',
  [EChangeStatePayload.HIDDEN]: '隐藏',
};

export const changeStateActions = (fields: Array<EChangeStatePayload>) => {
  return fields.map((field) => ({
    label: changeStatePayloadInChinese[field],
    value: field,
  }));
};

export enum EServiceRefesh {
  REFRESH = 1,
  NOT_REFRESH = 0,
}
export const refreshOptions = [
  { label: '刷新', value: EServiceRefesh.REFRESH },
  { label: '不刷新', value: EServiceRefesh.NOT_REFRESH },
];
export enum ELinkRefreshType {
  FIELDVALUE = 'fieldValue',
  OPTIONS = 'options',
  CUSTOMFIELD = 'customField',
  CUSTOMJS = 'customJs',
}
export const linkRefreshFieldOptions = [
  { label: '表单值', value: ELinkRefreshType.FIELDVALUE },
  { label: '选项', value: ELinkRefreshType.OPTIONS },
  { label: '自定义属性', value: ELinkRefreshType.CUSTOMFIELD },
  { label: '自定义js', value: ELinkRefreshType.CUSTOMJS },
];
export enum EValidateRange {
  CURRENT = 'current',
  ALL = 'all',
  CUSTOM = 'custom',
}
export const validateTypeOptions = [
  { label: '当前组件', value: EValidateRange.CURRENT },
  { label: '表单', value: EValidateRange.ALL },
  { label: '自定义', value: EValidateRange.CUSTOM },
];

export enum EDelay {
  THROTTLE = 'throttle',
  DEBOUNCE = 'debounce',
}

export const delayOptions = [
  { label: '防抖', value: EDelay.DEBOUNCE },
  { label: '节流', value: EDelay.THROTTLE },
];
export interface IEventTarget {
  id: string;

  /**
   * 目标组件id
   */
  targetElementId?: string;
  /**
   * 事件源id
   */
  sourceId: string;
  /**
   * 目标服务id
   */
  targetServiceId?: string;
  /**
   * 目标执行动作
   */
  targetPayload?: EChangeStatePayload;
  /**
   * 是否刷新服务
   */
  refreshFlag?: EServiceRefesh;
  /**
   * 服务更新的参数字段
   * */
  updateField?: string;
  /**
   * 关联服务时的组件更新字段
   */
  customRefreshField?: string;
  /**
   * 服务url拼接参数
   * */
  urlAppended?: string;
  /**
   * 表单校验范围
   */
  validateRange?: EValidateRange;
  /**
   * 表单检验自定义组件
   */
  validateFields?: string[];
  /**
   * 设置关联服务后，刷新服务需要更新的字段
   */
  linkRefreshType?: ELinkRefreshType;
  /**
   * 设置关联服务后，获取服务返回的字段值 比如data.a.b
   */
  getFieldFromService?: string;
  /**
   * 串联执行，如果设置为true, 同配置列表下后面的事件会等待此事件执行完成
   */
  series?: boolean;
  /**
   * 防抖或节流
   */
  delayType?: 'throttle' | 'debounce';
  delayTime?: number;
  /**
   * 链接跳转
   */
  jumpUrl?: string;
  /**
   * 新窗口打开
   */
  newWindow?: boolean;

  /**
   * 自定义js
   */
  customJs?: string;
  /**
   * 是否立即执行
   */
  immediately?: boolean;
  /**
   * 触发值(值发生变化时的触发值)
   */
  triggerValue?: any;
}
