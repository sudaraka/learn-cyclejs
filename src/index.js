import Rx from 'rxjs'
import { run } from '@cycle/core'

const
  h = (tagName, children) => ({
    tagName,
    children
  }),

  h1 = children => h('h1', children),
  span = children => h('span', children),

  // Logic (functional)
  main = source => {
    const
      click$ = source.DOM.selectEvent('span', 'mouseover')

    return {
      'DOM': click$
        .startWith(null)
        .switchMap(() => Rx.Observable.timer(0, 1000)
          .map(i => h1([ span([ `Seconds elapsed ${i}` ]) ]))
        ),
      'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
    }
  },


// Effects (imperative)
  domDriver = obj$ => {
    const
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

    return {
      'selectEvent': (tagName, eventType) => Rx.Observable.fromEvent(document, eventType)
        .filter(e => e.target.tagName === tagName.toUpperCase())
    }
  },

  consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg)),

  driversToUse = {
    'DOM': domDriver,
    'Log': consoleLogDriver
  }

run(main, driversToUse)
