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

export const mockGetSuccessJson = (route: string, response: any) => {
  mswServer.use(
    http.get(route, () => {
      return HttpResponse.json(response)
    }),
  )
}

export const mockGetError = (route: string, status: number) => {
  mswServer.use(
    http.get(route, () => {
      return new HttpResponse(null, {
        status,
      })
    }),
  )
}

export const mockGetErrorWithReturnJson = (
  route: string,
  status: number,
  body: any,
) => {
  mswServer.use(
    http.get(route, () => {
      return HttpResponse.json(body, {
        status,
      })
    }),
  )
}

export const mockDeleteSuccess = (route: string) => {
  mswServer.use(
    http.delete(route, () => {
      return HttpResponse.json(null)
    }),
  )
}

export const mockDeleteSuccessJson = (route: string, response: any) => {
  mswServer.use(
    http.delete(route, () => {
      return HttpResponse.json(response)
    }),
  )
}

export const mockDeleteError = (route: string, status: number) => {
  mswServer.use(
    http.delete(route, () => {
      return new HttpResponse(null, {
        status,
      })
    }),
  )
}

export const mockDeleteErrorWithReturnJson = (
  route: string,
  status: number,
  body: any,
) => {
  mswServer.use(
    http.delete(route, () => {
      return HttpResponse.json(body, {
        status,
      })
    }),
  )
}
