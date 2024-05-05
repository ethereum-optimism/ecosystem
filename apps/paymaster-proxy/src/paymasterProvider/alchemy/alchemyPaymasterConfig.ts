export type MainnetAlchemyPaymasterProviderConfig = {
  type: 'alchemy'
  gasManagerAccessKey: string
  appId: string
  rpcUrl: string
}

export type TestnetAlchemyPaymasterProviderConfig =
  MainnetAlchemyPaymasterProviderConfig & {
    sharedPolicyId: string
  }
