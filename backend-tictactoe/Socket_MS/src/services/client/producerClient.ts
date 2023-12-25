import { ResponseInterface } from "@/types/Response.interface";
import { Channel, ConsumeMessage } from "amqplib";
import { randomUUID } from "crypto";
import EventEmitter from "events";

export  class ProducerClient{
    constructor(private channel:Channel, private replyClientQueueName:string, private eventEmitter:EventEmitter){};
    
    async produceMessageToServer(data:any,requestServerQueue:string): Promise<ResponseInterface>{
        const uuid = randomUUID();
        console.log("Correlation ID for the mssg to bee sent is ",uuid);
        console.log("Message produced - ",data)
        this.channel.sendToQueue(requestServerQueue,Buffer.from(JSON.stringify(data)),
        {
            replyTo:this.replyClientQueueName,
            correlationId:uuid,
            expiration:10
        });

        // Wait for the produced message to get a response to consumer and trigger the event for this particular corelationId

        return  new Promise((resolve,reject)=>{
            this.eventEmitter.once(uuid.toString(),async(message:any)=>{
            const reply = JSON.parse(message.content.toString());
            console.log("Message received for the ID ",uuid," -- ",JSON.parse(message.content.toString()));
            let response:ResponseInterface = {
                data:reply.data,
                status:reply.status
            }
            resolve(response);

        })
        })
    }

}