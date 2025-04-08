import React from 'react';
import { Popover } from '@sobot/soil-ui';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const QuestionPopover: React.FC<{
  content: React.ReactNode | string;
}> = ({ content }) => {
  return (
    <Popover content={content}>
      <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
    </Popover>
  );
};
