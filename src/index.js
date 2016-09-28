import Rx from 'rx'
import { run } from '@cycle/core'
import { h2, label, input, div, makeDOMDriver } from '@cycle/dom'
import isolate from '@cycle/isolate'

const
  intent = domSource => domSource.select('.slider').events('input')
    .map(e => e.target.value),

  model = (newValue$, props$) => {
    const
      inital$ = props$.map(props => props.init).first(),
      value$ = inital$.concat(newValue$)

    return Rx.Observable.combineLatest(value$, props$, (value, props) => ({
      ...props,
      value
    }))
  },

  view = state$ => state$.map(state =>
    div('.labeled-slider', [
      label('.label', `${state.label}: ${state.value}${state.unit}`),
      input('.slider', {
        'attrs': {
          'type': 'range',
          'min': state.min,
          'max': state.max,
          'value': state.value
        }
      })
    ])
  ),

  labelSlider = sources => {
    const
      change$ = intent(sources.DOM),
      state$ = model(change$, sources.props),
      vtree$ = view(state$)

    return {
      'DOM': vtree$,
      'value': state$.map(state => state.value)
    }
  },

  isolatedLabelSlider = sources => isolate(labelSlider)(sources),

  main = sources => {
    const
      weightProps$ = Rx.Observable.of({
        'label': 'Weight',
        'unit': 'Kg',
        'min': 10,
        'max': 150,
        'init': 69
      }),
      weightSinks = isolatedLabelSlider({
        ...sources,
        'props': weightProps$
      }),
      weightVt$ = weightSinks.DOM,
      weightValue$ = weightSinks.value,

      heightProps$ = Rx.Observable.of({
        'label': 'Height',
        'unit': 'cm',
        'min': 100,
        'max': 220,
        'init': 154
      }),
      heightSinks = isolatedLabelSlider({
        ...sources,
        'props': heightProps$
      }),
      heightVt$ = heightSinks.DOM,
      heightValue$ = heightSinks.value,

      bmi$ = Rx.Observable.combineLatest(
        weightValue$,
        heightValue$,
        (weight, height) => {
          const
            heightM = height / 100,
            bmi = Math.round(weight / (heightM * heightM))

          return bmi
        }
      ),

      vtree$ = Rx.Observable.combineLatest(
        bmi$,
        weightVt$,
        heightVt$,
        (bmi, weightVt, heightVt) => div([
          weightVt,
          heightVt,
          h2(`BMI is ${bmi}`)
        ])
      )

    return { 'DOM': vtree$ }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
