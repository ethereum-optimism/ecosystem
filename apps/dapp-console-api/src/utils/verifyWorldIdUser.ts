import fetch from 'isomorphic-fetch'

export async function verifyWorldIdUser({
  merkle_root,
  nullifier_hash,
  proof,
  verification_level,
  action,
  signal = '',
}: {
  merkle_root: string
  nullifier_hash: string
  proof: string
  verification_level: string
  action: string
  signal?: string
}) {
  const reqBody = {
    merkle_root,
    nullifier_hash,
    proof,
    verification_level,
    action,
    signal: signal ?? '', // if we don't have a signal, use the empty string
  }

  const response = await fetch(
    `https://developer.worldcoin.org/api/v1/verify/${process.env.WORLDID_APP_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    },
  )

  return response.status === 200
}
