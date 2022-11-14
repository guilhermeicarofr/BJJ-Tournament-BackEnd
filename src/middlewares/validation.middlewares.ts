import { NextFunction, Request, Response } from 'express';
import { Schema } from "joi";

function validateSchema(schema: Schema) {
    return (req:Request, res:Response, next: NextFunction) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        if(validation.error) {
            return res.status(422).send(validation.error.details.map((detail) => detail.message));
        }
        next();
    }
}

export { validateSchema };