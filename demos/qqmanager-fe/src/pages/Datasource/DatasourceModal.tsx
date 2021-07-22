import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  message
} from 'antd';

import { withApi } from '../../apis';
import Datasource from '../../apis/Datasource';

const { Option } = Select;

function DatasourceModal (
  {
    api: { datasource },
    open = false,
    initData = null,
    onClose = () => {},
    onFinish = () => {}
  }: {
    api: { datasource: Datasource },
    open: boolean,
    initData?: any,
    onClose: any,
    onFinish: any,
  }
) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initData);

  const [saving, setSaving] = React.useState(false);

  const handleFinish = async (data: any) => {
    try {
      setSaving(true);
      if (isEdit) {
        await datasource.update(data);
      } else {
        await datasource.add(data);
      }
      message.success(`${isEdit ? '修改' : '添加'}成功!`);
      onFinish();
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(
    () => {
      if (!open) {
        return;
      }
      if (initData) {
        form.setFieldsValue(initData);
      } else {
        form.resetFields();
      }
    },
    [open, initData, form]
  )

  return (
    <Modal
      title={`${isEdit ? '查看/编辑' : '创建'}数据源`}
      visible={open}
      maskClosable
      confirmLoading={saving}
      onOk={form.submit.bind(form)}
      onCancel={onClose}
      width="640px"
    >
      <Form
        form={form}
        onFinish={handleFinish}
      >
        {
          isEdit ? (
            <Form.Item
              name="id"
              hidden
            >
              <Input value={initData.id} />
            </Form.Item>
          ) : null
        }
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="datasourceName"
              label="名称"
              rules={[{ required: true, message: '请输入数据源名称!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="datasourceType"
              label="类型"
              rules={[{ required: true, message: '请选择数据源类型!' }]}
            >
              <Select>
                <Option value={1}>输入</Option>
                <Option value={2}>输出</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="schemaName"
              label="库名"
              rules={[{ required: true, message: '请输入库名!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ipAddress"
              label="地址"
              rules={[{ required: true, message: '请输入数据源地址!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="port"
              label="端口"
              rules={[{ required: true, message: '请输入端口!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userName"
              label="账号"
              rules={[{ required: true, message: '请输入数据库登录账号!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入数据库登录密码!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default withApi({
  datasource: Datasource
})(DatasourceModal);
