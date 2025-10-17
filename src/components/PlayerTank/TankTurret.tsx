interface Props {
    tankType: "default" | "heavy" | "electric" | "desert" | "frost"
}

export default function TankTurret({ tankType }: Props) {
    const styles: Record<typeof tankType, string> = {
        default:
            "bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-700 border-cyan-200/70 shadow-cyan-500/50",
        heavy:
            "bg-gradient-to-br from-gray-800 via-black to-red-800 border-red-400 shadow-red-500/40",
        electric:
            "bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700 border-cyan-400/60 shadow-blue-400/40 rounded-xl",
        desert:
            "bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-700 border-amber-600/70 shadow-amber-400/50",
        frost:
            "bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 border-blue-400 shadow-blue-300/40"
    }

    return (
        <div
            className={`absolute inset-0 rounded-full border-2 shadow-lg ${styles[tankType]}`}
        >
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
        </div>
    )
}  