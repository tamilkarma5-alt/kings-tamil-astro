 "use client";

import { useState } from "react";
import { calculateChart, formatDegree, navamsaOfPlanet, nakshatras, shortSigns, signs, type ChartData, type Planet } from "../lib/astro";

type Form={
  name:string; father:string; mother:string; date:string; time:string; place:string; gender:string;
  lat:string; lon:string; headline:string; shopName:string; shopPlace:string; shopContact:string;
};

const chartCells=[
  {r:1,c:1,s:11},{r:1,c:2,s:0},{r:1,c:3,s:1},{r:1,c:4,s:2},
  {r:2,c:1,s:10},{r:2,c:4,s:3},{r:3,c:1,s:9},{r:3,c:4,s:4},
  {r:4,c:1,s:8},{r:4,c:2,s:7},{r:4,c:3,s:6},{r:4,c:4,s:5},
];

function MuruganIcon(){
 return <svg className="deityIcon" viewBox="0 0 90 90" aria-label="Murugan">
  <circle cx="45" cy="45" r="38" fill="#f7eee2" stroke="#9a7957" strokeWidth="1.5"/>
  <path d="M45 15v48M36 25l9-10 9 10M28 48c8-5 26-5 34 0M32 57c8 6 18 6 26 0M25 68c12-9 28-9 40 0" fill="none" stroke="#5a3821" strokeWidth="2.5" strokeLinecap="round"/>
  <path d="M21 37l7-8 2 13M69 37l-7-8-2 13" fill="none" stroke="#5a3821" strokeWidth="2"/>
  <path d="M69 18l-5 22 5-6 5 6z" fill="none" stroke="#9a7957" strokeWidth="2"/>
  <circle cx="38" cy="38" r="1.8" fill="#5a3821"/><circle cx="52" cy="38" r="1.8" fill="#5a3821"/>
  <path d="M39 47q6 5 12 0" fill="none" stroke="#5a3821" strokeWidth="1.8"/>
 </svg>
}

function VinayagarIcon(){
 return <svg className="deityIcon" viewBox="0 0 90 90" aria-label="Vinayagar">
  <circle cx="45" cy="45" r="38" fill="#f7eee2" stroke="#9a7957" strokeWidth="1.5"/>
  <path d="M30 38q-9-13-14 0 8 2 14 10M60 38q9-13 14 0-8 2-14 10" fill="none" stroke="#5a3821" strokeWidth="3" strokeLinecap="round"/>
  <path d="M45 25q-15 0-17 16 0 18 17 24 17-6 17-24-2-16-17-16z" fill="none" stroke="#5a3821" strokeWidth="2.5"/>
  <path d="M45 43c-3 7-5 14 2 17 7 2 10-4 5-9-3-3-4-6-3-10" fill="none" stroke="#5a3821" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="38" cy="39" r="2" fill="#5a3821"/><circle cx="52" cy="39" r="2" fill="#5a3821"/>
  <path d="M36 31q9-7 18 0" fill="none" stroke="#9a7957" strokeWidth="2"/>
 </svg>
}

function Chart({data,title,navamsa=false}:{data:ChartData;title:string;navamsa?:boolean}){
  const items:Record<number,string[]>={};
  for(const p of data.planets){
    const s=navamsa?navamsaOfPlanet(p):p.sign;
    (items[s]??=[]).push(p.short);
  }
  if(!navamsa) (items[data.lagna]??=[]).unshift("லக்");
  else (items[data.navamsa]??=[]).unshift("லக்");
  return <section className="chartBox"><h3>{title}</h3><div className="southChart">
    {chartCells.map(x=><div key={x.s} className="cell" style={{gridRow:x.r,gridColumn:x.c}}>
      <b>{shortSigns[x.s]}</b><span>{items[x.s]?.join("  ")}</span>
    </div>)}
    <div className="chartCenter"><div>ராசி</div><small>நிராயன • லஹிரி</small></div>
  </div></section>
}

export default function Home(){
 const [f,setF]=useState<Form>({
   name:"",father:"",mother:"",date:"",time:"",place:"",gender:"ஆண்",lat:"",lon:"",
   headline:"",shopName:"",shopPlace:"",shopContact:""
 });
 const [data,setData]=useState<ChartData|null>(null);
 const [status,setStatus]=useState("");
 const set=(k:keyof Form,v:string)=>setF(x=>({...x,[k]:v}));

 async function generate(){
   if(!f.name||!f.date||!f.time||!f.place){alert("பெயர், தேதி, நேரம், பிறந்த இடம் ஆகியவை கட்டாயம்.");return}
   setStatus("பிறந்த இடத்தை கண்டறிகிறது...");
   let lat=Number(f.lat),lon=Number(f.lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)){
     const r=await fetch(`/api/geocode?q=${encodeURIComponent(f.place)}`);
     const j=await r.json();
     if(!r.ok){setStatus("இடத்தை கண்டறிய முடியவில்லை. Optional coordinates-ஐ கொடுக்கலாம்.");return}
     lat=j.lat;lon=j.lon;
   }
   try{setData(calculateChart({date:f.date,time:f.time,lat,lon}));setStatus("")}
   catch{setStatus("கணக்கீட்டில் பிழை. தேதி/நேரத்தை சரிபார்க்கவும்.")}
 }

 const now=new Date().toLocaleString("ta-IN",{dateStyle:"medium",timeStyle:"short"});
 const hasShop=!!(f.shopName||f.shopPlace||f.shopContact);

 return <main className="page">
  <section className="formCard no-print">
   <div className="brand"><div className="logo">KTA</div><div><small>KINGS TECHNOLOGY</small><h1>Kings Tamil Astro</h1><p>Professional South Indian Tamil Jathagam</p></div></div>
   <h2>ஜாதக விவரங்கள்</h2>
   <div className="formGrid">
    <label>பெயர் *<input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="பெயர்"/></label>
    <label>பிறந்த தேதி *<input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></label>
    <label>பிறந்த நேரம் *<input type="time" value={f.time} onChange={e=>set("time",e.target.value)}/></label>
    <label>பிறந்த இடம் *<input value={f.place} onChange={e=>set("place",e.target.value)} placeholder="Rasipuram / Salem"/></label>
    <label>பாலினம்<select value={f.gender} onChange={e=>set("gender",e.target.value)}><option>ஆண்</option><option>பெண்</option></select></label>
   </div>
   <details><summary>தனிப்பட்ட விவரங்கள் — Optional</summary><div className="optionalGrid">
    <label>தந்தை பெயர்<input value={f.father} onChange={e=>set("father",e.target.value)}/></label>
    <label>தாய் பெயர்<input value={f.mother} onChange={e=>set("mother",e.target.value)}/></label>
    <label>அட்சரேகை<input value={f.lat} onChange={e=>set("lat",e.target.value)} placeholder="11.46"/></label>
    <label>தீர்க்கரேகை<input value={f.lon} onChange={e=>set("lon",e.target.value)} placeholder="78.18"/></label>
   </div></details>
   <details className="shopDetails"><summary>கடை / Shop விவரங்கள் — Optional</summary><div className="optionalGrid shopGrid">
    <label>Bold Headline<input value={f.headline} onChange={e=>set("headline",e.target.value)} placeholder="உங்கள் கடையின் tagline / headline"/></label>
    <label>Shop Name<input value={f.shopName} onChange={e=>set("shopName",e.target.value)} placeholder="கடை பெயர்"/></label>
    <label>Shop Place<input value={f.shopPlace} onChange={e=>set("shopPlace",e.target.value)} placeholder="கடை அமைந்துள்ள இடம்"/></label>
    <label>Shop Contact<input value={f.shopContact} onChange={e=>set("shopContact",e.target.value)} placeholder="தொலைபேசி / WhatsApp"/></label>
   </div></details>
   <button onClick={generate}>ஜாதகம் உருவாக்கு</button>{status&&<p className="status">{status}</p>}
  </section>

  {data&&<section className="paper" id="report">
   <header className="reportHead">
     <div className="deitySide"><MuruganIcon/><small>ஸ்ரீ முருகன்</small></div>
     <div className="headTitle">
       <div className="software">ஜென்ம ஜாதகம் • KINGS TECHNOLOGY</div>
       <h1>ஒரு பக்க ஜாதகம்</h1>
       {f.headline&&<strong className="headline">{f.headline}</strong>}
       <p>பிறப்பு விவரங்களின் அடிப்படையில் உருவாக்கப்பட்ட ஜாதக அறிக்கை</p>
     </div>
     <div className="deitySide"><VinayagarIcon/><small>ஸ்ரீ விநாயகர்</small></div>
   </header>

   <section className="infoGrid">
    {[
      ["பெயர்",f.name],["தந்தை",f.father||"—"],["தாய்",f.mother||"—"],["பிறந்த தேதி",f.date],
      ["பிறந்த நேரம்",f.time],["பிறந்த இடம்",f.place],["பாலினம்",f.gender],["அயனாம்சம்","லஹிரி"]
    ].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}
   </section>

   <section className="summaryGrid">
    <div><span>லக்னம்</span><b>{signs[data.lagna]}</b><small>{formatDegree(data.lagnaDegree)}</small></div>
    <div><span>ராசி</span><b>{signs[data.rasi]}</b></div>
    <div><span>நட்சத்திரம்</span><b>{nakshatras[data.moonNak]}</b></div>
    <div><span>பாதம்</span><b>{data.moonPada}</b></div>
    <div><span>பட்சம் - திதி</span><b>{data.tithi}</b></div>
    <div><span>யோகம் - கரணம்</span><b>{data.yoga} / {data.karana}</b></div>
   </section>

   <div className="mainGrid">
    <section className="box planetBox"><h2>துல்லியமான நிராயன கிரக நிலைகள்</h2>
     <table><thead><tr><th>கிரகம்</th><th>பாகை-கலை</th><th>நட்சத்திரம்</th><th>பாதம்</th><th>ராசி</th></tr></thead>
     <tbody>{data.planets.map((p:Planet)=><tr key={p.name}><td>{p.name}</td><td>{formatDegree(p.degree)}</td><td>{nakshatras[p.nak]}</td><td>{p.pada}</td><td>{signs[p.sign]}</td></tr>)}</tbody></table>
    </section>
    <Chart data={data} title="ராசி கட்டம்"/>
   </div>

   <div className="bottomGrid">
    <Chart data={data} title="நவாம்சம்" navamsa/>
    <section className="box dasha"><h2>தசா இருப்பு</h2><div className="dashLine"><b>{data.dasha}</b><span>{data.dashaBalance}</span></div><div className="dashLine"><b>நடப்பு தசை</b><span>கணக்கீடு அடிப்படையில்</span></div><div className="dashLine"><b>பாவக மாற்றம்</b><span>பிறப்பு லக்னத்தை அடிப்படையாகக் கொண்டு</span></div></section>
   </div>

   {hasShop&&<section className="shopPrint"><div className="shopTitle">வாடிக்கையாளர் பயன்பாட்டிற்காக</div><div className="shopLine">
     {f.shopName&&<span><b>கடை:</b> {f.shopName}</span>}
     {f.shopPlace&&<span><b>இடம்:</b> {f.shopPlace}</span>}
     {f.shopContact&&<span><b>தொடர்பு:</b> {f.shopContact}</span>}
   </div></section>}

   <section className="reference"><b>குறிப்பு:</b> நிராயன (Lahiri) முறையில் கணக்கிடப்பட்டது. பிறந்த இடத்தின் coordinates தானாக பெறப்படுகின்றன; தேவையெனில் Optional பகுதியில் மாற்றலாம்.</section>

   <footer><div><strong>Kings Tamil Astro</strong><span>Software by : Kings Technology</span></div><div><span>Report ID : KTA-{Date.now().toString(36).toUpperCase()}</span><span>Generated : {now}</span><span>Website : kings-tamil-astro.vercel.app</span></div></footer>
   <div className="no-print actions"><button onClick={()=>window.print()}>🖨️ Print / Save as PDF</button><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>← புதிய ஜாதகம்</button></div>
  </section>}
 </main>
}