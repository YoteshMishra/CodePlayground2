import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import CatSprite from './components/CatSprite';
import PlayButton from './components/PlayButton';
import detectCollision from './utils/collision'; // Update this import if your function name is different

export default function App() {
  const [sprites, setSprites] = useState([
    { 
      id: 1, 
      blocks: [], 
      position: { x: 100, y: 100 }, 
      isActive: false,
      isHero: true,
      animations: []
    }
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const [collisions, setCollisions] = useState([]);
  const initialPositionsRef = useRef({});
  const spritesRef = useRef({});
  const initialBlocksRef = useRef({});


  useEffect(() => {
    sprites.forEach(sprite => {
      if (!initialPositionsRef.current[sprite.id]) {
        initialPositionsRef.current[sprite.id] = { ...sprite.position };
        initialBlocksRef.current[sprite.id] = [];
      }
    });
  }, [sprites]);


  useEffect(() => {
    const heroSprite = sprites.find(s => s.isHero);
    if (!heroSprite) return;

    const newCollisions = sprites
      .filter(s => !s.isHero)
      .map(sprite => {
        const isColliding = detectCollision(
          heroSprite.position,
          sprite.position,
          60 
        );
        return { spriteId: sprite.id, isColliding };
      });
    
    setCollisions(newCollisions);
  }, [sprites]);

  const handleDropBlock = (block) => {
    if (!block || !block.type) return; 

    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === selectedSpriteId
          ? { ...sprite, blocks: [...sprite.blocks, block] }
          : sprite
      )
    );
  };

  const handleReorderBlocks = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0) return; 

    setSprites(prevSprites => {
      const updatedSprites = [...prevSprites];
      const spriteIndex = updatedSprites.findIndex(s => s.id === selectedSpriteId);
      if (spriteIndex === -1) return prevSprites;
      
      const spriteToUpdate = { ...updatedSprites[spriteIndex] };
      const newBlocks = [...spriteToUpdate.blocks];
      
      if (fromIndex >= newBlocks.length) return prevSprites; 
      
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      spriteToUpdate.blocks = newBlocks;
      updatedSprites[spriteIndex] = spriteToUpdate;
      
      return updatedSprites;
    });
  };

  const updateSpritePosition = (id, position) => {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') return; // Validate position

    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === id ? { ...sprite, position } : sprite
      )
    );
  };

  const handlePlay = () => {
    setSprites(prev => 
      prev.map(sprite => ({ ...sprite, isActive: true }))
    );
  };

  const handleReset = () => {
    setIsResetting(true);


    setSprites(prev => 
      prev.map(sprite => ({
        ...sprite, 
        isActive: false,
        position: initialPositionsRef.current[sprite.id] || sprite.position,
        blocks: [] 
      }))
    );

    setTimeout(() => setIsResetting(false), 100);
  };

  const handleSpriteSelect = (id) => {
    setSelectedSpriteId(id);
  };

  const handleExecutionDone = (id) => {
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === id ? { ...sprite, isActive: false } : sprite
      )
    );
  };

  const addSprite = () => {
    const newId = Math.max(...sprites.map(s => s.id), 0) + 1;
    const randomX = Math.floor(Math.random() * 250) + 50;
    const randomY = Math.floor(Math.random() * 250) + 50;
    const newPosition = { x: randomX, y: randomY };
    
    initialPositionsRef.current[newId] = { ...newPosition };
    initialBlocksRef.current[newId] = [];
    
    setSprites(prev => [
      ...prev,
      {
        id: newId,
        blocks: [],
        position: newPosition,
        isActive: false,
        isHero: false,
        animations: []
      }
    ]);
    
 
    setSelectedSpriteId(newId);
  };

  const removeSprite = (id) => {
    if (sprites.length <= 1) return;  
    
    setSprites(prev => prev.filter(sprite => sprite.id !== id));
    delete initialPositionsRef.current[id];
    delete initialBlocksRef.current[id];
    
    if (selectedSpriteId === id) {
      const remainingSprites = sprites.filter(sprite => sprite.id !== id);
      if (remainingSprites.length > 0) {
        setSelectedSpriteId(remainingSprites[0].id);
      }
    }
  };

  const toggleHero = (id) => {
    setSprites(prev => 
      prev.map(sprite => ({
        ...sprite,
        isHero: sprite.id === id
      }))
    );
  };

  const handleAddAnimationBlock = (animationName, duration) => {
    if (!animationName) return; 
    
    setSprites(prev => 
      prev.map(sprite => {
        if (sprite.id === selectedSpriteId) {
          const newBlock = {
            type: 'animation',
            animationName,
            duration: duration || 1000 
          };
          return { ...sprite, blocks: [...sprite.blocks, newBlock] };
        }
        return sprite;
      })
    );
  };

  const handleAddRepeatSubBlocks = (parentIndex, subBlock) => {
    if (parentIndex < 0 || !subBlock) return; 
    
    setSprites(prev => {
      const updatedSprites = [...prev];
      const spriteIndex = updatedSprites.findIndex(s => s.id === selectedSpriteId);
      if (spriteIndex === -1) return prev;
      
      const spriteToUpdate = { ...updatedSprites[spriteIndex] };
      const newBlocks = [...spriteToUpdate.blocks];
      
      if (parentIndex >= newBlocks.length) return prev; 
      
      const blockToUpdate = { ...newBlocks[parentIndex] };
      
      if (!blockToUpdate.subBlocks) {
        blockToUpdate.subBlocks = [];
      }
      
      blockToUpdate.subBlocks = [...blockToUpdate.subBlocks, subBlock];
      newBlocks[parentIndex] = blockToUpdate;
      
      spriteToUpdate.blocks = newBlocks;
      updatedSprites[spriteIndex] = spriteToUpdate;
      
      return updatedSprites;
    });
  };

  const handleUpdateBlock = (index, updatedBlock) => {
    if (index < 0 || !updatedBlock) return; 
    
    setSprites(prev => {
      const updatedSprites = [...prev];
      const spriteIndex = updatedSprites.findIndex(s => s.id === selectedSpriteId);
      if (spriteIndex === -1) return prev;
      
      const spriteToUpdate = { ...updatedSprites[spriteIndex] };
      const newBlocks = [...spriteToUpdate.blocks];
      
      if (index >= newBlocks.length) return prev; 
      
      newBlocks[index] = updatedBlock;
      
      spriteToUpdate.blocks = newBlocks;
      updatedSprites[spriteIndex] = spriteToUpdate;
      
      return updatedSprites;
    });
  };

  const handleRemoveBlock = (index) => {
    if (index < 0) return; 
    
    setSprites(prev => 
      prev.map(sprite => {
        if (sprite.id === selectedSpriteId) {
          const newBlocks = [...sprite.blocks];
          if (index < newBlocks.length) { 
            newBlocks.splice(index, 1);
          }
          return { ...sprite, blocks: newBlocks };
        }
        return sprite;
      })
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onDragStart={(e, type) => {
        if (type) {
          e.dataTransfer.setData('blockType', JSON.stringify(type));
        }
      }} />
      <MidArea 
        onDropBlock={handleDropBlock} 
        blocks={sprites.find(sprite => sprite.id === selectedSpriteId)?.blocks || []}
        onReorderBlocks={handleReorderBlocks}
        onRemoveBlock={handleRemoveBlock}
        onAddAnimationBlock={handleAddAnimationBlock}
        onAddRepeatSubBlocks={handleAddRepeatSubBlocks}
        onUpdateBlock={handleUpdateBlock}
      />
      <div className="w-1/4 relative bg-gray-100 border-l">
        <div className="relative h-3/4 overflow-hidden border-b border-gray-300">
          {sprites.map((sprite) => (
            <div key={sprite.id} className="relative">
              <CatSprite
                ref={el => spritesRef.current[sprite.id] = el}
                id={sprite.id}
                blocks={sprite.blocks}
                position={sprite.position}
                isActive={sprite.isActive}
                isSelected={selectedSpriteId === sprite.id}
                isHero={sprite.isHero}
                animations={sprite.animations}
                onSelect={() => handleSpriteSelect(sprite.id)}
                onExecutionDone={() => handleExecutionDone(sprite.id)}
                onPositionUpdate={(position) => updateSpritePosition(sprite.id, position)}
                onDrag={(id, position) => {
                  if (id && position) {
                    updateSpritePosition(id, position);
                  }
                }}
              />
              {selectedSpriteId === sprite.id && (
                <div className="absolute top-0 right-0 flex">
                  <button
                    onClick={() => toggleHero(sprite.id)}
                    className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    style={{ transform: 'translate(0%, -50%)' }}
                    title="Set as Hero"
                  >
                    👑
                  </button>
                  <button
                    onClick={() => removeSprite(sprite.id)}
                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    style={{ transform: 'translate(50%, -50%)', display: sprites.length > 1 ? 'flex' : 'none' }}
                    title="Remove Sprite"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 flex flex-col">
          <div className="flex space-x-2">
            <PlayButton onClick={handlePlay} />
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
              disabled={isResetting}
            >
              🔄 Reset
            </button>
          </div>
          <button
            onClick={addSprite}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            ➕ Add Sprite
          </button>
          
          <div className="mt-4">
            <h3 className="text-sm font-bold mb-1">Collisions (Hero Only):</h3>
            <div className="text-xs">
              {sprites.some(s => s.isHero) && collisions.map(collision => (
                <div 
                  key={collision.spriteId} 
                  className={collision.isColliding ? "text-red-500" : "text-green-500"}
                >
                  {collision.isColliding 
                    ? `⚠️ Collision with Sprite ${collision.spriteId}` 
                    : `✓ No collision with Sprite ${collision.spriteId}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes dance {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes wiggle {
          0% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          100% { transform: translateX(-3px); }
        }
        @keyframes jump {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}