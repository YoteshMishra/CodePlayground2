import React, { useState } from 'react';

const MidArea = ({ 
  onDropBlock, 
  blocks, 
  onReorderBlocks, 
  onRemoveBlock,
  onAddAnimationBlock,
  onAddRepeatSubBlocks
}) => {
  const [expandedRepeatBlock, setExpandedRepeatBlock] = useState(null);
  
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

  const handleAddSubBlock = (parentIndex) => {
    const subBlock = { type: 'move', value: 10 };
    onAddRepeatSubBlocks(parentIndex, subBlock);
  };

  return (
    <div
      className="flex-1 min-h-64 flex flex-col"
    >
      <div 
        className="flex-1 border-2 border-dashed rounded p-4 overflow-y-auto" 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 className="font-bold mb-2">Code Area</h2>
        {blocks.map((block, index) => (
          <div key={index} className="mb-2">
            <div 
              className="p-2 bg-gray-100 rounded cursor-move flex justify-between items-center"
              draggable
              onDragStart={(e) => handleBlockDragStart(e, index)}
              onDragOver={handleBlockDragOver}
              onDrop={(e) => handleBlockDrop(e, index)}
            >
              <div>
                {block.type === 'move' && `Move ${block.value} steps`}
                {block.type === 'turn' && `Turn ${block.value} degrees`}
                {block.type === 'goto' && `Go to X: ${block.x} Y: ${block.y}`}
                {block.type === 'say' && `Say "${block.message}" for ${block.time} sec`}
                {block.type === 'think' && `Think "${block.message}" for ${block.time} sec`}
                {block.type === 'repeat' && (
                  <div className="flex items-center">
                    <span>Repeat {block.count} times</span>
                    <button 
                      className="ml-2 bg-blue-100 px-1 rounded text-xs"
                      onClick={() => setExpandedRepeatBlock(expandedRepeatBlock === index ? null : index)}
                    >
                      {expandedRepeatBlock === index ? 'Hide' : 'Edit'}
                    </button>
                  </div>
                )}
                {block.type === 'wait' && `Wait ${block.time} seconds`}
                {block.type === 'animation' && `Play ${block.animationName} for ${block.duration} sec`}
              </div>
              <button 
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => onRemoveBlock(index)}
              >
                ✕
              </button>
            </div>
            
            {block.type === 'repeat' && expandedRepeatBlock === index && (
              <div className="ml-6 mt-1 p-2 border-l-2 border-blue-400">
                <h4 className="text-sm font-bold mb-1">Repeat Contents:</h4>
                {(block.subBlocks || []).map((subBlock, subIndex) => (
                  <div key={`${index}-${subIndex}`} className="p-2 bg-blue-50 rounded mb-1 text-sm">
                    {subBlock.type === 'move' && `Move ${subBlock.value} steps`}
                    {subBlock.type === 'turn' && `Turn ${subBlock.value} degrees`}
                    {subBlock.type === 'goto' && `Go to X: ${subBlock.x} Y: ${subBlock.y}`}
                  </div>
                ))}
                <button 
                  className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded"
                  onClick={() => handleAddSubBlock(index)}
                >
                  + Add Action
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-t p-2 flex flex-wrap">
        <button 
          className="mr-2 mb-1 bg-purple-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onAddAnimationBlock('dance', 2)}
        >
          + Dance Animation
        </button>
        <button 
          className="mr-2 mb-1 bg-purple-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onAddAnimationBlock('spin', 3)}
        >
          + Spin Animation
        </button>
        <button 
          className="mr-2 mb-1 bg-purple-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onAddAnimationBlock('wiggle', 1)}
        >
          + Wiggle Animation
        </button>
      </div>
    </div>
  );
};

export default MidArea;