import React from 'react';
import { List, InputItem, Button, Toast } from 'antd-mobile';

import AppHeader from '../../components/common/AppHeader';
import { useApi } from '../../apis';
import User from '../../apis/User';

function Signin () {
  const [params, setParams] = React.useState({
    username: '',
    password: ''
  });

  const [user] = useApi([User]);

  const handleSignIn = async () => {
    console.log(params)
    if (!params.username || !params.password) {
      return;
    }
    Toast.loading('登录中...', 0);
    try {
      const { token } = await user.login(params);
      Toast.success('登录成功');
      window.location.href = `/?token=${token}`;
    } finally {
      Toast.hide();
    }
  };

  return (
    <>
      <AppHeader />
      <List
        renderHeader={() => <>用户登录</>}
        className="my-list"
      >
        <InputItem
          clear
          value={params.username}
          onChange={(username) => setParams({ ...params, username })}
          onKeyUp={({ keyCode }: any) => {
            if (keyCode === 13) {
              handleSignIn();
              return;
            }
          }}
        >账号:</InputItem>
        <InputItem
          clear
          type="password"
          value={params.password}
          onChange={(password) => setParams({ ...params, password })}
          onKeyUp={({ keyCode }: any) => {
            if (keyCode === 13) {
              handleSignIn();
              return;
            }
          }}
        >密码:</InputItem>
        <List.Item>
          <Button
            type="primary"
            size="small"
            inline
            onClick={handleSignIn}
          >登录</Button>
          <Button
            type="ghost"
            size="small"
            inline
            onClick={() => {
              window.location.href = '/';
            }}
            style={{ marginLeft: 10 }}
          >暂不登录</Button>
        </List.Item>
        <div style={{
          padding: '20px 10px'
        }}>
          账号: ag021~ag030
          <br />
          密码: 111111
        </div>
      </List>
    </>
  );
}

export default Signin;