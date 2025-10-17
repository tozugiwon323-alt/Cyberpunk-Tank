import { BULLET_SIZE, ROCKET_SIZE } from "./tank-sample";

const BulletPanel = ({ bullet }: any) => {

    return (
        <div key={bullet.id}>
            {/* Bullet/Rocket trail */}
            {bullet.trail.map((pos: any, index: any) => (
                <div
                    key={index}
                    className={`absolute rounded-full ${bullet.type === 'rocket'
                        ? (bullet.owner === 'player' ? 'bg-orange-400/40' : 'bg-red-400/40')
                        : (bullet.owner === 'player' ? 'bg-cyan-400/30' : 'bg-red-400/30')
                        }`}
                    style={{
                        left: pos.x - (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) * (index + 1) / bullet.trail.length / 2,
                        top: pos.y - (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) * (index + 1) / bullet.trail.length / 2,
                        width: (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) * (index + 1) / bullet.trail.length,
                        height: (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) * (index + 1) / bullet.trail.length,
                        opacity: (index + 1) / bullet.trail.length * 0.8,
                        zIndex: 12
                    }}
                />
            ))}

            {/* Main bullet/rocket */}
            <div
                className={`absolute rounded-full shadow-2xl border-3 ${bullet.type === 'rocket'
                    ? (bullet.owner === 'player'
                        ? 'bg-gradient-to-r from-orange-200 via-orange-400 to-red-600 shadow-orange-400/80 border-orange-100/90'
                        : 'bg-gradient-to-r from-red-200 via-red-400 to-red-700 shadow-red-400/80 border-red-100/90')
                    : (bullet.owner === 'player'
                        ? 'bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-600 shadow-cyan-400/70 border-cyan-100/80'
                        : 'bg-gradient-to-r from-red-200 via-red-400 to-red-600 shadow-red-400/70 border-red-100/80')
                    }`}
                style={{
                    left: bullet.x - (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) / 2,
                    top: bullet.y - (bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE) / 2,
                    width: bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE,
                    height: bullet.type === 'rocket' ? ROCKET_SIZE : BULLET_SIZE,
                    zIndex: 15
                }}
            >
                {/* Bullet/Rocket core glow */}
                <div className={`absolute inset-1 rounded-full ${bullet.type === 'rocket'
                    ? (bullet.owner === 'player' ? 'bg-orange-100' : 'bg-red-100')
                    : (bullet.owner === 'player' ? 'bg-cyan-200' : 'bg-red-200')
                    }`}></div>

                {/* Enhanced outer glow */}
                <div className={`absolute inset-0 rounded-full blur-md ${bullet.type === 'rocket'
                    ? (bullet.owner === 'player' ? 'bg-orange-400/80' : 'bg-red-400/80')
                    : (bullet.owner === 'player' ? 'bg-cyan-400/60' : 'bg-red-400/60')
                    }`}></div>
            </div>
        </div>
    )
}

export default BulletPanel;