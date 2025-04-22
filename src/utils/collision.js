
/**
 * Detect collision between two objects based on their positions and size
 * @param {Object} posA - Position of object A with x and y coordinates
 * @param {Object} posB - Position of object B with x and y coordinates
 * @param {number} size - Size of the collision box (default: 60)
 * @returns {boolean} True if objects are colliding, false otherwise
 */
const detectCollision = (posA, posB, size = 60) => {
  return (
    posA.x < posB.x + size &&
    posA.x + size > posB.x &&
    posA.y < posB.y + size &&
    posA.y + size > posB.y
  );
};


export default detectCollision;
export const isColliding = detectCollision;