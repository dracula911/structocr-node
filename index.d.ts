export type StructOCRFile = string | Buffer | Uint8Array;
export type StructOCRResponse = Record<string, unknown>;

declare class StructOCR {
    constructor(apiKey?: string, baseURL?: string, timeout?: number);
    scanPassport(file: StructOCRFile): Promise<StructOCRResponse>;
    scanNationalId(file: StructOCRFile): Promise<StructOCRResponse>;
    scanDriverLicense(file: StructOCRFile): Promise<StructOCRResponse>;
    scanInvoice(file: StructOCRFile): Promise<StructOCRResponse>;
    scanVin(file: StructOCRFile): Promise<StructOCRResponse>;
    scanContainer(file: StructOCRFile): Promise<StructOCRResponse>;
    scanHin(file: StructOCRFile): Promise<StructOCRResponse>;
    scanReceipt(file: StructOCRFile): Promise<StructOCRResponse>;
    scanLicensePlate(file: StructOCRFile): Promise<StructOCRResponse>;
    scanVehicleRegistration(file: StructOCRFile): Promise<StructOCRResponse>;
    scanAtmCassette(file: StructOCRFile): Promise<StructOCRResponse>;
    getAccountBalance(): Promise<StructOCRResponse>;
}

export = StructOCR;
