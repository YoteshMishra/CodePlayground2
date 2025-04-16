import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import CatSprite from './components/CatSprite';
import PlayButton from './components/PlayButton';
import { isColliding } from './utils/collision';

export default function App() {
  const [sprites, setSprites] = useState([
    { id: 1, blocks: [], position: { x: 100, y: 100 }, isActive: false }
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  const spriteRefs = useRef({});

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
    
    setSprites(prev => [
      ...prev,
      {
        id: newId,
        blocks: [],
        position: { x: randomX, y: randomY },
        isActive: false
      }
    ]);
  };

  const removeSprite = (id) => {
    if (sprites.length <= 1) return; // Keep at least one sprite
    
    setSprites(prev => prev.filter(sprite => sprite.id !== id));
    
    // If we're removing the selected sprite, select another one
    if (selectedSpriteId === id) {
      const remainingSprites = sprites.filter(sprite => sprite.id !== id);
      if (remainingSprites.length > 0) {
        setSelectedSpriteId(remainingSprites[0].id);
      }
    }
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
                onSelect={() => handleSpriteSelect(sprite.id)}
                onExecutionDone={handleExecutionDone}
                onPositionUpdate={updateSpritePosition}
              />
              {selectedSpriteId === sprite.id && (
                <button
                  onClick={() => removeSprite(sprite.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  style={{ 
                    transform: 'translate(50%, -50%)',
                    display: sprites.length > 1 ? 'flex' : 'none'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 flex flex-col">
          <PlayButton onClick={handlePlay} />
          <button
            onClick={addSprite}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            ➕ Add Sprite
          </button>
        </div>
      </div>
    </div>
  );
}