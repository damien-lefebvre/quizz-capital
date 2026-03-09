/**
 * Système de combo avec tirage pondéré par difficulté
 *
 * Chaque ligne représente un niveau de combo (index 0 = combo 1)
 * Chaque colonne représente une difficulté (index 0 = difficulté 1, jusqu'à 14 = difficulté 15)
 * Les valeurs sont des poids (pas nécessairement des pourcentages)
 */

// Répartition sur 50 niveaux de combo (15 niveaux de difficulté)
// prettier-ignore
export const COMBO_WEIGHTS_50: number[][] = [
  //                                        D1   D2   D3   D4   D5   D6   D7   D8   D9  D10  D11  D12  D13  D14  D15
  // Combo 1-5 : Très facile, difficultés 1-2
  /* Combo  1 */                          [100,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  2 */                          [ 70,  30,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  3 */                          [ 50,  40,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  4 */                          [ 30,  45,  20,   5,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  5 */                          [ 15,  40,  30,  15,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],

  // Combo 6-10 : Transition vers difficulté 3-5
  /* Combo  6 */                          [ 10,  30,  35,  20,   5,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  7 */                          [  5,  20,  35,  30,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  8 */                          [  0,  15,  30,  35,  15,   5,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  9 */                          [  0,  10,  25,  35,  20,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 10 */                          [  0,   5,  20,  30,  30,  15,   0,   0,   0,   0,   0,   0,   0,   0,   0],

  // Combo 11-15 : Difficulté 4-7
  /* Combo 11 */                          [  0,   0,  15,  25,  35,  20,   5,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 12 */                          [  0,   0,  10,  20,  35,  25,  10,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 13 */                          [  0,   0,   5,  15,  30,  30,  15,   5,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 14 */                          [  0,   0,   0,  10,  25,  35,  20,  10,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 15 */                          [  0,   0,   0,   5,  20,  35,  25,  15,   0,   0,   0,   0,   0,   0,   0],

  // Combo 16-20 : Difficulté 5-9
  /* Combo 16 */                          [  0,   0,   0,   0,  15,  30,  30,  20,   5,   0,   0,   0,   0,   0,   0],
  /* Combo 17 */                          [  0,   0,   0,   0,  10,  25,  30,  25,  10,   0,   0,   0,   0,   0,   0],
  /* Combo 18 */                          [  0,   0,   0,   0,   5,  20,  30,  30,  15,   0,   0,   0,   0,   0,   0],
  /* Combo 19 */                          [  0,   0,   0,   0,   0,  15,  25,  35,  20,   5,   0,   0,   0,   0,   0],
  /* Combo 20 */                          [  0,   0,   0,   0,   0,  10,  20,  35,  25,  10,   0,   0,   0,   0,   0],

  // Combo 21-25 : Difficulté 7-11
  /* Combo 21 */                          [  0,   0,   0,   0,   0,   5,  15,  30,  30,  15,   5,   0,   0,   0,   0],
  /* Combo 22 */                          [  0,   0,   0,   0,   0,   0,  10,  25,  35,  20,  10,   0,   0,   0,   0],
  /* Combo 23 */                          [  0,   0,   0,   0,   0,   0,   5,  20,  35,  25,  15,   0,   0,   0,   0],
  /* Combo 24 */                          [  0,   0,   0,   0,   0,   0,   0,  15,  30,  30,  20,   5,   0,   0,   0],
  /* Combo 25 */                          [  0,   0,   0,   0,   0,   0,   0,  10,  25,  35,  20,  10,   0,   0,   0],

  // Combo 26-30 : Difficulté 8-12
  /* Combo 26 */                          [  0,   0,   0,   0,   0,   0,   0,   5,  20,  35,  25,  15,   0,   0,   0],
  /* Combo 27 */                          [  0,   0,   0,   0,   0,   0,   0,   0,  15,  30,  30,  20,   5,   0,   0],
  /* Combo 28 */                          [  0,   0,   0,   0,   0,   0,   0,   0,  10,  25,  35,  20,  10,   0,   0],
  /* Combo 29 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   5,  20,  35,  25,  15,   0,   0],
  /* Combo 30 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  30,  30,  20,   5,   0],

  // Combo 31-35 : Difficulté 10-14
  /* Combo 31 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  25,  35,  20,  10,   0],
  /* Combo 32 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  20,  35,  25,  15,   0],
  /* Combo 33 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  35,  30,  20,   0],
  /* Combo 34 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  30,  35,  25,   0],
  /* Combo 35 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  25,  35,  30,   5],

  // Combo 36-40 : Difficulté 11-15
  /* Combo 36 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  20,  35,  30,  15],
  /* Combo 37 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  30,  35,  20],
  /* Combo 38 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  25,  35,  30],
  /* Combo 39 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  20,  35,  40],
  /* Combo 40 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  35,  50],

  // Combo 41-45 : Difficulté 13-15
  /* Combo 41 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  30,  60],
  /* Combo 42 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  25,  70],
  /* Combo 43 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  20,  80],
  /* Combo 44 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  85],
  /* Combo 45 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  90],

  // Combo 46-50 : Légende (quasi 100% difficulté max)
  /* Combo 46 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  95],
  /* Combo 47 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  95],
  /* Combo 48 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 100],
  /* Combo 49 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 100],
  /* Combo 50 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 100],
];

// Répartition sur 30 niveaux de combo (15 niveaux de difficulté)
// Progression plus rapide pour atteindre les difficultés maximales
// prettier-ignore
export const COMBO_WEIGHTS_30: number[][] = [
  //                                        D1   D2   D3   D4   D5   D6   D7   D8   D9  D10  D11  D12  D13  D14  D15
  // Combo 1-5 : Échauffement rapide
  /* Combo  1 */                          [100,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  2 */                          [ 50,  40,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  3 */                          [ 20,  40,  30,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  4 */                          [  5,  25,  35,  25,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  5 */                          [  0,  15,  30,  30,  20,   5,   0,   0,   0,   0,   0,   0,   0,   0,   0],

  // Combo 6-10 : Montée rapide vers difficulté 5-8
  /* Combo  6 */                          [  0,   5,  20,  30,  30,  15,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  7 */                          [  0,   0,  10,  25,  30,  25,  10,   0,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  8 */                          [  0,   0,   5,  15,  25,  30,  20,   5,   0,   0,   0,   0,   0,   0,   0],
  /* Combo  9 */                          [  0,   0,   0,  10,  20,  30,  25,  15,   0,   0,   0,   0,   0,   0,   0],
  /* Combo 10 */                          [  0,   0,   0,   5,  15,  25,  30,  20,   5,   0,   0,   0,   0,   0,   0],

  // Combo 11-15 : Zone intermédiaire 6-10
  /* Combo 11 */                          [  0,   0,   0,   0,  10,  20,  30,  25,  15,   0,   0,   0,   0,   0,   0],
  /* Combo 12 */                          [  0,   0,   0,   0,   5,  15,  25,  30,  20,   5,   0,   0,   0,   0,   0],
  /* Combo 13 */                          [  0,   0,   0,   0,   0,  10,  20,  30,  25,  15,   0,   0,   0,   0,   0],
  /* Combo 14 */                          [  0,   0,   0,   0,   0,   5,  15,  25,  30,  20,   5,   0,   0,   0,   0],
  /* Combo 15 */                          [  0,   0,   0,   0,   0,   0,  10,  20,  30,  25,  15,   0,   0,   0,   0],

  // Combo 16-20 : Zone difficile 9-13
  /* Combo 16 */                          [  0,   0,   0,   0,   0,   0,   5,  15,  25,  30,  20,   5,   0,   0,   0],
  /* Combo 17 */                          [  0,   0,   0,   0,   0,   0,   0,  10,  20,  30,  25,  15,   0,   0,   0],
  /* Combo 18 */                          [  0,   0,   0,   0,   0,   0,   0,   5,  15,  25,  30,  20,   5,   0,   0],
  /* Combo 19 */                          [  0,   0,   0,   0,   0,   0,   0,   0,  10,  20,  30,  25,  15,   0,   0],
  /* Combo 20 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   5,  15,  25,  30,  20,   5,   0],

  // Combo 21-25 : Expert 11-15
  /* Combo 21 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  20,  30,  25,  15,   0],
  /* Combo 22 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  15,  25,  30,  20,   5],
  /* Combo 23 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  20,  30,  25,  15],
  /* Combo 24 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  15,  25,  30,  25],
  /* Combo 25 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  20,  35,  35],

  // Combo 26-30 : Légende 13-15
  /* Combo 26 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  15,  30,  50],
  /* Combo 27 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  25,  65],
  /* Combo 28 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,  15,  80],
  /* Combo 29 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  10,  90],
  /* Combo 30 */                          [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 100],
];

/**
 * Tire au hasard une difficulté basée sur les poids du niveau de combo actuel
 * @param combo - Le niveau de combo actuel (1-indexed)
 * @param weights - Le tableau de poids à utiliser (COMBO_WEIGHTS_30 ou COMBO_WEIGHTS_50)
 * @returns La difficulté tirée (1-indexed, donc 1 à 15)
 */
export function getRandomDifficulty(
  combo: number,
  weights: number[][] = COMBO_WEIGHTS_30,
): number {
  // Clamp le combo entre 1 et la taille max du tableau
  const clampedCombo = Math.max(1, Math.min(combo, weights.length));

  // Récupère les poids pour ce niveau de combo (0-indexed dans le tableau)
  const currentWeights = weights[clampedCombo - 1];

  // Calcule la somme totale des poids
  const totalWeight = currentWeights.reduce((sum, w) => sum + w, 0);

  // Tire un nombre aléatoire entre 0 et la somme totale
  const random = Math.random() * totalWeight;

  // Parcourt les poids en les cumulant
  let cumulative = 0;
  for (let i = 0; i < currentWeights.length; i++) {
    cumulative += currentWeights[i];
    if (random < cumulative) {
      // Retourne la difficulté (1-indexed)
      return i + 1;
    }
  }

  // Fallback (ne devrait jamais arriver si les poids sont corrects)
  return currentWeights.length;
}

/**
 * Filtre un pool de capitales par difficulté et en tire une au hasard
 * @param pool - Le pool de capitales disponibles (avec leur difficulté)
 * @param difficulty - La difficulté souhaitée
 * @returns Une capitale au hasard de cette difficulté, ou null si aucune n'est disponible
 */
export function pickCapitalByDifficulty<T extends { difficulty: number }>(
  pool: T[],
  difficulty: number,
): T | null {
  // Filtre les capitales de la difficulté demandée
  const filtered = pool.filter((c) => c.difficulty === difficulty);

  if (filtered.length === 0) {
    return null;
  }

  // Tire une capitale au hasard parmi les filtrées
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Tire une capitale au hasard en utilisant le système de combo
 * Si aucune capitale n'est disponible pour la difficulté tirée,
 * on monte en difficulté jusqu'à en trouver une.
 * Si on est au max (15), alors seulement on redescend.
 * @param pool - Le pool de capitales disponibles
 * @param combo - Le niveau de combo actuel
 * @param weights - Le tableau de poids à utiliser
 * @returns Une capitale au hasard, ou null si le pool est vide
 */
export function pickRandomCapital<T extends { difficulty: number }>(
  pool: T[],
  combo: number,
  weights: number[][] = COMBO_WEIGHTS_30,
): T | null {
  if (pool.length === 0) {
    return null;
  }

  const MAX_DIFFICULTY = 15;

  // Tire une difficulté basée sur le combo
  const targetDifficulty = getRandomDifficulty(combo, weights);

  console.log(`Combo: ${combo}, Difficulté cible: ${targetDifficulty}`);

  // Essaie de trouver une capitale à cette difficulté
  let capital = pickCapitalByDifficulty(pool, targetDifficulty);

  // Si pas de capitale à cette difficulté, cherche d'abord vers le haut
  if (!capital) {
    // Monte en difficulté jusqu'au max
    for (let diff = targetDifficulty + 1; diff <= MAX_DIFFICULTY; diff++) {
      capital = pickCapitalByDifficulty(pool, diff);
      if (capital) break;
    }

    // Si toujours rien, redescend en difficulté
    if (!capital) {
      for (let diff = targetDifficulty - 1; diff >= 1; diff--) {
        capital = pickCapitalByDifficulty(pool, diff);
        if (capital) break;
      }
    }
  }

  return capital;
}

/**
 * Calcule les points gagnés en fonction du combo et de la difficulté
 * @param combo - Le niveau de combo actuel
 * @param difficulty - La difficulté de la question
 * @returns Le nombre de points gagnés
 */
export function calculatePoints(combo: number, difficulty: number): number {
  // Points de base selon la difficulté (10 à 80 points)
  const basePoints = difficulty * 10;

  // Multiplicateur de combo (1.0 à 2.5x pour combo 1 à 50+)
  const comboMultiplier = 1 + Math.min(combo - 1, 50) * 0.03;

  return Math.round(basePoints * comboMultiplier);
}
