export const KAFKA_CONFIG = {
  clientId: 'j9-fe-collect',
  brokers: ['kafka:9092'],
  // 重连 https://kafka.js.org/docs/1.11.0/configuration#retry
  // retry: {
  //   initialRetryTime: 100,
  //   retries: 8
  // }
};


/**
 * ### 生产者配置信息  
 * 文档: https://kafka.js.org/docs/1.11.0/producing#custom-partitioner
 */
export const PRODUCER_CONFIG = {
  /**
   * 分区配置, 只需要改数字即可
   */
  // createPartitioner() {
  //   return ({ topic, partitionMetadata, message }) => {
  //     console.log(topic, partitionMetadata, message)
  //     return 0;
  //   };
  // },
  // 重连 https://kafka.js.org/docs/1.11.0/configuration#retry
  // retry: {
  //   initialRetryTime: 100,
  //   retries: 8
  // }
};