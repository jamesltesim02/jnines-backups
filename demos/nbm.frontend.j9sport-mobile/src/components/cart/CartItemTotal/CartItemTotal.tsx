import React from 'react';
import dayjs from "dayjs";
import CartItem from "../CartItem";
import TicketStatusTag from "./TicketStatusTag";
import M from '../../common/m'
import copy from "copy-to-clipboard";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";

function CartItemTotal(
  {
    ticketInfo
  }: {
    ticketInfo: any
  }
) {

  const intl = useIntl()

  const _ticketInfo = {...ticketInfo}

  const isCombo = Array.isArray(_ticketInfo.options) && _ticketInfo.options.length > 1

  if (Array.isArray(_ticketInfo.options)) {
    // 输赢
    _ticketInfo.winLose = _ticketInfo.settleAmount - _ticketInfo.betAmount
    // 赔率
    _ticketInfo.odds = _ticketInfo.options.reduce((acc: number, cur: any) => acc * cur.odds, 1)
    // cartItem
    _ticketInfo.options = _ticketInfo.options.map((option: any) => {
        if (!option.matchInfo) {
          return ({
            betOption: option.betOption,
            matchScore: `${option.homeScore} : ${option.awayScore}`,
            odds: option.odds,
            matchInfo: {...option},
            market: {...option},
          })
        } else
          return option
      }
    )
  } else {
    _ticketInfo.odds = _ticketInfo.options.odds
  }

  const handleCopy = (ticketId: string) => {
    if (copy(ticketId)) {
      Toast.success(intl.formatMessage({id: 'ticket.copy_success'}))
    } else {
      Toast.fail(intl.formatMessage({id: 'ticket.copy_failed'}))
    }
  }

  return (
    <div className="cart-item-total">
      <div className="result-ticket">
        <div className="result-ticket-header">
          <div>
            <span>
            {
              isCombo ? <M id="ticket.combo_bet"/> : <M id="ticket.single_bet"/>
            }
          </span>
            <span>
              {
                _ticketInfo.winLose !== undefined
                &&
                <TicketStatusTag winLose={_ticketInfo.winLose} ticketStatus={_ticketInfo.ticketStatus}/>
              }
          </span>
          </div>
          <div>
            <M id="ticket.bet_date"/>
            <text>
              {dayjs(_ticketInfo.betTime).format('YYYY/MM/DD HH:mm:ss')}
            </text>
          </div>
          <div>
            <M id="ticket.bet_no"/>
            <text>
              {_ticketInfo.ticketId}
            </text>
            <span
              className="copy"
              onClick={() => handleCopy(_ticketInfo.ticketId)}
            >
              <M id="ticket.copy"/>
            </span>
          </div>
        </div>
        {/*注单信息*/}
        {
          Array.isArray(_ticketInfo.options) ?
            <>
              {
                _ticketInfo.options.map((itemInfo: any) => (
                  <CartItem
                    key={itemInfo.matchInfo.optionId}
                    blink={false}
                    itemInfo={itemInfo}
                  />
                ))
              }
            </>
            :
            <CartItem itemInfo={_ticketInfo.options}/>
        }
        <div className="result-ticket-footer">
          <span>
            <M id="ticket.principal"/>
            <br/>
            <span>
              {_ticketInfo.betAmount}
            </span>
          </span>
          <span>
            <M id="bet.will_return"/>
            <br/>
            <span>
              {(_ticketInfo.betAmount * _ticketInfo.odds).toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItemTotal;