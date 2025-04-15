import React from 'react';

const MidArea = ({ onDropBlock, blocks, onReorderBlocks }) => {
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const blockData = JSON.parse(e.dataTransfer.getData('blockType')); 
    if (blockData) {
      onDropBlock(blockData);
    }
  };


  const handleBlockDragStart = (e, index) => {
    e.dataTransfer.setData('blockIndex', index.toString());
  };

  const handleBlockDragOver = (e) => {
    e.preventDefault();
  };

  const handleBlockDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('blockIndex');
    if (!dragIndexStr) return;
    
    const dragIndex = parseInt(dragIndexStr);
    if (dragIndex !== dropIndex) {
      onReorderBlocks(dragIndex, dropIndex);
    }
  };

  return (
    <div
      className="flex-1 min-h-64 border-2 border-dashed rounded p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="font-bold mb-2">Code Area</h2>
      {blocks.map((block, index) => (
        <div 
          key={index} 
          className="p-2 bg-gray-100 rounded mb-2 cursor-move"
          draggable
          onDragStart={(e) => handleBlockDragStart(e, index)}
          onDragOver={handleBlockDragOver}
          onDrop={(e) => handleBlockDrop(e, index)}
        >
          {block.type === 'move' && `Move ${block.value} steps`}
          {block.type === 'turn' && `Turn ${block.value} degrees`}
          {block.type === 'goto' && `Go to X: ${block.x} Y: ${block.y}`}
          {block.type === 'say' && `Say "${block.message}" for ${block.time} sec`}
          {block.type === 'think' && `Think "${block.message}" for ${block.time} sec`}
          {block.type === 'repeat' && `Repeat ${block.count} times`}
          {block.type === 'wait' && `Wait ${block.time} seconds`}
        </div>
      ))}
    </div>
  );
};

export default MidArea;