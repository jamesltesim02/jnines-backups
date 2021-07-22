import React from 'react'
import { useIntl } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import withApi from '../../api'

import SubPage from '../../components/common/sub-page'
import SaveButton from '../../components/common/save-button'
import MenuItem from '../../components/profile/menu-item'

const useStyles = makeStyles(
  {
    editPanel: {
      padding: '0 10px'
    },
    text: {
      width: '100%'
    },
    label: {
      transform: 'translate(0, 40px) scale(1)'
    },
    input: {
      height: 48,
      paddingLeft: 10,
      lineHeight: '48px'
    },
    shrink: {
      transform: 'translate(0, 1.5px) scale(.75)',
      transformOrigin: 'top left'
    }
  },
  { name: 'AddressPage' }
)

const fields = [
  'recipient',
  'tel',
  'postCode',
  'address'
]

const patterns = {
  recipient: /^.{2,15}$/,
  tel: /^1\d{10}$/,
  postCode: /^\d{6}$/,
  address: /^.{3,}$/
}

const AddressPage = ({
  store: { toast },
  api: { shop },
  initAddress
}) => {
  const classes = useStyles()
  const intl = useIntl()

  const [address, setAddress] = React.useState(initAddress || {})
  const [editField, setEditField] = React.useState(null)

  const valueHolder = intl.formatMessage({ id: 'shop.holder' })

  const handleSubmit = async () => {
    const { name, value } = editField
    try {
      if (!patterns[name].test(value)) {
        toast.warning(intl.formatMessage({ id: 'shop.wrongContent' }))
        return
      }
      toast.loading()
      const result = await shop.saveAddress({
        _id: address._id,
        [editField.name]: editField.value
      })
      toast.success(intl.formatMessage({ id: 'shop.addressSuccess' }))
      setAddress(result)
      setEditField(null)
    } finally {
      toast.loading(false)
    }
  }

  return (
    <SubPage
      padding="10px 0 0"
      title={
        editField
        ? intl.formatMessage(
            { id: 'shop.editTitle'},
            { field: intl.formatMessage({ id: `shop.${editField.name}` })}
          )
        : intl.formatMessage({ id: 'shop.addressTitle' })
      }
      onBack={
        editField
        ? () => setEditField(null)
        : null
      }
    >
    {
      editField ? (
        <section className={classes.editPanel}>
          <TextField
            label={
              editField
              ? intl.formatMessage({ id: `shop.${editField.name}` })
              : valueHolder
            }
            className={classes.text}
            InputLabelProps={{
              classes: {
                root: classes.label,
                shrink: classes.shrink
              }
            }}
            InputProps={{
              classes: {
                input: classes.input
              }
            }}
            onChange={({ target: { value } }) => setEditField({ name: editField.name, value })}
            value={editField.value || ''}
          />
          <SaveButton onClick={handleSubmit} />
        </section>
      ) : (
        <>
          {
            fields.map((f, i) => (
              <MenuItem
                key={f}
                mainValue={intl.formatMessage({ id: `shop.${f}` })}
                secondaryValue={address[f] || valueHolder}
                borderd={i > 0}
                onClick={() => setEditField({ name: f, value: address[f] })}
              />
            ))
          }
        </>
      )
    }
    </SubPage>
  )
}

AddressPage.getInitialProps = async ({ api: { shop } }) => ({
  initAddress: await shop.getAddress()
})

export default withApi('shop')(
  inject('store')(
    observer(AddressPage)
  )
)
