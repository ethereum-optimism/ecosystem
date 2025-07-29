const Q96 = BigInt(2) ** BigInt(96)

export const MIN_USABLE_TICK = BigInt(-887220)
export const MIN_SQRT_PRICE = BigInt(4295128739)

export const MAX_USABLE_TICK = BigInt(887220)
export const MAX_SQRT_PRICE =
  BigInt(1461446703485210103287273052203988822378723970342)

export const usePriceFromSqrtPriceX96 = (sqrtPriceX96: bigint) => {
  const sqrt = Number(sqrtPriceX96) / Number(Q96)
  return sqrt * sqrt
}

///// GET LIQUIDITY AMOUNTS /////

export const getLiquidityForAmount0 = (
  sqrtPriceAX96: bigint,
  sqrtPriceBX96: bigint,
  amount0: bigint,
) => {
  if (sqrtPriceAX96 > sqrtPriceBX96) {
    ;[sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
  }

  // intermediate = (sqrtPriceAX96 * sqrtPriceBX96) / Q96
  // liquidity = (amount0 * intermediate) / (sqrtPriceBX96 - sqrtPriceAX96)
  const intermediate = (sqrtPriceAX96 * sqrtPriceBX96) / Q96
  return (amount0 * intermediate) / (sqrtPriceBX96 - sqrtPriceAX96)
}

export const getLiquidityForAmount1 = (
  sqrtPriceAX96: bigint,
  sqrtPriceBX96: bigint,
  amount1: bigint,
) => {
  if (sqrtPriceAX96 > sqrtPriceBX96) {
    ;[sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
  }

  // liquidity = (amount1 * Q96) / (sqrtPriceBX96 - sqrtPriceAX96)
  return (amount1 * Q96) / (sqrtPriceBX96 - sqrtPriceAX96)
}

export const getLiquidityForAmounts = (
  sqrtPriceX96: bigint,
  sqrtPriceAX96: bigint,
  sqrtPriceBX96: bigint,
  amount0: bigint,
  amount1: bigint,
) => {
  // Ensure sqrtPriceAX96 <= sqrtPriceBX96
  if (sqrtPriceAX96 > sqrtPriceBX96) {
    ;[sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
  }

  if (sqrtPriceX96 <= sqrtPriceAX96) {
    // Entire range is above current price: token0 only
    return getLiquidityForAmount0(sqrtPriceAX96, sqrtPriceBX96, amount0)
  } else if (sqrtPriceX96 < sqrtPriceBX96) {
    // Current price is within the range: both tokens needed
    const liquidity0 = getLiquidityForAmount0(
      sqrtPriceX96,
      sqrtPriceBX96,
      amount0,
    )
    const liquidity1 = getLiquidityForAmount1(
      sqrtPriceAX96,
      sqrtPriceX96,
      amount1,
    )
    return liquidity0 < liquidity1 ? liquidity0 : liquidity1
  } else {
    // Entire range is below current price: token1 only
    return getLiquidityForAmount1(sqrtPriceAX96, sqrtPriceBX96, amount1)
  }
}

///// GET AMOUNTS FROM LIQUIDITY /////

export const getAmount0ForLiquidity = (
  sqrtA: bigint,
  sqrtB: bigint,
  liquidity: bigint,
): bigint => {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA]
  const numerator = liquidity * (sqrtB - sqrtA)
  const denominator = (sqrtB * sqrtA) / Q96
  return (numerator * Q96) / denominator
}

export const getAmount1ForLiquidity = (
  sqrtA: bigint,
  sqrtB: bigint,
  liquidity: bigint,
): bigint => {
  if (sqrtA > sqrtB) [sqrtA, sqrtB] = [sqrtB, sqrtA]
  return (liquidity * (sqrtB - sqrtA)) / Q96
}

export const getAmountsForLiquidity = (
  sqrtPriceX96: bigint,
  sqrtPriceAX96: bigint,
  sqrtPriceBX96: bigint,
  liquidity: bigint,
): { amount0: bigint; amount1: bigint } => {
  if (sqrtPriceAX96 > sqrtPriceBX96) {
    ;[sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
  }

  let amount0 = 0n
  let amount1 = 0n

  if (sqrtPriceX96 <= sqrtPriceAX96) {
    amount0 = getAmount0ForLiquidity(sqrtPriceAX96, sqrtPriceBX96, liquidity)
  } else if (sqrtPriceX96 < sqrtPriceBX96) {
    amount0 = getAmount0ForLiquidity(sqrtPriceX96, sqrtPriceBX96, liquidity)
    amount1 = getAmount1ForLiquidity(sqrtPriceAX96, sqrtPriceX96, liquidity)
  } else {
    amount1 = getAmount1ForLiquidity(sqrtPriceAX96, sqrtPriceBX96, liquidity)
  }

  return { amount0, amount1 }
}
