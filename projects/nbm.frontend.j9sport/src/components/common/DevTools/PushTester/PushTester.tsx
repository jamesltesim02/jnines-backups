import { Button, Input } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom'
import mergeClass from '../../../../utils/mergeClass';

const NTS = [
  {
    name: 'nt5: 拉盘',
    content: (
`{
  "nt":5,
  "ts": 12345644,
  "data": {
    "mid": "",
    "spid": 10
  }
}`
    ),
  },
  {
    name: 'nt7: 比分变化',
    content: (
`{
  "nt":7,
  "ts": 1231654,
  "data":{
      "mid": "180666205122560",
      "spid": 10,
      "etype": 1,
      "score": "1:1",
      "gameScore": "",
      "setScore": ""
  }
}`
    )
  }
];

function PushTester () {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handlePush = () => {
    if (!message) {
      return;
    }
    try {
      const obj = JSON.parse(message);
      if (!obj) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent('test-push', { detail: { data: obj } })
      );
    } catch (e) {
      console.error(e);
    }
  }

  return ReactDOM.createPortal(
    <div
      className={mergeClass({
        'push-tester': true,
        open
      })}
    >
      <button
        className="btn-open"
        onClick={() => setOpen(!open)}
      >
        {open ? '<' : '>'}
      </button>
      <div>
        <header>推送调试</header>
        <div className="quick-set">
          {
            NTS.map(item => (
              <button
                key={item.name}
                onClick={() => setMessage(item.content)}
              >
                {item.name}
              </button>
            ))
          }
        </div>
        <section>
          <Input.TextArea
            rows={15}
            value={message}
            onChange={({ target: { value }}) => setMessage(value)}
          />
        </section>
        <footer>
          <Button onClick={() => setMessage('')}>清空</Button>
          <Button
            type="primary"
            onClick={handlePush}
          >发送</Button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

export default PushTester;
