import random from 'lodash/random';

import {
  makeRecords,
  randomCharactors,
  slicePage
} from './mock-util';

const datasources = window.datasources = makeRecords({
  range: [30, 80],
  fill: i => ({
    // 数据源id
    id: i,
    // 数据源名称
    datasourceName: randomCharactors({ min: 3, max: 8 }),
    // 数据源地址
    ipAddress: `${random(1, 254)}.${random(1, 254)}.${random(1, 254)}.${random(1, 254)}`,
    // 数据源类型 1 输入，2 输出
    datasourceType: random(1, 2),
    // 数据源端口
    port: random(3000, 50000),
    // 库名称
    schemaName: randomCharactors({ min: 6, max: 10 }),
    // 账号
    userName: randomCharactors({ min: 6, max: 10 }),
    // 密码
    password: randomCharactors({ min: 6, max: 10 }),
    // 数据库表
    tables: [
      {
        "datasourceId": i,
        "tableName": "user",
        "fields": [
          {
            "name": "id",
            "type": "int",
            "length": 10,
            "point": null,
            "isKey": true,
            "isNull": false},
          {
            "name": "name",
            "type": "varchar",
            "length": 20,
            "point": null,
            "isKey": false,
            "isNull": false
          },
          {
            "name": "age",
            "type": "int",
            "length": 3,
            "point": "",
            "isKey": false,
            "isNull": true
          },
          {
            "name": "money",
            "type": "double",
            "length": 9,
            "point": 2,
            "isKey": false,
            "isNull": true
          }
        ]
      },
      {
        "datasourceId":"30",
        "tableName":"task",
        "fields":[
          {
            "name":"id",
            "type":"int",
            "length":10,
            "point":"",
            "isKey":true,
            "isNull":false
          },
          {
            "name":"name",
            "type":"varchar",
            "length":20,
            "point":"",
            "isKey":false,
            "isNull":false
          },
          {
            "name":"create_time",
            "type":"datetime",
            "length":null,
            "point":"",
            "isKey":false,
            "isNull":false
          }
        ]
      }
    ],
  }),
  sorter: (d1, d2) => d2.id - d1.id
})

export default {
  name: 'datasource',
  records: datasources,
  post_list ({
    ipAddress,
    datasourceType,
    schemaName,
    pageIndex = 1,
    pageSize = 20,
  }) {
    const result = datasources.filter(
      ds => !(
        (ipAddress && !ds.ipAddress.includes(ipAddress))
        ||
        (datasourceType && ds.datasourceType !== datasourceType)
        ||
        (schemaName && !ds.schemaName.includes(schemaName))
      )
    )
    return slicePage(result, pageIndex, pageSize);
  },
  post_add (params) {
    const data = {
      id: datasources[0].id + 1,
      ...params
    }
    datasources.unshift(data);

    return {
      code: 0,
      msg: '',
      data,
    }
  },
  post_delete ({ id }) {
    const index = datasources.findIndex(item => item.id === id);
    if (index !== -1) {
      datasources.splice(index, 1)
    }
    return {
      code: 0,
      msg: '',
      data: null
    }
  },
  post_update (params) {
    const index = datasources.findIndex(item => item.id === params.id);
    if (index !== -1) {
      Object.assign(
        datasources[index],
        params
      );
    }
    return {
      code: 0,
      msg: '',
      data: params
    }
  },
  post_addTable (params) {
    const ds = datasources.find(({ id }) => id === +params.datasourceId);
    if (ds) {
      if (!ds.tables) {
        ds.tables = [];
      }
      ds.tables.push(params);
    }

    return {
      code: 0,
      msg: '',
    }
  },
  post_tableList ({ datasourceId }) {
    const ds = (
      datasources.find(({ id }) => id === +datasourceId)
      ||
      { tables: [] }
    );

    return {
      code: 0,
      msg: '',
      data: (ds.tables || []).map(({ tableName }) => tableName)
    };
  },
  post_deleteTable ({
    datasourceId,
    tableName
  }) {
    const ds = datasources.find(({ id }) => id === +datasourceId);
    if (ds) {
      const index = ds.tables.findIndex(t => t.tableName === tableName);
      if (index !== -1) {
        ds.tables.splice(index, 1);
      }
    }
    return {
      code: 0,
      msg: '',
      data: ds.tables.map(({ tableName }) => tableName)
    }
  },
  post_tableStructureInfo ({
    datasourceId,
    tableName
  }) {
    let table = null
    const ds = datasources.find(({ id }) => id === +datasourceId);
    if (ds) {
      table = ds.tables.find(t => t.tableName === tableName);
    }
    return {
      code: 0,
      msg: '',
      data: table.fields
    }
  },
  post_enableRelateTask () {
    return {
      code: 0,
      msg: '',
      data: Boolean(random(0, 1))
    };
  },

  post_checkConnect () {
    return {
      code: 0,
      msg: '',
      data: Boolean(random(0, 1))
    };
  },
};
