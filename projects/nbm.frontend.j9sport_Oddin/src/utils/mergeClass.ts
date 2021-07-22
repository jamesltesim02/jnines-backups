/**
 * 
 * @param  {...any} source 需要合并的参数
 */
function mergeClass (...source: any[]) {
  const classes: string[] = [];

  source.forEach(s => {
    if (!s) {
      return;
    }

    if (typeof s === 'string') {
      classes.push(s);
      return;
    }

    if (typeof s === 'object') {
      Object.entries(s).forEach(([key, value]) => {
        if (!key || !value) {
          return;
        }
        classes.push(String(key));
      });
      return;
    }

    if (Array.isArray(s)) {
      classes.push(mergeClass(s));
    }
  });

  return classes.join(' ');
}

export default mergeClass;