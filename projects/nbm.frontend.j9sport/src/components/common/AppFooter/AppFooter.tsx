import React from 'react';
import { Link } from 'react-router-dom';

import M from '../m';

function AppFooter () {
  return (
    <footer className="app-footer">
      <Link to="/rules">
        <M id="pages.rules" />
      </Link>
      &nbsp;|&nbsp;
      <Link to="/specialnote">
        <M id="pages.special_rules" />
      </Link>
      &nbsp;|&nbsp;
      <M id="common.copyright" />
    </footer>
  );
}

export default AppFooter;
