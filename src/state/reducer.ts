import { AppState } from "./state";
import { Action } from "./actions";

// The reducer's job is to apply state changes by creating a copy of the existing state with the change applied.
// The reducer must not create side effects. E.g. do not dispatch a state change from within the reducer.
export default function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case "SET_PAGE": {
            return {
                ...state,
                page: action.page
            };
        }
        case "SET_FILENAME": {
            return {
                ...state,
                filename: action.filename
            };
        }
        case "SET_HEXES": {
            return {
                ...state,
                hexes: action.hexes
            };
        }
        case "SHOW_TOAST": {
            return {
                ...state,
                toasts: [...state.toasts, action.toast]
            };
        }
        case "DISMISS_TOAST": {
            return {
                ...state,
                toasts: state.toasts.filter(t => t.id !== action.id)
            };
        }
    }
}
