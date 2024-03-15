export enum ActionErrors {
    INTERNAL_SERVER_ERROR = "Internal server error",
    NOT_FOUND = "Not found",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
    BAD_REQUEST = "Bad request",
    CONFLICT = "Conflict",
    UNPROCESSABLE_ENTITY = "Unprocessable entity",
    TOO_MANY_REQUESTS = "Too many requests",
}

export type ActionResult<T> = {
    success: true;
    data: T;
};

export type ActionError = {
    success: false;
    errorCode: ActionErrors;
    errorMessage: string;
};

export type ActionResponse<T> = ActionResult<T> | ActionError;
