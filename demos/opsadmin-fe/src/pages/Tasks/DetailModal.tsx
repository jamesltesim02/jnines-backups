import React from 'react';
import {
  Modal,
  Row,
  Col,
  Table,
  Spin
} from 'antd';

import { withApi } from '../../apis';
import Task from '../../apis/Task';
import DetailLogs from './DetailLogs';

const TYPES: Record<number, string> = {
  1: '即时任务',
  2: '定时任务'
}
const STATUS: Record<number, string> = {
  1: '等待执行',
  2: '正在执行',
  3: '执行完成'
}
// const RESULTS: Record<number, string> = {
//   1: '执行失败',
//   2: '执行成功'
// }

/* eslint-disable react/jsx-no-target-blank */
const DetailModal = (
  {
    api: { task },
    open = false,
    initData = {},
    onClose = () => {}
  }: {
    api: { task: Task },
    open: boolean,
    initData: any,
    onClose: any
  }
) => {
  const [loading, setLoading] = React.useState(false);
  const [condition, setCondition] = React.useState<any>({
    pageIndex: 1,
    pageSize: 20,
  });
  // 页头
  const [resultTitle, setResultTitle] = React.useState<Array<any>>([]);
  // 页面数据
  const [data, setData] = React.useState<{
    total: number,
    list: Array<any>
  }>({
    total: 0,
    list: []
  });

  // 查询操作
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(
    () => {
      setLoading(true);
      setData(data => ({ ...data, list: [] }));
      task.resultDataList(condition).then(
        result => {
          if (!result) {
            return;
          }

          if (result.columns) {
            setResultTitle(result.columns);
          }

          setData({
            total: result.total,
            list: result.data,
          });
        }
      ).finally(
        () => setLoading(false)
      );
    },
    [condition]
  );

  React.useEffect(
    () => {
      if (!initData?.id) {
        return
      }
      setCondition({
        id: initData.id,
        pageIndex: 1,
        pageSize: 20,
      });
      setData({ total: 0, list: [] });
    },
    [initData]
  );

  const modalContent = initData ? (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <label>任务名称:</label>
          <div>{initData.taskName}</div>
        </Col>
        <Col span={12}>
          <label>任务类型:</label>
          <div>{TYPES[initData.executeType]}</div>
        </Col>
        <Col span={12}>
          <label>执行状态:</label>
          <div>{STATUS[initData.currentTaskStatus]}</div>
        </Col>
        <Col span={12}>
          <label>执行次数:</label>
          <div>{initData.executeSuccessCount}/{initData.executeTotal}</div>
        </Col>
        {
          (data.total > 0) ? (
            <Col span={24}>
              <label>执行结果:</label>
              <div>
                <Table
                  loading={loading}
                  rowKey={record => `${JSON.stringify(record)}.${Date.now()}.${Math.random()}`}
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
                      });
                    }
                  }}
                  columns={
                    resultTitle.map(title => ({
                      title,
                      dataIndex: title,
                      key: title,
                    }))
                  }
                />
              </div>
            </Col>
          ) : (
            loading ? (
              <div
                style={{
                  padding: '10px 0',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                <Spin />
              </div>
            ) : null
          )
        }
        {
          (
            initData.logFileList
            &&
            initData.logFileList.length
          ) ? (
            <Col span={24}>
              <label>执行日志:</label>
              <div>
                <DetailLogs
                  list={initData.logFileList}
                />
              </div>
            </Col>
          ) : null
        }
      </Row>
    </>
  ) : null;
  return (
    <Modal
      title="任务执行详情"
      visible={open}
      onCancel={onClose}
      className="task-detail-modal"
      width={1000}
      maskClosable={false}
    >{modalContent}</Modal>
  );
}

export default withApi({ task: Task })(DetailModal);
