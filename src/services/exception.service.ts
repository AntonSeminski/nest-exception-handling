import {CustomException} from "../exceptions";
import {CODES, ERROR_BY_CODE} from "@buildery/error-codes";
import {ErrorDto} from "../dto";
import {ExceptionHandler} from "../handlers";

export const getDefaultException = (code?: string): ErrorDto =>
    (code && JSON.stringify(CODES).includes(code))
        ? ERROR_BY_CODE.get(code)
        : ERROR_BY_CODE.get(CODES.COMMON.UNKNOWN)

export const throwException = (code: string, body: any = {}) => {
    if (!code) throwException(CODES.COMMON.EMPTY_PARAM)

    throw new CustomException(code, body);
}

export const createExceptionHandlersChain = (handlers:  ExceptionHandler[]): ExceptionHandler => {
    if (!handlers)
        return null;

    for (let i = 0; i < handlers.length; i++) {
        const current = handlers[i];
        const next = handlers[i + 1];
        const hasNext = i + 1 !== handlers.length;

        if (hasNext)
            current.setNext(next);
    }

    return handlers[0];
}