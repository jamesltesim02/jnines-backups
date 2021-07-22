import random from 'lodash/random';
import dayjs from 'dayjs';

export const makeRecords = ({
  range = [100],
  fill = () => {},
  sorter
}) => {
  const data = []
  const length = (
    range.length === 1
    ? range[0]
    : random(...range)
  )

  for (let i = 0; i <= length; i += 1) {
    data.push(fill(i, data))
  }

  if (sorter) {
    data.sort(sorter)
  }

  return data;
};

export const randomCharactors = ({
  source = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_',
  min,
  max
}) => (
  new Array(
    !max ? min : random(min, max)
  ).fill(undefined).map(
    () => (
      source[random(0, source.length)]
    )
  ).join('')
);

export const randomTime = (
  range,
  format = 'YYYY/MM/DD HH:mm:ss'
) => dayjs(
  new Date(Date.now() - random(0, range))
).format(format);

export const slicePage = (
  result,
  pageIndex = 1,
  pageSize = 20
) => ({
  code: 0,
  msg: '',
  data: {
    pageSize,
    pageIndex,
    total: result.length,
    list: result.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
  }
})

export const randomItem = (array = [], defaultValue) => (
  array[random(0, array.length - 1)] || defaultValue
)
