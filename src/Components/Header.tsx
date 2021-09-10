import React from 'react'
import { signOut } from 'firebase/auth'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import KeyIcon from '@material-ui/icons/VpnKey'
import Button from '@material-ui/core/Button'

import { auth } from '../Firebase'
import { useAuthChange } from '../Hooks/useAuthChange'

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

export default function Header() {
  const classes = useStyles()

  const { user } = useAuthChange(auth)

  const googleSignOut = () => signOut(auth).catch((err) => console.log(err))

  return (
    <AppBar position='relative'>
      <Toolbar>
        <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
          <KeyIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          PasswordKeeper
        </Typography>

        <div>
          <IconButton aria-label='account of current user' aria-controls='menu-appbar' color='inherit'>
            <Avatar alt={`${user?.displayName}`} src={`${user?.photoURL}`} />
          </IconButton>
          <Button onClick={googleSignOut} color='inherit'>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}
