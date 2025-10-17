import { createContext, useContext, useRef, useState } from "react";

export const GlobalContext = createContext({});

const useGlobalContext = () => {
    return useContext(GlobalContext);
}

const INIT_STATE = {
    playerTank: [],
    enemyTanks: [],
    bullets: [],
    rockets: [],
    explosions: [],
    gameOver: false,
    paused: true,
    score: 0,
    wave: 0,
    enemiesKilled: 0
}

const GlobalProvider = ({ children }: any) => {

    const [state, setState] = useState(INIT_STATE);
    const stateRef = useRef(state);

    const update = (newState: any) => {
        setState((prevState: any) => {
            const updatedState = { ...prevState, ...newState }
            stateRef.current = updatedState;
            return updatedState;
        });
    }

    const initState = () => {
        setState(INIT_STATE);
    }

    const updateWithFunction = (newState: any) => {
        setState((prevState: any) => {
            const updatedState =
                typeof newState === "function"
                    ? newState(prevState)
                    : { ...prevState, ...newState };

            stateRef.current = updatedState;
            return updatedState;
        });
    };

    return (

        <GlobalContext.Provider
            value={{ state, stateRef, update, initState, updateWithFunction }}
        >
            {children}
        </GlobalContext.Provider>

    )
}

export { useGlobalContext, GlobalProvider };
