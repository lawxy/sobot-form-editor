import { EEventAction } from '@sobot/form-editor';
import type { IBaseElement } from '@sobot/form-editor';
import { TreeSelectSetting } from './select-setting';
import { RenderTreeSelect } from './render-select';

const initialData: Partial<IBaseElement> = {
  elementName: 'tree-select',
  gridSpan: 12,
  allowClear: true,
  canSearch: true,
  treeData: []
};

const SobotTreeSelect = {
  type: 'tree-select',
  render: RenderTreeSelect,
  setting: TreeSelectSetting,
  Icon: '',
  text: 'tree-select',
  eventActions: [EEventAction.VALUE_CHANGE, EEventAction.ON_LOADED],
  initialData,
};

export default SobotTreeSelect;