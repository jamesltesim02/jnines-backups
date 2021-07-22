import React from 'react';
import './BettingHistory.css';
import Chooseicon from '@/components/common/icons/Chooseicon/Chooseicon';

class BettingHistory extends React.Component {
  render() {
    return (
      <div className="nb_BettingHistory">
        <div className="nb_BettingHistorytime">
          <input type="date" placeholder="开始日期" />
          <span>至</span>
          <input type="date" placeholder="结束日期" />
        </div>
        <div className="nb_BettingHistorypagebox">
          <div className="nb_BettingHistorypagetit">
            2018年
        </div>
          <div className="nb_BettingHistorypage">
            <h3>09/30</h3>
            <p>
              投注额：1000.00
          </p>
            <p>有效投注额：900.00</p>
            <div className="nb_BettingHistorypager">
              未结算
          <Chooseicon />
            </div>
          </div>
          <div className="nb_BettingHistorypage">
            <h3>09/30</h3>
            <p>
              投注额：1000.00
          </p>
            <p>有效投注额：900.00</p>
            <div className="nb_BettingHistorypager nb_BettingHistorypagegreen">
              -10000.00
          <Chooseicon />
            </div>
          </div>
          <div className="nb_BettingHistorypage">
            <h3>09/30</h3>
            <p>
              投注额：1000.00
          </p>
            <p>有效投注额：900.00</p>
            <div className="nb_BettingHistorypager nb_BettingHistorypagered">
              +185000.00
          <Chooseicon />
            </div>
          </div>
        </div>
        <div className="nb_BettingHistorywu">暂无匹配的投注历史</div>
      </div>
    )
  }
}


export default BettingHistory
