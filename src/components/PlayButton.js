import React from 'react';

const PlayButton = ({ onClick }) => {
  return (
    <div className="p-4">
      <button
        onClick={onClick}
        className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
      >
        ▶️ Play
      </button>
    </div>
  );
};

export default PlayButton;
