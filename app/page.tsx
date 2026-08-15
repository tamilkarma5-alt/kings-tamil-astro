 "use client";
import {useState} from "react";
type Form={name:string;date:string;time:string;place:string;gender:string};
const planets=[["லக்னம்","துலாம்","சுவாதி","3"],["சூரியன்","கடகம்","ஆயில்யம்","4"],["சந்திரன்","கன்னி","உத்திரம்","2"],["செவ்வாய்","மிதுனம்","திருவாதிரை","1"],["புதன்","கடகம்","பூசம்","4"],["குரு","கடகம்","பூசம்","4"],["சுக்கிரன்","கன்னி","அஸ்தம்","2"],["சனி","மீனம்","ரேவதி","2"],["ராகு","கும்பம்","அவிட்டம்","4"],["கேது","சிம்மம்","மகம்","2"]];
const boxes=[["மேஷம்","—"],["ரிஷபம்","—"],["மிதுனம்","செவ்"],["கடகம்","சூரி • புத • குரு"],["சிம்மம்","கேது"],["கன்னி","சந் • சுக்"],["துலாம்","லக்னம்"],["விருச்சிகம்","—"],["தனுசு","—"],["மகரம்","—"],["கும்பம்","ராகு"],["மீனம்","சனி"]];
const rid=()=>`KTA-${Date.now().toString(36).toUpperCase()}`;
export default function Home(){
 const [f,setF]=useState<Form>({name:"",date:"",time:"",place:"",gender:"ஆண்"}),[show,setShow]=useState(false),[id,setId]=useState("");
 const u=(k:keyof Form,v:string)=>setF(x=>({...x,[k]:v}));
 const gen=()=>{if(!f.name||!f.date||!f.time||!f.place){alert("பெயர், தேதி, நேரம், இடம் ஆகியவற்றை நிரப்புங்கள்.");return}setId(rid());setShow(true);setTimeout(()=>document.getElementById("report")?.scrollIntoView({behavior:"smooth"}),50)};
 const now=new Date().toLocaleString("ta-IN",{dateStyle:"medium",timeStyle:"short"});
 return <main className="site">
 <section className="inputCard no-print"><div className="brand"><div className="logo">KTA</div><div><div className="tiny">KINGS TECHNOLOGY</div><h1>Kings Tamil Astro</h1><p>தமிழ் ஜாதக அறிக்கை உருவாக்கும் கருவி</p></div></div>
 <h2>ஜாதக விவரங்கள்</h2><div className="formGrid">
 <label>பெயர்<input value={f.name} onChange={e=>u("name",e.target.value)} placeholder="பெயர்"/></label>
 <label>பிறந்த தேதி<input type="date" value={f.date} onChange={e=>u("date",e.target.value)}/></label>
 <label>பிறந்த நேரம்<input type="time" value={f.time} onChange={e=>u("time",e.target.value)}/></label>
 <label>பிறந்த இடம்<input value={f.place} onChange={e=>u("place",e.target.value)} placeholder="உதா: Salem"/></label>
 <label>பாலினம்<select value={f.gender} onChange={e=>u("gender",e.target.value)}><option>ஆண்</option><option>பெண்</option></select></label></div>
 <button className="generate" onClick={gen}>ஜாதகம் உருவாக்கு</button></section>
 {show&&<section id="report" className="report">
 <header className="reportHeader"><div><div className="tiny">SOFTWARE BY : KINGS TECHNOLOGY</div><h1>Kings Tamil Astro</h1><div className="sub">தமிழ் ஜாதகம் • பிறப்பு அறிக்கை</div></div><div className="printBox"><b>Printed on</b><span>{now}</span></div></header>
 <section className="intro"><div className="mantra">ஜென்ம பத்ரிகா</div><p>பிறப்பு விவரங்களின் அடிப்படையில் உருவாக்கப்பட்ட தமிழ் ஜாதக அறிக்கை</p></section>
 <section className="summary">{[["பெயர்",f.name],["தந்தை / தாய்","— / —"],["தேதி",f.date],["நேரம்",f.time],["இடம்",f.place],["பாலினம்",f.gender]].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</section>
 <section className="keyGrid">{[["லக்னம்","துலாம்"],["ராசி","கன்னி"],["நட்சத்திரம்","உத்திரம் 2"],["பட்சம் - திதி","சுக்ல / த்விதியை"],["யோகம் - கரணம்","சித்தம் / கரஜை"],["தமிழ் தேதி","பராபவ - ஆடி"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</section>
 <div className="twoCol"><section className="panel"><h2>கிரக நிலைகள் — நிராயன</h2><table><thead><tr><th>கிரகம்</th><th>ராசி</th><th>நட்சத்திரம்</th><th>பாதம்</th></tr></thead><tbody>{planets.map(p=><tr key={p[0]}>{p.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></section>
 <section className="panel"><h2>ராசி கட்டம்</h2><div className="rasiGrid">{boxes.map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div></section></div>
 <div className="twoCol"><section className="panel"><h2>நவாம்சம்</h2><div className="chartPlaceholder">நவாம்ச கட்டம்</div></section><section className="panel"><h2>தசா இருப்பு</h2><div className="dasha"><b>சூரிய தசை இருப்பு</b><span>04 வருடம் 00 மாதம் 21 நாள்</span><b>நடப்பு தசை</b><span>சந்திர தசை • புத்தி விவரம்</span></div></section></div>
 <div className="technical"><span>Report ID: {id}</span><span>Generated: {now}</span><span>Website: Kings Tamil Astro</span></div>
 <footer><div><b>Kings Tamil Astro</b> · தமிழ் ஜாதக கருவி</div><div>இந்த அறிக்கை தகவல் நோக்கத்திற்காக வழங்கப்படுகிறது.</div></footer>
 <div className="no-print actionBar"><button onClick={()=>window.print()}>🖨️ Print / Save as PDF</button></div>
 </section>}</main>
}