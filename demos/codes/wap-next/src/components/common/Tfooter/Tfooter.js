import React, { Component } from 'react';
import { connect } from 'react-redux'
import {globalActions} from '@/reducers/global'
import './Tfooter.css';

import Dingdanicon from '@/components/common/icons/Dingdanicon/Dingdanicon'
import Touzhuopenicon from '@/components/common/icons/Touzhuopenicon/Touzhuopenicon';

class Tfooter extends Component {
  render() {
    let {
      betting,
      updateBettingDialog
    } = this.props
    return (
      <div className="nb_two_footer" onClick={()=>updateBettingDialog(1)}>
        <div className="nb_Dingdan">
          <Dingdanicon className="nb_tfootericon" />
          <span>投注单</span>
        </div>
        <div className="nb_Touzhuopen">
          已添加
          <span className="nb_num">
            {betting.filter(v => !v.optionState > 0).length}
          </span>
          注
          <Touzhuopenicon className="nb_tfootericonr" />
        </div>
      </div>
    )
  }
}
export default connect(
  state => state,
  {
    updateBettingDialog: globalActions.updateBettingDialog
  }
)(Tfooter)

