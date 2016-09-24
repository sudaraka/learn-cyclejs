import Rx from 'rxjs'

const
  // Logic (functional)
  main = () => Rx.Observable.timer(0, 1000)
    .map(i => `Seconds elapsed ${i}`),


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

domEffects(sink)

consoleLogEffect(sink)
