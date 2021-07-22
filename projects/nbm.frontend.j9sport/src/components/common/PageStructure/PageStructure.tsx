import React from 'react';
import AppFooter from '../AppFooter';

import AppHeader from '../AppHeader';

function PageStructure (
  {
    children
  }: any
) {
  return (
    <div className="content-structure">
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}

export default PageStructure;
