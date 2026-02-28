import { getAIRecommendations } from '../services/aiRecommendations'


export function getAIRecommendedHalls(criteria, halls, bookings = []) {
  return getAIRecommendations(criteria, halls, bookings)
}
