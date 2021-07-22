import AppConfig from '../../configs';

function HideForThird ({ children }: { children?: any }) {
  return (
    AppConfig.THIRD_MODE
    ? null
    : children
  );
}

export default HideForThird;
