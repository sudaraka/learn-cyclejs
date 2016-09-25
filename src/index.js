import { run } from '@cycle/core'
import { label, input, h1, hr, div, makeDOMDriver } from '@cycle/dom'

const
  // Logic (functional)
  main = sources => {
    const
      inputEv$ = sources.DOM.select('.field').events('input'),
      name$ = inputEv$.map(e => e.target.value).startWith('')

    return {
      'DOM': name$.map(name =>
        div([
          label('Name:'),
          input('.field', { 'type': 'text' }),
          hr(),
          h1(`Hello ${name}!`)
        ])
      )
    }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
