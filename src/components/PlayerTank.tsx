import { TANK_SIZE } from "./TankGame"

const PlayerTank = ({ gameState }: any) => {
    const healthPercentage = (gameState.playerTank.health / gameState.playerTank.maxHealth) * 100

    return (
        <div
            className="absolute"
            style={{
                left: gameState.playerTank.x - TANK_SIZE / 2,
                top: gameState.playerTank.y - TANK_SIZE / 2,
                width: TANK_SIZE,
                height: TANK_SIZE,
                zIndex: 10
            }}
        >
            {/* Tank Body */}
            <div
                className="absolute inset-0"
                style={{ transform: `rotate(${gameState.playerTank.bodyAngle}rad)` }}
            >
                {/* Enhanced Tank Hull */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-500 to-cyan-700 rounded-xl shadow-2xl shadow-cyan-500/60 border-3 border-cyan-200/80">
                    {/* Tank tracks - more detailed */}
                    <div className="absolute -left-3 top-3 bottom-3 w-4 bg-gradient-to-b from-gray-500 to-gray-800 rounded-l-xl border-2 border-gray-400/60 shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-b from-gray-400/50 to-transparent rounded-l-lg"></div>
                        <div className="absolute left-1 top-2 bottom-2 w-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="absolute -right-3 top-3 bottom-3 w-4 bg-gradient-to-b from-gray-500 to-gray-800 rounded-r-xl border-2 border-gray-400/60 shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-b from-gray-400/50 to-transparent rounded-r-lg"></div>
                        <div className="absolute right-1 top-2 bottom-2 w-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Hull armor plating */}
                    <div className="absolute inset-3 bg-gradient-to-br from-cyan-400/50 to-blue-700/50 rounded-lg border-2 border-cyan-300/50 shadow-inner">
                        <div className="absolute inset-1 bg-gradient-to-br from-cyan-200/30 to-transparent rounded"></div>
                    </div>

                    {/* Hull details and vents */}
                    <div className="absolute top-4 left-4 right-4 h-2 bg-gradient-to-r from-cyan-200 to-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                    <div className="absolute bottom-4 left-4 right-4 h-2 bg-gradient-to-r from-cyan-200 to-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                    <div className="absolute top-6 left-6 right-6 h-1 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"></div>
                    <div className="absolute bottom-6 left-6 right-6 h-1 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"></div>

                    {/* Front indicator and headlights */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-r-lg shadow-lg shadow-orange-400/70 border border-yellow-200"></div>
                    <div className="absolute right-1 top-3 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/70"></div>
                    <div className="absolute right-1 bottom-3 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/70"></div>

                    {/* Level indicator */}
                    <div className="absolute top-1 left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{gameState.playerTank.level}</span>
                    </div>
                </div>
            </div>

            {/* Enhanced Tank Turret */}
            <div
                className="absolute"
                style={{
                    left: TANK_SIZE * 0.15,
                    top: TANK_SIZE * 0.15,
                    width: TANK_SIZE * 0.7,
                    height: TANK_SIZE * 0.7,
                    transform: `rotate(${gameState.playerTank.turretAngle}rad)`,
                    transformOrigin: '50% 50%'
                }}
            >
                {/* Turret base - more detailed */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-800 rounded-full border-3 border-cyan-100/80 shadow-2xl shadow-cyan-500/60">
                    <div className="absolute inset-1 bg-gradient-to-br from-cyan-200/40 to-transparent rounded-full"></div>
                    <div className="absolute inset-3 bg-gradient-to-br from-cyan-300/30 to-blue-700/30 rounded-full border-2 border-cyan-200/50"></div>
                    <div className="absolute inset-5 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full"></div>
                </div>

                {/* Enhanced Gun Barrel - Shorter and Thicker */}
                <div
                    className="absolute bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 shadow-2xl shadow-black/60 border-3 border-gray-400/80"
                    style={{
                        width: TANK_SIZE * 0.8, // Shorter barrel
                        height: 12, // Thicker barrel
                        left: TANK_SIZE * 0.3,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '6px',
                        transformOrigin: `${-TANK_SIZE * 0.3}px 6px`
                    }}
                >
                    {/* Barrel main body */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-300 rounded-md"></div>
                    <div className="absolute top-1 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full"></div>
                    <div className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"></div>

                    {/* Barrel reinforcement rings */}
                    <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-700 rounded-full shadow-inner"></div>
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-700 rounded-full shadow-inner"></div>
                    <div className="absolute left-9 top-0 bottom-0 w-1 bg-gray-700 rounded-full shadow-inner"></div>

                    {/* Enhanced Muzzle brake */}
                    <div className="absolute -right-3 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-400 to-gray-300 border-2 border-gray-500/70 rounded-r-md shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-r from-gray-300/40 to-transparent rounded-r"></div>
                        <div className="absolute right-1 top-2 bottom-2 w-1 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/80"></div>
                        <div className="absolute right-0.5 top-1 bottom-1 w-0.5 bg-orange-400 rounded-full shadow-lg shadow-orange-400/90"></div>
                    </div>
                </div>
            </div>
            <div className="absolute -top-6 left-0 w-full h-3 bg-gray-800/80 rounded-full border border-gray-600">
                <div
                    className={`h-3 rounded-full transition-all duration-300 shadow-lg ${healthPercentage > 60 ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-green-500/50' :
                        healthPercentage > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-400 shadow-yellow-500/50' :
                            'bg-gradient-to-r from-red-500 to-red-400 shadow-red-500/50'
                        }`}
                    style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
            </div>

            {/* Enhanced tank glow effect */}
            <div className="absolute inset-0 bg-cyan-300/30 rounded-xl blur-lg -z-10"></div>
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-2xl -z-20"></div>
        </div>
    )
}

export default PlayerTank;