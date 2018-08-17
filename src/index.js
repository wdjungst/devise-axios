import axios from 'axios'

const HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const setTokens = async (storage, headers) => {
  for (let token of HEADERS) {
    axios.defaults.headers.common[token] = headers[token]
    await storage.setItem(token, headers[token])
  }
}

export const getTokens = async (storage) => {
  let headers = {}
  for (let token of HEADERS) {
    const t = await localStorage.getItem(token)
    headers[token] = t
  }

  return headers
}

const clearTokens = async (storage) => {
  for (let token of HEADERS) {
    await localStorage.removeItem(token)
  }
}

export const initMiddleware = async (options = {}) => {
  const defaults = {
    authPrefix: '/api/auth',
    signOut: '/sign_out',
    validate: '/validate_token',
    storage: localStorage,
  }

  const settings = {...defaults, ...options}
  const { storage } = settings

  axios.interceptors.response.use( async (response) => {
    const { headers } = response
    const oldHeaders = axios.defaults.headers.common
    if (headers['access-token'] && headers['access-token'] !== oldHeaders['access-token'])
      await setTokens(headers)
    return response;
  }, async (error) => {
    const { headers } = error
    const oldHeaders = axios.defaults.headers.common
    if (headers['access-token'] && headers['access-token'] !== oldHeaders['access-token'])
      await setTokens(headers)
    return Promise.reject(error);
  });

  axios.interceptors.request.use( async (request) => {
    const { url } = request
    const { authPrefix, signOut, validate } = settings
    const authRegex = new RegExp(authPrefix)
    if (authRegex.test(request.url)) {
      const path = url.split(authPrefix)[1]
      switch(path) {
        case validate:
          const headers = await getTokens()
          request = {...request, ...headers}
          const common = {...request.headers.common, ...headers}
          axios.defaults.headers.common = common
          request.headers.common = common
          break
        case signOut:
          clearTokens()
          break
        default:
          return request
      }
    }

    return request
  }, (error) => {
    return Promise.reject(error)
  })
}


