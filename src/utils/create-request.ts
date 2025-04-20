import axios from 'axios';
import { message } from '@sobot/soil-ui';

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
    const func = new Function('message', 'axios', `${interceptors}`);
    func(message, request);
    return request;
  } catch (e) {
    console.log('createRequest error');
    console.log(e);
    return axios;
  }
}
