import { useIntl } from 'react-intl'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import withApi from '../../api'

import LocaledLink from '../../components/common/localed-router'
import SubPage from '../../components/common/sub-page'
import MoreButton from '../../components/common/more-button'
import LineHolder from '../../components/common/line-holder'
import Slider from '../../components/common/slider'
import ButtonArea from '../../components/common/button-area'

import GuruItem from '../../components/gurus/item'

import IconSearch from '../../components/icons/icon-search'
import IconNotes from '../../components/icons/icon-notes'

const useStyles = makeStyles(
  ({ palette: { primary }}) => ({
    content: {
      padding: 0
    },
    searchbar: {
      display: 'grid',
      gridTemplateColumns: '1fr 50px',
      padding: '9px 0 9px 15px',
      position: 'relative',
      height: 50,
      backgroundColor: primary.main,
      '& > i': {
        position: 'absolute',
        filter: 'brightness(.5)',
        top: '50%',
        left: 25,
        transform: 'translateY(-50%)',
      },
      '& > input': {
        border: 'none',
        borderRadius: 4,
        paddingLeft: 34,
        fontSize: 14
      },
      '& > button': {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        borderRadius: 4
      }
    },
    cancelRipple: {
      color: '#fff'
    },
    item: {
      border: 'none',
      borderRadius: 0,
      marginBottom: 10,
      background: '#fff'
    }
  }),
  { name: 'Gurus' }
)

function GurusPage ({
  api: { guru },
  initGurus = {
    currentCount: 0,
    currentPage: 1,
    list: []
  }
}) {
  const classes = useStyles()
  const intl = useIntl()
  const [data, setData] = React.useState(initGurus)
  const [loading, setLoading] = React.useState(false)
  const [lastKeyword, setLastKeyword] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [searching, setSearching] = React.useState(false) 

  const loadMore = async (pageIndex) => {
    setLoading(true)
    try {
      const newData = await guru.list({
        nickName: keyword,
        pageSize: data.currentCount,
        pageIndex
      })
      if (pageIndex > 1) {
        newData.list = [...data.list, ...newData.list]
      }
      setData(newData)
      setLastKeyword(keyword)
    } finally {
      setLoading(false)
    }
  }

  const [stimer, setStimer] = React.useState(null)
  React.useEffect(
    () => {
      clearTimeout(stimer)
      if (lastKeyword === keyword && data.currentPage === 1) {
        return
      }
      setStimer(setTimeout(() => loadMore(1), 1000))
    },
    [keyword]
  )

  const options = (
    <>
      <div className={classes.search}>
        <IconButton
          color="inherit"
          onClick={() => setSearching(true)}
        >
          <IconSearch />
        </IconButton>
      </div>
      <LocaledLink href="/gurus/description">
        <IconButton color="inherit"><IconNotes /></IconButton>
      </LocaledLink>
    </>
  )

  return (
    <>
      <SubPage
        titleKey="gurus.title"
        options={options}
        padding={0}
      >
        <LineHolder />
        {
          data.list.map(item => (
            <GuruItem
              key={item.ticketId}
              item={item}
              className={classes.item}
              attentionable
              followable
            />
          ))
        }
        <MoreButton
          data={data}
          loading={loading}
          onClick={() => loadMore(data.currentPage + 1)}
        />
      </SubPage>
      <Slider
        open={searching}
        onClose={() => setSearching(false)}
        direction="down"
      >
        <div className={classes.searchbar}>
          <IconSearch size={16} />
          <input
            placeholder={intl.formatMessage({id: 'gurus.searchHolder'})}
            onChange={({ target: { value } }) => setKeyword(value)}
          />
          <ButtonArea
            classes={{
              ripple: classes.cancelRipple
            }}
            onClick={() => setSearching(false)}
          >取消</ButtonArea>
        </div>
      </Slider>
    </>
  )
}

GurusPage.getInitialProps = async ({
  api: { guru }
}) => {
  return {
    initGurus: await guru.list()
  }
}

export default withApi('guru')(GurusPage)
