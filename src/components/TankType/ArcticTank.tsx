import { TANK_SIZE } from "../tank-sample"

const ArcticTank = ({ gameState }: any) => {
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
                <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-sky-500 to-blue-800 rounded-xl shadow-2xl border-2 border-sky-200/80">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0%,transparent_80%)] blur-sm"></div>
                    <div className="absolute -left-3 top-3 bottom-3 w-4 bg-gradient-to-b from-sky-300 to-blue-600 rounded-l-lg border border-blue-300 shadow-inner"></div>
                    <div className="absolute -right-3 top-3 bottom-3 w-4 bg-gradient-to-b from-sky-300 to-blue-600 rounded-r-lg border border-blue-300 shadow-inner"></div>
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
                <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-300 to-blue-600 rounded-full border-2 border-sky-100 shadow-lg shadow-sky-300/50"></div>

                <div
                    className="absolute bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 border border-blue-300 shadow-lg"
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
                    <div className="absolute -right-3 top-0 bottom-0 w-4 bg-sky-200 rounded-r-md border-l border-sky-300"></div>
                </div>
            </div>

            {/* HP bar */}
            <div className="absolute -top-6 left-0 w-full h-3 bg-sky-950/60 rounded-full border border-sky-700">
                <div
                    className={`h-3 rounded-full transition-all duration-300 ${healthPercentage > 60 ? 'bg-blue-400' :
                        healthPercentage > 30 ? 'bg-cyan-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
            </div>

            <div className="absolute inset-0 bg-sky-300/20 blur-xl -z-10"></div>
            <div className="absolute inset-0 bg-blue-200/10 blur-2xl -z-20"></div>
        </div>
    )
}

export default ArcticTank