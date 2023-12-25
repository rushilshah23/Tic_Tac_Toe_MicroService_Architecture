import { ConsumeMessage } from "amqplib";
import rabbitMqServerInstance from "@/microservices/rabbitMq/server/rabbitMQServerMode";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import {
  authenticateAccessVerifyLogic,
  authenticateLogic,
} from "@/services/auth.service";
import { authService } from "@/lib/auth";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";

export default class MessageHandler {
  public async handle(message: ConsumeMessage) {
    const { replyTo, correlationId } = message.properties;

    const parsedData = JSON.parse(message.content.toString());
    const { eventType, data } = parsedData;

    console.log(eventType, data);
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    switch (eventType) {
      case rabbitMQConfig.SERVER_MODE.AUTH.EVENTS.GET_AUTH.toString():
        // res= await authService.authenticateHelper(data.tokens.access,data.tokens.refresh)
        // res = await authenticateLogic(data.tokens.access,data.tokens.refresh)
        res = await authenticateAccessVerifyLogic(data.tokens.access);
        break;
      default:
        res = {
          data: "Default Response",
          status: HTTP_STATUS_CODES.HTTP_400_BAD_REQUEST,
        };
        break;
    }

    // Produce the response
    await rabbitMqServerInstance.produceToClient(res, correlationId, replyTo);
  }
}
