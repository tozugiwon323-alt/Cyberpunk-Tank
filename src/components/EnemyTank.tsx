import { TANK_SIZE } from "./TankGame"

const EnemyTank = ({ tank }: any) => {
    return (
        <div
            key={tank.id}
            className="absolute"
            style={{
                left: tank.x - TANK_SIZE / 2,
                top: tank.y - TANK_SIZE / 2,
                width: TANK_SIZE,
                height: TANK_SIZE,
                zIndex: 5
            }}
        >
            {/* Enemy Tank Body */}
            <div
                className="absolute inset-0"
                style={{ transform: `rotate(${tank.bodyAngle}rad)` }}
            >
                {/* Enhanced Enemy hull */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-600 to-red-800 rounded-xl shadow-2xl shadow-red-500/60 border-3 border-red-300/80">
                    {/* Enemy tracks */}
                    <div className="absolute -left-3 top-3 bottom-3 w-4 bg-gradient-to-b from-gray-600 to-gray-900 rounded-l-xl border-2 border-gray-500/60 shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-b from-gray-500/50 to-transparent rounded-l-lg"></div>
                        <div className="absolute left-1 top-2 bottom-2 w-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="absolute -right-3 top-3 bottom-3 w-4 bg-gradient-to-b from-gray-600 to-gray-900 rounded-r-xl border-2 border-gray-500/60 shadow-lg">
                        <div className="absolute inset-1 bg-gradient-to-b from-gray-500/50 to-transparent rounded-r-lg"></div>
                        <div className="absolute right-1 top-2 bottom-2 w-1 bg-gray-400 rounded-full"></div>
                    </div>

                    {/* Enemy hull armor */}
                    <div className="absolute inset-3 bg-gradient-to-br from-red-500/50 to-red-800/50 rounded-lg border-2 border-red-400/50 shadow-inner">
                        <div className="absolute inset-1 bg-gradient-to-br from-red-300/30 to-transparent rounded"></div>
                    </div>

                    {/* Enemy hull details */}
                    <div className="absolute top-4 left-4 right-4 h-2 bg-gradient-to-r from-red-300 to-red-500 rounded-full shadow-lg shadow-red-400/50"></div>
                    <div className="absolute bottom-4 left-4 right-4 h-2 bg-gradient-to-r from-red-300 to-red-500 rounded-full shadow-lg shadow-red-400/50"></div>

                    {/* Enemy front indicator */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-gradient-to-r from-orange-300 to-red-400 rounded-r-lg shadow-lg shadow-red-400/70 border border-orange-200"></div>
                    <div className="absolute right-1 top-3 w-2 h-2 bg-red-200 rounded-full shadow-lg shadow-red-200/70"></div>
                    <div className="absolute right-1 bottom-3 w-2 h-2 bg-red-200 rounded-full shadow-lg shadow-red-200/70"></div>

                    <div className="absolute top-1 left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-red-300">{tank.level}</span>
                    </div>
                </div>
            </div>

            {/* Enhanced Enemy Turret */}
            <div
                className="absolute"
                style={{
                    left: TANK_SIZE * 0.15,
                    top: TANK_SIZE * 0.15,
                    width: TANK_SIZE * 0.7,
                    height: TANK_SIZE * 0.7,
                    transform: `rotate(${tank.turretAngle}rad)`,
                    transformOrigin: '50% 50%'
                }}
            >
                {/* Enemy turret base */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-700 to-red-900 rounded-full border-3 border-red-200/80 shadow-2xl shadow-red-500/60">
                    <div className="absolute inset-1 bg-gradient-to-br from-red-300/40 to-transparent rounded-full"></div>
                    <div className="absolute inset-3 bg-gradient-to-br from-red-400/30 to-red-800/30 rounded-full border-2 border-red-300/50"></div>
                </div>

                {/* Enhanced Enemy Gun Barrel */}
                <div
                    className="absolute bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 shadow-2xl shadow-black/60 border-3 border-gray-500/80"
                    style={{
                        width: TANK_SIZE * 0.75,
                        height: 10,
                        left: TANK_SIZE * 0.3,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '5px',
                        transformOrigin: `${-TANK_SIZE * 0.3}px 5px`
                    }}
                >
                    {/* Enemy barrel body */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-400 rounded"></div>
                    <div className="absolute top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"></div>
                    <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full"></div>

                    {/* Enemy barrel rings */}
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-800 rounded-full shadow-inner"></div>
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800 rounded-full shadow-inner"></div>

                    {/* Enemy muzzle brake */}
                    <div className="absolute -right-2 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-500 to-gray-400 border-2 border-gray-600/70 rounded-r shadow-lg">
                        <div className="absolute right-0.5 top-1.5 bottom-1.5 w-0.5 bg-orange-300 rounded-full shadow-lg shadow-orange-300/80"></div>
                    </div>
                </div>
            </div>

            {/* Enhanced Health bar */}
            <div className="absolute -top-8 left-0 w-full h-4 bg-gray-900/90 rounded-full border-2 border-gray-600 shadow-lg">
                <div
                    className="h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-200 shadow-lg shadow-red-500/50 border border-red-300/50"
                    style={{ width: `${(tank.health / tank.maxHealth) * 100}%` }}
                />
            </div>

            {/* Enhanced enemy tank glow effect */}
            <div className="absolute inset-0 bg-red-400/30 rounded-xl blur-lg -z-10"></div>
            <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-2xl -z-20"></div>
        </div>
    )
}

export default EnemyTank;