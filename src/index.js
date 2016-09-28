import Rx from 'rx'
import { run } from '@cycle/core'
import { label, input, div, makeDOMDriver } from '@cycle/dom'
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

    return { 'DOM': vtree$ }
  },

  isolatedLabelSlider = sources => isolate(labelSlider)(sources),

  main = sources => {
    const
      weightProps$ = Rx.Observable.of({
        'label': 'Weight',
        'unit': 'Kg',
        'min': 40,
        'max': 150,
        'init': 69
      }),
      weightSinks = isolatedLabelSlider({
        ...sources,
        'props': weightProps$
      }),
      weightVt$ = weightSinks.DOM,

      heightProps$ = Rx.Observable.of({
        'label': 'Height',
        'unit': 'cm',
        'min': 140,
        'max': 220,
        'init': 154
      }),
      heightSinks = isolatedLabelSlider({
        ...sources,
        'props': heightProps$
      }),
      heightVt$ = heightSinks.DOM,

      vtree$ = Rx.Observable.combineLatest(
        weightVt$,
        heightVt$,
        (weightVt, heightVt) => div([ weightVt, heightVt ])
      )

    return { 'DOM': vtree$ }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
