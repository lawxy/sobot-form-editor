import { useRef, useLayoutEffect } from "react";
import { EEventAction } from "@/types";
import { TEventFormatFunctions } from "@/utils";

// 立即执行事件
export const useValueImmediately = (immediateFunctions: TEventFormatFunctions, value: any) => {
    const triggerImmediately = useRef(false);
    useLayoutEffect(() => {
        if (!immediateFunctions[EEventAction.VALUE_CHANGE]) {
            return;
        }
        if (triggerImmediately.current) return;
        triggerImmediately.current = true;

        immediateFunctions[EEventAction.VALUE_CHANGE]?.(value);

    }, [immediateFunctions, value]);
}