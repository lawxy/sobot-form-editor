import { Select } from 'antd';
import type { TElementSetting } from '@sobot/form-editor';
import { SettingItem, SettingWrap } from '@sobot/form-editor';

export const EditorSetting: TElementSetting = ({ element, setElementProp }) => {
  const { editorMode, toolbarConfig, toolbarConfigMode } = element;
  return (
    <SettingWrap title="元素设置">
      <SettingItem label="编辑模式">
        <Select
          options={[
            { label: '文本编辑模式', value: 'text' },
            { label: '文章编辑模式', value: 'article' },
          ]}
          value={editorMode}
          onChange={(v) => setElementProp('editorMode', v)}
        />
      </SettingItem>
      <SettingItem label="工具栏模式">
        <Select
          value={toolbarConfigMode}
          options={[
            { label: '默认', value: 'default' },
            { label: '自定义', value: 'custom' },
          ]}
          onChange={(v) => setElementProp('toolbarConfigMode', v)}
        />
      </SettingItem>
      {
        toolbarConfigMode === 'custom' && (
          <SettingItem label="工具栏配置">
            <Select
              allowClear
              value={toolbarConfig}
              options={[
                {
                  label: '标题',
                  value: 'headerSelect',
                },
                {
                  label: '背景色',
                  value: 'bgColor',
                },
                {
                  label: '字体颜色',
                  value: 'color',
                },
                {
                  label: '加粗',
                  value: 'bold',
                },
                {
                  label: '斜体',
                  value: 'italic',
                },
                {
                  label: '下划线',
                  value: 'underline',
                },
              ]}
              mode="multiple"
              onChange={(v) => {
                // console.log(v);
                setElementProp('toolbarConfig', v);
              }}
            />
          </SettingItem>
        )
      }
    </SettingWrap>
  );
};
