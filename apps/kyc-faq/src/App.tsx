import '@/globals.css'

import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { FaqPage } from './components/FaqPage'

const classNames = {
  app: 'app w-full min-h-screen flex flex-col bg-secondary',
}

const AppRoot = () => {
  return (
    <div className={classNames.app}>
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoot />,
    children: [
      { path: '/', element: null },
      { path: '/faq', element: <FaqPage /> },
    ],
  },
])

export const App = () => {
  return <RouterProvider router={router} />
}
