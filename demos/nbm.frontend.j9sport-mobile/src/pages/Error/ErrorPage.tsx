import React from 'react';
import AppHeader from '../../components/common/AppHeader';
import mergeClass from '../../utils/mergeClass';

import LogoImage from '../../assets/images/logo.png';

import './Error.less';

function ErrorPage (
  {
    errorTitle,
    headerVisible = false,
    className,
    children
  }: {
    errorTitle: any,
    headerVisible?: boolean,
    className?: string,
    children?: any
  }
) {
  return (
    <div className={mergeClass({
      'error-page': true,
      [String(className)]: Boolean(className),
      headered: headerVisible
    })}>
      {
        headerVisible
        ? <AppHeader />
        : null
      }
      <i className="holder" />
      <header className="error-header">
        <img alt="" src={LogoImage} />
        <label>{errorTitle}</label>
      </header>
      {children}
    </div>
  );
};

export default ErrorPage;