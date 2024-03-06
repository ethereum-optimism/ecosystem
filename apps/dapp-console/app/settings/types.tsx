export type SettingsTabType = 'account' | 'contracts' | 'wallets'

export type SettingsTab = {
  type: SettingsTabType
  title: React.ReactNode
  description?: React.ReactNode
}
