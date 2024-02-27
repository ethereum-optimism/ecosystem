import mixpanelBrowser from 'mixpanel-browser'

const initMixpanel = () => {
  if (
    process.env.VITE_MIXPANEL_TOKEN === 'false' ||
    process.env.VITE_MIXPANEL_TOKEN == null
  ) {
    return null
  }
  mixpanelBrowser.init(process.env.VITE_MIXPANEL_TOKEN)
  return mixpanelBrowser
}

export const mixpanel = initMixpanel()