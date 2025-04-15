import React, { useRef } from 'react';

const LooksBlock = ({ onDragStart }) => {
  const sayMessageRef = useRef(null);
  const sayTimeRef = useRef(null);
  const thinkMessageRef = useRef(null);
  const thinkTimeRef = useRef(null);

  const handleSayBlockDrag = (e) => {
    const message = sayMessageRef.current?.value || '';
    const time = parseFloat(sayTimeRef.current?.value) || 0;
    onDragStart(e, { type: 'say', message, time });
  };

  const handleThinkBlockDrag = (e) => {
    const message = thinkMessageRef.current?.value || '';
    const time = parseFloat(thinkTimeRef.current?.value) || 0;
    onDragStart(e, { type: 'think', message, time });
  };

  return (
    <div className="p-2 border rounded bg-purple-200">
      <h2 className="font-bold text-purple-700 mb-2">Looks</h2>

      <div
        className="looks-block cursor-move mb-2 p-2 bg-purple-100 rounded"
        draggable
        onDragStart={handleSayBlockDrag}
      >
        Say "
        <input
          type="text"
          defaultValue="Hello!"
          ref={sayMessageRef}
          className="mx-1 w-24 border p-1"
        />
        " for
        <input
          type="number"
          defaultValue={2}
          min="0"
          max="10000"
          step="0.1"
          ref={sayTimeRef}
          className="w-16 inline mx-1 border p-1"
        />
        sec
      </div>

      <div
        className="looks-block cursor-move mb-2 p-2 bg-purple-100 rounded"
        draggable
        onDragStart={handleThinkBlockDrag}
      >
        Think "
        <input
          type="text"
          defaultValue="Hmm..."
          ref={thinkMessageRef}
          className="mx-1 w-24 border p-1"
        />
        " for
        <input
          type="number"
          defaultValue={2}
          min="0"
          max="10000"
          step="0.1"
          ref={thinkTimeRef}
          className="w-16 inline mx-1 border p-1"
        />
        sec
      </div>
    </div>
  );
};

export default LooksBlock;
