import React from 'react';
import dayjs from 'dayjs';
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
import DetailModal from './DetailModal';

import { withApi } from '../../apis';
import Task from '../../apis/Task';

const { Option } = Select;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const TYPES: Record<number, string> = {
  1: '即时任务',
  2: '定时任务'
}
const STATUS: Record<number, string> = {
  1: '等待执行',
  2: '正在执行',
  3: '执行完成'
}
const RESULTS: Record<number, string> = {
  '-1': '执行中',
  1: '执行失败',
  2: '执行成功',
  3: '数据正在合并',
  4: '生成数据文件失败',
  5: '入库失败',
  6: '下载数据文件失败',
  7: '模型执行失败',
  8: '数据类型转换失败'
}

const navs = [
  { name: '任务管理' },
  { name: '任务列表' },
];

/* eslint-disable jsx-a11y/anchor-is-valid */
function TasksPage (
  {
    api: { task }
  }: {
    api: { task: Task }
  }
) {

  const [loading, setLoading] = React.useState(false);
  const [inputing, setInputing] = React.useState(false);
  const [showing, setShowing] = React.useState(false);
  const [current, setCurrent] = React.useState(null);
  const [executable, setExecuteable] = React.useState(false);

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
  };

  // 转到编辑
  const handleEdit = async (id: any) => {
    const hide = message.loading('查询中...', 0);
    try {
      const item = await task.edit(id);
      if (item.pythonFilePath) {
        item.pythonFile = [{
          uid: '1',
          name: item.pythonFileName,
          status: 'done',
          response: item.pythonFilePath,
          originFileObj: {
            name: item.pythonFileName,
            uid: '1',
          }
        }];
      }
      if (item.inputPandaUrl) {
        const pandaName = item.inputPandaUrl.split('/').pop();
        item.inputPanda = [{
          uid: '1',
          name: pandaName,
          status: 'done',
          response: item.inputPandaUrl,
          originFileObj: {
            name: pandaName,
            uid: '1',
          }
        }];
      }
      setCurrent(item);
      setInputing(true);
    } finally {
      hide();
    }
  };

  // 查看详情
  const handleInfo = async (id: any) => {
    const hide = message.loading('查询中...', 0);
    try {
      const item = await task.info(id);
      setCurrent(item);
      setShowing(true);
    } finally {
      hide();
    }
  };

  // 执行
  const handleExecute = async (id: any) => {
    const hide = message.loading('执行中...', 0);
    try {
      await task.execute(id);
      setCondition({ ...condition });
      message.success('已提交执行请求,请再刷新后查看结果!');
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

  React.useEffect(
    () => {
      let timeStamp = -1;
      task.getCurrentTimestamp().then((time: number) => {
        timeStamp = time;
      });
      const interval = setInterval(
        () => {
          if (timeStamp === -1) {
            return;
          }
          timeStamp = timeStamp + 1000;
          setExecuteable(new Date(timeStamp).getHours() >= 1);
        },
        1000
      );

      return () => {
        console.log('clear...');
        clearInterval(interval)
      };
    },
    [task, setExecuteable]
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
                <Form.Item
                  name="name"
                  normalize={(value: string) => value.trim()}
                >
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
                    <Option value={3}>执行完成</Option>
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
                  return (
                    `${item.executeSuccessCount}/${item.executeTotal}`
                  );
                },
              },
              {
                title: '最近执行时间',
                dataIndex: 'firstExecuteTime',
                key: 'firstExecuteTime',
                render: (result: string) => (
                  result
                  ? dayjs(result).format(DATE_FORMAT)
                  : '--'
                )
              },
              {
                title: '执行结果',
                // dataIndex: 'executeResult',
                // key: 'executeResult',
                // render: (result: number) => (
                render: (item: any) => (
                  (
                    item.executeResult
                    &&
                    item.currentTaskStatus !== 2
                  ) ? (
                    <Tag color={item.executeResult === 2 ? 'green' : 'volcano'}>
                      {RESULTS[item.executeResult]}
                    </Tag>
                  ) : '--'
                )
              },
              {
                title: '操作',
                render: (item: any, index) => (
                  <Space size="middle">
                    <a
                      className="ant-btn ant-btn-link"
                      onClick={() => {
                        document.body.focus();
                        handleInfo(item.id);
                      }}
                    >详情</a>
                    <a
                      className="ant-btn ant-btn-link"
                      onClick={() => {
                        document.body.focus();
                        handleEdit(item.id);
                      }}
                    >编辑</a>
                    <Popconfirm
                      title="你确定要删除吗?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => handleDelete(item.id)}
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                    {
                      (
                        [1, 3].includes(item.currentTaskStatus)
                        &&
                        item.executeType === 1
                        &&
                        executable
                      ) ? (
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
        executeable={executable}
        initData={current}
        onFinish={handleFinish}
        onClose={() => setInputing(false)}
      />
      <DetailModal
        open={showing}
        initData={current}
        onClose={() => setShowing(false)}
      />
    </>
  )
}

export default withApi({ task: Task })(TasksPage);
