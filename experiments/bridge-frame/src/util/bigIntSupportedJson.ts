const reviver = (key: string, val: unknown): unknown => {
	if (typeof val === "string" && /^-?\d+n$/.test(val)) {
		return BigInt(val.slice(0, -1));
	}
	return val;
};

const replacer = (key: string, value: unknown) =>
	typeof value === "bigint" ? `${value.toString()}n` : value;

export const jsonStringifyWithBigInt = (data: unknown) => {
	return JSON.stringify(data, replacer);
};

export const jsonParseWithBigInt = (data: string) => {
	JSON.parse(data, reviver);
};
