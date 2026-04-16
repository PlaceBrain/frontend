const AVATAR_COLOR_COUNT = 8;

export function avatarColorIndex(placeId: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < placeId.length; i++) {
    hash ^= placeId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash) % AVATAR_COLOR_COUNT;
}

export function avatarColorSlot(placeId: string): number {
  return avatarColorIndex(placeId) + 1;
}
