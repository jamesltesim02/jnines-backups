import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message
} from 'antd';

import Page from '../../components/common/Page';
import TableModal from './TableModal';

import { withApi } from '../../apis';
import Datasource from '../../apis/Datasource';

function TablsPage (
  {
    api: { datasource }
  }: {
    api: { datasource: Datasource }
  }
) {
  const { did, dname }: any = useParams()
  const datasourceId = +did;

  const [loading, setLoading] = React.useState(false);
  const [inputing, setInputing] = React.useState(false);
  const [condition, setCondition] = React.useState({ datasourceId })
  const [data, setData] = React.useState([]);
  const [current, setCurrent] = React.useState<any>(null);

  const handleDelete = async (tableName: any) => {
    const hide = message.loading('删除中...', 0)
    try {
      await datasource.deleteTable({
        datasourceId: did,
        tableName
      });
      setCondition({ ...condition });
      message.success('删除成功!');
    } finally {
      hide();
    }
  }

  const handleDetail = async (tableName: any) => {
    const hide = message.loading('查询中...', 0)
    try {
      const table = await datasource.tableStructureInfo({
        datasourceId,
        tableName
      });
      if (!table) {
        message.warning(`数据表“${tableName}”不存在`);
        return;
      }
      setCurrent(table);
      setInputing(true);
    } finally {
      hide();
    }
    console.log(tableName);
  }

  // 查询操作
  React.useEffect(
    () => {
      setLoading(true);
      datasource.tableList(datasourceId).then(
        data => setData(data)
      ).finally(
        () => setLoading(false)
      )
    },
    [condition, datasource, datasourceId]
  )

  return (
    <>
      <Page
        navs={[
          {
            name: '数据源管理',
            path: '/datasource'
          },
          { name: dname, },
        ]}
      >
        <Card className="table-content">
          <Button
            onClick={() => {
              setCurrent(null)
              setInputing(true)
            }}
            style={{ marginBottom: 20 }}
          >
            创建表
          </Button>
          <Table
            loading={loading}
            pagination={false}
            rowKey={record => record}
            dataSource={data}
            columns={[
              {
                title: '表名',
                render: record => String(record),
              },
              {
                title: '操作',
                render: record => (
                  <Space size="middle">
                    <Button
                      type="link"
                      onClick={() => handleDetail(String(record))}
                    >查看</Button>
                    <Popconfirm
                      title="你确定要删除吗?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => handleDelete(record)}
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </Page>
      <TableModal
        open={inputing}
        datasourceId={datasourceId}
        initData={current}
        onClose={() => setInputing(false)}
        onFinish={() => {
          setCondition({ ...condition });
          setCurrent(null);
          setInputing(false);
        }}
      />
    </>
  )
}

export default withApi(
  { datasource: Datasource }
)(TablsPage);
