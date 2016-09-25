import Rx from 'rxjs'
import { run } from '@cycle/core'
import { h1, span, makeDOMDriver } from '@cycle/dom'

const
  // Logic (functional)
  main = source => {
    const
      mouseover$ = source.DOM.select('span').events('mouseover')

    return {
      'DOM': mouseover$
        .startWith(null)
        .switchMap(() => Rx.Observable.timer(0, 1000)
          .map(i => h1([ span([ `Seconds elapsed ${i}` ]) ]))
        ),
      'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
    }
  },


// Effects (imperative)
  consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg)),

  driversToUse = {
    'DOM': makeDOMDriver('#app'),
    'Log': consoleLogDriver
  }

run(main, driversToUse)
