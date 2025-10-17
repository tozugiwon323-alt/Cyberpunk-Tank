import { Gauge, Shield, Zap, Target } from "lucide-react";

const ActivePowerUps = ({ gameState }: any) => {

    return (
        <div className="absolute top-4 right-20 z-50">
            <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-blue-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-blue-500/30">
                <div className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-2">Active Power-ups</div>
                <div className="flex flex-col gap-1">
                    {gameState.activePowerUps.shield > 0 && (
                        <div className="flex items-center gap-2 text-cyan-400 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Shield: {Math.ceil(gameState.activePowerUps.shield / 60)}s</span>
                        </div>
                    )}
                    {gameState.activePowerUps.multishot > 0 && (
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                            <Target className="w-4 h-4" />
                            <span>Multi-shot: {Math.ceil(gameState.activePowerUps.multishot / 60)}s</span>
                        </div>
                    )}
                    {gameState.activePowerUps.damageBoost > 0 && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <Zap className="w-4 h-4" />
                            <span>Damage: {Math.ceil(gameState.activePowerUps.damageBoost / 60)}s</span>
                        </div>
                    )}
                    {gameState.activePowerUps.speedBoost > 0 && (
                        <div className="flex items-center gap-2 text-blue-400 text-sm">
                            <Gauge className="w-4 h-4" />
                            <span>Speed: {Math.ceil(gameState.activePowerUps.speedBoost / 60)}s</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActivePowerUps;