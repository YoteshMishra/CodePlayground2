import React, { useRef } from 'react';

const MotionBlock = ({ onDragStart }) => {

  const stepsRef = useRef(10);
  const degreesRef = useRef(15);
  const gotoXRef = useRef(0);
  const gotoYRef = useRef(0);
  

  const stepsInputRef = useRef(null);
  const degreesInputRef = useRef(null);
  const gotoXInputRef = useRef(null);
  const gotoYInputRef = useRef(null);

  const handleMoveBlockDrag = (e) => {
 
    const steps = stepsInputRef.current ? parseInt(stepsInputRef.current.value) || 0 : 0;
    stepsRef.current = steps;
    onDragStart(e, { type: 'move', value: steps });
  };

  const handleTurnBlockDrag = (e) => {
    const degrees = degreesInputRef.current ? parseInt(degreesInputRef.current.value) || 0 : 0;
    degreesRef.current = degrees;
    onDragStart(e, { type: 'turn', value: degrees });
  };

  const handleGotoBlockDrag = (e) => {
    const x = gotoXInputRef.current ? parseInt(gotoXInputRef.current.value) || 0 : 0;
    const y = gotoYInputRef.current ? parseInt(gotoYInputRef.current.value) || 0 : 0;
    gotoXRef.current = x;
    gotoYRef.current = y;
    onDragStart(e, { type: 'goto', x, y });
  };

  return (
    <div className="p-2 border rounded bg-blue-200">
      <h2 className="font-bold text-blue-700 mb-2">Motion</h2>
      <div
        className="motion-block cursor-move mb-2 p-2 bg-blue-100 rounded"
        draggable
        onDragStart={handleMoveBlockDrag}
      >
        Move <input 
          type="number" 
          defaultValue={10}
          ref={stepsInputRef}
          className="w-16 inline mx-1 border p-1" 
        /> steps
      </div>

      <div
        className="motion-block cursor-move mb-2 p-2 bg-blue-100 rounded"
        draggable
        onDragStart={handleTurnBlockDrag}
      >
        Turn <input 
          type="number" 
          defaultValue={15}
          ref={degreesInputRef}
          className="w-16 inline mx-1 border p-1" 
        /> degrees
      </div>

      <div
        className="motion-block cursor-move mb-2 p-2 bg-blue-100 rounded"
        draggable
        onDragStart={handleGotoBlockDrag}
      >
        Go to X: <input 
          type="number" 
          defaultValue={0}
          ref={gotoXInputRef}
          className="w-16 inline mx-1 border p-1" 
        /> Y:
        <input 
          type="number" 
          defaultValue={0}
          ref={gotoYInputRef}
          className="w-16 inline mx-1 border p-1" 
        />
      </div>
    </div>
  );
};

export default MotionBlock;