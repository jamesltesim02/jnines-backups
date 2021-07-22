import React from 'react';

function GroupListHeader(
  {
    title
  }: {
    title: string
  }
) {
  return (
    <div className="group-list-header">
      {title}
      <i/>
    </div>
  );
}

export default GroupListHeader;