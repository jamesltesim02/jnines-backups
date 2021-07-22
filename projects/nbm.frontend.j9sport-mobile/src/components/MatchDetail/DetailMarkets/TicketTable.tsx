import React from 'react';
import CartItemTotal from '../../cart/CartItemTotal';

function TicketTable (
  {
    ticketList
  }: {
    ticketList: any[],
    loading: boolean,
    availableTicket: string[]
  }
) {
  return (
    <section className="ticket-table">
    {
      ticketList.map(ticket => (
        <CartItemTotal key={ticket.ticketId} ticketInfo={ticket} />
      ))
    }
    </section>
  );
}

export default TicketTable;
