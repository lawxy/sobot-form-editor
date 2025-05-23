import React from 'react';
import { SettingItem, SettingWrap, useGetEventFunctions, EEventAction, useFormUpdate } from '@sobot/form-editor';
import type { IBaseElement, TElementRender, TElementSetting } from '@sobot/form-editor';
import { ColorPicker, Select } from '@sobot/soil-ui';

const RenderContent: TElementRender = ({
  element,
  fieldValue = '',
  customStyle, // 自定义css
  setFieldValue,
}) => {
  const { placement } = element;
  const { eventFunctions } = useGetEventFunctions(element);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  return (
    <ColorPicker
      value={fieldValue}
      onChange={(v) => {
        setFieldValue(v.toHexString());
      }}
      placement={placement}
      style={{ ...customStyle }}
    />
  );
};

const SettingContent: TElementSetting = ({ element, setElementProp }) => {
  const { placement } = element;
  return (
    <SettingWrap title="元素设置">
      <SettingItem label="弹窗位置">
        <Select
          options={['left', 'right'].map((item) => ({
            label: item,
            value: item,
          }))}
          value={placement}
          onChange={(val) => {
            setElementProp('placement', val);
          }}
        />
      </SettingItem>
    </SettingWrap>
  );
};

const Icon = <div>icon-</div>;

const eventActions = [EEventAction.VALUE_CHANGE];

const initialData: Partial<IBaseElement> = {
  elementName: { langText: '颜色选择器', langKey: '' },
  gridSpan: 3,
  gridLayout: false,
  placement: 'left',
};

const type = 'custom';

export const customElement = {
  type,
  render: RenderContent,
  setting: SettingContent,
  Icon,
  text: '测试颜色组件121231231',
  eventActions,
  initialData,
};
