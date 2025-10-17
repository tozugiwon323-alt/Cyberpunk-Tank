import { TANK_SIZE } from "../TankGame"

interface Props {
    tankType: "default" | "heavy" | "electric" | "desert" | "frost"
}

export default function TankBarrel({ tankType }: Props) {
    const barrelColors: Record<typeof tankType, string> = {
        default:
            "from-gray-700 via-gray-600 to-gray-500 border-gray-500/70 shadow-black/50",
        heavy:
            "from-gray-900 via-gray-800 to-red-800 border-red-800/70 shadow-red-800/50",
        electric:
            "from-blue-600 via-cyan-500 to-blue-300 border-cyan-400/60 shadow-cyan-400/40",
        desert:
            "from-yellow-600 via-amber-500 to-amber-300 border-amber-700/70 shadow-amber-500/50",
        frost:
            "from-gray-300 via-blue-300 to-blue-200 border-blue-400/70 shadow-blue-200/50"
    }

    return (
        <div
            className={`absolute bg-gradient-to-r ${barrelColors[tankType]} border-2`}
            style={{
                width: TANK_SIZE * 0.7,
                height: 12,
                left: TANK_SIZE * 0.25,
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "4px",
                transformOrigin: `${-TANK_SIZE * 0.25}px 4px`
            }}
        >
            {/* inner shine */}
            <div className="absolute top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400/70 to-gray-300/70 rounded-full"></div>
            <div className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-black/30 to-gray-800/50 rounded-full"></div>

            {/* muzzle */}
            <div className="absolute -right-2 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-500 to-gray-400 border border-gray-600/50 rounded-r">
                <div className="absolute inset-0.5 bg-gradient-to-r from-gray-400/30 to-transparent rounded-r"></div>
            </div>
        </div>
    )
}