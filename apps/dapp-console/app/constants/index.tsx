export type Route = {
  path: string
  label: string
}

export type Routes = Record<string, Route>

const routes: Routes = {
  CONSOLE: {
    path: '/',
    label: 'Console',
  },
  INSIGHTS: {
    path: '/insights',
    label: 'Insights',
  },
} as const satisfies Routes

export { routes }
