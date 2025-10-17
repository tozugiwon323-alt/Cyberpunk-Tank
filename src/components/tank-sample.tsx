
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import BulletPanel from './Bullet'
import ExplosionPanel from './explosion'
import InstructionPanel from './InstructionPanel'
import GameArena from './GameArena'
import GameControl from './GameControl'
import PlayerStatus from './PlayerStatus'
import ActivePowerUps from './ActivePowerUps'
import { Gauge, Heart, Rocket, Shield, Star, Target, Zap } from 'lucide-react'

interface Position {
    x: number
    y: number
}

interface Tank {
    id: string
    x: number
    y: number
    bodyAngle: number
    turretAngle: number
    health: number
    maxHealth: number
    lastShot: number
    lastRocket: number
    speed: number
    isMoving: boolean
    level: number
    experience: number
    experienceToNext: number
    type: string
    damage: number
    rocketDamage: number
    shotCooldown: number
    rocketCooldown: number
}

interface BulletPanel {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    owner: 'player' | 'enemy'
    damage: number
    trail: Position[]
    type: 'bullet' | 'rocket'
    active: boolean
}

interface ExplosionPanel {
    id: string
    x: number
    y: number
    size: number
    life: number
    maxLife: number
    type: 'normal' | 'rocket' | 'upgrade'
    active: boolean
}

interface FloatingText {
    id: string
    x: number
    y: number
    text: string
    life: number
    maxLife: number
    color: string
    fontSize: number
    active: boolean
}

interface SmokeParticle {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    active: boolean
}

interface UpgradeParticle {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    color: string
    active: boolean
}

interface GameItem {
    id: string
    x: number
    y: number
    type: 'health' | 'damage' | 'speed' | 'experience' | 'rocket' | 'shield' | 'multishot' | string
    life: number
    maxLife: number
    pulsePhase: number
    collected: boolean
}

interface GameState {
    playerTank: Tank
    enemyTanks: Tank[]
    bullets: BulletPanel[]
    explosions: ExplosionPanel[]
    floatingTexts: FloatingText[]
    smokeParticles: SmokeParticle[]
    upgradeParticles: UpgradeParticle[]
    gameItems: GameItem[]
    gameOver: boolean
    paused: boolean
    score: number
    wave: number
    enemiesKilled: number
    totalKills: number
    isUpgrading: boolean
    upgradeAnimation: number
    itemsCollected: number
    activePowerUps: {
        shield: number
        multishot: number
        damageBoost: number
        speedBoost: number
    }
}

const TANK_TYPES = [
    { name: 'cyan', color: 'from-cyan-300 to-cyan-600', glow: 'cyan-400', level: 1, speedBonus: 0, damageBonus: 0, healthBonus: 0 },
    { name: 'desert', color: 'from-yellow-300 to-orange-600', glow: 'orange-400', level: 2, speedBonus: 0.2, damageBonus: 5, healthBonus: 20 },
    { name: 'frost', color: 'from-blue-200 to-blue-600', glow: 'blue-400', level: 3, speedBonus: 0.4, damageBonus: 10, healthBonus: 40 },
    { name: 'jungle', color: 'from-green-300 to-green-700', glow: 'green-400', level: 4, speedBonus: 0.6, damageBonus: 15, healthBonus: 60 },
    { name: 'storm', color: 'from-purple-300 to-purple-700', glow: 'purple-400', level: 5, speedBonus: 0.8, damageBonus: 20, healthBonus: 80 },
    { name: 'toxic', color: 'from-lime-300 to-green-600', glow: 'lime-400', level: 6, speedBonus: 1.0, damageBonus: 25, healthBonus: 100 },
    { name: 'inferno', color: 'from-red-300 to-red-700', glow: 'red-400', level: 7, speedBonus: 1.2, damageBonus: 30, healthBonus: 120 },
    { name: 'magma', color: 'from-orange-300 to-red-800', glow: 'orange-500', level: 8, speedBonus: 1.4, damageBonus: 35, healthBonus: 140 },
    { name: 'heavy', color: 'from-gray-400 to-gray-800', glow: 'gray-500', level: 9, speedBonus: 1.0, damageBonus: 50, healthBonus: 200 },
    { name: 'cyber', color: 'from-cyan-200 to-purple-600', glow: 'cyan-300', level: 10, speedBonus: 2.0, damageBonus: 45, healthBonus: 160 },
    { name: 'electric', color: 'from-yellow-200 to-blue-600', glow: 'yellow-300', level: 11, speedBonus: 2.2, damageBonus: 50, healthBonus: 180 },
    { name: 'phantom', color: 'from-purple-200 to-black', glow: 'purple-300', level: 12, speedBonus: 2.5, damageBonus: 55, healthBonus: 200 },
    { name: 'cosmic', color: 'from-indigo-200 to-purple-800', glow: 'indigo-400', level: 13, speedBonus: 2.8, damageBonus: 60, healthBonus: 220 },
    { name: 'plasma', color: 'from-pink-200 to-purple-700', glow: 'pink-400', level: 14, speedBonus: 3.0, damageBonus: 65, healthBonus: 240 },
    { name: 'dragonsteel', color: 'from-red-200 to-yellow-600', glow: 'red-300', level: 15, speedBonus: 3.2, damageBonus: 70, healthBonus: 260 },
    { name: 'titan', color: 'from-gold to-yellow-600', glow: 'yellow-400', level: 16, speedBonus: 3.5, damageBonus: 80, healthBonus: 300 }
]

// Item types with their properties
export const ITEM_TYPES: Record<string, any> = {
    health: { color: 'from-green-400 to-green-600', glow: 'green-400', icon: Heart, name: 'Health Pack' },
    damage: { color: 'from-red-400 to-red-600', glow: 'red-400', icon: Zap, name: 'Damage Boost' },
    speed: { color: 'from-blue-400 to-blue-600', glow: 'blue-400', icon: Gauge, name: 'Speed Boost' },
    experience: { color: 'from-purple-400 to-purple-600', glow: 'purple-400', icon: Star, name: 'Experience Orb' },
    rocket: { color: 'from-orange-400 to-orange-600', glow: 'orange-400', icon: Rocket, name: 'Rocket Ammo' },
    shield: { color: 'from-cyan-400 to-cyan-600', glow: 'cyan-400', icon: Shield, name: 'Energy Shield' },
    multishot: { color: 'from-yellow-400 to-yellow-600', glow: 'yellow-400', icon: Target, name: 'Multi-Shot' }
}

export const BOARD_WIDTH = window.innerWidth
export const BOARD_HEIGHT = window.innerHeight
export const TANK_SIZE = 70
export const BULLET_SIZE = 14
export const ROCKET_SIZE = 18
export const ITEM_SIZE = 40
export const BASE_BULLET_SPEED = 18
export const BASE_ROCKET_SPEED = 12
export const BASE_PLAYER_SPEED = 4
export const BASE_ENEMY_SPEED = 2.2
export const BASE_SHOT_COOLDOWN = 120
export const BASE_ROCKET_COOLDOWN = 4000
export const ENEMY_SHOT_COOLDOWN = 1500

// Object pools for performance
const bulletPool: BulletPanel[] = []
const explosionPool: ExplosionPanel[] = []
const textPool: FloatingText[] = []
const smokePool: SmokeParticle[] = []
const upgradePool: UpgradeParticle[] = []
const itemPool: GameItem[] = []

const TankGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        playerTank: {
            id: 'player',
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT - 150,
            bodyAngle: -Math.PI / 2,
            turretAngle: -Math.PI / 2,
            health: 120,
            maxHealth: 120,
            lastShot: 0,
            lastRocket: 0,
            speed: BASE_PLAYER_SPEED,
            isMoving: false,
            level: 1,
            experience: 0,
            experienceToNext: 100,
            type: 'cyan',
            damage: 40,
            rocketDamage: 80,
            shotCooldown: BASE_SHOT_COOLDOWN,
            rocketCooldown: BASE_ROCKET_COOLDOWN
        },
        enemyTanks: [],
        bullets: [],
        explosions: [],
        floatingTexts: [],
        smokeParticles: [],
        upgradeParticles: [],
        gameItems: [],
        gameOver: false,
        paused: false,
        score: 0,
        wave: 1,
        enemiesKilled: 0,
        totalKills: 0,
        isUpgrading: false,
        upgradeAnimation: 0,
        itemsCollected: 0,
        activePowerUps: {
            shield: 0,
            multishot: 0,
            damageBoost: 0,
            speedBoost: 0
        }
    })

    const [keys, setKeys] = useState<Set<string>>(new Set())
    const [mousePos, setMousePos] = useState<Position>({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 })
    const gameAreaRef = useRef<HTMLDivElement>(null)
    const gameLoopRef = useRef<number>()
    const lastTimeRef = useRef<number>(0)
    const frameCount = useRef<number>(0)
    const fpsRef = useRef<number>(60)

    // Performance optimization: Memoized tank type
    const currentTankType = useMemo(() => {
        return TANK_TYPES.find(type => type.level === gameState.playerTank.level) || TANK_TYPES[0]
    }, [gameState.playerTank.level])

    // Object pool management
    const getBullet = useCallback((): BulletPanel => {
        const bullet = bulletPool.find(b => !b.active)
        if (bullet) {
            bullet.active = true
            bullet.trail = []
            return bullet
        }
        return {
            id: `bullet_${Date.now()}_${Math.random()}`,
            x: 0, y: 0, vx: 0, vy: 0,
            owner: 'player',
            damage: 0,
            trail: [],
            type: 'bullet',
            active: true
        }
    }, [])

    const getExplosion = useCallback((): ExplosionPanel => {
        const explosion = explosionPool.find(e => !e.active)
        if (explosion) {
            explosion.active = true
            explosion.size = 0
            return explosion
        }
        return {
            id: `explosion_${Date.now()}_${Math.random()}`,
            x: 0, y: 0, size: 0, life: 0, maxLife: 60,
            type: 'normal',
            active: true
        }
    }, [])

    const getFloatingText = useCallback((): FloatingText => {
        const text = textPool.find(t => !t.active)
        if (text) {
            text.active = true
            return text
        }
        return {
            id: `text_${Date.now()}_${Math.random()}`,
            x: 0, y: 0, text: '', life: 0, maxLife: 60,
            color: '', fontSize: 18,
            active: true
        }
    }, [])

    const getSmokeParticle = useCallback((): SmokeParticle => {
        const smoke = smokePool.find(s => !s.active)
        if (smoke) {
            smoke.active = true
            return smoke
        }
        return {
            id: `smoke_${Date.now()}_${Math.random()}`,
            x: 0, y: 0, vx: 0, vy: 0,
            life: 0, maxLife: 40, size: 8,
            active: true
        }
    }, [])

    const getUpgradeParticle = useCallback((): UpgradeParticle => {
        const particle = upgradePool.find(p => !p.active)
        if (particle) {
            particle.active = true
            return particle
        }
        return {
            id: `upgrade_${Date.now()}_${Math.random()}`,
            x: 0, y: 0, vx: 0, vy: 0,
            life: 0, maxLife: 120, size: 4,
            color: 'gold', active: true
        }
    }, [])

    const getGameItem = useCallback((): GameItem => {
        const item = itemPool.find(i => i.collected)
        if (item) {
            item.collected = false
            item.life = 0
            item.pulsePhase = 0
            return item
        }
        return {
            id: `item_${Date.now()}_${Math.random()}`,
            x: 0, y: 0,
            type: 'health',
            life: 0, maxLife: 1800, // 30 seconds at 60fps
            pulsePhase: 0,
            collected: false
        }
    }, [])

    // Generate random items
    const generateRandomItem = useCallback((): GameItem => {
        const itemTypes: (keyof typeof ITEM_TYPES)[] = ['health', 'damage', 'speed', 'experience', 'rocket', 'shield', 'multishot']
        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)]

        const item = getGameItem()
        item.type = randomType
        item.x = Math.random() * (BOARD_WIDTH - 200) + 100
        item.y = Math.random() * (BOARD_HEIGHT - 200) + 100
        item.life = item.maxLife
        item.pulsePhase = Math.random() * Math.PI * 2

        return item
    }, [getGameItem])

    // Collect item function
    const collectItem = useCallback((item: GameItem) => {
        item.collected = true

        setGameState(prev => {
            const newState = { ...prev }
            newState.itemsCollected += 1

            // Create collection effect
            const explosion = getExplosion()
            explosion.x = item.x
            explosion.y = item.y
            explosion.type = 'upgrade'
            explosion.life = explosion.maxLife
            newState.explosions.push(explosion)

            // Item effects
            switch (item.type) {
                case 'health':
                    const healthGain = Math.min(50, newState.playerTank.maxHealth - newState.playerTank.health)
                    newState.playerTank.health = Math.min(newState.playerTank.maxHealth, newState.playerTank.health + 50)

                    const healthText = getFloatingText()
                    healthText.x = item.x
                    healthText.y = item.y
                    healthText.text = `+${healthGain} HEALTH`
                    healthText.color = '#22ff22'
                    healthText.life = healthText.maxLife
                    healthText.fontSize = 20
                    newState.floatingTexts.push(healthText)
                    break

                case 'damage':
                    newState.activePowerUps.damageBoost = 600 // 10 seconds

                    const damageText = getFloatingText()
                    damageText.x = item.x
                    damageText.y = item.y
                    damageText.text = 'DAMAGE BOOST!'
                    damageText.color = '#ff4444'
                    damageText.life = damageText.maxLife
                    damageText.fontSize = 22
                    newState.floatingTexts.push(damageText)
                    break

                case 'speed':
                    newState.activePowerUps.speedBoost = 600 // 10 seconds

                    const speedText = getFloatingText()
                    speedText.x = item.x
                    speedText.y = item.y
                    speedText.text = 'SPEED BOOST!'
                    speedText.color = '#4444ff'
                    speedText.life = speedText.maxLife
                    speedText.fontSize = 22
                    newState.floatingTexts.push(speedText)
                    break

                case 'experience':
                    const expGain = 50 + (newState.wave * 10)
                    newState.playerTank = levelUpTank(newState.playerTank, expGain)

                    const expText = getFloatingText()
                    expText.x = item.x
                    expText.y = item.y
                    expText.text = `+${expGain} EXP`
                    expText.color = '#aa44ff'
                    expText.life = expText.maxLife
                    expText.fontSize = 24
                    newState.floatingTexts.push(expText)
                    break

                case 'rocket':
                    newState.playerTank.lastRocket = Math.max(0, newState.playerTank.lastRocket - newState.playerTank.rocketCooldown)

                    const rocketText = getFloatingText()
                    rocketText.x = item.x
                    rocketText.y = item.y
                    rocketText.text = 'ROCKET READY!'
                    rocketText.color = '#ff8800'
                    rocketText.life = rocketText.maxLife
                    rocketText.fontSize = 20
                    newState.floatingTexts.push(rocketText)
                    break

                case 'shield':
                    newState.activePowerUps.shield = 900 // 15 seconds

                    const shieldText = getFloatingText()
                    shieldText.x = item.x
                    shieldText.y = item.y
                    shieldText.text = 'SHIELD ACTIVE!'
                    shieldText.color = '#00ffff'
                    shieldText.life = shieldText.maxLife
                    shieldText.fontSize = 22
                    newState.floatingTexts.push(shieldText)
                    break

                case 'multishot':
                    newState.activePowerUps.multishot = 480 // 8 seconds

                    const multishotText = getFloatingText()
                    multishotText.x = item.x
                    multishotText.y = item.y
                    multishotText.text = 'MULTI-SHOT!'
                    multishotText.color = '#ffff00'
                    multishotText.life = multishotText.maxLife
                    multishotText.fontSize = 22
                    newState.floatingTexts.push(multishotText)
                    break
            }

            // Create collection particles
            for (let i = 0; i < 15; i++) {
                const particle = getUpgradeParticle()
                particle.x = item.x + (Math.random() - 0.5) * 60
                particle.y = item.y + (Math.random() - 0.5) * 60
                particle.vx = (Math.random() - 0.5) * 6
                particle.vy = (Math.random() - 0.5) * 6
                particle.life = particle.maxLife
                particle.size = 3 + Math.random() * 6
                particle.color = ITEM_TYPES[item.type].glow
                newState.upgradeParticles.push(particle)
            }

            return newState
        })
    }, [getExplosion, getFloatingText, getUpgradeParticle])

    // Tank level up system
    const levelUpTank = useCallback((tank: Tank, experience: number) => {
        const newTank = { ...tank }
        newTank.experience += experience

        if (newTank.experience >= newTank.experienceToNext && newTank.level < TANK_TYPES.length) {
            const oldLevel = newTank.level
            newTank.level += 1
            newTank.experience = 0
            newTank.experienceToNext = Math.floor(100 * Math.pow(1.5, newTank.level - 1))

            const newType = TANK_TYPES.find(type => type.level === newTank.level)
            if (newType) {
                newTank.type = newType.name
                newTank.speed = BASE_PLAYER_SPEED + newType.speedBonus
                newTank.damage = 40 + newType.damageBonus
                newTank.rocketDamage = 80 + newType.damageBonus * 2
                newTank.maxHealth = 120 + newType.healthBonus
                newTank.health = Math.min(newTank.health + 50, newTank.maxHealth) // Heal on level up
                newTank.shotCooldown = Math.max(60, BASE_SHOT_COOLDOWN - (newTank.level * 5))
                newTank.rocketCooldown = Math.max(2000, BASE_ROCKET_COOLDOWN - (newTank.level * 100))

                // Trigger upgrade animation
                setGameState(prev => ({
                    ...prev,
                    isUpgrading: true,
                    upgradeAnimation: 120,
                    playerTank: newTank
                }))

                // Create upgrade particles
                for (let i = 0; i < 30; i++) {
                    const particle = getUpgradeParticle()
                    particle.x = newTank.x + (Math.random() - 0.5) * 100
                    particle.y = newTank.y + (Math.random() - 0.5) * 100
                    particle.vx = (Math.random() - 0.5) * 8
                    particle.vy = (Math.random() - 0.5) * 8
                    particle.life = particle.maxLife
                    particle.size = 4 + Math.random() * 8
                    particle.color = newType.glow
                }

                // Create level up text
                const levelText = getFloatingText()
                levelText.x = newTank.x
                levelText.y = newTank.y - 60
                levelText.text = `LEVEL ${newTank.level}!`
                levelText.life = levelText.maxLife
                levelText.color = '#ffff00'
                levelText.fontSize = 28

                const typeText = getFloatingText()
                typeText.x = newTank.x
                typeText.y = newTank.y - 90
                typeText.text = newType.name.toUpperCase()
                typeText.life = typeText.maxLife
                typeText.color = `#${newType.glow.replace('-400', '')}`
                typeText.fontSize = 24

                return newTank
            }
        }

        return newTank
    }, [getUpgradeParticle, getFloatingText])

    const generateEnemyTank = useCallback((): Tank => {
        const side = Math.floor(Math.random() * 4)
        let x, y

        switch (side) {
            case 0: // Top
                x = Math.random() * (BOARD_WIDTH - 200) + 100
                y = -TANK_SIZE
                break
            case 1: // Right
                x = BOARD_WIDTH + TANK_SIZE
                y = Math.random() * (BOARD_HEIGHT - 200) + 100
                break
            case 2: // Bottom
                x = Math.random() * (BOARD_WIDTH - 200) + 100
                y = BOARD_HEIGHT + TANK_SIZE
                break
            default: // Left
                x = -TANK_SIZE
                y = Math.random() * (BOARD_HEIGHT - 200) + 100
                break
        }

        const angle = Math.random() * Math.PI * 2
        const enemyLevel = Math.min(Math.floor(gameState.wave / 3) + 1, 8)
        const enemyType = TANK_TYPES[Math.min(enemyLevel - 1, TANK_TYPES.length - 1)]

        return {
            id: `enemy_${Date.now()}_${Math.random()}`,
            x, y,
            bodyAngle: angle,
            turretAngle: angle,
            health: 80 + (enemyLevel * 20),
            maxHealth: 80 + (enemyLevel * 20),
            lastShot: 0,
            lastRocket: 0,
            speed: BASE_ENEMY_SPEED + (enemyLevel * 0.2),
            isMoving: false,
            level: enemyLevel,
            experience: 0,
            experienceToNext: 0,
            type: enemyType.name,
            damage: 30 + (enemyLevel * 5),
            rocketDamage: 60 + (enemyLevel * 10),
            shotCooldown: ENEMY_SHOT_COOLDOWN,
            rocketCooldown: 8000
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

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState.gameOver || gameState.paused) return
        e.preventDefault()

        const currentTime = Date.now()

        if (e.button === 0) { // Left click - bullet
            if (currentTime - gameState.playerTank.lastShot > gameState.playerTank.shotCooldown) {
                setGameState(prev => {
                    const newBullets: BulletPanel[] = []
                    const damageMultiplier = prev.activePowerUps.damageBoost > 0 ? 1.5 : 1
                    const isMultishot = prev.activePowerUps.multishot > 0

                    if (isMultishot) {
                        // Fire 3 bullets in a spread
                        for (let i = -1; i <= 1; i++) {
                            const bullet = getBullet()
                            const barrelLength = TANK_SIZE * 0.7
                            const barrelTipX = prev.playerTank.x + Math.cos(prev.playerTank.turretAngle) * barrelLength
                            const barrelTipY = prev.playerTank.y + Math.sin(prev.playerTank.turretAngle) * barrelLength

                            const angleOffset = i * 0.3 // 0.3 radians spread
                            const targetAngle = prev.playerTank.turretAngle + angleOffset

                            bullet.x = barrelTipX
                            bullet.y = barrelTipY
                            bullet.vx = Math.cos(targetAngle) * BASE_BULLET_SPEED
                            bullet.vy = Math.sin(targetAngle) * BASE_BULLET_SPEED
                            bullet.owner = 'player'
                            bullet.damage = Math.floor(prev.playerTank.damage * damageMultiplier)
                            bullet.type = 'bullet'

                            newBullets.push(bullet)
                        }
                    } else {
                        // Single bullet
                        const bullet = getBullet()
                        const barrelLength = TANK_SIZE * 0.7
                        const barrelTipX = prev.playerTank.x + Math.cos(prev.playerTank.turretAngle) * barrelLength
                        const barrelTipY = prev.playerTank.y + Math.sin(prev.playerTank.turretAngle) * barrelLength

                        const dx = mousePos.x - barrelTipX
                        const dy = mousePos.y - barrelTipY
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        bullet.x = barrelTipX
                        bullet.y = barrelTipY
                        bullet.vx = (dx / distance) * BASE_BULLET_SPEED
                        bullet.vy = (dy / distance) * BASE_BULLET_SPEED
                        bullet.owner = 'player'
                        bullet.damage = Math.floor(prev.playerTank.damage * damageMultiplier)
                        bullet.type = 'bullet'

                        newBullets.push(bullet)
                    }

                    return {
                        ...prev,
                        bullets: [...prev.bullets.filter(b => b.active), ...newBullets],
                        playerTank: { ...prev.playerTank, lastShot: currentTime }
                    }
                })
            }
        } else if (e.button === 2) { // Right click - rocket
            if (currentTime - gameState.playerTank.lastRocket > gameState.playerTank.rocketCooldown) {
                setGameState(prev => {
                    const rocket = getBullet()
                    const barrelLength = TANK_SIZE * 0.7
                    const barrelTipX = prev.playerTank.x + Math.cos(prev.playerTank.turretAngle) * barrelLength
                    const barrelTipY = prev.playerTank.y + Math.sin(prev.playerTank.turretAngle) * barrelLength

                    const dx = mousePos.x - barrelTipX
                    const dy = mousePos.y - barrelTipY
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    const damageMultiplier = prev.activePowerUps.damageBoost > 0 ? 1.5 : 1

                    rocket.x = barrelTipX
                    rocket.y = barrelTipY
                    rocket.vx = (dx / distance) * BASE_ROCKET_SPEED
                    rocket.vy = (dy / distance) * BASE_ROCKET_SPEED
                    rocket.owner = 'player'
                    rocket.damage = Math.floor(prev.playerTank.rocketDamage * damageMultiplier)
                    rocket.type = 'rocket'

                    return {
                        ...prev,
                        bullets: [...prev.bullets.filter(b => b.active), rocket],
                        playerTank: { ...prev.playerTank, lastRocket: currentTime }
                    }
                })
            }
        }
    }, [gameState.gameOver, gameState.paused, gameState.playerTank.lastShot, gameState.playerTank.lastRocket, mousePos, getBullet])

    const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
    }, [])

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

    // Optimized collision detection
    const checkCollision = useCallback((obj1: any, obj2: any, size1: number, size2: number): boolean => {
        const dx = obj1.x - obj2.x
        const dy = obj1.y - obj2.y
        const distance = dx * dx + dy * dy
        const minDistance = (size1 + size2) / 2
        return distance < minDistance * minDistance
    }, [])

    const updateGame = useCallback((currentTime: number) => {
        const deltaTime = currentTime - lastTimeRef.current
        if (deltaTime < 16) return // 60 FPS limit

        frameCount.current++
        if (frameCount.current % 60 === 0) {
            fpsRef.current = Math.round(1000 / deltaTime)
        }

        lastTimeRef.current = currentTime

        setGameState(prevState => {
            if (prevState.gameOver || prevState.paused) return prevState

            let newState = { ...prevState }

            // Update power-ups
            Object.keys(newState.activePowerUps).forEach(key => {
                if (newState.activePowerUps[key as keyof typeof newState.activePowerUps] > 0) {
                    newState.activePowerUps[key as keyof typeof newState.activePowerUps] -= 1
                }
            })

            // Update upgrade animation
            if (newState.isUpgrading) {
                newState.upgradeAnimation -= 1
                if (newState.upgradeAnimation <= 0) {
                    newState.isUpgrading = false
                }
            }

            // Update player tank
            const playerTank = { ...newState.playerTank }

            // Apply speed boost
            const speedMultiplier = newState.activePowerUps.speedBoost > 0 ? 1.5 : 1

            // Player movement
            let moved = false
            let newBodyAngle = playerTank.bodyAngle

            if (keys.has('w')) {
                const newX = playerTank.x + Math.cos(playerTank.bodyAngle) * playerTank.speed * speedMultiplier
                const newY = playerTank.y + Math.sin(playerTank.bodyAngle) * playerTank.speed * speedMultiplier
                if (newX >= TANK_SIZE / 2 && newX <= BOARD_WIDTH - TANK_SIZE / 2) playerTank.x = newX
                if (newY >= TANK_SIZE / 2 && newY <= BOARD_HEIGHT - TANK_SIZE / 2) playerTank.y = newY
                moved = true
            }
            if (keys.has('s')) {
                const newX = playerTank.x - Math.cos(playerTank.bodyAngle) * playerTank.speed * speedMultiplier
                const newY = playerTank.y - Math.sin(playerTank.bodyAngle) * playerTank.speed * speedMultiplier
                if (newX >= TANK_SIZE / 2 && newX <= BOARD_WIDTH - TANK_SIZE / 2) playerTank.x = newX
                if (newY >= TANK_SIZE / 2 && newY <= BOARD_HEIGHT - TANK_SIZE / 2) playerTank.y = newY
                moved = true
            }
            if (keys.has('a')) {
                newBodyAngle -= 0.05
                moved = true
            }
            if (keys.has('d')) {
                newBodyAngle += 0.05
                moved = true
            }

            playerTank.isMoving = moved
            if (moved) {
                playerTank.bodyAngle = newBodyAngle

                // Create smoke particles
                if (Math.random() < 0.3) {
                    const smoke = getSmokeParticle()
                    const exhaustX = playerTank.x - Math.cos(playerTank.bodyAngle) * TANK_SIZE * 0.4
                    const exhaustY = playerTank.y - Math.sin(playerTank.bodyAngle) * TANK_SIZE * 0.4
                    smoke.x = exhaustX + (Math.random() - 0.5) * 20
                    smoke.y = exhaustY + (Math.random() - 0.5) * 20
                    smoke.vx = (Math.random() - 0.5) * 2
                    smoke.vy = (Math.random() - 0.5) * 2 - 1
                    smoke.life = smoke.maxLife
                    smoke.size = 8 + Math.random() * 12
                    newState.smokeParticles.push(smoke)
                }
            }

            // Turret rotation
            const dx = mousePos.x - playerTank.x
            const dy = mousePos.y - playerTank.y
            playerTank.turretAngle = Math.atan2(dy, dx)

            newState.playerTank = playerTank

            // Spawn random items
            if (Math.random() < 0.002 && newState.gameItems.filter(item => !item.collected).length < 3) {
                newState.gameItems.push(generateRandomItem())
            }

            // Update items
            newState.gameItems = newState.gameItems.filter(item => {
                if (item.collected) return false

                item.life -= 1
                item.pulsePhase += 0.1

                // Check collection
                if (checkCollision(item, playerTank, ITEM_SIZE, TANK_SIZE)) {
                    collectItem(item)
                    return false
                }

                // Remove expired items
                if (item.life <= 0) {
                    return false
                }

                return true
            })

            // Update enemy tanks (optimized)
            newState.enemyTanks = newState.enemyTanks.map(enemy => {
                const newEnemy = { ...enemy }

                const dx = playerTank.x - enemy.x
                const dy = playerTank.y - enemy.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > 0) {
                    const targetBodyAngle = Math.atan2(dy, dx)
                    let angleDiff = targetBodyAngle - enemy.bodyAngle
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI
                    newEnemy.bodyAngle += angleDiff * 0.02

                    const oldX = newEnemy.x
                    const oldY = newEnemy.y
                    newEnemy.x += Math.cos(newEnemy.bodyAngle) * enemy.speed
                    newEnemy.y += Math.sin(newEnemy.bodyAngle) * enemy.speed

                    newEnemy.isMoving = Math.abs(newEnemy.x - oldX) > 0.1 || Math.abs(newEnemy.y - oldY) > 0.1

                    if (newEnemy.isMoving && Math.random() < 0.2) {
                        const smoke = getSmokeParticle()
                        const exhaustX = newEnemy.x - Math.cos(newEnemy.bodyAngle) * TANK_SIZE * 0.4
                        const exhaustY = newEnemy.y - Math.sin(newEnemy.bodyAngle) * TANK_SIZE * 0.4
                        smoke.x = exhaustX + (Math.random() - 0.5) * 20
                        smoke.y = exhaustY + (Math.random() - 0.5) * 20
                        smoke.vx = (Math.random() - 0.5) * 2
                        smoke.vy = (Math.random() - 0.5) * 2 - 1
                        smoke.life = smoke.maxLife
                        smoke.size = 8 + Math.random() * 12
                        newState.smokeParticles.push(smoke)
                    }

                    newEnemy.turretAngle = Math.atan2(dy, dx)
                }

                // Enemy shooting
                if (distance < 500 && currentTime - enemy.lastShot > enemy.shotCooldown) {
                    const bullet = getBullet()
                    const barrelLength = TANK_SIZE * 0.7
                    const barrelTipX = enemy.x + Math.cos(enemy.turretAngle) * barrelLength
                    const barrelTipY = enemy.y + Math.sin(enemy.turretAngle) * barrelLength

                    const dx = playerTank.x - barrelTipX
                    const dy = playerTank.y - barrelTipY
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    bullet.x = barrelTipX
                    bullet.y = barrelTipY
                    bullet.vx = (dx / distance) * BASE_BULLET_SPEED
                    bullet.vy = (dy / distance) * BASE_BULLET_SPEED
                    bullet.owner = 'enemy'
                    bullet.damage = enemy.damage
                    bullet.type = 'bullet'

                    newState.bullets.push(bullet)
                    newEnemy.lastShot = currentTime
                }

                return newEnemy
            }).filter(enemy => enemy.health > 0)

            // Spawn new enemies
            const maxEnemies = Math.min(3 + Math.floor(newState.wave / 2), 12)
            if (newState.enemyTanks.length < maxEnemies && Math.random() < 0.006) {
                newState.enemyTanks.push(generateEnemyTank())
            }

            // Update bullets with trails (optimized)
            newState.bullets = newState.bullets.filter(bullet => {
                if (!bullet.active) return false

                bullet.x += bullet.vx
                bullet.y += bullet.vy
                bullet.trail = [...bullet.trail, { x: bullet.x, y: bullet.y }].slice(-4) // Reduced trail length

                return bullet.x > -100 && bullet.x < BOARD_WIDTH + 100 &&
                    bullet.y > -100 && bullet.y < BOARD_HEIGHT + 100
            })

            // Update particles (optimized)
            newState.explosions = newState.explosions.filter(explosion => {
                if (!explosion.active) return false
                explosion.size = Math.min(explosion.size + (explosion.type === 'rocket' ? 8 : 5),
                    explosion.type === 'rocket' ? 200 : 120)
                explosion.life -= 1
                if (explosion.life <= 0) {
                    explosion.active = false
                    return false
                }
                return true
            })

            newState.floatingTexts = newState.floatingTexts.filter(text => {
                if (!text.active) return false
                text.y -= 2
                text.life -= 1
                if (text.life <= 0) {
                    text.active = false
                    return false
                }
                return true
            })

            newState.smokeParticles = newState.smokeParticles.filter(smoke => {
                if (!smoke.active) return false
                smoke.x += smoke.vx
                smoke.y += smoke.vy
                smoke.life -= 1
                smoke.size += 0.4
                if (smoke.life <= 0) {
                    smoke.active = false
                    return false
                }
                return true
            })

            newState.upgradeParticles = newState.upgradeParticles.filter(particle => {
                if (!particle.active) return false
                particle.x += particle.vx
                particle.y += particle.vy
                particle.life -= 1
                particle.size += 0.1
                particle.vx *= 0.98
                particle.vy *= 0.98
                if (particle.life <= 0) {
                    particle.active = false
                    return false
                }
                return true
            })

            // Optimized collision detection
            const bulletsToRemove = new Set<string>()
            const tanksToRemove = new Set<string>()

            newState.bullets.forEach(bullet => {
                if (!bullet.active) return

                // Bullet vs player tank
                if (bullet.owner === 'enemy') {
                    if (checkCollision(bullet, playerTank, bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE, TANK_SIZE)) {
                        bulletsToRemove.add(bullet.id)
                        bullet.active = false

                        // Apply shield protection
                        const actualDamage = newState.activePowerUps.shield > 0 ? Math.floor(bullet.damage * 0.3) : bullet.damage
                        newState.playerTank.health -= actualDamage

                        const explosion = getExplosion()
                        explosion.x = bullet.x
                        explosion.y = bullet.y
                        explosion.type = bullet.type === 'rocket' ? 'rocket' : 'normal'
                        explosion.life = explosion.maxLife
                        newState.explosions.push(explosion)

                        const text = getFloatingText()
                        text.x = bullet.x
                        text.y = bullet.y
                        text.text = newState.activePowerUps.shield > 0 ? `BLOCKED -${actualDamage}` : `-${actualDamage}`
                        text.color = newState.activePowerUps.shield > 0 ? '#00ffff' : '#ff4444'
                        text.life = text.maxLife
                        newState.floatingTexts.push(text)

                        if (newState.playerTank.health <= 0) {
                            newState.gameOver = true
                        }
                    }
                }

                // Bullet vs enemy tanks
                if (bullet.owner === 'player') {
                    newState.enemyTanks.forEach(enemy => {
                        if (checkCollision(bullet, enemy, bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE, TANK_SIZE)) {
                            bulletsToRemove.add(bullet.id)
                            bullet.active = false
                            enemy.health -= bullet.damage

                            const explosion = getExplosion()
                            explosion.x = bullet.x
                            explosion.y = bullet.y
                            explosion.type = bullet.type === 'rocket' ? 'rocket' : 'normal'
                            explosion.life = explosion.maxLife
                            newState.explosions.push(explosion)

                            const text = getFloatingText()
                            text.x = bullet.x
                            text.y = bullet.y
                            text.text = `-${bullet.damage}`
                            text.color = '#44ff44'
                            text.life = text.maxLife
                            newState.floatingTexts.push(text)

                            if (enemy.health <= 0) {
                                tanksToRemove.add(enemy.id)
                                const killScore = 300 + (newState.wave * 100) + (enemy.level * 50)
                                const expGain = 20 + (enemy.level * 10)
                                newState.score += killScore
                                newState.enemiesKilled += 1
                                newState.totalKills += 1

                                // Level up player tank
                                newState.playerTank = levelUpTank(newState.playerTank, expGain)

                                const scoreText = getFloatingText()
                                scoreText.x = enemy.x
                                scoreText.y = enemy.y - 30
                                scoreText.text = `+${killScore}`
                                scoreText.color = '#ffff44'
                                scoreText.life = scoreText.maxLife
                                newState.floatingTexts.push(scoreText)

                                const expText = getFloatingText()
                                expText.x = enemy.x
                                expText.y = enemy.y - 50
                                expText.text = `+${expGain} EXP`
                                expText.color = '#44ffff'
                                expText.life = expText.maxLife
                                newState.floatingTexts.push(expText)

                                const destroyText = getFloatingText()
                                destroyText.x = enemy.x
                                destroyText.y = enemy.y - 70
                                destroyText.text = 'DESTROYED!'
                                destroyText.color = '#ff4444'
                                destroyText.life = destroyText.maxLife
                                destroyText.fontSize = 24
                                newState.floatingTexts.push(destroyText)

                                const bigExplosion = getExplosion()
                                bigExplosion.x = enemy.x
                                bigExplosion.y = enemy.y
                                bigExplosion.type = 'rocket'
                                bigExplosion.life = bigExplosion.maxLife
                                newState.explosions.push(bigExplosion)

                                // Check for wave completion
                                if (newState.enemiesKilled >= newState.wave * 8) {
                                    newState.wave += 1
                                    newState.enemiesKilled = 0

                                    const waveText = getFloatingText()
                                    waveText.x = BOARD_WIDTH / 2
                                    waveText.y = 100
                                    waveText.text = `WAVE ${newState.wave}!`
                                    waveText.color = '#00ffff'
                                    waveText.life = waveText.maxLife
                                    waveText.fontSize = 32
                                    newState.floatingTexts.push(waveText)
                                }
                            }
                        }
                    })
                }
            })

            // Remove destroyed objects
            newState.bullets = newState.bullets.filter(bullet => !bulletsToRemove.has(bullet.id))
            newState.enemyTanks = newState.enemyTanks.filter(tank => !tanksToRemove.has(tank.id))

            // Tank collision
            newState.enemyTanks.forEach(enemy => {
                if (checkCollision(enemy, playerTank, TANK_SIZE, TANK_SIZE)) {
                    const damage = newState.activePowerUps.shield > 0 ? 0.06 : 0.2
                    newState.playerTank.health -= damage
                    if (Math.random() < 0.03) {
                        const explosion = getExplosion()
                        explosion.x = enemy.x + Math.random() * 30 - 15
                        explosion.y = enemy.y + Math.random() * 30 - 15
                        explosion.life = explosion.maxLife
                        newState.explosions.push(explosion)
                    }
                }
            })

            return newState
        })
    }, [keys, mousePos, checkCollision, getBullet, getExplosion, getFloatingText, getSmokeParticle, generateEnemyTank, levelUpTank, generateRandomItem, collectItem])

    const gameLoop = useCallback((currentTime: number) => {
        updateGame(currentTime)
        gameLoopRef.current = requestAnimationFrame(gameLoop)
    }, [updateGame])

    const togglePause = () => {
        setGameState(prev => ({ ...prev, paused: !prev.paused }))
    }

    const resetGame = () => {
        // Reset object pools
        bulletPool.forEach(b => b.active = false)
        explosionPool.forEach(e => e.active = false)
        textPool.forEach(t => t.active = false)
        smokePool.forEach(s => s.active = false)
        upgradePool.forEach(p => p.active = false)
        itemPool.forEach(i => i.collected = true)

        setGameState({
            playerTank: {
                id: 'player',
                x: BOARD_WIDTH / 2,
                y: BOARD_HEIGHT - 150,
                bodyAngle: -Math.PI / 2,
                turretAngle: -Math.PI / 2,
                health: 120,
                maxHealth: 120,
                lastShot: 0,
                lastRocket: 0,
                speed: BASE_PLAYER_SPEED,
                isMoving: false,
                level: 1,
                experience: 0,
                experienceToNext: 100,
                type: 'cyan',
                damage: 40,
                rocketDamage: 80,
                shotCooldown: BASE_SHOT_COOLDOWN,
                rocketCooldown: BASE_ROCKET_COOLDOWN
            },
            enemyTanks: [],
            bullets: [],
            explosions: [],
            floatingTexts: [],
            smokeParticles: [],
            upgradeParticles: [],
            gameItems: [],
            gameOver: false,
            paused: false,
            score: 0,
            wave: 1,
            enemiesKilled: 0,
            totalKills: 0,
            isUpgrading: false,
            upgradeAnimation: 0,
            itemsCollected: 0,
            activePowerUps: {
                shield: 0,
                multishot: 0,
                damageBoost: 0,
                speedBoost: 0
            }
        })
        setKeys(new Set())
    }

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
        <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950 to-orange-950 overflow-hidden">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,_69,_0,_0.4),_transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_140,_0,_0.4),_transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_rgba(255,_0,_0,_0.3),_transparent_50%)]"></div>

            {/* Performance indicator */}
            <div className="absolute top-4 right-4 text-green-400 text-sm font-mono bg-black/50 px-2 py-1 rounded">
                FPS: {fpsRef.current}
            </div>

            {/* Enhanced Grid overlay */}
            <div className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,69,0,0.2) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,69,0,0.2) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}>
            </div>
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Active Power-ups HUD - Top Right */}
            {(gameState.activePowerUps.shield > 0 || gameState.activePowerUps.multishot > 0 ||
                gameState.activePowerUps.damageBoost > 0 || gameState.activePowerUps.speedBoost > 0) && (
                    <ActivePowerUps gameState={gameState} />
                )}

            {/* Game Stats HUD - Top Center */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex gap-4 items-center">
                    <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-cyan-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-cyan-500/30">
                        <div className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Score</div>
                        <div className="text-xl font-bold text-white drop-shadow-lg">{gameState.score}</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-purple-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-purple-500/30">
                        <div className="text-purple-400 text-xs uppercase tracking-wider font-bold">Wave</div>
                        <div className="text-xl font-bold text-white drop-shadow-lg">{gameState.wave}</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-yellow-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-yellow-500/30">
                        <div className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Kills</div>
                        <div className="text-xl font-bold text-white drop-shadow-lg">{gameState.totalKills}</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-green-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-green-500/30">
                        <div className="text-green-400 text-xs uppercase tracking-wider font-bold">Items</div>
                        <div className="text-xl font-bold text-white drop-shadow-lg">{gameState.itemsCollected}</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-red-500/60 rounded-lg p-3 backdrop-blur-sm shadow-lg shadow-red-500/30">
                        <div className="text-red-400 text-xs uppercase tracking-wider font-bold">Enemies</div>
                        <div className="text-xl font-bold text-white drop-shadow-lg">{gameState.enemyTanks.length}</div>
                    </div>
                </div>
            </div>

            {/* Player Status HUD - Bottom Left */}
            <PlayerStatus gameState={gameState} currentTankType={currentTankType} />

            {/* Game Controls - Bottom Right */}
            <GameControl
                gameState={gameState}
                togglePause={togglePause}
                resetGame={resetGame}
            />

            {/* Main Game Area - Full Screen */}
            <GameArena
                gameState={gameState}
                gameAreaRef={gameAreaRef}
                mousePos={mousePos}
                currentTankType={currentTankType}
                handleMouseMove={handleMouseMove}
                handleMouseDown={handleMouseDown}
                handleContextMenu={handleContextMenu}
                resetGame={resetGame}
            />

            {/* Enhanced Instructions Panel - Bottom Center */}
            <InstructionPanel currentTankType={currentTankType} />
        </div>
    )
}

export default TankGame