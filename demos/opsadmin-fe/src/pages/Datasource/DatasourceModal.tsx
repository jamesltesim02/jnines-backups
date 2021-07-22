import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  message,
  Button,
  Spin
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
  const [inputData, setInputData] = React.useState<any>({});
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [lastPassedDatasource, setLastPassedDatasource] = React.useState('');

  const currentDatasource = `${inputData.datasourceType}:${inputData.userName}-${inputData.password}@${inputData.ipAddress}:${inputData.port}/${inputData.schemaName}`;

  const handleFinish = async (data: any) => {
    if (initData?.related) {
      onClose();
      return;
    }
    if (
      testing
      ||
      currentDatasource !== lastPassedDatasource
    ) {
      return;
    }
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

  const handleTest = async () => {
    if (testing) {
      return;
    }
    try {
      setTesting(true);
      await datasource.checkConnect(inputData);
      message.success('连接成功，请点击确定按钮完成新建');
      setLastPassedDatasource(currentDatasource);
    } finally {
      setTesting(false);
    }
  };

  React.useEffect(
    () => {
      if (!open) {
        return;
      }
      if (initData) {
        form.setFieldsValue({ ...initData });
        setInputData({ ...initData });
        setLastPassedDatasource(
          `${initData.datasourceType}:${initData.userName}-${initData.password}@${initData.ipAddress}:${initData.port}/${initData.schemaName}`
        );
      } else {
        form.resetFields();
      }
    },
    [open, initData, form]
  );

  return (
    <Modal
      title={`${isEdit ? '查看/编辑' : '新建'}数据源`}
      visible={open}
      confirmLoading={saving}
      onCancel={onClose}
      width="660px"
      maskClosable={false}
      footer={
        <>
          <Button onClick={onClose}>取消</Button>
          {
            initData?.related ? null : (
              <Button
                type={
                  currentDatasource === lastPassedDatasource
                  ? 'default'
                  : 'primary'
                }
                disabled={testing}
                htmlType="button"
                onClick={handleTest}
              >
                测试连接
                {
                  testing
                  ? <Spin />
                  : null
                }
              </Button>
            )
          }
          <Button
            type="primary"
            disabled={
              testing
              ||
              currentDatasource !== lastPassedDatasource
            }
            onClick={form.submit.bind(form)}
          >确定</Button>
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleFinish}
        onValuesChange={(changedValues, allValues) => setInputData(allValues)}
      >
        {
          isEdit ? (
            <Form.Item
              name="id"
              hidden
            >
              <Input
                value={initData.id}
                disabled={initData?.related}
              />
            </Form.Item>
          ) : null
        }
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="datasourceName"
              label="名称"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入数据源名称!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="datasourceType"
              label="类型"
              rules={[{ required: true, message: '请选择数据源类型!' }]}
            >
              <Select disabled={initData?.related}>
                <Option value={1}>输入</Option>
                <Option value={2}>输出</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="schemaName"
              label="库名"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入库名!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ipAddress"
              label="地址"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入数据源地址!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="port"
              label="端口"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入端口!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userName"
              label="账号"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入数据库登录账号!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="密码"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '请输入数据库登录密码!' }]}
            >
              <Input
                allowClear
                autoComplete="off"
                disabled={initData?.related}
              />
            </Form.Item>
          </Col>
          {

          }
          {
            initData?.related ? (
              <Col
                span={24}
                style={{ color: '#ff4d4f'}}
              >* 已有任务关联到此数据源, 因此该数据源不能修改!</Col>
            ) : null
          }
        </Row>
      </Form>
    </Modal>
  );
}

export default withApi({
  datasource: Datasource
})(DatasourceModal);
