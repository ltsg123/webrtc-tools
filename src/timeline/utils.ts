/**
 * Alias for document.getElementById. Found elements must be HTMLElements.
 * @param {string} id The ID of the element to find.
 * @return {HTMLElement} The found element or null if not found.
 */
export function $(id: string) {
  var el = document.getElementById(id);
  return el;
}
