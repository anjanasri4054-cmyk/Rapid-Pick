import { useState, useEffect } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 4000;

let count = 0;
const genId = () => (count = (count + 1) % Number.MAX_VALUE).toString();

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
};

let memoryState = { toasts: [] };
let listeners = [];

function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
        case actionTypes.DISMISS_TOAST:
            return { ...state, toasts: state.toasts.map(t => t.id === action.toastId ? { ...t, open: false } : t) };
        case actionTypes.REMOVE_TOAST:
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.toastId) };
        default:
            return state;
    }
}

function toast(props) {
    const id = genId();
    const update = (newProps) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...newProps, id } });
    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: { ...props, id, open: true, onOpenChange: (open) => !open && dismiss() },
    });

    return { id, dismiss, update };
}

function useToast() {
    const [state, setState] = useState(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    return { ...state, toast, dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }) };
}

export { useToast, toast };