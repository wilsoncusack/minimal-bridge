import { l2OutputOracleABI } from '@eth-optimism/contracts-ts'
import type { Chain, PublicClient, ReadContractParameters, Transport } from 'viem'
import { readContract } from 'viem/actions'
import type { MessagePassedEvent } from '../../../index.js'
import { type RawOrContractAddress, resolveAddress } from '../../../types/addresses.js'
import { readProvenWithdrawals } from './readProvenWithdrawals.js'

const ABI = l2OutputOracleABI

export type GetSecondsToFinalizableParameters<
  TChain extends Chain | undefined = Chain | undefined,
  _chainId = TChain extends Chain ? TChain['id'] : number,
> = {
  withdrawalHash: MessagePassedEvent['withdrawalHash']
  portal: RawOrContractAddress<_chainId>
  l2OutputOracle: RawOrContractAddress<_chainId>
}

export async function getSecondsToFinalizable<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  {
    withdrawalHash,
    l2OutputOracle,
    portal,
  }: GetSecondsToFinalizableParameters,
): Promise<bigint> {
  const provenWithdrawal = await readProvenWithdrawals(client, {
    portal: resolveAddress(portal),
    withdrawalHash,
  })

  const finalizationPeriod = await readContract(client, {
    abi: l2OutputOracleABI,
    functionName: 'FINALIZATION_PERIOD_SECONDS',
    address: resolveAddress(l2OutputOracle),
  } as ReadContractParameters<typeof ABI, 'FINALIZATION_PERIOD_SECONDS'>)

  const timeSinceProven = BigInt(Date.now()) / 1000n - provenWithdrawal.timestamp

  const finalizable = finalizationPeriod - timeSinceProven

  // NOTE(Wilson): No negative numbers, does not make sense to have negative seconds until finalizable
  return finalizable < 0n ? 0n : finalizable
}
