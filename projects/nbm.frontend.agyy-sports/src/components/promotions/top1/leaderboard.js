import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import FlagImage from './images/flag.tiny.png'

const useStyle = makeStyles(
  {
    root: {
      '& > table': {
        marginTop: 25,
        width: '100%',
        padding: '0 20px 20px',
        background: '#fff',
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 9,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        '& > caption': {
          position: 'relative',
          background: '#fff',
          borderTopRightRadius: 9,
          borderTopLeftRadius: 9,
          padding: '8px 20px 15px 0',
          textAlign: 'right',
          fontSize: 12,
          lineHeight: '15px',
          letterSpacing: -1,
          color: '#56538a',
          '& > span': {
            position: 'absolute',
            left: 25,
            top: -10,
            display: 'inline-block',
            minWidth: 53,
            height: 48,
            background: `url(${FlagImage})`,
            backgroundSize: '100% 100%',
            textAlign: 'center',
            color: '#fff',
            padding: '10px 10px 0'
          }
        },
        '& td, & th': {
          position: 'relative',
          lineHeight: '25px',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 1,
            width: '200%',
            background: '#ddd',
            transformOrigin: 'left bottom',
            transform: 'scale(.5)'
          }
        }
      }
    },
    completed: {
      color: '#f9ab10'
    }
  },
  { name: 'Leaderboard' }
)

const Leaderboard = ({ className = '' }) => {
  const classes = useStyle()
  return (
    <div className={`${classes.root} ${className}`}>
      <table>
        <caption>
          <span>盈利榜</span>
          在榜单统计时间内
          <br />
          盈利指数=总净盈利/总投注额
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>盈利</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>2000</td>
          <td>ag******82</td>
          <td>42%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>2</td>
          <td>1000</td>
          <td>ag*******37</td>
          <td>22%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>3</td>
          <td>500</td>
          <td>ag*******75</td>
          <td>20%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>4</td>
          <td>200</td>
          <td>j9********86</td>
          <td>19%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>5</td>
          <td>200</td>
          <td>ag*******55</td>
          <td>4%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>6</td>
          <td>200</td>
          <td>ag*******34</td>
          <td>3%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>7</td>
          <td>200</td>
          <td>ag****04</td>
          <td>3%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>8</td>
          <td>200</td>
          <td>ag*******47</td>
          <td>2%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>9</td>
          <td>200</td>
          <td>j9********49</td>
          <td>2%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>10</td>
          <td>200</td>
          <td>j9********58</td>
          <td>1%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        </tbody>
      </table>
      <table>
        <caption>
          <span>胜率榜</span>
          在榜单统计时间内
          <br />
          胜率指数=获胜注单数(包含赢半)/总注单数
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>胜率</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>2000</td>
          <td>ag************n3</td>
          <td>65%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>2</td>
          <td>1000</td>
          <td>ag*******45</td>
          <td>62%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>3</td>
          <td>500</td>
          <td>j9****79</td>
          <td>60%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>4</td>
          <td>200</td>
          <td>j9*****05</td>
          <td>59%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>5</td>
          <td>200</td>
          <td>ag*******13</td>
          <td>53%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>6</td>
          <td>200</td>
          <td>ag*******13</td>
          <td>53%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>7</td>
          <td>200</td>
          <td>ag****09</td>
          <td>52%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>8</td>
          <td>200</td>
          <td>j9****74</td>
          <td>40%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>9</td>
          <td>200</td>
          <td>j9****43</td>
          <td>32%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>10</td>
          <td>200</td>
          <td>ag*****68</td>
          <td>29%</td>
          <td className={classes.completed}>完成</td>
        </tr>
        </tbody>
      </table>
      <table>
        <caption>
          <span>负盈利榜</span>
          在榜单统计时间内
          <br />
          总负盈利排名
        </caption>
        <thead>
          <tr>
            <th>排名</th>
            <th>奖金(USDT)</th>
            <th>账号</th>
            <th>负盈利</th>
            <th>注单</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>1</td>
          <td>2000</td>
          <td>ag*******ua</td>
          <td>-66871.07</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>2</td>
          <td>1000</td>
          <td>ag*******89</td>
          <td>-9926.86</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>3</td>
          <td>500</td>
          <td>ag*******77</td>
          <td>-5667.66</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>4</td>
          <td>200</td>
          <td>ag******65</td>
          <td>-3531.75</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>5</td>
          <td>200</td>
          <td>ag*******11</td>
          <td>-2622.44</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>6</td>
          <td>200</td>
          <td>ag*******80</td>
          <td>-1101.24</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>7</td>
          <td>200</td>
          <td>ag******09</td>
          <td>-427.62</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>8</td>
          <td>200</td>
          <td>ag******75</td>
          <td>-190.42</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>9</td>
          <td>200</td>
          <td>ag*****47</td>
          <td>-188.34</td>
          <td className={classes.completed}>完成</td>
        </tr>
        <tr>
          <td>10</td>
          <td>200</td>
          <td>j9*******34</td>
          <td>-183.69</td>
          <td className={classes.completed}>完成</td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Leaderboard
