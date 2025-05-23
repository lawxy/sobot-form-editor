import React, { useMemo, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, message } from 'antd';
import { MonacoEditor, useMonaco } from '@sobot/form-editor-ui';
import { useCurrent, useDesignEffect } from '@/hooks';

import { SettingItem } from '../setting-common';

const removeId = (id: string) => id?.replace(/\-(.*)?/, '');

// const defaultCSS = (id: string) => {
//   return {
//     element: `/* 组件样式 */\n#${removeId(
//       id,
//     )}{\n\t\n} \n /* 容器样式 */\n#${removeId(id)?.replace(
//       /^el/,
//       'container',
//     )}{\n\t\n}`,
//     form: `#${removeId(id)}{\n\t\n}`,
//   };
// };
const defaultCSS = (id: string) => {
  return {
    element: `/* 组件样式 */\n#el{\n\t\n} \n /* 容器样式 */\n#container{\n\t\n}`,
    form: `#${removeId(id)}{\n\t\n}`,
  };
};
interface CustomCssSettingProps {
  defaultValue: string;
  style?: React.CSSProperties;
  editorStyle: React.CSSProperties;
  onSave: (value: string) => void;
  label?: string;
  tips?: string;
}

export const CustomCssSetting: React.FC<CustomCssSettingProps> = ({
  defaultValue,
  editorStyle,
  onSave,
  label,
  style,
  tips,
}) => {
  const [canSave, setCanSave] = useState(false);
  const isJsonValidate = useRef<boolean>(true);
  const tempVal = useRef('');
  const monaco = useMonaco();
  const focus = useRef(false);

  useDesignEffect(() => {
    const keydonwFn = (e: KeyboardEvent) => {
      if (!focus.current) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', keydonwFn);
    return () => {
      document.removeEventListener('keydown', keydonwFn);
    };
  });

  useDesignEffect(() => {
    if (!monaco) return;
    monaco.languages.css.lessDefaults.setDiagnosticsOptions({
      // monaco.languages.css.cssDefaults.setDiagnosticsOptions({
      validate: true,
      lint: {
        emptyRules: 'ignore', // 忽略空规则校验
      },
    });
  }, [monaco]);

  const handleSave = () => {
    if (isJsonValidate.current) {
      onSave(tempVal.current);
      setCanSave(false);
      return;
    }
    message.error('格式不对');
  };

  return (
    <>
      <SettingItem
        tips={`${tips? tips + ': ' : ''}选择器是为了方便格式书写，并不存在于html中`}
        label={label || '自定义CSS'}
        style={style || {}}
      >
        <Button
          disabled={!canSave}
          onClick={handleSave}
          className="fe-attr-setting-btn"
          size="small"
          type="primary"
        >
          保存
        </Button>
      </SettingItem>
      <MonacoEditor
        style={editorStyle || {}}
        language="less"
        value={defaultValue}
        onChange={(v) => {
          setCanSave(true);
          tempVal.current = v as string;
        }}
        onValidate={(errors) => {
          console.log('errors', errors);
          isJsonValidate.current = errors.length === 0;
        }}
        options={{
          tabSize: 2,
        }}
        onFocus={() => {
          focus.current = true;
        }}
        onBlur={() => {
          focus.current = false;
        }}
      />
    </>
  );
};

export const ElementCssSetting = observer(() => {
  const { current, setProp } = useCurrent('element');

  const value = useMemo(() => {
    if (!current.customCss) {
      return defaultCSS(current?.id as string)['element'];
    }
    return current.customCss;
  }, [current.customCss, current?.id]);

  const handleSave = (cssString: string) => {
    setProp('customCss', cssString);
  };

  return (
    <CustomCssSetting
      defaultValue={value}
      editorStyle={{
        height: 'calc(100vh - 200px)',
      }}
      onSave={handleSave}
    />
  );
});

export const FormCssSetting = observer(() => {
  const { current, setProp } = useCurrent('form');

  const value = useMemo(() => {
    if (!current.customCss) {
      return defaultCSS(current?.id as string)['form'];
    }
    return current.customCss;
  }, [current.customCss, current?.id]);

  const handleSave = (cssString: string) => {
    setProp('customCss', cssString);
  };

  return (
    <CustomCssSetting
      defaultValue={value}
      editorStyle={{
        height: '150px',
      }}
      onSave={handleSave}
    />
  );
});
