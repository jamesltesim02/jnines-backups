import React from 'react';
import { Spin, Collapse } from 'antd';

import { withApi } from '../../apis';
import Task from '../../apis/Task';

const { Panel } = Collapse;

const LogItem = withApi({ task: Task })(
  function (
    {
      api: { task },
      file,
      active
    }: {
      api: { task: Task },
      file: string,
      active: boolean
    }
  ) {
    const [loading, setLoading] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [content, setContent] = React.useState(null);

    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(
      () => {
        if (!active || loaded) {
          return;
        }

        setLoading(true);
        task.loadLogContent(file).then(
          result => {
            setContent(result);
            setLoaded(true);
          }
        ).then(
          () => setLoading(false)
        )
      },
      [task, file, active]
    );

    return (
      <div className="detail-log-item">
        {
          loading
          ? (<Spin />)
          : (<pre>{content}</pre>)
        }
      </div>
    );
  }
);

function DetailLogs (
  { list }: {
    list: Array<string>
  }
) {
  const [active, setActive] = React.useState<any>([list[0]]);

  React.useEffect(
    () => {
      setActive([list[0]]);
    },
    [list]
  );

  return (
    <Collapse
      activeKey={active}
      onChange={setActive}
      expandIconPosition="right"
    >
      {
        list.map(file => (
          <Panel
            key={file}
            header={file}
          >
            <LogItem
              file={file}
              active={active.includes(file)}
            />
          </Panel>
        ))
      }
    </Collapse>
  );
}

export default DetailLogs;
