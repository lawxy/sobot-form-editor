import { TreeSelect, Spin } from '@sobot/soil-ui';
import { useGetEventFunctions, useFormUpdate, EEventAction } from '@sobot/form-editor';
import type { TElementRender } from '@sobot/form-editor';

export const RenderTreeSelect: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const { allowClear, treeData, canSearch, linkLoading = false } = element;

  // console.log('fieldValue', fieldValue);

  const { eventFunctions } = useGetEventFunctions(element);

  const handleChange = (val) => {
    setFieldValue(val);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  return (
    <Spin spinning={linkLoading}>
      <TreeSelect 
        style={customStyle}
        allowClear={allowClear}
        treeData={treeData}
        value={fieldValue}
        search={canSearch}
        notree
        onChange={handleChange}
      />
    </Spin>
  );
};
