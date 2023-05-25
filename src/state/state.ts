import { PageName, ToastWithId, MappedHex } from "../types";

export type AppState = {
    page: PageName;
    filename: string;
    hexes: MappedHex[];
    toasts: ToastWithId[];
};

export const initialAppState: AppState = {
    page: "drop-hex",
    filename: "",
    hexes: [],
    toasts: []
};
