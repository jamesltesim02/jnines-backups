import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  message
} from 'antd';

import memberStore from '../../stores/member';

import { withApi } from '../../apis';
import User from '../../apis/User';

import Page from '../../components/common/Page';

const ModifyPasswordPage = (
  {
    api: { user },
  }: {
    api: {
      user: User
    }
  }
) => {
  const history = useHistory();

  const handleFinish = async (values: {
    password: string,
    newPassword: string,
  }) => {
    const hide = message.loading('提交中...', 0);
    try {
      await user.updatePwd({
        ...values,
        username: memberStore.memberInfo.username
      });
      message.success('修改成功,请重新登录');
      memberStore.memberInfo = null;
      history.replace('/signin');
    } finally {
      hide()
    }
    return null
  }

  return (
    <Page
      navs={[
        { name: '用户中心' },
        { name: '修改密码' },
      ]}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handleFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ width: 480 }}
        >
          <Form.Item
            label="当前密码"
            name="password"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新  密  码"
            name="passwordNew"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Row>
            <Col
              span={18}
              offset={6}
            >
              <Button
                type="primary"
                htmlType="submit"
              >提&nbsp;&nbsp;&nbsp;&nbsp;交</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Page>
  )
}

export default withApi({
  user: User
})(ModifyPasswordPage);
