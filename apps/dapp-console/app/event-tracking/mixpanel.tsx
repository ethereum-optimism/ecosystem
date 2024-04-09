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
}

enum CUSTOM_TRACKING_PROPERTY {
  NewUser = 'New User',
  CardName = 'Card Name',
  PageName = 'Page Name',
  ChainName = 'Chain Name',
  OfferingName = 'Offering Name',
}

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
