import styled from "@emotion/styled";
import { useContext, useEffect } from "react";
import { AppStateContext } from "./state/AppStateContext";
import GlobalStyles from "./styles/global";
import DropHex from "./pages/DropHex";
import LoadHex from "./pages/LoadHex";
import ShowHex from "./pages/ShowHex";
import Toast from "./components/Toast";
import { loadHexFileAsync } from "./transforms";

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f1f5f9;
`;

const Footer = styled.div``;

const FooterButton = styled.button`
    background-color: #eef2ff;
    border: 1px solid #cbd5e1;
    border-radius: 0.5em;
    padding: 0.5em 1em;
    margin: 0.3em;
    font-size: 0.75em;
    font-weight: lighter;
    color: #6b7280;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #f8fafc;
    }
`;

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
        <AppContainer>
            <GlobalStyles />
            <Toast />
            {page === "drop-hex" && <DropHex />}
            {page === "load-hex" && <LoadHex />}
            {page === "show-hex" && <ShowHex />}
            <div style={{ flex: 1 }}></div>
            <Footer>
                <FooterButton onClick={() => window.open("https://github.com/eanders-ms/mb-hex-explorer", "_blank")}>
                    github
                </FooterButton>
            </Footer>
        </AppContainer>
    );
}

export default App;
