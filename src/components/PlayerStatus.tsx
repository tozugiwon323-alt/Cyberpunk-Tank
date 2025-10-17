import { Crown, Rocket, Shield } from "lucide-react";

const PlayerStatus = ({ gameState, currentTankType }: any) => {
    const healthPercentage = (gameState.playerTank.health / gameState.playerTank.maxHealth) * 100
    const experiencePercentage = (gameState.playerTank.experience / gameState.playerTank.experienceToNext) * 100
    const rocketCooldownPercentage = Math.min(100, ((Date.now() - gameState.playerTank.lastRocket) / gameState.playerTank.rocketCooldown) * 100)

    return (
        <div className="absolute bottom-4 left-4 z-50">
            <div className="flex flex-col gap-3">
                {/* Tank Level and Type */}
                <div className={`bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-${currentTankType.glow}/60 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-${currentTankType.glow}/30`}>
                    <div className={`text-${currentTankType.glow} text-sm uppercase tracking-wider flex items-center gap-2 font-bold mb-2`}>
                        <Crown className="w-4 h-4" />
                        Level {gameState.playerTank.level} - {currentTankType.name.toUpperCase()}
                    </div>
                    <div className="w-48 bg-gray-800/80 rounded-full h-3 border border-gray-600">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-${currentTankType.glow} to-${currentTankType.glow} shadow-${currentTankType.glow}/50`}
                            style={{ width: `${experiencePercentage}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        EXP: {gameState.playerTank.experience} / {gameState.playerTank.experienceToNext}
                    </div>
                </div>

                {/* Health Bar */}
                <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-green-500/60 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-green-500/30">
                    <div className="text-green-400 text-sm uppercase tracking-wider flex items-center gap-2 font-bold mb-2">
                        <Shield className="w-4 h-4" />
                        Health: {Math.max(0, Math.floor(gameState.playerTank.health))} / {gameState.playerTank.maxHealth}
                        {gameState.activePowerUps.shield > 0 && <div className="text-cyan-400 text-xs">(SHIELDED)</div>}
                    </div>
                    <div className="w-48 bg-gray-800/80 rounded-full h-4 border border-gray-600">
                        <div
                            className={`h-4 rounded-full transition-all duration-300 shadow-lg ${healthPercentage > 60 ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-green-500/50' :
                                healthPercentage > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-400 shadow-yellow-500/50' :
                                    'bg-gradient-to-r from-red-500 to-red-400 shadow-red-500/50'
                                }`}
                            style={{ width: `${Math.max(0, healthPercentage)}%` }}
                        />
                    </div>
                </div>

                {/* Rocket Cooldown */}
                <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-orange-500/60 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-orange-500/30">
                    <div className="text-orange-400 text-sm uppercase tracking-wider flex items-center gap-2 font-bold mb-2">
                        <Rocket className="w-4 h-4" />
                        Rocket: {rocketCooldownPercentage >= 100 ? 'READY' : `${Math.ceil((gameState.playerTank.rocketCooldown - (Date.now() - gameState.playerTank.lastRocket)) / 1000)}s`}
                    </div>
                    <div className="w-48 bg-gray-800/80 rounded-full h-4 border border-gray-600">
                        <div
                            className={`h-4 rounded-full transition-all duration-300 shadow-lg ${rocketCooldownPercentage >= 100 ? 'bg-gradient-to-r from-orange-500 to-red-400 shadow-orange-500/50' :
                                'bg-gradient-to-r from-gray-600 to-gray-700'
                                }`}
                            style={{ width: `${rocketCooldownPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerStatus;