declare function toOptionName (
  marketType: number,
  marketGroup: number,
  betBar?: any,
  betOption?: any
): {
  prefix?: any,
  key?: any,
  value?: any,
  suffix?: any,
  params?: any
};

declare function OptionName (
  {
    marketType, 
    marketGroup,
    betBar, 
    betOption
  }: {
    marketType: number,
    marketGroup: number,
    betBar?: any,
    betOption?: any
  }
): any;

export { toOptionName };
export default OptionName;