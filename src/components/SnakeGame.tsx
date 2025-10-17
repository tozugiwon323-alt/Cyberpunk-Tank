
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Mouse } from 'lucide-react'

interface Position {
    x: number
    y: number
}

interface GameState {
    snake: Position[]
    food: Position
    gameOver: boolean
    paused: boolean
    score: number
    speed: number
}

const BOARD_WIDTH = 800
const BOARD_HEIGHT = 600
const SNAKE_SIZE = 12
const FOOD_SIZE = 10
const INITIAL_SNAKE_LENGTH = 5
const GROWTH_AMOUNT = 3 // How many segments to add when eating food

const SnakeGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        snake: Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
            x: BOARD_WIDTH / 2 - i * SNAKE_SIZE,
            y: BOARD_HEIGHT / 2
        })),
        food: { x: Math.random() * (BOARD_WIDTH - FOOD_SIZE), y: Math.random() * (BOARD_HEIGHT - FOOD_SIZE) },
        gameOver: false,
        paused: false,
        score: 0,
        speed: 60 // FPS for smooth movement
    })

    const [mousePos, setMousePos] = useState<Position>({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 })
    const gameAreaRef = useRef<HTMLDivElement>(null)
    const gameLoopRef = useRef<number>()
    const lastTimeRef = useRef<number>(0)

    const generateFood = useCallback((snake: Position[]): Position => {
        let newFood: Position
        let attempts = 0
        do {
            newFood = {
                x: Math.random() * (BOARD_WIDTH - FOOD_SIZE),
                y: Math.random() * (BOARD_HEIGHT - FOOD_SIZE)
            }
            attempts++
        } while (
            attempts < 100 &&
            snake.some(segment =>
                Math.abs(segment.x - newFood.x) < SNAKE_SIZE + FOOD_SIZE &&
                Math.abs(segment.y - newFood.y) < SNAKE_SIZE + FOOD_SIZE
            )
        )
        return newFood
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameAreaRef.current || gameState.gameOver || gameState.paused) return

        const rect = gameAreaRef.current.getBoundingClientRect()
        const newMousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        // Keep mouse position within bounds
        newMousePos.x = Math.max(SNAKE_SIZE, Math.min(BOARD_WIDTH - SNAKE_SIZE, newMousePos.x))
        newMousePos.y = Math.max(SNAKE_SIZE, Math.min(BOARD_HEIGHT - SNAKE_SIZE, newMousePos.y))

        setMousePos(newMousePos)
    }, [gameState.gameOver, gameState.paused])

    const updateSnake = useCallback((currentTime: number) => {
        if (currentTime - lastTimeRef.current < 1000 / gameState.speed) return

        lastTimeRef.current = currentTime

        setGameState(prevState => {
            if (prevState.gameOver || prevState.paused) return prevState

            const { snake, food, score } = prevState
            const newSnake = [...snake]

            // Move head towards mouse position
            const head = newSnake[0]
            const dx = mousePos.x - head.x
            const dy = mousePos.y - head.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 2) {
                const moveSpeed = Math.min(8, distance * 0.1)
                newSnake[0] = {
                    x: head.x + (dx / distance) * moveSpeed,
                    y: head.y + (dy / distance) * moveSpeed
                }
            }

            // Update body segments to follow the head
            for (let i = 1; i < newSnake.length; i++) {
                const current = newSnake[i]
                const target = newSnake[i - 1]
                const segmentDx = target.x - current.x
                const segmentDy = target.y - current.y
                const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy)

                if (segmentDistance > SNAKE_SIZE) {
                    const moveRatio = (segmentDistance - SNAKE_SIZE) / segmentDistance
                    newSnake[i] = {
                        x: current.x + segmentDx * moveRatio,
                        y: current.y + segmentDy * moveRatio
                    }
                }
            }

            // Check wall collision
            const newHead = newSnake[0]
            if (newHead.x < 0 || newHead.x > BOARD_WIDTH || newHead.y < 0 || newHead.y > BOARD_HEIGHT) {
                return { ...prevState, gameOver: true }
            }

            // Check self collision (only check segments that are far enough away)
            for (let i = 4; i < newSnake.length; i++) {
                const segment = newSnake[i]
                const headDistance = Math.sqrt(
                    Math.pow(newHead.x - segment.x, 2) + Math.pow(newHead.y - segment.y, 2)
                )
                if (headDistance < SNAKE_SIZE) {
                    return { ...prevState, gameOver: true }
                }
            }

            // Check food collision
            const foodDistance = Math.sqrt(
                Math.pow(newHead.x - food.x, 2) + Math.pow(newHead.y - food.y, 2)
            )

            if (foodDistance < SNAKE_SIZE + FOOD_SIZE) {
                const newScore = score + 10
                const newSpeed = Math.min(120, 60 + Math.floor(newScore / 50) * 5)

                // Add multiple segments for more noticeable growth
                const tail = newSnake[newSnake.length - 1]
                const secondToLast = newSnake[newSnake.length - 2] || tail

                for (let i = 0; i < GROWTH_AMOUNT; i++) {
                    const dx = tail.x - secondToLast.x
                    const dy = tail.y - secondToLast.y
                    const length = Math.sqrt(dx * dx + dy * dy) || 1
                    newSnake.push({
                        x: tail.x + (dx / length) * SNAKE_SIZE * (i + 1),
                        y: tail.y + (dy / length) * SNAKE_SIZE * (i + 1)
                    })
                }

                return {
                    ...prevState,
                    snake: newSnake,
                    food: generateFood(newSnake),
                    score: newScore,
                    speed: newSpeed
                }
            }

            return {
                ...prevState,
                snake: newSnake
            }
        })
    }, [mousePos, generateFood, gameState.speed])

    const gameLoop = useCallback((currentTime: number) => {
        updateSnake(currentTime)
        gameLoopRef.current = requestAnimationFrame(gameLoop)
    }, [updateSnake])

    const togglePause = () => {
        setGameState(prev => ({ ...prev, paused: !prev.paused }))
    }

    const resetGame = () => {
        setGameState({
            snake: Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
                x: BOARD_WIDTH / 2 - i * SNAKE_SIZE,
                y: BOARD_HEIGHT / 2
            })),
            food: { x: Math.random() * (BOARD_WIDTH - FOOD_SIZE), y: Math.random() * (BOARD_HEIGHT - FOOD_SIZE) },
            gameOver: false,
            paused: false,
            score: 0,
            speed: 60
        })
        setMousePos({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 })
    }

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key === ' ') {
            e.preventDefault()
            togglePause()
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [handleKeyPress])

    useEffect(() => {
        if (!gameState.gameOver && !gameState.paused) {
            gameLoopRef.current = requestAnimationFrame(gameLoop)
        } else if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current)
        }

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current)
            }
        }
    }, [gameLoop, gameState.gameOver, gameState.paused])

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            {/* Title */}
            <div className="text-center mb-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-green-400 bg-clip-text text-transparent mb-2 animate-pulse">
                    CYBERPUNK SNAKE
                </h1>
                <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>

            {/* Game Stats */}
            <div className="flex gap-8 mb-4">
                <div className="bg-black/40 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-cyan-400 text-sm uppercase tracking-wider">Score</div>
                    <div className="text-3xl font-bold text-white">{gameState.score}</div>
                </div>
                <div className="bg-black/40 border border-pink-500/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-pink-400 text-sm uppercase tracking-wider">Speed</div>
                    <div className="text-3xl font-bold text-white">{Math.round(gameState.speed / 10)}</div>
                </div>
                <div className="bg-black/40 border border-green-500/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-green-400 text-sm uppercase tracking-wider">Length</div>
                    <div className="text-3xl font-bold text-white">{gameState.snake.length}</div>
                </div>
            </div>

            {/* Game Board */}
            <div className="relative">
                <div
                    ref={gameAreaRef}
                    className="relative bg-black/60 border-2 border-cyan-500/50 rounded-lg backdrop-blur-sm shadow-2xl shadow-cyan-500/20 cursor-none overflow-hidden"
                    style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => !gameState.gameOver && !gameState.paused && setGameState(prev => ({ ...prev, paused: true }))}
                >
                    {/* Grid background */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }}
                    />

                    {/* Snake */}
                    {gameState.snake.map((segment, index) => (
                        <div
                            key={index}
                            className={`absolute rounded-full transition-all duration-100 ${index === 0
                                ? 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-500/50 animate-pulse'
                                : 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-md shadow-cyan-500/30'
                                }`}
                            style={{
                                left: segment.x - SNAKE_SIZE / 2,
                                top: segment.y - SNAKE_SIZE / 2,
                                width: SNAKE_SIZE,
                                height: SNAKE_SIZE,
                                zIndex: gameState.snake.length - index
                            }}
                        />
                    ))}

                    {/* Food */}
                    <div
                        className="absolute bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50 animate-bounce rounded-full"
                        style={{
                            left: gameState.food.x,
                            top: gameState.food.y,
                            width: FOOD_SIZE,
                            height: FOOD_SIZE
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-green-300 to-green-500 animate-pulse"></div>
                    </div>

                    {/* Mouse cursor indicator */}
                    {!gameState.gameOver && !gameState.paused && (
                        <div
                            className="absolute w-4 h-4 border-2 border-cyan-400 rounded-full pointer-events-none animate-ping"
                            style={{
                                left: mousePos.x - 8,
                                top: mousePos.y - 8
                            }}
                        />
                    )}

                    {/* Game Over Overlay */}
                    {gameState.gameOver && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</div>
                                <div className="text-2xl text-white mb-4">Final Score: {gameState.score}</div>
                                <button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-red-500/30"
                                >
                                    <RotateCcw className="w-5 h-5 inline mr-2" />
                                    RESTART
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pause Overlay */}
                    {gameState.paused && !gameState.gameOver && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-4 animate-pulse">PAUSED</div>
                                <div className="text-lg text-white">Move mouse over game area or click Play to continue</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={togglePause}
                    disabled={gameState.gameOver}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                    {gameState.paused ? (
                        <>
                            <Play className="w-5 h-5 inline mr-2" />
                            PLAY
                        </>
                    ) : (
                        <>
                            <Pause className="w-5 h-5 inline mr-2" />
                            PAUSE
                        </>
                    )}
                </button>

                <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-pink-500/30"
                >
                    <RotateCcw className="w-5 h-5 inline mr-2" />
                    RESTART
                </button>
            </div>

            {/* Instructions */}
            <div className="bg-black/40 border border-gray-500/50 rounded-lg p-4 backdrop-blur-sm max-w-md text-center">
                <div className="text-gray-300 text-sm space-y-2">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold mb-2">
                        <Mouse className="w-4 h-4" />
                        NEURAL MOUSE INTERFACE
                    </div>
                    <div>Move your <span className="text-cyan-400 font-mono">MOUSE</span> to control the snake</div>
                    <div>Press <span className="text-cyan-400 font-mono">SPACE</span> to pause/resume</div>
                    <div>Collect <span className="text-green-400">energy cores</span> to grow significantly</div>
                    <div>Snake follows your cursor like a real serpent</div>
                    <div>Avoid walls and your own digital trail</div>
                </div>
            </div>
        </div>
    )
}

export default SnakeGame