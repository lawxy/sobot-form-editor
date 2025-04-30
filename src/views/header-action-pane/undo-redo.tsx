import React from 'react';
import { Space, Button } from 'antd';
import { observer } from 'mobx-react-lite';
import store from '@/store';
import { prefixCls } from '@/const';
export const UndoAndRedo = observer(() => {
  const { undo, redo, traceActions, tracePointer } = store;

  const currentAction = traceActions[tracePointer - 1];

  return (
    <Space size={10}>
      <Button
        className={prefixCls('action-group-icon-button')}
        disabled={!currentAction?.undo}
        type="text"
        onClick={undo}
      >
        <svg viewBox="0 0 1024 1024" width="14" height="14">
          <path d="M67.52 455.552v0.448h115.84l0.128-0.448h275.264L276.672 274.944a336 336 0 1 1 182.08 568.448v113.472a448 448 0 1 0-263.04-762.24L64 64v391.552h3.52z"></path>
        </svg>
      </Button>

      <Button
        className={prefixCls('action-group-icon-button')}
        disabled={!currentAction?.redo}
        type="text"
        onClick={redo}
      >
        <svg viewBox="0 0 1024 1024" width="14" height="14">
          <path d="M0 576c0 152.928 67.04 290.176 173.344 384l84.672-96C178.304 793.632 128 690.688 128 576c0-212.064 171.936-384 384-384 106.048 0 202.048 42.976 271.52 112.48L640 448l384 0L1024 64l-149.984 149.984C781.376 121.312 653.376 64 512 64 229.216 64 0 293.216 0 576z"></path>
        </svg>
      </Button>
    </Space>
  );
});
