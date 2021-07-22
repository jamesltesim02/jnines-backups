import React from 'react';

import LogoImage from '../../components/common/AppHeader/logo.png';
import M from '../../components/common/m';

import './Error.less';

import appStore from '../../stores/app';

const Error503 = () => {
  const { maintenancetime } = appStore.systemState;
  return (
    <div className="error-page error-503">
      <div className="content">
        <header>
          <img src={LogoImage} alt="" />
          <label><M id="pages.503.title" /></label>
        </header>
        <section>
          <p><M id="pages.503.customer" /></p>
          <p><M id="pages.503.content" /></p>
          {
            Boolean(maintenancetime) ? (
              <p>
                <M
                  id="pages.503.time"
                  values={{
                    start: maintenancetime.startTime,
                    end: maintenancetime.endTime
                  }}
                />
              </p>
            ) : null
          }
          <p><M id="pages.503.qa" /></p>
        </section>
      </div>
    </div>
  );
};

export default Error503;
