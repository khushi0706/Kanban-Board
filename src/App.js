import React, { useState, useEffect } from 'react';
import { ReactComponent as HighPriorityIcon } from './assets/Img - High Priority.svg';
import { ReactComponent as MediumPriorityIcon } from './assets/Img - Medium Priority.svg';
import { ReactComponent as LowPriorityIcon } from './assets/Img - Low Priority.svg';
import { ReactComponent as UrgentPriorityIcon } from './assets/SVG - Urgent Priority colour.svg';
import { ReactComponent as UrgentPriorityGreyIcon } from './assets/SVG - Urgent Priority grey.svg';
import { ReactComponent as ThreeDotMenuIcon } from './assets/3 dot menu.svg';
import { ReactComponent as AddIcon } from './assets/add.svg';
import { ReactComponent as DisplayIcon } from './assets/Display.svg';
import { ReactComponent as TodoIcon } from './assets/To-do.svg';
import { ReactComponent as InProgressIcon } from './assets/in-progress.svg';
import { ReactComponent as BacklogIcon } from './assets/Backlog.svg';
import { ReactComponent as DoneIcon } from './assets/Done.svg';

import './App.css';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'priority');
  const [showDisplayOptions, setShowDisplayOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : userId;
  };

  const getGroupIcon = (key, groupBy) => {
    switch (groupBy) {
      case 'status':
        switch (key) {
          case 'Todo': return <TodoIcon />;
          case 'In progress': return <InProgressIcon />;
          case 'Done': return <DoneIcon />;
          case 'Backlog': return <BacklogIcon />;
          default: return null;
        }
      case 'priority':
        switch (key) {
          case 'Urgent': return <UrgentPriorityIcon />;
          case 'High': return <HighPriorityIcon />;
          case 'Medium': return <MediumPriorityIcon />;
          case 'Low': return <LowPriorityIcon />;
          case 'No Priority': return <UrgentPriorityGreyIcon />;
          default: return null;
        }
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Todo': return <TodoIcon />;
      case 'In progress': return <InProgressIcon />;
      case 'Done': return <DoneIcon />;
      default: return null;
    }
  };

  const groupTickets = () => {
    const grouped = tickets.reduce((acc, ticket) => {
      let key;
      switch (groupBy) {
        case 'status':
          key = ticket.status;
          break;
        case 'user':
          key = getUserName(ticket.userId);
          break;
        case 'priority':
          key = getPriorityLabel(ticket.priority);
          break;
        default:
          key = ticket.status;
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority;
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });

    return grouped;
  };

  const getPriorityLabel = (priority) => {
    const priorityLabels = {
      4: 'Urgent',
      3: 'High',
      2: 'Medium',
      1: 'Low',
      0: 'No Priority'
    };
    return priorityLabels[priority];
  };

  const groupedTickets = groupTickets();

  return (
    <div className="app">
      <div className="header">
        <div className="display-container">
          <button
            className="display-button"
            onClick={() => setShowDisplayOptions(!showDisplayOptions)}
          >
            <DisplayIcon className="display-icon" />
            Display
          </button>
          {showDisplayOptions && (
            <div className="display-options">
              <div className="dropdown-container">
                <Dropdown
                  label="Grouping"
                  options={['status', 'user', 'priority']}
                  value={groupBy}
                  onChange={(option) => setGroupBy(option)}
                />
                <Dropdown
                  label="Sorting"
                  options={['priority', 'title']}
                  value={sortBy}
                  onChange={(option) => setSortBy(option)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([key, tickets]) => (
          <div key={key} className={`kanban-column ${key.toLowerCase().replace(' ', '-')}`}>
            <div className="column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getGroupIcon(key, groupBy)}
                <h2>{key}</h2>
                <span className="count">{groupedTickets[key].length}</span>
              </div>
              <div className="column-actions">
                <AddIcon className="action-icon" />
                <ThreeDotMenuIcon className="action-icon" />
              </div>
            </div>
            {tickets.map((ticket) => (
              <Ticket
                key={ticket.id}
                ticket={ticket}
                getUserName={getUserName}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Ticket = ({ ticket, getUserName, getStatusIcon }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4: return <UrgentPriorityIcon />;
      case 3: return <HighPriorityIcon />;
      case 2: return <MediumPriorityIcon />;
      case 1: return <LowPriorityIcon />;
      default: return <UrgentPriorityGreyIcon />;
    }
  };

  const priorityColors = {
    4: 'urgent',
    3: 'high',
    2: 'medium',
    1: 'low',
    0: 'no-priority',
  };

  return (
    <div className={`ticket ${priorityColors[ticket.priority]}`}>
      <div className="ticket-header">
        <h3>{ticket.id} {ticket.title}</h3>
        <div className="ticket-priority">
          {getPriorityIcon(ticket.priority)}
        </div>
      </div>
      <div className="ticket-body">
        <div className="ticket-status-icon">
          {getStatusIcon(ticket.status)}
        </div>
        <div className="ticket-details">
          <p>{ticket.tag && ticket.tag[0]}</p>
        </div>
      </div>
      <div className="ticket-footer">
        <ThreeDotMenuIcon className="ticket-menu-icon" />
      </div>
    </div>
  );
};

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default App;