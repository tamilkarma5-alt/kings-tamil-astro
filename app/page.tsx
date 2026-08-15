"use client";

import { FormEvent, useState } from "react";

type FormData = {
  name: string;
  dob: string;
  time: string;
  place: string;
  gender: string;
  father: string;
  mother: string;
  headline: string;
  sentence: string;
  shopName: string;
  shopPlace: string;
  shopContact: string;
};

const MURUGAN =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lord_Muruga.jpg";

const VINAYAGAR =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesha_picture.jpg";

const emptyForm: FormData = {
  name: "",
  dob: "",
  time: "",
  place: "",
  gender: "ஆண்",
  father: "",
  mother: "",
  headline: "",
  sentence: "",
  shopName: "",
  shopPlace: "",
  shopContact: "",
};

export default function Home() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showReport, setShowReport] = useState(false);

  const update = (key: keyof FormData, value: string) => {
    setForm((old) => ({ ...old, [key]: value }));
  };

  function generate(e: FormEvent) {
    e.preventDefault();

    if (!form.name || !form.dob || !form.time || !form.place) {
      alert("பெயர், பிறந்த தேதி, பிறந்த நேரம், பிறந்த இடம் ஆகியவை கட்டாயம்.");
      return;
    }

    setShowReport(true);

    setTimeout(() => {
      document
        .getElementById("jathagam")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <main>
      {!showReport && (
        <section className="editor no-print">
          <div className="editorHeader">
            <div className="brandSmall">KINGS TECHNOLOGY</div>
            <h1>ஒரு பக்க ஜாதகம்</h1>
            <p>Professional Tamil Jathagam Generator</p>
          </div>

          <form onSubmit={generate}>
            <h2>பிறப்பு விவரங்கள்</h2>

            <div className="formGrid">
              <Field
                label="பெயர்"
                value={form.name}
                placeholder="உதா: KESAVAN"
                onChange={(v) => update("name", v)}
              />

              <Field
                label="பிறந்த தேதி"
                type="date"
                value={form.dob}
                onChange={(v) => update("dob", v)}
              />

              <Field
                label="பிறந்த நேரம்"
                type="time"
                value={form.time}
                onChange={(v) => update("time", v)}
              />

              <Field
                label="பிறந்த இடம்"
                value={form.place}
                placeholder="உதா: NAMAKKAL"
                onChange={(v) => update("place", v)}
              />

              <label className="field">
                <span>பாலினம்</span>
                <select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option>ஆண்</option>
                  <option>பெண்</option>
                </select>
              </label>
            </div>

            <details>
              <summary>தனிப்பட்ட விவரங்கள் — Optional</summary>

              <div className="formGrid">
                <Field
                  label="தந்தை பெயர்"
                  value={form.father}
                  onChange={(v) => update("father", v)}
                />

                <Field
                  label="தாய் பெயர்"
                  value={form.mother}
                  onChange={(v) => update("mother", v)}
                />

                <Field
                  label="Bold Headline"
                  value={form.headline}
                  placeholder="உதா: சிறப்பான எதிர்காலம்"
                  onChange={(v) => update("headline", v)}
                />

                <Field
                  label="ஒரு வரி வாசகம்"
                  value={form.sentence}
                  placeholder="உங்கள் விருப்ப வாசகம்..."
                  onChange={(v) => update("sentence", v)}
                />
              </div>
            </details>

            <details>
              <summary>கடை / Shop விவரங்கள் — Optional</summary>

              <div className="formGrid">
                <Field
                  label="Shop Name"
                  value={form.shopName}
                  onChange={(v) => update("shopName", v)}
                />

                <Field
                  label="Shop Place"
                  value={form.shopPlace}
                  onChange={(v) => update("shopPlace", v)}
                />

                <Field
                  label="Shop Contact"
                  value={form.shopContact}
                  onChange={(v) => update("shopContact", v)}
                />
              </div>
            </details>

            <button className="generateButton" type="submit">
              ஜாதகம் உருவாக்கு
            </button>
          </form>
        </section>
      )}

      {showReport && (
        <>
          <section id="jathagam" className="a4">
            <header className="reportHeader">
              <Deity image={MURUGAN} label="ஸ்ரீ முருகன்" />

              <div className="titleArea">
                <div className="company">
                  ஜென்ம ஜாதகம் • KINGS TECHNOLOGY
                </div>

                <h1>ஒரு பக்க ஜாதகம்</h1>

                <div className="titleEnglish">
                  Kings Tamil Astro
                </div>

                <p>
                  பிறப்பு விவரங்களின் அடிப்படையில் உருவாக்கப்பட்ட ஜாதக அறிக்கை
                </p>

                {form.headline && (
                  <strong className="headline">
                    {form.headline}
                  </strong>
                )}

                {form.sentence && (
                  <div className="sentence">
                    {form.sentence}
                  </div>
                )}
              </div>

              <Deity image={VINAYAGAR} label="ஸ்ரீ விநாயகர்" />
            </header>

            <div className="blueRule" />

            <section className="detailsGrid">
              <Info label="பெயர்" value={form.name} />
              <Info label="பிறந்த தேதி" value={form.dob} />
              <Info label="பிறந்த நேரம்" value={form.time} />
              <Info label="பிறந்த இடம்" value={form.place} />
              <Info label="பாலினம்" value={form.gender} />

              {form.father && (
                <Info label="தந்தை பெயர்" value={form.father} />
              )}

              {form.mother && (
                <Info label="தாய் பெயர்" value={form.mother} />
              )}
            </section>

            <section className="astrologyGrid">
              <Panel title="கிரக நிலைகள்">
                <table>
                  <thead>
                    <tr>
                      <th>கிரகம்</th>
                      <th>ராசி</th>
                      <th>நட்சத்திரம்</th>
                      <th>பாதம்</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      "சூரியன்",
                      "சந்திரன்",
                      "செவ்வாய்",
                      "புதன்",
                      "குரு",
                      "சுக்கிரன்",
                      "சனி",
                      "ராகு",
                      "கேது",
                    ].map((planet) => (
                      <tr key={planet}>
                        <td>{planet}</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>

              <Panel title="ராசி கட்டம்">
                <SouthIndianChart />
              </Panel>

              <Panel title="நவாம்ச கட்டம்">
                <SouthIndianChart />
              </Panel>

              <Panel title="தசா இருப்பு">
                <div className="dasa">
                  <div>
                    <span>தற்போதைய தசா</span>
                    <b>—</b>
                  </div>

                  <div>
                    <span>மீதம்</span>
                    <b>—</b>
                  </div>

                  <div>
                    <span>அடுத்த தசா</span>
                    <b>—</b>
                  </div>
                </div>
              </Panel>
            </section>

            {(form.shopName ||
              form.shopPlace ||
              form.shopContact) && (
              <footer className="shopFooter">
                {form.shopName && <b>{form.shopName}</b>}
                {form.shopPlace && <span>{form.shopPlace}</span>}
                {form.shopContact && <span>{form.shopContact}</span>}
              </footer>
            )}

            <footer className="reportFooter">
              <span>
                Generated: {new Date().toLocaleDateString("en-GB")}
              </span>

              <b>KINGS TECHNOLOGY</b>

              <span>ஒரு பக்க ஜாதகம்</span>
            </footer>
          </section>

          <div className="printButtons no-print">
            <button onClick={() => window.print()}>
              Print / Save as PDF
            </button>

            <button onClick={() => setShowReport(false)}>
              ← Edit Details
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Deity({
  image,
  label,
}: {
  image: string;
  label: string;
}) {
  return (
    <div className="deity">
      <div className="deityImage">
        <img src={image} alt={label} />
      </div>

      <small>{label}</small>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="infoBox">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SouthIndianChart() {
  const cells = [
    "மேஷம்",
    "ரிஷபம்",
    "மிதுனம்",
    "கடகம்",
    "மீனம்",
    "",
    "",
    "சிம்மம்",
    "கும்பம்",
    "",
    "",
    "கன்னி",
    "மகரம்",
    "தனுசு",
    "விருச்சிகம்",
    "துலாம்",
  ];

  return (
    <div className="southChart">
      {cells.map((cell, index) => (
        <div key={index}>{cell}</div>
      ))}

      <strong>ராசி</strong>
    </div>
  );
}
