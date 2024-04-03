import type { Env } from "@/env";
import {
	jsonParseWithBigInt,
	jsonStringifyWithBigInt,
} from "@/util/bigIntSupportedJson";

export const getKvCachedStore = <K, T>({
	keyFn,
	fetchFn,
}: {
	keyFn: (params: K) => string;
	fetchFn: (env: Env, params: K) => Promise<T>;
}) => {
	const getFromCache = async (env: Env, params: K) => {
		const cacheKey = keyFn(params);
		const cachedValue = await env.KV.get(cacheKey);
		if (cachedValue) {
			return jsonParseWithBigInt(cachedValue) as T;
		}
		return null;
	};

	return {
		get: getFromCache,
		fetch: async (env: Env, params: K) => {
			const cacheKey = keyFn(params);
			const cachedValue = await getFromCache(env, params);

			if (cachedValue) {
				return cachedValue;
			}

			const fetchedValue = await fetchFn(env, params);

			await env.KV.put(cacheKey, jsonStringifyWithBigInt(fetchedValue));

			return fetchedValue;
		},
	};
};
