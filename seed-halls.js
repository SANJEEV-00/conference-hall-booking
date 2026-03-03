import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

if (!globalThis.fetch) {
    globalThis.fetch = fetch
}

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const DEFAULT_HALLS = [
    {
        name: 'Grand Hall',
        capacity: 200,
        description: 'Spacious auditorium for large conferences and events.',
    },
    {
        name: 'Meeting Room A',
        capacity: 50,
        description: 'Ideal for team meetings and workshops.',
    },
    {
        name: 'Meeting Room B',
        capacity: 30,
        description: 'Compact space for focused discussions.',
    },
    {
        name: 'Boardroom',
        capacity: 20,
        description: 'Executive boardroom for high-level meetings.',
    },
    {
        name: 'Conference Center',
        capacity: 100,
        description: 'Versatile venue for mid-size conferences and seminars.',
    },
]

async function seed() {
    console.log('Seeding halls...')
    const { data, error } = await supabase.from('halls').insert(DEFAULT_HALLS)
    if (error) {
        console.error('Error seeding halls:', error)
    } else {
        console.log('Successfully seeded halls!')
    }
}

seed()
