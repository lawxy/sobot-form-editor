import { Button } from '@sobot/soil-ui';
import React, { ReactNode } from 'react';
import {
  Bounds,
  Connection,
  ConnectionInit,
  Direction,
  GraphNode,
  Inserter,
  InserterConfiguration,
  Position,
  RuleCard,
  RuleFields,
  RuleSet,
  // DropdownMenu,
} from '@sobot/graph-editor';
import { NodeType, EdgeType, NodeGroupType } from './types';

export class StartNode extends GraphNode {
  static inserterConfig = new InserterConfiguration({
    type: NodeType.Start,
    hidden: true,
  });

  // initConnections() {
  //   if (!this.connections.length) {
  //     this.addConnection(
  //       Connection.fromNodePosition(this, Position.Right, Direction.Outward),
  //     );
  //   }
  // }

  // addConnection(input: ConnectionInit) {
  //   this.connections = [];
  //   return super.addConnection(input);
  // }

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

export class RuleNode extends GraphNode {
  static inserterConfig = new InserterConfiguration({
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
    name: '规则',
    // 节点类型
    type: NodeType.Rule,

    // 节点分组
    group: NodeGroupType.Audience,
    // 分组名称
    groupName: '目标客户',
    // 折叠后的分组名称
    shortGroupName: '客户',
  });

  geteditable = false;

  _inserters = [
    new Inserter(this, {
      label: '匹配成功',
      edgeType: EdgeType.MatchSuccess,
    }),
    new Inserter(this, {
      label: '匹配失败',
      edgeType: EdgeType.MatchFailure,
    }),
    new Inserter(this, {
      label: '匹配失败1',
      edgeType: EdgeType.MatchFailure + 1,
    }),
    new Inserter(this, {
      label: '匹配失败2',
      edgeType: EdgeType.MatchFailure + 2,
    }),
  ];

  // 节点分支
  get inserters(): Inserter[] {
    return this._inserters;
  }

  initConnections() {
    if (!this.connections.length) {
      const connections = Connection.fromNodePresets(
        this,
        ([pos, dir]) => dir !== Direction.Outward,
      );
      connections.forEach((o) => this.addConnection(o));
    }
  }

  getActions([edit, remove]: DropdownMenu[]): DropdownMenu[] {
    return [
      edit,
      {
        key: 'mark',
        label: '标记',
        icon: (
          <svg viewBox="0 0 1024 1024" style={{ width: 16, height: 16 }}>
            <path d="M538.477714 27.179886l129.609143 276.187428a29.257143 29.257143 0 0 0 22.089143 16.471772l292.161829 44.587885a29.257143 29.257143 0 0 1 16.530285 49.3568l-213.255314 218.580115a29.257143 29.257143 0 0 0-7.899429 25.161143l50.029715 307.024457a29.257143 29.257143 0 0 1-43.008 30.3104l-258.574629-142.921143a29.257143 29.257143 0 0 0-28.320914 0l-258.633143 142.921143a29.257143 29.257143 0 0 1-43.008-30.3104l50.117486-307.053715a29.257143 29.257143 0 0 0-7.928686-25.161142l-213.255314-218.550858a29.257143 29.257143 0 0 1 16.530285-49.3568l292.161829-44.587885a29.257143 29.257143 0 0 0 22.089143-16.501029l129.609143-276.187428a29.257143 29.257143 0 0 1 52.955428 0z"></path>
          </svg>
        ),
        tooltip:
          '标记为关键问题。\n标记后，可以在对话记录中，快速筛选该问题和对应的客户回复。',
        onClick: () => {
          this.data.mark = !this.data.mark;
        },
      },
      remove,
    ];
  }

  renderAction(dom: ReactNode) {
    if (!this.isHovered && this.data.mark) {
      return (
        <svg viewBox="0 0 1024 1024" style={{ width: 16, height: 16 }}>
          <path
            d="M512 0l158.208 337.1008L1024 391.1168 768 653.5168 828.416 1024 512 849.1008 195.5328 1024 256 653.5168 0 391.1168l353.792-54.016z"
            fill="#F0AC0E"
          ></path>
        </svg>
      );
    }

    return dom;
  }

  get ruleComponent() {
    return null;
    // return (
    //   <RuleSet>
    //     <RuleCard title="目标客户" desc="选择目标客户" defaultExpand>
    //       <RuleFields
    //         fields={[
    //           {
    //             type: 'text',
    //             label: '满足以下条件的客户将进入流程',
    //           },
    //           {
    //             type: 'condition',
    //             name: 'condition0',
    //             props: (_, values) => ({
    //               marker: (values?.list0?.length ?? 0) > 1,
    //               options: [
    //                 { label: '且', value: 'and' },
    //                 { label: '或', value: 'or' },
    //               ],
    //             }),
    //             fields: [
    //               {
    //                 type: 'list',
    //                 name: 'list0',
    //                 props: () => {
    //                   return {
    //                     align: 'start',
    //                     style: { marginBottom: 32 },
    //                     renderAdd: ({ add }: any) => (
    //                       <Button
    //                         type="primary"
    //                         style={{ marginTop: 12 }}
    //                         onClick={() =>
    //                           add({
    //                             condition1: 'or',
    //                             list1: [{ select1: '1' }],
    //                           })
    //                         }
    //                       >
    //                         添加条件组
    //                       </Button>
    //                     ),
    //                   };
    //                 },
    //                 fields: [
    //                   {
    //                     type: 'condition',
    //                     name: 'condition1',
    //                     props: (_, values) => {
    //                       return {
    //                         marker: (values?.list1?.length ?? 0) > 1,
    //                         bordered: true,
    //                         options: [
    //                           { label: '且', value: 'and' },
    //                           { label: '或', value: 'or' },
    //                         ],
    //                       };
    //                     },
    //                     fields: [
    //                       {
    //                         type: 'list',
    //                         name: 'list1',
    //                         props: {
    //                           renderAdd: ({ add }: any) => (
    //                             <Button
    //                               type="text"
    //                               icon="plus"
    //                               style={{ marginTop: 12 }}
    //                               onClick={() => add({ select1: '1' })}
    //                             >
    //                               添加
    //                             </Button>
    //                           ),
    //                         },
    //                         fields: [
    //                           {
    //                             type: 'select',
    //                             name: 'select1',
    //                             props: () => {
    //                               return {
    //                                 style: { width: 210 },
    //                                 dataSource: [
    //                                   { value: '下拉1', key: '1' },
    //                                   { value: '下拉2', key: '2' },
    //                                 ],
    //                               };
    //                             },
    //                           },
    //                         ],
    //                       },
    //                     ],
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         ]}
    //       />
    //     </RuleCard>
    //   </RuleSet>
    // );
  }
}
