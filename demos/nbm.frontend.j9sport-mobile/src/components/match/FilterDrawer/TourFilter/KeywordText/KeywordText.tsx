import React from 'react';
import { Icon } from 'antd-mobile';
import mergeClass from '../../../../../utils/mergeClass';
import IconSearch from '../../../../icons/IconSearch';

function SearchInput (
  {
    value,
    onChange
  }: {
    value?: string,
    onChange: (value: string) => void
  }
) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [focus, setFocus] = React.useState(false);

  return (
    <div
      className={mergeClass({
        'tour-filter-keyword': true,
        focus,
        valued: Boolean(value)
      })}
    >
      <label>
        <IconSearch size={13} />
        输入关键字检索联赛
      </label>
      <input
        ref={ref}
        type="text"
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={({ target: { value } }) => onChange(value)}
      />
      <button onClick={() => {
        onChange('');
        ref.current?.focus();
      }}>
        <Icon
          type="cross-circle-o"
          size="xxs"
        />
      </button>
    </div>
  );
}

export default SearchInput;
