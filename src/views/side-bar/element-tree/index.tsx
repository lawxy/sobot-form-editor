import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { message, Tree, Input, Highlight, Menu, Popconfirm, Ellipsis } from '@sobot/soil-ui';
import { Dropdown } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { isTabs, isTabPanel } from '@/elements/tabs';
import { prefixCls } from '@/const';
import store from '@/store';
import { IBaseElement } from '@/types';
import { parseText } from '@/utils';
import './style.less'

const loop = (data: IBaseElement[], { isDraggable, searchValue }: { isDraggable: boolean, searchValue: string }): DataNode[] => {
    if (!data?.length) return [];

    const searchElement = store.getElement(searchValue.trim());

    return data.map((item: IBaseElement) => {
        searchValue = (searchElement ? searchElement.id === item.id ? parseText(searchElement.elementName) : '' : searchValue) as string;
        return {
            key: item.id,
            title: (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key='delete'>
                                <Popconfirm
                                    title="确认删除"
                                    onConfirm={() => {
                                        store.deleteEl(item);
                                    }}
                                >
                                    删除
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['contextMenu']}
                    // @ts-ignore
                    getPopupContainer={(n) => n.parentNode}
                >
                    <span data-id={item.id}><Ellipsis><Highlight input={parseText(item.elementName)} text={searchValue} /></Ellipsis></span>
                </Dropdown>
            ),
            children: loop(item?.children || [], { isDraggable: !item.isGroup, searchValue }),
            isDraggable,
        } as DataNode
    });
};

const validateMove = (fromId: string, toParentId: string) => {
    if (isTabs(toParentId) && !isTabPanel(fromId)) {
        message.error('非tab元素不能插入到tabs中');
        return false;
    }
    if (!isTabs(toParentId) && isTabPanel(fromId)) {
        message.error('tab元素不能插入到非tabs元素中');
        return false;
    }

    return true;
}

export const ElementTree = observer(() => {
    const { moveElInDifferentParent, moveElInSameParent, getElement, setSelectedElement, formElements, getEditorAttr, selectedElement } = store;

    const [searchValue, setSearchValue] = useState('');

    const treeData = loop(formElements, { isDraggable: true, searchValue });

    const handleDrop = (info: any) => {
        // node是被插入元素，dragNode是拖拽元素
        const { node, dragNode, dropPosition } = info;
        const { key: dragKey } = dragNode;

        const dragElement = getElement(dragKey);
        const dragParentId = dragElement?.parentId;
        const dragHtmlElement = document.querySelector(`[data-id="${dragKey}"]`) as HTMLElement;
        const editorId = getEditorAttr('id') as string;

        if (dropPosition === -1) {
            // 插入到整个编辑器最前面
            if (dragParentId === editorId) {
                const fromIndex = formElements?.findIndex(item => item.id === dragKey);
                const toIndex = 0;
                moveElInSameParent(dragParentId!, fromIndex!, toIndex);
            } else {
                moveElInDifferentParent(dragHtmlElement!, editorId!, 0, true);
            }

            return;
        }

        const { key: dropKey, expanded } = node;
        const dropElement = getElement(dropKey);
        const dropParentId = dropElement?.parentId;
        const dropParentElement = getElement(dropParentId);

        // expand表示落入节点处于展开状态，为true且有children 表示插入到node的子元素，并且为第一个子元素
        if (expanded && dropElement?.children?.length) {
            // 如果是在同一个容器
            if (dragParentId === dropElement!.id) {
                const fromIndex = dropElement!.children?.findIndex(item => item.id === dragKey);
                const toIndex = 0;
                moveElInSameParent(dragParentId!, fromIndex!, toIndex);
            } else {
                // debugger;
                if (validateMove(dragKey, dropElement!.id!)) {
                    moveElInDifferentParent(dragHtmlElement!, dropElement!.id!, 0, true);
                }
            }
        } else {
            // expanded为false或者没有children表示插入到这个元素的后面
            if (dragParentId === dropParentId) {
                const els = dragParentId === editorId ? formElements : dropParentElement!.children;
                const fromIndex = els?.findIndex(item => item.id === dragKey);
                const toIndex = els?.findIndex(item => item.id === dropKey);
                if (fromIndex! > toIndex!) {
                    moveElInSameParent(dropParentId!, fromIndex!, toIndex! + 1);
                } else {
                    moveElInSameParent(dropParentId!, fromIndex!, toIndex!);
                }
            } else {
                if (validateMove(dragKey, dropParentId!)) {
                    const els = dropParentId === editorId ? formElements : dropParentElement!.children;
                    const toIndex = els?.findIndex(item => item.id === dropKey);
                    moveElInDifferentParent(dragHtmlElement!, dropParentId!, toIndex! + 1, true);
                }
            }
        }
    }

    const handleSelect = (selectedKeys: string[]) => {
        if (!selectedKeys.length) {
            setSelectedElement({});
            return;
        };
        const el = getElement(selectedKeys[0])
        setSelectedElement(el!)
    }

    return (
        <div className={prefixCls('side-bar-content')} >
            <div className={prefixCls('side-bar-content-title')}>组件树</div>
            <Input.Search 
                placeholder='请输入组件名或完整的组件id' 
                // value={searchValue} 
                onSearch={(e: any) => setSearchValue(e.target.value)} 
            />
            <Tree
                onDrop={handleDrop}
                treeData={treeData}
                selectedKeys={selectedElement?.id ? [selectedElement.id] : []}
                defaultExpandAll
                draggable={(node: any) => {
                    return node.isDraggable;
                }}
                onSelect={handleSelect as any}
            />
        </div>
    )
});
