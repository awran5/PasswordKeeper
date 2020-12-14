import React, { useState } from 'react'
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

export default function Modal({
  modal = false,
  isRemove = false,
  isSubmit = false,
  handleModal,
  handleReset,
  handleSubmit,
  handleChange,
  handleGenerate,
  inputValues = {
    id: 0,
    title: '',
    password: '',
    length: 20,
    uppercase: true,
    numbers: true,
    symbols: true,
  },
  inputErrors = {
    title: '',
    length: '',
    password: '',
  },
}: ModalProps) {
  const [isCopy, setCopy] = useState(false)

  const handleCopy = (password: string) => {
    if (!navigator.clipboard || password === '') return

    navigator.clipboard.writeText(password).then(
      () => setCopy(true),
      (err) => console.error('Could not copy text: ', err)
    )
    setTimeout(() => setCopy(false), 2000)
  }

  return (
    <Dialog open={modal} onClose={() => handleModal('close')} onExited={handleReset}>
      <DialogTitle>{isRemove ? 'Delete Password' : 'Add New Password'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isRemove
            ? 'Are you sure you want to delete this item? '
            : "Please note that it's always recommended that you shouldn't use any online service to generate passwords for highly sensitive information."}
        </DialogContentText>
        {isRemove ? null : (
          <React.Fragment>
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
              helperText={!!inputErrors.title ? inputErrors.title : 'Title is required in order to store the password.'}
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
              helperText={!!inputErrors.length ? inputErrors.length : ''}
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
              <FormHelperText error={!!inputErrors.password}>
                {!!inputErrors.password ? inputErrors.password : isCopy ? 'Copied' : ''}
              </FormHelperText>
            </FormControl>
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions style={{ margin: 15 }}>
        <Button onClick={() => handleModal('close')} color='default' variant='contained'>
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color={isRemove ? 'secondary' : 'primary'}
          disabled={isSubmit}
          variant='contained'
        >
          {isRemove ? 'Delete' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
