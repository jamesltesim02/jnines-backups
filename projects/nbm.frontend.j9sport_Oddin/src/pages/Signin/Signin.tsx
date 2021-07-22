import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// import memberStore from '../../stores/member'

import { withApi } from '../../apis';
import User from '../../apis/User';

import ApictrueImage from './apicture.tiny.png';

function SigninPage (
  {
    api: { user }
  }: {
    api: { user: User }
  }
) {
  const onFinish = async (values: { username: string, password: string}) => {
    const hide = message.loading('登录中...', 0);
    try {
      const { token } = await user.login(values);
      message.success('登录成功');
      window.location.href = `/?token=${token}`;
    } finally {
      hide();
    }
  };

  return (
    <section className="sginin-container">
      <div className="left">
        <img src={ApictrueImage} alt="" />
      </div>
      <div className="right">
        <Card>
          <header>
          {/* 自动化运维管理平台 */}
          后台管理系统
          </header> 
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '账号不能为空' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入账号"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码不能为空' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </Form.Item>
            <Form.Item className="login-form-button">
              <Button
                type="primary"
                htmlType="submit"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
}

export default withApi({ user: User })(SigninPage);
