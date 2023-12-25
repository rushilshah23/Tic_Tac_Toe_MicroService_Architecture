import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config"

export interface APIResponse{
    status:HTTP_STATUS_CODES
    result: "SUCCESS" | "FAIL" | "UNKNOWN",
    message: string | null,
    data: any
}

export const defaultAPIResponseObject:APIResponse = {
    status:HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR,
    result:"UNKNOWN",
    message:null,
    data:null
}