import React, { useState } from 'react';
import EventsConsolidation from './EventsConsolidation';

const ProtectedConsolidation: React.FC = () => {
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === 'lino') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  if (authenticated) {
    return <EventsConsolidation />;
  }

  return (
    <div className="password-protect-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Digite a senha para acessar:</label>
        <input
          type="password"
          id="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit">Entrar</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default ProtectedConsolidation;