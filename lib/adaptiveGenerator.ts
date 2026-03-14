/**
 * Generates a practice string focusing on weak keys and transitions.
 * @param weakKeys Array of keys the user struggles with.
 * @param weakTransitions Array of transitions (bigrams) the user struggles with (e.g., "a->s").
 * @param length Approximate length of the generated string.
 * @returns A string designed for practice.
 */
export function generateAdaptiveLesson(weakKeys: string[], weakTransitions: string[] = [], length: number = 100): string {
  if (weakKeys.length === 0 && weakTransitions.length === 0) {
    return "The quick brown fox jumps over the lazy dog. Practice makes perfect in the world of typing.";
  }

  let lesson = "";
  const transitions = weakTransitions.map(t => t.split("->"));

  while (lesson.length < length) {
    const r = Math.random();
    
    if (r < 0.4 && transitions.length > 0) {
      // 40% chance to pick a weak transition
      const [k1, k2] = transitions[Math.floor(Math.random() * transitions.length)];
      lesson += (k1 === "Space" ? " " : k1) + (k2 === "Space" ? " " : k2);
    } else if (r < 0.8 && weakKeys.length > 0) {
      // 40% chance to pick a weak key
      const k = weakKeys[Math.floor(Math.random() * weakKeys.length)];
      lesson += k === "Space" ? " " : k;
    } else {
      // 20% chance for a space or random filler
      lesson += " ";
    }
  }

  // Clean up extra spaces and return
  return lesson.replace(/\s+/g, ' ').trim();
}
