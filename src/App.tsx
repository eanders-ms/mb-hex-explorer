import styled from "@emotion/styled";
import { useContext, useEffect } from "react";
import { AppStateContext } from "./state/AppStateContext";
import GlobalStyles from "./styles/global";
import DropHex from "./pages/DropHex";
import LoadHex from "./pages/LoadHex";
import ShowHex from "./pages/ShowHex";
import Toast from "./components/Toast";
import { loadHexFileAsync } from "./transforms";

function App() {
    const { state } = useContext(AppStateContext);
    const { page } = state;

    useEffect(() => {
        const sinkEvent = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const handleDrop = async (e: any) => {
            e = e as React.DragEvent;
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                await loadHexFileAsync(e.dataTransfer.files[0]);
            }
        };
        const body = document.querySelector("body") as HTMLBodyElement;
        body?.addEventListener("dragover", sinkEvent);
        body?.addEventListener("dragenter", sinkEvent);
        body?.addEventListener("dragleave", sinkEvent);
        body?.addEventListener("drop", handleDrop);
        return () => {
            body?.removeEventListener("dragover", sinkEvent);
            body?.removeEventListener("dragenter", sinkEvent);
            body?.removeEventListener("dragleave", sinkEvent);
            body?.removeEventListener("drop", handleDrop);
        };
    }, []);

    return (
        <>
            <GlobalStyles />
            <Toast />
            {page === "drop-hex" && <DropHex />}
            {page === "load-hex" && <LoadHex />}
            {page === "show-hex" && <ShowHex />}
        </>
    );
}

export default App;
