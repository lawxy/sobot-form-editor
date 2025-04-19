declare module '@sobot/graph-editor' {
  interface Node {
    /** 节点名称 */
    name?: string;
    canvasId?: string;
    /** 头节点标识 0-是，1-不是 */
    nodeHeadType?: number;
    /** 节点类型 0规则节点 1应用节点 2连线节点 3备注节点 4延时节点 */
    nodeType?: number;
    /** 应用类型 标签应用 :0 短信应用 :1 WhatsApp应用 :2 企微消息推送应用 :3*/
    appType?: number;
    /** 关联应用ID */
    appId?: string;
    /** 执行类型 0 :事件触发 1 :定时触发 */
    executionType?: number;
    /** 延迟时间 */
    delayTime?: number;
    /** 定时时间 */
    timingTime?: number;
    addRuleReqVos?: {
      ruleId?: string;
      canvasId?: string;
      ruleType?: string;
      conditionGroupId?: string;
      conditionType?: string;
      /** 0-等于，1-包含，2-大于，3-小于，4-大于等于 5-小于等于 6-介于 */
      ruleOptType?: string;
      /** 0-启用，1-删除 */
      status?: number;
    }[];
  }
}

export const NodeType = {
  Rule: 'Rule',
  SMS: 'SMS',
  WhatsApp: 'WhatsApp',
  Tag: 'Tag',
  Wait: 'Wait',
  Webhook: 'Webhook',
  AppPush: 'AppPush',
  RobotCall: 'RobotCall',
  Line: 'Line',
};

export const NodeGroup = {
  Audience: 'Audience',
  Message: 'Message',
  Action: 'Action',
};

export const EdgeType = {
  MatchRule: 0,
  NotMatchAfter: 4,
  SendSuccess: 1,
  SendFailure: 2,
  AfterWaiting: 3,
  AfterTagging: 1,
  CallSuccess: 1,
  CallFailure: 2,
};

// 接口返回的节点类型
// 节点类型
// 0 :规则节点
// 1 :应用节点
// 2 :连线节点
// 3 :备注节点
// 4 :延时节点
export const NodeTypeEnum = {
  RuleNode: 0,
  AppNode: 1,
  LinkNode: 2,
  WatiNode: 4,
};
// 应用类型
// 标签应用 :0
// 短信应用 :1
// WhatsApp应用 :2
// 企微消息推送应用 :3
// line节点应用: 7
export const AppTypeEnum = {
  TagApp: 0,
  SMSApp: 1,
  WhatsApp: 2,
  Webhook: 4,
  AppPush: 6,
  RobotCallApp: 5,
  Line: 7,
};
// 头节点标识 0-是，1-不是
export const nodeHeadTypeEnum = {
  IsHeadNode: 0,
  NotHeadNode: 1,
};
// 执行类型 0 :事件触发 1 :定时触发 2: webhook触发
export const executionTypeEnum = {
  Event: 0,
  Time: 1,
  Webhook: 2,
};
