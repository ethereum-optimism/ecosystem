export const getRemainingSeconds = (endTime: number) => {
	const currentTime = new Date().getTime();
	const remainingSeconds = Math.floor(
		Math.max(endTime - currentTime, 0) / 1000,
	);

	return remainingSeconds;
};
