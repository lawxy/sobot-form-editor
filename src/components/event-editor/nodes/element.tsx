import React from 'react';
import {
  Bounds,
  Connection,
  ConnectionInit,
  Direction,
  GraphNode,
  Inserter,
  InserterConfiguration,
  Position,
} from '@sobot/graph-editor';
import { NodeType, EdgeType } from '../types';
import { EEventAction, eventActionInChinese, IBaseElement } from '@/types';

class BaseElementNode extends GraphNode {
  static inserterConfig = new InserterConfiguration({
    type: NodeType.ELEMENT,
    hidden: true,
  });

  get editable() {
    return false;
  }

  get bounds() {
    const { spacing } = this.graph.config.grid;
    return new Bounds(this.x, this.y, spacing * 10, spacing * 5);
  }
}

export const ElementNode = ({
  element,
  eventActions,
}: {
  element: IBaseElement;
  eventActions: EEventAction[];
}) => {
  const { elementName, id } = element;

  return class extends BaseElementNode {
    get component() {
      return (
        <h3 style={{ textAlign: 'center' }}>{elementName?.langText || id}</h3>
      );
    }

    // 节点分支
    get inserters(): Inserter[] {
      return eventActions.map((action: EEventAction) => {
        return new Inserter(this, {
          label: eventActionInChinese[action],
          edgeType: action,
        });
      });
    }
  };
};
