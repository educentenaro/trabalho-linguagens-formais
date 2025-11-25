import type { State, TransitionMatrix, TransitionStep } from '../automaton/lexicalDfa'
import { alphabet } from '../automaton/lexicalDfa'

interface TransitionMatrixViewProps {
  matrix: TransitionMatrix
  steps: TransitionStep[]
  states: State[]
}

export function TransitionMatrixView({ matrix, steps, states }: TransitionMatrixViewProps) {
  const visitedCells = new Set(steps.map((step) => `${step.fromState}-${step.symbol}`))
  const latestStep = steps.length > 0 ? steps[steps.length - 1] : undefined

  return (
    <div className="matrix-table">
      <div className="matrix-legend">
        <span className="chip chip-visited">Visitado</span>
        <span className="chip chip-active">Transição atual</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              {alphabet.map((symbol) => (
                <th key={symbol}>{symbol}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((state) => (
              <tr key={state}>
                <th>{state}</th>
                {alphabet.map((symbol) => {
                  const key = `${state}-${symbol}`
                  const isVisited = visitedCells.has(key)
                  const isActive =
                    latestStep?.fromState === state && latestStep?.symbol === symbol

                  const className = [
                    'matrix-cell',
                    isVisited ? 'matrix-cell--visited' : '',
                    isActive ? 'matrix-cell--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <td key={symbol} className={className}>
                      {matrix[state][symbol]}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
