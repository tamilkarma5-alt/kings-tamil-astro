import * as Astronomy from "astronomy-engine";

export type Planet = {
  name: string;
  longitude: number;
  rasi: string;
  nakshatra: string;
  pada: number;
};

export type BirthChart = {
  planets: Planet[];
  lagna: Planet;
  rahu: Planet;
  ketu: Planet;
};

const RASI = [
  "மேஷம்",
  "ரிஷபம்",
  "மிதுனம்",
  "கடகம்",
  "சிம்மம்",
  "கன்னி",
  "துலாம்",
  "விருச்சிகம்",
  "தனுசு",
  "மகரம்",
  "கும்பம்",
  "மீனம்",
];

const NAKSHATRA = [
  "அசுவினி",
  "பரணி",
  "கார்த்திகை",
  "ரோகிணி",
  "மிருகசீரிஷம்",
  "திருவாதிரை",
  "புனர்பூசம்",
  "பூசம்",
  "ஆயில்யம்",
  "மகம்",
  "பூரம்",
  "உத்திரம்",
  "ஹஸ்தம்",
  "சித்திரை",
  "சுவாதி",
  "விசாகம்",
  "அனுஷம்",
  "கேட்டை",
  "மூலம்",
  "பூராடம்",
  "உத்திராடம்",
  "திருவோணம்",
  "அவிட்டம்",
  "சதயம்",
  "பூரட்டாதி",
  "உத்திரட்டாதி",
  "ரேவதி",
];

function normalize(deg: number): number {
  let value = deg % 360;

  if (value < 0) {
    value += 360;
  }

  return value;
}

function rasiFromLongitude(longitude: number): string {
  const index = Math.floor(normalize(longitude) / 30);
  return RASI[index];
}

function nakshatraFromLongitude(longitude: number) {
  const value = normalize(longitude);

  const nakshatraSize = 360 / 27;
  const padaSize = nakshatraSize / 4;

  const nakshatraIndex = Math.floor(value / nakshatraSize);
  const insideNakshatra = value - nakshatraIndex * nakshatraSize;
  const pada = Math.floor(insideNakshatra / padaSize) + 1;

  return {
    name: NAKSHATRA[nakshatraIndex],
    pada,
  };
}

/*
  Approximate Lahiri ayanamsa.

  This converts the tropical longitude produced by the astronomical
  engine into a sidereal longitude suitable for a South Indian
  Vedic-style chart.
*/
function lahiriAyanamsa(date: Date): number {
  const year =
    date.getUTCFullYear() +
    date.getUTCMonth() / 12 +
    date.getUTCDate() / 365.25;

  const yearsFrom2000 = year - 2000;

  return 23.85 + yearsFrom2000 * 0.01396;
}

function siderealLongitude(
  tropicalLongitude: number,
  date: Date
): number {
  return normalize(tropicalLongitude - lahiriAyanamsa(date));
}

function makePlanet(
  name: string,
  longitude: number
): Planet {
  const normalized = normalize(longitude);
  const nakshatra = nakshatraFromLongitude(normalized);

  return {
    name,
    longitude: normalized,
    rasi: rasiFromLongitude(normalized),
    nakshatra: nakshatra.name,
    pada: nakshatra.pada,
  };
}

function planetLongitude(
  body: Astronomy.Body,
  date: Date
): number {
  const vector = Astronomy.GeoVector(body, date);
  const ecliptic = Astronomy.Ecliptic(vector);

  return ecliptic.elon;
}

function moonLongitude(date: Date): number {
  return Astronomy.EclipticGeoMoon(date).lon;
}

function sunLongitude(date: Date): number {
  return Astronomy.SunPosition(date).elon;
}

function rahuLongitude(date: Date): number {
  /*
    Mean ascending lunar node approximation.
    This is sufficient for generating the Rahu/Ketu sign positions
    for this application.
  */

  const jd =
    date.getTime() / 86400000 + 2440587.5;

  const T = (jd - 2451545.0) / 36525;

  const longitude =
    125.04452 -
    1934.136261 * T +
    0.0020708 * T * T +
    (T * T * T) / 450000;

  return normalize(longitude);
}

function getJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function greenwichSiderealTime(date: Date): number {
  const jd = getJulianDay(date);

  const T = (jd - 2451545.0) / 36525;

  const theta =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;

  return normalize(theta);
}

function calculateLagna(
  date: Date,
  latitude: number,
  longitude: number
): number {
  const gst = greenwichSiderealTime(date);

  const localSiderealTime =
    normalize(gst + longitude);

  const T =
    (getJulianDay(date) - 2451545.0) / 36525;

  const obliquity =
    23.439291 -
    0.0130042 * T;

  const epsilon =
    (obliquity * Math.PI) / 180;

  const theta =
    (localSiderealTime * Math.PI) / 180;

  const phi =
    (latitude * Math.PI) / 180;

  /*
    Ascendant calculation using the local sidereal time,
    geographic latitude and Earth's obliquity.
  */

  const y = -Math.cos(theta);

  const x =
    Math.sin(theta) * Math.cos(epsilon) +
    Math.tan(phi) * Math.sin(epsilon);

  const asc =
    (Math.atan2(y, x) * 180) / Math.PI;

  return normalize(asc);
}

export function calculateBirthChart(
  date: Date,
  latitude: number,
  longitude: number
): BirthChart {
  const ayanamsa = lahiriAyanamsa(date);

  const sun = siderealLongitude(
    sunLongitude(date),
    date
  );

  const moon = siderealLongitude(
    moonLongitude(date),
    date
  );

  const mercury = siderealLongitude(
    planetLongitude(Astronomy.Body.Mercury, date),
    date
  );

  const venus = siderealLongitude(
    planetLongitude(Astronomy.Body.Venus, date),
    date
  );

  const mars = siderealLongitude(
    planetLongitude(Astronomy.Body.Mars, date),
    date
  );

  const jupiter = siderealLongitude(
    planetLongitude(Astronomy.Body.Jupiter, date),
    date
  );

  const saturn = siderealLongitude(
    planetLongitude(Astronomy.Body.Saturn, date),
    date
  );

  const rahu = siderealLongitude(
    rahuLongitude(date),
    date
  );

  const ketu = normalize(rahu + 180);

  const tropicalLagna =
    calculateLagna(
      date,
      latitude,
      longitude
    );

  const lagna =
    siderealLongitude(
      tropicalLagna,
      date
    );

  /*
    Keep the variable here so the calculation is explicit.
  */
  void ayanamsa;

  return {
    planets: [
      makePlanet("சூரியன்", sun),
      makePlanet("சந்திரன்", moon),
      makePlanet("செவ்வாய்", mars),
      makePlanet("புதன்", mercury),
      makePlanet("குரு", jupiter),
      makePlanet("சுக்கிரன்", venus),
      makePlanet("சனி", saturn),
    ],

    lagna: makePlanet(
      "லக்னம்",
      lagna
    ),

    rahu: makePlanet(
      "ராகு",
      rahu
    ),

    ketu: makePlanet(
      "கேது",
      ketu
    ),
  };
}

export function getPlanetByName(
  chart: BirthChart,
  name: string
): Planet | undefined {
  if (name === "லக்னம்") {
    return chart.lagna;
  }

  if (name === "ராகு") {
    return chart.rahu;
  }

  if (name === "கேது") {
    return chart.ketu;
  }

  return chart.planets.find(
    (planet) => planet.name === name
  );
}
