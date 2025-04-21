class SuccessResponse {
    public readonly message: string = "Success";
    public readonly success: boolean = true;
    public readonly data: any = undefined;

    constructor(msg: string, data: any) {
        this.message = msg;
        this.data = data;
    }
}

export default SuccessResponse;
