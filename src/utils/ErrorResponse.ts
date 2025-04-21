class ErrorResponse extends Error {
    public readonly code: number;
    public readonly name: string;

    constructor(code = 500, name = "serverError", msg = "Server Error" ) {
        super(msg);
        this.name = name;
        this.code = code;
    }
}

export default ErrorResponse;
