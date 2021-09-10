import { useEffect, useMemo, useReducer } from 'react'
import { Auth, User, onAuthStateChanged } from 'firebase/auth'

type State = {
  loading: boolean
  error: string
  user: User | null
}

type Action = { type: 'user'; usr: User | null } | { type: 'error'; err: string }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'user':
      return {
        loading: false,
        error: '',
        user: action.usr
      }
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.err
      }
    default:
      return state
  }
}

/**
 * `useAuthChange` - Custom React Hook to retrieve and monitor the authentication state from Firebase.
 *
 * @param auth - Interface representing Firebase Auth service.
 * @returns An `Object` containing 3 values:
 *
 * - `user`: An `Object` The firebase authenticated User if logged in or `null` if not.
 * - `loading`: A `boolean` that indicate whether the the authentication state is still loaded.
 * - `error`: A `string` firebase auth error message returned by Firebase or `''` if not.
 *
 */
export const useAuthChange = (auth: Auth) => {
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    user: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (usr) => (usr ? dispatch({ type: 'user', usr }) : dispatch({ type: 'user', usr: null })),
      (err) => dispatch({ type: 'error', err: err.message })
    )

    return () => unsubscribe()
  }, [auth])

  return useMemo(() => {
    return {
      loading,
      error,
      user
    }
  }, [loading, error, user])
}
