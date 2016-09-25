import Rx from 'rx'
import { run } from '@cycle/core'
import { h2, label, input, div, makeDOMDriver } from '@cycle/dom'

const
  // DOM Read: Detect slider change
  // Recalculate BMI
  // DOM Write: Display DMI

  intent = domSource => ({
    'changeWeight$': domSource.select('.weight').events('input')
      .map(e => e.target.value),
    'changeHeight$': domSource.select('.height').events('input')
      .map(e => e.target.value)
  }),

  model = (changeWeight$, changeHeight$) => Rx.Observable.combineLatest(
    changeWeight$.startWith(69),
    changeHeight$.startWith(154),
    (weight, height) => {
      const
        heightM = height / 100,
        bmi = Math.round(weight / (heightM * heightM))

      return {
        bmi,
        weight,
        height
      }
    }
  ),

  view = state$ => state$.map(state =>
    div([
      div([
        label(`Weight: ${state.weight}Kg`),
        input('.weight', {
          'type': 'number',
          'min': 40,
          'max': 150,
          'value': state.weight
        })
      ]),
      div([
        label(`Height: ${state.height}cm`),
        input('.height', {
          'type': 'number',
          'min': 140,
          'max': 220,
          'value': state.height
        })
      ]),
      h2(`BMI is ${state.bmi}`)
    ])
  ),

  main = sources => {
    const
      { changeWeight$, changeHeight$ } = intent(sources.DOM),
      state$ = model(changeWeight$, changeHeight$),
      vtree$ = view(state$)

    return { 'DOM': vtree$ }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
