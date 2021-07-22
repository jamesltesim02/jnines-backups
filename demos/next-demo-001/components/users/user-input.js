import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'

import withUsers from '../../api/users'


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

export default withUsers(function UserInput ({
  users,
  adding,
  onClose = () => {},
  onFinish = () => {},
  onError = () => {}
}) {
  const classes = useStyles()

  const [user, setUser] = React.useState({
    id: `u${parseInt(Math.random() * 999 + 1000)}`,
    name: '李四',
    age: 18,
    gender: 'male'
  })

  const handleValueChange = name => ({ target: {value} }) => {
    setUser({
      ...user,
      [name]: value
    })
  }

  const { enqueueSnackbar } = useSnackbar()
  const handleSave = async () => {
    try {
      const result = await users.add(user)
      enqueueSnackbar('添加成功', { variant: 'success' })
      onFinish(result)
    } catch (err) {
      onError(err)
    }
  }

  return (
    <Dialog
      open={adding}
      onClose={onClose}
    >
      <DialogTitle>添加用户信息</DialogTitle> 
      <DialogContent>
        <DialogContentText>用于测试接口以及material ui功能</DialogContentText>
        <form
          className={classes.container}
          autoComplete="off"
        >
          <TextField
            autoFocus
            margin="dense"
            id="id" 
            label="ID"
            type="text"
            fullWidth
            variant="outlined"
            className={classes.textField}
            value={user.id}
            onChange={handleValueChange('id')}
          />
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            className={classes.textField}
            value={user.name}
            onChange={handleValueChange('name')}
          />
          <TextField
            margin="dense"
            id="age"
            label="Age"
            type="number"
            fullWidth
            variant="outlined"
            className={classes.textField}
            value={user.age}
            onChange={({ target }) => handleValueChange('age')({ target: { value: +target.value }})}
          />
          <TextField
            select
            label="Gender"
            variant="outlined"
            className={classes.textField}
            value={''}
            fullWidth
            margin="normal"
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            value={user.gender}
            onChange={handleValueChange('gender')}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >Save</Button>
      </DialogActions>
    </Dialog>
  )
})
