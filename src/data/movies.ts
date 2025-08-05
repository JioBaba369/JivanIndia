
export interface Movie {
    id: string;
    title: string;
    genre: string;
    imageUrl: string;
    rating: number;
    postedAt: string; // ISO date string
    details: {
        synopsis: string;
        duration: string;
        releaseDate: string;
        distributor: string;
        distributorId: string;
        cast: string[];
        director: string;
        backdropUrl: string;
        trailerUrl: string;
        theaters: Array<{
            name: string;
            location: string;
            showtimes: string[];
        }>
    }
}

export const movies: Movie[] = [
    {
        id: 'movie-1',
        title: 'Monsoon Wedding 2: The Reunion',
        genre: 'Drama/Romance',
        imageUrl: 'https://images.unsplash.com/photo-1627843563095-f6e94676cfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.5,
        postedAt: '2024-07-20T12:00:00Z',
        details: {
            synopsis: 'Years after the original whirlwind romance, the Verma family gathers again for a new celebration, unearthing old secrets and forging new bonds in this heartfelt sequel to the beloved classic.',
            duration: '2h 15min',
            releaseDate: '2024-08-15',
            distributor: 'Mirabai Films',
            distributorId: 'mirabai-films',
            cast: ['Naseeruddin Shah', 'Lillete Dubey', 'Vasundhara Das', 'Vijay Raaz'],
            director: 'Mira Nair',
            backdropUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fHwxNzU0NDE3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder trailer
            theaters: [
                { name: 'AMC Metreon 16', location: 'San Francisco, CA', showtimes: ['1:00 PM', '4:15 PM', '7:30 PM'] },
                { name: 'Regal Edwards Long Beach', location: 'Long Beach, CA', showtimes: ['2:30 PM', '5:45 PM', '9:00 PM'] },
            ]
        }
    },
    {
        id: 'movie-2',
        title: 'Cyber Delhi',
        genre: 'Sci-Fi/Action',
        imageUrl: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        postedAt: '2024-07-25T10:00:00Z',
        details: {
            synopsis: 'In a futuristic Delhi, a rogue detective uncovers a corporate conspiracy that threatens to destabilize the entire subcontinent. Packed with stunning visuals and high-octane action.',
            duration: '2h 30min',
            releaseDate: '2024-09-01',
            distributor: 'Eros International',
            distributorId: 'eros-international',
            cast: ['Hrithik Roshan', 'Priyanka Chopra', 'Anil Kapoor'],
            director: 'Rakesh Roshan',
            backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBzY3JlZW58ZW58MHx8fHwxNzU0NDE3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            theaters: [
                { name: 'Cinemark Century City 15', location: 'Los Angeles, CA', showtimes: ['12:00 PM', '3:30 PM', '7:00 PM', '10:15 PM'] },
                { name: 'AMC Empire 25', location: 'New York, NY', showtimes: ['1:30 PM', '4:45 PM', '8:00 PM'] },
            ]
        }
    },
    {
        id: 'movie-3',
        title: 'Gully Cricket',
        genre: 'Sports/Comedy',
        imageUrl: 'https://images.unsplash.com/photo-1595359424214-3545c6356449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjcmlja2V0fGVufDB8fHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.2,
        postedAt: '2024-07-28T14:00:00Z',
        details: {
            synopsis: 'A group of friends from a Mumbai neighborhood form a cricket team to save their local playground from developers. A hilarious and heartwarming story about community and passion.',
            duration: '2h 05min',
            releaseDate: '2024-08-20',
            distributor: 'Yash Raj Films',
            distributorId: 'yash-raj-films',
            cast: ['Ranveer Singh', 'Alia Bhatt', 'Paresh Rawal'],
            director: 'Zoya Akhtar',
            backdropUrl: 'https://images.unsplash.com/photo-1593341646647-75b341c3c5a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBjcmlja2V0fGVufDB8fHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            theaters: [
                { name: 'Naz 8 Cinemas', location: 'Artesia, CA', showtimes: ['1:15 PM', '4:00 PM', '6:45 PM', '9:30 PM'] },
            ]
        }
    }
];

    