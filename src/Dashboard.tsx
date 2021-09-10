import React, { useEffect, useReducer } from 'react'
import { User } from 'firebase/auth'
import { onSnapshot, updateDoc } from 'firebase/firestore'

import Loading from './Components/Loading'
import { docRef, PasswordList } from './Firebase'

import Header from './Components/Header'
import Hero from './Components/Hero'
import Content from './Components/Content'
import Footer from './Components/Footer'

type State = {
  dbLoading: boolean
  dbError: string
  data: PasswordList[]
  modal: boolean
  id: number
}

type Action =
  | { type: 'snapshot'; data: PasswordList[] }
  | { type: 'db-error'; err: string }
  | { type: 'close-modal'; data: PasswordList[] }
  | { type: 'remove'; index: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'snapshot':
      return {
        ...state,
        dbLoading: false,
        data: action.data
      }
    case 'db-error':
      return {
        ...state,
        dbLoading: false,
        dbError: action.err
      }

    case 'close-modal':
      return {
        ...state,
        modal: false,
        data: action.data
      }

    case 'remove':
      return {
        ...state,
        modal: true,
        id: action.index
      }
    default:
      return state
  }
}

interface Props {
  user: User
}

export default function Dashboard({ user }: Props) {
  const [{ dbLoading, dbError, data, modal, id }, dispatch] = useReducer(reducer, {
    dbLoading: true,
    dbError: '',
    data: [],
    modal: false,
    id: 0
  })

  useEffect(() => {
    if (!user) return () => {}

    const unsubscribe = onSnapshot(
      docRef(user.uid),
      (snapshot) => dispatch({ type: 'snapshot', data: snapshot.data()?.passwordList }),
      (err) => dispatch({ type: 'db-error', err: err.message })
    )

    return () => unsubscribe()
  }, [user])

  const handleRemove = (index: number) => dispatch({ type: 'remove', index })

  const handleClose = () => dispatch({ type: 'close-modal', data })

  const handleSubmit = async () => {
    const newPasswordList = data.filter((_, index) => index !== id)

    await updateDoc(docRef(user?.uid), {
      passwordList: newPasswordList
    })
      .then(() => dispatch({ type: 'close-modal', data: newPasswordList }))
      .catch((err) => console.log(err))
  }

  if (dbError) return <h1>Error: {dbError}</h1>

  return (
    <>
      <Header />
      <Hero uid={user.uid} passwordList={data} />
      {dbLoading ? (
        <Loading />
      ) : (
        <Content
          passwordList={data}
          handleSubmit={handleSubmit}
          handleRemove={handleRemove}
          handleClose={handleClose}
          modal={modal}
        />
      )}
      <Footer />
    </>
  )
}
