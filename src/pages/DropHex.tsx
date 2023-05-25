import React from "react";
import { useContext, useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { AppStateContext } from "../state/AppStateContext";
import { clearToasts, dismissToast, showToast } from "../state/actions";
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
    font-size: 2em;
`;

const SubTitleBox = styled.div`
    text-align: center;
    padding: 1em 0;
    font-size: 0.75em;
    font-weight: lighter;
    color: #6b7280;
    padding: 0.25em 0 2em 0;
`;

const DropTarget = styled.div<{
    dragging: boolean;
    mousing: boolean;
}>`
    background-color: ${props => (props.dragging || props.mousing ? "#eef2ff" : "#f8fafc")};
    cursor: ${props => (props.mousing ? "pointer" : "inherit")};
    padding: 2em 3em;
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

const samples = [
    {
        name: "micro:bit DAL + core cpp (MakeCode v4.0.24)",
        url: "microbit-dal-v4.json"
    },
    {
        name: "micro:bit DAL + core cpp (MakeCode v5.0.12)",
        url: "microbit-dal-v5.json"
    },
    {
        name: "micro:bit empty project (MakeCode v4.0.24)",
        url: "microbit-empty-v4.hex"
    },
    {
        name: "micro:bit empty project (MakeCode v5.0.12)",
        url: "microbit-empty-v5.hex"
    }
];

const SamplesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1em;
`;

const SampleButton = styled.button`
    background-color: #eef2ff;
    border: 1px solid #cbd5e1;
    border-radius: 0.5em;
    padding: 0.5em 1em;
    margin: 0.3em;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #f8fafc;
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
            dispatch(clearToasts());
            await loadHexFileAsync(e.target.files[0]);
        }
    };

    useEffect(() => {
        dispatch(toast);
        return () => {
            dispatch(dismissToast(toast.toast.id));
        };
    }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSampleClick = async (e: React.MouseEvent, index: number) => {
        try {
            e.preventDefault();
            e.stopPropagation();
            dispatch(clearToasts());
            const resp = await fetch(samples[index].url);
            const blob = await resp.blob();
            const file = new File([blob], samples[index].url);
            await loadHexFileAsync(file);
        } catch (e) {
            dispatch(
                showToast({
                    type: "error",
                    text: "Failed to load sample",
                    icon: "🤷‍♂️",
                    timeoutMs: 10000
                })
            );
        }
    };

    return (
        <Container>
            <TitleBox>Intel Hex Explorer</TitleBox>
            <SubTitleBox>Maps occupied memory</SubTitleBox>
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
                <SamplesContainer>
                    <p>Or try a sample:</p>
                    {samples.map((sample, index) => (
                        <div>
                            <SampleButton title={sample.url} key={index} onClick={e => handleSampleClick(e, index)}>
                                {sample.name}
                            </SampleButton>
                        </div>
                    ))}
                </SamplesContainer>
            </form>
        </Container>
    );
}
