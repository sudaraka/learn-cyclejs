import { run } from '@cycle/core'
import { button, h1, h4, a, div, makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'

const
  // Logic (functional)
  main = sources => {
    const
      url = 'http://jsonplaceholder.typicode.com/users/1',
      click$ = sources.DOM.select('.get-first').events('click'),
      request$ = click$.map(() => ({
        url,
        'method': 'get'
      })),

      response$$ = sources.HTTP
        .filter(r$ => r$.request.url === url),

      resp$ = response$$.switch(),
      firstUser$ = resp$.map(res => res.body).startWith(null)

    return {
      'DOM': firstUser$.map(user =>
        div([
          button('.get-first', 'Get first user'),
          null === user ? null : div('.user-details', [
            h1('.user-name', user.name),
            h4('.user-email', user.email),
            a('.user-website', { 'href': user.website }, user.website)
          ])
        ])
      ),
      'HTTP': request$
    }
  },

  drivers = {
    'DOM': makeDOMDriver('#app'),
    'HTTP': makeHTTPDriver()
  }

run(main, drivers)
