import { Global, css } from "@emotion/react";

export default function Style() {
    return (
        <>
            <Global
                styles={css`
                    * {
                        margin: 0;
                        padding: 0;
                        outline: 0;
                        box-sizing: border-box;
                        font-family: "GT Walsheim", "Helvetica", "Arial", "sans-serif";
                    }
                    #root {
                        margin: 0 auto;
                    }
                `}
            ></Global>
        </>
    );
}
