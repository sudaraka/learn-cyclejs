import Rx from 'rx'
import { run } from '@cycle/core'
import { label, input, div, makeDOMDriver } from '@cycle/dom'

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

  main = sources => {
    const
      weightProps$ = Rx.Observable.of({
        'label': 'Weight',
        'unit': 'Kg',
        'min': 40,
        'max': 150,
        'init': 69
      }),
      weightSinks = labelSlider({
        'DOM': sources.DOM.select('.weight'),
        'props': weightProps$
      }),
      weightVt$ = weightSinks.DOM.map(vt => {
        vt.sel += ' weight'

        return vt
      }),

      heightProps$ = Rx.Observable.of({
        'label': 'Height',
        'unit': 'cm',
        'min': 140,
        'max': 220,
        'init': 154
      }),
      heightSinks = labelSlider({
        'DOM': sources.DOM.select('.height'),
        'props': heightProps$
      }),
      heightVt$ = heightSinks.DOM.map(vt => {
        vt.sel += ' height'

        return vt
      }),

      vtree$ = Rx.Observable.combineLatest(
        weightVt$,
        heightVt$,
        (weightVt, heightVt) => div([ weightVt, heightVt ])
      )

    return { 'DOM': vtree$ }
  },

  drivers = { 'DOM': makeDOMDriver('#app') }

run(main, drivers)
