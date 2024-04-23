import type { SupportedChainId } from "@/constants/supportedChains";
import type { Env } from "@/env";
import { getPublicClientForChainId } from "@/helpers/getPublicClientForChainId";
import { getKvCachedStore } from "@/kvCache/getKvCachedStore";

const getBlockCacheKey = (chainId: SupportedChainId, blockNumber: bigint) => {
	return `block-${chainId}-${blockNumber}`;
};

export const blockStore = getKvCachedStore({
	keyFn: ({
		chainId,
		blockNumber,
	}: { chainId: SupportedChainId; blockNumber: bigint }) =>
		getBlockCacheKey(chainId, blockNumber),

	fetchFn: async (
		env: Env,
		{
			chainId,
			blockNumber,
		}: { chainId: SupportedChainId; blockNumber: bigint },
	) => {
		const publicClient = getPublicClientForChainId(env, chainId);

		return await publicClient
			.getBlock({
				blockNumber,
			})
			.catch((e) => {
				console.error(e);
				return null;
			});
	},
});
