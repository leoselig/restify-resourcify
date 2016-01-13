# restify-resourcify
Declarative bindings to restify service endpoint registration.

[![Dependency Status](https://david-dm.org/leoselig/restify-resourcify.svg)](https://david-dm.org/leoselig/restify-resourcify)
[![Build Status](https://travis-ci.org/leoselig/restify-resourcify.svg?branch=master)](https://travis-ci.org/leoselig/restify-resourcify)

## Getting Started

```sh
npm install restify-resourcify
```

*Note: You need to have `restify` installed. Take a look at the `peerDependencies` in `package.json` for version compatibility.*

## Usage

```javascript
import {Resource, path, GET} from 'restify-resourcify';

@path('/users/')
class UserResource extends Resource {

  @GET
  async fetchUsers(request) {
    return {
      data: await db.loadUsers
    };
  }

  @GET
  @path(':id')
  async fetchUser(request) {
    return {
      data: await db.loadUser({
        id: request.params.id
      })
    };
  }

}
```
