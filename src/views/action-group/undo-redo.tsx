import React from 'react';
import { Space, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import store from '@/store';
import { cloneDeep } from 'lodash';
export const UndoAndRedo = observer(() => {
  const { undo, redo, traceActions, tracePointer } = store;

  console.log(cloneDeep(traceActions));
  console.log(tracePointer);
  console.log(traceActions.length);

  const currentAction = traceActions[tracePointer - 1];

  return (
    <div>
      <Space>
        <Button disabled={!currentAction?.undo} onClick={undo}>
          撤销
        </Button>
        <Button disabled={!currentAction?.redo} onClick={redo}>
          恢复
        </Button>
      </Space>
    </div>
  );
});
