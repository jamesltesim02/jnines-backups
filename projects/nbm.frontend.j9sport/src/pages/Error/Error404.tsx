import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../components/common/AppHeader/Logo';

import M from '../../components/common/m';

import './Error.less';

const Error404 = () => {
  return (
    <div className="error-page error-404">
      <div className="content">
        <header>
          <Logo />
          <label><M id="pages.404.title" /></label>
        </header>
        <section>
          <p><M id="pages.404.content_en" /></p>
          <p><M id="pages.404.content_zh" /></p>
          <Link
            to="/"
            className="button"
          >
            <M id="pages.404.back" />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Error404;
