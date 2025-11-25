export const alphabet = Array.from('abcdefghijklmnopqrstuvwxyz')

export type State =
  | 'q0'  // Estado inicial
  | 'q1'  // Leu a letra 'q'
  | 'q2'  // Leu 'qu' (q seguido de u)
  | 'q3'  // Estado final aceito: leu 'qu' + vogal (a, e, i, o, u)
  | 'q4'  // Estado normal (qualquer outra letra)
  | 'q5'  // Estado de erro

// Lógica: Aceita palavras que contêm a sequência "qu" seguida de uma vogal
// q0: início
// q1: acabou de ler 'q' (aguardando 'u')
// q2: leu 'qu' (aguardando vogal)
// q3: ACEITAÇÃO - leu 'qu' + vogal (a, e, i, o, u)
// q4: estado normal para outras letras
// q5: erro (símbolo fora do alfabeto)

export const states: State[] = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5']

export const initialState: State = 'q0'
export const acceptingStates: State[] = ['q3']
export const errorState: State = 'q5'

export type TransitionMatrix = Record<State, Record<string, State>>

export interface TransitionStep {
  index: number
  symbol: string
  fromState: State
  toState: State
}

export interface TokenEvaluation {
  token: string
  steps: TransitionStep[]
  finalState: State
  accepted: boolean
}

const transitionMatrix: TransitionMatrix = buildMatrix()

function buildMatrix(): TransitionMatrix {
  const matrix: TransitionMatrix = {} as TransitionMatrix

  states.forEach((state) => {
    matrix[state] = {} as Record<string, State>

    alphabet.forEach((symbol) => {
      matrix[state][symbol] = resolveTransition(state, symbol)
    })
  })

  return matrix
}

function resolveTransition(current: State, symbol: string): State {
  if (!alphabet.includes(symbol)) {
    return errorState
  }

  const isVowel = (char: string): boolean => {
    return ['a', 'e', 'i', 'o', 'u'].includes(char)
  }

  switch (current) {
    case 'q0': // Estado inicial
      if (symbol === 'q') return 'q1' // Encontrou 'q'
      return 'q4' // Qualquer outra letra -> estado normal
    
    case 'q1': // Acabou de ler 'q'
      if (symbol === 'u') return 'q2' // Leu 'qu'
      if (symbol === 'q') return 'q1' // Outro 'q'
      return 'q4' // Não formou 'qu'
    
    case 'q2': // Leu 'qu', aguardando vogal
      if (isVowel(symbol)) return 'q3' // Sucesso! 'qu' + vogal
      if (symbol === 'q') return 'q1' // Novo 'q' começa nova tentativa
      return 'q4' // Não é vogal, volta ao normal
    
    case 'q3': // Estado ACEITO (já encontrou 'qu' + vogal)
      // Continua aceitando e pode encontrar outra sequência 'qu'
      if (symbol === 'q') return 'q1'
      return 'q3' // Permanece aceito
    
    case 'q4': // Estado normal (outras letras)
      if (symbol === 'q') return 'q1' // Encontrou 'q', pode iniciar sequência
      return 'q4' // Continua normal
    
    case 'q5':
    default:
      return errorState
  }
}

export function getNextState(current: State, symbol: string): State {
  const normalized = symbol.toLowerCase()
  if (!alphabet.includes(normalized)) {
    return errorState
  }
  return transitionMatrix[current][normalized]
}

export function evaluateToken(rawToken: string): TokenEvaluation {
  const token = rawToken.toLowerCase().replace(/[^a-z]/g, '')
  const steps: TransitionStep[] = []
  let current = initialState

  for (const symbol of token) {
    const next = getNextState(current, symbol)
    steps.push({
      index: steps.length,
      symbol,
      fromState: current,
      toState: next,
    })
    current = next
  }

  const accepted = token.length > 0 && acceptingStates.includes(current)

  return {
    token,
    steps,
    finalState: current,
    accepted,
  }
}

export function getTransitionMatrix(): TransitionMatrix {
  return transitionMatrix
}
