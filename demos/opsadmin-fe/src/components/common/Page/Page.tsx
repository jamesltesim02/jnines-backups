import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

function Page (
  {
    navs = [],
    children
  }: {
    navs?: Array<{ path?: string, name: string }>,
    children?: any,
  }
) {
  return (
    <section className="page-conatiner">
      {
        navs && navs.length
        ? (
          <Breadcrumb>
            {
              navs.map((nav, i) => (
                <Breadcrumb.Item key={i}>
                  {
                    nav.path ? (
                      <Link to={nav.path}>{nav.name}</Link>
                    ) : nav.name
                  }
                </Breadcrumb.Item>
              ))
            }
          </Breadcrumb>
        ) : null
      }
      {children}
    </section>
  );
}

export default Page;
