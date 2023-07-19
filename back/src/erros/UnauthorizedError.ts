import { BaseError } from "./BaseError";


export class UnauthorizedError extends BaseError{

    constructor (

        message: string = "Token invalido"
    ){

        super(404, message)
    }
}