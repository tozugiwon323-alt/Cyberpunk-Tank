export const tankStyles: Record<string, any> = {
    cyan: {
        body: "from-cyan-300 via-blue-500 to-cyan-700 border-cyan-200/80 shadow-cyan-500/60",
        tracks: "from-gray-500 to-gray-800 border-gray-400/60",
        turret: "from-cyan-400 via-blue-600 to-cyan-800 border-cyan-100/80 shadow-cyan-500/60",
        barrel: "from-gray-600 via-gray-500 to-gray-400 border-gray-400/80",
        hpBg: "bg-stone-900 border-stone-600",
        glow1: "bg-cyan-300/30",
        glow2: "bg-cyan-400/20"
    },
    desert: {
        body: "bg-gradient-to-br from-yellow-700 via-amber-800 to-yellow-900 border-amber-500/70",
        tracks: "bg-gradient-to-b from-stone-500 to-stone-800 border-stone-400",
        turret: "bg-gradient-to-br from-amber-800 to-amber-950 border-amber-600 shadow-amber-800/50",
        barrel: "bg-gradient-to-r from-stone-700 to-stone-400 border-stone-500",
        hpBg: "bg-stone-900 border-stone-600",
        glow1: "bg-amber-500/10",
        glow2: "bg-amber-700/10"
    },
    frost: {
        body: "bg-gradient-to-br from-sky-200 via-sky-500 to-blue-800 border-sky-200/80",
        tracks: "bg-gradient-to-b from-sky-300 to-blue-600 border-blue-300",
        turret: "bg-gradient-to-br from-white via-sky-300 to-blue-600 border-sky-100 shadow-sky-300/50",
        barrel: "bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 border-blue-300",
        hpBg: "bg-sky-950/60 border-sky-700",
        glow1: "bg-sky-300/20",
        glow2: "bg-blue-200/10"
    },
    jungle: {
        body: "bg-gradient-to-br from-emerald-700 via-green-800 to-forest-800 border-green-600/70",
        tracks: "bg-gradient-to-b from-forest-600 to-green-800 border-green-500",
        turret: "bg-gradient-to-br from-green-800 via-forest-700 to-green-900 border-green-500 shadow-green-400/50",
        barrel: "bg-gradient-to-r from-green-700 via-emerald-600 to-forest-700 border-green-500",
        hpBg: "bg-forest-900 border-green-700",
        glow1: "bg-green-400/20",
        glow2: "bg-emerald-400/10"
    },
    storm: {
        body: "bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 border-gray-400/70",
        tracks: "bg-gradient-to-b from-gray-600 to-gray-800 border-gray-500",
        turret: "bg-gradient-to-br from-gray-900 via-blue-600 to-gray-700 border-gray-500 shadow-blue-500/50",
        barrel: "bg-gradient-to-r from-blue-600 via-gray-600 to-blue-800 border-blue-500",
        hpBg: "bg-gray-800 border-gray-600",
        glow1: "bg-blue-300/20",
        glow2: "bg-gray-400/10"
    },
    toxic: {
        body: "bg-gradient-to-br from-green-800 via-lime-700 to-green-900 border-green-600/70",
        tracks: "bg-gradient-to-b from-green-600 to-green-800 border-green-500",
        turret: "bg-gradient-to-br from-lime-700 via-green-900 to-green-800 border-lime-500 shadow-lime-500/50",
        barrel: "bg-gradient-to-r from-lime-500 via-green-600 to-lime-600 border-lime-500",
        hpBg: "bg-green-900 border-green-700",
        glow1: "bg-lime-400/20",
        glow2: "bg-green-400/10"
    },
    inferno: {
        body: "bg-gradient-to-br from-red-800 via-black to-red-950 border-red-700/80",
        tracks: "bg-gradient-to-b from-black to-red-800 border-red-600",
        turret: "bg-gradient-to-br from-black via-red-900 to-black border-red-600 shadow-red-600/50",
        barrel: "bg-gradient-to-r from-black via-red-800 to-red-500 border-red-600",
        hpBg: "bg-black border-red-800",
        glow1: "bg-red-500/20",
        glow2: "bg-orange-400/10"
    },
    magma: {
        body: "bg-gradient-to-br from-orange-900 via-red-800 to-black border-red-700/70",
        tracks: "bg-gradient-to-b from-red-700 to-black border-red-600",
        turret: "bg-gradient-to-br from-red-800 via-orange-900 to-black border-red-600 shadow-red-500/50",
        barrel: "bg-gradient-to-r from-red-600 via-orange-700 to-red-800 border-red-500",
        hpBg: "bg-red-900 border-red-700",
        glow1: "bg-red-500/30",
        glow2: "bg-orange-500/20"
    },
    heavy: {
        body: "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700/80 shadow-lg",
        tracks: "bg-gradient-to-b from-gray-700 to-gray-900 border-gray-600",
        turret: "bg-gradient-to-br from-black via-gray-900 to-gray-800 border-gray-600 shadow-gray-700/50",
        barrel: "bg-gradient-to-r from-gray-700 via-black to-gray-800 border-gray-600",
        hpBg: "bg-gray-900 border-gray-700",
        glow1: "bg-gray-400/30",
        glow2: "bg-gray-500/20"
    },
    cyber: {
        body: "bg-black border-cyan-400 shadow-[0_0_20px_#00f6ff80]",
        tracks: "bg-gradient-to-b from-gray-800 to-black border-cyan-400",
        turret: "bg-black border-fuchsia-400 shadow-[0_0_20px_#f0f]",
        barrel: "bg-gradient-to-r from-cyan-500 via-fuchsia-400 to-cyan-600 border-cyan-400",
        hpBg: "bg-black border-cyan-400",
        glow1: "bg-cyan-400/20",
        glow2: "bg-fuchsia-400/10"
    },
    electric: {
        body: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-500/70 shadow-lg",
        tracks: "bg-gradient-to-b from-gray-600 to-gray-800 border-yellow-400",
        turret: "bg-gradient-to-br from-yellow-500 via-gray-700 to-yellow-600 border-yellow-400 shadow-yellow-500/50",
        barrel: "bg-gradient-to-r from-yellow-400 via-gray-600 to-yellow-500 border-yellow-400",
        hpBg: "bg-yellow-900 border-yellow-700",
        glow1: "bg-yellow-300/30",
        glow2: "bg-yellow-500/20"
    },
    phantom: {
        body: "bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-700/70 shadow-lg",
        tracks: "bg-gradient-to-b from-black to-gray-900 border-gray-600",
        turret: "bg-gradient-to-br from-gray-800 via-black to-gray-900 border-gray-700 shadow-gray-500/50",
        barrel: "bg-gradient-to-r from-gray-700 via-black to-gray-800 border-gray-600",
        hpBg: "bg-gray-900 border-gray-700",
        glow1: "bg-gray-400/20",
        glow2: "bg-gray-500/10"
    },
    cosmic: {
        body: "bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-900 border-indigo-600/70 shadow-lg",
        tracks: "bg-gradient-to-b from-indigo-700 to-purple-800 border-indigo-500",
        turret: "bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-900 border-purple-500 shadow-purple-500/50",
        barrel: "bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800 border-purple-500",
        hpBg: "bg-indigo-900 border-purple-700",
        glow1: "bg-indigo-400/30",
        glow2: "bg-purple-400/20"
    },
    plasma: {
        body: "bg-gradient-to-br from-cyan-600 via-fuchsia-700 to-purple-700 border-cyan-500/70 shadow-lg",
        tracks: "bg-gradient-to-b from-purple-600 to-cyan-700 border-cyan-500",
        turret: "bg-gradient-to-br from-fuchsia-700 via-cyan-600 to-purple-800 border-fuchsia-500 shadow-fuchsia-400/50",
        barrel: "bg-gradient-to-r from-cyan-500 via-fuchsia-600 to-purple-600 border-fuchsia-400",
        hpBg: "bg-purple-900 border-cyan-700",
        glow1: "bg-cyan-400/30",
        glow2: "bg-fuchsia-400/20"
    },
    dragonsteel: {
        body: "bg-gradient-to-br from-red-900 via-orange-800 to-yellow-900 border-red-700/80 shadow-lg",
        tracks: "bg-gradient-to-b from-black to-red-800 border-red-600",
        turret: "bg-gradient-to-br from-red-800 via-orange-900 to-yellow-800 border-red-600 shadow-orange-500/50",
        barrel: "bg-gradient-to-r from-red-600 via-orange-700 to-yellow-600 border-red-500",
        hpBg: "bg-red-950 border-orange-700",
        glow1: "bg-red-500/40",
        glow2: "bg-orange-500/30"
    },
    titan: {
        body: "bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700/90 shadow-2xl",
        tracks: "bg-gradient-to-b from-black to-gray-900 border-gray-700",
        turret: "bg-gradient-to-br from-gray-800 via-black to-gray-900 border-gray-700 shadow-gray-600/50",
        barrel: "bg-gradient-to-r from-gray-700 via-black to-gray-800 border-gray-700",
        hpBg: "bg-gray-950 border-gray-800",
        glow1: "bg-gray-500/40",
        glow2: "bg-gray-600/30"
    }
}  