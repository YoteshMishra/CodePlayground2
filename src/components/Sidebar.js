import React from 'react';

const Sidebar = ({ onDragStart }) => {
  const blocks = [
    { type: 'move', value: 10 },
    { type: 'turn', value: 15 },
    { type: 'goto', x: 200, y: 200 },
    { type: 'say', message: 'Hello!', time: 2 },
    { type: 'think', message: 'Hmm...', time: 2 },
    { type: 'repeat', count: 3, subBlocks: [] },
    { type: 'wait', time: 1 }
  ];

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-5 text-center w-full">Blocks</div>
      {blocks.map((block, i) => (
        <div
          key={i}
          className="block p-2 my-2 rounded cursor-grab bg-blue-500 text-white w-full text-center"
          draggable
          onDragStart={(e) => onDragStart(e, block)}
        >
          {block.type === 'move' && `Move ${block.value} steps`}
          {block.type === 'turn' && `Turn ${block.value} degrees`}
          {block.type === 'goto' && `Go to position`}
          {block.type === 'say' && `Say message`}
          {block.type === 'think' && `Think message`}
          {block.type === 'repeat' && `Repeat ${block.count} times`}
          {block.type === 'wait' && `Wait ${block.time} seconds`}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;