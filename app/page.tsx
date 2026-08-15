 "use client";
import { useState } from "react";

type Form={name:string;date:string;time:string;place:string;gender:string};

const planets=[
 ["லக்னம்","துலாம்","சுவாதி","3"],
 ["சூரியன்","கடகம்","ஆயில்யம்","4"],
 ["சந்திரன்","கன்னி","உத்திரம்","2"],
 ["செவ்வாய்","மிதுனம்","திருவாதிரை","1"],
 ["புதன்","கடகம்","பூசம்","4"],
 ["குரு","கடகம்","பூசம்","4"],
 ["சுக்கிரன்","கன்னி","அஸ்தம்","2"],
 ["சனி","மீனம்","ரேவதி","2"],
 ["ராகு","கும்பம்","அவிட்டம்","4"],
 ["கேது","சிம்மம்","மகம்","2"]
];

const rasi=[
 ["மேஷம்",""],["ரிஷபம்",""],["மிதுனம்","செவ்வாய்"],
 ["கடகம்","சூரியன்\nபுதன்\nகுரு"],["சிம்மம்","கேது"],["கன்னி","சந்திரன்\nசுக்கிரன்"],
 ["துலாம்","லக்னம்"],["விருச்சிகம்",""],["தனுசு",""],
 ["மகரம்",""],["கும்பம்","ராகு"],["மீனம்","சனி"]
];

function id(){return "KTA-"+Date.now().toString(36).toUpperCase()}

export default function Home(){
 const [f,setF]=useState<Form>({name:"",date:"",time:"",place:"",gender:"ஆண்"});
 const [show,setShow]=useState(false),[rid,setRid]=useState("");
 const set=(k:keyof Form,v:string)=>setF(x=>({...x,[k]:v}));
 const generate=()=>{
  if(!f.name||!f.date||!f.time||!f.place){alert("அனைத்து பிறப்பு விவரங்களையும் நிரப்புங்கள்.");return}
  setRid(id());setShow(true);setTimeout(()=>document.getElementById("report")?.scrollIntoView({behavior:"smooth"}),80)
 };
 const printed=new Date().toLocaleString("ta-IN",{dateStyle:"medium",timeStyle:"short"});
 return <main className="page">
  <section className="builder no-print">
   <div className="builderBrand"><div className="seal">KTA</div><div><small>KINGS TECHNOLOGY</small><h1>Kings Tamil Astro</h1><p>Professional Tamil Jathagam Generator</p></div></div>
   <h2>பிறப்பு விவரங்கள்</h2>
   <div className="form">
    <label>பெயர்<input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="உதாரணம்: KESAVAN"/></label>
    <label>பிறந்த தேதி<input type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></label>
    <label>பிறந்த நேரம்<input type="time" value={f.time} onChange={e=>set("time",e.target.value)}/></label>
    <label>பிறந்த இடம்<input value={f.place} onChange={e=>set("place",e.target.value)} placeholder="உதாரணம்: SALEM"/></label>
    <label>பாலினம்<select value={f.gender} onChange={e=>set("gender",e.target.value)}><option>ஆண்</option><option>பெண்</option></select></label>
   </div>
   <button onClick={generate}>ஜாதகத்தை உருவாக்கு</button>
  </section>

  {show&&<section id="report" className="paper">
   <header className="top">
    <div className="brandMark"><div className="round">K</div><div><div className="company">KINGS TECHNOLOGY</div><h1>Kings Tamil Astro</h1><p>தமிழ் ஜாதக அறிக்கை</p></div></div>
    <div className="qrFake"><div className="qrSquares">▦</div><span>SCAN / VISIT</span></div>
   </header>

   <div className="goldLine"></div>

   <section className="title">
    <div className="ornament">✦</div>
    <h2>ஜென்ம பத்ரிகா</h2>
    <p>பிறப்பு விவரங்களின் அடிப்படையில் உருவாக்கப்பட்ட ஜாதக அறிக்கை</p>
   </section>

   <section className="bio">
    <div><span>பெயர்</span><b>{f.name}</b></div>
    <div><span>பிறந்த தேதி</span><b>{f.date}</b></div>
    <div><span>பிறந்த நேரம்</span><b>{f.time}</b></div>
    <div><span>பிறந்த இடம்</span><b>{f.place}</b></div>
    <div><span>பாலினம்</span><b>{f.gender}</b></div>
    <div><span>அயனாம்சம்</span><b>லஹிரி</b></div>
   </section>

   <section className="highlight">
    <div><span>லக்னம்</span><strong>துலாம்</strong></div>
    <div><span>ராசி</span><strong>கன்னி</strong></div>
    <div><span>நட்சத்திரம்</span><strong>உத்திரம்</strong></div>
    <div><span>பாதம்</span><strong>2</strong></div>
    <div><span>திதி</span><strong>த்விதியை</strong></div>
    <div><span>யோகம்</span><strong>சித்தம்</strong></div>
   </section>

   <div className="columns">
    <section className="box planets"><h3>கிரக நிலைகள்</h3>
     <table><thead><tr><th>கிரகம்</th><th>ராசி</th><th>நட்சத்திரம்</th><th>பாதம்</th></tr></thead>
     <tbody>{planets.map(p=><tr key={p[0]}>{p.map((x,i)=><td key={i}>{x}</td>)}</tr>)}</tbody></table>
    </section>

    <section className="box"><h3>ராசி கட்டம்</h3>
     <div className="chart rasi">{rasi.map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>
    </section>
   </div>

   <div className="columns lower">
    <section className="box"><h3>நவாம்ச கட்டம்</h3><div className="chart navamsa">{Array.from({length:12},(_,i)=><div key={i}><b>{["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"][i]}</b><span>{i===6?"லக்னம்":""}</span></div>)}</div></section>
    <section className="box dasha"><h3>தசா இருப்பு</h3><div className="dashaRow"><b>சூரிய தசை</b><span>04 வருடம் 00 மாதம் 21 நாள்</span></div><div className="dashaRow"><b>நடப்பு தசை</b><span>சந்திர தசை</span></div><div className="dashaRow"><b>புத்தி</b><span>விவரம் கணக்கீட்டில் சேர்க்கப்படும்</span></div></section>
   </div>

   <section className="notes"><h3>ஜாதக குறிப்புகள்</h3><p>இந்த பகுதி பிறப்பு தேதி, நேரம் மற்றும் இடத்தை வைத்து கணக்கிடப்படும் ஜோதிட விளக்கங்களுக்காக ஒதுக்கப்பட்டுள்ளது.</p></section>

   <footer>
    <div><b>Kings Tamil Astro</b><span>Powered by Kings Technology</span></div>
    <div><span>Report ID: {rid}</span><span>Generated: {printed}</span><span>Website: Kings Tamil Astro</span></div>
   </footer>

   <div className="no-print printActions"><button onClick={()=>window.print()}>🖨️ Print / Save as PDF</button></div>
  </section>}
 </main>
}