
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
        title: 'Mahi Ve',
        genre: 'Romantic Comedy',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.5,
        postedAt: '2024-07-29T08:00:00Z',
        details: {
            synopsis: 'Two star-crossed lovers from different backgrounds navigate family expectations and cultural differences in this heartwarming romantic comedy set in London and Punjab.',
            duration: '2h 30m',
            releaseDate: '2024-08-15',
            distributor: 'Bollywood Films USA',
            distributorId: 'bollywood-films-usa',
            cast: ['Rohan Kapoor', 'Aisha Patel', 'Anupam Kher'],
            director: 'Priya Rao',
            backdropUrl: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGJhY2tkcm9wfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
            trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            theaters: [
                {
                    name: 'AMC Mercado 20',
                    location: 'Santa Clara, CA',
                    showtimes: ['1:00 PM', '4:15 PM', '7:30 PM']
                },
                {
                    name: 'Cinemark Century 16',
                    location: 'Fremont, CA',
                    showtimes: ['2:30 PM', '5:45 PM', '9:00 PM']
                }
            ]
        }
    },
    {
        id: 'movie-2',
        title: 'Dharma',
        genre: 'Action Thriller',
        imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        postedAt: '2024-07-25T12:00:00Z',
        details: {
            synopsis: 'An undercover cop must infiltrate a powerful crime syndicate to avenge his family. A high-octane thriller with breathtaking action sequences.',
            duration: '2h 45m',
            releaseDate: '2024-08-01',
            distributor: 'Action Studios',
            distributorId: 'action-studios',
            cast: ['Vikram Singh', 'Prakash Raj', 'Radhika Apte'],
            director: 'Arjun Reddy',
            backdropUrl: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMGJhY2tkcm9wfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
            trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            theaters: [
                {
                    name: 'Regal Cinemas',
                    location: 'New York, NY',
                    showtimes: ['12:00 PM', '3:30 PM', '7:00 PM', '10:15 PM']
                },
            ]
        }
    }
];
