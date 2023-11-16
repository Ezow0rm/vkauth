export async function* repeat(function_, { batchSize = 100, offset = 0 } = {}) {
	let count = Number.POSITIVE_INFINITY;
	let stopCalled = false;
	for (let index = 0, o = offset + index * batchSize; o < count; ) {
		if (stopCalled) break;
		const response = await function_({ count: batchSize, offset: o });
		count = response.count;
		yield [
			response.items,
			{
				count,
				offset: o,
				size: batchSize,
				stop: () => {
					stopCalled = true;
				}
			},
			response
		];
		index += 1;
		o = offset + index * batchSize;
	}
}
export async function* nxtRepeat(function_, { batchSize = 100, startFrom = '' } = {}) {
	let end = false;
	while (!end) {
		const response = await function_({
			start_from: startFrom,
			count: batchSize
		});
		if (!response.next_from) {
			end = true;
			break;
		}
		startFrom = response.next_from;
		yield [response.items, { startFrom, batchSize }];
	}
}
