// CatSprite.js
import React, { useEffect, useState, useRef } from 'react';

const CatSprite = ({ 
  id, 
  blocks, 
  position, 
  isActive, 
  isSelected,
  onSelect,
  onExecutionDone, 
  onPositionUpdate 
}) => {
  const [pos, setPos] = useState(position);
  const [sayText, setSayText] = useState('');
  const [thinkText, setThinkText] = useState('');
  const [rotation, setRotation] = useState(0);
  const executeRef = useRef({ isRunning: false });

  useEffect(() => {
    setPos(position);
  }, [position]);

  useEffect(() => {
    if (!isActive || executeRef.current.isRunning) return;

    const executeBlocks = async () => {
      executeRef.current.isRunning = true;
      
      for (let block of blocks) {
        try {
          switch (block.type) {
            case 'move':
              setPos((prev) => ({ ...prev, x: prev.x + block.value }));
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'turn':
              setRotation(prev => prev + block.value);
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'goto':
              setPos({ x: block.x, y: block.y });
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'repeat':
              for (let i = 0; i < block.count; i++) {
                setPos((prev) => ({ ...prev, x: prev.x + 10 }));
                await new Promise((res) => setTimeout(res, 200));
              }
              break;
              
            case 'wait':
              await new Promise((res) => setTimeout(res, block.time * 1000));
              break;
              
            case 'say':
              setSayText(block.message);
              await new Promise((res) => setTimeout(res, block.time * 1000));
              setSayText('');
              break;
              
            case 'think':
              setThinkText(block.message);
              await new Promise((res) => setTimeout(res, block.time * 1000));
              setThinkText('');
              break;
              
            default:
              break;
          }
        } catch (error) {
          console.error("Error executing block:", error);
        }
      }
      
      executeRef.current.isRunning = false;
      if (onExecutionDone) onExecutionDone();
    };

    if (isActive) {
      executeBlocks();
    }
  }, [isActive, blocks, onExecutionDone]);

  useEffect(() => {
    if (onPositionUpdate) {
      onPositionUpdate(id, pos);
    }
  }, [pos, id, onPositionUpdate]);

  const handleDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Prevent invalid values
    
    if (onPositionUpdate) {
      onPositionUpdate(id, { 
        x: e.clientX - e.target.width / 2, 
        y: e.clientY - e.target.height / 2 
      });
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        transform: `rotate(${rotation}deg)`
      }}
      onClick={handleClick}
    >
      {sayText && (
        <div className="bg-white rounded-lg p-2 mb-2 border text-center">
          {sayText}
        </div>
      )}
      
      {thinkText && (
        <div className="bg-white rounded-full p-2 mb-2 border text-center">
          {thinkText}
        </div>
      )}
      
      <img
        src="/cat.png"
        alt="cat"
        className={`w-16 h-16 ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
        style={{ cursor: 'pointer' }}
        draggable
        onDrag={handleDrag}
        onDragEnd={handleDrag}
      />
      
      {isSelected && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs bg-blue-500 text-white px-1 rounded">
          Selected
        </div>
      )}
    </div>
  );
};

export default CatSprite;