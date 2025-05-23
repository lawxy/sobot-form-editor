import React, { useEffect, useRef } from 'react';
import type { PropsWithChildren, FC } from 'react';
import { Collapse, Dropdown, Popconfirm, Menu } from 'antd';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Sortable } from '@sobot/form-editor-ui';

import { prefixCls } from '@/const';
import { eventTypeChinese, type TCustomEvent } from '@/types';

const { Panel } = Collapse;

export const EventCollapse: FC<{
  onDelete: (id: string) => void;
  collopaseItems: Array<{ label: string; events: TCustomEvent[] }>;
  EditComponent: FC<PropsWithChildren<{ evt: TCustomEvent }>>;
  onSort: (e: {
    oldIndex: number;
    newIndex: number;
    listIndex: number;
  }) => void;
}> = ({ collopaseItems, onDelete, EditComponent, onSort }) => {
  const ref = useRef<HTMLDivElement>(null);
  const sortInsArr = useRef<Sortable[]>([]);

  const generateSortIns = () => {
    if (!ref.current) return;

    const wrapList = ref.current.querySelectorAll('.ant-collapse-content-box');

    if (!wrapList || !wrapList?.length) return;

    Array.from(wrapList).forEach((wrap, idx) => {
      const sortIns = new Sortable(wrap as HTMLElement, {
        animation: 150,
        onSort({ oldIndex, newIndex }) {
          onSort({ oldIndex: oldIndex!, newIndex: newIndex!, listIndex: idx });
        },
        group: `collapse${idx}`,
      });
      sortInsArr.current![idx] = sortIns;
    });
  };

  useEffect(() => {
    generateSortIns();
  }, [collopaseItems]);

  const items = collopaseItems.map((item, i) => ({
    key: i,
    label: item.label,
    children: item.events.map((event, innerI) => (
      <EditComponent evt={event} key={innerI}>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <Popconfirm
                  title="确认删除"
                  onConfirm={() => onDelete(event.id)}
                >
                  删除
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={['contextMenu']}
          // @ts-ignore
          getPopupContainer={(n) => n.parentNode}
        >
          <div className="collapse-item">
            {eventTypeChinese[event!.eventType!]}
            {event?.eventName && ` - (${event.eventName})`}
          </div>
        </Dropdown>
      </EditComponent>
    )),
  }));

  return (
    <div className={prefixCls('event-collapse')} ref={ref}>
      <Collapse
        ghost
        // items={items}
        defaultActiveKey={items.map((item) => item.key)}
        expandIcon={({ isActive }) =>
          isActive ? <MinusSquareOutlined /> : <PlusSquareOutlined />
        }
      >
        {items.map((item) => (
          <Panel header={item.label} key={item.key}>
            {item.children}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
