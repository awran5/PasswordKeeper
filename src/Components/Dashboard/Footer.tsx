import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    padding: theme.spacing(3),
    marginTop: 'auto',
    backgroundColor: '#fff',
  },
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <Container maxWidth='md'>
        <Typography variant='h6' align='center'>
          Password<b>Keeper</b>
        </Typography>
        <Typography variant='body2' align='center' color='textSecondary' gutterBottom style={{ padding: 10 }}>
          All passwords are stored in the cloud{' '}
          <Link
            title='Firebase'
            href='https://console.firebase.google.com/'
            component='a'
            rel='noopener noreferrer'
            target='_blank'
          >
            Firebase
          </Link>{' '}
          database, hashed by{' '}
          <Link title='crypto' href='https://www.npmjs.com/package/crypto-js'>
            cryptoJS{' '}
          </Link>
          and bounded to this account only.
        </Typography>

        <Typography variant='body2' color='textSecondary' align='center'>
          <Link color='inherit' href='https://github.com/awran5/'>
            Github
          </Link>
        </Typography>
      </Container>
    </footer>
  )
}
