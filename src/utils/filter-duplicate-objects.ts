export function filterDuplicateObjects<T extends Record<string, any>>(arr: T[]): T[] {
    const set = new Set();
    return arr.filter(item => {
      const stringified = JSON.stringify(item, Object.keys(item).sort());
      return set.has(stringified) ? false : set.add(stringified);
    });
  }
