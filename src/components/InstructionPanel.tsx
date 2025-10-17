import { Target } from "lucide-react";

const InstructionPanel = ({ currentTankType }: any) => {
    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-gray-500/60 rounded-xl p-4 backdrop-blur-sm shadow-lg shadow-gray-500/30 max-w-4xl">
                <div className="text-gray-300 text-sm space-y-2">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold mb-3 text-base">
                        <Target className="w-4 h-4" />
                        ADVANCED COMBAT SYSTEM - {currentTankType.name.toUpperCase()} CLASS
                    </div>
                    <div className="grid grid-cols-5 gap-3 text-center">
                        <div className="space-y-1">
                            <div className="text-cyan-400 font-mono text-sm font-bold">WASD</div>
                            <div className="text-gray-300 text-xs">Tank Movement</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-cyan-400 font-mono text-sm font-bold">MOUSE</div>
                            <div className="text-gray-300 text-xs">Aim Turret</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-cyan-400 font-mono text-sm font-bold">L-CLICK</div>
                            <div className="text-gray-300 text-xs">Fire Bullets</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-orange-400 font-mono text-sm font-bold">R-CLICK</div>
                            <div className="text-gray-300 text-xs">Launch Rockets</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-green-400 font-mono text-sm font-bold">COLLECT</div>
                            <div className="text-gray-300 text-xs">Power-up Items</div>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-3">
                        Destroy enemies to gain EXP and level up! Collect glowing items for powerful temporary abilities and bonuses.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructionPanel;