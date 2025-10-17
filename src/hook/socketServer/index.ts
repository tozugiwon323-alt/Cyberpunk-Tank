import { io, Socket } from "socket.io-client";

import { useGlobalContext } from "../../context";
import { useEffect, useRef } from "react";

let singletonSocket: Socket | null = null;

const useSocket = () => {

    const { state, update }: any = useGlobalContext();
    const hasTriedInitRef = useRef(false);

    const setSocket = () => {
        // If we already have a live singleton, just sync it into context
        if (singletonSocket && singletonSocket.connected) {
            if (!state?.socket) update({ socket: singletonSocket });
            return;
        }
        const tokenStr = localStorage.getItem("token") || "{}";
        const { signature, message } = JSON.parse(tokenStr);
        if (!signature) return;
        const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
        const socket = io(url, {
            query: {
                auth_signature: signature,
                auth_message: message
            },
            autoConnect: true,
            transports: ["websocket"]
        });
        socket.on("connect_error", (err: any) => {
            console.warn("socket connect_error", err?.message || err);
        });
        socket.on("disconnect", (reason: any) => {
            console.log("socket disconnected", reason);
        });
        socket.on("connect", () => {
            console.log("socket connected");
        });
        singletonSocket = socket;
        update({ socket });
    };

    useEffect(() => {
        if (hasTriedInitRef.current) return;
        hasTriedInitRef.current = true;
        if (!state?.socket) setSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If context socket is lost (e.g., initState called), but singleton exists, re-sync it
    useEffect(() => {
        if (!state?.socket && singletonSocket) {
            update({ socket: singletonSocket });
        }
    }, [state?.socket]);

    return {
        socket: state.socket,
        setSocket
    };
}

export {
    useSocket,
};