
import type { Movie } from "@/hooks/use-movies";

export const initialMoviesData: Omit<Movie, 'id'>[] = [
    {
      title: "Kalki 2898 AD",
      genre: "Sci-Fi/Action",
      imageUrl: "https://placehold.co/400x600/FF9933/FFFFFF.png",
      rating: 4.5,
      postedAt: "2024-07-29T12:00:00Z",
      details: {
        synopsis: "In a dystopian future, a new force rises to protect the oppressed. A modern-day avatar of the Hindu god Vishnu, is believed to have descended to Earth to protect the world from evil forces.",
        duration: "3h 1m",
        releaseDate: "2024-06-27",
        distributor: "Vyjayanthi Movies",
        distributorId: "vyjayanthi-movies",
        director: "Nag Ashwin",
        cast: ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone", "Disha Patani"],
        trailerUrl: "https://www.youtube.com/embed/kQDd1FFfvX8",
        backdropUrl: "https://images.unsplash.com/photo-1574281392693-8b292a4a7538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzY2klMjBmaSUyMGNpdHlzY2FwZXxlbnwwfHx8fDE3NTQxOTc0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        theaters: [
          { name: "AMC Mercado 20", location: "Santa Clara, CA", showtimes: ["1:00 PM", "4:30 PM", "8:00 PM"] },
          { name: "Cinemark Century 20", location: "Daly City, CA", showtimes: ["2:15 PM", "5:45 PM", "9:15 PM"] },
        ]
      }
    },
    {
      title: "Jatt & Juliet 3",
      genre: "Romantic Comedy",
      imageUrl: "https://placehold.co/400x600/D46A00/FFFFFF.png",
      rating: 4.2,
       postedAt: "2024-07-28T12:00:00Z",
      details: {
        synopsis: "The third installment of the beloved romantic comedy series, where fate brings the two lovers together again in a whirlwind of laughter and romance.",
        duration: "2h 10m",
        releaseDate: "2024-06-27",
        distributor: "White Hill Studios",
         distributorId: "white-hill-studios",
        director: "Jagdeep Sidhu",
        cast: ["Diljit Dosanjh", "Neeru Bajwa", "Jasmin Bhasin"],
        trailerUrl: "https://www.youtube.com/embed/kQDd1FFfvX8",
        backdropUrl: "https://images.unsplash.com/photo-1505664194779-8beace729124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvbWVkeSUyMHN0YWdlfGVufDB8fHx8MTc1NDE5NzQzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        theaters: [
          { name: "Regal Edwards", location: "Fresno, CA", showtimes: ["12:30 PM", "3:30 PM", "6:30 PM"] },
        ]
      }
    }
];
