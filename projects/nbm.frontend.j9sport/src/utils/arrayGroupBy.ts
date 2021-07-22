const groupBy = (array: any, f: any) => {
  let groups = {} as any;
  array?.forEach(function (o: any) {
    const group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
};
const arrayGroupBy = (list: any, groupId: any) => {
  let sorted = groupBy(list, function (item: any) {
    return [item[groupId]];
  });
  return sorted;
};

export default arrayGroupBy;