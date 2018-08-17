import axios from 'axios'

const HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const setTokens = (headers) => {
  for (let token of HEADERS) {
    console.log('in loop')
    axios.defaults.headers.common[token] = headers[token]
    localStorage.setItem(token, headers[token])
  }
  console.log('out of loop')
}

export const getTokens = () => {
  let headers = {}
  for (let token of HEADERS) {
    const t = localStorage.getItem(token)
    headers[token] = t
  }

  return headers
}

const clearTokens = () => {
  for (let token of HEADERS) {
    localStorage.removeItem(token)
  }
}

export const initMiddleware = (options = {}) => {
  const defaults = {
    authPrefix: '/api/auth',
    signOut: '/sign_out',
    validate: '/validate_token',
  }

  const settings = Object.assign({}, defaults, options )

  axios.interceptors.response.use( (response) => {
    const { headers } = response
    const oldHeaders = axios.defaults.headers.common
    if (headers['access-token'] && headers['access-token'] !== oldHeaders['access-token'])
      setTokens(headers)
    return response;
  }, (error) => {
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
          request = Object.assign({}, request, headers)
          const common = Object.assign({}, request.headers.common, headers)
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


