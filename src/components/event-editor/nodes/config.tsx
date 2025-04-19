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
import { NodeType, EdgeType, NodeGroupType } from '../types';
import { EEventAction, eventActionInChinese, IBaseElement } from '@/types';

class BaseConfigNode extends GraphNode {
  static inserterConfig = new InserterConfiguration({
    type: NodeType.CONFIG,
    icon: (
      <svg viewBox="0 0 1024 1024">
        <path
          d="M0 0m136.533333 0l750.933334 0q136.533333 0 136.533333 136.533333l0 750.933334q0 136.533333-136.533333 136.533333l-750.933334 0q-136.533333 0-136.533333-136.533333l0-750.933334q0-136.533333 136.533333-136.533333Z"
          fill="#FDE553"
        />
        <path
          d="M469.7088 785.066667c-1.399467 0-2.491733-0.375467-3.1744-1.058134-4.983467-1.467733-6.7584-4.266667-5.358933-8.533333l34.133333-207.530667-145.134933 12.561067c-3.549867 0-6.0416-1.399467-7.4752-4.266667-2.116267-2.798933-1.774933-6.007467 1.058133-9.557333l222.037333-289.792c2.833067-4.266667 6.0416-4.949333 9.591467-2.116267 3.549867 0.682667 5.358933 3.549867 5.358933 8.533334l-39.697066 199.68 133.597866-4.744534c3.584 0 6.075733 1.4336 7.509334 4.266667 0.682667 2.833067 0.682667 6.0416 0 9.557333l-204.970667 289.792a10.24 10.24 0 0 1-7.4752 3.208534z"
          fill="#000000"
        />
      </svg>
    ),
    // 节点名称
    name: '事件配置',
    // group: NodeGroupType.Audience,

    groupName: '节点',
    // shortGroupName: '配置',
  });

  get editable() {
    return false;
  }

  // 定义节点的尺寸，需要是 spacing 的倍数
  get bounds() {
    const { spacing } = this.graph.config.grid;
    return new Bounds(this.x, this.y, spacing * 10, spacing * 5);
  }

  // 自定义节点内容
  //   get component() {
  //     return <h3 style={{ textAlign: 'center' }}>开始</h3>;
  //   }
}

export const ConfigNode = ({ element }: { element: IBaseElement }) => {
  const { elementName, id } = element;

  return class extends BaseConfigNode {
    get component() {
      return <h3 style={{ textAlign: 'center' }}>配置</h3>;
    }

    // 节点分支
    get inserters(): Inserter[] {
      return [
        new Inserter(this, {
          label: '成功',
          edgeType: 'success',
        }),
        new Inserter(this, {
          label: '失败',
          edgeType: 'fail',
        }),
      ];
    }
  };
};
