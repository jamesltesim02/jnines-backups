import React from 'react';

import M from '../../components/common/m';
import J9Ticket from './J9Ticket';

import './ThirdTicket.less';

function ThirdTicket () {
  return (
    <div className="third-tickets">
			<div className="header">
				<div><M id="pages.my_orders" /></div>
				<div>
					<span>TICKETS RECORD</span>
				</div>
			</div>
      <J9Ticket />
    </div>
  );
}

export default ThirdTicket;
