import { Menu } from '@sobot/soil-ui';
import c from 'classnames';
import React from 'react';

import type { MenuItem } from './event-modal';

import { prefixCls } from '@/const';

export const SelectComponent: React.FC<{
  className?: string;
  title: string;
  menuItems: MenuItem[];
  onChange: (key: any) => void;
  value?: string;
}> = ({ className = '', title, menuItems, onChange, value }) => {
  return (
    <div className={c(prefixCls('event-modal-column'), className)}>
      <div className={prefixCls('event-modal-title')}>{title}</div>
      <div className={prefixCls('event-list')}>
        <Menu
          selectedKeys={value ? [value] : []}
          onClick={({ key }) => {
            onChange(key);
          }}
          mode="inline"
          // items={menuItems}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} disabled={item.disabled}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  );
};
