import Rx from 'rxjs'
import { run } from '@cycle/core'

const
  // Logic (functional)
  main = source => {
    const
      click$ = source.DOM

    return {
      'DOM': click$
        .startWith(null)
        .switchMap(() => Rx.Observable.timer(0, 1000)
          .map(i => ({
            'tagName': 'h1',
            'children': [ {
              'tagName': 'span',
              'children': [ `Seconds elapsed ${i}` ]
            } ]
          }))
        ),
      'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
    }
  },


// Effects (imperative)
  domDriver = obj$ => {
    const
      domSource = Rx.Observable.fromEvent(document, 'click'),

      createElement = obj => {
        const
          element = document.createElement(obj.tagName)

        obj.children
          .filter(c => 'object' === typeof c)
          .map(createElement)
          .forEach(c => element.appendChild(c))

        obj.children
          .filter(c => 'string' === typeof c)
          .forEach(c => element.innerHTML += c)

        return element
      }

    obj$.subscribe(obj => {
      const
        container = document.querySelector('#app'),
        element = createElement(obj)

      container.innerHTML = ''
      container.appendChild(element)
    })

    return domSource
  },

  consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg)),

  driversToUse = {
    'DOM': domDriver,
    'Log': consoleLogDriver
  }

run(main, driversToUse)
