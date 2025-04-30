import React, { type FC } from 'react';
import { useEditorContext } from '@/context';
import EditorCanvas from './render-canvas';
import {HeaderActionPane} from '../header-action-pane';

export const FormCanvas: FC = () => {
  const { mode } = useEditorContext();
  return (
    <EditorCanvas mode={mode} actions={mode === 'design' && <HeaderActionPane />} />
  );
};
