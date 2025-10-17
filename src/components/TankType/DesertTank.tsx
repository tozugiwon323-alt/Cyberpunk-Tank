import { TANK_SIZE } from "../tank-sample"

const DesertTank = ({ gameState }: any) => {
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
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-700 via-amber-800 to-yellow-900 rounded-lg shadow-2xl border-2 border-amber-500/70">
                    {/* Tracks */}
                    <div className="absolute -left-3 top-3 bottom-3 w-4 bg-gradient-to-b from-stone-500 to-stone-800 rounded-l-lg border border-stone-400 shadow-inner"></div>
                    <div className="absolute -right-3 top-3 bottom-3 w-4 bg-gradient-to-b from-stone-500 to-stone-800 rounded-r-lg border border-stone-400 shadow-inner"></div>

                    {/* Hull armor */}
                    <div className="absolute inset-3 bg-gradient-to-br from-amber-800/60 to-amber-900/80 rounded-md border border-amber-700/60 shadow-inner"></div>

                    {/* Weld seams */}
                    <div className="absolute top-1/3 left-2 right-2 h-1 bg-amber-900/50 rounded"></div>
                    <div className="absolute bottom-1/3 left-2 right-2 h-1 bg-amber-900/50 rounded"></div>
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 rounded-full border-2 border-amber-600 shadow-lg shadow-amber-800/50"></div>

                {/* Gun barrel */}
                <div
                    className="absolute bg-gradient-to-r from-stone-700 to-stone-400 border border-stone-500 shadow-lg"
                    style={{
                        width: TANK_SIZE * 0.9,
                        height: 10,
                        left: TANK_SIZE * 0.3,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '4px',
                        transformOrigin: `${-TANK_SIZE * 0.3}px 5px`
                    }}
                >
                    <div className="absolute -right-3 top-0 bottom-0 w-4 bg-stone-500 rounded-r-md border-l border-stone-400"></div>
                </div>
            </div>

            {/* HP bar */}
            <div className="absolute -top-6 left-0 w-full h-3 bg-stone-900 rounded-full border border-stone-600">
                <div
                    className={`h-3 rounded-full transition-all duration-300 ${healthPercentage > 60 ? 'bg-green-600' :
                        healthPercentage > 30 ? 'bg-yellow-600' : 'bg-red-600'}`}
                    style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
            </div>
        </div>
    )
}

export default DesertTank