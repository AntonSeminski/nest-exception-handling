import {ValidationError} from "@nestjs/common";
import {ValidationException} from "../../exceptions";

export const validationExceptionFactory = (validationErrors: ValidationError[] = []) => {
    return new ValidationException(validationErrors)
}