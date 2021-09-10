import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

interface LoadingProps {
  full?: boolean
  size?: number
}

const useStyles = makeStyles(() => ({
  full: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  part: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    width: 'inherit'
  }
}))

const Loading = ({ full, size = 60 }: LoadingProps) => {
  const classes = useStyles()
  return (
    <div className={full ? classes.full : classes.part}>
      <CircularProgress size={size} />
    </div>
  )
}

export default Loading
