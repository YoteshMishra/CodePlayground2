import React, { useState } from 'react';

const MotionBlock = ({ onDragStart }) => {
  const [steps, setSteps] = useState(10);
  const [degrees, setDegrees] = useState(15);
  const [gotoX, setGotoX] = useState(0);
  const [gotoY, setGotoY] = useState(0);

  const handleMoveBlockDrag = (e) => {
    onDragStart(e, { type: 'move', value: steps });
  };

  const handleTurnBlockDrag = (e) => {
    onDragStart(e, { type: 'turn', value: degrees });
  };

  const handleGotoBlockDrag = (e) => {
    onDragStart(e, { type: 'goto', x: gotoX, y: gotoY });
  };

  return (
    <div className="p-2 border rounded bg-blue-200">
      <h2 className="font-bold text-blue-700 mb-2">Looks</h2>
      <div
        className="motion-block cursor-move mb-2"
        draggable
        onDragStart={handleMoveBlockDrag}
      >
        Move <input 
          type="number" 
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        /> steps
      </div>

      <div
        className="motion-block cursor-move mb-2"
        draggable
        onDragStart={handleTurnBlockDrag}
      >
        Turn <input 
          type="number" 
          value={degrees}
          onChange={(e) => setDegrees(parseInt(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        /> degrees
      </div>

      <div
        className="motion-block cursor-move mb-2"
        draggable
        onDragStart={handleGotoBlockDrag}
      >
        Go to X: <input 
          type="number" 
          value={gotoX}
          onChange={(e) => setGotoX(parseInt(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        /> Y:
        <input 
          type="number" 
          value={gotoY}
          onChange={(e) => setGotoY(parseInt(e.target.value) || 0)} 
          className="w-12 inline mx-1" 
        />
      </div>
    </div>
  );
};

export default MotionBlock;