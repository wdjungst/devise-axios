import axios from 'axios'

const HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const setTokens = (storage, headers) => {
  for (let token of HEADERS) {
    axios.defaults.headers.common[token] = headers[token]
    storage.setItem(token, headers[token])
  }
}

export const getTokens = (storage) => {
  let headers = {}
  for (let token of HEADERS) {
    const t = localStorage.getItem(token)
    headers[token] = t
  }

  return headers
}

const clearTokens = (storage) => {
  for (let token of HEADERS) {
    localStorage.removeItem(token)
  }
}

export const initMiddleware = (options = {}) => {
  const defaults = {
    authPrefix: '/api/auth',
    signOut: '/sign_out',
    validate: '/validate_token',
    storage: localStorage,
  }

  const settings = {...defaults, ...options}
  const { storage } = settings

  axios.interceptors.response.use( (response) => {
    const { headers } = response
    const oldHeaders = axios.defaults.headers.common
    if (headers['access-token'] && headers['access-token'] !== oldHeaders['access-token'])
      setTokens(storage, headers)
    return response;
  }, (error) => {
    const { headers } = error
    const oldHeaders = axios.defaults.headers.common
    if (headers['access-token'] && headers['access-token'] !== oldHeaders['access-token'])
      setTokens(storage, headers)
    return Promise.reject(error);
  });

  axios.interceptors.request.use( (request) => {
    const { url } = request
    const { authPrefix, signOut, validate } = settings
    const authRegex = new RegExp(authPrefix)
    if (authRegex.test(request.url)) {
      const path = url.split(authPrefix)[1]
      switch(path) {
        case validate:
          const headers = getTokens()
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


