import React from 'react'
import { useLocation } from 'react-router'
import videojs from 'video.js'

import LiveBgImage from '../../assets/live-bg.jpg'

import 'video.js/dist/video-js.min.css'
import './video.css'

const ErrorModal = videojs.getComponent('ModalDialog')
const RetryButton = videojs.getComponent('Button')

const VideoPage = () => {
  const video = React.useRef(null)
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const disablescale = params.get('disablescale') === 'true'

  React.useEffect(
    () => {
      const {
        parent: topFrame
      } = window
      const url = decodeURIComponent(params.get('url'))
      const controls = params.get('controls') !== 'false'
      const player = videojs(
        video.current,
        {
          autoplay: true,
          controls,
          playsInline: true,
          preload: 'metadata',
          muted: params.get('muted') === 'true',
          sources: [{
            src: url,
            type: /\.mp4$/.test(url) ? 'video/mp4' : 'application/x-mpegURL'
          }]
        },
        () => {
          player.tech_.off('dblclick');
        }
      )

      const modalContent = document.createElement('div')
      modalContent.innerHTML = '<p>直播信号中断，请稍后再试...</p><button class="retry-in-error">立即重连 (20)</button>'
      modalContent.addEventListener('click', function (e) {
        console.log('click', e)
        if (e.target.tagName.toUpperCase() !== 'BUTTON') {
          return
        }
        window.location.reload()
      })
      const errorModal = new ErrorModal(
        player,
        {
          temporary: false,
          content: modalContent
        }
      )
      errorModal.addClass('error-modal')
      player.addChild(errorModal)

      const retryButton = new RetryButton(
        player,
        {}
      )
      retryButton.on('click', () => window.location.reload())
      retryButton.controlText('重新连接')
      retryButton.addClass('waiting-retry')
      player.addChild(retryButton)
      let retryInLoadingTimer = null

      player.on('pause', () => topFrame.postMessage(false, '*'))
      player.on('play', () => topFrame.postMessage(true, '*'))
      player.on('ended', () => topFrame.postMessage(false, '*'))
      player.on('error', e => {
        window.clearTimeout(retryInLoadingTimer)
        retryButton.removeClass('active')
        errorModal.open()

        let count = 20
        const button = e.target.querySelector('.retry-in-error')
        setInterval(
          () => {
            if (count === 0) {
              window.location.reload()
              return
            }
            count -= 1
            button.innerHTML = `立即重连 (${count})`
          },
          1000
        )
      })
      player.on('waiting', () => {
        retryInLoadingTimer = setTimeout(
          () => retryButton.addClass('active'),
          3000
        )
      })
      player.on('playing', () => {
        window.clearTimeout(retryInLoadingTimer)
        retryButton.removeClass('active')
      })

      const handleMessage = e => {
        if (e.data) {
          player.play()
        } else {
          player.pause()
        }
      }
      window.addEventListener('message', handleMessage)
      return () => {
        window.clearTimeout(retryInLoadingTimer)
        window.removeEventListener('message', handleMessage)
      }
    },
    [params]
  )

  return (
    <video
      ref={video}
      className={`video video-js ${disablescale ? 'disablescale' : ''}`}
      autoPlay
      playsInline
      poster={LiveBgImage}
    ></video>
  )
}

export default VideoPage
