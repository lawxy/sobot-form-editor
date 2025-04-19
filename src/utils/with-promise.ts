export const withPromise = (fn: () => any) => {
 return Promise.resolve().then(fn).then(val => val);
};