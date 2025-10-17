import { TANK_SIZE } from "../tank-sample"

const InfernoTank = ({ gameState }: any) => {
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
            <div
                className="absolute inset-0"
                style={{ transform: `rotate(${gameState.playerTank.bodyAngle}rad)` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-black to-red-950 rounded-xl shadow-2xl border-2 border-red-700/80">
                    {/* Lava cracks */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.2)_0%,transparent_70%)] mix-blend-screen blur-sm"></div>

                    {/* Tracks */}
                    <div className="absolute -left-3 top-3 bottom-3 w-4 bg-gradient-to-b from-black to-red-800 rounded-l-lg border border-red-600 shadow-inner"></div>
                    <div className="absolute -right-3 top-3 bottom-3 w-4 bg-gradient-to-b from-black to-red-800 rounded-r-lg border border-red-600 shadow-inner"></div>
                </div>
            </div>

            {/* Turret */}
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
                <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black rounded-full border-2 border-red-600 shadow-lg shadow-red-600/50">
                    <div className="absolute inset-2 bg-gradient-to-br from-red-500/40 to-transparent rounded-full blur-sm"></div>
                </div>

                <div
                    className="absolute bg-gradient-to-r from-black via-red-800 to-red-500 border border-red-600 shadow-2xl"
                    style={{
                        width: TANK_SIZE * 0.9,
                        height: 12,
                        left: TANK_SIZE * 0.3,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '5px',
                        transformOrigin: `${-TANK_SIZE * 0.3}px 6px`
                    }}
                >
                    <div className="absolute -right-3 top-0 bottom-0 w-4 bg-gradient-to-r from-red-700 to-orange-400 rounded-r-md border-l border-red-600"></div>
                </div>
            </div>

            {/* HP bar */}
            <div className="absolute -top-6 left-0 w-full h-3 bg-black rounded-full border border-red-800">
                <div
                    className={`h-3 rounded-full transition-all duration-300 ${healthPercentage > 60 ? 'bg-red-500' :
                        healthPercentage > 30 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
            </div>

            {/* Glow */}
            <div className="absolute inset-0 bg-red-500/20 blur-2xl -z-10"></div>
            <div className="absolute inset-0 bg-orange-400/10 blur-xl -z-20"></div>
        </div>
    )
}

export default InfernoTank