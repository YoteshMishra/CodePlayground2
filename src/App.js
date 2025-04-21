import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import CatSprite from './components/CatSprite';
import PlayButton from './components/PlayButton';
import { isColliding } from './utils/collision';

export default function App() {
  const [sprites, setSprites] = useState([
    { 
      id: 1, 
      blocks: [], 
      position: { x: 100, y: 100 }, 
      isActive: false,
      isHero: true,
      animations: {
        dance: { animation: 'bounce 1s infinite' },
        spin: { animation: 'spin 2s infinite linear' }
      }
    }
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const spriteRefs = useRef({});
  const initialPositionsRef = useRef({});

  // Store initial positions when adding sprites
  useEffect(() => {
    sprites.forEach(sprite => {
      if (!initialPositionsRef.current[sprite.id]) {
        initialPositionsRef.current[sprite.id] = { ...sprite.position };
      }
    });
  }, [sprites]);

  const handleDropBlock = (block) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === selectedSpriteId
          ? { ...sprite, blocks: [...sprite.blocks, block] }
          : sprite
      )
    );
  };

  const handleReorderBlocks = (fromIndex, toIndex) => {
    setSprites(prevSprites => {
      const updatedSprites = [...prevSprites];
      const spriteIndex = updatedSprites.findIndex(s => s.id === selectedSpriteId);
      if (spriteIndex === -1) return prevSprites;
      
      const spriteToUpdate = { ...updatedSprites[spriteIndex] };
      const newBlocks = [...spriteToUpdate.blocks];
      
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      spriteToUpdate.blocks = newBlocks;
      updatedSprites[spriteIndex] = spriteToUpdate;
      
      return updatedSprites;
    });
  };

  const updateSpritePosition = (id, position) => {
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
    // Reset all sprites to their initial positions
    setSprites(prev => 
      prev.map(sprite => ({ 
        ...sprite, 
        isActive: false,
        position: initialPositionsRef.current[sprite.id] || sprite.position
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

    checkCollisions();
  };

  const checkCollisions = () => {
    if (sprites.length <= 1) return;
    
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        if (isColliding(sprites[i].position, sprites[j].position)) {
          // Trigger visual collision effect
          if (spriteRefs.current[sprites[i].id]) {
            spriteRefs.current[sprites[i].id].setIsColliding(true);
          }
          if (spriteRefs.current[sprites[j].id]) {
            spriteRefs.current[sprites[j].id].setIsColliding(true);
          }
          
          // Handle the blocks exchange
          handleCollision(sprites[i].id, sprites[j].id);
        }
      }
    }
  };

  const handleCollision = (id1, id2) => {
    setSprites(prev => {
      const newSprites = [...prev];
      const sprite1Index = newSprites.findIndex(s => s.id === id1);
      const sprite2Index = newSprites.findIndex(s => s.id === id2);
      
      if (sprite1Index === -1 || sprite2Index === -1) return prev;
      
      // Exchange blocks between sprites
      const temp = [...newSprites[sprite1Index].blocks];
      newSprites[sprite1Index].blocks = [...newSprites[sprite2Index].blocks];
      newSprites[sprite2Index].blocks = temp;
      
      return newSprites;
    });
  };

  const addSprite = () => {
    const newId = Math.max(...sprites.map(s => s.id)) + 1;
    
    // Calculate a position that's visible in the preview area
    // Position X between 50-300px, Y between 50-300px
    const randomX = Math.floor(Math.random() * 250) + 50;
    const randomY = Math.floor(Math.random() * 250) + 50;
    
    const newPosition = { x: randomX, y: randomY };
    
    // Store initial position
    initialPositionsRef.current[newId] = { ...newPosition };
    
    setSprites(prev => [
      ...prev,
      {
        id: newId,
        blocks: [],
        position: newPosition,
        isActive: false,
        isHero: false,
        animations: {
          wiggle: { animation: 'wiggle 1s ease-in-out' },
          pulse: { animation: 'pulse 2s infinite' }
        }
      }
    ]);
  };

  const removeSprite = (id) => {
    if (sprites.length <= 1) return; // Keep at least one sprite
    
    setSprites(prev => prev.filter(sprite => sprite.id !== id));
    
    // Clean up references
    delete spriteRefs.current[id];
    delete initialPositionsRef.current[id];
    
    // If we're removing the selected sprite, select another one
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
        isHero: sprite.id === id ? true : false
      }))
    );
  };

  const addAnimationToSprite = (id, animationName, animationStyle) => {
    setSprites(prev => 
      prev.map(sprite => {
        if (sprite.id === id) {
          return {
            ...sprite,
            animations: {
              ...sprite.animations,
              [animationName]: animationStyle
            }
          };
        }
        return sprite;
      })
    );
  };

  const selectedSprite = sprites.find(s => s.id === selectedSpriteId) || sprites[0];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onDragStart={(e, type) =>
          e.dataTransfer.setData('blockType', JSON.stringify(type))
        }
      />
      <MidArea 
        onDropBlock={handleDropBlock} 
        blocks={selectedSprite?.blocks || []}
        onReorderBlocks={handleReorderBlocks}
        onRemoveBlock={(index) => {
          setSprites(prev => 
            prev.map(sprite => {
              if (sprite.id === selectedSpriteId) {
                const newBlocks = [...sprite.blocks];
                newBlocks.splice(index, 1);
                return { ...sprite, blocks: newBlocks };
              }
              return sprite;
            })
          );
        }}
        onAddAnimationBlock={(animationName, duration) => {
          const animationBlock = {
            type: 'animation',
            animationName,
            duration
          };
          handleDropBlock(animationBlock);
        }}
        onAddRepeatSubBlocks={(index, subBlock) => {
          setSprites(prev => 
            prev.map(sprite => {
              if (sprite.id === selectedSpriteId) {
                const newBlocks = [...sprite.blocks];
                if (!newBlocks[index].subBlocks) {
                  newBlocks[index].subBlocks = [];
                }
                newBlocks[index].subBlocks.push(subBlock);
                return { ...sprite, blocks: newBlocks };
              }
              return sprite;
            })
          );
        }}
      />

      <div className="w-1/4 relative bg-gray-100 border-l">
        <div className="relative h-full">
          {sprites.map((sprite) => (
            <div key={sprite.id} className="relative">
              <CatSprite
                ref={(el) => spriteRefs.current[sprite.id] = el}
                id={sprite.id}
                blocks={sprite.blocks}
                position={sprite.position}
                isActive={sprite.isActive}
                isSelected={selectedSpriteId === sprite.id}
                isHero={sprite.isHero}
                animations={sprite.animations}
                onSelect={() => handleSpriteSelect(sprite.id)}
                onExecutionDone={handleExecutionDone}
                onPositionUpdate={updateSpritePosition}
              />
              {selectedSpriteId === sprite.id && (
                <div className="absolute top-0 right-0 flex">
                  <button
                    onClick={() => toggleHero(sprite.id)}
                    className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    style={{ 
                      transform: 'translate(0%, -50%)'
                    }}
                  >
                    👑
                  </button>
                  <button
                    onClick={() => removeSprite(sprite.id)}
                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    style={{ 
                      transform: 'translate(50%, -50%)',
                      display: sprites.length > 1 ? 'flex' : 'none'
                    }}
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
          {selectedSpriteId && (
            <div className="mt-2 bg-white p-2 rounded shadow">
              <h3 className="font-bold">Selected Sprite: #{selectedSpriteId}</h3>
              <div className="mt-1">
                <button
                  onClick={() => addAnimationToSprite(selectedSpriteId, `animation-${Date.now()}`, { animation: 'pulse 2s infinite' })}
                  className="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Add Custom Animation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}