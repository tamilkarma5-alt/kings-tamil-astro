"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  calculateBirthChart,
  BirthChart,
  Planet,
} from "../lib/astro";

type FormData = {
  name: string;
  dob: string;
  time: string;
  place: string;
  latitude: string;
  longitude: string;
  gender: string;
  father: string;
  mother: string;
  headline: string;
  sentence: string;
  shopName: string;
  shopPlace: string;
  shopContact: string;
};

const emptyForm: FormData = {
  name: "",
  dob: "",
  time: "",
  place: "",
  latitude: "",
  longitude: "",
  gender: "ஆண்",
  father: "",
  mother: "",
  headline: "",
  sentence: "",
  shopName: "",
  shopPlace: "",
  shopContact: "",
};

const planets = [
  "சூரியன்",
  "சந்திரன்",
  "செவ்வாய்",
  "புதன்",
  "குரு",
  "சுக்கிரன்",
  "சனி",
  "ராகு",
  "கேது",
];

const rasis = [
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

export default function Home() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [showReport, setShowReport] = useState(false);

  const update = (key: keyof FormData, value: string) => {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const birthDate = useMemo(() => {
    if (!form.dob || !form.time) return null;

    const value = new Date(`${form.dob}T${form.time}:00`);

    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value;
  }, [form.dob, form.time]);

  function generate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name || !form.dob || !form.time || !form.place) {
      alert(
        "பெயர், பிறந்த தேதி, பிறந்த நேரம், பிறந்த இடம் ஆகியவை கட்டாயம்."
      );
      return;
    }

    if (!form.latitude || !form.longitude) {
      alert(
        "துல்லியமான ஜாதக கணக்கிற்கு Latitude மற்றும் Longitude கொடுக்கவும்."
      );
      return;
    }

    if (!birthDate) {
      alert("பிறந்த தேதி / நேரம் சரியாக உள்ளதா என்று பார்க்கவும்.");
      return;
    }

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      alert("Latitude / Longitude சரியாக கொடுக்கவும்.");
      return;
    }

    try {
      const result = calculateBirthChart(
        birthDate,
        latitude,
        longitude
      );

      setChart(result);
      setShowReport(true);

      setTimeout(() => {
        document
          .getElementById("jathagam")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch (error) {
      console.error(error);
      alert(
        "ஜாதக கணக்கில் பிழை ஏற்பட்டது. Date, Time, Latitude, Longitude சரிபார்க்கவும்."
      );
    }
  }

  function getPlanet(name: string): Planet | null {
    if (!chart) return null;

    if (name === "லக்னம்") {
      return chart.lagna;
    }

    if (name === "ராகு") {
      return chart.rahu;
    }

    if (name === "கேது") {
      return chart.ketu;
    }

    return (
      chart.planets.find(
        (planet) => planet.name === name
      ) || null
    );
  }

  function formatDegree(value: number) {
    const degree = value % 30;
    const deg = Math.floor(degree);
    const minutes = Math.floor(
      (degree - deg) * 60
    );

    return `${deg}° ${minutes}'`;
  }

  function getRasiIndex(rasi: string) {
    return rasis.indexOf(rasi);
  }

  return (
    <main>
      {!showReport && (
        <section className="editor no-print">
          <div className="editorHeader">
            <div className="brandSmall">
              KINGS TECHNOLOGY
            </div>

            <h1>ஒரு பக்க ஜாதகம்</h1>

            <p>
              Professional Tamil Jathagam Generator
            </p>
          </div>

          <form onSubmit={generate}>
            <h2>பிறப்பு விவரங்கள்</h2>

            <div className="formGrid">
              <Field
                label="பெயர்"
                value={form.name}
                placeholder="உதா: KESAVAN"
                onChange={(v) =>
                  update("name", v)
                }
              />

              <Field
                label="பிறந்த தேதி"
                type="date"
                value={form.dob}
                onChange={(v) =>
                  update("dob", v)
                }
              />

              <Field
                label="பிறந்த நேரம்"
                type="time"
                value={form.time}
                onChange={(v) =>
                  update("time", v)
                }
              />

              <Field
                label="பிறந்த இடம்"
                value={form.place}
                placeholder="உதா: NAMAKKAL"
                onChange={(v) =>
                  update("place", v)
                }
              />

              <label className="field">
                <span>பாலினம்</span>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    update(
                      "gender",
                      e.target.value
                    )
                  }
                >
                  <option>ஆண்</option>
                  <option>பெண்</option>
                </select>
              </label>
            </div>

            <details>
              <summary>
                ஜாதக கணக்கிற்கான Location — Required
              </summary>

              <div className="locationHelp">
                பிறந்த இடத்தின் Latitude மற்றும்
                Longitude கொடுக்கவும்.
              </div>

              <div className="formGrid">
                <Field
                  label="Latitude"
                  value={form.latitude}
                  placeholder="உதா: 11.2189"
                  onChange={(v) =>
                    update("latitude", v)
                  }
                />

                <Field
                  label="Longitude"
                  value={form.longitude}
                  placeholder="உதா: 78.1674"
                  onChange={(v) =>
                    update("longitude", v)
                  }
                />
              </div>
            </details>

            <details>
              <summary>
                தனிப்பட்ட விவரங்கள் — Optional
              </summary>

              <div className="formGrid">
                <Field
                  label="தந்தை பெயர்"
                  value={form.father}
                  onChange={(v) =>
                    update("father", v)
                  }
                />

                <Field
                  label="தாய் பெயர்"
                  value={form.mother}
                  onChange={(v) =>
                    update("mother", v)
                  }
                />

                <Field
                  label="Bold Headline"
                  value={form.headline}
                  placeholder="உதா: சிறப்பான எதிர்காலம்"
                  onChange={(v) =>
                    update("headline", v)
                  }
                />

                <Field
                  label="ஒரு வரி வாசகம்"
                  value={form.sentence}
                  placeholder="உங்கள் விருப்ப வாசகம்..."
                  onChange={(v) =>
                    update("sentence", v)
                  }
                />
              </div>
            </details>

            <details>
              <summary>
                Shop விவரங்கள் — Optional
              </summary>

              <div className="formGrid">
                <Field
                  label="Shop Name"
                  value={form.shopName}
                  onChange={(v) =>
                    update("shopName", v)
                  }
                />

                <Field
                  label="Shop Place"
                  value={form.shopPlace}
                  onChange={(v) =>
                    update("shopPlace", v)
                  }
                />

                <Field
                  label="Shop Contact"
                  value={form.shopContact}
                  onChange={(v) =>
                    update(
                      "shopContact",
                      v
                    )
                  }
                />
              </div>
            </details>

            <button
              className="generateButton"
              type="submit"
            >
              ஜாதகம் உருவாக்கு
            </button>
          </form>
        </section>
      )}

      {showReport && chart && (
        <>
          <section
            id="jathagam"
            className="a4"
          >
            <header className="reportHeader">
              <Deity
                emoji="🔱"
                label="ஸ்ரீ முருகன்"
              />

              <div className="titleArea">
                <div className="company">
                  KINGS TECHNOLOGY
                </div>

                <h1>
                  ஒரு பக்க ஜாதகம்
                </h1>

                <div className="titleEnglish">
                  Kings Tamil Astro
                </div>

                <p>
                  ஜென்ம ஜாதக விவரங்கள்
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

              <Deity
                emoji="🐘"
                label="ஸ்ரீ விநாயகர்"
              />
            </header>

            <div className="blueRule" />

            <section className="detailsGrid">
              <Info
                label="பெயர்"
                value={form.name}
              />

              <Info
                label="பிறந்த தேதி"
                value={form.dob}
              />

              <Info
                label="பிறந்த நேரம்"
                value={form.time}
              />

              <Info
                label="பிறந்த இடம்"
                value={form.place}
              />

              <Info
                label="பாலினம்"
                value={form.gender}
              />

              <Info
                label="லக்னம்"
                value={chart.lagna.rasi}
              />

              <Info
                label="ஜென்ம நட்சத்திரம்"
                value={`${getPlanet(
                  "சந்திரன்"
                )?.nakshatra} - பாதம் ${
                  getPlanet("சந்திரன்")
                    ?.pada
                }`}
              />

              {form.father && (
                <Info
                  label="தந்தை பெயர்"
                  value={form.father}
                />
              )}

              {form.mother && (
                <Info
                  label="தாய் பெயர்"
                  value={form.mother}
                />
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
                      <th>நிலை</th>
                    </tr>
                  </thead>

                  <tbody>
                    {planets.map(
                      (planetName) => {
                        const planet =
                          getPlanet(
                            planetName
                          );

                        return (
                          <tr
                            key={
                              planetName
                            }
                          >
                            <td>
                              {planetName}
                            </td>

                            <td>
                              {planet
                                ? planet.rasi
                                : "—"}
                            </td>

                            <td>
                              {planet
                                ? planet.nakshatra
                                : "—"}
                            </td>

                            <td>
                              {planet
                                ? planet.pada
                                : "—"}
                            </td>

                            <td>
                              {planet
                                ? formatDegree(
                                    planet.longitude
                                  )
                                : "—"}
                            </td>
                          </tr>
                        );
                      }
                    )}

                    <tr>
                      <td>ராகு</td>
                      <td>
                        {chart.rahu.rasi}
                      </td>
                      <td>
                        {chart.rahu.nakshatra}
                      </td>
                      <td>
                        {chart.rahu.pada}
                      </td>
                      <td>
                        {formatDegree(
                          chart.rahu.longitude
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>கேது</td>
                      <td>
                        {chart.ketu.rasi}
                      </td>
                      <td>
                        {chart.ketu.nakshatra}
                      </td>
                      <td>
                        {chart.ketu.pada}
                      </td>
                      <td>
                        {formatDegree(
                          chart.ketu.longitude
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Panel>

              <Panel title="ராசி கட்டம்">
                <SouthIndianChart
                  chart={chart}
                  type="rasi"
                />
              </Panel>

              <Panel title="நவாம்ச கட்டம்">
                <NavamsaChart
                  chart={chart}
                />
              </Panel>

              <Panel title="லக்னம் மற்றும் முக்கிய விவரங்கள்">
                <div className="dasa">
                  <div>
                    <span>லக்னம்</span>
                    <b>
                      {chart.lagna.rasi}
                    </b>
                  </div>

                  <div>
                    <span>
                      லக்ன நட்சத்திரம்
                    </span>

                    <b>
                      {chart.lagna.nakshatra}
                    </b>
                  </div>

                  <div>
                    <span>
                      சந்திர ராசி
                    </span>

                    <b>
                      {
                        getPlanet(
                          "சந்திரன்"
                        )?.rasi
                      }
                    </b>
                  </div>

                  <div>
                    <span>
                      சந்திர நட்சத்திரம்
                    </span>

                    <b>
                      {
                        getPlanet(
                          "சந்திரன்"
                        )?.nakshatra
                      }
                    </b>
                  </div>
                </div>
              </Panel>
            </section>

            {(form.shopName ||
              form.shopPlace ||
              form.shopContact) && (
              <footer className="shopFooter">
                {form.shopName && (
                  <b>
                    {form.shopName}
                  </b>
                )}

                {form.shopPlace && (
                  <span>
                    {form.shopPlace}
                  </span>
                )}

                {form.shopContact && (
                  <span>
                    {form.shopContact}
                  </span>
                )}
              </footer>
            )}

            <footer className="reportFooter">
              <span>
                Generated:{" "}
                {new Date().toLocaleDateString(
                  "en-GB"
                )}
              </span>

              <b>
                KINGS TECHNOLOGY
              </b>

              <span>
                ஒரு பக்க ஜாதகம்
              </span>
            </footer>
          </section>

          <div className="printButtons no-print">
            <button
              onClick={() =>
                window.print()
              }
            >
              Print / Save as PDF
            </button>

            <button
              onClick={() => {
                setShowReport(false);
                setChart(null);
              }}
            >
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
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </label>
  );
}

function Deity({
  emoji,
  label,
}: {
  emoji: string;
  label: string;
}) {
  return (
    <div className="deity">
      <div className="deityImage deityEmoji">
        {emoji}
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

      <b>{value || "—"}</b>
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

function SouthIndianChart({
  chart,
}: {
  chart: BirthChart;
  type: "rasi";
}) {
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

  const allPlanets = [
    ...chart.planets,
    chart.rahu,
    chart.ketu,
  ];

  return (
    <div className="southChart">
      {cells.map((rasi, index) => {
        const rasiPlanets =
          allPlanets.filter(
            (planet) =>
              planet.rasi === rasi
          );

        const lagnaHere =
          chart.lagna.rasi === rasi;

        return (
          <div
            key={index}
            className="chartCell"
          >
            <span className="rasiName">
              {rasi}
            </span>

            {lagnaHere && (
              <b className="chartLagna">
                லக்
              </b>
            )}

            {rasiPlanets.map(
              (planet) => (
                <span
                  className="chartPlanet"
                  key={planet.name}
                >
                  {planet.name}
                </span>
              )
            )}
          </div>
        );
      })}

      <strong>ராசி</strong>
    </div>
  );
}

function NavamsaChart({
  chart,
}: {
  chart: BirthChart;
}) {
  /*
    Simple navamsa sign calculation from each
    planet's sidereal longitude.
  */

  const allPlanets = [
    chart.lagna,
    ...chart.planets,
    chart.rahu,
    chart.ketu,
  ];

  const navamsaCells = Array.from(
    { length: 12 },
    (_, index) => index
  );

  return (
    <div className="southChart">
      {navamsaCells.map(
        (index) => {
          const planetsHere =
            allPlanets.filter(
              (planet) => {
                const signIndex =
                  getRasiIndex(
                    planet.rasi
                  );

                const degree =
                  planet.longitude %
                  30;

                const pada =
                  Math.floor(
                    degree /
                      (30 / 9)
                  );

                const navamsa =
                  (signIndex * 9 +
                    pada) %
                  12;

                return (
                  navamsa === index
                );
              }
            );

          return (
            <div
              key={index}
              className="chartCell"
            >
              <span className="rasiName">
                {rasis[index]}
              </span>

              {planetsHere.map(
                (planet) => (
                  <span
                    className="chartPlanet"
                    key={
                      planet.name
                    }
                  >
                    {planet.name}
                  </span>
                )
              )}
            </div>
          );
        }
      )}

      <strong>நவாம்சம்</strong>
    </div>
  );
}
