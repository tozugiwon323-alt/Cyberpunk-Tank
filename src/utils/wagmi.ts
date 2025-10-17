import { baseSepolia, monadTestnet, sonic } from 'wagmi/chains';
import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';

const sonicBlazeTestnet = {
  id: 57_054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: { http: ['https://sonic-testnet.drpc.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Blaze Testnet Explorer',
      url: 'https://blaze.soniclabs.com',
    },
  },
  testnet: true,

} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Tank Game',
  projectId: '13476dbdc431c755f63f535b38f4997c',
  chains: [
    sonic,
    sonicBlazeTestnet,
    baseSepolia,
    monadTestnet,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [baseSepolia] : []),
  ],
});













