import { HttpStatus } from "../configs";
import { ErrorMsg } from "../enums";
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly message: any;
    public readonly details?: any;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        details?: any
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.message = message;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        Error.captureStackTrace(this); // capture stack trace
    }
}

export class NotFoundError extends AppError {
    constructor(message = ErrorMsg.NOT_FOUND, details?: any) {
        super(
            HttpStatus.NOT_FOUND, 
            message, 
            true, 
            details
        );
    }
}

export class BadRequestError extends AppError {
    constructor(message = ErrorMsg.BAD_REQUEST, details?: any) {
        super(
            HttpStatus.BAD_REQUEST, 
            message, 
            true, 
            details
        );
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = ErrorMsg.UNAUTHORIZED, details?: any) {
        super(
            HttpStatus.UNAUTHORIZED, 
            message, 
            true, 
            details
        );
    }
}

export class ValidationError extends AppError {
    constructor(message = ErrorMsg.INVALID_REQUEST_DATA, details?: any) {
        super(
            HttpStatus.UNPROCESSABLE_ENTITY, 
            message, 
            true, 
            details
        );
    }
}

export class ForbiddenError extends AppError {
    constructor(message = ErrorMsg.FORBIDDEN, details?: any) {
        super(
            HttpStatus.FORBIDDEN, 
            message, 
            true, 
            details
        );
    }
}

export const ErrorMiddleware = (err: Error, req: Request, res: Response) => {
    if (err instanceof AppError) {
        console.error(`Operational error: ${err.message}, ${req.method}, ${req.url}`);
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            ...err.details && { details: err.details }
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong. Please try again later.',
    });
}