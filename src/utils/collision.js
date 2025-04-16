export const isColliding = (pos1, pos2) => {

  const spriteSize = 64; 
  const xDiff = Math.abs(pos1.x - pos2.x);
  const yDiff = Math.abs(pos1.y - pos2.y);
  
  return xDiff < spriteSize && yDiff < spriteSize;
};