import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import './index.css';

const Index = () => {
  const [username, setUsername] = useState('username');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('685333351ca4bc675f89', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('Dchat');
    channel.bind('message', function(data) {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:8000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        message,
      }),
    });
    setMessage('');
  };

  return (
    <div className='container'>
      <div className="list-group">
        <div className="list-group-item list-group-item-action active" aria-current="true">
          <div className="d-flex w-100 justify-content-between">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div className="list-group-item list-group-item-action msg-box">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{msg.username}</h5>
                <small className="text-body-secondary">{new Date().toLocaleString()}</small>
              </div>
              <p className="mb-1">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submit}>
        <input
          className='form-control'
          placeholder='Enter a message'
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Index;
