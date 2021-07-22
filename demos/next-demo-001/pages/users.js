import { Component } from 'react'
import { injectIntl } from 'react-intl'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'

import Layout from '../components/common/layout'
import UserInput from '../components/users/user-input'
import UserItem from '../components/users/user-item'

import withUsers from '../api/users'

const defaultRowsOfPage = 10

class Users extends Component {
  static async getInitialProps ({ users }) {
    const result = await users.list({
      page: 1,
      rowsPerPage: defaultRowsOfPage
    }) || {}

    return result
  }

  constructor(props = {}) {
    super()
    const {
      list = [],
      ...result
    } = props
    this.state = {
      list,
      ...result,
      adding: false,
      current: null,
    }
  }

  async queryList (params = { page: 1, rowsOfPage: defaultRowsOfPage}) {
    const result = await this.props.users.list(params) || {}

    this.setState({
      list: [],
      ...result
    })
  }

  render () {
    const {
      props: {
        classes,
        intl: {
          formatMessage
        }
      },
      state: {
        list,
        page = 1,
        rowsOfPage = defaultRowsOfPage,
        totalRecord = 0,
        totalPage = 0,
        adding,
        current
      },
    } = this

    return (
      <Layout title={formatMessage({ id: 'users.title' })}>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ adding: true })}
          >添加用户信息</Button>
        </div>
        <UserInput
          adding={adding}
          onClose={() => this.setState({ adding: false })}
          onFinish={() => {
            this.setState({ adding: false})
            this.queryList()
          }}
        />

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>name</TableCell>
                <TableCell>age</TableCell>
                <TableCell>gender</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map(item => (
                <UserItem
                  item={item}
                  key={item.id}
                  current={current}
                  onFinish={this.queryList.bind(this)}
                  onSetCurrent={current => this.setState({ current })}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[ 2, 5, 10 ]}
                  colSpan={5}
                  count={totalRecord}
                  rowsPerPage={rowsOfPage}
                  page={page - 1}
                  SelectProps={{
                    native: false
                  }}
                  onChangePage={(event, newPage) => {
                    this.queryList({
                      page: newPage + 1,
                      rowsOfPage
                    })
                  }}
                  onChangeRowsPerPage={(event, { props: { value } }) => {
                    this.queryList({
                      page,
                      rowsOfPage: value
                    })
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Layout>
    )
  }
}

const styles = () => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 400,
    textAlign: 'center'
  }
})

export default withUsers(injectIntl(withStyles(styles)(Users)))
