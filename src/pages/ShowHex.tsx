import styled from "@emotion/styled";
import { useContext } from "react";
import { AppStateContext } from "../state/AppStateContext";
import { DataChunk, MappedHex } from "../types";
import { padZeros, commaFormatted } from "../utils";

const PageContainer = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #f1f5f9;
`;

const ChunkContainer = styled.div`
    background-color: #222;
    color: #fff;
    padding: 3px;
`;

const ChunkInfo = styled.div`
    font-size: 0.9em;
    font-family: "Roboto Mono", monospace;
`;

const ChunkSizer = styled.div<{
    pct: number;
    color: string;
}>`
    background-color: ${props => props.color};
    width: ${props => props.pct * 100}%;
    height: 10px;
`;

function RenderDataChunk(chunk: DataChunk) {
    return (
        <>
            {chunk.type === "occupied" && (
                <ChunkContainer>
                    <ChunkInfo>
                        {`0x${padZeros(chunk.address.toString(16).toUpperCase(), 5)} - 0x${padZeros(
                            (chunk.address + chunk.length).toString(16).toUpperCase(),
                            5
                        )} (${commaFormatted(chunk.length)} bytes)`}
                    </ChunkInfo>
                    <ChunkSizer pct={chunk.pct} color={"#22c55e"} />
                </ChunkContainer>
            )}
            {chunk.type === "empty" && (
                <ChunkContainer>
                    <ChunkInfo>
                        {`0x${padZeros(chunk.address.toString(16).toUpperCase(), 5)} - 0x${padZeros(
                            (chunk.address + chunk.length).toString(16).toUpperCase(),
                            5
                        )} (${commaFormatted(chunk.length)} bytes)`}
                    </ChunkInfo>
                    <ChunkSizer pct={chunk.pct} color={"#a3a3a3"} />
                </ChunkContainer>
            )}
        </>
    );
}

const BoardContainer = styled.div``;

const BoardHeader = styled.div`
    font-weight: bold;
    font-size: 1em;
    padding: 0.5em 0.25em;
    background-color: #93c5fd;
    margin-top: 0.25em;
`;

const FilenameHeader = styled.div`
    font-weight: bold;
    font-size: 1.25em;
    padding: 0.5em 0.25em;
    background-color: #c4b5fd;
`;

function RenderHexFile(hex: MappedHex) {
    return (
        <BoardContainer>
            {!!hex.device && <BoardHeader>{hex.device}</BoardHeader>}
            {hex.chunks.map((chunk, index) => (
                <RenderDataChunk key={index} {...chunk} />
            ))}
        </BoardContainer>
    );
}

export default function Render() {
    const { state, dispatch } = useContext(AppStateContext);

    return (
        <PageContainer>
            <FilenameHeader>{state.filename}</FilenameHeader>
            {state.hexes.map((hex, index) => (
                <RenderHexFile key={index} {...hex} />
            ))}
        </PageContainer>
    );
}
