import React, { useState, useEffect, useRef } from 'react';

const CatSprite = React.forwardRef(({
  id,
  blocks,
  position,
  isActive,
  isSelected,
  isHero,
  animations = [],
  onSelect,
  onExecutionDone,
  onPositionUpdate,
  onDrag
}, ref) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [sayText, setSayText] = useState('');
  const [thinkText, setThinkText] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isColliding, setIsColliding] = useState(false);
  
  const spriteRef = useRef(null);
  const executionTimeoutRef = useRef(null);
  const blockIndexRef = useRef(0);
  const dragPositionRef = useRef(position);
  const executeRef = useRef({ isRunning: false });

  
  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
      dragPositionRef.current = position;
    }
  }, [position, isDragging]);


  useEffect(() => {
    if (!isActive) {
      setCurrentAnimation(null);
      setSayText('');
      setThinkText('');
    }
  }, [isActive]);


  useEffect(() => {
    if (isActive && blocks.length > 0 && !executeRef.current.isRunning) {
      blockIndexRef.current = 0;
      executeRef.current.isRunning = true;
      executeNextBlock();
    }
    
    return () => {
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    };
  }, [isActive, blocks]);


  useEffect(() => {
    let timer;
    if (isColliding) {
      timer = setTimeout(() => {
        setIsColliding(false);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isColliding]);

  const executeNextBlock = async () => {
    if (!isActive || blockIndexRef.current >= blocks.length) {
      executeRef.current.isRunning = false;
      if (onExecutionDone) onExecutionDone(id);
      return;
    }

    const block = blocks[blockIndexRef.current];
    await executeBlock(block);
  };

  const executeBlock = async (block) => {
    switch (block.type) {
      case 'move':
        await moveSprite(block.value);
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'turn':
        setRotation(prev => prev + parseInt(block.value || 0));
        await wait(300);
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'goto':
        const newPos = { x: parseInt(block.x) || 0, y: parseInt(block.y) || 0 };
        setCurrentPosition(newPos);
        dragPositionRef.current = newPos;
        onPositionUpdate(id, newPos);
        await wait(300);
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'say':
        setSayText(block.message || '');
        await wait(parseFloat(block.time) * 1000 || 2000);
        setSayText('');
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'think':
        setThinkText(block.message || '');
        await wait(parseFloat(block.time) * 1000 || 2000);
        setThinkText('');
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'wait':
       
        await wait(Math.max(parseFloat(block.time || 1) * 1000, 100));
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'animation':
        setCurrentAnimation(block.animationName);
        await wait(parseFloat(block.duration) * 1000 || 2000);
        setCurrentAnimation(null);
        blockIndexRef.current++;
        executeNextBlock();
        break;

      case 'repeat':
        await executeRepeatBlock(block);
        blockIndexRef.current++;
        executeNextBlock();
        break;

      default:
        blockIndexRef.current++;
        executeNextBlock();
    }
  };

  const wait = (ms) => {
    return new Promise(resolve => {
      executionTimeoutRef.current = setTimeout(resolve, ms);
    });
  };


  const executeRepeatBlock = async (block) => {
    const count = parseInt(block.count) || 0;
    
    for (let i = 0; i < count; i++) {
      setCurrentPosition(prev => ({ ...prev, x: prev.x + 10 }));
      dragPositionRef.current = { 
        ...currentPosition, 
        x: currentPosition.x + 10 
      };
      onPositionUpdate(id, dragPositionRef.current);
      await wait(200);
    }
  };

  const moveSprite = async (steps) => {
    const stepsNum = parseInt(steps) || 0;
    const radians = rotation * Math.PI / 180;
    const newX = currentPosition.x + Math.cos(radians) * stepsNum;
    const newY = currentPosition.y + Math.sin(radians) * stepsNum;
    
    const newPos = { x: newX, y: newY };
    setCurrentPosition(newPos);
    dragPositionRef.current = newPos;
    onPositionUpdate(id, newPos);
    
    await wait(300);
    return;
  };

  const handleMouseDown = (e) => {
    if (isActive) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = spriteRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setIsDragging(true);
    if (onSelect) onSelect();

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const parentRect = spriteRef.current.parentElement.getBoundingClientRect();
      const x = moveEvent.clientX - parentRect.left - offsetX;
      const y = moveEvent.clientY - parentRect.top - offsetY;
      const newPos = { x, y };
      setCurrentPosition(newPos);
      dragPositionRef.current = newPos;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onPositionUpdate(id, dragPositionRef.current);
      if (onDrag) onDrag(id, dragPositionRef.current);
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (isActive) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const rect = spriteRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    setIsDragging(true);
    if (onSelect) onSelect();

    const handleTouchMove = (moveEvent) => {
      moveEvent.preventDefault();
      const touch = moveEvent.touches[0];
      const parentRect = spriteRef.current.parentElement.getBoundingClientRect();
      const x = touch.clientX - parentRect.left - offsetX;
      const y = touch.clientY - parentRect.top - offsetY;
      const newPos = { x, y };
      setCurrentPosition(newPos);
      dragPositionRef.current = newPos;
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      onPositionUpdate(id, dragPositionRef.current);
      if (onDrag) onDrag(id, dragPositionRef.current);
      setIsDragging(false);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getAnimationClass = () => {
    if (!currentAnimation) return '';
    switch (currentAnimation.toLowerCase()) {
      case 'dance': return 'animate-dance';
      case 'spin': return 'animate-spin-custom';
      case 'wiggle': return 'animate-wiggle';
      case 'jump': return 'animate-jump';
      default: return '';
    }
  };

  return (
    <div
      ref={(node) => {
        if (ref) {
          if (typeof ref === 'function') ref(node);
          else ref.current = node;
        }
        spriteRef.current = node;
      }}
      style={{
        position: 'absolute',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transform: `rotate(${rotation}deg)`,
        cursor: isActive ? 'default' : isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 10 : (isSelected ? 2 : 1),
        transition: isDragging ? 'none' : 'transform 0.3s ease, left 0.3s ease, top 0.3s ease',
        userSelect: 'none',
        touchAction: 'none',
        border: isSelected ? '3px solid blue' : isColliding ? '3px solid red' : 'none',
        borderRadius: isSelected || isColliding ? '50%' : '0',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect();
      }}
      className={`w-20 h-20 ${getAnimationClass()}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {isHero ? (
          <div className="relative">
            <div className="absolute -top-4 -right-4 text-yellow-500 text-xl">👑</div>
            <div className="text-4xl">🐱</div>
          </div>
        ) : (
          <div className="text-4xl">🐱</div>
        )}
      </div>

      {sayText && (
        <div className="absolute -top-12 left-0 bg-white rounded-lg p-2 border text-center min-w-32 z-20">
          {sayText}
        </div>
      )}
      
      {thinkText && (
        <div className="absolute -top-12 left-0 bg-white rounded-full p-2 border text-center min-w-32 z-20">
          <span role="img" aria-label="thinking">💭</span> {thinkText}
        </div>
      )}

      <style jsx>{`
        .animate-dance {
          animation: dance 0.5s infinite alternate;
        }
        .animate-spin-custom {
          animation: spin 1s infinite linear;
        }
        .animate-wiggle {
          animation: wiggle 0.3s infinite;
        }
        .animate-jump {
          animation: jump 0.7s infinite;
        }
        @keyframes dance {
          0% { transform: translateY(0) rotate(${rotation}deg); }
          100% { transform: translateY(-10px) rotate(${rotation}deg); }
        }
        @keyframes spin {
          0% { transform: rotate(${rotation}deg); }
          100% { transform: rotate(${rotation + 360}deg); }
        }
        @keyframes wiggle {
          0% { transform: translateX(-3px) rotate(${rotation}deg); }
          50% { transform: translateX(3px) rotate(${rotation}deg); }
          100% { transform: translateX(-3px) rotate(${rotation}deg); }
        }
        @keyframes jump {
          0% { transform: translateY(0) rotate(${rotation}deg); }
          50% { transform: translateY(-15px) rotate(${rotation}deg); }
          100% { transform: translateY(0) rotate(${rotation}deg); }
        }
      `}</style>
    </div>
  );
});

export default CatSprite;