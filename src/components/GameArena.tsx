import { Rocket, RotateCcw, Target } from "lucide-react";
// import PlayerTank from "./PlayerTank";
import PlayerTank from "./TankType/tank";
import EnemyTank from "./EnemyTank";
import BulletPanel from "./Bullet";
import ExplosionPanel from "./explosion";
import { BOARD_HEIGHT, BOARD_WIDTH, ITEM_SIZE, ITEM_TYPES } from "./tank-sample";
import { GameState, Position } from "types/tank";


interface GameArenaProps {
    gameState: GameState,
    mousePos: Position,
    gameAreaRef: any,
    currentTankType: any,
    handleMouseMove: (e: any) => void,
    handleMouseDown: (e: any) => void,
    handleContextMenu: (e: any) => void,
    resetGame: () => void
}

const GameArena = (props: GameArenaProps) => {
    const { gameState, mousePos, gameAreaRef, currentTankType, handleMouseMove, handleMouseDown, handleContextMenu, resetGame } = props;

    const rocketCooldownPercentage = Math.min(100, ((Date.now() - gameState.playerTank.lastRocket) / gameState.playerTank.rocketCooldown) * 100)

    console.log("BOARD SIZE: ", BOARD_HEIGHT, BOARD_WIDTH)
    return (
        <div
            ref={gameAreaRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onContextMenu={handleContextMenu}
        >
            {/* Ambient lighting effects */}
            {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div> */}

            {/* Upgrade Animation Overlay */}
            {gameState.isUpgrading && (
                <div className="absolute inset-0 pointer-events-none z-30">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"
                        style={{
                            opacity: gameState.upgradeAnimation / 120,
                            filter: `blur(${(120 - gameState.upgradeAnimation) / 10}px)`
                        }}
                    />
                </div>
            )}

            {/* Game Items */}
            {gameState.gameItems.filter((item: any) => !item.collected).map((item: any) => {
                const itemType = ITEM_TYPES[item.type]
                const IconComponent = itemType.icon
                const pulseScale = 1 + Math.sin(item.pulsePhase) * 0.2
                const opacity = item.life / item.maxLife

                return (
                    <div
                        key={item.id}
                        className="absolute"
                        style={{
                            left: item.x - ITEM_SIZE / 2,
                            top: item.y - ITEM_SIZE / 2,
                            width: ITEM_SIZE,
                            height: ITEM_SIZE,
                            zIndex: 8,
                            transform: `scale(${pulseScale})`,
                            opacity: opacity
                        }}
                    >
                        {/* Item glow effect */}
                        <div className={`absolute inset-0 bg-${itemType.glow}/40 rounded-full blur-lg`}></div>
                        <div className={`absolute inset-0 bg-${itemType.glow}/20 rounded-full blur-2xl`}></div>

                        {/* Item body */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${itemType.color} rounded-full border-3 border-${itemType.glow.replace('400', '200')}/80 shadow-2xl shadow-${itemType.glow}/60`}>
                            <div className={`absolute inset-1 bg-gradient-to-br from-${itemType.glow.replace('400', '200')}/40 to-transparent rounded-full`}></div>

                            {/* Item icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <IconComponent className={`w-6 h-6 text-white drop-shadow-lg`} />
                            </div>
                        </div>

                        {/* Item name tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <div className={`bg-black/80 text-${itemType.glow} text-xs px-2 py-1 rounded border border-${itemType.glow}/50 shadow-lg`}>
                                {itemType.name}
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Upgrade Particles */}
            {gameState.upgradeParticles.filter(p => p.active).map(particle => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full bg-${particle.color} shadow-2xl`}
                    style={{
                        left: particle.x - particle.size / 2,
                        top: particle.y - particle.size / 2,
                        width: particle.size,
                        height: particle.size,
                        opacity: particle.life / particle.maxLife,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                        zIndex: 25
                    }}
                />
            ))}

            {/* Smoke Particles */}
            {gameState.smokeParticles.filter(s => s.active).map(smoke => (
                <div
                    key={smoke.id}
                    className="absolute rounded-full bg-gradient-to-r from-gray-600/60 to-gray-800/40 blur-sm"
                    style={{
                        left: smoke.x - smoke.size / 2,
                        top: smoke.y - smoke.size / 2,
                        width: smoke.size,
                        height: smoke.size,
                        opacity: smoke.life / smoke.maxLife,
                        zIndex: 1
                    }}
                />
            ))}

            {/* Player Tank */}
            <PlayerTank gameState={gameState} currentTankType={currentTankType} />

            {/* Enhanced Enemy Tanks */}
            {gameState.enemyTanks.map((tank: any) => (
                <EnemyTank tank={tank} />
            ))}

            {/* Enhanced Bullets and Rockets with trails */}
            {gameState.bullets.map((bullet: any) => (
                <BulletPanel bullet={bullet} />
            ))}

            {/* Enhanced Explosions */}
            {gameState.explosions.map((explosion: any) => (
                <ExplosionPanel explosion={explosion} />
            ))}

            {/* Floating Text */}
            {gameState.floatingTexts.map((text: any) => (
                <div
                    key={text.id}
                    className="absolute font-bold pointer-events-none"
                    style={{
                        left: text.x,
                        top: text.y,
                        color: text.color,
                        fontSize: `${text.fontSize}px`,
                        opacity: text.life / text.maxLife,
                        zIndex: 30,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        transform: 'translateX(-50%)'
                    }}
                >
                    {text.text}
                </div>
            ))}

            {/* Enhanced Crosshair */}
            <div
                className="absolute w-12 h-12 border-3 border-yellow-300/95 pointer-events-none shadow-2xl shadow-yellow-300/60"
                style={{
                    left: mousePos.x - 24,
                    top: mousePos.y - 24,
                    zIndex: 25
                }}
            >
                <div className="absolute inset-2 border-2 border-yellow-200/80 rounded"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-yellow-300/80"></div>

                {/* Crosshair lines */}
                <div className="absolute top-1/2 left-0 w-3 h-1 bg-yellow-300 transform -translate-y-1/2 shadow-lg shadow-yellow-300/60"></div>
                <div className="absolute top-1/2 right-0 w-3 h-1 bg-yellow-300 transform -translate-y-1/2 shadow-lg shadow-yellow-300/60"></div>
                <div className="absolute left-1/2 top-0 w-1 h-3 bg-yellow-300 transform -translate-x-1/2 shadow-lg shadow-yellow-300/60"></div>
                <div className="absolute left-1/2 bottom-0 w-1 h-3 bg-yellow-300 transform -translate-x-1/2 shadow-lg shadow-yellow-300/60"></div>

                {/* Rocket indicator */}
                {rocketCooldownPercentage >= 100 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Rocket className="w-6 h-6 text-orange-400 animate-pulse drop-shadow-lg" />
                    </div>
                )}

                {/* Multi-shot indicator */}
                {gameState.activePowerUps.multishot > 0 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <Target className="w-6 h-6 text-yellow-400 animate-pulse drop-shadow-lg" />
                    </div>
                )}
            </div>

            {/* Game Over Overlay */}
            {gameState.gameOver && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-lg">
                    <div className="text-center">
                        <div className="text-9xl font-bold text-red-400 mb-8 animate-pulse drop-shadow-2xl">DESTROYED</div>
                        <div className="text-4xl text-white mb-4 drop-shadow-lg">Final Score: {gameState.score}</div>
                        <div className="text-2xl text-gray-300 mb-3">Wave Reached: {gameState.wave}</div>
                        <div className="text-2xl text-gray-300 mb-3">Tank Level: {gameState.playerTank.level} ({currentTankType.name.toUpperCase()})</div>
                        <div className="text-xl text-yellow-400 mb-3">Total Kills: {gameState.totalKills}</div>
                        <div className="text-xl text-green-400 mb-8">Items Collected: {gameState.itemsCollected}</div>
                        <button
                            onClick={resetGame}
                            className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-orange-700 transition-all duration-200 shadow-2xl shadow-red-500/50 border-2 border-red-400/60 text-xl"
                        >
                            <RotateCcw className="w-7 h-7 inline mr-3" />
                            RESTART MISSION
                        </button>
                    </div>
                </div>
            )}

            {/* Pause Overlay */}
            {gameState.paused && !gameState.gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-lg">
                    <div className="text-center">
                        <div className="text-6xl font-bold text-yellow-400 mb-8 animate-pulse drop-shadow-2xl">MISSION PAUSED</div>
                        <div className="text-2xl text-white mb-6">Press SPACE to continue</div>
                        <div className="text-lg text-gray-300 mb-4">
                            Tank Level: {gameState.playerTank.level} - {currentTankType.name.toUpperCase()}
                        </div>
                        <div className="text-lg text-gray-300 mb-4">
                            Items Collected: {gameState.itemsCollected}
                        </div>
                        <div className="text-lg text-gray-300">
                            Left Click: Fire Bullets | Right Click: Launch Rockets
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GameArena;