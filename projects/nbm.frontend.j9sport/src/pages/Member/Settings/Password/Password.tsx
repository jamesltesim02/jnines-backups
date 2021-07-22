import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { registerPasswordReg } from "../../../../consts/regexr";
import Back from "../Back";
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";
import memberStore from "../../../../stores/member";

import LoadingBar from "../../../../components/common/LoadingBar";

function Password() {
  const [user] = useApi([User])
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const onFinish = async (formData: any) => {
    try {
      setLoading(true)
      await user.passwordChange({
        ...formData,
        loginName: memberStore.username
      })
      message.success('密码修改成功!')
      history.goBack()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Back title="修改密码"/>
      <div className="change-container">
        <Form
          name='change'
          onFinish={onFinish}
        >
          <Form.Item
            label="原始密码"
            name="oldPassword"
            rules={[
              {required: true, message: '原始密码不能为空'}
            ]}
            hasFeedback
          >
            <Input.Password className="form-input"/>
          </Form.Item>
          <Form.Item
            label="新密码&nbsp;&nbsp;&nbsp;&nbsp;"
            name="password"
            rules={[
              {required: true, message: '新密码不能为空'},
              {pattern: registerPasswordReg, message: '密码8～14位字母和数字'},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('新旧密码不能相同'));
                }
              })
            ]}
            dependencies={['oldPassword']}
            hasFeedback
          >
            <Input.Password className="form-input"/>
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {required: true},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password className="form-input"/>
          </Form.Item>
          <Form.Item>
            <button className="btn-submit">
              {!loading ? "修改" : < LoadingBar/>}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Password;