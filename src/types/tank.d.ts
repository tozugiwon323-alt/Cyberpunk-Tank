export interface Position {
    x: number
    y: number
}

export interface Tank {
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

export interface Bullet {
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

export interface Explosion {
    id: string
    x: number
    y: number
    size: number
    life: number
    maxLife: number
    type: 'normal' | 'rocket' | 'upgrade'
    active: boolean
}

export interface FloatingText {
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

export interface SmokeParticle {
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

export interface UpgradeParticle {
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

export interface GameItem {
    id: string
    x: number
    y: number
    type: 'health' | 'damage' | 'speed' | 'experience' | 'rocket' | 'shield' | 'multishot' | string
    life: number
    maxLife: number
    pulsePhase: number
    collected: boolean
}

export interface GameState {
    playerTank: Tank
    enemyTanks: Tank[]
    bullets: Bullet[]
    explosions: Explosion[]
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