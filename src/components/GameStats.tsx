import { Shield } from "lucide-react"
import { ROCKET_COOLDOWN } from "./TankGame";

const GameStats = ({ gameState, lastRocketTime, rocketReady, level, killCount }: any) => {
    if (!gameState) return;
    const healthPercentage = (gameState.playerTank.health / gameState.playerTank.maxHealth) * 100;

    return (
        <div className="flex gap-6 mb-4">
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-cyan-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
                <div className="text-cyan-400 text-sm uppercase tracking-wider font-bold">Score</div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{gameState.score}</div>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-purple-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                <div className="text-purple-400 text-sm uppercase tracking-wider font-bold">Wave</div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{gameState.wave}</div>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-red-500/20">
                <div className="text-red-400 text-sm uppercase tracking-wider font-bold">Enemies</div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{gameState.enemyTanks.length}</div>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-red-500/20">
                <div className="text-red-400 text-sm uppercase tracking-wider font-bold">Kill Count</div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{killCount}</div>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-red-500/20">
                <div className="text-red-400 text-sm uppercase tracking-wider font-bold">Level</div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{Number(level.toFixed(2))}</div>
            </div>
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-green-500/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-green-500/20">
                <div className="text-green-400 text-sm uppercase tracking-wider flex items-center gap-2 font-bold">
                    <Shield className="w-4 h-4" />
                    Health
                </div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">{Math.max(0, gameState.playerTank.health)}</div>
                <div className="w-full bg-gray-800/80 rounded-full h-3 mt-2 border border-gray-600">
                    <div
                        className={`h-3 rounded-full transition-all duration-300 shadow-lg ${healthPercentage > 60 ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-green-500/50' :
                            healthPercentage > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-400 shadow-yellow-500/50' :
                                'bg-gradient-to-r from-red-500 to-red-400 shadow-red-500/50'
                            }`}
                        style={{ width: `${Math.max(0, healthPercentage)}%` }}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="text-yellow-400 font-bold">ROCKET:</div>
                <div className="relative w-48 h-4 bg-gray-700 rounded-full overflow-hidden border border-yellow-400/50">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-200"
                        style={{
                            width: `${Math.min(100, ((Date.now() - lastRocketTime) / ROCKET_COOLDOWN) * 100)}%`
                        }}
                    />
                </div>
                <span className="text-gray-300 ml-2 text-sm">
                    {rocketReady ? 'READY' : `${Math.ceil((ROCKET_COOLDOWN - (Date.now() - lastRocketTime)) / 1000)}s`}
                </span>
            </div>

        </div>
    )
}

export default GameStats;