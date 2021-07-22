import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Space,
  Popconfirm,
  message
} from 'antd';

import Page from '../../components/common/Page';
import DatasourceModal from './DatasourceModal';

import { withApi } from '../../apis';
import Datasource from '../../apis/Datasource';

const { Option } = Select;

const TYPES: Record<number, string> = {
  1: '输入',
  2: '输出'
}

const navs = [
  { name: '数据源管理' },
  { name: '数据源列表' },
];

/* eslint-disable jsx-a11y/anchor-is-valid */
function DatasourcePage (
  {
    api: { datasource }
  }: {
    api: { datasource: Datasource }
  }
) {
  const [loading, setLoading] = React.useState(false);
  const [inputing, setInputing] = React.useState(false);
  const [current, setCurrent] = React.useState(null);

  const [condition, setCondition] = React.useState<any>({
    schemaName: undefined,
    ipAddress: undefined,
    datasourceType: undefined,
    pageIndex: 1,
    pageSize: 20,
  });

  // 页面数据
  const [data, setData] = React.useState({
    total: 0,
    list: []
  });

  // 条件查询
  const handleQuery = (values: any) => setCondition({
    ...condition,
    ...values
  });

  // 删除
  const handleDelete = async (id: any) => {
    const hide = message.loading('删除中...', 0);
    try {
      const related = await datasource.enableRelateTask(id);
      if (related) {
        message.warn('已有任务关联到此数据源, 因此该数据源不能删除!');
        return
      }
      await datasource.delete(id);
      setCondition({
        ...condition,
        pageIndex: (
          (
            data.list.length === 1
            &&
            condition.pageIndex > 1
          )
          ? condition.pageIndex - 1
          : condition.pageIndex
        )
      });
      message.success('删除成功!');
    } finally {
      hide();
    }
  }

  // 编辑数据源(打开编辑窗口)
  const handleEdit = async (item: any) => {
    const hide = message.loading('查询中...', 0);
    try {
      const related = await datasource.enableRelateTask(item.id);
      // if (related) {
      //   message.warn('已有任务关联到此数据源, 因此该数据源不能修改!');
      //   return
      // }
      setCurrent({
        ...item,
        related
      });
      setInputing(true);
    } finally {
      hide();
    }
  };
  // 编辑窗口关闭
  const handleModalClose = () => {
    setInputing(false);
    setCurrent(null);
  };
  // 编辑窗口保存成功
  const handleModalFinish = () => {
    setCondition({
      ...condition,
      pageIndex: current ? condition.pageIndex : 1
    })
    handleModalClose();
  };

  // 查询操作
  React.useEffect(
    () => {
      setLoading(true);
      datasource.list(condition).then(
        data => setData(data)
      ).finally(
        () => setLoading(false)
      );
    },
    [datasource, condition]
  );

  return (
    <>
      <Page navs={navs}>
        <Card className="table-header">
            <Form
              onFinish={handleQuery}
              className="seach-form"
            >
              <Row gutter={24}>
                <Col span={5}>
                  <Form.Item
                    name="schemaName"
                    normalize={(value: string) => value.trim()}
                  >
                    <Input
                      allowClear
                      placeholder="数据库名"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    name="ipAddress"
                    normalize={(value: string) => value.trim()}
                  >
                    <Input
                      allowClear
                      placeholder="数据源地址"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="datasourceType">
                    <Select
                      allowClear
                      placeholder="数据源类型"
                    >
                      <Option value={1}>输入</Option>
                      <Option value={2}>输出</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >查询</Button>
                </Col>
                <Col span={5} className="text-right">
                  <Button onClick={() => setInputing(true)}>新建数据源</Button>
                </Col>
              </Row>
            </Form>
        </Card>
        <Card className="table-content">
          <Table
            loading={loading}
            rowKey="id"
            dataSource={data.list}
            pagination={{
              hideOnSinglePage: true,
              total: data.total,
              pageSize: condition.pageSize,
              current: condition.pageIndex,
              onChange(pageIndex, pageSize) {
                setCondition({
                  ...condition,
                  pageIndex,
                  pageSize
                })
              }
            }}
            columns={[
              {
                title: '名称',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
              },
              {
                title: '类型',
                dataIndex: 'datasourceType',
                key: 'datasourceType',
                render: (type: number) => (
                  <div style={{ whiteSpace: 'nowrap' }}>{TYPES[type]}</div>
                ),
              },
              {
                title: '地址',
                dataIndex: 'ipAddress',
                key: 'ipAddress',
              },
              {
                title: '端口',
                dataIndex: 'port',
                key: 'port',
              },
              {
                title: '数据库名',
                dataIndex: 'schemaName',
                key: 'schemaName',
              },
              {
                title: '操作',
                render: (item: any) => (
                  <Space size="middle">
                    <a
                      className="ant-btn ant-btn-link"
                      onClick={() => handleEdit(item)}
                    >查看/编辑</a>
                    <Popconfirm
                      title="你确定要删除吗?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => handleDelete(item.id)}
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                    {
                      item.datasourceType === 2
                      ? (
                        <Link to={`/datasource/tables/${item.id}/${item.datasourceName}`}>
                          <Button type="link">管理数据库表</Button>
                        </Link>
                      ) : null
                    }
                  </Space>
                )
              },
            ]}
          />
        </Card>
      </Page>
      <DatasourceModal
        open={inputing}
        initData={current}
        onClose={handleModalClose}
        onFinish={handleModalFinish}
      />
    </>
  );
}

export default withApi(
  { datasource: Datasource }
)(DatasourcePage);
