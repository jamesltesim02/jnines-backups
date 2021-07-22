import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  message,
  Tooltip
} from 'antd';

import { MinusCircleOutlined } from '@ant-design/icons';

import { withApi } from '../../apis';
import Datasource from '../../apis/Datasource';

const { Option } = Select;

export const DEFAULT_ITEM = {
  name: '',
  type: '',
  length: '',
  point: '',
  isKey: false,
  isNull: false,
};

const TYPES = [
  'int',
  'varchar',
  'char',
  'tinyblob',
  'tinytext',
  'blob',
  'text',
  'integer',
  'tinyint',
  'smallint',
  'mediumint',
  'bigint',
  'float',
  'double',
  'decimal',
  'date',
  'time',
  'year',
  'datetime',
  'timestamp',
  'mediumblob',
  'mediumtext',
  'longblob',
  'longtext',
]

function DatasourceModal (
  {
    api: { datasource },
    open = false,
    initData = {},
    datasourceId,
    onClose = () => {},
    onFinish = () => {}
  }: {
    api: { datasource: Datasource },
    open: boolean,
    datasourceId: string,
    initData?: any,
    onClose: any,
    onFinish: any,
  }
) {
  const [form] = Form.useForm();
  const isDetail = initData && initData.tableName;

  const [saving, setSaving] = React.useState(false);

  const handleFinish = async (data: any) => {
    try {
      setSaving(true);
      data.datasourceId = datasourceId;
      await datasource.addTable(data);
      message.success('添加成功!');
      onFinish();
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(
    () => {
      if (!open) {
        return;
      }
      if (initData && initData.tableName) {
        form.setFieldsValue(initData);
      } else {
        form.resetFields();
        form.setFieldsValue({
          fields: [DEFAULT_ITEM]
        })
      }
    },
    [open, initData, form]
  )

  return (
    <Modal
      title={isDetail ? '查看表信息' : '新建表'}
      visible={open}
      confirmLoading={saving}
      onOk={form.submit.bind(form)}
      onCancel={onClose}
      width="640px"
      className={isDetail ? 'detail' : ''}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={isDetail ? onClose : handleFinish}
        className="table-detail-form"
        autoComplete="off"
        initialValues={{ feilds: DEFAULT_ITEM }}
      >
        <Row className="row-name">
          <Col span={12}>
            <Form.Item
              name="tableName"
              label="名称"
              rules={[{ required: true }]}
            >
              <Input
                allowClear
                disabled={isDetail}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.List name="fields">
          {(fields, { add, remove }) => {
            if (!fields.length) {
              add(DEFAULT_ITEM);
            }
            return (
              <>
                <Button
                  className="btn-add"
                  onClick={() => add(DEFAULT_ITEM)}
                >+ 新增列</Button>
                <Row gutter={24}>
                  <Col span={24}>
                    <table>
                      <thead>
                        <tr>
                          <th>列名</th>
                          <th>类型</th>
                          <th>长度</th>
                          <th>小数</th>
                          <th>主键</th>
                          <th>为空</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          fields.map((field, index) => (
                            <tr key={field.key}>
                              <td>
                              <Tooltip
                                placement="topLeft"
                                title={initData?.fields[index].name}
                              >
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  fieldKey={[field.fieldKey, 'name']}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    allowClear
                                    disabled={isDetail}
                                  />
                                </Form.Item>
                              </Tooltip>
                              </td>
                              <td>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'type']}
                                  fieldKey={[field.fieldKey, 'type']}
                                  rules={[{ required: true }]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    showArrow={false}
                                    optionFilterProp="children"
                                    disabled={isDetail}
                                    filterOption={(input: any, option: any) =>
                                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {TYPES.map(t => (<Option key={t} value={t}>{t}</Option>))}
                                  </Select>
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'length']}
                                  fieldKey={[field.fieldKey, 'length']}
                                >
                                  <InputNumber
                                    min={0}
                                    precision={0}
                                    disabled={isDetail}
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'point']}
                                  fieldKey={[field.fieldKey, 'point']}
                                >
                                  <InputNumber
                                    min={0}
                                    precision={0}
                                    disabled={isDetail}
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'isKey']}
                                  fieldKey={[field.fieldKey, 'isKey']}
                                  valuePropName="checked"
                                >
                                  <Checkbox disabled={isDetail} />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'isNull']}
                                  fieldKey={[field.fieldKey, 'isNull']}
                                  valuePropName="checked"
                                >
                                  <Checkbox disabled={isDetail} />
                                </Form.Item>
                                {
                                  isDetail ? null : (
                                    <MinusCircleOutlined
                                      className="btn-delete"
                                      onClick={() => remove(field.name)}
                                    />
                                  )
                                }
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </>
            )
          }}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default withApi({
  datasource: Datasource
})(DatasourceModal);
