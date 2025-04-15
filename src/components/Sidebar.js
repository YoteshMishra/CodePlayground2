import React from 'react';
import MotionBlock from '../blocks/MotionBlock';
import LooksBlock from '../blocks/LooksBlock';
import ControlBlock from '../blocks/ControlBlock';

const Sidebar = ({ onDragStart }) => {
  return (
    <div className="w-1/4 bg-gray-50 border-r h-full overflow-y-auto p-4">
      <MotionBlock onDragStart={onDragStart} />
      <LooksBlock onDragStart={onDragStart} />
      <ControlBlock onDragStart={onDragStart} />
    </div>
  );
};

export default Sidebar;
