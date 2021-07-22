import React from 'react';

function Step(
  {
    icon,
    activeIcon,
    title,
    children
  }: {
    icon: string
    activeIcon: string
    title: string
    children?: JSX.Element
  }
) {
  return (
    <div className="steps-step">
      {children}
    </div>
  );
}

export default Step;