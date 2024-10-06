import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateSet(player1Games: number, player2Games: number) {
  if (
    (player1Games === 7 && player2Games === 6) ||
    (player1Games === 6 && player2Games === 7)
  ) {
    return true
  }

  // Check if one player won with at least 6 games and a 2-game lead
  if (player1Games >= 6 && player1Games - player2Games >= 2) {
    return true
  }
  if (player2Games >= 6 && player2Games - player1Games >= 2) {
    return true
  }

  return false
}

export function getWinner(player1Games: number, player2Games: number) {
  if (player1Games > player2Games) {
    return 1
  }
  return 2
}
