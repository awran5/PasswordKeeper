import React from 'react'
import CryptoJS from 'crypto-js'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { PasswordList } from '../Firebase'
import { timeFormat } from '../helper'

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexGrow: 1
  },
  card: {
    height: '100%',
    display: 'flex',
    padding: theme.spacing(1, 2),
    flexDirection: 'column'
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  cardAction: {
    marginLeft: 'auto'
  }
}))

interface ContentProps {
  passwordList: PasswordList[]
  handleSubmit: () => void
  handleRemove: (index: number) => void
  handleClose: () => void
  modal: boolean
}

export default function Content({ passwordList, handleSubmit, handleRemove, handleClose, modal }: ContentProps) {
  const classes = useStyles()

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>, title: string, password: string) => {
    if (!navigator.clipboard || password === '' || title === '') return

    const button = event.currentTarget

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(password, title)
    const decryptPassword = bytes.toString(CryptoJS.enc.Utf8)

    navigator.clipboard.writeText(decryptPassword).then(
      () => {
        button.innerText = 'copied'
      },
      (err) => console.error('Could not copy text: ', err)
    )

    setTimeout(() => {
      button.innerText = 'copy'
    }, 1000)
  }

  return (
    <main className={classes.main}>
      <Container maxWidth='md' className={classes.cardGrid}>
        <Grid container spacing={2}>
          {passwordList.length > 0 ? (
            passwordList.map(({ title, password, createdAt }, index) => (
              <Grid item key={title} xs={12} sm={6}>
                <Card className={classes.card}>
                  <Typography variant='subtitle1' component='h6'>
                    {title}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Created: {timeFormat(createdAt.seconds)}
                  </Typography>

                  <CardActions className={classes.cardAction}>
                    <Button size='small' variant='outlined' color='secondary' onClick={() => handleRemove(index)}>
                      remove
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      color='primary'
                      onClick={(event) => handleCopy(event, title, password)}
                    >
                      copy
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant='h5' align='center' color='textSecondary' style={{ width: '100%' }}>
              No Saved Passwords
            </Typography>
          )}
        </Grid>
      </Container>
      <Dialog open={modal} onClose={() => handleClose()}>
        <DialogTitle>Delete Password</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions style={{ margin: 15 }}>
          <Button onClick={() => handleClose()} color='default' variant='contained'>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} color='secondary' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  )
}
