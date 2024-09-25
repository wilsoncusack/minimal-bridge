import {
  type Chain,
  createPublicClient,
  createTestClient,
  createWalletClient,
  custom,
  type EIP1193Provider,
  http,
  type PublicClient,
  RpcRequestError,
  webSocket,
} from 'viem';
import { base, localhost, mainnet } from 'viem/chains';
import { rpc } from 'viem/utils';
import { accounts, localHttpUrl, localRollupHttpUrl, localWsUrl, locaRolluplWsUrl } from './constants.js';

export class ProviderRpcError extends Error {
  code: number;
  details: string;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.details = message;
  }
}

export const anvilChain = {
  ...localhost,
  id: 1,
  contracts: {
    ...mainnet.contracts,
  },
  rpcUrls: {
    default: {
      http: [localHttpUrl],
      webSocket: [localWsUrl],
    },
    public: {
      http: [localHttpUrl],
      webSocket: [localWsUrl],
    },
  },
} as const satisfies Chain;

export const rollupAnvilChain = {
  ...base,
  id: 8453,
  name: 'Rollup Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [localRollupHttpUrl],
      webSocket: [locaRolluplWsUrl],
    },
    public: {
      http: [localRollupHttpUrl],
      webSocket: [locaRolluplWsUrl],
    },
  },
} as const satisfies Chain;

// Helper function to create clients (either HTTP or WebSocket based)
function createClient(chain: Chain, url: string, useWebSocket: boolean = false): PublicClient {
  return createPublicClient({
    chain,
    pollingInterval: 1000,
    transport: useWebSocket ? webSocket(url) : http(url),
  });
}

// Helper function to create providers to reduce redundancy
function createProvider(httpUrl: string, wsUrl: string): EIP1193Provider {
  return {
    on: (message, listener) => {
      if (message === 'accountsChanged') {
        listener([accounts[0].address]);
      }
    },
    removeListener: () => null,
    request: async ({ method, params }: any) => {
      if (method === 'eth_requestAccounts') {
        return [accounts[0].address];
      }
      if (method === 'personal_sign') {
        method = 'eth_sign';
        params = [params[1], params[0]];
      }
      if (method === 'wallet_watchAsset') {
        if (params.type === 'ERC721') {
          throw new ProviderRpcError(-32602, 'Token type ERC721 not supported.');
        }
        return true;
      }
      if (method === 'wallet_addEthereumChain' || method === 'wallet_switchEthereumChain') {
        return null;
      }
      const { error, result } = await rpc.http(httpUrl, {
        body: {
          method,
          params,
        },
      });
      if (error) {
        console.error(`RPC Error in method ${method}`, params);
        throw new RpcRequestError({
          body: { method, params },
          error,
          url: httpUrl,
        });
      }
      return result;
    },
  };
}

// Instantiate clients using refactored createClient and createProvider
export const rollUpHttpClient = createClient(rollupAnvilChain, localRollupHttpUrl);
export const rollupWebSocketClient = createClient(rollupAnvilChain, locaRolluplWsUrl, true);

export const rollupPublicClient: PublicClient = (
  process.env.VITE_NETWORK_TRANSPORT_MODE === 'webSocket'
    ? rollupWebSocketClient
    : rollUpHttpClient
) as typeof rollUpHttpClient;

export const rollupWalletClient = createWalletClient({
  chain: rollupAnvilChain,
  transport: custom(createProvider(localRollupHttpUrl, locaRolluplWsUrl)),
});

export const rollupTestClient = createTestClient({
  chain: rollupAnvilChain,
  mode: 'anvil',
  transport: http(localRollupHttpUrl),
});

export const httpClient: PublicClient = createClient(anvilChain, localHttpUrl);

export const webSocketClient: PublicClient = createClient(anvilChain, localWsUrl, true);

export const publicClient: PublicClient = (
  process.env.VITE_NETWORK_TRANSPORT_MODE === 'webSocket'
    ? webSocketClient
    : httpClient
) as typeof httpClient;

export const publicClientMainnet: PublicClient = createClient(mainnet, '');

export const walletClient = createWalletClient({
  chain: anvilChain,
  transport: custom(createProvider(localHttpUrl, localWsUrl)),
});

export const walletClientWithAccount = createWalletClient({
  account: accounts[0].address,
  chain: anvilChain,
  transport: custom(createProvider(localHttpUrl, localWsUrl)),
});

export const walletClientWithoutChain = createWalletClient({
  transport: custom(createProvider(localHttpUrl, localWsUrl)),
});

export const testClient = createTestClient({
  chain: anvilChain,
  mode: 'anvil',
  transport: http(localHttpUrl),
});
