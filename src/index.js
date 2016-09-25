import Rx from 'rx'
import { run } from '@cycle/core'
import { button, p, label, div, makeDOMDriver } from '@cycle/dom'

const
  // Logic (functional)
  main = sources => {
    const
      dec$ = sources.DOM.select('#decrement').events('click'),
      inc$ = sources.DOM.select('#increment').events('click'),
      decAct$ = dec$.map(() => -1),
      incAct$ = inc$.map(() => 1),
      number$ = Rx.Observable.of(10)
        .merge(incAct$)
        .merge(decAct$)
        .scan((acc, val) => acc + val)

    return {
      'DOM': number$.map(number =>
        div([
          button('#decrement', 'Decrement'),
          button('#increment', 'Increment'),
          p([
            label(String(number))
          ])
        ])
      )
    }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
