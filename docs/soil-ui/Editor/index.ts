import { EEventAction } from '@sobot/form-editor';
import type { IBaseElement } from '@sobot/form-editor';
import { EditorSetting } from './editor-setting';
import { RenderEditor } from './render-editor';

const initialData: Partial<IBaseElement> = {
  elementName: '文章编辑器',
  gridSpan: 24,
  editorMode: 'text',
  toolbarConfigMode: 'default',
};

const WangEditor = {
  type: 'wangEditor',
  render: RenderEditor,
  setting: EditorSetting,
  Icon: '',
  text: 'wang-editor',
  eventActions: [EEventAction.VALUE_CHANGE],
  initialData,
};

export default WangEditor;