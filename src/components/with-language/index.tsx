import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import type { ConsumerProps, FC } from 'react';
import { Popconfirm, Input } from 'antd';
import { prefixCls } from '@/const';
import type { TextWithLang } from '@/types';
import { useEditorContext } from '@/context';
import './style.less';

type WithLanguageType = FC<{
  value: TextWithLang;
  onChange?: (value: TextWithLang) => void;
} & Partial<ConsumerProps<any>>> & {
  Input: React.FC<any>;
};

export const WithLanguage: WithLanguageType = ({ children, value, onChange }) => {
  const { LOCALE } = useEditorContext();
  const inputRef = useRef<any>(null);

  const valueIsString = typeof value === 'string';

  const {text, useLocale} = useMemo(() => {
    if(valueIsString) {
      return { text: value, useLocale: false };
    }

    if (!value?.langKey || !LOCALE[value?.langKey]) {
      return { text: value?.langText, useLocale: false };
    }

    return { text: LOCALE[value.langKey], useLocale: true };
  }, [value, LOCALE]);

  useEffect(() => {
    if(valueIsString) {
      onChange?.({
        langText: value,
        langKey: '',
      });
      return 
    }

     if (LOCALE[value?.langKey] && value.langText !== LOCALE[value.langKey]) {
      onChange?.({
        langText: LOCALE[value.langKey],
        langKey: value?.langKey || '',
      });
    }
  }, [value, LOCALE]);

  const format = (originValue: string) => {
    if(valueIsString) {
      onChange?.({
        langText: originValue,
        langKey: '',
      });
      return;
    }
    if (originValue !== value?.langText) {
      onChange?.({
        langText: originValue,
        langKey: value?.langKey || '',
      });
    }
  };

  return (
    <div className={`${prefixCls('with-language')}`}>
      {children!({ value: text, onChange: format, useLocale })}
      <Popconfirm
        title={<Input defaultValue={typeof value ==='string' ? value :value?.langKey} ref={inputRef} placeholder="请输入多语言key" />}
        overlayClassName={`${prefixCls('with-language-popconfirm')}`}
        destroyTooltipOnHide
        onConfirm={() => {
          // console.log('inputRef.current?.input?.value', inputRef.current?.input?.value)
          onChange?.({
            langKey: inputRef.current?.input?.value || '',
            langText: text,
          });
        }}
      >
        <span className={`${prefixCls('with-language-icon')}`}>
          <svg viewBox="0 0 1024 1024" width="14" height="14">
            <path d="M891.2 948.8l-33.6-96H699.2l-33.6 96H564.8l153.6-403.2h115.2l153.6 403.2h-96zM780.8 632l-57.6 148.8h115.2L780.8 632zM526.4 780.8L569.6 680c-14.4-9.6-28.8-19.2-38.4-28.8 72-81.6 129.6-182.4 172.8-302.4h129.6v-96H468.8l72-24c-9.6-33.6-33.6-86.4-57.6-129.6l-105.6 33.6c19.2 38.4 38.4 86.4 48 120H70.4v96h134.4c43.2 120 105.6 220.8 177.6 302.4C296 718.4 185.6 766.4 56 800c19.2 24 48 72 62.4 96 134.4-38.4 249.6-96 340.8-172.8 19.2 19.2 43.2 38.4 67.2 57.6z m-220.8-432h288C560 440 512 516.8 454.4 584 392 516.8 339.2 440 305.6 348.8z"></path>
          </svg>
        </span>
      </Popconfirm>
    </div>
  );
};

const WithLanguageInput = forwardRef(
  (
    {
      value,
      onChange,
      ...props
    }: { value: TextWithLang; onChange: (value: TextWithLang) => void },
    ref,
  ) => {

    return (
      <WithLanguage value={value} onChange={onChange}>
        {({ value: text, onChange: onChangeText, useLocale }) => (
          <Input
            ref={ref as any}
            disabled={useLocale}
            value={text}
            onChange={(e) => {
              // console.log('e.target.value', e.target.value)
              onChangeText(e.target.value);
            }}
            {...props}
          />
        )}
      </WithLanguage>
    );
  },
);

WithLanguage.Input = WithLanguageInput;
