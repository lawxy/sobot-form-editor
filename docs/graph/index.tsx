import React, { useRef } from 'react';
import { Modal, Button } from '@sobot/soil-ui';
import {
  GraphEditor,
  GraphHooks,
  Graph,
  GraphExternalEvents,
} from '@sobot/graph-editor';
import { StartNode, RuleNode } from './nodes';
// import { WebhookNode } from './WebhookNode';
import { EdgeType, NodeType } from './types';

export default () => {
  const canInsertEdge: GraphHooks['canInsertEdge'] = (soure, target) => {
    if (target.type === NodeType.Start) {
      return false;
    }

    return true;
  };

  const beforeDeleteNode: GraphHooks['beforeDeleteNode'] = () => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Are you sure you want to delete',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  const beforeInsertNode: GraphHooks['beforeInsertNode'] = () => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Are you sure you want to insert node',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  // const onNodeAdd: GraphExternalEvents['onNodeAdd'] = async (node) => {
  //   node.data.id = Date.now().toString();
  // };
  const onNodeAdd: GraphExternalEvents['onNodeAdd'] = async (node) => {
    node.data.id = Date.now().toString();
  };

  const graphRef = useRef<Graph>(null);

  return (
    <>
      <Button
        onClick={() => {
          console.log(graphRef.current);
        }}
      >
        点击
      </Button>
      <GraphEditor
        ref={graphRef}
        style={{ width: '100%', height: '100vh' }}
        component={{ nodes: [StartNode, RuleNode] }}
        events={{ onNodeAdd }}
        initialNodes={[
          { id: '1', type: NodeType.Start, x: 64, y: 64 },
          { id: '2', type: NodeType.Rule, x: 210, y: 224 },
          { id: '3', type: NodeType.Rule, x: 656, y: 400 },
        ]}
        initialEdges={[
          { id: '1', type: EdgeType.Start, sourceId: '1', targetId: '2' },
          {
            id: '2',
            type: EdgeType.MatchFailure,
            sourceId: '2',
            targetId: '3',
          },
        ]}
      />
    </>
  );
};
