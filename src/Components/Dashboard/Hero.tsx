import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 4),
  },

  heroButtons: {
    marginTop: theme.spacing(3),
  },
}))

export default function Hero({ handleModal }: HeroProps) {
  const classes = useStyles()

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
          <Grid container spacing={2} justify='center'>
            <Grid item>
              <IconButton aria-label='add' onClick={() => handleModal()} color='primary'>
                <AddIcon fontSize='large' />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}
