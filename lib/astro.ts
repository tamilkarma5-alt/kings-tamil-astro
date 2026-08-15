import * as Astronomy from "astronomy-engine";

export type Planet = {
  name: string;
  short: string;
  lon: number;
  sign: number;
  degree: number;
  nak: number;
  pada: number;
  retro?: boolean;
};

export type ChartData = {
  planets: Planet[];
  lagna: number;
  lagnaDegree: number;
  rasi: number;
  moonNak: number;
  moonPada: number;
  tithi: string;
  yoga: string;
  karana: string;
  dasha: string;
  dashaBalance: string;
  navamsa: number;
};

export const signs = [
  "மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி",
  "துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"
];

export const shortSigns = [
  "மேஷ","ரிஷ","மிது","கட","சிம்","கன்","துலா","விரு","தனு","மகர","கும்","மீன"
];

export const nakshatras = [
  "அஸ்வினி","பரணி","கார்த்திகை","ரோகிணி","மிருகசீரிடம்","திருவாதிரை",
  "புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்",
  "ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை",
  "மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்",
  "பூரட்டாதி","உத்திரட்டாதி","ரேவதி"
];

const dashaLords = ["கேது","சுக்கிரன்","சூரியன்","சந்திரன்","செவ்வாய்","ராகு","குரு","சனி","புதன்"];
const dashaYears: Record<string,number> = {
  "கேது":7,"சுக்கிரன்":20,"சூரியன்":6,"சந்திரன்":10,"செவ்வாய்":7,
  "ராகு":18,"குரு":16,"சனி":19,"புதன்":17
};
const bodyMap: Array<[string,string,Astronomy.Body]> = [
  ["சூரியன்","சூரி",Astronomy.Body.Sun],
  ["சந்திரன்","சந்",Astronomy.Body.Moon],
  ["செவ்வாய்","செவ்",Astronomy.Body.Mars],
  ["புதன்","புத",Astronomy.Body.Mercury],
  ["குரு","குரு",Astronomy.Body.Jupiter],
  ["சுக்கிரன்","சுக்",Astronomy.Body.Venus],
  ["சனி","சனி",Astronomy.Body.Saturn]
];

const norm=(x:number)=>((x%360)+360)%360;
const ayanamsa=(year:number)=>23.85675 + 0.0139638889*(year-2000);
const signOf=(lon:number)=>Math.floor(norm(lon)/30);
const degInSign=(lon:number)=>norm(lon)%30;

function eclipticLongitudeOf(body:Astronomy.Body, date:Date, observer:Astronomy.Observer) {
  const eq=Astronomy.Equator(body,date,observer,true,true);
  const ra=eq.ra*15*Math.PI/180;
  const dec=eq.dec*Math.PI/180;
  const eps=(23.439291 - 0.0130042*((date.getUTCFullYear()-2000)/100))*Math.PI/180;
  const x=Math.cos(dec)*Math.cos(ra);
  const y=Math.cos(dec)*Math.sin(ra);
  const z=Math.sin(dec);
  const eclX=x;
  const eclY=y*Math.cos(eps)+z*Math.sin(eps);
  return norm(Math.atan2(eclY,eclX)*180/Math.PI);
}

function meanNode(date:Date) {
  const jd=date.getTime()/86400000+2440587.5;
  const T=(jd-2451545.0)/36525;
  return norm(125.04452-1934.136261*T+0.0020708*T*T+(T*T*T)/450000);
}

function ascendant(date:Date, lat:number, lon:number) {
  const lst=norm(Astronomy.SiderealTime(date)*15+lon);
  const eps=(23.439291-0.0130042*((date.getUTCFullYear()-2000)/100))*Math.PI/180;
  const phi=lat*Math.PI/180, th=lst*Math.PI/180;
  let tropical=Math.atan2(-Math.cos(th),Math.sin(th)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps))*180/Math.PI;
  tropical=norm(tropical+180);
  const sid=norm(tropical-ayanamsa(date.getUTCFullYear()));
  return { sid, sign:signOf(sid), degree:degInSign(sid) };
}

function navamsaSign(lon:number) {
  const s=signOf(lon), part=Math.min(8,Math.floor(degInSign(lon)/(30/9)));
  const movable=[0,3,6,9].includes(s);
  const fixed=[1,4,7,10].includes(s);
  const start=movable?s:fixed?norm(s+8):norm(s+4);
  return norm(start+part)%12;
}

function nakInfo(lon:number) {
  const n=Math.floor(norm(lon)/(360/27));
  const pada=Math.floor((norm(lon)%(360/27))/(360/108))+1;
  return {n,pada};
}

const tithiNames=["அமாவாசை","பிரதமை","த்விதியை","திரிதியை","சதுர்த்தி","பஞ்சமி","ஷஷ்டி","சப்தமி","அஷ்டமி","நவமி","தசமி","ஏகாதசி","த்வாதசி","திரயோதசி","சதுர்தசி","பௌர்ணமி"];
const yogaNames=["விஷ்கம்பம்","ப்ரீதி","ஆயுஷ்மான்","சௌபாக்யம்","சோபனம்","அதிகண்டம்","சுகர்மம்","த்ருதி","சூலம்","கண்டம்","விருத்தி","த்ருவம்","வ்யாகாதம்","ஹர்ஷணம்","வஜ்ரம்","சித்தி","வ்யதீபாதம்","வரியான்","பரிகம்","சிவம்","சித்தம்","சாத்யம்","சுபம்","சுக்லம்","ப்ரஹ்மம்","இந்திரம்","வைத்ருதி"];
const karanaNames=["பவம்","பாலவம்","கௌலவம்","தைதிலம்","கரஜை","வணிஜை","விஷ்டி","சகுனி","சதுஷ்பாதம்","நாகவம்","கிம்ஸ்துக்னம்"];

function panchanga(sun:number, moon:number) {
  const diff=norm(moon-sun);
  const ti=Math.floor(diff/12);
  const tithi=ti===15?"பௌர்ணமி":ti===30?"அமாவாசை":tithiNames[ti%15];
  const yoga=yogaNames[Math.floor(norm(sun+moon)/(360/27))];
  const half=Math.floor(diff/6);
  const karana=karanaNames[half%karanaNames.length];
  return {tithi,yoga,karana};
}

function dashaInfo(moonLon:number) {
  const nk=nakInfo(moonLon).n;
  const lord=dashaLords[nk%9];
  const span=360/27;
  const elapsed=norm(moonLon)%span;
  const remaining=dashaYears[lord]*(1-elapsed/span);
  const nextIndex=(dashaLords.indexOf(lord)+1)%9;
  const next=dashaLords[nextIndex];
  return {
    dasha:`${lord} தசை இருப்பு`,
    dashaBalance:`${Math.floor(remaining).toString().padStart(2,"0")} வருடம் ${Math.floor((remaining%1)*12).toString().padStart(2,"0")} மாதம்`
  };
}

export function calculateChart(input:{date:string;time:string;lat:number;lon:number}):ChartData {
  const [y,m,d]=input.date.split("-").map(Number);
  const [hh,mm]=input.time.split(":").map(Number);
  const utc=new Date(Date.UTC(y,m-1,d,hh-5,mm-30,0));
  const observer=new Astronomy.Observer(input.lat,input.lon,0);
  const ay=ayanamsa(y);

  const planets:Planet[]=[];
  let sun=0,moon=0;
  for(const [name,short,body] of bodyMap){
    const tropical=eclipticLongitudeOf(body,utc,observer);
    const lon=norm(tropical-ay);
    if(name==="சூரியன்") sun=lon;
    if(name==="சந்திரன்") moon=lon;
    const ni=nakInfo(lon);
    planets.push({name,short,lon,sign:signOf(lon),degree:degInSign(lon),nak:ni.n,pada:ni.pada});
  }

  const node=norm(meanNode(utc)-ay);
  for(const [name,short,lon] of [["ராகு","ராகு",node],["கேது","கேது",norm(node+180)]] as const){
    const ni=nakInfo(lon);
    planets.push({name,short,lon,sign:signOf(lon),degree:degInSign(lon),nak:ni.n,pada:ni.pada});
  }

  const asc=ascendant(utc,input.lat,input.lon);
  const moonInfo=nakInfo(moon);
  const p=panchanga(sun,moon);
  const ds=dashaInfo(moon);

  return {
    planets,
    lagna:asc.sign,
    lagnaDegree:asc.degree,
    rasi:signOf(moon),
    moonNak:moonInfo.n,
    moonPada:moonInfo.pada,
    tithi:p.tithi,
    yoga:p.yoga,
    karana:p.karana,
    dasha:ds.dasha,
    dashaBalance:ds.dashaBalance,
    navamsa:navamsaSign(asc.sid)
  };
}

export function formatDegree(v:number){
  const d=Math.floor(v), m=Math.floor((v-d)*60), s=Math.round((((v-d)*60)-m)*60);
  return `${String(d).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export function navamsaOfPlanet(p:Planet){return navamsaSign(p.lon);}
