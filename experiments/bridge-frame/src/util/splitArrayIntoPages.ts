export const splitArrayIntoPages = <T>(
	inputArray: readonly T[],
	{
		firstChunkSize = 3,
		middleChunkSize = 2,
		lastChunkSize = 3,
	}: {
		firstChunkSize?: number;
		middleChunkSize?: number;
		lastChunkSize?: number;
	} = {},
) => {
	const result: T[][] = [];
	const size = inputArray.length;

	let startIndex = 0;

	if (size > 0) {
		result.push(inputArray.slice(startIndex, startIndex + firstChunkSize));
		startIndex += firstChunkSize;
	}

	while (startIndex < size) {
		let chunkSize = middleChunkSize;

		if (size - startIndex <= lastChunkSize) {
			chunkSize = size - startIndex;
		}

		result.push(inputArray.slice(startIndex, startIndex + chunkSize));
		startIndex += chunkSize;
	}

	return result;
};
