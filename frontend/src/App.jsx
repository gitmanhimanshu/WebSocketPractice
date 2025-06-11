// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    socket.emit('send_message', { message });
    setChat((prev) => [...prev, { message, self: true }]);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, { message: data.message, self: false }]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Socket.IO Chat</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {chat.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.self ? 'right' : 'left' }}>
            <p><strong>{msg.self ? 'You' : 'Other'}:</strong> {msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
