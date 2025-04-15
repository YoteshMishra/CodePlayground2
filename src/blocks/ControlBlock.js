import React, { useState } from 'react';

const ControlBlock = ({ onDragStart }) => {
  const [repeatCount, setRepeatCount] = useState(10);
  const [waitTime, setWaitTime] = useState(1);

  const handleRepeatDragStart = (e) => {
    onDragStart(e, { type: 'repeat', count: repeatCount });
  };

  const handleWaitDragStart = (e) => {
    onDragStart(e, { type: 'wait', time: waitTime });
  };

  return (
    <div className="p-2 border rounded bg-orange-200">
      <h2 className="font-bold text-orange-700 mb-2">Control</h2>
      <div
        className="control-block cursor-move mb-2"
        draggable
        onDragStart={handleRepeatDragStart}
      >
        Repeat <input 
          type="number" 
          value={repeatCount}
          onChange={(e) => setRepeatCount(parseInt(e.target.value))} 
          className="w-12 inline mx-1" 
        /> times
      </div>

      <div
        className="control-block cursor-move mb-2"
        draggable
        onDragStart={handleWaitDragStart}
      >
        Wait <input 
          type="number" 
          value={waitTime}
          onChange={(e) => setWaitTime(parseFloat(e.target.value))} 
          step="0.1" 
          className="w-12 inline mx-1" 
        /> seconds
      </div>
    </div>
  );
};

export default ControlBlock;