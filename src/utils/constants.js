

import grandhallimg from '../assets/2e3ab4226e400387e5aa8323a63f597c.jpg'
import hall1 from '../assets/3f7114610bdefda4246c6fe7181e753a.jpg'
import hall2 from '../assets/477a0732e1567a1a8110cb1d9c1b1e73.jpg'
import hall3 from '../assets/644676655f67a575ec80f7746b89066c.jpg'
import hall4 from '../assets/ea9792ebf1593dc1e3d91f5d54398361.jpg'




export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const DEFAULT_HALLS = [
  {
    id: '1',
    name: 'Grand Hall',
    capacity: 200,
    image: grandhallimg,
    description: 'Spacious auditorium for large conferences and events.',
    
  },
  {
    id: '2',
    name: 'Meeting Room A',
    capacity: 50,
    image: hall1,
    description: 'Ideal for team meetings and workshops.',
   
  },
  {
    id: '3',
    name: 'Meeting Room B',
    capacity: 30,
    image: hall2,
    description: 'Compact space for focused discussions.',
   
  },
  {
    id: '4',
    name: 'Boardroom',
    capacity: 20,
    image: hall3,
    description: 'Executive boardroom for high-level meetings.',
    
  },
  {
    id: '5',
    name: 'Conference Center',
    capacity: 100,
    image: hall4,
    description: 'Versatile venue for mid-size conferences and seminars.',
    
  },
]

// local store panna key name
export const STORAGE_KEYS = {
  AUTH: 'conf_hall_auth',
  HALLS: 'conf_hall_halls',
  BOOKINGS: 'conf_hall_bookings',
}
