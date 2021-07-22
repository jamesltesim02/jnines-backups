import random from 'lodash/random';
import range from 'lodash/range';
import dayjs from 'dayjs';
import {
  makeRecords,
  randomCharactors,
  randomTime,
  slicePage,
  randomItem
} from './mock-util';

import datasource from './datasource';

const ids = datasource.records.filter(
  ({ datasourceType }) => datasourceType === 1
);
const ods =  datasource.records.filter(
  ({ datasourceType }) => datasourceType === 2
);

const tasks = makeRecords({
  range: [200, 400],
  fill: i => {
    const execCounts = random(0, 999);
    const outputDatasource = randomItem(ods);
    const inputDatasource = randomItem(ids);

    const columns = range(3, 8).map(index => randomCharactors({ min: 2, max: 10 }));
    const results = makeRecords({
      range: [0, 300],
      fill: i => Object.fromEntries(
        columns.map(
          title => [title, randomCharactors({ min: 0, max: 15 })]
        )
      )
    });

    return ({
      // id
      id: i,
      // 任务名称
      taskName: randomCharactors({ min: 3, max: 8 }),
      // 任务类型 1 即时任务，2 定时任务
      executeType: random(1, 2),
      // 执行频率
      executeDuring: random(1, 60),
      // 执行频率单位
      executeUnit: randomItem(['second', 'minute', 'hour', 'day', 'month', 'week', 'year']),
      // 执行文件
      pythonFilePath: randomCharactors({ min: 10, max: 20 }),
      // 执行文件名
      pythonFileName:  `${randomCharactors({ min: 10, max: 20 })}.py`,
      // 日志路径
      logRootPath:  randomCharactors({ min: 10, max: 20 }),
      // 初始时间
      firstExecuteTime: randomTime(1000 * 60 * 60 * 24 * 30),
      // 任务状态 1 等待执行，2 正在执行, 3 执行完成
      currentTaskStatus: random(1, 3),
      // 执行总次数
      executeTotal: execCounts,
      // 执行成功次数
      executeSuccessCount: random(0, execCounts),
      // 最近执行时间
      modifyTime: randomTime(1000 * 60 * 60 * 24 * 30),
      // 执行结果 1 执行失败，2 执行成功
      executeResult: random(1, 2),
      // 输入数据源id
      inputDatasourceId: inputDatasource.id,
      // 输入表名
      inputTableName: randomCharactors({ min: 3, max: 8 }),
      // 输出数据源id
      outputDatasourceId: outputDatasource.id,
      // 输出数据源表名
      outputTableName: randomItem(outputDatasource.tables, {}).tableName,
      // 执行结果
      results: {
        columns,
        list: results
      },
      // 即时任务数据开始时间
      startTime: undefined,
      // 即时任务数据结束时间
      endTime: undefined,
      // 定时任务时间范围
      second: undefined,
      // 查询字段
      sourceColumn: undefined,
      // 字段类型
      targetColum: undefined
    });
  },
  sorter: ({ modifyTime: t1 }, { modifyTime: t2 }) => t2.localeCompare(t1)
})

export default {
  name: 'task',
  records: tasks,
  post_list ({
    name,
    executeType,
    currentTaskStatus,
    pageIndex = 1,
    pageSize = 20,
  }) {
    const result = tasks.filter(
      task => !(
        (name && !task.taskName.includes(name))
        ||
        (executeType && task.executeType !== executeType)
        ||
        (currentTaskStatus && task.currentTaskStatus !== currentTaskStatus)
      )
    );

    return slicePage(result, pageIndex, pageSize);
  },

  post_delete ({ id }) {
    const index = tasks.findIndex(item => item.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    return {
      code: 0,
      msg: '',
      data: null
    };
  },

  post_add (params) {
    const data = {
      id: Math.max(...tasks.map(({ id }) => id)) + 1,
      executeTotal: 0,
      executeSuccessCount: 0,
      currentTaskStatus: params.executeType === 1 ? 2 : 1,
      modifyTime: null,
      executeResult: null,
      ...params
    };
    tasks.unshift(data);

    return {
      code: 0,
      msg: '',
      data,
    };
  },

  post_update (params) {
    const index = tasks.findIndex(item => item.id === params.id);
    if (index !== -1) {
      Object.assign(
        tasks[index],
        params
      );
    }
    return {
      code: 0,
      msg: '',
      data: params,
    };
  },

  post_execute (params) {
    const index = tasks.findIndex(item => item.id === params.taskId);
    if (index > -1) {
      const executeResult = random(1, 2);
      Object.assign(
        tasks[index],
        {
          currentTaskStatus: 2,
          executeTotal: tasks[index].executeTotal + 1,
          executeSuccessCount: tasks[index].executeSuccessCount + (executeResult === 2 ? 1 : 0),
          modifyTime: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
          executeResult,
        }
      );

      if (executeResult !== 2) {
        return {
          code: -1,
          msg: '执行失败',
          data: params,
        };
      }
    }

    return {
      code: 0,
      msg: '执行成功',
      data: params,
    };
  },

  post_info (params) {
    const index = tasks.findIndex(item => item.id === params.id);
    let data = null;

    if (index > -1) {
      const item = tasks[index];
      data = {
        ...item,
        logFileList: (
          range(
            2, 6
          ).map(
            index => randomCharactors({ min: 10, max: 20 })
          ).map(
            v => `/logs/${item.id}/${v}.log`
          )
        ),
        name: item.taskName,
        targetDataList: makeRecords({
          range: [20, 40],
          fill: i => ([
            '2020/01/01 10:12:12',
            '01',
            '001',
            '测试描述',
          ])
        })
      };
    }

    return {
      code: 0,
      msg: '',
      data: data,
    };
  },

  post_edit (params) {
    const index = tasks.findIndex(item => item.id === params.id);
    
    return {
      code: 0,
      msg: '',
      data: tasks[index],
    };
  },

  post_resultDataList (params) {
    const task = tasks.find(item => item.id === params.id);

    if (
      !task
      ||
      !task.results
      ||
      !task.results.list
      ||
      !task.results.list.length
    ) {
      return {
        code: 0,
        msg: '',
        data: null
      };
    }

    const { columns, list } = task.results;
    const { pageIndex, pageSize } = params;

    const { data: { list: data, ...page } } = slicePage(list, pageIndex, pageSize)

    return {
      code: 0,
      msg: '',
      data: {
        ...page,
        columns,
        data
      }
    };
  },

  get_getCurrentTimestamp (params) {
    return {
      code: 0,
      msg: '',
      // data: Date.now()
      data: dayjs('2021-04-08 23:59:50').valueOf()
    };
  }
};
