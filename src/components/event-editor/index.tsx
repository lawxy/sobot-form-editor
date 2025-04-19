import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import { Modal, Button, message } from '@sobot/soil-ui';
import { GraphEditor, GraphHooks, Graph } from '@sobot/graph-editor';
import { StartNode, RuleNode } from './nodes';
// import { WebhookNode } from './WebhookNode';
import { EdgeType, NodeType } from './types';
import {
  EEventAction,
  EChangeType,
  EEventType,
  TCustomEvent,
  IBaseElement,
} from '@/types';
import { ElementNode } from './nodes/element';
import { ConfigNode } from './nodes/config';
import { prefixCls } from '@/const';
import './style.less';

export const EventEditor: FC<
  PropsWithChildren<{
    // event?: TCustomEvent;
    eventActions: EEventAction[];
    onOk: (evt: TCustomEvent) => void;
    // type: EChangeType;
    // sourceId: string;
    // eventTypeOptions?: EEventType[];
    element: IBaseElement;
  }>
> = ({
  children,
  // event,
  eventActions,
  onOk,
  // type,
  // sourceId,
  // eventTypeOptions,
  element,
}) => {
  const [open, setOpen] = useState(false);

  const graphRef = useRef<Graph>(null);

  const onNodeAdd = async (node: any) => {
    node.data.id = Date.now().toString();
  };

  const handleSave = () => {
    const graph = graphRef.current;
    if (graph) {
      const nodes = graph.state.nodes;
      console.log(nodes);
    }
    setOpen(false);
  };

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: () => setOpen(true),
        })}
      <Modal
        // width={'100vw'}
        visible={open}
        maskClosable={false}
        bodyStyle={{
          padding: 0,
        }}
        footer={null}
        closable={false}
        destroyOnClose
        className={prefixCls('event-editor-modal')}
        onOk={() => {}}
      >
        <div className={prefixCls('event-editor-modal-header')}>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
        <GraphEditor
          ref={graphRef}
          style={{ width: '100vw', height: '100vh' }}
          component={{
            nodes: [
              ElementNode({ element, eventActions }),
              ConfigNode({ element }),
            ],
          }}
          events={{ onNodeAdd }}
          initialNodes={[
            { id: element.id, type: NodeType.ELEMENT, x: 210, y: 224 },
          ]}
          // initialEdges={[
          //   { id: '1', type: EdgeType.Start, sourceId: '1', targetId: sourceId },

          // ]}
        />
      </Modal>
    </>
  );
};
