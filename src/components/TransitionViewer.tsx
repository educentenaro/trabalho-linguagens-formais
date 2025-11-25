import type { State, TransitionStep } from '../automaton/lexicalDfa'

interface TransitionViewerProps {
  steps: TransitionStep[]
  currentState: State
}

export function TransitionViewer({ steps, currentState }: TransitionViewerProps) {
  return (
    <div className="card">
      <h2>Transições do token</h2>
      {steps.length === 0 ? (
        <p>Nenhum símbolo lido até o momento.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Símbolo</th>
                <th>Estado atual</th>
                <th>Próximo estado</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={`${step.index}-${step.symbol}-${step.fromState}`}>
                  <td>{step.index + 1}</td>
                  <td>{step.symbol}</td>
                  <td>{step.fromState}</td>
                  <td>{step.toState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="current-state">Estado atual: {currentState}</p>
    </div>
  )
}
