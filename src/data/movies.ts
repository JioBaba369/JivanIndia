
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

export const movies: Movie[] = [];
