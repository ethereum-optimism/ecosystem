type FetcherOption = {
  decrypt?: string
}

export type FeatureFlagMap = Record<string, unknown>

type EncryptedFeatureFlagResponse = {
  encryptedFeatures: string
}

type FeatureFlagResponse = {
  features: FeatureFlagMap
}

export async function decrypt(encryptionKey: string, encryptedText: string) {
  const base64ToBuf = (b: string) =>
    Uint8Array.from(atob(b), (c) => c.charCodeAt(0))
  const key = await window.crypto.subtle.importKey(
    'raw',
    base64ToBuf(encryptionKey),
    { name: 'AES-CBC', length: 128 },
    true,
    ['encrypt', 'decrypt'],
  )
  const [iv, cipherText] = encryptedText.split('.')
  const plainTextBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: base64ToBuf(iv) },
    key,
    base64ToBuf(cipherText),
  )
  return new TextDecoder().decode(plainTextBuffer)
}

export async function featureFlagsFetcherAndParser(
  url: string,
  options: FetcherOption,
): Promise<FeatureFlagMap | null> {
  let features: FeatureFlagMap | null = null

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (options.decrypt) {
      const encryptedData = data as EncryptedFeatureFlagResponse

      const decryptedFeatureStr = await decrypt(
        options.decrypt,
        encryptedData.encryptedFeatures,
      )

      features = JSON.parse(decryptedFeatureStr)
    } else {
      const unencryptedData = data as FeatureFlagResponse
      features = unencryptedData.features
    }
  } catch (e) {
    // TODO: capture this once we add sentry
    console.error(e)
  }

  return features
}
