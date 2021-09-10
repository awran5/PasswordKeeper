import React, { useState, useReducer, useCallback } from 'react'
import { arrayUnion, Timestamp, updateDoc } from 'firebase/firestore'
import CryptoJS from 'crypto-js'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FilledInput from '@material-ui/core/FilledInput'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CopyIcon from '@material-ui/icons/FileCopy'
import { generatePassword } from '../helper'

import { docRef, PasswordList } from '../Firebase'

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 4)
  },

  heroButtons: {
    marginTop: theme.spacing(3)
  }
}))

type State = {
  modal: boolean
  isCopy: boolean
}

type Action = { type: 'open' } | { type: 'close' } | { type: 'copy' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        modal: true
      }
    case 'close':
      return {
        ...state,
        modal: false
      }
    case 'copy':
      return {
        ...state,
        isCopy: !state.isCopy
      }
    default:
      return state
  }
}

const initialValues = {
  id: 0,
  title: '',
  password: '',
  length: 15,
  uppercase: true,
  numbers: true,
  symbols: true
}

const initialErrorValues = {
  title: '',
  length: '',
  password: ''
}

type HeroProps = {
  uid: string
  passwordList: PasswordList[]
}

export default function Hero({ uid, passwordList }: HeroProps) {
  const classes = useStyles()

  const [inputValues, setInputValues] = useState(initialValues)
  const [inputErrors, setInputErrors] = useState(initialErrorValues)
  const [{ modal, isCopy }, dispatch] = useReducer(reducer, {
    modal: false,
    isCopy: false
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, checked, value, name } = event.target

    setInputValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleGenerate = useCallback(() => {
    setInputErrors(initialErrorValues)
    const { length, uppercase, numbers, symbols } = inputValues

    let error = ''

    if (length <= 6) {
      error = 'Password length must be at least 8 characters'
    } else if (length > 25) {
      error = 'Maximum length allowed is 25 characters'
    }

    if (error) {
      return setInputErrors((prev) => ({
        ...prev,
        length: error
      }))
    }

    return setInputValues((prev) => ({
      ...prev,
      password: generatePassword(length, uppercase, numbers, symbols)
    }))
  }, [inputValues])

  const handleCopy = (password: string) => {
    if (!navigator.clipboard || password === '') return

    navigator.clipboard.writeText(password).then(
      () => dispatch({ type: 'copy' }),
      (err) => console.error('Could not copy text: ', err)
    )
    setTimeout(() => dispatch({ type: 'copy' }), 2000)
  }

  const handleAdd = () => {
    const { title, password } = inputValues

    const titleExists = passwordList.find((item) => item.title === title)

    if (titleExists) {
      return setInputErrors((prev) => ({
        ...prev,
        title: 'Title is already exist.'
      }))
    }

    if (!title) {
      return setInputErrors((prev) => ({
        ...prev,
        title: 'Please add a title.'
      }))
    }

    if (!password) {
      return setInputErrors((prev) => ({
        ...prev,
        password: 'Please generate a password first.'
      }))
    }

    // Encrypt
    const encryptedPassword = CryptoJS.AES.encrypt(password, title).toString()
    return updateDoc(docRef(uid), {
      passwordList: arrayUnion({
        title,
        password: encryptedPassword,
        createdAt: Timestamp.fromDate(new Date())
      })
    })
      .then(() => handleClose())
      .catch((err) => console.log('Error adding document: ', err))
  }

  const handleClose = () => {
    setInputValues(initialValues)
    setInputErrors(initialErrorValues)
    dispatch({ type: 'close' })
  }

  return (
    <div className={classes.heroContent}>
      <Container maxWidth='sm'>
        <Typography variant='h5' align='center' gutterBottom>
          Add New Password
        </Typography>
        <Typography variant='body2' color='textSecondary' align='center'>
          Generate and store strong passwords and access from anywhere!
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item>
              <IconButton aria-label='add' onClick={() => dispatch({ type: 'open' })} color='primary'>
                <AddIcon fontSize='large' />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      </Container>

      <Dialog open={modal} onClose={handleClose}>
        <DialogTitle>Add New Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please note that it&apos;s always recommended that you shouldn&apos;t use any online service to generate
            passwords for highly sensitive information.
          </DialogContentText>

          <>
            <TextField
              autoFocus
              required
              margin='normal'
              label='Title'
              placeholder='Add a password title'
              name='title'
              value={inputValues.title}
              onChange={handleChange}
              fullWidth
              variant='outlined'
              error={!!inputErrors.title}
              helperText={inputErrors.title || 'Title is required in order to store the password.'}
            />
            <TextField
              margin='normal'
              label='Password Length'
              type='number'
              fullWidth
              onChange={handleChange}
              name='length'
              value={inputValues.length}
              variant='outlined'
              error={!!inputErrors.length}
              helperText={inputErrors.length || ''}
            />

            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={inputValues.uppercase} onChange={handleChange} name='uppercase' />}
                label='Uppercase'
              />
              <FormControlLabel
                control={<Checkbox checked={inputValues.numbers} onChange={handleChange} name='numbers' />}
                label='Numbers'
              />
              <FormControlLabel
                control={<Checkbox checked={inputValues.symbols} onChange={handleChange} name='symbols' />}
                label='Symbols'
              />
              <FormHelperText>
                Use a minimum password length of 10 or more characters and always keep lowercase, uppercase, numbers and
                symbols if allowed.
              </FormHelperText>
            </FormGroup>

            <Button
              onClick={() => handleGenerate()}
              color='secondary'
              variant='contained'
              style={{ margin: '30px 0', display: 'block' }}
              size='large'
              fullWidth
            >
              Generate
            </Button>
            <FormControl variant='filled' fullWidth margin='normal'>
              <InputLabel>Password</InputLabel>
              <FilledInput
                error={!!inputErrors.password}
                name='password'
                value={inputValues.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => handleCopy(inputValues.password)}
                      edge='end'
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {isCopy && <FormHelperText style={{ color: '#3f51b5' }}>Copied</FormHelperText>}
              {inputErrors.password && <FormHelperText error>Please generate a Password.</FormHelperText>}
            </FormControl>
          </>
        </DialogContent>
        <DialogActions style={{ margin: 15 }}>
          <Button onClick={handleClose} color='default' variant='contained'>
            Cancel
          </Button>
          <Button onClick={() => handleAdd()} color='primary' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
