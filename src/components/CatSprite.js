import React, { useEffect, useState, useRef, forwardRef } from 'react';

const CatSprite = forwardRef(({ 
  id, 
  blocks, 
  position, 
  isActive, 
  isSelected = false, 
  onSelect, 
  onExecutionDone, 
  onPositionUpdate,
  isHero = false,
  animations = {}
}, ref) => {
  const [pos, setPos] = useState(position);
  const [sayText, setSayText] = useState('');
  const [thinkText, setThinkText] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isColliding, setIsColliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const executeRef = useRef({ isRunning: false });
  
  // Make the component's state accessible via ref
  React.useImperativeHandle(ref, () => ({
    setIsColliding
  }));

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
              const subBlocks = block.subBlocks || [];
              
              for (let i = 0; i < count; i++) {
                for (let subBlock of subBlocks) {
                  switch (subBlock.type) {
                    case 'move':
                      const subSteps = parseInt(subBlock.value) || 0;
                      setPos((prev) => ({ ...prev, x: prev.x + subSteps }));
                      await new Promise((res) => setTimeout(res, 300));
                      break;
                    
                    case 'turn':
                      const subDegrees = parseInt(subBlock.value) || 0;
                      setRotation(prev => prev + subDegrees);
                      await new Promise((res) => setTimeout(res, 300));
                      break;
                      
                    case 'goto':
                      const subX = parseInt(subBlock.x) || 0;
                      const subY = parseInt(subBlock.y) || 0;
                      setPos({ x: subX, y: subY });
                      await new Promise((res) => setTimeout(res, 300));
                      break;
                      
                    default:
                      break;
                  }
                }
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
              
            case 'animation':
              setCurrentAnimation(block.animationName);
              await new Promise((res) => setTimeout(res, block.duration * 1000));
              setCurrentAnimation(null);
              break;
              
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Error executing blocks:", error);
      } finally {
        executeRef.current.isRunning = false;
        if (onExecutionDone) onExecutionDone(id);
      }
    };

    if (isActive) {
      executeBlocks();
    }
  }, [isActive, blocks, id, onExecutionDone]);

  useEffect(() => {
    if (onPositionUpdate) {
      onPositionUpdate(id, pos);
    }
  }, [pos, id, onPositionUpdate]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    // Store the initial mouse position relative to the sprite
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('text/plain', JSON.stringify({ offsetX, offsetY }));
    
    // Set a transparent drag image
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrag = (e) => {
    if (!e.clientX && !e.clientY) return; // Skip invalid events
    
    if (isDragging && onPositionUpdate) {
      const offsetData = JSON.parse(e.dataTransfer.getData('text/plain') || '{"offsetX":0,"offsetY":0}');
      
      onPositionUpdate(id, { 
        x: e.clientX - offsetData.offsetX, 
        y: e.clientY - offsetData.offsetY  
      });
    }
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    if (onPositionUpdate && e.clientX && e.clientY) {
      const offsetData = JSON.parse(e.dataTransfer.getData('text/plain') || '{"offsetX":0,"offsetY":0}');
      
      onPositionUpdate(id, { 
        x: e.clientX - offsetData.offsetX, 
        y: e.clientY - offsetData.offsetY  
      });
    }
  };

  // Animation for collision effect
  useEffect(() => {
    let timer;
    if (isColliding) {
      timer = setTimeout(() => {
        setIsColliding(false);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isColliding]);

  // Get Tailwind animation class based on current animation
  const getAnimationClassName = () => {
    if (!currentAnimation) return '';
    
    switch (currentAnimation) {
      case 'pulse':
        return 'animate-pulse';
      case 'spin':
        return 'animate-spin';
      case 'dance':
      case 'bounce':
        return 'animate-bounce';
      case 'wiggle':
        return 'animate-wiggle';
      default:
        return '';
    }
  };

  const spriteStyle = {
    left: `${pos.x}px`, 
    top: `${pos.y}px`,
    transform: `rotate(${rotation}deg)`,
    border: isSelected ? '3px solid blue' : isColliding ? '3px solid red' : isHero ? '3px solid gold' : 'none',
    borderRadius: isSelected || isColliding || isHero ? '50%' : '0',
    cursor: 'move',
    zIndex: isSelected ? 10 : isHero ? 5 : 1,
    transition: 'left 0.3s, top 0.3s'
  };

  return (
    <div 
      className={`absolute ${getAnimationClassName()} ${isDragging ? 'opacity-50' : ''}`}
      style={spriteStyle}
      onClick={onSelect}
    >
      {isColliding && (
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: rotate(${rotation}deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(${rotation - 5}deg); }
            20%, 40%, 60%, 80% { transform: rotate(${rotation + 5}deg); }
          }
        `}</style>
      )}
      
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
      
      {isHero && (
        <div className="absolute -top-6 left-0 right-0 mx-auto text-center">
          <span role="img" aria-label="hero" className="text-lg">👑</span>
        </div>
      )}
      
      <img
        src="/cat.png"
        alt="cat"
        className="w-16 h-16"
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
});

export default CatSprite;