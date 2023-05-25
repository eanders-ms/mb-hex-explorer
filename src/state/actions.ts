import { nanoid } from "nanoid";
import { PageName, Toast, ToastWithId, MappedHex } from "../types";

// Changes to app state are performed by dispatching actions to the reducer
type ActionBase = {
    type: string;
};

/**
 * Actions
 */

type SetPage = ActionBase & {
    type: "SET_PAGE";
    page: PageName;
};

type SetFilename = ActionBase & {
    type: "SET_FILENAME";
    filename: string;
};

type SetHexes = ActionBase & {
    type: "SET_HEXES";
    hexes: MappedHex[];
};

type ShowToast = ActionBase & {
    type: "SHOW_TOAST";
    toast: ToastWithId;
};

type DismissToast = ActionBase & {
    type: "DISMISS_TOAST";
    id: string;
};

type ClearToasts = ActionBase & {
    type: "CLEAR_TOASTS";
};

/**
 * Union of all actions
 */

export type Action = SetPage | SetFilename | SetHexes | ShowToast | DismissToast | ClearToasts;

/**
 * Action creators
 */

export const setPage = (page: PageName): SetPage => ({
    type: "SET_PAGE",
    page
});

export const setFilename = (filename: string): SetFilename => ({
    type: "SET_FILENAME",
    filename
});

export const setHexes = (hexes: MappedHex[]): SetHexes => ({
    type: "SET_HEXES",
    hexes
});

export const showToast = (toast: Toast): ShowToast => ({
    type: "SHOW_TOAST",
    toast: {
        id: nanoid(8),
        ...toast
    }
});

export const dismissToast = (id: string): DismissToast => ({
    type: "DISMISS_TOAST",
    id
});

export const clearToasts = (): ClearToasts => ({
    type: "CLEAR_TOASTS"
});
