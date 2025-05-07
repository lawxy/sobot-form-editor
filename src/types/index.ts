export * from './event';
export * from './service';
export * from '../store/types';

import type { FC, ReactNode } from 'react';
import type { FormInstance, FormProps } from 'antd';
import type { FormItemProps } from 'antd';
import type { TCustomEvents } from './event';
import type { TFormSerives } from './service';
import { EEventAction } from './event';
import type { IBaseStore, IExtendStore } from '../store/types';

export interface IDragElementProp {
  type: string;
  render: FC<any>;
  setting: FC<any>;
  text: string;
  eventActions: EEventAction[];
  initialData: Partial<IBaseElement>;
  Icon: ReactNode;
}
export type TDragElementObject = Record<
  IDragElementProp['type'],
  IDragElementProp
>;
export type TElementSearch = string | { id?: string; fieldName?: string };
export type TDragElement = TDragElementObject | IDragElementProp[];
export type TextWithLang = { langText: string; langKey: string, params?: Record<string, any> } | string;
export type TDirection = 'vertical' | 'horizontal';
export type TMode = 'design' | 'form';
export type TOption = {
  label: TextWithLang;
  value: string | number;
  id?: string;
};
export type TCustomPreset = {
  label: TextWithLang;
  startDate: string;
  endDate: string;
  id?: string;
};
export type TPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export type TColumn = {
  id: string;
  title: TextWithLang;
  dataIndex: string;
  fixed: '' | 'left' | 'right';
  width?: number;
  align: 'left' | 'right' | 'center';
  valueType?: string;
  options?: TOption[];
};
export enum EChangeType {
  ADD = 'add',
  EDIT = 'edit',
}
export type TPattern = {
  id?: string;
  name: string;
  regexp?: string;
  message: TextWithLang;
  enable: boolean;
  required?: boolean;
};

export type TAlign = 'top' | 'middle' | 'bottom';

export type TJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around';

export enum EDateMode {
  NOW = 'now',
  PICKER = 'picker',
  CUSTOM = 'custom',
}

export enum EDateRangeType {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export interface IBaseElement {
  /**
   * 父节点id
   */
  parentId?: string;
  /**
   * 水平间距
   */
  horizontalGap?: number;
  /**
   * 垂直间距
   */
  verticalGap?: number;
  /**
   * 水平对齐方式
   */
  justify?: TJustify;
  /**
   * 垂直对齐方式
   */
  align?: TAlign;
  /**
   * 元素类型
   */
  type?: string;
  /**
   * 元素名称
   */
  elementName?: TextWithLang;
  /**
   * 是否为表单项
   */
  isFormItem?: boolean;
  /**
   * 字段名
   */
  fieldName?: string;
  /**
   * 是否显示字段提示
   */
  tooltip?: TextWithLang;
  /**
   * 是否显示冒号
   */
  colon?: boolean;
  /**
   * 显示元素名称
   */
  showElementName?: boolean;
  /**
   * 元素id
   */
  id?: string;
   /**
   * 是否隐藏 事件触发
   */
  hidden?: boolean;
  /**
   * 默认值
   */
  defaultValue?: any;
  /**
   * 采用栅格布局
   */
  gridLayout?: boolean;
  /**
   * 元素栅格
   */
  gridSpan?: number;
  /**
   * 元素偏移
   */
  gridOffset?: number;
  /**
   * 日期元素格式
   */
  dateFormat?: string;
  /**
   * 日期选择器类型
   */
  datePickerType?: '' | 'year' | 'month' | 'week' | 'quarter';
  /**
   * 文本类型
   */
  textType?: 'single' | 'multiple' | 'password';
  /**
   * 前缀或者标题
   */
  addonBefore?: TextWithLang;
  /**
   * 后缀
   */
  addonAfter?: TextWithLang;
  /**
   * 是否显示字数
   */
  showCount?: boolean;
  /**
   * placeholder
   */
  placeholder?: TextWithLang;
  /**
   * 自定义css
   */
  customCss?: string;
  /**
   * 最小行数
   */
  minRows?: number;
  /**
   * 最大行数
   */
  maxRows?: number;
  /**
   * 最小数
   */
  minNum?: number;
  /**
   * 最大数
   */
  maxNum?: number;
  /**
   * 自适应行数
   */
  autoSize?: boolean;
  /**
   * 元素名称（标签名称）对齐方式
   */
  elementNameDisplay?: TDirection;
  /**
   * 数据类型
   */
  valueType?: 'int' | 'one_decimal' | 'two_decimal';
  /**
   * 选项
   */
  options?: TOption[];
  /**
   * 容器主轴方向 | 选项排列方式
   */
  direction?: TDirection;
  /**
   * 开关开启的值
   */
  openValue?: string;
  /**
   * 开关关闭的值
   */
  closeValue?: string;
  /**
   * 事件
   */
  events?: TCustomEvents;
  /**
   * 按钮文案
   */
  text?: TextWithLang;
  /**
   * 按钮大小
   */
  size?: 'large' | '' | 'small' | 'mini';
  /**
   * 按钮类型
   */
  btnType?: 'primary' | '' | 'dashed' | 'link' | 'text';
  /**
   * 自定义正则
   */
  regExps?: TPattern[];
  /**
   * 关联的服务id
   */
  linkServices?: string[];
  /**
   * 上传地址
   */
  uploadUrl?: string;
  /**
   * 支持预览
   */
  preview?: boolean;
  /**
   * 预览地址
   */
  previewSrc?: string;
  /**
   * tabs类型
   */
  tabType?: 'line' | 'card' | 'split';
  /**
   * 是否属于容器组件
   */
  isContainer?: boolean;
  /**
   * 是否为子容器, 兼容antd的bug
   */
  subContainer?: boolean;
  /**
   * 组合式组件 比如select-input
   */
  isGroup?: boolean;
  /**
   * 子节点
   */
  children?: Array<IBaseElement>;
  /**
   * 组件关联服务时的loading
   */
  linkLoading?: boolean;
  /**
   * 下拉是否多选
   */
  multiple?: boolean;
  /**
   * 允许清空输入(选择)框
   */
  allowClear?: boolean;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 列表列
   */
  columns?: TColumn[];
  /**
   * 横向滚动宽度
   */
  scrollX?: string | number;
  /**
   * 纵向滚动高度
   */
  scrollY?: string | number;
  /**
   * 是否分页
   */
  pagination?: boolean;
  /**
   * 分页条数
   */
  pageSize?: number;
  /**
   * 表格数据总条数
   */
  total?: number;
  /**
   * 当前页数
   */
  current?: number;
  /**
   * tab 下划线
   */
  underline?: boolean;
  /**
   * 是否可以搜索
   */
  canSearch?: boolean;
  /**
   * select标签包裹样式
   */
  labelWrapperStyle?: string;
  /**
   * 多选是否以文本形式展示
   */
  tagRenderText?: boolean;
  /**
   * 是否使用分组
   */
  useGroup?: boolean;
  /**
   * 是否半选
   */
  indeterminate?: boolean;
  /**
   * 位置
   */
  placement?: TPlacement;

  /**
   * 开始日期默认值模式
   */
  startDateMode?: EDateMode;
  /**
   * 开始日期默认值
   */
  startDate?: string;
  /**
   * 开始日期默认值 - 自定义
   */
  startDateCustom?: string;
  /**
   * 结束日期默认值模式
   */
  endDateMode?: EDateMode;
  /**
   * 结束日期默认值
   */
  endDate?: string;
  /**
   * 结束日期默认值 - 自定义
   */
  endDateCustom?: string;
  /**
   * 时间选择类型是否为范围选择
   */
  timeRange?: boolean;
  /**
   * 开始日期/时间默认值 - 暗文本提示
   */
  startPlaceholder?: TextWithLang;
  /**
   * 结束日期/时间默认值 - 暗文本提示
   */
  endPlaceholder?: TextWithLang;
  /**
   * 日期范围版本
   */
  dateRangeVersion?: 'default' | 'v2';
  /**
   * 日期范围自定义格式
   */
  dateRangeType?: EDateRangeType;
  /**
   * 日期范围预设
   */
  datePresets?: string[];
  /**
   * 日期范围自定义
   */
  customPresets?: Array<TCustomPreset>;
  /**
   * 自定义属性 - 前端扩展使用
   */
  // extendProps?: Record<string, any>;
  /**
   * 表单项属性
   */
  // extendFormItem?: FormItemProps;
  /**
   * 文本框 是否可切换
   */
  toggle?: boolean;
  /**
   * 表格行key
   */ 
  rowKey?: string;
}
export interface IFormAttributesProps {
  editorName?: string;
  id?: string;
  horizontalGap: number;
  verticalGap: number;
  events?: TCustomEvents;
  customCss?: string;
  justify?: TJustify;
  align?: TAlign;
  layout?: 'horizontal' | 'vertical';
  /**
   * 自定义表单Form属性 - 前端扩展使用
   */
  // extendForm?: FormProps;
}

export interface IFormSchema {
  formElements?: IBaseElement[];
  fieldsValue?: Record<string, any>;
  editorAttrs?: IFormAttributesProps;
  formServices?: TFormSerives;
}

export type TElementProps = {
  element: IBaseElement;
  customStyle: CSSProperties;
  fieldValue: any;
  LOCALE: Record<string, string>;
  extendProps: Record<string, any>;
  setFieldValue: (value: any) => void;
  setElementProp: <T extends keyof IBaseElement>(
    field: T,
    value: IBaseElement[T],
  ) => void;
};
export type TElementRender = FC<TElementProps>;
export type TElementSetting = FC<{
  element: IBaseElement;
  setElementProp: IBaseStore['setSelectedProp'];
  setFieldValue: (value: any) => void;
}>;

export interface IEditorInstance {
  getSchema: IBaseStore['getSchema'];
  getElement: (search?: TElementSearch) => Promise<IBaseElement | undefined>;

  // 表单
  form: FormInstance;
  getFieldValue: IBaseStore['getFieldValue'];
  getFieldsValue: IBaseStore['getFieldsValue'];
  setFieldValue: IBaseStore['setFieldValue'];
  setFieldsValue: IBaseStore['setFieldsValue'];
  // 扩展
  /**
   * 监听服务结果
  */
  extendServiceEmitter: IExtendStore['extendServiceEmitter'];
  /**
   * 扩展表单属性
  */
  extendFormAttr: (key: keyof FormProps, value: any) => void;
  extendFormAttrs: (extend: FormProps) => void;
  extendFormItemAttr: (
    search: TElementSearch,
    key: keyof FormItemProps,
    value: any,
  ) => void;
  extendFormItemAttrs: (search: TElementSearch, extend: FormItemProps) => void;
  extendElementAttr: (search: TElementSearch, key: string, value: any) => void;
  extendElementAttrs: (
    search: TElementSearch,
    extend: Record<string, any>,
  ) => void;

  /**
   * 只触发服务，返回结果
  */
  triggerService: (serviceId: string) => Promise<any>;
  /**
   * 触发服务且执行关联事件，返回结果
  */
  triggerLinkingService: ({serviceId, eventValue}: {serviceId: string, eventValue: any}) => Promise<void>;
}