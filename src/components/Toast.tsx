import { useContext, useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { AppStateContext } from "../state/AppStateContext";
import { ToastType, ToastWithId } from "../types";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { dismissToast } from "../state/actions";

const backgroundColors: { [type in ToastType]: string } = {
    success: "#86efac",
    info: "#7dd3fc",
    warning: "#fcd34d",
    error: "#fca5a5"
};

const sliderColors: { [type in ToastType]: string } = {
    success: "#22c55e",
    info: "#0ea5e9",
    warning: "#f59e0b",
    error: "#ef4444"
};

const icons: { [type in ToastType]: string } = {
    success: "😊",
    info: "🔔",
    warning: "😮",
    error: "😢"
};

// We need to delay the slider animation until the notification
// intro animation finishes, otherwise they can interfere.
const SLIDER_DELAY_MS = 300;

const ToastContainer = styled.div<{
    type: ToastType;
    textColor?: string;
    backgroundColor?: string;
}>`
    display: flex;
    flex-direction: column;
    margin-right: 0;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    pointer-events: none;
    color: ${props => props.textColor || "#000"};
    background-color: ${props => props.backgroundColor || backgroundColors[props.type]};
`;

const ToastCard = styled.div`
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
`;

const ToastIcon = styled.div<{
    type: ToastType;
    sliderColor?: string;
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 100%;
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${props => props.sliderColor || sliderColors[props.type]};
`;

const ToastContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    justify-content: center;
`;

const ToastText = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
    display: flex;
`;

const ToastDetail = styled.div`
    font-size: 0.875rem;
`;

const ToastDismissBtn = styled.div`
    pointer-events: auto;
    align-items: center;
    display: flex;
`;

const ToastDismissIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    &:hover {
        transform: scale(1.25);
    }
    transition: all 0.2s ease-in-out;
`;

const ToastSpinnerContainer = styled.div`
    align-items: center;
    display: flex;
`;

const ToastSlider = styled.div<{
    type: ToastType;
    active: boolean;
    sliderColor?: string;
}>`
    height: 0.25rem;
    transition: all 0.2s linear;
    background-color: ${props => props.sliderColor || sliderColors[props.type]};
    width: ${props => (props.active ? "0" : "100%")};
`;

function Toast(props: ToastWithId) {
    const { dispatch } = useContext(AppStateContext);
    const [sliderActive, setSliderActive] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
        if (props.timeoutMs) {
            t1 = setTimeout(() => dispatch(dismissToast(props.id)), SLIDER_DELAY_MS + props.timeoutMs);
            t2 = setTimeout(() => setSliderActive(true), SLIDER_DELAY_MS);
        }
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [dispatch, props.id, props.timeoutMs]);

    const handleDismissClicked = () => {
        dispatch(dismissToast(props.id));
    };

    return (
        <ToastContainer type={props.type} textColor={props.textColor} backgroundColor={props.backgroundColor}>
            <ToastCard>
                {!props.hideIcon && <ToastIcon type={props.type}>{props.icon ?? icons[props.type]}</ToastIcon>}
                <ToastContentContainer>
                    {props.text && <ToastText>{props.text}</ToastText>}
                    {props.detail && <ToastDetail>{props.detail}</ToastDetail>}
                    {props.jsx && <div>{props.jsx}</div>}
                </ToastContentContainer>
                {!props.hideDismissBtn && !props.showSpinner && (
                    <ToastDismissBtn onClick={handleDismissClicked}>
                        <ToastDismissIcon icon={faTimesCircle} />
                    </ToastDismissBtn>
                )}
                {props.showSpinner && (
                    <ToastSpinnerContainer>
                        <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />
                    </ToastSpinnerContainer>
                )}
            </ToastCard>
            {props.timeoutMs && (
                <div>
                    <ToastSlider
                        ref={sliderRef}
                        type={props.type}
                        active={sliderActive}
                        style={{ transitionDuration: `${props.timeoutMs}ms` }}
                    ></ToastSlider>
                </div>
            )}
        </ToastContainer>
    );
}

const ToastsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-direction: column-reverse;
    align-items: flex-end;
    position: fixed;
    bottom: 0;
    right: 0;
    margin-bottom: 1em;
    margin-right: 1em;
    z-index: 50;
    pointer-events: none;
`;

export default function Render() {
    const { state } = useContext(AppStateContext);
    const { toasts } = state;

    return (
        <ToastsContainer>
            <AnimatePresence>
                {toasts.map(item => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                        <Toast {...item} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </ToastsContainer>
    );
}
