import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Radio } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import type { FC, PropsWithChildren } from 'react';
import baseStore from '@/store';
import eventRelationStore from '@/store/eventRelationStore';
import type { TFormSerive, IBaseElement } from '@/types';
import store from '@/store';
import { parseText } from '@/utils';

const EventRelationModalContent: FC<
  PropsWithChildren<{
    id: string;
  }>
> = ({ children, id }) => {
  const [open, setOpen] = useState(false);

  // const sets = eventRelationStore.getSetsFromId(id);
  const { sets, linkElement, linkEditor, render } = eventRelationStore.findRelationWhenDelete(id);

  // let linkElement = false;
  // let linkEditor = false;

  // const sourceElements = new Set<IBaseElement>();
  // const sourceServices = new Set<TFormSerive>();

  // sets.forEach((set) => {
  //   // @ts-ignore
  //   for (const sourceId of set.keys()) {
  //     const sourceElement = baseStore.getElement(sourceId);
  //     const sourceService = baseStore.getService(sourceId);

  //     if (sourceId === baseStore.getEditorAttr('id')) {
  //       linkEditor = true;
  //     } else if (sourceElement) {
  //       linkElement = true;
  //       sourceElements.add(sourceElement);
  //     } else if (sourceService) {
  //       linkElement = true;
  //       sourceServices.add(sourceService);
  //     }
  //   }
  // });

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setOpen(true);
          },
        })}
      <Modal
        visible={open}
        title='关联关系'
        maskClosable={false}
        destroyOnClose
        bodyStyle={{
          height: 500,
          overflow: 'auto',
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        {render}
        {/* <div>
          {linkEditor && (
            <div>
              <span>关联编辑器</span>
              <ul>
                <li>
                  <span>{store.getEditorAttr('id')}</span>
                </li>
              </ul>
            </div>
          )}
          {sourceElements.size > 0 && (
            <div>
              <span>关联组件</span>
              <ul>
                {Array.from(sourceElements).map((el) => (
                  <li key={el.id}>{parseText(el.elementName) ? parseText(el.elementName) + ' ( ' + el.id + ' )' : el.id}</li>
                ))}
              </ul>
            </div>
          )}
          {sourceServices.size > 0 && (
            <div>
              <span>关联服务</span>
              <ul>
                {Array.from(sourceServices).map((service) => (
                  <li key={service.id}>{service.name} ( {service.id} )</li>
                ))}
              </ul>
            </div>
          )}
        </div> */}
      </Modal>
    </>
  );
};

export const EventRelationModal = observer(EventRelationModalContent);
