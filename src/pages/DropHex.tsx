import React from "react";
import { useContext, useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { AppStateContext } from "../state/AppStateContext";
import { dismissToast, showToast } from "../state/actions";
import { loadHexFileAsync } from "../transforms";

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #f1f5f9;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const TitleBox = styled.div`
    text-align: center;
    padding: 1em 0;
    font-size: 2em;
`;

const DropTarget = styled.div<{
    dragging: boolean;
    mousing: boolean;
}>`
    background-color: ${props => (props.dragging || props.mousing ? "#eef2ff" : "#f8fafc")};
    cursor: ${props => (props.mousing ? "pointer" : "inherit")};
    padding: 3em 4em;
    border-radius: 0.5em;
    font-size: 1.5em;
    text-align: center;
    border-width: 2px;
    border-radius: 1rem;
    border-style: dashed;
    border-color: #cbd5e1;
    transition: background-color 0.2s ease;
    & > p {
        pointer-events: none;
    }
`;

export default function Render() {
    const { state, dispatch } = useContext(AppStateContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [mousing, setMousing] = useState(false);

    const toast = showToast({
        type: "info",
        text: "Drop a hex file to begin",
        icon: "☝️",
        timeoutMs: 10000
    });

    const handleMouseEnter = () => {
        setMousing(true);
    };
    const handleMouseLeave = () => {
        setMousing(false);
    };
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDropTargetClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.files && e.target.files.length > 0) {
            dispatch(dismissToast(toast.toast.id));
            await loadHexFileAsync(e.target.files[0]);
        }
    };

    useEffect(() => {
        dispatch(toast);
        return () => {
            dispatch(dismissToast(toast.toast.id));
        };
    }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            <TitleBox>Intel Hex Explorer</TitleBox>
            <form onSubmit={e => e.preventDefault()}>
                <input ref={inputRef} type='file' multiple={false} hidden={true} onChange={handleFileChange} />
                <DropTarget
                    dragging={dragging}
                    mousing={mousing}
                    onClick={handleDropTargetClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    <p>Drop file here</p>
                    <p style={{ padding: "0.5em 0" }}>or</p>
                    <p>Click to upload</p>
                </DropTarget>
            </form>
        </Container>
    );
}
