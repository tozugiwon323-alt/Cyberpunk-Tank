import { useSocket } from "./index";

const useSocketRequest = () => {
    const { socket } = useSocket();

    const sendMessage = async (gameState: any) => {
        if (!socket) return;
        socket.emit("sendGameState", { gameState });
    }

    return {
        sendMessage,
    }
}

export default useSocketRequest;