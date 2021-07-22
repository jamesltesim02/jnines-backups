import React, { useState } from 'react';
import { APP_ID } from "../../consts/app";
import MemberLayout from "../../components/member/MemberLayout";
import mergeClass from "../../utils/mergeClass";

import OtherTicket from "./OtherTickets";
import J9Ticket from "./J9Ticket";

enum TICKET_TYPE {
  J9,
  SHABA,
  YSB,
  ODDIN
}

const TICKET_MENU = [
  {title: '九游体育', val: TICKET_TYPE.J9, appId: APP_ID.J9},
  {title: '九游电竞', val: TICKET_TYPE.ODDIN, appId: APP_ID.ODDIN},
  {title: '沙巴', val: TICKET_TYPE.SHABA, appId: APP_ID.SHABA},
  {title: '易胜博', val: TICKET_TYPE.YSB, appId: APP_ID.YSB},
]

function Ticket() {
  const [ticketType, setTicketType] = useState(TICKET_TYPE.J9)
  const [appId, setAppId] = useState(0)

  return (
    <MemberLayout
      title="我的注单"
      subTitle="TICKETS RECORD"
      className="member-table"
    >
      <header className="member-table-tit">
        {
          TICKET_MENU.map(({title, val, appId}) => (
            <div
              key={val}
              className={mergeClass({
                'active': ticketType === val
              })}
              onClick={() => {
                setTicketType(val)
                setAppId(appId)
              }}
            >
              {title}
            </div>
          ))
        }
      </header>
      <section className="member-table-content">
        {
          ticketType === TICKET_TYPE.J9
            ? <J9Ticket />
            : <OtherTicket appId={appId}/>
        }
      </section>
    </MemberLayout>
  );
}

export default Ticket;