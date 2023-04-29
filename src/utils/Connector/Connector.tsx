import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'

export const chains = [bscTestnet]
export const projectId = 'bf9397e41bf0ab99a492296a2957db54'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
})
