import React from 'react';

import { Urls } from '../../configs';
import { ResourceDir } from '../../consts/network';

export function getResourceUrl (src: string, dir?: ResourceDir, cdn = true) {
  let url = src;
  if (
    !/(^https?:\/\/)|(^data:image\/)/i.test(url)
    &&
    cdn
  ) {
    url = `${Urls.RESOURCE_URL}${dir ? `${dir}/` : ''}${src}`;
  }
  return url;
}

function Image (
  {
    src,
    dir,
    cdn = true,
    ...props
  }: any
) {
  
  return (
    <img
      alt=""
      src={getResourceUrl(src, dir, cdn)}
      {...props}
    />
  );
}

export default Image;
