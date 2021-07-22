import React from 'react';

function MemberLayout (
  {
    title,
    subTitle,
    children,
    className
  }: {
    title: string,
    subTitle: string,
    children?: any,
    className?: string
  }
) {
  return (
    <div className={`member-layout ${className}`}>
      <header>
        <div className="main-title">{title}</div>
        <div className="sub-title">{subTitle}</div>
      </header>
      <section>{children}</section>
    </div>
  );
}

export default MemberLayout;
