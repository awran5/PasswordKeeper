import React from 'react'
import Loading from './Components/Loading'
import Dashboard from './Dashboard'
import SignIn from './SignIn'
import { useAuthChange } from './Hooks/useAuthChange'
import { auth } from './Firebase'

const App = () => {
  const { error, loading, user } = useAuthChange(auth)

  if (error) return <h1>Error: {error}</h1>
  if (loading) return <Loading full />

  return <>{user ? <Dashboard user={user} /> : <SignIn />}</>
}

export default App
