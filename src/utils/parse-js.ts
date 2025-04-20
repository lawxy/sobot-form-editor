/**
 * @param jsFunction 需要解析的js函数
 * @param valueWhenError 解析出错时的默认返回值
 */
export function parseJs({
  jsFunction,
  valueWhenError,
  dependencies = [],
  dependenciesString = [],
}: {
  jsFunction: string;
  valueWhenError: any;
  dependencies?: Array<any>;
  dependenciesString?: Array<string>;
}): { value: any } {
  try {
    console.log('jsFunction', jsFunction);
    const value = new Function(
      ...dependenciesString,
      `${jsFunction}; return main(${dependenciesString.join(',')})`,
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
