import React, { useState } from 'react';

function PointConsultation() {
  const [driverAction, setDriverAction] = useState('');
  const [pointRatio, setPointRatio] = useState('');
  const [advice, setAdvice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/consultPoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driverActionDescription: driverAction, sponsorPointRatio: pointRatio }),
    });
    const data = await response.json();
    setAdvice(data.advice);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Driver Action:
          <input type="text" value={driverAction} onChange={(e) => setDriverAction(e.target.value)} />
        </label>
        <label>
          Point Ratio:
          <input type="text" value={pointRatio} onChange={(e) => setPointRatio(e.target.value)} />
        </label>
        <button type="submit">Get Advice</button>
      </form>
      {advice && <p>Advice: {advice}</p>}
    </div>
  );
}

export default PointConsultation;
