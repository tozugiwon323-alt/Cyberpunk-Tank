import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Target } from 'lucide-react'
import PlayerTank from './PlayerTank/index'
import GameStats from './GameStats'
import EnemyTank from './EnemyTank'

interface Position {
    x: number
    y: number
}

interface Tank {
    id: string
    x: number
    y: number
    bodyAngle: number // Tank body direction (movement)
    turretAngle: number // Gun turret direction (aiming)
    health: number
    maxHealth: number
    lastShot: number
    speed: number
}

interface Bullet {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    owner: 'player' | 'enemy'
    damage: number
    trail: Position[]
}

interface Rocket {
    id: string
    x: number
    y: number
    vx: number
    vy: number,
    angle: number,
    speed: number,
    owner: 'player' | 'enemy'
    damage: number
    trail: Position[]
}

interface Explosion {
    id: string
    x: number
    y: number
    size: number
    life: number
}

interface GameState {
    playerTank: Tank
    enemyTanks: Tank[]
    bullets: Bullet[]
    rockets: Rocket[],
    explosions: Explosion[]
    gameOver: boolean
    paused: boolean
    score: number
    wave: number
    enemiesKilled: number
}

export const BOARD_WIDTH = 1800
export const BOARD_HEIGHT = 900
export const TANK_SIZE = 60
export const BULLET_SIZE = 10
export const BULLET_SPEED = 12
export const BULLET_DAMAGE = 28
export const PLAYER_SPEED = 3.5
export const ENEMY_SPEED = 2
export const SHOT_COOLDOWN = 200
export const ENEMY_SHOT_COOLDOWN = 1500
export const ROCKET_SPEED = 7
export const ROCKET_DAMAGE = 120
export const ROCKET_COOLDOWN = 5000 // 10 seconds
export const ENEMY_HIT_RADIUS = 20; // 20px from center
export const TANK_TYPES = ["default", "heavy", "electric", "desert", "frost"]

const TankGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        playerTank: {
            id: 'player',
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT - 120,
            bodyAngle: 0,
            turretAngle: 0,
            health: 100,
            maxHealth: 100,
            lastShot: 0,
            speed: PLAYER_SPEED
        },
        enemyTanks: [],
        bullets: [],
        rockets: [],
        explosions: [],
        gameOver: false,
        paused: false,
        score: 0,
        wave: 1,
        enemiesKilled: 0
    })

    const [keys, setKeys] = useState<Set<string>>(new Set())
    const [mousePos, setMousePos] = useState<Position>({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 })
    const [lastRocketTime, setLastRocketTime] = useState<number>(0)
    const [rocketReady, setRocketReady] = useState<boolean>(true)
    const [level, setLevel] = useState<number>(1);
    const [killCount, setKillCount] = useState(0);
    const gameAreaRef = useRef<HTMLDivElement>(null)
    const gameLoopRef = useRef<number>()
    const lastTimeRef = useRef<number>(0)

    const generateEnemyTank = useCallback((): Tank => {
        const side = Math.floor(Math.random() * 4)
        let x, y

        switch (side) {
            case 0: // Top
                x = Math.random() * (BOARD_WIDTH - 100) + 50
                y = -TANK_SIZE
                break
            case 1: // Right
                x = BOARD_WIDTH + TANK_SIZE
                y = Math.random() * (BOARD_HEIGHT - 100) + 50
                break
            case 2: // Bottom
                x = Math.random() * (BOARD_WIDTH - 100) + 50
                y = BOARD_HEIGHT + TANK_SIZE
                break
            default: // Left
                x = -TANK_SIZE
                y = Math.random() * (BOARD_HEIGHT - 100) + 50
                break
        }

        const angle = Math.random() * Math.PI * 2

        return {
            id: `enemy_${Date.now()}_${Math.random()}`,
            x,
            y,
            bodyAngle: angle,
            turretAngle: angle,
            health: 80 + Math.floor(gameState.wave * 15),
            maxHealth: 80 + Math.floor(gameState.wave * 15),
            lastShot: 0,
            speed: ENEMY_SPEED + Math.random() * 0.8
        }
    }, [gameState.wave])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameAreaRef.current || gameState.gameOver || gameState.paused) return

        const rect = gameAreaRef.current.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }, [gameState.gameOver, gameState.paused])

    const handleMouseClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState.gameOver || gameState.paused) return
        e.preventDefault()

        const currentTime = Date.now()
        if (currentTime - gameState.playerTank.lastShot > SHOT_COOLDOWN) {
            setGameState(prev => {
                const newBullet = createBullet(prev.playerTank, mousePos.x, mousePos.y, 'player')
                return {
                    ...prev,
                    bullets: [...prev.bullets, newBullet],
                    playerTank: { ...prev.playerTank, lastShot: currentTime }
                }
            })
        }
    }, [gameState.gameOver, gameState.paused, gameState.playerTank.lastShot, mousePos])

    const handleRightClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (gameState.gameOver || gameState.paused) return;

        const now = Date.now();
        if (now - lastRocketTime >= ROCKET_COOLDOWN) {
            setGameState((prev: any) => {
                const newRocket = createRocket(prev.playerTank, mousePos.x, mousePos.y);

                return {
                    ...prev,
                    rockets: [...prev.rockets, newRocket],
                    playerTank: { ...prev.playerTank },
                };
            });

            setLastRocketTime(now);
            setRocketReady(false);
        }
    }, [gameState.gameOver, gameState.paused, lastRocketTime, mousePos]);



    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState.gameOver || gameState.paused) return

        const key = e.key.toLowerCase()
        setKeys(prev => new Set(prev).add(key))

        if (key === ' ') {
            e.preventDefault()
        }
    }, [gameState.gameOver, gameState.paused])

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        const key = e.key.toLowerCase()
        setKeys(prev => {
            const newKeys = new Set(prev)
            newKeys.delete(key)
            return newKeys
        })

        if (key === ' ') {
            e.preventDefault()
            setGameState(prev => ({ ...prev, paused: !prev.paused }))
        }
    }, [])

    const createBullet = useCallback((tank: Tank, targetX: number, targetY: number, owner: 'player' | 'enemy'): Bullet => {
        // Calculate barrel tip position
        const barrelLength = TANK_SIZE * 0.5
        const barrelTipX = tank.x + Math.cos(tank.turretAngle) * barrelLength
        const barrelTipY = tank.y + Math.sin(tank.turretAngle) * barrelLength

        const dx = targetX - barrelTipX
        const dy = targetY - barrelTipY
        const distance = Math.sqrt(dx * dx + dy * dy)

        return {
            id: `bullet_${Date.now()}_${Math.random()}`,
            x: barrelTipX,
            y: barrelTipY,
            vx: owner === 'player' ? (dx / distance) * BULLET_SPEED * level : (dx / distance) * BULLET_SPEED,
            vy: owner === 'player' ? (dy / distance) * BULLET_SPEED * level : (dy / distance) * BULLET_SPEED,
            owner,
            damage: owner === 'player' ? BULLET_DAMAGE * level : BULLET_DAMAGE,
            trail: []
        }
    }, [])

    const createRocket = useCallback((tank: Tank, targetX: number, targetY: number): Bullet => {
        const barrelLength = TANK_SIZE * 0.5
        const barrelTipX = tank.x + Math.cos(tank.turretAngle) * barrelLength
        const barrelTipY = tank.y + Math.sin(tank.turretAngle) * barrelLength

        const dx = targetX - barrelTipX
        const dy = targetY - barrelTipY
        const distance = Math.sqrt(dx * dx + dy * dy)

        return {
            id: `rocket_${Date.now()}_${Math.random()}`,
            x: barrelTipX,
            y: barrelTipY,
            vx: (dx / distance) * ROCKET_SPEED * level,
            vy: (dy / distance) * ROCKET_SPEED * level,
            owner: 'player',
            damage: ROCKET_DAMAGE * level,
            trail: []
        }
    }, [])

    const createExplosion = useCallback((x: number, y: number): Explosion => ({
        id: `explosion_${Date.now()}_${Math.random()}`,
        x,
        y,
        size: 0,
        life: 50
    }), [])

    const updateGame = useCallback((currentTime: number) => {
        if (currentTime - lastTimeRef.current < 16) return // ~60 FPS
        lastTimeRef.current = currentTime

        setGameState(prevState => {
            if (prevState.gameOver || prevState.paused) return prevState

            let newState = { ...prevState }

            // Update player tank
            const playerTank = { ...newState.playerTank }

            // Player movement with body rotation
            let moved = false
            let newBodyAngle = playerTank.bodyAngle

            if (keys.has('w')) {
                const newX = playerTank.x + Math.cos(playerTank.bodyAngle) * playerTank.speed
                const newY = playerTank.y + Math.sin(playerTank.bodyAngle) * playerTank.speed
                if (newX >= TANK_SIZE / 2 && newX <= BOARD_WIDTH - TANK_SIZE / 2) playerTank.x = newX
                if (newY >= TANK_SIZE / 2 && newY <= BOARD_HEIGHT - TANK_SIZE / 2) playerTank.y = newY
                moved = true
            }
            if (keys.has('s')) {
                const newX = playerTank.x - Math.cos(playerTank.bodyAngle) * playerTank.speed
                const newY = playerTank.y - Math.sin(playerTank.bodyAngle) * playerTank.speed
                if (newX >= TANK_SIZE / 2 && newX <= BOARD_WIDTH - TANK_SIZE / 2) playerTank.x = newX
                if (newY >= TANK_SIZE / 2 && newY <= BOARD_HEIGHT - TANK_SIZE / 2) playerTank.y = newY
                moved = true
            }
            if (keys.has('a')) {
                newBodyAngle -= 0.08
                moved = true
            }
            if (keys.has('d')) {
                newBodyAngle += 0.08
                moved = true
            }

            if (moved) {
                playerTank.bodyAngle = newBodyAngle
            }

            // Turret rotation towards mouse (independent of body)
            const dx = mousePos.x - playerTank.x
            const dy = mousePos.y - playerTank.y
            playerTank.turretAngle = Math.atan2(dy, dx)

            newState.playerTank = playerTank

            // Update enemy tanks
            newState.enemyTanks = newState.enemyTanks.map(enemy => {
                const newEnemy = { ...enemy }

                // Move towards player
                const dx = playerTank.x - enemy.x
                const dy = playerTank.y - enemy.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 0) {
                    // Body rotation towards player
                    const targetBodyAngle = Math.atan2(dy, dx)
                    let angleDiff = targetBodyAngle - enemy.bodyAngle
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI
                    newEnemy.bodyAngle += angleDiff * 0.03

                    // Move forward
                    newEnemy.x += Math.cos(newEnemy.bodyAngle) * enemy.speed
                    newEnemy.y += Math.sin(newEnemy.bodyAngle) * enemy.speed

                    // Turret tracks player
                    newEnemy.turretAngle = Math.atan2(dy, dx)
                }

                // Enemy shooting
                if (distance < 450 && currentTime - enemy.lastShot > ENEMY_SHOT_COOLDOWN) {
                    newState.bullets.push(createBullet(enemy, playerTank.x, playerTank.y, 'enemy'))
                    newEnemy.lastShot = currentTime
                }

                return newEnemy
            }).filter(enemy => enemy.health > 0)

            // Spawn new enemies
            const maxEnemies = Math.min(2 + Math.floor(newState.wave / 3), 8)
            if (newState.enemyTanks.length < maxEnemies && Math.random() < 0.012) {
                newState.enemyTanks.push(generateEnemyTank())
            }

            // Update bullets with trails
            newState.bullets = newState.bullets.map(bullet => {
                const newBullet = {
                    ...bullet,
                    x: bullet.x + bullet.vx,
                    y: bullet.y + bullet.vy,
                    trail: [...bullet.trail, { x: bullet.x, y: bullet.y }].slice(-8) // Keep last 8 positions
                }
                return newBullet
            }).filter(bullet =>
                bullet.x > -50 && bullet.x < BOARD_WIDTH + 50 &&
                bullet.y > -50 && bullet.y < BOARD_HEIGHT + 50
            )

            // Update rockets with trails
            newState.rockets = newState.rockets.map(rocket => {
                const newRockets = {
                    ...rocket,
                    x: rocket.x + rocket.vx,
                    y: rocket.y + rocket.vy,
                    trail: [...rocket.trail, { x: rocket.x, y: rocket.y }].slice(-8) // Keep last 8 positions
                }
                return newRockets
            }).filter(rocket =>
                rocket.x > -50 && rocket.x < BOARD_WIDTH + 50 &&
                rocket.y > -50 && rocket.y < BOARD_HEIGHT + 50
            )

            // Update explosions
            newState.explosions = newState.explosions.map(explosion => ({
                ...explosion,
                size: Math.min(explosion.size + 4, 120),
                life: explosion.life - 1
            })).filter(explosion => explosion.life > 0)

            // Collision detection
            const bulletsToRemove = new Set<string>()
            const rocketsToRemove = new Set<string>()
            const tanksToRemove = new Set<string>()

            newState.bullets.forEach(bullet => {
                // Bullet vs player tank
                if (bullet.owner === 'enemy') {
                    const dx = bullet.x - playerTank.x
                    const dy = bullet.y - playerTank.y
                    if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE / 2 + BULLET_SIZE) {
                        bulletsToRemove.add(bullet.id)
                        newState.playerTank.health -= bullet.damage
                        newState.explosions.push(createExplosion(bullet.x, bullet.y))

                        if (newState.playerTank.health <= 0) {
                            newState.gameOver = true
                        }
                    }
                }

                // Bullet vs enemy tanks
                if (bullet.owner === 'player') {
                    newState.enemyTanks.forEach(enemy => {
                        const dx = bullet.x - enemy.x;
                        const dy = bullet.y - enemy.y;

                        // Check collision distance
                        if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE / 2 + BULLET_SIZE) {
                            bulletsToRemove.add(bullet.id);
                            enemy.health -= bullet.damage;

                            // Explosion effect
                            if (bullet.damage >= ROCKET_DAMAGE) {
                                newState.explosions.push(createExplosion(enemy.x, enemy.y));
                                newState.explosions.push(createExplosion(enemy.x + 30, enemy.y + 30));
                                newState.explosions.push(createExplosion(enemy.x - 30, enemy.y - 30));
                            } else {
                                newState.explosions.push(createExplosion(bullet.x, bullet.y));
                            }

                            // Enemy death
                            if (enemy.health <= 0) {
                                tanksToRemove.add(enemy.id);
                                newState.score += 200 + (newState.wave * 50);
                                newState.enemiesKilled += 1;
                                newState.explosions.push(createExplosion(enemy.x, enemy.y));

                                // Wave progression
                                if (newState.enemiesKilled >= newState.wave * 5) {
                                    newState.wave += 1;
                                    newState.enemiesKilled = 0;
                                }
                            }
                        }
                    });
                }
            });

            gameState.rockets.forEach(rocket => {
                newState.enemyTanks.forEach(enemy => {
                    const dx = rocket.x - enemy.x;
                    const dy = rocket.y - enemy.y;

                    // Check collision distance
                    if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE / 2 + BULLET_SIZE) {
                        rocketsToRemove.add(rocket.id);
                        enemy.health -= rocket.damage;

                        // Explosion effect
                        if (rocket.damage >= ROCKET_DAMAGE) {
                            newState.explosions.push(createExplosion(enemy.x, enemy.y));
                            newState.explosions.push(createExplosion(enemy.x + 30, enemy.y + 30));
                            newState.explosions.push(createExplosion(enemy.x - 30, enemy.y - 30));
                        } else {
                            newState.explosions.push(createExplosion(rocket.x, rocket.y));
                        }

                        // Enemy death
                        if (enemy.health <= 0) {
                            tanksToRemove.add(enemy.id);
                            newState.score += 200 + (newState.wave * 50);
                            newState.enemiesKilled += 1;
                            newState.explosions.push(createExplosion(enemy.x, enemy.y));

                            // Wave progression
                            if (newState.enemiesKilled >= newState.wave * 5) {
                                newState.wave += 1;
                                newState.enemiesKilled = 0;
                            }
                        }
                    }
                });
            });


            // Remove destroyed bullets and tanks
            newState.bullets = newState.bullets.filter(bullet => !bulletsToRemove.has(bullet.id))
            newState.rockets = newState.rockets.filter(rocket => !bulletsToRemove.has(rocket.id))
            newState.enemyTanks = newState.enemyTanks.filter(tank => !tanksToRemove.has(tank.id))
            setKillCount(prev => prev + tanksToRemove.size);

            // Tank vs tank collision
            newState.enemyTanks.forEach(enemy => {
                const dx = enemy.x - playerTank.x
                const dy = enemy.y - playerTank.y
                if (Math.sqrt(dx * dx + dy * dy) < TANK_SIZE - 8) {
                    newState.playerTank.health -= 0.5
                    if (Math.random() < 0.08) {
                        newState.explosions.push(createExplosion(enemy.x + Math.random() * 20 - 10, enemy.y + Math.random() * 20 - 10))
                    }
                }
            })

            return newState
        })
    }, [keys, mousePos, createBullet, createRocket, createExplosion, generateEnemyTank])

    useEffect(() => {
        if (!killCount) return;
        setLevel(prev => prev + 0.2);
    }, [killCount]);

    const gameLoop = useCallback((currentTime: number) => {
        updateGame(currentTime)
        gameLoopRef.current = requestAnimationFrame(gameLoop)
    }, [updateGame])

    const togglePause = () => {
        setGameState(prev => ({ ...prev, paused: !prev.paused }))
    }

    const resetGame = () => {
        setGameState({
            playerTank: {
                id: 'player',
                x: BOARD_WIDTH / 2,
                y: BOARD_HEIGHT - 120,
                bodyAngle: 0,
                turretAngle: 0,
                health: 100,
                maxHealth: 100,
                lastShot: 0,
                speed: PLAYER_SPEED
            },
            enemyTanks: [],
            bullets: [],
            rockets: [],
            explosions: [],
            gameOver: false,
            paused: false,
            score: 0,
            wave: 1,
            enemiesKilled: 0
        })
        setKeys(new Set())
        setLevel(1)
        setKillCount(0);
    }

    useEffect(() => {
        if (!rocketReady) {
            const interval = setInterval(() => {
                const now = Date.now()
                if (now - lastRocketTime >= ROCKET_COOLDOWN) {
                    setRocketReady(true)
                    clearInterval(interval)
                }
            }, 100)
            return () => clearInterval(interval)
        }
    }, [rocketReady, lastRocketTime])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

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
                <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse drop-shadow-2xl">
                    CYBER WARFARE
                </h1>
                <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-lg shadow-cyan-500/50"></div>
            </div>

            {/* Game Stats */}
            <GameStats gameState={gameState} level={level} killCount={killCount} lastRocketTime={lastRocketTime} rocketReady={rocketReady} />

            {/* Game Board */}
            <div className="relative">
                <div
                    ref={gameAreaRef}
                    className="relative bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 border-4 border-cyan-500/50 rounded-xl backdrop-blur-sm shadow-2xl shadow-cyan-500/30 cursor-crosshair overflow-hidden"
                    style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
                    onMouseMove={handleMouseMove}
                    onClick={handleMouseClick}
                    onContextMenu={handleRightClick}
                >
                    {/* Enhanced Grid background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Ambient lighting effects */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                    {/* Player Tank */}
                    <PlayerTank gameState={gameState} tankType={TANK_TYPES[Math.floor(level / 2) - 1]} />

                    {/* Enemy Tanks */}
                    {gameState.enemyTanks.map(tank => (
                        <EnemyTank tank={tank} />
                    ))}

                    {/* Enhanced Bullets with trails */}
                    {gameState.bullets.map(bullet => (
                        <div key={bullet.id}>
                            {/* Bullet trail */}
                            {bullet.trail.map((pos, index) => (
                                <div
                                    key={index}
                                    className={`absolute rounded-full ${bullet.owner === 'player'
                                        ? 'bg-cyan-400/30'
                                        : 'bg-red-400/30'
                                        }`}
                                    style={{
                                        left: pos.x - (BULLET_SIZE * (index + 1)) / bullet.trail.length / 2,
                                        top: pos.y - (BULLET_SIZE * (index + 1)) / bullet.trail.length / 2,
                                        width: (BULLET_SIZE * (index + 1)) / bullet.trail.length,
                                        height: (BULLET_SIZE * (index + 1)) / bullet.trail.length,
                                        opacity: (index + 1) / bullet.trail.length * 0.6,
                                        zIndex: 12
                                    }}
                                />
                            ))}

                            {/* Main bullet */}
                            <div
                                className={`absolute rounded-full shadow-lg border-2 ${bullet.owner === 'player'
                                    ? 'bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-600 shadow-cyan-400/70 border-cyan-100/80'
                                    : 'bg-gradient-to-r from-red-200 via-red-400 to-red-600 shadow-red-400/70 border-red-100/80'
                                    }`}
                                style={{
                                    left: bullet.x - BULLET_SIZE / 2,
                                    top: bullet.y - BULLET_SIZE / 2,
                                    width: BULLET_SIZE,
                                    height: BULLET_SIZE,
                                    zIndex: 15
                                }}
                            >
                                {/* Bullet core glow */}
                                <div className={`absolute inset-0.5 rounded-full ${bullet.owner === 'player' ? 'bg-cyan-200' : 'bg-red-200'
                                    }`}></div>

                                {/* Bullet outer glow */}
                                <div className={`absolute inset-0 rounded-full blur-sm ${bullet.owner === 'player' ? 'bg-cyan-400/60' : 'bg-red-400/60'
                                    }`}></div>
                            </div>
                        </div>
                    ))}

                    {gameState.rockets.map(rocket => (
                        <div key={rocket.id}>
                            {/* 🚀 Rocket Trail */}
                            {rocket.trail.map((pos, index) => (
                                <div
                                    key={index}
                                    className="absolute rounded-full bg-orange-400/30"
                                    style={{
                                        left: pos.x - (BULLET_SIZE * (index + 1)) / rocket.trail.length / 1.8,
                                        top: pos.y - (BULLET_SIZE * (index + 1)) / rocket.trail.length / 1.8,
                                        width: (BULLET_SIZE * (index + 1)) / rocket.trail.length * 1.2,
                                        height: (BULLET_SIZE * (index + 1)) / rocket.trail.length * 1.2,
                                        opacity: (index + 1) / rocket.trail.length * 0.6,
                                        zIndex: 12,
                                        transform: `rotate(${rocket.angle}rad)`
                                    }}
                                />
                            ))}

                            {/* 🚀 Rocket Body */}
                            <div
                                className="absolute rounded-full shadow-lg border-2 bg-gradient-to-r from-orange-200 via-orange-500 to-red-600 shadow-orange-500/70 border-orange-100/80"
                                style={{
                                    left: rocket.x - BULLET_SIZE * 0.6,
                                    top: rocket.y - BULLET_SIZE * 0.3,
                                    width: BULLET_SIZE * 1.3,
                                    height: BULLET_SIZE * 1.3,
                                    transform: `rotate(${rocket.angle}rad)`,
                                    borderRadius: '9999px',
                                    zIndex: 15
                                }}
                            >
                                {/* Inner glow */}
                                <div className="absolute inset-0.5 rounded-full bg-orange-200"></div>
                                {/* Outer glow */}
                                <div className="absolute inset-0 rounded-full blur-sm bg-orange-500/60"></div>
                            </div>

                            {/* 🔥 Rocket Flame */}
                            <div
                                className="absolute rounded-full bg-yellow-400 blur-md opacity-70"
                                style={{
                                    left: rocket.x - Math.cos(rocket.angle) * 15 - 6,
                                    top: rocket.y - Math.sin(rocket.angle) * 15 - 6,
                                    width: 12,
                                    height: 12,
                                    zIndex: 10
                                }}
                            />
                        </div>
                    ))}

                    {/* Enhanced Explosions */}
                    {gameState.explosions.map(explosion => (
                        <div
                            key={explosion.id}
                            className="absolute rounded-full"
                            style={{
                                left: explosion.x - explosion.size / 2,
                                top: explosion.y - explosion.size / 2,
                                width: explosion.size,
                                height: explosion.size,
                                background: `radial-gradient(circle, 
                  rgba(255,255,255,${explosion.life / 50}) 0%, 
                  rgba(255,220,0,${explosion.life / 50}) 15%, 
                  rgba(255,140,0,${explosion.life / 50}) 35%, 
                  rgba(255,60,0,${explosion.life / 50}) 55%, 
                  rgba(255,0,0,${explosion.life / 50}) 75%, 
                  transparent 100%)`,
                                opacity: explosion.life / 50,
                                zIndex: 20,
                                boxShadow: `0 0 ${explosion.size * 1.5}px rgba(255,140,0,${explosion.life / 100})`
                            }}
                        />
                    ))}

                    {/* Enhanced Crosshair */}
                    <div
                        className="absolute w-10 h-10 border-2 border-yellow-400/90 pointer-events-none shadow-lg shadow-yellow-400/50"
                        style={{
                            left: mousePos.x - 20,
                            top: mousePos.y - 20,
                            zIndex: 25
                        }}
                    >
                        <div className="absolute inset-2 border border-yellow-300/70"></div>
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-yellow-400/70"></div>

                        {/* Crosshair lines */}
                        <div className="absolute top-1/2 left-0 w-2 h-0.5 bg-yellow-400 transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-0 w-2 h-0.5 bg-yellow-400 transform -translate-y-1/2"></div>
                        <div className="absolute left-1/2 top-0 w-0.5 h-2 bg-yellow-400 transform -translate-x-1/2"></div>
                        <div className="absolute left-1/2 bottom-0 w-0.5 h-2 bg-yellow-400 transform -translate-x-1/2"></div>
                    </div>

                    {/* Game Over Overlay */}
                    {gameState.gameOver && (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md">
                            <div className="text-center">
                                <div className="text-8xl font-bold text-red-500 mb-6 animate-pulse drop-shadow-2xl">DESTROYED</div>
                                <div className="text-3xl text-white mb-3 drop-shadow-lg">Final Score: {gameState.score}</div>
                                <div className="text-xl text-gray-300 mb-6">Wave Reached: {gameState.wave}</div>
                                <button
                                    onClick={resetGame}
                                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-red-500/40 border border-red-400/50"
                                >
                                    <RotateCcw className="w-6 h-6 inline mr-3" />
                                    RESTART MISSION
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pause Overlay */}
                    {gameState.paused && !gameState.gameOver && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-md">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-yellow-400 mb-6 animate-pulse drop-shadow-2xl">MISSION PAUSED</div>
                                <div className="text-xl text-white">Press SPACE to continue</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex gap-4">
                <button
                    onClick={togglePause}
                    disabled={gameState.gameOver}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-yellow-500/40 border border-yellow-400/50"
                >
                    {gameState.paused ? (
                        <>
                            <Play className="w-6 h-6 inline mr-3" />
                            RESUME
                        </>
                    ) : (
                        <>
                            <Pause className="w-6 h-6 inline mr-3" />
                            PAUSE
                        </>
                    )}
                </button>

                <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-red-500/40 border border-red-400/50"
                >
                    <RotateCcw className="w-6 h-6 inline mr-3" />
                    RESTART
                </button>
            </div>

            {/* Enhanced Instructions */}
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-gray-500/50 rounded-xl p-6 backdrop-blur-sm max-w-4xl text-center shadow-lg shadow-gray-500/20">
                <div className="text-gray-300 text-sm space-y-3">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold mb-4 text-lg">
                        <Target className="w-5 h-5" />
                        ADVANCED COMBAT CONTROLS
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-left">
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-mono text-lg font-bold">W / S</div>
                            <div className="text-gray-300">Move tank forward/backward</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-mono text-lg font-bold">A / D</div>
                            <div className="text-gray-300">Rotate tank body left/right</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-mono text-lg font-bold">MOUSE MOVE</div>
                            <div className="text-gray-300">Aim turret independently</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-mono text-lg font-bold">LEFT CLICK</div>
                            <div className="text-gray-300">Fire main cannon</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-mono text-lg font-bold">SPACE</div>
                            <div className="text-gray-300">Pause/Resume mission</div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-600 mt-6 space-y-2">
                        <div className="text-red-400 font-bold">⚡ REALISTIC TANK MECHANICS ⚡</div>
                        <div>Tank body and turret move <span className="text-cyan-400 font-bold">independently</span></div>
                        <div>Use <span className="text-cyan-400 font-bold">WASD</span> to drive, <span className="text-cyan-400 font-bold">mouse</span> to aim</div>
                        <div>Eliminate enemies while managing movement and aiming separately</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TankGame