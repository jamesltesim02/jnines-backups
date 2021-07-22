import React from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
} from 'antd';

import Page from '../../components/common/Page';
import TaskModal from './TaskModal';

import { withApi } from '../../apis';
import Task from '../../apis/Task';

const { Option } = Select;

const TYPES: Record<number, string> = {
  1: '即时任务',
  2: '定时任务'
}
const STATUS: Record<number, string> = {
  1: '等待执行',
  2: '正在执行'
}
const RESULTS: Record<number, string> = {
  1: '执行失败',
  2: '执行成功'
}

const navs = [
  { name: '任务管理' },
  { name: '任务列表' },
];

function TasksPage (
  {
    api: { task }
  }: {
    api: { task: Task }
  }
) {

  const [loading, setLoading] = React.useState(false);
  const [inputing, setInputing] = React.useState(false);
  const [current, setCurrent] = React.useState(null);

  const [condition, setCondition] = React.useState<any>({
    name: undefined,
    executeType: undefined,
    currentTaskStatus: undefined,
    pageIndex: 1,
    pageSize: 20,
  });

  // 页面数据
  const [data, setData] = React.useState({
    total: 0,
    list: []
  });

  // 条件查询
  const handleFinish = (values: any) => {
    setCondition({
      ...condition,
      ...values
    });
    setInputing(false);
    setCurrent(null);
  };

  // 删除
  const handleDelete = async (id: any) => {
    const hide = message.loading('删除中...', 0);
    try {
      await task.delete(id);
      setCondition({ ...condition });
      message.success('删除成功!');
    } finally {
      hide();
    }
  };

  const handleEdit = async (id: any) => {
    const hide = message.loading('查询中...', 0);
    try {
      const item = await task.info(id);
      setCurrent(item);
      setInputing(true)
    } finally {
      hide();
    }
  };

  // 执行
  const handleExecute = async (id: any) => {
    const hide = message.loading('...执行中...', 0);
    try {
      await task.execute(id);
      setCondition({ ...condition });
      message.success('执行成功!');
    } finally {
      hide();
    }
  };

  // 查询操作
  React.useEffect(
    () => {
      setLoading(true);
      task.list(condition).then(
        data => setData(data)
      ).finally(
        () => setLoading(false)
      );
    },
    [task, condition]
  );

  return (
    <>
      <Page navs={navs}>
        <Card className="table-header">
          <Form
            onFinish={handleFinish}
            className="seach-form"
          >
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item name="name">
                  <Input
                    allowClear
                    placeholder="任务名称"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="executeType">
                  <Select
                    allowClear
                    placeholder="任务类型"
                  >
                    <Option value={1}>即时任务</Option>
                    <Option value={2}>定时任务</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="currentTaskStatus">
                  <Select
                    allowClear
                    placeholder="任务状态"
                  >
                    <Option value={1}>等待执行</Option>
                    <Option value={2}>正在执行</Option>
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
                <Button
                  onClick={() => {
                    setInputing(true);
                    setCurrent(null);
                  }}
                >新建任务</Button>
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
                title: '任务名称',
                dataIndex: 'taskName',
                key: 'taskName',
              },
              {
                title: '任务类型',
                dataIndex: 'executeType',
                key: 'executeType',
                render: (type: number) => TYPES[type],
              },
              {
                title: '任务状态',
                dataIndex: 'currentTaskStatus',
                key: 'currentTaskStatus',
                render: (status: number) => STATUS[status],
              },
              {
                title: 'N/M',
                render: (item: any) => {
                  return `${item.executeTotal}/${item.executeSuccessCount}`;
                },
              },
              {
                title: '最近执行时间',
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                render: (result: string) => result || '--',
              },
              {
                title: '执行结果',
                dataIndex: 'executeResult',
                key: 'executeResult',
                render: (result: number) => (
                  result ? (
                    <Tag color={result === 2 ? 'green' : 'volcano'}>
                      {RESULTS[result]}
                    </Tag>
                  ) : '--'
                )
              },
              {
                title: '操作',
                render: (item: any, index) => (
                  <Space size="middle">
                    <Button
                      type="link"
                      onClick={() => handleEdit(item.id)}
                    >编辑</Button>
                    <Popconfirm
                      title="你确定要删除吗?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => handleDelete(item.id)}
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                    {
                      item.currentTaskStatus === 1 ? (
                        <Popconfirm
                          title="你确定要立即执行该任务吗?"
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => handleExecute(item.id)}
                        >
                          <Button type="link">执行</Button>
                        </Popconfirm>
                      ) : null
                    }
                  </Space>
                )
              },
            ]}
          />
        </Card>
      </Page>
      <TaskModal
        open={inputing}
        initData={current}
        onFinish={handleFinish}
        onClose={() => setInputing(false)}
      />
    </>
  )
}

export default withApi({ task: Task })(TasksPage);
