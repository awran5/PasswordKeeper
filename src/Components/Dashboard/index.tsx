import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../Context'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import CryptoJS from 'crypto-js'
import Container from '@material-ui/core/Container'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { generatePassword, isValidate } from '../../helper'
import Loading from '../Loading'
import Layout from '../Layout'
import Header from './Header'
import Hero from './Hero'
import PasswordCard from './PasswordCard'
import Modal from './Modal'
import Footer from './Footer'

const initialValues = {
  id: 0,
  title: '',
  password: '',
  length: 15,
  uppercase: true,
  numbers: true,
  symbols: true,
}

const initialErrorValues = {
  title: '',
  length: '',
  password: '',
}

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexGrow: 1,
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}))

export default function Dashboard() {
  const classes = useStyles()

  const { firebase, cloudRef, Auth } = useContext(AppContext)
  const [currentUser] = useAuthState(Auth)
  const query = cloudRef('users').orderBy('createdAt')
  const [users, loading] = useCollectionData<Users>(query, { idField: 'id' })

  const [modal, setModal] = useState(false)
  const [isRemove, setRemove] = useState(false)
  const [isSubmit, setSubmit] = useState(false)
  const [inputValues, setInputValues] = useState(initialValues)
  const [inputErrors, setInputErrors] = useState(initialErrorValues)
  const [storedValues, setStoredValues] = useState<Array<PasswordList>>([])

  useEffect(() => {
    if (!currentUser) return

    users && users.map((user) => user.id === currentUser.uid && setStoredValues(user.passwordList))
  }, [users, currentUser])

  const handleReset = () => {
    if (isRemove) setRemove(false)
    if (isSubmit) setSubmit(false)
    setInputValues(initialValues)
    setInputErrors(initialErrorValues)
    console.log('reset')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, checked, value, name } = event.target

    if (isSubmit) setSubmit(false)
    setInputErrors(initialErrorValues)

    setInputValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleModal: HandleModal = (action, index) => {
    setModal(true)

    if (action === 'remove') {
      setRemove(true)
      if (!index) return

      setInputValues((prev) => ({
        ...prev,
        id: index,
      }))
    } else if (action === 'close') {
      setModal(false)
    }
  }

  const handleGenerate = () => {
    setInputErrors(initialErrorValues)
    if (isSubmit) setSubmit(false)

    const { length, uppercase, numbers, symbols } = inputValues

    if (length <= 6) {
      setInputErrors((prev) => ({
        ...prev,
        length: 'Password length must be at least 8 characters',
      }))
      return
    } else if (length > 25) {
      setInputErrors((prev) => ({
        ...prev,
        length: 'Maximum length allowed is 25 characters',
      }))
      return
    } else {
      setInputValues((prev) => ({
        ...prev,
        password: generatePassword(length, uppercase, numbers, symbols),
      }))
    }
  }

  const handleAdd = async () => {
    const { title, password } = inputValues

    // Encrypt
    const encryptedPassword = CryptoJS.AES.encrypt(password, title).toString()

    await cloudRef('users')
      .doc(currentUser.uid)
      .update({
        passwordList: firebase.firestore.FieldValue.arrayUnion({
          title,
          password: encryptedPassword,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        }),
      })
      .then(() => setModal(false))
      .catch((error) => console.log('Error adding document: ', error))
  }

  const handleRemove = async () => {
    const { id } = initialValues

    const newPasswordList = storedValues.filter((_, i) => i !== id)

    await cloudRef('users')
      .doc(currentUser.uid)
      .update({
        passwordList: newPasswordList,
      })
      .then(() => setModal(false))
      .catch((error) => console.log('Error removing document: ', error))
  }

  const handleSubmit = async () => {
    setSubmit(true)

    if (isRemove) handleRemove()
    else {
      const errors = isValidate(storedValues, inputValues.title, inputValues.password)

      if (!!errors.titleError) {
        setInputErrors((prev) => ({
          ...prev,
          title: errors.titleError,
        }))
        return
      } else if (!!errors.passwordError) {
        setInputErrors((prev) => ({
          ...prev,
          password: errors.passwordError,
        }))
        return
      } else handleAdd()
    }
  }

  console.log(storedValues)

  return (
    <Layout>
      <Header />
      <Hero handleModal={handleModal} />
      <main className={classes.main}>
        <Container maxWidth='md' className={classes.cardGrid}>
          {!loading ? <PasswordCard handleModal={handleModal} storedValues={storedValues} /> : <Loading />}
        </Container>
      </main>
      <Modal
        modal={modal}
        isRemove={isRemove}
        isSubmit={isSubmit}
        handleModal={handleModal}
        handleReset={handleReset}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleGenerate={handleGenerate}
        inputValues={inputValues}
        inputErrors={inputErrors}
      />
      <Footer />
    </Layout>
  )
}
