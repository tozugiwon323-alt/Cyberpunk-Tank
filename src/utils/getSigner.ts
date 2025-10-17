import { BrowserProvider } from "ethers"
import { useEffect, useMemo } from 'react'
import { Config, useConnectorClient } from 'wagmi'


const target_ChainId = 84532; // baseSepolia chain ID
export function clientToSigner(client: any) {
  const { account, chain, transport } = client
  if (!chain) return;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  const provider: any = new BrowserProvider(transport, network)
  const signer = provider.getSigner(account.address)

  if (chain?.id !== target_ChainId) {
    switchNetwork(target_ChainId)
  }
  return signer
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  useEffect(() => {
    if (client) {
      clientToSigner(client)
    }
  }, [client])

  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

async function switchNetwork(target_ChainId: number) {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${target_ChainId.toString(16)}` }],
      })

      await window.ethereum.request({
        method: 'eth_chainId',
      })
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${target_ChainId.toString(16)}`,
            chainName: 'baseSepoliaTestnet',
            nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          }]
        })
      }
    }
  }
}