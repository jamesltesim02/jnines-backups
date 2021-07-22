import { T } from 'react-toast-mobile'
import Layout from '../components/common/layout'


export default () => (
  <Layout title="Toast papge.">
    Toast page.
    <br />
    <button onClick={() => {
      T.notify('notify message')
    }}>notify</button>
    <button onClick={() => {
      T.alert('standard alert 1')
    }}>alert 1</button>
    <button onClick={() => {
      T.alert({
        title: 'alert 2 title.',
        message: 'alert message.',
        text: 'button text',
        fn () {
          console.log('alert button clicked')
        }
      })
    }}>alert 2</button>
    <button onClick={() => {
      T.confirm({
        title: 'confirm title',
        message: 'confirm message',
        option: [
          {
            text: 'button 1',
            fn () {
              console.log('confirm button 1 clicked')
            }
          },
          {
            text: 'button 2',
            fn () {
              console.log('confirm button 2 clicked')
            }
          },
          {
            text: 'button 3',
            fn () {
              console.log('confirm button 3 clicked')
            }
          }
        ]
      })
    }}>confirm</button>

    <button onClick={() => {
      T.loading()
      setTimeout(() => {
        T.loaded()
      }, 3000)
    }}>loading</button>
  </Layout>
)
