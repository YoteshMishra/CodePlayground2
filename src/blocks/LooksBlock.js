import React, { useState } from 'react';

const LooksBlock = ({ onDragStart }) => {
  const [sayMessage, setSayMessage] = useState('Hello!');
  const [sayTime, setSayTime] = useState(2);
  const [thinkMessage, setThinkMessage] = useState('Hmm...');
  const [thinkTime, setThinkTime] = useState(2);

  const handleSayBlockDrag = (e) => {
    onDragStart(e, { type: 'say', message: sayMessage, time: sayTime });
  };

  const handleThinkBlockDrag = (e) => {
    onDragStart(e, { type: 'think', message: thinkMessage, time: thinkTime });
  };

  return (
    <div className="p-2 border rounded bg-purple-200">
      <h2 className="font-bold text-purple-700 mb-2">Looks</h2>

      <div
        className="looks-block cursor-move mb-2"
        draggable
        onDragStart={handleSayBlockDrag}
      >
        Say "
        <input 
          type="text" 
          value={sayMessage}
          onChange={(e) => setSayMessage(e.target.value)} 
          className="mx-1 w-24" 
        />
        " for
        <input 
          type="number" 
          value={sayTime}
          onChange={(e) => setSayTime(parseFloat(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        />
        sec
      </div>

      <div
        className="looks-block cursor-move mb-2"
        draggable
        onDragStart={handleThinkBlockDrag}
      >
        Think "
        <input 
          type="text" 
          value={thinkMessage}
          onChange={(e) => setThinkMessage(e.target.value)} 
          className="mx-1 w-24" 
        />
        " for
        <input 
          type="number" 
          value={thinkTime}
          onChange={(e) => setThinkTime(parseFloat(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        />
        sec
      </div>
    </div>
  );
};

export default LooksBlock;