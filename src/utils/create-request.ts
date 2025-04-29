import axios from 'axios';
import { parseJs } from './parse-js';

export function createRequest({
  interceptors,
  contentType,
}: {
  interceptors: string;
  contentType: string;
}) {
  try {
    const request = axios.create({
      headers: {
        'Content-Type': contentType,
      },
    });
    // const func = new Function('message', 'axios', `${interceptors}`);
    // func(message, request);

    parseJs({
      jsFunction: interceptors,
      dependencies: [request],
      dependenciesString: ['axios'],
    });

    return request;
  } catch (e) {
    console.log('createRequest error');
    console.log(e);
    return axios;
  }
}
