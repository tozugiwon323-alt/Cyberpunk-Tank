import { Pause, Play, RotateCcw } from "lucide-react";

const GameControl = ({ gameState, togglePause, resetGame }: any) => {
    return (
        <div className="absolute bottom-4 right-4 z-50 flex gap-3">
            <button
                onClick={togglePause}
                disabled={gameState.gameOver}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-yellow-500/40 border border-yellow-400/50"
            >
                {gameState.paused ? (
                    <>
                        <Play className="w-5 h-5 inline mr-2" />
                        RESUME
                    </>
                ) : (
                    <>
                        <Pause className="w-5 h-5 inline mr-2" />
                        PAUSE
                    </>
                )}
            </button>

            <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-red-500/40 border border-red-400/50"
            >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                RESTART
            </button>
        </div>
    )
}

export default GameControl;