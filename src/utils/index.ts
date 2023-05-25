import { DataChunk, RecordType } from "../types";
import { byteArrayToHexStr } from "./mbit-utils";
import { parseRecord } from "./mibt-intel";

export function padZeros(str: string, len: number): string {
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}

export function commaFormatted(num: string | number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function truncateStr(str: string, len: number): string {
    const dots = str.length > len ? "..." : "";
    return str.substring(0, len) + dots;
}

export const decodeBase64 = function (s: string) {
    return atob(s);
};

export function parseDataChunks(hexStr: string): DataChunk[] {
    const lines = hexStr.split("\n");
    let result: DataChunk[] = [];
    let segment = 0;
    let mode: "accumulate" | "segment-reset" | "finalize" | "done" = "accumulate";
    lines.forEach((line, index) => {
        if (!line) return;
        if (mode === "done") return;
        const rec = parseRecord(line);
        if (mode === "accumulate") {
            if (
                rec.recordType === RecordType.ExtendedLinearAddress ||
                rec.recordType === RecordType.ExtendedSegmentAddress
            ) {
                const newSegment = (rec.data[0] << 8) + rec.data[1];
                if (newSegment < segment) {
                    mode = "segment-reset";
                }
                if (newSegment === 0x1000) {
                    mode = "finalize";
                }
                segment = newSegment;
                return;
            }
            if (rec.recordType === RecordType.Data) {
                let curr = result.length ? result[result.length - 1] : undefined;
                const newAddr = (segment << 16) + rec.address;
                if (curr && curr.address + curr.length === newAddr) {
                    curr.length += rec.data.length;
                    curr.count++;
                } else {
                    result.push({
                        type: "occupied",
                        address: newAddr,
                        length: rec.data.length,
                        count: 1,
                        pct: 0
                    });
                }
                return;
            }
            if (rec.recordType === RecordType.EndOfFile) {
                return;
            }
            console.log(`[accumulate] Ignoring record type ${rec.recordType} [${rec.data}]`);
            return;
        }
        if (mode === "segment-reset") {
            if (rec.recordType === RecordType.EndOfFile) {
                return;
            }
            console.log(`[segment-reset] Ignoring record type ${rec.recordType} [${rec.data}]`);
            return;
        }
        if (mode === "finalize") {
            if (rec.recordType === RecordType.EndOfFile) {
                return;
            }
            if (rec.recordType === RecordType.StartLinearAddress) {
                const addr = byteArrayToHexStr(rec.data);
                console.log(`[finalize] StartLinearAddress: ${addr}`);
                return;
            }
            console.log(`[finalize] Ignoring record type ${rec.recordType} [${rec.data}]`);
            return;
        }
    });
    // Find gaps between occupied chunks
    let empties: DataChunk[] = [];
    result.forEach((chunk, index) => {
        if (index === 0) return;
        const prev = result[index - 1];
        if (prev.address + prev.length < chunk.address) {
            const empty: DataChunk = {
                type: "empty",
                address: prev.address + prev.length,
                length: chunk.address - (prev.address + prev.length),
                count: 0,
                pct: 0
            };
            empties.push(empty);
        }
    });
    result = result.concat(empties);
    result.sort((a, b) => a.address - b.address);
    let maxSize = 0;
    result.forEach(chunk => {
        maxSize = Math.max(maxSize, chunk.length);
    });
    result.forEach(chunk => {
        chunk.pct = chunk.length / maxSize;
    });

    return result;
}

/**
 * Decompresses a MakeCode hex cache entry.
 */
export function decompressCachedHex(str: string): string {
    const obj = JSON.parse(str);
    const hex = obj.hex;

    let outp: string[] = [];

    for (let i = 0; i < hex.length; i++) {
        let m = /^([@!])(....)$/.exec(hex[i]);
        if (!m) {
            outp.push(hex[i]);
            continue;
        }

        let addr = parseInt(m[2], 16);
        let nxt = hex[++i];
        let buf = "";

        if (m[1] === "@") {
            buf = "";
            let cnt = parseInt(nxt, 16);
            while (cnt-- > 0) {
                /* eslint-disable no-octal */
                buf += "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
                /* eslint-enable no-octal */
            }
        } else {
            buf = decodeBase64(nxt);
        }

        if (!(buf.length > 0)) throw new Error("no data");
        if (!(buf.length % 16 === 0)) throw new Error("bad length");

        for (let j = 0; j < buf.length;) {
            let bytes = [0x10, (addr >> 8) & 0xff, addr & 0xff, 0];
            addr += 16;
            for (let k = 0; k < 16; ++k) {
                bytes.push(buf.charCodeAt(j++));
            }

            let chk = 0;
            for (let k = 0; k < bytes.length; ++k) chk += bytes[k];
            bytes.push(-chk & 0xff);

            let r = ":";
            for (let k = 0; k < bytes.length; ++k) {
                let b = bytes[k] & 0xff;
                if (b <= 0xf) r += "0";
                r += b.toString(16);
            }
            outp.push(r.toUpperCase());
        }
    }

    return outp.join("\n");
}
