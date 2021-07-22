import random from 'lodash/random';
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
  filler: i => {
    const execCounts = random(0, 999);
    const outputDatasource = randomItem(ods);
    const inputDatasource = randomItem(ids);

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
      // 日志路径
      logRootPath:  randomCharactors({ min: 10, max: 20 }),
      // 初始时间
      executeStart: randomTime(1000 * 60 * 60 * 24 * 30),
      // 任务状态 1 等待执行，2 正在执行
      currentTaskStatus: random(1, 2),
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
      outputTableName: randomItem(outputDatasource.tables, {}).tableName
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
    
    return {
      code: 0,
      msg: '',
      data: tasks[index],
    };
  }
};
