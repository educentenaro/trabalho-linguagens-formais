import type { TokenEvaluation } from '../automaton/lexicalDfa'

interface TokenHistoryProps {
  history: TokenEvaluation[]
  onClear: () => void
}

export function TokenHistory({ history, onClear }: TokenHistoryProps) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Histórico de tokens</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="small">
            Limpar
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p>Nenhum token finalizado ainda.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Estado final</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={`${item.token}-${index}`}>
                  <td>{item.token}</td>
                  <td>{item.finalState}</td>
                  <td>
                    <span className={item.accepted ? 'accepted' : 'rejected'}>
                      {item.accepted ? 'Aceito' : 'Rejeitado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
