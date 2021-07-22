import React from 'react';
import dayjs from 'dayjs';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Button,
  Divider,
  message
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import Tasks from '../../apis/Task';
import Datasource from '../../apis/Datasource';
import { withApi } from '../../apis';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

function TaskModal (
  {
    api: {
      tasks,
      datasource
    },
    open = false,
    initData = null,
    onClose = () => {},
    onFinish = () => {}
  }: {
    api: {
      tasks: Tasks,
      datasource: Datasource
    },
    open: boolean,
    initData: any,
    onClose: any,
    onFinish: any,
  }
) {
  const [form] = Form.useForm();
  const isEdit = Boolean(initData);

  const [saving, setSaving] = React.useState(false);
  const [inputData, setInputData] = React.useState<any>({});
  const [datasources, setDatasources] = React.useState([]);
  const [outputTables, setOutputTables] = React.useState<any>([]);
  const [loadingTables, setLoadingTables] = React.useState(false);

  const handleFinish = async (
    {
      pythonFilePath,
      inputDatasourceType,
      inputPandaUrl,
      ...data
    }: any
  ) => {

    try {
      setSaving(true);
      if (pythonFilePath && pythonFilePath.length) {
        data.pythonFilePath = pythonFilePath[0].response;
      }
      if (inputPandaUrl && inputPandaUrl.length > 0) {
        data.inputPandaUrl = inputPandaUrl[0].response;
      }

      if (isEdit) {
        data.id = initData.id;
        if (!data.pythonFilePath) {
          data.pythonFilePath = initData.pythonFilePath
        }
        if (!data.inputPandaUrl) {
          data.inputPandaUrl = initData.inputPandaUrl
        }

        await tasks.update(data);
      } else {
        await tasks.add(data);
      }
      message.success(`${isEdit ? '修改' : '新增'}成功!`);
      onFinish();
    } finally {
      setSaving(false);
    }
  };

  const normFile = (e: any) => {
    console.log('norm file:', e);
    if (Array.isArray(e)) {
      return e;
    }
    if (!e) {
      return e;
    }

    return (e.fileList.length > 1 ? [e.fileList.pop()] : e.fileList);
  };

  const customUpload = async (
    {
      file,
      onError,
      onSuccess
    }: any
  ) => {
    try {
      const result = await tasks.upload(file);
      onSuccess(result);
    } catch (e) {
      onError(e);
    }
  };

  React.useEffect(
    () => {
      datasource.list({
        pageIndex: 1,
        pageSize: 999999
      }).then(
        ({ list=[] }: any) => setDatasources(list)
      );
    },
    [datasource, setDatasources]
  );

  React.useEffect(
    () => {
      if (!inputData.outputDatasourceId) {
        setOutputTables([]);
        return;
      }
      setLoadingTables(true);
      datasource.tableList(
        inputData.outputDatasourceId
      ).then(
        (tables: any[]) => setOutputTables(tables)
      ).finally(
        () => setLoadingTables(false)
      );
    },
    [inputData.outputDatasourceId, datasource, setOutputTables]
  );

  React.useEffect(
    () => {
      if (!open) {
        return
      }
      if (initData) {
        form.setFieldsValue({
          ...initData,
          executeStart: (
            (
              initData.executeStart
              &&
              typeof initData.executeStart === 'string'
            )
            ? dayjs(initData.executeStart)
            : initData.executeStart
          ),
          pythonFilePath: null,
          inputPandaUrl: null
        });
      } else {
        form.resetFields();
      }
    },
    [open, initData, form]
  );

  return (
    <Modal
      title={`${isEdit ? '修改' : '新增'}任务`}
      visible={open}
      maskClosable
      confirmLoading={saving}
      onOk={form.submit.bind(form)}
      onCancel={onClose}
      width="640px"
      className="tasks-modal"
    >
      <Form
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
        initialValues={{
          executeType: 1,
          executeUnit: 'minute',
          inputDatasourceType: (
            isEdit
            ? (initData.outputDatasourceId? 1 : 2)
            : 1
          )
        }}
        onValuesChange={(changedValues, allValues) => setInputData(allValues)}
      >
        <Divider orientation="left">模型任务配置:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="taskName"
              label="任务名称"
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="executeType"
              label="任务类型"
            >
              <Select>
                <Option value={1}>即时任务</Option>
                <Option value={2}>定时任务</Option>
              </Select>
            </Form.Item>
          </Col>
          {
            inputData.executeType === 2
            ? (
              <>
                <Col span={12}>
                  <Form.Item label="执行频率">
                    <Input.Group compact>
                      <Form.Item
                        name="executeDuring"
                        noStyle
                      >
                        <InputNumber
                          style={{ width: '70%' }}
                          min={0}
                          precision={0}
                        />
                      </Form.Item>
                      <Form.Item
                        name="executeUnit"
                        noStyle
                        rules={[{ required: true, message: 'Province is required' }]}
                      >
                        <Select style={{ width: '30%' }}>
                          <Option value="second">秒</Option>
                          <Option value="minute">分</Option>
                          <Option value="hour">时</Option>
                          <Option value="day">日</Option>
                          <Option value="month">月</Option>
                          <Option value="week">周</Option>
                          <Option value="year">年</Option>
                        </Select>
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="executeStart"
                    label="初始时间"
                  >
                    <DatePicker
                      showTime
                      format={DATE_FORMAT}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null
          }
          <Col span={12}>
            <Form.Item
              name="pythonFilePath"
              label="模型文件"
              getValueFromEvent={normFile}
              valuePropName="fileList"
              className="file-upload"
            >
              <Upload
                name="file"
                defaultFileList={(inputData.defaultPythonFilePath || {}).fileList}
                customRequest={customUpload}
              >
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="logRootPath"
              label="日志路径"
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">输入数据源配置:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="inputDatasourceType"
              label="数据源类型"
            >
              <Select>
                <Option value={1}>普通数据源</Option>
                <Option value={2}>测试数据源</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {
              inputData.inputDatasourceType === 2
              ? (
                <Form.Item
                  name="inputPandaUrl"
                  label="测试数据源"
                  getValueFromEvent={normFile}
                  valuePropName="fileList"
                  className="file-upload"
                >
                  <Upload
                    name="file"
                    customRequest={customUpload}
                  >
                    <Button icon={<UploadOutlined />}>上传</Button>
                  </Upload>
                </Form.Item>
              ) : (
                <Form.Item
                  name="inputDatasourceId"
                  label="输入数据源"
                >
                  <Select>
                    {
                      datasources.filter(
                        ({ datasourceType }: any) => datasourceType === 2
                      ).map(
                        (item: any) => (
                          <Option
                            key={item.id}
                            value={item.id}
                          >{item.datasourceName}</Option>
                        )
                      )
                    }
                  </Select>
                </Form.Item>
              )
            }
          </Col>
          <Col span={12}>
            <Form.Item
              name="inputTableName"
              label="数据源表名"
            >
              <Input
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">输出数据源配置:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="outputDatasourceId"
              label="输出数据源"
            >
              <Select onChange={() => form.setFieldsValue({ outputTableName: '' })}>
                {
                  datasources.filter(
                    ({ datasourceType }: any) => datasourceType === 2
                  ).map(
                    (item: any) => (
                      <Option
                        key={item.id}
                        value={item.id}
                      >{item.datasourceName}</Option>
                    )
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="outputTableName"
              label="数据源表名"
            >
              <Select loading={loadingTables}>
                {
                  outputTables.map(
                    (item: string) => (
                      <Option
                        key={item}
                        value={item}
                      >{item}</Option>
                    )
                  )
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default withApi({
  tasks: Tasks,
  datasource: Datasource
})(TaskModal);
