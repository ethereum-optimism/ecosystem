import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const mswServer = setupServer()

export const mockPostSuccessJson = (route: string, response: any) => {
  mswServer.use(
    http.post(route, () => {
      return HttpResponse.json(response)
    }),
  )
}

export const mockPostError = (route: string, status: number) => {
  mswServer.use(
    http.post(route, () => {
      return new HttpResponse(null, {
        status,
      })
    }),
  )
}

export const mockPostErrorWithReturnJson = (
  route: string,
  status: number,
  body: any,
) => {
  mswServer.use(
    http.post(route, () => {
      return HttpResponse.json(body, {
        status,
      })
    }),
  )
}
