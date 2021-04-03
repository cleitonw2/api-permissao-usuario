import Queue from "bull";
import redisConfig from "../config/redis";


import * as jobs from '../jobs';

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, Object(redisConfig)),
    name: job.key,
    handle: job.handle,
    options: job.options,
}))

export default {
    queues,
    add(name: string, data: object) {
        const queue = this.queues.find((queue: any) => queue.name === name);

        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach((queue: any) => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job: any, err: any) => {
                console.log('Job failed', queue.key, job.data);
                console.log(err);
            });
        })
    }
};