// App.js
import React, { useState } from 'react';
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
      
      // Remove the block from the old position
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      // Insert it at the new position
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
    // Set all sprites to active state to start execution
    setSprites(prev => 
      prev.map(sprite => ({ ...sprite, isActive: true }))
    );
  };

  const handleExecutionDone = (id) => {
    // Set sprite inactive when execution is complete
    setSprites(prev =>
      prev.map(sprite =>
        sprite.id === id ? { ...sprite, isActive: false } : sprite
      )
    );

    // Check for collisions after execution
    checkCollisions();
  };

  const checkCollisions = () => {
    if (sprites.length <= 1) return;
    
    // Check each pair of sprites for collision
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        if (isColliding(sprites[i].position, sprites[j].position)) {
          // Handle collision animation - swap animations/blocks/etc
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
      
      // Simple collision effect - swap blocks between sprites
      const temp = [...newSprites[sprite1Index].blocks];
      newSprites[sprite1Index].blocks = [...newSprites[sprite2Index].blocks];
      newSprites[sprite2Index].blocks = temp;
      
      return newSprites;
    });
  };

  const addSprite = () => {
    const newId = Math.max(...sprites.map(s => s.id)) + 1;
    setSprites(prev => [
      ...prev,
      {
        id: newId,
        blocks: [],
        position: { x: 200, y: 200 },
        isActive: false
      }
    ]);
  };

  const handleSpriteSelect = (id) => {
    setSelectedSpriteId(id);
  };

  // Find the currently selected sprite to display its blocks
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
        blocks={selectedSprite.blocks}
        onReorderBlocks={handleReorderBlocks}
        selectedSpriteId={selectedSpriteId}
      />

      <div className="w-1/4 relative bg-gray-100 border-l">
        <div className="relative h-full">
          {sprites.map((sprite) => (
            <CatSprite
              key={sprite.id}
              id={sprite.id}
              blocks={sprite.blocks}
              position={sprite.position}
              isActive={sprite.isActive}
              isSelected={sprite.id === selectedSpriteId}
              onSelect={() => handleSpriteSelect(sprite.id)}
              onExecutionDone={() => handleExecutionDone(sprite.id)}
              onPositionUpdate={updateSpritePosition}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-4">
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