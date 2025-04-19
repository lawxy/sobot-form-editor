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

export class StartNode extends GraphNode {
  static inserterConfig = new InserterConfiguration({
    type: NodeType.Start,
    hidden: true,
  });

  initConnections() {
    if (!this.connections.length) {
      this.addConnection(
        Connection.fromNodePosition(this, Position.Right, Direction.Outward),
      );
    }
  }

  addConnection(input: ConnectionInit) {
    this.connections = [];
    return super.addConnection(input);
  }

  _inserters: Inserter[] = [
    new Inserter(this, {
      edgeType: EdgeType.Start,
    }),
  ];

  // 如果分支不是动态的，建议缓存一下
  get inserters() {
    return this._inserters;
  }

  // 是否可编辑节点规则
  get editable() {
    return false;
  }

  // 定义节点的尺寸，需要是 spacing 的倍数
  get bounds() {
    const { spacing } = this.graph.config.grid;
    return new Bounds(this.x, this.y, spacing * 5, spacing * 3);
  }

  // 自定义节点内容
  get component() {
    return <h3 style={{ textAlign: 'center' }}>开始</h3>;
  }
}
