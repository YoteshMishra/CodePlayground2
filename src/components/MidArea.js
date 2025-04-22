import React, { useState } from 'react';

const MidArea = ({ 
  onDropBlock, 
  blocks, 
  onReorderBlocks, 
  onRemoveBlock,
  onAddAnimationBlock = () => {},
  onAddRepeatSubBlocks = () => {},
  onUpdateBlock = () => {}
}) => {
  const [expandedRepeatBlock, setExpandedRepeatBlock] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const blockDataStr = e.dataTransfer.getData('blockType');
    if (blockDataStr) {
      try {
        const blockData = JSON.parse(blockDataStr); 
        if (blockData) {
          onDropBlock(blockData);
        }
      } catch (err) {
        console.error("Error parsing block data:", err);
      }
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

  const handleUpdateBlockValue = (index, field, value) => {
    const block = {...blocks[index]};
    block[field] = value;
    onUpdateBlock(index, block);
  };

  const renderEditableBlock = (block, index) => {
    switch(block.type) {
      case 'move':
        return (
          <div className="flex items-center">
            <span>Move</span>
            <input 
              type="number"
              className="mx-1 w-14 text-black px-1 rounded"
              value={block.value}
              onChange={(e) => handleUpdateBlockValue(index, 'value', parseInt(e.target.value) || 0)}
            />
            <span>steps</span>
          </div>
        );
      
      case 'turn':
        return (
          <div className="flex items-center">
            <span>Turn</span>
            <input 
              type="number"
              className="mx-1 w-14 text-black px-1 rounded"
              value={block.value}
              onChange={(e) => handleUpdateBlockValue(index, 'value', parseInt(e.target.value) || 0)}
            />
            <span>degrees</span>
          </div>
        );
      
      case 'goto':
        return (
          <div className="flex items-center">
            <span>Go to</span>
            <span className="mx-1">X:</span>
            <input 
              type="number"
              className="w-14 text-black px-1 rounded"
              value={block.x}
              onChange={(e) => handleUpdateBlockValue(index, 'x', parseInt(e.target.value) || 0)}
            />
            <span className="mx-1">Y:</span>
            <input 
              type="number"
              className="w-14 text-black px-1 rounded"
              value={block.y}
              onChange={(e) => handleUpdateBlockValue(index, 'y', parseInt(e.target.value) || 0)}
            />
          </div>
        );
      
      case 'say':
        return (
          <div>
            <div className="flex items-center mb-1">
              <span>Say</span>
              <input 
                type="text"
                className="mx-1 flex-1 text-black px-1 rounded"
                value={block.message || ""}
                onChange={(e) => handleUpdateBlockValue(index, 'message', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <span>for</span>
              <input 
                type="number"
                className="mx-1 w-14 text-black px-1 rounded"
                value={block.time || 1}
                onChange={(e) => handleUpdateBlockValue(index, 'time', parseInt(e.target.value) || 1)}
              />
              <span>sec</span>
            </div>
          </div>
        );
      
      case 'think':
        return (
          <div>
            <div className="flex items-center mb-1">
              <span>Think</span>
              <input 
                type="text"
                className="mx-1 flex-1 text-black px-1 rounded"
                value={block.message || ""}
                onChange={(e) => handleUpdateBlockValue(index, 'message', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <span>for</span>
              <input 
                type="number"
                className="mx-1 w-14 text-black px-1 rounded"
                value={block.time || 1}
                onChange={(e) => handleUpdateBlockValue(index, 'time', parseInt(e.target.value) || 1)}
              />
              <span>sec</span>
            </div>
          </div>
        );
      
      case 'repeat':
        return (
          <div className="flex items-center">
            <span>Repeat</span>
            <input 
              type="number"
              className="mx-1 w-14 text-black px-1 rounded"
              value={block.count || 1}
              onChange={(e) => handleUpdateBlockValue(index, 'count', parseInt(e.target.value) || 1)}
            />
            <span>times</span>
            <button 
              className="ml-2 bg-blue-100 px-1 rounded text-xs"
              onClick={() => setExpandedRepeatBlock(expandedRepeatBlock === index ? null : index)}
            >
              {expandedRepeatBlock === index ? 'Hide' : 'Edit'}
            </button>
          </div>
        );
      
      case 'wait':
        return (
          <div className="flex items-center">
            <span>Wait</span>
            <input 
              type="number"
              className="mx-1 w-14 text-black px-1 rounded"
              value={block.time || 1}
              onChange={(e) => handleUpdateBlockValue(index, 'time', parseInt(e.target.value) || 1)}
            />
            <span>seconds</span>
          </div>
        );
      
      case 'animation':
        return (
          <div className="flex items-center">
            <span>Play</span>
            <select
              className="mx-1 text-black px-1 rounded"
              value={block.animationName}
              onChange={(e) => handleUpdateBlockValue(index, 'animationName', e.target.value)}
            >
              <option value="dance">Dance</option>
              <option value="spin">Spin</option>
              <option value="wiggle">Wiggle</option>
              <option value="Jump">Jump</option>
            </select>
            <span>for</span>
            <input 
              type="number"
              className="mx-1 w-14 text-black px-1 rounded"
              value={block.duration || 1}
              onChange={(e) => handleUpdateBlockValue(index, 'duration', parseInt(e.target.value) || 1)}
            />
            <span>sec</span>
          </div>
        );
      
      default:
        return <span>{block.type}</span>;
    }
  };

  return (
    <div className="flex-1 min-h-64 flex flex-col">
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
              onClick={() => setEditingBlock(editingBlock === index ? null : index)}
            >
              <div className="flex-1">
                {editingBlock === index ? (
                  renderEditableBlock(block, index)
                ) : (
                  <>
                    {block.type === 'move' && `Move ${block.value} steps`}
                    {block.type === 'turn' && `Turn ${block.value} degrees`}
                    {block.type === 'goto' && `Go to X: ${block.x} Y: ${block.y}`}
                    {block.type === 'say' && `Say "${block.message}" for ${block.time} sec`}
                    {block.type === 'think' && `Think "${block.message}" for ${block.time} sec`}
                    {block.type === 'repeat' && `Repeat ${block.count} times`}
                    {block.type === 'wait' && `Wait ${block.time} seconds`}
                    {block.type === 'animation' && `Play ${block.animationName} for ${block.duration} sec`}
                  </>
                )}
              </div>
              <div className="flex">
                {block.type === 'repeat' && (
                  <button 
                    className="mr-2 bg-blue-100 px-1 rounded text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedRepeatBlock(expandedRepeatBlock === index ? null : index);
                    }}
                  >
                    {expandedRepeatBlock === index ? 'Hide' : 'Edit'}
                  </button>
                )}
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBlock(index);
                  }}
                >
                  ✕
                </button>
              </div>
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