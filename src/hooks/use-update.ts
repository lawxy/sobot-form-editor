import { useEffect, useLayoutEffect, useRef } from 'react';
import type { EffectCallback, DependencyList } from 'react';
import { useEditorContext } from '@/context';

export const useUpdate = (effect: EffectCallback, deps: DependencyList) => {
  const firstRender = useRef<boolean>(true);
  useEffect(
    firstRender.current
      ? () => {
          firstRender.current = false;
        }
      : effect,
    deps,
  );
};

export const useFormEffect = (
  effect: EffectCallback,
  deps: DependencyList = [],
) => {
  const { isDesign } = useEditorContext();
  useEffect(isDesign ? () => {} : effect, deps);
};

export const useFormLayoutEffect = (
  effect: EffectCallback,
  deps: DependencyList = [],
) => {
  const { isDesign } = useEditorContext();
  useLayoutEffect(isDesign ? () => {} : effect, deps);
};

export const useFormUpdate = (effect: EffectCallback, deps: DependencyList, immediately = false) => {
  const { isDesign } = useEditorContext();
  const firstRender = useRef<boolean>(true);

  useEffect(
    (!immediately && firstRender.current) || isDesign
      ? () => {
          firstRender.current = false;
        }
      : effect,
    deps,
  );
};

export const useDesignEffect = (
  effect: EffectCallback,
  deps: DependencyList = [],
) => {
  const { isDesign } = useEditorContext();
  useEffect(!isDesign ? () => {} : effect, deps);
};

export const useDesignUpdate = (
  effect: EffectCallback,
  deps: DependencyList,
) => {
  const { isDesign } = useEditorContext();
  const firstRender = useRef<boolean>(true);
  useEffect(
    firstRender.current || isDesign
      ? () => {
          firstRender.current = false;
        }
      : effect,
    deps,
  );
};
