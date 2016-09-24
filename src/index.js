import Rx from 'rxjs'

const
  // Logic (functional)
  main = domSource => {
    const
      click$ = domSource

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

  run = (mainFn, drivers) => {
    const
      proxyDOMSource = new Rx.Subject(),
      sink = mainFn(proxyDOMSource),
      domSource = drivers.DOM(sink.DOM)

    domSource.subscribe(click => proxyDOMSource.next(click))

    // Object.keys(drivers).forEach(key => {
    //   drivers[key](sink[key])
    // })
  },

  drivers = {
    'DOM': domDriver,
    'Log': consoleLogDriver
  }

run(main, drivers)
