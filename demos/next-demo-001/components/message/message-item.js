import Link from 'next/link'
import { observer } from 'mobx-react'

import { dateFormat } from '../../utils/common-utils'

export default observer(({ message, onDelete = () => {} }) => (
  <li className={message.readed ? '' : 'un-read'}>
    {/* <Link href={`/messages/detail?id=${message.id}`}> */}
    <Link href={'/messages/[id]'} as={`/messages/${message.id}`}>
    <a className="content">
      <h3>{message.title}</h3>
      <p>{message.content}</p>
    </a>
    </Link>
    <div>
      <time>{
        dateFormat(message.sendTime, 'MM/dd HH:mm')
      }</time>
      <span>{message.from}</span>
    </div>
    <div className="opers">
      {
        message.readed
        ? null
        : <button onClick={message.read}>已读</button>
      }
      <button onClick={onDelete}>删除</button>
    </div>
    <style jsx>{`
      li {
        list-style-type: none;
        display: grid;
        grid-template-columns: 7fr 2fr 1fr;
        align-items: center;
        width: 100%;
        overflow: hidden;
        color: #929292;
      }
      li div, li .content {
        width: 100%;
        overflow: hidden;
      }
      li a {
        color: #929292;
        text-decoration: none;
        cursor: pointer;
      }
      li.un-read,
      li.un-read a{
        color: #2f2a2a;
      }
      li h3, li p {
        padding: 0;
        margin: 0;
        width: 100%;
      }
      li time, li span {
        display: block;
        text-align: center;
        font-size: 12px;
        cursor: default;
      }
      li h3 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      li p {
        font-size: 12px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 36px;
      }
      li .opers {
        text-align: center;
      }
    `}</style>
  </li>
))
