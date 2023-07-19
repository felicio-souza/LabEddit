import { BaseError } from "./BaseError";



export class ForBiddenError extends BaseError{

    constructor(
        
        message: string = "Token valido, mas sem prmissões suficientes "
    ) {

        super(403, message)
    }
}