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
        .switchMap(() => Rx.Observable.timer(0, 1000).map(i => `Seconds elapsed ${i}`)),
      'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
    }
  },


// Effects (imperative)
  domDriver = text$ => {
    const
      domSource = Rx.Observable.fromEvent(document, 'click')

    text$.subscribe(text => {
      const
        container = document.querySelector('#app')

      container.textContent = text
    })

    return domSource
  },

  consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg)),

  driversToUse = {
    'DOM': domDriver,
    'Log': consoleLogDriver
  }

run(main, driversToUse)
