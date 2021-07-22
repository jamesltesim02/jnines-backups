import dayjs from "dayjs";

export const disabledDate = (value: any) => {
  return value.valueOf() < dayjs().subtract(15, 'day') || value.valueOf() > Date.now();
}