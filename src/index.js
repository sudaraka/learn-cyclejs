import Rx from 'rxjs'

const
  // Logic (functional)
  main = () => ({
    'DOM': Rx.Observable.timer(0, 1000).map(i => `Seconds elapsed ${i}`),
    'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
  }),


// Effects (imperative)
  domDriver = text$ => {
    text$.subscribe(text => {
      const
        container = document.querySelector('#app')

      container.textContent = text
    })
  },

  consoleLogDriver = msg$ => msg$.subscribe(msg => console.log(msg)),

  run = (mainFn, effects) => {
    const
      sink = mainFn()

    Object.keys(effects).forEach(key => {
      effects[key](sink[key])
    })
  },

  drivers = {
    'DOM': domDriver,
    'Log': consoleLogDriver
  }

run(main, drivers)
