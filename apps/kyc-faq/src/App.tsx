import '@/globals.css'

import { FaqPage } from '@/components/FaqPage'

const classNames = {
  app: 'app w-full min-h-screen flex flex-col bg-secondary',
}

export const App = () => {
  return (
    <div className={classNames.app}>
      <FaqPage />
    </div>
  )
}
