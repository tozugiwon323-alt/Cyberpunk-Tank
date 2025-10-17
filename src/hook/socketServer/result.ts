import { useEffect } from "react";
import { useSocket } from ".";
import { useGlobalContext } from "../../context";

const useSocketResult = () => {
    const { update, state, updateWithFunction }: any = useGlobalContext();
    const { socket }: any = useSocket();

    const onGameState = () => {
        if (!socket) return;
        socket.on("onGameState", async ({ gameState }: any) => {
            update({ gameState });
        });
    }

    const updateChatHistory = (chatHistory: any[]) => {
        update({ chatHistory })
    }

    useEffect(() => {
        if (!socket) return;
        const handler = ({ gameState }: any) => {
            update({ gameState });
        };
        socket.on("onGameState", handler);
        return () => {
            socket.off("onGameState", handler);
        };
    }, [socket]);

    return {
        chatHistory: state.chatHistory,
        updateWithFunction,

        onGameState,
        updateChatHistory
    }
}

export default useSocketResult;
