import React from 'react';
import dayjs from "dayjs";
import CartItem from "../CartItem";
import TicketStatusTag from "./TicketStatusTag";
import M from '../../common/m'
import copy from "copy-to-clipboard";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import CartStore from "../../../stores/cart/Cart";
import { CURRENCY_TEXT } from "../../../consts/app";

function CartItemTotal(
  {
    ticketInfo,
    availableTicket,
    className
  }: {
    ticketInfo: any
    availableTicket?: any
    className?: string
  }
) {
  const intl = useIntl()
  const _ticketInfo = {...ticketInfo}
  const currencyColor = ticketInfo.currency === 1 ? '#d35c7b' : '#4ACA6D'
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
            betBar: option.betBar,
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
              <span style={{color: currencyColor, fontSize: 14}}>
                {CURRENCY_TEXT[ticketInfo.currency]}
              </span>
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
            <span>
              {dayjs(_ticketInfo.betTime).format('YYYY/MM/DD HH:mm:ss')}
            </span>
          </div>
          <div>
            <M id="ticket.bet_no"/>
            <span>
              {_ticketInfo.ticketId}
            </span>
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
                _ticketInfo.options.map((itemInfo: any, index: number) => (
                  <CartItem
                    key={itemInfo.matchInfo.optionId || index}
                    blink={false}
                    itemInfo={itemInfo}
                    rightChild={
                      availableTicket?.includes(itemInfo.matchInfo.matchId.toString()) ?
                        <Link
                          to={`/detail/${itemInfo.matchInfo.matchId}`}
                          onClick={() => CartStore.toggleSidebar(false)}
                        >
                          <M id="match.to_detail"/>
                        </Link> : undefined
                    }
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
            {
              _ticketInfo.ticketStatus === 3
                ? "总返还额"
                : <M id="bet.will_return"/>
            }

            <br/>
            <span>
              {
                _ticketInfo.ticketStatus === 3
                  ? _ticketInfo.settleAmount.toFixed(2)
                  : (_ticketInfo.betAmount * _ticketInfo.odds).toFixed(2)
              }
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItemTotal;