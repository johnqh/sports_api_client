/**
 * @module handball/types/handball-odds
 * @description Odds types for API-Handball
 */

/**
 * Bookmaker bet value
 */
export interface HandballBetValue {
  value: string;
  odd: string;
}

/**
 * Bet type
 */
export interface HandballBet {
  id: number;
  name: string;
  values: HandballBetValue[];
}

/**
 * Bookmaker with bets
 */
export interface HandballBookmaker {
  id: number;
  name: string;
  bets: HandballBet[];
}

/**
 * Odds response
 */
export interface HandballOdds {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
  };
  game: {
    id: number;
  };
  update: string;
  bookmakers: HandballBookmaker[];
}

/**
 * Parameters for odds endpoint
 */
export interface HandballOddsParams {
  game: number;
  bookmaker?: number;
  bet?: number;
}
