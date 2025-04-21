class SuccessResponse {
    public readonly code: number = 200;
    public readonly success: boolean = true;
    public readonly message: string = "Success";
    public readonly data: any = undefined;

    constructor(code: number, msg: string, data?: any) {
        this.code = code;
        this.message = msg;
        this.data = data;
    }
}

export default SuccessResponse;
