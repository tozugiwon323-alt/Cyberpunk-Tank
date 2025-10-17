const ExplosionPanel = ({ explosion }: any) => {
    return (
        <div
            key={explosion.id}
            className="absolute rounded-full"
            style={{
                left: explosion.x - explosion.size / 2,
                top: explosion.y - explosion.size / 2,
                width: explosion.size,
                height: explosion.size,
                background: explosion.type === 'rocket'
                    ? `radial-gradient(circle, 
    rgba(255,255,255,${explosion.life / explosion.maxLife}) 0%, 
    rgba(255,200,0,${explosion.life / explosion.maxLife}) 10%, 
    rgba(255,120,0,${explosion.life / explosion.maxLife}) 25%, 
    rgba(255,60,0,${explosion.life / explosion.maxLife}) 45%, 
    rgba(255,0,0,${explosion.life / explosion.maxLife}) 65%, 
    rgba(120,0,0,${explosion.life / explosion.maxLife}) 85%, 
    transparent 100%)`
                    : explosion.type === 'upgrade'
                        ? `radial-gradient(circle, 
    rgba(255,255,255,${explosion.life / explosion.maxLife}) 0%, 
    rgba(255,215,0,${explosion.life / explosion.maxLife}) 15%, 
    rgba(255,140,0,${explosion.life / explosion.maxLife}) 35%, 
    rgba(255,69,0,${explosion.life / explosion.maxLife}) 55%, 
    rgba(255,20,147,${explosion.life / explosion.maxLife}) 75%, 
    transparent 100%)`
                        : `radial-gradient(circle, 
    rgba(255,255,255,${explosion.life / explosion.maxLife}) 0%, 
    rgba(255,220,0,${explosion.life / explosion.maxLife}) 15%, 
    rgba(255,140,0,${explosion.life / explosion.maxLife}) 35%, 
    rgba(255,60,0,${explosion.life / explosion.maxLife}) 55%, 
    rgba(255,0,0,${explosion.life / explosion.maxLife}) 75%, 
    transparent 100%)`,
                opacity: explosion.life / explosion.maxLife,
                zIndex: 20,
                boxShadow: `0 0 ${explosion.size * 2}px rgba(255,120,0,${explosion.life / (explosion.maxLife * 2)})`
            }}
        />
    )
}

export default ExplosionPanel;