import React, { useRef, useEffect } from 'react';
import {
  FormEditor,
  Material,
  Settings,
  FormCanvas,
  IEditorInstance,
  SideBar,
} from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
import { LOCALE, useCommon } from '../common';


const tooltip = {
  title: '该报表仅展示 「最后排队技能组」 是当前技能组时的今日累计电话数据',
  placeholder: '搜索指标名称',
  trigger: 'hover',
  search: false,
  content: [
    {
      name: '有效会话数',
      value: '访客消息数大于0，且第1条消息未触发关键词转人工',
    },
    {
      name: '平均首次响应时长',
      value:
        '客户与“人工客服“建立会话后，客户发送第一条消息，到“人工客服”首次回复该消息的平均时长',
      desc: '计算公式：人工首次响应时长总和/人工首次响应次数总和',
    },
  ],
};

const Comp = () => {
  const ref = useRef<IEditorInstance>();
  useCommon(ref)
  return (
    <FormEditor
      mode="design"
      ref={ref}
      // 预览url和保存回调
      actionProp={{
        previewUrl: `${process.env.PUBLIC_PATH}~demos/docs-preview-demo-demo-preview`,
        onSave(schema) {
          console.log('schema');
          console.log(schema);
        },
      }}
      customElements={SoilUi}
      LOCALE={LOCALE}
    >
      <SideBar />
      <FormCanvas />
      <Settings />
    </FormEditor>
  );
};

export default Comp;
