import { useEffect, useRef } from "react";
import { EEventAction, IBaseElement } from "@/types";
import { TEventFormatFunctions } from "@/utils";

// 立即执行事件
export const useValueImmediately = (element: IBaseElement, eventFunctions: TEventFormatFunctions, value: any) => {
    const triggerImmediately = useRef(false);
    const { events } = element;
    useEffect(() => {
        if(!eventFunctions[EEventAction.VALUE_CHANGE]) {
           return;
        }
        if (triggerImmediately.current) return;
        triggerImmediately.current = true;
        events?.forEach(event => {
            const { eventAction, eventTargets } = event;
            if (eventAction === EEventAction.VALUE_CHANGE) {
                console.log(eventTargets, 'eventTargets');
                eventTargets?.forEach(target => {
                    if (target.immediately) {
                        eventFunctions[eventAction]?.(value);
                    }
                });
            }
        });
    }, [eventFunctions, value]);
}