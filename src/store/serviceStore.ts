import { idCreator, unBindFromService } from '@/utils';
import { TFormSerive, TFormSerives } from '@/types';
import { IBaseStore, IServiceStore } from './types';
import eventStore from './eventStore';

export default {
  /**
   * 服务
   */
  formServices: [],

  servicesMap: new Map(),

  setFormServices(services: TFormSerives) {
    this.formServices = services;
    // this.formServices.forEach((serv: TFormSerive) => {
    //   this.servicesMap.set(serv.id as string, serv);
    // });
  },
  /**
   * 获取服务
   */
  getFormServices() {
    return this.formServices;
  },

  /**
   * 新增服务
   */
  addService(serv: TFormSerive) {
    this.formServices.push(serv);
    // this.servicesMap.set(serv.id!, serv);
  },
  /**
   * 删除服务
   */
  async deleteService(id: string) {
    const confirmDelete = await eventStore.deleteId(id!);
    if (!confirmDelete) return;
    const idx = this.formServices!.findIndex((item) => item.id === id);
    unBindFromService(id);
    this.formServices.splice(idx, 1);
    // this.servicesMap.delete(id);
  },
  /**
   * 复制服务
   */
  copyService(serv: TFormSerive) {
    const idx = this.formServices!.findIndex((item) => item.id === serv.id);
    const newServ: TFormSerive = {
      ...serv,
      name: `${serv.name}-副本`,
      id: idCreator('service'),
      linkingElements: [],
    };
    this.formServices.splice(idx + 1, 0, newServ);
    // this.servicesMap.set(newServ.id!, newServ);
  },
  /**
   * 设置服务属性
   */
  setService(id: string, servAttr: Partial<TFormSerive>) {
    const idx = this.formServices!.findIndex((item) => item.id === id);
    const newService = { ...this.formServices![idx], ...servAttr };
    this.formServices[idx] = newService;
    // this.servicesMap.set(newService.id, newService);
  },
  /**
   * 根据id获取服务
   */
  getService(id: string) {
    return this.formServices.find((serv) => serv.id === id);
  },
} as Pick<IBaseStore, keyof IServiceStore>;
