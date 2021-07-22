/**
 * 
 * @param  {...any} source 需要合并的参数
 */
function mergeClass (...source: any[]) {
  const classes: string[] = [];

  source.filter(Boolean).forEach(s => {
    if (!s) {
      return;
    }

    if (typeof s === 'string') {
      classes.push(s);
      return;
    }

    if (Array.isArray(s)) {
      classes.push(mergeClass(...s));
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
  });

  return classes.join(' ');
}

export default mergeClass;