import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import App from './App.tsx'
import './index.css'
import { config } from './utils/wagmi.ts';

const queryClient = new QueryClient();
const myCustomTheme = darkTheme({
  borderRadius: "medium",  // Keep UI compact
  overlayBlur: "small",    // Reduce modal size effect
  fontStack: "system",     // Use system font for better scaling
  // accentColor: "#ff007a",  // Customize color (optional)
});

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={myCustomTheme}>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider >
)

