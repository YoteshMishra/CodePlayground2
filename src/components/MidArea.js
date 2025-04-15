// MidArea.js
import React from 'react';

const MidArea = ({ onDropBlock, blocks, onReorderBlocks, selectedSpriteId }) => {
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const blockData = JSON.parse(e.dataTransfer.getData('blockType')); // Get the dropped block data
    onDropBlock(blockData); // Pass the block data to App.js
  };

  // For block dragging and reordering
  const handleBlockDragStart = (e, index) => {
    e.dataTransfer.setData('blockIndex', index);
  };

  const handleBlockDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleBlockDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('blockIndex'));
    if (dragIndex !== dropIndex) {
      onReorderBlocks(dragIndex, dropIndex);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="font-bold p-2 border-b">
        Code Area - Sprite #{selectedSpriteId}
      </h2>
      
      <div
        className="flex-1 min-h-64 border-2 border-dashed rounded p-4 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {blocks.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">
            Drag blocks here to program this sprite
          </div>
        ) : (
          blocks.map((block, index) => (
            <div 
              key={index} 
              className="p-2 bg-gray-100 rounded mb-2 cursor-move"
              draggable
              onDragStart={(e) => handleBlockDragStart(e, index)}
              onDragOver={(e) => handleBlockDragOver(e, index)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default MidArea;