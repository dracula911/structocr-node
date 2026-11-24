declare namespace StructOCR {
    type File = string | Buffer | Uint8Array;
    type Response = Record<string, unknown>;
    type StructOCRFile = File;
    type StructOCRResponse = Response;

    interface ReceiptOptions {
        /** The endpoint returns Receipt v2 by default. Enhanced accuracy costs 2 credits. */
        accuracy?: "standard" | "enhanced";
        /** Accepted for compatibility. Receipt v1 is retired. */
        responseVersion?: 2;
    }

    interface ErrorOptions {
        status?: number | null;
        code?: string | null;
        details?: unknown;
        retryable?: boolean;
        cause?: unknown;
    }

    class StructOCRError extends globalThis.Error {
        readonly status: number | null;
        readonly code: string | null;
        readonly details: unknown;
        readonly retryable: boolean;
        constructor(message: string, options?: ErrorOptions);
    }
}

declare class StructOCR {
    constructor(apiKey?: string, baseURL?: string, timeout?: number);
    scanPassport(file: StructOCR.File): Promise<StructOCR.Response>;
    scanNationalId(file: StructOCR.File): Promise<StructOCR.Response>;
    scanDriverLicense(file: StructOCR.File): Promise<StructOCR.Response>;
    scanDriverLicensePdf417(file: StructOCR.File): Promise<StructOCR.Response>;
    scanHealthCard(file: StructOCR.File): Promise<StructOCR.Response>;
    scanProofOfAddress(file: StructOCR.File): Promise<StructOCR.Response>;
    scanVisa(file: StructOCR.File): Promise<StructOCR.Response>;
    scanInvoice(file: StructOCR.File): Promise<StructOCR.Response>;
    scanVin(file: StructOCR.File): Promise<StructOCR.Response>;
    scanVinPro(file: StructOCR.File): Promise<StructOCR.Response>;
    scanContainer(file: StructOCR.File): Promise<StructOCR.Response>;
    scanBillOfLading(file: StructOCR.File): Promise<StructOCR.Response>;
    scanHin(file: StructOCR.File): Promise<StructOCR.Response>;
    scanReceipt(file: StructOCR.File, options?: StructOCR.ReceiptOptions): Promise<StructOCR.Response>;
    scanLicensePlate(file: StructOCR.File): Promise<StructOCR.Response>;
    scanVehicleRegistration(file: StructOCR.File): Promise<StructOCR.Response>;
    scanAutoInsurance(file: StructOCR.File): Promise<StructOCR.Response>;
    scanAtmCassette(file: StructOCR.File): Promise<StructOCR.Response>;
    scanWeighbridgeTicket(file: StructOCR.File): Promise<StructOCR.Response>;
    getAccountBalance(): Promise<StructOCR.Response>;
}

export = StructOCR;
