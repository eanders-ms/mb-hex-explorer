export type PageName = "drop-hex" | "load-hex" | "show-hex";

export type ToastType = "success" | "info" | "warning" | "error";

export type Toast = {
    type: ToastType;
    text?: string; // primary message
    detail?: string; // secondary message
    jsx?: React.ReactNode; // React content
    timeoutMs?: number; // if provided, will auto-dismiss after a time
    weight?: number; // heavier toasts sort downward
    textColor?: string; // if provided, override default text color
    backgroundColor?: string; // if provided, override default background color
    sliderColor?: string; // if provided, override default timeout slider color
    hideDismissBtn?: boolean; // if true, will hide the dismiss button
    showSpinner?: boolean; // if true, will show a spinner icon
    hideIcon?: boolean; // if true, will hide the type-specific icon
    icon?: string; // if provided, will override the type-specific icon
};

export type ToastWithId = Toast & {
    id: string;
};

export type DataChunk = {
    type: "occupied" | "empty";
    address: number;
    length: number;
    count: number;
    pct: number;
};

export type MappedHex = {
    device: string;
    chunks: DataChunk[];
};

export enum RecordType {
    Data = 0x00,
    EndOfFile = 0x01,
    ExtendedSegmentAddress = 0x02,
    StartSegmentAddress = 0x03,
    ExtendedLinearAddress = 0x04,
    StartLinearAddress = 0x05,
    BlockStart = 0x0a,
    BlockEnd = 0x0b,
    PaddedData = 0x0c,
    CustomData = 0x0d,
    OtherData = 0x0e
}

export type Record = {
    byteCount: number;
    address: number;
    recordType: RecordType;
    data: Uint8Array;
    checksum: number;
};

export const MicrobitConfig = {
    v1: {
        name: "micro:bit v1",
        boardIds: [0x9900, 0x9901],
        flashUsableEnd: 0x3B400, // 242688,
        flashEnd: 0x3B400, // 242688,
        flashCodeAlign: 0x400, // 1024,
    },
    v2: {
        name: "micro:bit v2",
        boardIds: [0x9903],
        flashUsableEnd: 0x77000, // 487424,
        flashEnd: 0x80000, // 524288,
        flashCodeAlign: 0x1000 // 4096,
    }
};
