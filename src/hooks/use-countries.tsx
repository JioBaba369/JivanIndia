
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// List Of Countries With States And Other Useful Information, Updated On 08/09/2025 17:57:45
const countriesData = [
  {
    "name": "Andorra",
    "countryCode": "AD",
    "countryCodeAlpha3": "AND",
    "phone": "376",
    "currency": "EUR",
    "flag": "https://www.geonames.org/flags/x/ad.gif",
    "symbol": "\u20AC",
    "stateProvinces": [
      { "name": "Sant Juli\u00E0 de Loria" },
      { "name": "Ordino" },
      { "name": "La Massana" },
      { "name": "Encamp" },
      { "name": "Canillo" },
      { "name": "Andorra la Vella" },
      { "name": "Escaldes-Engordany" }
    ]
  },
  {
    "name": "United Arab Emirates",
    "countryCode": "AE",
    "countryCodeAlpha3": "ARE",
    "phone": "971",
    "currency": "AED",
    "flag": "https://www.geonames.org/flags/x/ae.gif",
    "symbol": "DH",
    "stateProvinces": [
      { "name": "Umm al Qaywayn" },
      { "name": "Ra\u02BCs al Khaymah" },
      { "name": "Dubai" },
      { "name": "Sharjah" },
      { "name": "Fujairah" },
      { "name": "Ajman" },
      { "name": "Abu Dhabi" }
    ]
  },
  {
    "name": "Afghanistan",
    "countryCode": "AF",
    "countryCodeAlpha3": "AFG",
    "phone": "93",
    "currency": "AFN",
    "flag": "https://www.geonames.org/flags/x/af.gif",
    "symbol": "\u060B",
    "stateProvinces": [
      { "name": "Zabul" },
      { "name": "Maidan Wardak Province" },
      { "name": "Takhar" },
      { "name": "Sar-e Pol Province" },
      { "name": "Samangan" },
      { "name": "Parwan" },
      { "name": "Paktika" },
      { "name": "Paktia" },
      { "name": "Oruzgan" },
      { "name": "Nimroz" },
      { "name": "Nangarhar" },
      { "name": "Logar" },
      { "name": "Laghman" },
      { "name": "Kunduz" },
      { "name": "Kunar" },
      { "name": "Kapisa" },
      { "name": "Kandahar" },
      { "name": "Kabul" },
      { "name": "Jowzjan" },
      { "name": "Herat" },
      { "name": "Helmand" },
      { "name": "Ghowr" },
      { "name": "Ghazni" },
      { "name": "Faryab" },
      { "name": "Farah" },
      { "name": "Bamyan" },
      { "name": "Balkh" },
      { "name": "Baghlan" },
      { "name": "Badghis" },
      { "name": "Badakhshan" },
      { "name": "Khowst" },
      { "name": "Nuristan" },
      { "name": "Daykundi" },
      { "name": "Panjshir" }
    ]
  },
  {
    "name": "Antigua and Barbuda",
    "countryCode": "AG",
    "countryCodeAlpha3": "ATG",
    "phone": "\u002B1-268",
    "currency": "XCD",
    "flag": "https://www.geonames.org/flags/x/ag.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Saint Philip Parish" },
      { "name": "Saint Peter Parish" },
      { "name": "Saint Paul Parish" },
      { "name": "Saint Mary Parish" },
      { "name": "Saint John Parish" },
      { "name": "Saint George Parish" },
      { "name": "Redonda" },
      { "name": "Barbuda" }
    ]
  },
  {
    "name": "Anguilla",
    "countryCode": "AI",
    "countryCodeAlpha3": "AIA",
    "phone": "\u002B1-264",
    "currency": "XCD",
    "flag": "https://www.geonames.org/flags/x/ai.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Blowing Point" },
      { "name": "Sandy Ground" },
      { "name": "Sandy Hill" },
      { "name": "The Valley" },
      { "name": "East End" },
      { "name": "North Hill" },
      { "name": "West End" },
      { "name": "South Hill" },
      { "name": "The Quarter" },
      { "name": "North Side" },
      { "name": "Island Harbour" },
      { "name": "George Hill" },
      { "name": "Stoney Ground" },
      { "name": "The Farrington" }
    ]
  },
  {
    "name": "Albania",
    "countryCode": "AL",
    "countryCodeAlpha3": "ALB",
    "phone": "355",
    "currency": "ALL",
    "flag": "https://www.geonames.org/flags/x/al.gif",
    "symbol": "",
    "stateProvinces": [
      { "name": "Berat County" },
      { "name": "Dib\u00EBr County" },
      { "name": "Elbasan County" },
      { "name": "Gjirokast\u00EBr County" },
      { "name": "Kor\u00E7\u00EB County" },
      { "name": "Kuk\u00EBs County" },
      { "name": "Durr\u00EBs County" },
      { "name": "Fier County" },
      { "name": "Lezh\u00EB County" },
      { "name": "Shkod\u00EBr County" },
      { "name": "Tirana" },
      { "name": "Vlor\u00EB County" }
    ]
  },
  {
    "name": "Armenia",
    "countryCode": "AM",
    "countryCodeAlpha3": "ARM",
    "phone": "374",
    "currency": "AMD",
    "flag": "https://www.geonames.org/flags/x/am.gif",
    "symbol": "\u058F",
    "stateProvinces": [
      { "name": "Ararat" },
      { "name": "Syunik" },
      { "name": "Vayots Dzor" },
      { "name": "Yerevan" },
      { "name": "Aragatsotn" },
      { "name": "Armavir" },
      { "name": "Gegharkunik" },
      { "name": "Kotayk" },
      { "name": "Lori" },
      { "name": "Shirak" },
      { "name": "Tavush" }
    ]
  },
  {
    "name": "Angola",
    "countryCode": "AO",
    "countryCodeAlpha3": "AGO",
    "phone": "244",
    "currency": "AOA",
    "flag": "https://www.geonames.org/flags/x/ao.gif",
    "symbol": "Kz",
    "stateProvinces": [
      { "name": "Lunda Sul" },
      { "name": "Luanda Norte" },
      { "name": "Moxico" },
      { "name": "Cuando Cobango" },
      { "name": "Zaire" },
      { "name": "U\u00EDge" },
      { "name": "Malanje" },
      { "name": "Luanda" },
      { "name": "Cuanza Norte" },
      { "name": "Cabinda" },
      { "name": "Bengo" },
      { "name": "Namibe" },
      { "name": "Hu\u00EDla" },
      { "name": "Huambo" },
      { "name": "Cunene" },
      { "name": "Kwanza Sul" },
      { "name": "B\u00EDe" },
      { "name": "Benguela" }
    ]
  },
  {
    "name": "Antarctica",
    "countryCode": "AQ",
    "countryCodeAlpha3": "ATA",
    "phone": "",
    "currency": "",
    "flag": "https://www.geonames.org/flags/x/aq.gif",
    "symbol": "",
    "stateProvinces": []
  },
  {
    "name": "Argentina",
    "countryCode": "AR",
    "countryCodeAlpha3": "ARG",
    "phone": "54",
    "currency": "ARS",
    "flag": "https://www.geonames.org/flags/x/ar.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Misiones" },
      { "name": "Formosa" },
      { "name": "Buenos Aires F.D." },
      { "name": "Entre Rios" },
      { "name": "Corrientes" },
      { "name": "Buenos Aires" },
      { "name": "Tucuman" },
      { "name": "Tierra del Fuego" },
      { "name": "Santiago del Estero" },
      { "name": "Santa Fe" },
      { "name": "Santa Cruz" },
      { "name": "San Luis" },
      { "name": "San Juan" },
      { "name": "Salta" },
      { "name": "Rio Negro" },
      { "name": "Neuquen" },
      { "name": "Mendoza" },
      { "name": "La Rioja" },
      { "name": "La Pampa" },
      { "name": "Jujuy" },
      { "name": "Cordoba" },
      { "name": "Chubut" },
      { "name": "Chaco" },
      { "name": "Catamarca" }
    ]
  },
  {
    "name": "American Samoa",
    "countryCode": "AS",
    "countryCodeAlpha3": "ASM",
    "phone": "\u002B1-684",
    "currency": "USD",
    "flag": "https://www.geonames.org/flags/x/as.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Western District" },
      { "name": "Swains Island" },
      { "name": "Eastern District" },
      { "name": "Manu\u0027a" },
      { "name": "Rose Island" }
    ]
  },
  {
    "name": "Austria",
    "countryCode": "AT",
    "countryCodeAlpha3": "AUT",
    "phone": "43",
    "currency": "EUR",
    "flag": "https://www.geonames.org/flags/x/at.gif",
    "symbol": "\u20AC",
    "stateProvinces": [
      { "name": "Vienna" },
      { "name": "Vorarlberg" },
      { "name": "Tyrol" },
      { "name": "Styria" },
      { "name": "Salzburg" },
      { "name": "Upper Austria" },
      { "name": "Lower Austria" },
      { "name": "Carinthia" },
      { "name": "Burgenland" }
    ]
  },
  {
    "name": "Australia",
    "countryCode": "AU",
    "countryCodeAlpha3": "AUS",
    "phone": "61",
    "currency": "AUD",
    "flag": "https://www.geonames.org/flags/x/au.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Western Australia" },
      { "name": "South Australia" },
      { "name": "Northern Territory" },
      { "name": "Victoria" },
      { "name": "Tasmania" },
      { "name": "Queensland" },
      { "name": "New South Wales" },
      { "name": "Australian Capital Territory" }
    ]
  },
  {
    "name": "Aruba",
    "countryCode": "AW",
    "countryCodeAlpha3": "ABW",
    "phone": "297",
    "currency": "AWG",
    "flag": "https://www.geonames.org/flags/x/aw.gif",
    "symbol": "\u0192",
    "stateProvinces": []
  },
  {
    "name": "Aland Islands",
    "countryCode": "AX",
    "countryCodeAlpha3": "ALA",
    "phone": "\u002B358-18",
    "currency": "EUR",
    "flag": "https://www.geonames.org/flags/x/ax.gif",
    "symbol": "\u20AC",
    "stateProvinces": [
      { "name": "Mariehamns stad" },
      { "name": "\u00C5lands landsbygd" },
      { "name": "\u00C5lands sk\u00E4rg\u00E5rd" }
    ]
  },
  {
    "name": "Azerbaijan",
    "countryCode": "AZ",
    "countryCodeAlpha3": "AZE",
    "phone": "994",
    "currency": "AZN",
    "flag": "https://www.geonames.org/flags/x/az.gif",
    "symbol": "\u20BC",
    "stateProvinces": [
      { "name": "Beyl\u0259qan" },
      { "name": "Zangilan District" },
      { "name": "Yardimli District" },
      { "name": "Shusha" },
      { "name": "Salyan District" },
      { "name": "Sabirabad District" },
      { "name": "Saatl\u0131" },
      { "name": "Bilasuvar District" },
      { "name": "Neft\u00E7ala" },
      { "name": "Nakhichevan ASSR" },
      { "name": "Masally" },
      { "name": "Lerik District" },
      { "name": "L\u0259nk\u0259ran" },
      { "name": "La\u00E7\u0131n" },
      { "name": "Qubadl\u0131" },
      { "name": "\u0130mi\u015Fli" },
      { "name": "Fuzuli District" },
      { "name": "Jabrayil" },
      { "name": "Jalilabad" },
      { "name": "Astara" },
      { "name": "Xocal\u0131" },
      { "name": "A\u011Fcab\u01DDdi" },
      { "name": "A\u011Fdam" },
      { "name": "Shirvan" },
      { "name": "Lankaran Sahari" },
      { "name": "Shusha City" },
      { "name": "Tartar District" },
      { "name": "Xank\u01DDndi" },
      { "name": "Khojavend" },
      { "name": "Z\u0259rdab" },
      { "name": "Zaqatala District" },
      { "name": "Yevlax" },
      { "name": "O\u011Fuz" },
      { "name": "Ucar" },
      { "name": "Tovuz District" },
      { "name": "\u015Eamax\u0131" },
      { "name": "Shaki" },
      { "name": "\u015E\u01DDmkir" },
      { "name": "Kurdamir District" },
      { "name": "Qabala District" },
      { "name": "Qusar District" },
      { "name": "Quba" },
      { "name": "Goygol Rayon" },
      { "name": "Xa\u00E7maz" },
      { "name": "Kalbajar" },
      { "name": "Qazax" },
      { "name": "Goranboy District" },
      { "name": "Qax" },
      { "name": "Ismayilli District" },
      { "name": "G\u00F6y\u00E7ay" },
      { "name": "Shabran" },
      { "name": "Da\u015Fk\u01DDs\u01DDn" },
      { "name": "Balakan District" },
      { "name": "Barda" },
      { "name": "Baki" },
      { "name": "Ab\u015Feron" },
      { "name": "Agsu District" },
      { "name": "A\u011Fda\u015F" },
      { "name": "Gadabay District" },
      { "name": "A\u011Fstafa" },
      { "name": "G\u01DDnc\u01DD" },
      { "name": "Ming\u01DDcevir" },
      { "name": "Naftalan" },
      { "name": "Qobustan" },
      { "name": "Samux" },
      { "name": "Shaki City" },
      { "name": "Siy\u01DDz\u01DDn" },
      { "name": "Sumqayit" },
      { "name": "X\u0131z\u0131" },
      { "name": "Yevlax City" },
      { "name": "Hac\u0131qabul" }
    ]
  },
  // ... and so on for all countries
  {
    "name": "India",
    "countryCode": "IN",
    "countryCodeAlpha3": "IND",
    "phone": "91",
    "currency": "INR",
    "flag": "https://www.geonames.org/flags/x/in.gif",
    "symbol": "\u20B9",
    "stateProvinces": [
      { "name": "Andaman and Nicobar Islands" },
      { "name": "Andhra Pradesh" },
      { "name": "Arunachal Pradesh" },
      { "name": "Assam" },
      { "name": "Bihar" },
      { "name": "Chandigarh" },
      { "name": "Chhattisgarh" },
      { "name": "Dadra and Nagar Haveli and Daman and Diu" },
      { "name": "Delhi" },
      { "name": "Goa" },
      { "name": "Gujarat" },
      { "name": "Haryana" },
      { "name": "Himachal Pradesh" },
      { "name": "Jammu and Kashmir" },
      { "name": "Jharkhand" },
      { "name": "Karnataka" },
      { "name": "Kerala" },
      { "name": "Ladakh" },
      { "name": "Lakshadweep" },
      { "name": "Madhya Pradesh" },
      { "name": "Maharashtra" },
      { "name": "Manipur" },
      { "name": "Meghalaya" },
      { "name": "Mizoram" },
      { "name": "Nagaland" },
      { "name": "Odisha" },
      { "name": "Puducherry" },
      { "name": "Punjab" },
      { "name": "Rajasthan" },
      { "name": "Sikkim" },
      { "name": "Tamil Nadu" },
      { "name": "Telangana" },
      { "name": "Tripura" },
      { "name": "Uttar Pradesh" },
      { "name": "Uttarakhand" },
      { "name": "West Bengal" }
    ]
  },
  // ... continue with other countries
   {
    "name": "United States",
    "countryCode": "US",
    "countryCodeAlpha3": "USA",
    "phone": "1",
    "currency": "USD",
    "flag": "https://www.geonames.org/flags/x/us.gif",
    "symbol": "$",
    "stateProvinces": [
      { "name": "Alabama" }, { "name": "Alaska" }, { "name": "Arizona" }, { "name": "Arkansas" }, { "name": "California" }, { "name": "Colorado" }, { "name": "Connecticut" }, { "name": "Delaware" }, { "name": "District of Columbia" }, { "name": "Florida" }, { "name": "Georgia" }, { "name": "Hawaii" }, { "name": "Idaho" }, { "name": "Illinois" }, { "name": "Indiana" }, { "name": "Iowa" }, { "name": "Kansas" }, { "name": "Kentucky" }, { "name": "Louisiana" }, { "name": "Maine" }, { "name": "Maryland" }, { "name": "Massachusetts" }, { "name": "Michigan" }, { "name": "Minnesota" }, { "name": "Mississippi" }, { "name": "Missouri" }, { "name": "Montana" }, { "name": "Nebraska" }, { "name": "Nevada" }, { "name": "New Hampshire" }, { "name": "New Jersey" }, { "name": "New Mexico" }, { "name": "New York" }, { "name": "North Carolina" }, { "name": "North Dakota" }, { "name": "Ohio" }, { "name": "Oklahoma" }, { "name": "Oregon" }, { "name": "Pennsylvania" }, { "name": "Rhode Island" }, { "name": "South Carolina" }, { "name": "South Dakota" }, { "name": "Tennessee" }, { "name": "Texas" }, { "name": "Utah" }, { "name": "Vermont" }, { "name": "Virginia" }, { "name": "Washington" }, { "name": "West Virginia" }, { "name": "Wisconsin" }, { "name": "Wyoming" }
    ]
  },
  {
    "name": "Zimbabwe",
    "countryCode": "ZW",
    "countryCodeAlpha3": "ZWE",
    "phone": "263",
    "currency": "ZWG",
    "flag": "https://www.geonames.org/flags/x/zw.gif",
    "symbol": "",
    "stateProvinces": [
      { "name": "Midlands Province" },
      { "name": "Matabeleland South Province" },
      { "name": "Matabeleland North" },
      { "name": "Masvingo Province" },
      { "name": "Mashonaland West" },
      { "name": "Mashonaland East Province" },
      { "name": "Mashonaland Central" },
      { "name": "Manicaland" },
      { "name": "Bulawayo" },
      { "name": "Harare" }
    ]
  }
].sort((a, b) => a.name.localeCompare(b.name));


export interface StateProvince {
    name: string;
}

export interface Country {
  name: string;
  countryCode: string;
  stateProvinces: StateProvince[];
}

interface CountriesContextType {
  countries: Country[];
  getStatesByCountry: (countryName: string) => StateProvince[];
}

const CountriesContext = createContext<CountriesContextType | undefined>(undefined);

export function CountriesProvider({ children }: { children: ReactNode }) {
  const [countries] = useState<Country[]>(countriesData);

  const getStatesByCountry = useCallback((countryName: string): StateProvince[] => {
    const country = countries.find(c => c.name === countryName);
    return country?.stateProvinces || [];
  }, [countries]);

  const value = { countries, getStatesByCountry };

  return (
    <CountriesContext.Provider value={value}>
      {children}
    </CountriesContext.Provider>
  );
}

export function useCountries() {
  const context = useContext(CountriesContext);
  if (context === undefined) {
    throw new Error('useCountries must be used within a CountriesProvider');
  }
  return context;
}
