import React, { useCallback } from 'react';
import { Popconfirm, message } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { useEditorContext } from '@/context';
import { prefixCls } from '@/const';
import store from '@/store';
import eventStore from '@/store/eventStore';
import { PreviewJson } from './preview-json';
import { InjectJson } from './inject-json';
import { UndoAndRedo } from './undo-redo';
import './style.less';

const ActionItem: React.FC<
  {
    text: string;
  } & { [key: string]: any }
> = ({ text, ...rest }) => {
  return (
    <div className={prefixCls('action-item')} {...rest}>
      {text}
    </div>
  );
};

const ActionGroup = () => {
  const { actionProp } = useEditorContext();

  const handleSave = useCallback(() => {
    /**
     * todo 组件属性校验
     * const form = Form.useFormInstance();
     */
    // const hasErrorEl = store.validateSettringAttr()
    // if(hasErrorEl) {
    //   store.setSelectedElement(hasErrorEl)
    //   store.setFormSettingTab('element');
    //   Promise.resolve().then(() => {
    //     form.validateFields()
    //   })
    //   message.error('表单校验失败')
    //   return;
    // }
    actionProp?.onSave?.(cloneDeep(store.getSchema()));
    localStorage.setItem('schema', JSON.stringify(store.getSchema()));
    message.success('保存成功');
  }, []);

  const handlePreview = async () => {
    if (!actionProp?.previewUrl) {
      return message.error('请设置预览url');
    }
    await handleSave();
    setTimeout(() => {
      window.open(actionProp?.previewUrl, 'preview');
    }, 200);
  };

  const handleDownload = async () => {
    actionProp?.download?.(cloneDeep(store.getSchema()));
  };

  return (
    <div className={prefixCls('action-group')}>
      <div>
        <UndoAndRedo />
      </div>
      <div className={prefixCls('action-group-right')}>
        <ActionItem text="预览" onClick={handlePreview} />
        {actionProp?.download && (
          <ActionItem text="下载" onClick={handleDownload} />
        )}
        <PreviewJson>
          <ActionItem text="查看Schema" />
        </PreviewJson>
        <InjectJson>
          <ActionItem text="注入Schema" />
        </InjectJson>
        <ActionItem text="保存" onClick={handleSave} />
        <Popconfirm
          title="确定要清空所有组件吗？"
          onConfirm={() => {
            store.clearAllElements();
            store.setFieldsValues({});
            store.setSelectedElement({});
            eventStore.clearMap();
            store.formServices?.forEach((serv) => {
              if (serv?.linkingElements?.length) {
                store.setService(serv.id, { linkingElements: [] });
              }
            });
          }}
          // @ts-ignore
          getPopupContainer={(n) => n.parentNode}
        >
          <div>
            <ActionItem text="清空" />
          </div>
        </Popconfirm>
      </div>
    </div>
  );
};

export default observer(ActionGroup);
