import {ArgumentsHost, Catch} from "@nestjs/common";
import {HandledExceptionDto} from "../dto/handled-exception.dto";
import {ExceptionHandler} from "../handlers/abstract/exception.handler";
import {FastifyReply} from "fastify";
import {getDefaultException} from "../services/exception.service";
import {CODES} from "@buildery/error-codes";

@Catch()
export class ExceptionFilter {
    handler: ExceptionHandler;

    constructor(handler: ExceptionHandler) {
        this.handler = handler;
    }

    catch(exception: any, host: ArgumentsHost): any {
        const context = host.switchToHttp();
        const response = context.getResponse<FastifyReply>();

        console.log(`primary exception status: ${JSON.stringify(exception.status)}`)
        console.log(`primary exception message: ${JSON.stringify(exception.message)}`)
        console.log(`primary exception body: ${JSON.stringify(exception.body)}`)
        console.log(`primary exception stack: ${JSON.stringify(exception.stack)}`)

        const handledException: HandledExceptionDto = this.handler?.handle(exception);

        const internalErrorException: HandledExceptionDto = new HandledExceptionDto(getDefaultException(CODES.COMMON.UNKNOWN));
        internalErrorException.body = {error: exception.message};

        const responseException = handledException ?? internalErrorException;

        console.log(`response exception: ${JSON.stringify(responseException)}`)

        response
            .code(responseException.status)
            .send(responseException)
    }
}