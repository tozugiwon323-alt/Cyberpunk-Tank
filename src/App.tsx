import { GlobalProvider } from './context'
import TankGame from './components/tank-sample'

function App() {
  return (
    <GlobalProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-orange-950 overflow-hidden">
        {/* Cyberpunk background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(255,_69,_0,_0.3),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_140,_0,_0.3),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,_rgba(255,_0,_0,_0.2),_transparent_50%)]"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `linear-gradient(rgba(255,69,0,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,69,0,0.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <TankGame />
        </div>
      </div>
    </GlobalProvider>
  )
}

export default App
