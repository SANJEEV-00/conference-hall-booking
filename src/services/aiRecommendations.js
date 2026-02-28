import { BOOKING_STATUS } from '../utils/constants'


export function getAIRecommendations(criteria, halls, bookings = []) {
  const { capacity, date, purpose, attendeeCount } = criteria
  const requestedCapacity = attendeeCount || capacity || 0

  if (requestedCapacity <= 0) {
    return halls.slice(0, 4).map((hall) => ({
      hall,
      reason: `Available: ${hall.name} with capacity for ${hall.capacity} attendees.`,
      matchScore: 0.5,
    }))
  }

  const approved = bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED)
  const bookingsOnDate = date ? approved.filter((b) => b.date === date) : []

  
  const scored = halls.map((hall) => {
    let score = 0
    const reasons = []

   
    if (hall.capacity >= requestedCapacity) {
      const fitRatio = requestedCapacity / hall.capacity
      score += 40 * (1 - Math.abs(1 - fitRatio) * 0.5) 
      if (fitRatio > 0.8 && fitRatio < 1.0) {
        reasons.push('perfect capacity match')
      } else if (fitRatio >= 0.5) {
        reasons.push('good capacity fit')
      }
    } else {
      score += 10 * (hall.capacity / requestedCapacity) 
      reasons.push('slightly below capacity')
    }

    
    if (purpose) {
      const purposeLower = purpose.toLowerCase()  
      const hallNameLower = hall.name.toLowerCase()
      const descriptionLower = (hall.description || '').toLowerCase()
      const amenitiesLower = (hall.amenities || []).join(' ').toLowerCase()

      if (purposeLower.includes('conference') || purposeLower.includes('convention')) {
        if (hallNameLower.includes('grand') || hallNameLower.includes('center') || hallNameLower.includes('hall')) {
          score += 25
          reasons.push('ideal for conferences')
        } else if (hall.capacity >= 100) {
          score += 15
          reasons.push('suitable for conferences')
        }
      } else if (purposeLower.includes('meeting') || purposeLower.includes('discussion')) {
        if (hallNameLower.includes('meeting') || hallNameLower.includes('boardroom')) {
          score += 25
          reasons.push('designed for meetings')
        } else if (hall.capacity <= 50) {
          score += 15
          reasons.push('good for meetings')
        }
      } else if (purposeLower.includes('workshop') || purposeLower.includes('training')) {
        if (hallNameLower.includes('meeting') || descriptionLower.includes('workshop')) {
          score += 20
          reasons.push('perfect for workshops')
        } else if (hall.capacity >= 30 && hall.capacity <= 80) {
          score += 15
          reasons.push('suitable for workshops')
        }
      }

      
      if (purposeLower.includes('video') || purposeLower.includes('remote')) {
        if (amenitiesLower.includes('video')) {
          score += 10
          reasons.push('has video conferencing')
        }
      }
      if (purposeLower.includes('presentation') || purposeLower.includes('present')) {
        if (amenitiesLower.includes('projector') || amenitiesLower.includes('display')) {
          score += 10
          reasons.push('equipped for presentations')
        }
      }
    }

   
    const bookingsForHall = bookingsOnDate.filter((b) => b.hallId === hall.id)
    const busyCount = bookingsForHall.length
    if (busyCount === 0) {
      score += 20
      reasons.push('fully available')
    } else if (busyCount === 1) {
      score += 10
      reasons.push('mostly available')
    } else {
      score += Math.max(0, 20 - busyCount * 5)
      reasons.push('some availability')
    }

    
    const amenityCount = (hall.amenities || []).length
    score += Math.min(15, amenityCount * 3)
    if (amenityCount >= 3) {
      reasons.push('well-equipped')
    }

    return {
      hall,
      score,
      reasons,
    }
  })


  scored.sort((a, b) => b.score - a.score)

 
  return scored.slice(0, 4).map(({ hall, score, reasons }) => {
    const capacityText = hall.capacity >= requestedCapacity
      ? `fits your ${requestedCapacity} attendees`
      : `capacity of ${hall.capacity}`
    const reasonText = reasons.length > 0
      ? `${reasons[0]}, ${capacityText}. ${hall.description || ''}`
      : `Recommended: ${hall.name} with ${capacityText}.`

    return {
      hall,
      reason: reasonText.charAt(0).toUpperCase() + reasonText.slice(1),
      matchScore: Math.min(1, score / 100),
    }
  })
}
