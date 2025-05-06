import React from 'react'
import { useEffect } from "react";
import { cloneDeep } from 'lodash-es';
import { Button } from 'antd'; 
import { triggerLinkingService, triggerService } from '@sobot/form-editor';

// console.log('triggerLinkingService', triggerLinkingService)
// console.log('triggerService', triggerService)

const tooltip = {
    title: '该报表仅展示 「最后排队技能组」 是当前技能组时的今日累计电话数据',
    placeholder: '搜索指标名称',
    trigger: 'hover',
    search: false,
    content: [
        {
            name: '有效会话数',
            value: '访客消息数大于0，且第1条消息未触发关键词转人工',
        },
        {
            name: '平均首次响应时长',
            value:
                '客户与“人工客服“建立会话后，客户发送第一条消息，到“人工客服”首次回复该消息的平均时长',
            desc: '计算公式：人工首次响应时长总和/人工首次响应次数总和',
        },
    ],
};

export const useCommon = (ref) => {
    useEffect(() => {
       
        
        // 服务监听getOptions
        // ref.current?.extendServiceEmitter.on('service-8e312rbg3ds', (data) => {
        //     console.log( data);
        // })

        // 前端扩展
        // 设置tab1的tooltip
        ref.current?.extendElementAttr({fieldName: 'tab1'}, 'tooltip', tooltip)

         // 设置table的columns
        ref.current?.getElement({fieldName: 'table'}).then((el) => {
            if(!el) return;
            const columns = cloneDeep(el?.columns);
            columns.push({
                title: '操作',
                width: 100,
                render(){
                    return <Button>操作</Button>
                }
            })
            ref.current?.extendElementAttrs(el.id,  {
                columns,
                rowSelection: {
                    type: 'checkbox',
                    fixed: 'left',
                }
            })
        })

        setTimeout(() => {
            triggerLinkingService({
                serviceId: 'service-8e312rbg3ds',
                eventValue: '123'
            })
            // triggerService('service-8e312rbg3ds').then((res) => {
            //     console.log('res', res)
            // })
        }, 3000)


    }, []);
}