import { dynamicGetStore } from "./dynamic-get-store";
import moment from 'moment';
import * as antd from 'antd';
import store from '@/store';


/**
 * @param jsFunction 需要解析的js函数
 * @param valueWhenError 解析出错时的默认返回值
 */
interface IParseJsProps {
  jsFunction: string;
  valueWhenError?: any;
  dependencies?: Array<any>;
  dependenciesString?: Array<string>;
}

const setCommonDependencies = (dependencies: Array<any>, dependenciesString: Array<string>) => {
  const { LOCALE } = store;
  dependencies.push(store, moment, antd, LOCALE || {});
  dependenciesString.push('store', 'moment', 'antd', 'LOCALE');
}

export function parseJs({
  jsFunction,
  valueWhenError,
  dependencies = [],
  dependenciesString = [],
}: IParseJsProps): { value: any } {
  if (!jsFunction) {
    return {
      value: valueWhenError,
    };
  }

  setCommonDependencies(dependencies, dependenciesString);
  try {
    const value = new Function(
      ...dependenciesString,
      `${jsFunction}; return main({${dependenciesString.join(',')}})`,
    )(...dependencies);
    return {
      value,
    };
  } catch (e) {
    console.warn(`字符串解析出错 \n ${jsFunction} \n ${e}`);
  }
  return {
    value: valueWhenError,
  };
}

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export async function parseJsAsync({
  jsFunction,
  valueWhenError,
  dependencies = [],
  dependenciesString = [],
}: IParseJsProps): Promise<{ value: any }> {

  if (!jsFunction) {
    return {
      value: valueWhenError,
    };
  }

  setCommonDependencies(dependencies, dependenciesString);

  try {
    const asyncFn = new AsyncFunction(
      ...dependenciesString,
      `${jsFunction}; return main({${dependenciesString.join(',')}})`,
    );
    const value = await asyncFn(...dependencies);
    return {
      value,
    };
  } catch (e) {
    console.warn(`字符串解析出错 \n ${jsFunction} \n ${e}`);
  }
  return {
    value: valueWhenError,
  };
}