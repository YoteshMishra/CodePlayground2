// CatSprite.js
import React, { useEffect, useState, useRef } from 'react';

const CatSprite = ({ 
  id, 
  blocks, 
  position, 
  isActive, 
  isSelected = false, 
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
      
      try {
        for (let block of blocks) {
          switch (block.type) {
            case 'move':
         
              const steps = parseInt(block.value) || 0;
              setPos((prev) => ({ ...prev, x: prev.x + steps }));
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'turn':
              const degrees = parseInt(block.value) || 0;
              setRotation(prev => prev + degrees);
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'goto':
              const x = parseInt(block.x) || 0;
              const y = parseInt(block.y) || 0;
              setPos({ x, y });
              await new Promise((res) => setTimeout(res, 300));
              break;
              
            case 'repeat':
              const count = parseInt(block.count) || 0;
              for (let i = 0; i < count; i++) {
                setPos((prev) => ({ ...prev, x: prev.x + 10 }));
                await new Promise((res) => setTimeout(res, 200));
              }
              break;
              
            case 'wait':
              const time = parseFloat(block.time) || 0;
              await new Promise((res) => setTimeout(res, time * 1000));
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
        }
      } catch (error) {
        console.error("Error executing blocks:", error);
      } finally {
        executeRef.current.isRunning = false;
        if (onExecutionDone) onExecutionDone();
      }
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
    if (e.clientX === 0 && e.clientY === 0) return; 
    
    if (onPositionUpdate) {
      onPositionUpdate(id, { 
        x: e.clientX - 32, 
        y: e.clientY - 32  
      });
    }
  };

  const spriteStyle = {
    left: `${pos.x}px`, 
    top: `${pos.y}px`,
    transform: `rotate(${rotation}deg)`,
    border: isSelected ? '3px solid blue' : 'none',
    borderRadius: isSelected ? '50%' : '0',
    cursor: 'pointer',
    zIndex: isSelected ? 10 : 1
  };

  return (
    <div 
      className="absolute"
      style={spriteStyle}
      onClick={onSelect}
    >
      {sayText && (
        <div className="absolute -top-12 left-0 bg-white rounded-lg p-2 border text-center min-w-32">
          {sayText}
        </div>
      )}
      
      {thinkText && (
        <div className="absolute -top-12 left-0 bg-white rounded-full p-2 border text-center min-w-32">
          <span role="img" aria-label="thinking">💭</span> {thinkText}
        </div>
      )}
      
      <img
        src="/cat.png"
        alt="cat"
        className="w-16 h-16"
        draggable
        onDrag={handleDrag}
        onDragEnd={handleDrag}
      />
    </div>
  );
};

export default CatSprite;
