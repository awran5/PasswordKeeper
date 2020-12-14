import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

interface LayoutProps {
  children: React.ReactNode
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}))

export default function Layout({ children }: LayoutProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />

      {children}
    </div>
  )
}
