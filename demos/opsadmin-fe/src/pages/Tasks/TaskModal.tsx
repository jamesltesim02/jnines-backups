import React from 'react';
import dayjs from 'dayjs';
import range from 'lodash/range';
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
import { useHistory } from 'react-router-dom';
import MultipleRepeatableSelect from './MultipleRepeatableSelect';
import { fromPairs } from 'lodash';
import TableModal from '../Datasource/TableModal';
import mergeClass from '../../utils/merge-class';

const { Option } = Select;

const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function TaskModal (
  {
    api: {
      tasks,
      datasource
    },
    open = false,
    executeable = false,
    initData = null,
    onClose = () => {},
    onFinish = () => {}
  }: {
    api: {
      tasks: Tasks,
      datasource: Datasource
    },
    open: boolean,
    executeable: boolean,
    initData: any,
    onClose: any,
    onFinish: any,
  }
) {
  const history = useHistory();
  const [form] = Form.useForm();
  const isEdit = Boolean(initData);

  const [saving, setSaving] = React.useState(false);
  const [inputData, setInputData] = React.useState<any>({});
  const [datasources, setDatasources] = React.useState([]);
  const [outputTables, setOutputTables] = React.useState<any>([]);
  const [loadingTables, setLoadingTables] = React.useState(false);
  const [columns, setColumns] = React.useState([]);

  const [tableInputing, setTableInputing] = React.useState(false);
  const [refreshTableVersion, setRefreshVersion] = React.useState(0);

  const handleFinish = async (
    {
      pythonFile,
      inputDatasourceType,
      inputPanda,
      timeRange,
      ...data
    }: any
  ) => {
    if (!executeable && data.executeType === 1) {
      return;
    }
    data.inputTableName = 'scada_data';
    if (data.sourceColum?.length) {
      data.targetColum = (
        data.sourceColum
          .map(
            (fname: string) => data.targetColum[fname]
          )
          .join(',')
      );
      data.sourceColum = data.sourceColum.join(',');
    }

    try {
      setSaving(true);
      if (pythonFile && pythonFile.length) {
        data.pythonFilePath = pythonFile[0].response || pythonFile[0].originFileObj.savePath;
        data.pythonFileName = pythonFile[0].name;
      }
      if (inputPanda && inputPanda.length > 0) {
        data.inputPandaUrl = inputPanda[0].response || inputPanda[0].originFileObj.savePath;
      }

      if (timeRange) {
        data.startTime = timeRange[0];//.format(DATE_FORMAT);
        data.endTime = timeRange[1];//.format(DATE_FORMAT);
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
      message.success(`${isEdit ? '??????' : '??????'}??????!`);
      onFinish();
    } finally {
      setSaving(false);
    }
  };

  const normFile = (e: any) => {
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

  const handleAddTable = () => {
    const db: any = datasources.find(
      ({ id }) => (id === inputData.outputDatasourceId)
    );
    if (!db) {
      return;
    }
    // history.push(`/datasource/tables/${db.id}/${db.datasourceName}?adding=true`);
    setTableInputing(true);
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
    [inputData.outputDatasourceId, datasource, refreshTableVersion, setOutputTables]
  );

  React.useEffect(
    () => {
      if (!open) {
        return
      }
      if (initData) {
        let timeRange = undefined;
        const columns = initData.sourceColum?.split(',');
        const targets = initData.targetColum?.split(',');

        if (initData.startTime && initData.endTime) {
          timeRange = [
            dayjs(initData.startTime),
            dayjs(initData.endTime),
          ];
        }

        const data = {
          ...initData,
          firstExecuteTime: (
            (
              initData.firstExecuteTime
              &&
              typeof initData.firstExecuteTime === 'string'
            )
            ? dayjs(initData.firstExecuteTime)
            : initData.firstExecuteTime
          ),
          timeRange,
          targetColum: fromPairs(
            columns?.map((fname: string, index: number) => [fname, targets[index]])
          ),
          sourceColum: columns
        }
        form.setFieldsValue(data);
        setInputData({
          ...data,
          targetColum: fromPairs(
            columns?.map((fname: string, index: number) => [fname, targets[index]])
          ),
          sourceColum: columns
        });
      } else {
        form.resetFields();
        setInputData({});
      }
    },
    [open, initData, form]
  );

  React.useEffect(
    () => {
      datasource.columnList().then(
        result => setColumns(result)
      )
    },
    [datasource]
  );

  return (
    <>
    <Modal
      title={`${isEdit ? '??????' : '??????'}??????`}
      visible={open}
      confirmLoading={saving}
      onOk={form.submit.bind(form)}
      onCancel={onClose}
      width="760px"
      className={mergeClass(
        'tasks-modal',
        !executeable && inputData.executeType !== 2
        ? 'unexecutable'
        : undefined
      )}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
        initialValues={{
          executeType: 1,
          executeUnit: 'hour',
          inputDatasourceType: (
            isEdit
            ? (initData.outputDatasourceId? 1 : 2)
            : 1
          )
        }}
        onValuesChange={(changedValues, allValues) => {
          if (
            isEdit
            &&
            changedValues.executeType === 2
            &&
            inputData.executeType === 1
          ) {
            form.setFieldsValue({ executeUnit: 'hour' });
          }
          setInputData(allValues);
        }}
      >
        <Divider orientation="left">??????????????????:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="taskName"
              label="????????????"
              normalize={(value: string) => value.trim()}
              rules={[{ required: true, message: '?????????????????????' }]}
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
              label="????????????"
            >
              <Select>
                <Option value={1}>????????????</Option>
                <Option value={2}>????????????</Option>
              </Select>
            </Form.Item>
          </Col>
          {
            inputData.executeType === 2
            ? (
              <>
                <Col span={12}>
                  <Form.Item label="????????????">
                    <Input.Group compact>
                      <Form.Item
                        name="executeDuring"
                        noStyle
                        rules={[
                          {required: true, message: '?????????????????????' },
                          {type: 'number', min: 1, message: '???????????????????????????1'}
                        ]}
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
                      >
                        <Select style={{ width: '30%' }}>
                          {/* <Option value="second">???</Option>
                          <Option value="minute">???</Option> */}
                          <Option value="hour">???</Option>
                          <Option value="day">???</Option>
                          {/* <Option value="month">???</Option>
                          <Option value="week">???</Option>
                          <Option value="year">???</Option> */}
                        </Select>
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="firstExecuteTime"
                    label="????????????"
                    rules={[{ required: true, message: '?????????????????????' }]}
                  >
                    <DatePicker
                      showTime
                      disabledDate={
                        current => (
                          current
                          &&
                          current.format('YYYY-MM-DD') < dayjs().format('YYYY-MM-DD')
                        )
                      }
                      disabledTime={time => {
                        const disabledHours = () => [0, ...range(0, new Date().getHours())];
                        const disabledMinutes = () => range(0, new Date().getMinutes());
                        const disabledSeconds = () => range(0, new Date().getSeconds());
                        if (!time) {
                          return {
                            disabledHours,
                            disabledMinutes,
                            disabledSeconds
                          };
                        }
                        if (time.format('YYYY-MM-DD') > dayjs().format('YYYY-MM-DD')) {
                          return { disabledHours: () => [0] };
                        }
                        if (time.hour() > new Date().getHours()) {
                          return {
                            disabledHours
                          };
                        }
                        if (time.minute() > new Date().getMinutes()) {
                          return {
                            disabledHours,
                            disabledMinutes
                          };
                        }
                        return {
                          disabledHours,
                          disabledMinutes,
                          disabledSeconds
                        };
                      }}
                      format={DATE_FORMAT}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null
          }
          <Col span={24}>
            <Form.Item
              name="pythonFile"
              label="????????????"
              getValueFromEvent={normFile}
              valuePropName="fileList"
              className="file-upload"
              rules={[
                () => ({
                  validator(rule, value) {
                    if (!isEdit && !value) {
                      return Promise.reject('?????????????????????');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Upload
                name="file"
                accept=".py"
                customRequest={customUpload}
                disabled={Boolean(initData?.id)}
              >
                <Button icon={<UploadOutlined />}>??????</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left">?????????????????????:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="inputDataSrouceType"
              label="???????????????"
            >
              <Select disabled={Boolean(initData?.id)}>
                <Option value="DB">???????????????</Option>
                <Option value="FILE">???????????????</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {
              inputData.inputDataSrouceType === "FILE"
              ? (
                <Form.Item
                  name="inputPanda"
                  label="???????????????"  
                  getValueFromEvent={normFile}
                  valuePropName="fileList"
                  className="file-upload"
                  rules={[
                    () => ({
                      validator(rule, value) {
                        if (!isEdit && !value) {
                          return Promise.reject('????????????????????????');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}  
                >
                  <Upload
                    name="file"
                    customRequest={customUpload}
                    fileList={inputData?.defaultPandaFileList}
                  >
                    <Button icon={<UploadOutlined />}>??????</Button>
                  </Upload>
                </Form.Item>
              ) : (
                <Form.Item
                  name="inputDatasourceId"
                  label="???????????????"
                  rules={[{ required: true, message: '????????????????????????' }]}
                >
                  <Select>
                    {
                      datasources.filter(
                        ({ datasourceType }: any) => datasourceType === 1
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
          {
            inputData.inputDataSrouceType === "DB"
            ? (
              <>
                {/* <Col span={12}>
                  <Form.Item
                    name="inputTableName"
                    label="???????????????"
                    normalize={(value: string) => value.trim()}
                    rules={[{ required: true, message: '???????????????' }]}
                  >
                    <Input
                      allowClear
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col> */}
                <Col span={24}>
                  <Form.Item
                    name="sourceColum"
                    label="??????????????????"
                    rules={[{ required: true, message: '?????????????????????!' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="?????????????????????????????????"
                      disabled={isEdit}
                      className="source-colum-select"
                      filterOption={
                        (value, option) => (option?.children as string).includes(value)
                      }
                    >
                      {
                        columns.map((option: any) => (
                          <Option
                            key={option.sourceColumName}
                            value={option.sourceColumName}
                          >{option.sourceColumNick}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                {
                  Boolean(inputData.sourceColum?.length) ? (
                    <Col span={24}>
                      <Form.Item
                        name="targetColum"
                        label="??????????????????"
                        rules={[{ required: true, message: '?????????????????????!' }]}
                      >
                        <MultipleRepeatableSelect
                          columns={inputData.sourceColum}
                          disabled={isEdit}
                        />
                      </Form.Item>
                    </Col>
                  ) : null
                }
                {
                  inputData.executeType === 2 ? (
                    <Col span={12}>
                      <Form.Item
                        name="second"
                        label="????????????(???)"
                        rules={[
                          {required: true, message: '?????????????????????' },
                          {type: 'number', min: 1, message: '???????????????????????????1'}
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          precision={0}
                        />
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={24}>
                      <Form.Item
                        name="timeRange"
                        label="??????????????????"
                        rules={[
                          () => ({
                            validator(rule, value) {
                              if (!value) {
                                return Promise.reject('?????????????????????');
                              }
                              if (!value[0]) {
                                return Promise.reject('?????????????????????');
                              }
                              if (!value[1]) {
                                return Promise.reject('?????????????????????');
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <RangePicker showTime />
                      </Form.Item>
                    </Col>
                  )
                }
              </>
            ) : null
          }
        </Row>
        <Divider orientation="left">?????????????????????:</Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="outputDatasourceId"
              label="???????????????"
              rules={[{ required: true, message: '????????????????????????' }]}
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
              label="???????????????"
              rules={[{ required: true, message: '???????????????' }]}
              extra={
                inputData.outputDatasourceId ? (
                  <Button
                    type="link"
                    onClick={handleAddTable}
                    className="add-output-table"
                  >????????????????????????</Button>
                ) : null
              }
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
      {
        executeable
        ? null
        : <div className="executable-tips">* ?????? <b>00:00 ~ 01:00</b> ?????????????????????????????????????????????</div>
      }
    </Modal>
    <TableModal
      open={tableInputing}
      datasourceId={inputData.outputDatasourceId}
      initData={null}
      onClose={() => setTableInputing(false)}
      onFinish={() => {
        setRefreshVersion(version => version + 1);
        setTableInputing(false);
      }}
    />
    </>
  );
}

export default withApi({
  tasks: Tasks,
  datasource: Datasource
})(TaskModal);
