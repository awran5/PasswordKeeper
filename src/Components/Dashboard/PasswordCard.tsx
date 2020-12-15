import React from 'react'
import CryptoJS from 'crypto-js'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    padding: theme.spacing(1, 2),
    flexDirection: 'column',
  },
  cardAction: {
    marginLeft: 'auto',
  },
}))

export default function PasswordCard({ handleModal, storedValues }: PasswordCardProps) {
  const classes = useStyles()

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, title: string, password: string) => {
    if (!navigator.clipboard || password === '' || title === '') return

    const button = event.target as HTMLInputElement

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(password, title)
    const decryptPassword = bytes.toString(CryptoJS.enc.Utf8)

    navigator.clipboard.writeText(decryptPassword).then(
      () => (button.innerText = 'copied'),
      (err) => console.error('Could not copy text: ', err)
    )

    setTimeout(() => (button.innerText = 'copy'), 1000)
  }

  return (
    <Grid container spacing={2}>
      {storedValues.length > 0 ? (
        storedValues.map(({ title, password, createdAt }, index) => {
          const time = new Date(createdAt.seconds * 1000)

          return (
            <Grid item key={index} xs={12} sm={6}>
              <Card className={classes.card}>
                <Typography variant='subtitle1' component='h6'>
                  {title}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {time.toLocaleString()}
                </Typography>

                <CardActions className={classes.cardAction}>
                  <Button
                    size='small'
                    variant='outlined'
                    color='secondary'
                    onClick={() => handleModal('remove', index)}
                  >
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
          )
        })
      ) : (
        <Typography variant='h5' align='center' color='textSecondary' style={{ width: '100%' }}>
          No Passwords
        </Typography>
      )}
    </Grid>
  )
}
