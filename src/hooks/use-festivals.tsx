
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface Festival {
  name: string;
  description: string;
  date: string; // ISO 8601 format for a specific day
  type: 'Religious' | 'Cultural' | 'National Holiday' | 'State Holiday' | 'Seasonal';
  country: string[]; // Countries where it's widely celebrated
  state: string[]; // Indian states where it's significant
}

interface FestivalsContextType {
  festivals: Festival[];
  isLoading: boolean;
}

const FestivalsContext = createContext<FestivalsContextType | undefined>(undefined);

const festivalData: Festival[] = [
    // 2024
    { name: 'Gandhi Jayanti', description: 'Celebrates the birthday of Mahatma Gandhi.', date: '2024-10-02', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Navaratri', description: 'A nine-night festival dedicated to the goddess Durga.', date: '2024-10-03', type: 'Religious', country: ['India'], state: ['Gujarat', 'West Bengal', 'Maharashtra'] },
    { name: 'Durga Puja', description: 'A major Hindu festival celebrating the goddess Durga.', date: '2024-10-09', type: 'Religious', country: ['India'], state: ['West Bengal', 'Tripura', 'Assam'] },
    { name: 'Diwali', description: 'The festival of lights, symbolizing the victory of light over darkness.', date: '2024-11-01', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Karnataka Rajyotsava', description: 'Celebrates the formation of the state of Karnataka.', date: '2024-11-01', type: 'State Holiday', country: ['India'], state: ['Karnataka'] },
    { name: 'Christmas', description: 'An annual festival commemorating the birth of Jesus Christ.', date: '2024-12-25', type: 'Religious', country: ['India', 'Global'], state: ['Goa', 'Kerala', 'Mizoram'] },

    // 2025
    { name: 'Pongal', description: 'A multi-day harvest festival of South India.', date: '2025-01-14', type: 'Cultural', country: ['India'], state: ['Tamil Nadu'] },
    { name: 'Republic Day', description: 'Honors the date on which the Constitution of India came into effect.', date: '2025-01-26', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Holi', description: 'The festival of colors, celebrating the arrival of spring.', date: '2025-03-14', type: 'Cultural', country: ['India', 'Global'], state: ['All'] },
    { name: 'Eid-ul-Fitr', description: 'Marks the end of Ramadan, the Islamic holy month of fasting.', date: '2025-03-30', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Baisakhi', description: 'Marks the Sikh New Year and the spring harvest festival.', date: '2025-04-14', type: 'Cultural', country: ['India', 'Canada', 'UK'], state: ['Punjab'] },
    { name: 'Good Friday', description: 'A Christian holiday commemorating the crucifixion of Jesus.', date: '2025-04-18', type: 'Religious', country: ['India', 'Global'], state: ['Kerala', 'Goa', 'Nagaland'] },
    { name: 'Maharashtra Day', description: 'Celebrates the formation of the state of Maharashtra.', date: '2025-05-01', type: 'State Holiday', country: ['India'], state: ['Maharashtra'] },
    { name: 'Buddha Purnima', description: 'Commemorates the birth of Gautama Buddha.', date: '2025-05-12', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Independence Day', description: 'Commemorates the independence of India from the United Kingdom.', date: '2025-08-15', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Onam', description: 'A major annual harvest festival celebrated in Kerala.', date: '2025-09-05', type: 'Cultural', country: ['India'], state: ['Kerala'] },
    { name: 'Ganesh Chaturthi', description: 'A ten-day festival celebrating the birth of Lord Ganesha.', date: '2025-08-27', type: 'Religious', country: ['India'], state: ['Maharashtra', 'Goa', 'Telangana'] },
    { name: 'Gandhi Jayanti', description: 'Celebrates the birthday of Mahatma Gandhi.', date: '2025-10-02', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Diwali', description: 'The festival of lights, symbolizing the victory of light over darkness.', date: '2025-10-21', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Karnataka Rajyotsava', description: 'Celebrates the formation of the state of Karnataka.', date: '2025-11-01', type: 'State Holiday', country: ['India'], state: ['Karnataka'] },
    { name: 'Christmas', description: 'An annual festival commemorating the birth of Jesus Christ.', date: '2025-12-25', type: 'Religious', country: ['India', 'Global'], state: ['Goa', 'Kerala', 'Mizoram'] },

    // 2026
    { name: 'Pongal', description: 'A multi-day harvest festival of South India.', date: '2026-01-14', type: 'Cultural', country: ['India'], state: ['Tamil Nadu'] },
    { name: 'Republic Day', description: 'Honors the date on which the Constitution of India came into effect.', date: '2026-01-26', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Holi', description: 'The festival of colors, celebrating the arrival of spring.', date: '2026-03-04', type: 'Cultural', country: ['India', 'Global'], state: ['All'] },
    { name: 'Eid-ul-Fitr', description: 'Marks the end of Ramadan, the Islamic holy month of fasting.', date: '2026-03-20', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Good Friday', description: 'A Christian holiday commemorating the crucifixion of Jesus.', date: '2026-04-03', type: 'Religious', country: ['India', 'Global'], state: ['Kerala', 'Goa', 'Nagaland'] },
    { name: 'Baisakhi', description: 'Marks the Sikh New Year and the spring harvest festival.', date: '2026-04-14', type: 'Cultural', country: ['India', 'Canada', 'UK'], state: ['Punjab'] },
    { name: 'Maharashtra Day', description: 'Celebrates the formation of the state of Maharashtra.', date: '2026-05-01', type: 'State Holiday', country: ['India'], state: ['Maharashtra'] },
    { name: 'Buddha Purnima', description: 'Commemorates the birth of Gautama Buddha.', date: '2026-05-31', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Independence Day', description: 'Commemorates the independence of India from the United Kingdom.', date: '2026-08-15', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Ganesh Chaturthi', description: 'A ten-day festival celebrating the birth of Lord Ganesha.', date: '2026-09-16', type: 'Religious', country: ['India'], state: ['Maharashtra', 'Goa', 'Telangana'] },
    { name: 'Onam', description: 'A major annual harvest festival celebrated in Kerala.', date: '2026-08-26', type: 'Cultural', country: ['India'], state: ['Kerala'] },
    { name: 'Gandhi Jayanti', description: 'Celebrates the birthday of Mahatma Gandhi.', date: '2026-10-02', type: 'National Holiday', country: ['India'], state: ['All'] },
    { name: 'Diwali', description: 'The festival of lights, symbolizing the victory of light over darkness.', date: '2026-11-08', type: 'Religious', country: ['India', 'Global'], state: ['All'] },
    { name: 'Karnataka Rajyotsava', description: 'Celebrates the formation of the state of Karnataka.', date: '2026-11-01', type: 'State Holiday', country: ['India'], state: ['Karnataka'] },
    { name: 'Christmas', description: 'An annual festival commemorating the birth of Jesus Christ.', date: '2026-12-25', type: 'Religious', country: ['India', 'Global'], state: ['Goa', 'Kerala', 'Mizoram'] },
];

export function FestivalsProvider({ children }: { children: ReactNode }) {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFestivals = useCallback(() => {
    setIsLoading(true);
    // In a real app, this could fetch from a DB. For now, we use static data.
    try {
        const sortedData = [...festivalData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFestivals(sortedData);
    } catch (error) {
        console.error("Error processing festival data:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);
  
  const value = { festivals, isLoading };

  return (
    <FestivalsContext.Provider value={value}>
      {children}
    </FestivalsContext.Provider>
  );
}

export function useFestivals() {
  const context = useContext(FestivalsContext);
  if (context === undefined) {
    throw new Error('useFestivals must be used within a FestivalsProvider');
  }
  return context;
}
