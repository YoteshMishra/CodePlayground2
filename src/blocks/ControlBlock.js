import React, { useRef } from 'react';

const ControlBlock = ({ onDragStart }) => {
  const repeatCountRef = useRef(null);
  const waitTimeRef = useRef(null);

  const handleRepeatBlockDrag = (e) => {
    const count = parseInt(repeatCountRef.current?.value) || 0;
    onDragStart(e, { type: 'repeat', count });
  };

  const handleWaitBlockDrag = (e) => {
    const time = parseFloat(waitTimeRef.current?.value) || 0;
    onDragStart(e, { type: 'wait', time });
  };

  return (
    <div className="p-2 border rounded bg-yellow-200">
      <h2 className="font-bold text-yellow-700 mb-2">Control</h2>

      <div
        className="control-block cursor-move mb-2 p-2 bg-yellow-100 rounded"
        draggable
        onDragStart={handleRepeatBlockDrag}
      >
        Repeat
        <input
          type="number"
          defaultValue={3}
          ref={repeatCountRef}
          className="w-16 inline mx-1 border p-1"
          min="1"
        />
        times
      </div>

      <div
        className="control-block cursor-move mb-2 p-2 bg-yellow-100 rounded"
        draggable
        onDragStart={handleWaitBlockDrag}
      >
        Wait
        <input
          type="number"
          defaultValue={1}
          ref={waitTimeRef}
          className="w-16 inline mx-1 border p-1"
          min="0"
          step="0.1"
        />
        sec
      </div>
    </div>
  );
};

export default ControlBlock;
