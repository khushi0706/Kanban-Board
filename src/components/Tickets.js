import React from 'react';

const Ticket = ({ ticket }) => {
  const priorityColors = {
    4: 'red',
    3: 'orange',
    2: 'yellow',
    1: 'green',
    0: 'gray',
  };

  return (
    <div className="ticket" style={{ borderColor: priorityColors[ticket.priority] }}>
      <h3>{ticket.title}</h3>
      <div className="ticket-details">
        <p>
          Assigned to: <span>{ticket.userId}</span>
        </p>
        <p>
          Priority: <span style={{ color: priorityColors[ticket.priority] }}>{ticket.priority}</span>
        </p>
      </div>
    </div>
  );
};

export default Ticket;