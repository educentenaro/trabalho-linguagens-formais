import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { TokenEvaluation } from './automaton/lexicalDfa'
import { evaluateToken, getTransitionMatrix, states } from './automaton/lexicalDfa'
import { TokenHistory } from './components/TokenHistory'
import { TokenInput } from './components/TokenInput'
import { TokenResult } from './components/TokenResult'
import { TransitionMatrixView } from './components/TransitionMatrixView'
import { TransitionViewer } from './components/TransitionViewer'

function App() {
  const [currentToken, setCurrentToken] = useState('')
  const [currentEvaluation, setCurrentEvaluation] = useState(() =>
    evaluateToken(''),
  )
  const [history, setHistory] = useState<TokenEvaluation[]>([])
  const [showMatrix, setShowMatrix] = useState(false)

  const transitionMatrix = useMemo(() => getTransitionMatrix(), [])
  const statesForMatrix = states

  const updateToken = (value: string) => {
    setCurrentToken(value)
    setCurrentEvaluation(evaluateToken(value))
  }

  const resetToken = () => {
    setCurrentToken('')
    setCurrentEvaluation(evaluateToken(''))
  }

  const finalizeToken = () => {
    if (!currentToken) {
      return
    }

    const evaluation = evaluateToken(currentToken)
    setHistory((previous) => [evaluation, ...previous])
    resetToken()
  }

  const clearHistory = () => {
    setHistory([])
  }

  useEffect(() => {
    if (showMatrix) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [showMatrix])

  return (
    <main className="ai-app">
      <header className="hero">
        <h1>Analisador Léxico</h1>
        <p className="hero-sub">DFA para identificar o padrão <code>"qu" + vogal</code> em palavras do português. Digite letras e acompanhe em tempo real como o autômato navega pelos estados. Pressione <kbd>Enter</kbd> ou <kbd>Espaço</kbd> para enviar.</p>
      </header>

      <div className="chat-layout">
        <div className="chat-window" aria-live="polite">
          {history.length === 0 && !currentToken && (
            <div className="message assistant intro">
              <div className="message-body">
                <p>Olá! Comece digitando uma palavra que contenha (ou não) a sequência <strong>qu</strong> seguida de uma vogal. Vou mostrar cada transição como se fosse um pensamento interno do autômato.</p>
                <p>Exemplos aceitos: <strong>quando</strong>, <strong>aqui</strong>, <strong>pequeno</strong>, <strong>quero</strong>.</p>
              </div>
            </div>
          )}

          {/* Mensagem em tempo real enquanto digita */}
          {currentToken && (
            <div className="message assistant live">
              <div className="message-meta">Autômato em execução…</div>
              <div className="message-body stack">
                <TokenResult
                  token={currentToken}
                  finalState={currentEvaluation.finalState}
                  accepted={currentEvaluation.accepted}
                  stepsCount={currentEvaluation.steps.length}
                />
                <TransitionViewer
                  steps={currentEvaluation.steps}
                  currentState={currentEvaluation.finalState}
                />
              </div>
            </div>
          )}

          {/* Histórico como mensagens */}
          <TokenHistory history={history} onClear={clearHistory} />
        </div>

        <div className="input-panel">
          <TokenInput
            value={currentToken}
            onTokenChange={updateToken}
            onFinalizeToken={finalizeToken}
            onResetToken={resetToken}
          />
          <button
            type="button"
            className="toggle-matrix"
            onClick={() => setShowMatrix((v) => !v)}
          >
            {showMatrix ? 'Esconder matriz de transição' : 'Mostrar matriz de transição'}
          </button>
        </div>
      </div>

      {showMatrix && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="matrixTitle"
        >
          <div className="modal-container matrix-panel">
            <button
              type="button"
              className="modal-close"
              aria-label="Fechar matriz"
              onClick={() => setShowMatrix(false)}
            >
              ×
            </button>
            <div className="panel-header">
              <h2 id="matrixTitle">Matriz de Transição</h2>
              <p>A matriz realça: azul claro = transições já percorridas; azul escuro = última transição.</p>
            </div>
            <TransitionMatrixView
              matrix={transitionMatrix}
              steps={currentEvaluation.steps}
              states={statesForMatrix}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default App
