import { TANK_SIZE } from "../TankGame"
import TankBody from "./TankBody"
import TankTurret from "./TankTurret"
import TankBarrel from "./TankBarrel"

const PlayerTank = ({ gameState, tankType = "default" }: any) => {
  const healthPercentage =
    (gameState.playerTank.health / gameState.playerTank.maxHealth) * 100

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
        <TankBody tankType={tankType} />
      </div>

      {/* Turret */}
      <div
        className="absolute"
        style={{
          left: TANK_SIZE * 0.2,
          top: TANK_SIZE * 0.2,
          width: TANK_SIZE * 0.6,
          height: TANK_SIZE * 0.6,
          transform: `rotate(${gameState.playerTank.turretAngle}rad)`,
          transformOrigin: "50% 50%"
        }}
      >
        <TankTurret tankType={tankType} />
        <TankBarrel tankType={tankType} />
      </div>

      {/* Health bar */}
      <div className="absolute -top-6 left-0 w-full h-3 bg-gray-800/80 rounded-full border border-gray-600">
        <div
          className={`h-3 rounded-full transition-all duration-300 shadow-lg ${
            healthPercentage > 60
              ? "bg-gradient-to-r from-green-500 to-green-400 shadow-green-500/50"
              : healthPercentage > 30
              ? "bg-gradient-to-r from-yellow-500 to-orange-400 shadow-yellow-500/50"
              : "bg-gradient-to-r from-red-500 to-red-400 shadow-red-500/50"
          }`}
          style={{ width: `${Math.max(0, healthPercentage)}%` }}
        />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md -z-10"></div>
    </div>
  )
}

export default PlayerTank;