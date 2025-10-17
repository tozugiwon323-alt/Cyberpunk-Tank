import { TANK_SIZE } from "../tank-sample"

const CyberTank = ({ gameState }: any) => {
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
                <div className="absolute inset-0 bg-black rounded-xl shadow-[0_0_20px_#00f6ff80] border-2 border-cyan-400">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#00f6ff33_1px,transparent_1px),linear-gradient(#00f6ff33_1px,transparent_1px)] bg-[size:10px_10px] opacity-50"></div>
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
                <div className="absolute inset-0 bg-black border-2 border-fuchsia-400 rounded-full shadow-[0_0_20px_#f0f]"></div>

                <div
                    className="absolute bg-gradient-to-r from-cyan-500 via-fuchsia-400 to-cyan-600 border border-cyan-400 shadow-lg"
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
                    <div className="absolute -right-3 top-0 bottom-0 w-4 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-r-md border-l border-fuchsia-400"></div>
                </div>
            </div>

            {/* HP bar */}
            <div className="absolute -top-6 left-0 w-full h-3 bg-black rounded-full border border-cyan-400">
                <div
                    className={`h-3 rounded-full transition-all duration-300 ${healthPercentage > 60 ? 'bg-cyan-400' :
                        healthPercentage > 30 ? 'bg-fuchsia-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.max(0, healthPercentage)}%` }}
                />
            </div>

            {/* Glow */}
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl -z-10"></div>
            <div className="absolute inset-0 bg-fuchsia-400/10 blur-2xl -z-20"></div>
        </div>
    )
}

export default CyberTank