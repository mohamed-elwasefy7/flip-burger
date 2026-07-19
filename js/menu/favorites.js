/**
 * Local favorites — product ids in localStorage. No accounts, no backend.
 */

const KEY = 'flip-favs';

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — favorites just won't persist */
  }
}

export function isFavorite(id) {
  return read().includes(id);
}

export function toggleFavorite(id) {
  const list = read();
  const idx = list.indexOf(id);
  if (idx === -1) list.push(id);
  else list.splice(idx, 1);
  write(list);
  return idx === -1; // now favorited?
}
