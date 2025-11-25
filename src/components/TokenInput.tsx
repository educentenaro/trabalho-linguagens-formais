import type { ChangeEvent, KeyboardEvent } from 'react'

interface TokenInputProps {
  value: string
  onTokenChange: (value: string) => void
  onFinalizeToken: () => void
  onResetToken: () => void
}

export function TokenInput({
  value,
  onTokenChange,
  onFinalizeToken,
  onResetToken,
}: TokenInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitized = event.target.value
      .toLowerCase()
      .replace(/[^a-z]/g, '')

    onTokenChange(sanitized)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onFinalizeToken()
    }
  }

  return (
    <div className="card token-input-inline">
      <label htmlFor="tokenInput">Digite um token (letras a-z):</label>
      <div
        className="input-inline"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
      >
        <input
          id="tokenInput"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escreva e pressione Enter ou Espaço para validar"
          autoFocus
          style={{ flex: 1, minWidth: 0 }}
        />
        <div className="actions-inline" style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={onFinalizeToken} disabled={!value}>
        Verificar
          </button>
          <button
        type="button"
        onClick={onResetToken}
        disabled={!value}
        className="secondary"
          >
        Limpar
          </button>
        </div>
      </div>
    </div>
  )
}
