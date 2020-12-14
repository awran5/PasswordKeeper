import React, { useContext } from 'react'
import { AppContext } from './Context'
import { useAuthState } from 'react-firebase-hooks/auth'

import Loading from './Components/Loading'
import Dashboard from './Components/Dashboard'
import SignIn from './Components/SignIn'

const App = () => {
  const { Auth } = useContext(AppContext)
  const [user, loading, error] = useAuthState(Auth)

  if (error) return <h1>Error: {error}</h1>
  if (loading) return <Loading full />

  return <React.Fragment>{user ? <Dashboard /> : <SignIn />}</React.Fragment>
}

export default App
