import * as muh from "@microbit/microbit-universal-hex";
import { dispatch } from "../state";
import { dismissToast, setPage, setHexes, showToast, setFilename } from "../state/actions";
import { MappedHex } from "../types";
import { decompressCachedHex, parseDataChunks } from "./../utils";

export async function loadHexFileAsync(file: File) {
    dispatch(setPage("load-hex"));
    const toast = showToast({
        type: "info",
        text: `Loading ${file.name}...`,
        showSpinner: true
    });
    dispatch(toast);

    try {
        await (async () =>
            new Promise((resolve, reject) => {
                dispatch(setFilename(file.name));
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        let str = ev.target?.result as string;
                        let isUniversalHex = false;
                        try {
                            isUniversalHex = muh.isUniversalHex(str);
                        } catch { }
                        if (isUniversalHex) {
                            const arr = muh.separateUniversalHex(str);
                            const hexes = arr.map(elem => {
                                const hex: MappedHex = {
                                    device: "BBC micro:bit 0x" + elem.boardId.toString(16).toUpperCase(),
                                    chunks: parseDataChunks(elem.hex)
                                };
                                return hex;
                            });
                            dispatch(setHexes(hexes));
                        } else if (str.startsWith('{"hex":')) {
                            str = decompressCachedHex(str);
                            const hexes = [
                                {
                                    device: "MakeCode Cached Hex",
                                    chunks: parseDataChunks(str)
                                }
                            ];
                            dispatch(setHexes(hexes));
                        } else {
                            const hexes = [
                                {
                                    device: "Intel Hex",
                                    chunks: parseDataChunks(str)
                                }
                            ];
                            dispatch(setHexes(hexes));
                        }
                    } catch (e) {
                        reject(e);
                    }
                    resolve(true);
                };
                reader.readAsText(file);
            }))();
        dispatch(setPage("show-hex"));
        dispatch(
            showToast({
                type: "success",
                text: `Hex loaded!`,
                timeoutMs: 3000
            })
        );
    } catch (e: any) {
        dispatch(
            showToast({
                type: "error",
                text: `${e.message || "Something went wrong."}`,
                timeoutMs: 10000
            })
        );
        dispatch(setPage("drop-hex"));
    } finally {
        dispatch(dismissToast(toast.toast.id));
    }
}
