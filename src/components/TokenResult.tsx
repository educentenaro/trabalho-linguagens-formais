import type { State } from '../automaton/lexicalDfa'

interface TokenResultProps {
  token: string
  finalState: State
  accepted: boolean
  stepsCount: number
}

export function TokenResult({ token, finalState, accepted, stepsCount }: TokenResultProps) {
  const hasInput = token.length > 0

  return (
    <div className="card">
      <h2>Resultado parcial</h2>
      {!hasInput ? (
        <p>Digite um token e pressione espaço para validar.</p>
      ) : (
        <ul className="status-list">
          <li>
            Token atual: <strong>{token}</strong>
          </li>
          <li>
            Símbolos processados: <strong>{stepsCount}</strong>
          </li>
          <li>
            Estado final: <strong>{finalState}</strong>
          </li>
          <li>
            Situação:{' '}
            <strong className={accepted ? 'accepted' : 'rejected'}>
              {accepted ? 'Aceito' : 'Em processamento ou rejeitado'}
            </strong>
          </li>
        </ul>
      )}
    </div>
  )
}
