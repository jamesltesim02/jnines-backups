import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Space,
  message
} from 'antd';

import Page from '../../components/common/Page';
import TableModal from './TableModal';

import { withApi } from '../../apis';
import Datasource from '../../apis/Datasource';

/* eslint-disable jsx-a11y/anchor-is-valid */
function TablsPage (
  {
    api: { datasource }
  }: {
    api: { datasource: Datasource }
  }
) {
  const location = useLocation();
  const { did, dname }: any = useParams()
  const datasourceId = +did;

  const [loading, setLoading] = React.useState(false);
  const [inputing, setInputing] = React.useState(
    location.search.includes('adding=true')
  );
  const [condition, setCondition] = React.useState({ datasourceId });
  const [data, setData] = React.useState([]);
  const [current, setCurrent] = React.useState<any>(null);

  const handleDetail = async (tableName: any) => {
    const hide = message.loading('查询中...', 0)
    try {
      const columns = await datasource.tableStructureInfo({
        datasourceId,
        tableName
      });
      if (!columns) {
        message.warning(`数据表“${tableName}”不存在`);
        return;
      }
      setCurrent({
        tableName,
        fields: columns
      });
      setInputing(true);
    } finally {
      hide();
    }
    console.log(tableName);
  };

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
  );

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
            新建表
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
                    <a
                      className="ant-btn ant-btn-link"
                      onClick={() => handleDetail(String(record))}
                    >查看</a>
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
