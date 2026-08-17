 "use client";

import { useState } from "react";
import { calculateChart, formatDegree, navamsaOfPlanet, nakshatras, nakshatraLetter, nakshatraLettersText, shortSigns, signs, type ChartData, type Planet } from "../lib/astro";

type Form={
  name:string; father:string; mother:string; date:string; time:string; place:string; gender:string;
  lat:string; lon:string; headline:string; shopName:string; shopPlace:string; shopContact:string;
};

const chartCells=[
  {r:1,c:1,s:11},{r:1,c:2,s:0},{r:1,c:3,s:1},{r:1,c:4,s:2},
  {r:2,c:1,s:10},{r:2,c:4,s:3},{r:3,c:1,s:9},{r:3,c:4,s:4},
  {r:4,c:1,s:8},{r:4,c:2,s:7},{r:4,c:3,s:6},{r:4,c:4,s:5},
];

const MURUGAN_IMAGE = "https://commons.wikimedia.org/wiki/Special:Redirect/file/20190821_Lord_Murugan_statue-2.jpg";
const VINAYAGAR_IMAGE = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesha_picture.jpg";

function DeityImage({src,label}:{src:string;label:string}){
 return <div className="deitySide">
   <div className="deityPhotoWrap">
     <img className="deityPhoto" src={src} alt={label} />
   </div>
   <small>{label}</small>
 </div>
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
 const [busy,setBusy]=useState(false);
 const set=(k:keyof Form,v:string)=>setF(x=>({...x,[k]:v}));

 async function generate(){
   if(!f.name||!f.date||!f.time||!f.place){alert("பெயர், தேதி, நேரம், பிறந்த இடம் ஆகியவை கட்டாயம்.");return}
   setBusy(true)
   setStatus("பிறந்த இடத்தை கண்டறிகிறது...");
   let lat=Number(f.lat),lon=Number(f.lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)){
     const r=await fetch(`/api/geocode?q=${encodeURIComponent(f.place)}`);
     const j=await r.json();
     if(!r.ok){setStatus("இடத்தை கண்டறிய முடியவில்லை. Optional coordinates-ஐ கொடுக்கலாம்.");setBusy(false);return}
     lat=j.lat;lon=j.lon;
   }
   try{setData(calculateChart({date:f.date,time:f.time,lat,lon}));setStatus("")}
   catch{setStatus("கணக்கீட்டில் பிழை. தேதி/நேரத்தை சரிபார்க்கவும்.")}
   finally{setBusy(false)}
 }

 async function downloadPdf(){
   const el=document.getElementById("report");
   if(!el)return;
   setBusy(true);
   try{
     const [{default:html2canvas},{jsPDF}]=await Promise.all([import("html2canvas"),import("jspdf")]);
     const canvas=await html2canvas(el,{scale:2,useCORS:true,backgroundColor:"#ffffff",logging:false});
     const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
     const img=canvas.toDataURL("image/jpeg",0.94);
     pdf.addImage(img,"JPEG",0,0,210,297);
     pdf.save(`${f.name || "jathagam"}.pdf`);
   }catch{alert("PDF உருவாக்க முடியவில்லை. Print / Save as PDF பயன்படுத்தலாம்.")}
   finally{setBusy(false)}
 }

 function openReport(){
   const el=document.getElementById("report");
   if(!el)return;
   const win=window.open("","_blank");
   if(!win){alert("Browser popup block செய்துள்ளது. Open permission கொடுக்கவும்.");return}
   win.document.write(`<!doctype html><html lang="ta"><head><meta charset="utf-8"><title>${f.name || "Jathagam"}</title><style>${Array.from(document.styleSheets).map(s=>{try{return Array.from((s as CSSStyleSheet).cssRules).map(r=>r.cssText).join("\n")}catch{return ""}}).join("\n")}</style></head><body>${el.outerHTML}</body></html>`);
   win.document.close();
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
   <button disabled={busy} onClick={generate}>{busy?"தயாராகிறது…":"ஜாதகம் உருவாக்கு"}</button>{status&&<p className="status">{status}</p>}
  </section>

  {data&&<section className="paper" id="report">
   <header className="reportHead">
     <DeityImage src={MURUGAN_IMAGE} label="ஸ்ரீ முருகன்" />
     <div className="headTitle">
       <div className="brandTiny">ஜென்ம ஜாதகம் • KINGS TECHNOLOGY</div>
       <h1>ஒரு பக்க ஜாதகம்</h1>
       {f.headline&&<strong className="headline">{f.headline}</strong>}
       <p>பிறப்பு விவரங்களின் அடிப்படையில் உருவாக்கப்பட்ட ஜாதக அறிக்கை</p>
     </div>
     <DeityImage src={VINAYAGAR_IMAGE} label="ஸ்ரீ விநாயகர்" />
   </header>

   <div className="companyStrip">Software by : Kings Technology Tamil Jathagam</div>

   <section className="detailsPanel">
     <div className="detailsCol">
       <h2>{f.name}</h2>
       <div className="detailRows">
         <div><span>தந்தை</span><b>{f.father||"—"}</b></div>
         <div><span>தாய்</span><b>{f.mother||"—"}</b></div>
         <div><span>லக்னம்</span><b>{signs[data.lagna]}</b></div>
         <div><span>ராசி</span><b>{signs[data.rasi]}</b></div>
         <div><span>நட்சத்திரம்</span><b>{nakshatras[data.moonNak]} {data.moonPada}</b></div>
         <div><span>நட்சத்திர எழுத்து</span><b>{nakshatraLettersText(data.moonNak)}</b></div>
         <div><span>பட்சம்-திதி</span><b>{data.tithi}</b></div>
         <div><span>யோகம்-கரணம்</span><b>{data.yoga} / {data.karana}</b></div>
         <div><span>தமிழ்ப்பிறைமை</span><b>{f.gender}</b></div>
       </div>
     </div>
     <div className="detailsCol rightDetails">
       <div className="detailRows">
         <div><span>தேதி</span><b>{f.date}</b></div>
         <div><span>நேரம்</span><b>{f.time}</b></div>
         <div><span>உதயாதி நாழிகை</span><b>—</b></div>
         <div><span>இடம்</span><b>{f.place}</b></div>
         <div><span>அட்ச/தீர்க்க-ரேகை</span><b>{f.lat||"—"} / {f.lon||"—"}</b></div>
         <div><span>பொதுநேரம்-திருத்தம்</span><b>5.5</b></div>
         <div><span>சூரிய உதயம்</span><b>—</b></div>
         <div><span>சூரிய அஸ்தமனம்</span><b>—</b></div>
       </div>
     </div>
   </section>

   <div className="noteLine">
     <b>யோகம்</b> {data.yoga} &nbsp;•&nbsp; <b>நட்சத்திரம்</b> {nakshatras[data.moonNak]} {data.moonPada} &nbsp;•&nbsp; <b>நட்சத்திர எழுத்து</b> {nakshatraLettersText(data.moonNak)} &nbsp;•&nbsp; <b>ராசி</b> {signs[data.rasi]}
   </div>

   <section className="planetSection">
     <h2>துல்லியமான நிராயன கிரக நிலைகள் (திருக்கணிதம்)</h2>
     <table className="planetTable">
       <thead><tr><th>கிரகம்</th><th>பாகை-கலை</th><th>நட்சத்திரம்</th><th>பாதம்</th><th>நட்-அதிபதி</th><th>ராசி</th><th>பாகை-கலை</th><th>நிலை</th></tr></thead>
       <tbody>{data.planets.map((p:Planet)=><tr key={p.name}>
         <td>{p.name}</td><td>{formatDegree(p.degree)}</td><td>{nakshatras[p.nak]}</td><td>{p.pada}</td>
         <td>{p.name==="சூரியன்"?"புதன்":p.name==="சந்திரன்"?"சூரியன்":p.name==="செவ்வாய்"?"ராகு":p.name==="புதன்"?"சனி":p.name==="குரு"?"சனி":p.name==="சுக்கிரன்"?"சந்திரன்":p.name==="சனி"?"புதன்":"கேது"}</td>
         <td>{signs[p.sign]}</td><td>{formatDegree(p.degree)}</td><td>{p.retro?"வ":""}</td>
       </tr>)}</tbody>
     </table>
   </section>

   <section className="chartsRow">
     <Chart data={data} title="ராசி" />
     <Chart data={data} title="நவாம்சம்" navamsa />
   </section>

   <section className="dashaBar">
     <div><b>சூரிய தசை இருப்பு</b> {data.dashaBalance}</div>
     <div><b>நடப்பு தசை</b> {data.dasha}</div>
     <div><b>பாவக மாற்றம்</b> லக்னம் - சந்திரன் அடிப்படையில்</div>
   </section>

   {hasShop&&<section className="shopPrint">
     <b>{f.headline||"வாடிக்கையாளர் பயன்பாட்டிற்காக"}</b>
     <span>{f.shopName&&`கடை: ${f.shopName}`}</span>
     <span>{f.shopPlace&&`இடம்: ${f.shopPlace}`}</span>
     <span>{f.shopContact&&`தொடர்பு: ${f.shopContact}`}</span>
   </section>}

   <footer className="reportFooter">
     <span><strong>Kings Tamil Astro</strong> • Software by Kings Technology www.kingstechnology.in </span>
     <span>Printed on {now}</span>
   </footer>

   <div className="no-print actions">
     <button disabled={busy} onClick={()=>window.print()}>🖨️ Print / Save PDF</button>
     <button disabled={busy} onClick={downloadPdf}>⬇️ Download PDF</button>
     <button disabled={busy} onClick={openReport}>↗ Open</button>
     <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>← புதிய ஜாதகம்</button>
   </div>
  </section>}
 </main>
}
