# About

This package fits a very specific use case.  Its purpose is to help keep track of new tokens everytime a request is made.  It works by capturing the axios response and hot swapping tokens if new tokens have come back from the server.  On an authenticated request, tokens are destroyed on signout and tokens are rehydrated on a validation event.

 * You are using devise token authentiation
 * You are using axios
 
# Installation
```npm install devise-axios```

```javascript
import { initMiddleware } from './utils/api';

initMiddleware()
```

You can also change the default auth url and options

```javascript
  //defaults
  //{
  //  authPrefix: '/api/auth',
  //  signOut: '/sign_out',
  //  validate: '/validate_token',
  //}

  const options = { authPrefix: '/auth' }
  initMiddleware(options)
```

