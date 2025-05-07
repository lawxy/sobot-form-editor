import React from 'react';
import { Typography } from '@sobot/soil-ui';
import c from 'classnames';
import { prefixCls } from '@/const';
import type { IDragElementProp } from '@/types';

const DragItem: React.FC<{
  item: IDragElementProp;
}> = ({ item }) => {
  const { text, type, Icon } = item;
  return (
    <div className={c(prefixCls('drag-item'), type)} data-type={type}>
      <div className={prefixCls('drag-item-mask')} />
      {Icon}
      <Typography.Text
        style={{ maxWidth: 80, fontSize: 12 }}
        // ellipsis={{ tooltip: true }}
      >
        {text}
      </Typography.Text>
    </div>
  );
};

export default DragItem;
