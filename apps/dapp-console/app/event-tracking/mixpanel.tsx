import mixpanelBrowser from 'mixpanel-browser'

const initMixpanel = () => {
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    return null
  }
  mixpanelBrowser.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
    track_pageview: true,
  })
  return mixpanelBrowser
}

export const mixpanel = initMixpanel()

enum TRACKING_EVENT_NAME {
  PageVisit = 'Page Visit',
  SignInClick = 'Sign In Click',
  SuccessfulSignIn = 'Successful Sign In',
  CardClick = 'Card Click',
  TopBarClick = 'Top Bar Click',
  SupportDocsClick = 'Support Docs Click',
  OfferEngaged = 'Offer Engaged',
  SignInModal = 'Sign In Modal',
  AddActionClick = 'Add Action Click',
  AddActionConfirm = 'Add Action Confirm',
  DeleteActionClick = 'Delete Action Click',
  DeleteActionConfirm = 'Delete Action Confirm',
  WalletLink = 'Successful Wallet Link',
  StartContractVerification = 'Start Contract Verification',
  CompleteContractVerification = 'Complete Contract Verification',
  ClaimRebateClick = 'Claim Rebate Click',
  ClaimRebate = 'Rebate Claimed',
}

enum CUSTOM_TRACKING_PROPERTY {
  NewUser = 'New User',
  CardName = 'Card Name',
  PageName = 'Page Name',
  ChainName = 'Chain Name',
  OfferingName = 'Offering Name',
  AddActionType = 'Add Action Type',
  DeleteActionType = 'Delete Action Type',
  WalletType = 'Wallet Type',
  VerificationType = 'Verification Type',
  ChainId = 'Chain Id',
}

export type ActionType = 'app' | 'contract' | 'wallet'

export const trackPageVisit = () => {
  mixpanel?.track(TRACKING_EVENT_NAME.PageVisit)
}

export const trackSignInClick = () => {
  mixpanel?.track(TRACKING_EVENT_NAME.SignInClick)
}

export const trackSuccessfulSignIn = (isNewUser: boolean) => {
  mixpanel?.track(TRACKING_EVENT_NAME.SuccessfulSignIn, {
    [CUSTOM_TRACKING_PROPERTY.NewUser]: isNewUser,
  })
}

export const trackCardClick = (cardName: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.CardClick, {
    [CUSTOM_TRACKING_PROPERTY.CardName]: cardName,
  })
}

export const trackTopBarClick = (pageName: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.TopBarClick, {
    [CUSTOM_TRACKING_PROPERTY.PageName]: pageName,
  })
}

export const trackSupportDocsClick = (chainName: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.SupportDocsClick, {
    [CUSTOM_TRACKING_PROPERTY.ChainName]: chainName,
  })
}

export const trackOfferEngaged = (offeringName: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.OfferEngaged, {
    [CUSTOM_TRACKING_PROPERTY.OfferingName]: offeringName,
  })
}

export const trackSignInModalClick = (cardName: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.SignInModal, {
    [CUSTOM_TRACKING_PROPERTY.CardName]: cardName,
  })
}

export const trackAddActionClick = (action: ActionType) => {
  mixpanel?.track(TRACKING_EVENT_NAME.AddActionClick, {
    [CUSTOM_TRACKING_PROPERTY.AddActionType]: action,
  })
}

export const trackAddActionConfirm = (action: ActionType) => {
  mixpanel?.track(TRACKING_EVENT_NAME.AddActionConfirm, {
    [CUSTOM_TRACKING_PROPERTY.AddActionType]: action,
  })
}

export const trackDeleteActionClick = (action: ActionType) => {
  mixpanel?.track(TRACKING_EVENT_NAME.DeleteActionClick, {
    [CUSTOM_TRACKING_PROPERTY.DeleteActionType]: action,
  })
}

export const trackDeleteActionConfirm = (action: ActionType) => {
  mixpanel?.track(TRACKING_EVENT_NAME.DeleteActionConfirm, {
    [CUSTOM_TRACKING_PROPERTY.DeleteActionType]: action,
  })
}

export const trackWalletConnectorType = (connectorType: string) => {
  mixpanel?.track(TRACKING_EVENT_NAME.WalletLink, {
    [CUSTOM_TRACKING_PROPERTY.WalletType]: connectorType,
  })
}

export const trackStartContractVerification = () => {
  mixpanel?.track(TRACKING_EVENT_NAME.StartContractVerification)
}

export const trackFinishContractVerification = (
  type: 'alreadyVerified' | 'manualVerification' | 'automaticVerification',
) => {
  mixpanel?.track(TRACKING_EVENT_NAME.CompleteContractVerification, {
    [CUSTOM_TRACKING_PROPERTY.VerificationType]: type,
  })
}

export const trackClaimRebateClick = () => {
  mixpanel?.track(TRACKING_EVENT_NAME.ClaimRebateClick)
}

export const trackClaimRebate = (chainId: number) => {
  mixpanel?.track(TRACKING_EVENT_NAME.ClaimRebate, {
    [CUSTOM_TRACKING_PROPERTY.ChainId]: chainId,
  })
}
