import Rx from 'rxjs'

const
  // Logic (functional)
  main = () => ({
    'DOM': Rx.Observable.timer(0, 1000).map(i => `Seconds elapsed ${i}`),
    'Log': Rx.Observable.timer(0, 2000).map(i => i * 2)
  }),


// Effects (imperative)
  domEffects = text$ => {
    text$.subscribe(text => {
      const
        container = document.querySelector('#app')

      container.textContent = text
    })
  },

  consoleLogEffect = msg$ => msg$.subscribe(msg => console.log(msg)),

  sink = main()

domEffects(sink.DOM)

consoleLogEffect(sink.Log)
