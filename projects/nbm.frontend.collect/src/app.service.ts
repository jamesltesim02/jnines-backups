import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KAFKA_CONFIG, PRODUCER_CONFIG } from './config';


@Injectable()
export class AppService {

  readonly kafka: Kafka;
  readonly producer: Producer;

  constructor () {
    this.kafka = new Kafka(KAFKA_CONFIG);
    this.producer = this.kafka.producer(PRODUCER_CONFIG);
    this.producer.connect();
  }

  collect(params: any): void {
    this.producer.send({
      topic: params.type,
      messages: [{
        key: `${Date.now()}${Math.random()}`,
        value: JSON.stringify(params)
      }]
    }).then(result => {
      console.log('send result:', result);
    });
  }
}
