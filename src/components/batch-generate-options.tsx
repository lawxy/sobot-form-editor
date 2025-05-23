import React, { useState, useMemo, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { FC } from 'react';
import { Modal, Button, Input } from '@sobot/soil-ui';
import { idCreator, parseText } from '@/utils';
import { QuestionPopover } from './question-popover';

type TOption = Record<string, any>;
export const BatchGenerateOptions: FC<{
  title: string | React.ReactNode;
  options: TOption[];
  setOptions: Dispatch<SetStateAction<any[]>>;

}> = ({ title, options, setOptions}) => {
  const [open, setOpen] = useState(false);
  const [tempOptions, setTempOptions] = useState(options);

  useEffect(() => {
    setTempOptions(options);
  }, [options]);

  const text = useMemo(() => {
    return tempOptions.reduce((memo: string, cur: TOption, idx: number) => {
      return (
        memo +
        (idx === 0 ? '' : '\n') +
        parseText(cur.label) +
        (cur.value ? `:${cur.value}` : '')
      );
    }, '');
  }, [tempOptions]);

  const handleChange = (str: string) => {
    const couples = str.split('\n');
    const newOptions = couples.map((couple) => {
      const [label = '', value = ''] = couple.split(':');
      const oldOpt = options.find((item) => parseText(item.label) === label);
      if (oldOpt) return oldOpt;
      return {
        label: { langText: label.trim(), langKey: '' },
        value: value.trim(),
        id: idCreator('option'),
      };
    });
    setTempOptions(newOptions);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: 30,
        }}
      >
        <div>{title}</div>
        <div>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            批量编辑
          </Button>
        </div>
      </div>
      <Modal
        visible={open}
        title={
          <>
            批量编辑&nbsp;
            <QuestionPopover content="格式: 字段名:值, 多字段换行分隔" />
          </>
        }
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOptions(tempOptions.filter((item) => Boolean(parseText(item?.label))));
          setOpen(false);
        }}
        destroyOnClose
      >
        <Input.TextArea
          defaultValue={text}
          autoSize={{
            maxRows: 10,
          }}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
      </Modal>
    </>
  );
};
