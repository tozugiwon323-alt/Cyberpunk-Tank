interface Props {
    tankType: "default" | "heavy" | "electric" | "desert" | "frost"
}

export default function TankBody({ tankType }: Props) {
    const styles: Record<typeof tankType, string> = {
        default:
            "bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 border-cyan-300/50 shadow-cyan-500/50",
        heavy:
            "bg-gradient-to-br from-red-800 via-gray-800 to-black border-red-600 shadow-red-600/50",
        electric:
            "bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 border-purple-400/60 shadow-blue-500/40 rounded-xl",
        desert:
            "bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-amber-600/80 shadow-amber-500/40",
        frost:
            "bg-gradient-to-br from-white via-blue-200 to-blue-500 border-blue-400/70 shadow-blue-300/50"
    }

    return (
        <div
            className={`absolute inset-0 rounded-lg shadow-lg border-2 ${styles[tankType]}`}
        >
            {/* Tracks */}
            <div className="absolute -left-2 top-2 bottom-2 w-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-lg border border-gray-500/50"></div>
            <div className="absolute -right-2 top-2 bottom-2 w-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r-lg border border-gray-500/50"></div>

            {/* Interior Hull Overlay */}
            <div className="absolute inset-2 bg-gradient-to-br from-black/10 to-transparent rounded border border-white/10"></div>

            {/* Front indicator */}
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-r shadow-lg shadow-orange-500/50"></div>
        </div>
    )
}  