import React from 'react';

import AppHeader from '../AppHeader';
import M from '../m';

function PageStructure (
  {
    children
  }: any
) {
  return (
    <div className="content-structure">
      <AppHeader />
      {children}
      <footer>
        <M id="common.copyright" />
      </footer>
    </div>
  );
}

export default PageStructure;
