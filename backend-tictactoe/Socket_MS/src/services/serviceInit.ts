import rabbitMQClientMode from "./client/rabbitMQClientMode";
import rabbitMQServerMode from "./server/rabbitMQServerMode";

export const initializeRabbitMQ = async () => {
    await rabbitMQClientMode.initializeRabbitMQClient();
    console.log("Rabbit MQ Client initialized")
    await rabbitMQServerMode.initializeRabbitMQServer();
    console.log("Rabbit MQ Server initialized")
  }