"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type Form = {
  name: string;
  date: string;
  time: string;
  place: string;
  gender: string;
};

const sample = {
  rasi: "மேஷம்",
  nakshatra: "அஸ்வினி",
  pada: "1-ம் பாதம்",
  lagna: "மிதுனம்",
};

function makeReportId() {
  return `KTA-${Date.now().toString(36).toUpperCase()}`;
}

export default function Home() {
  const [form, setForm] = useState<Form>({
    name: "",
    date: "",
    time: "",
    place: "",
    gender: "ஆண்",
  });

  const [report, setReport] = useState<
    Form & typeof sample & {
      id: string;
      generated: string;
    }
  > | null>(null);

  const [busy, setBusy] = useState(false);

  const generatedText = useMemo(
    () =>
      new Intl.DateTimeFormat("ta-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  }

  function generate() {
    if (!form.name || !form.date || !form.time || !form.place) {
      alert(
        "பெயர், பிறந்த தேதி, பிறந்த நேரம், பிறந்த இடம் ஆகிய அனைத்தையும் நிரப்புங்கள்."
      );
      return;
    }

    setReport({
      ...form,
      ...sample,
      id: makeReportId(),
      generated: generatedText,
    });
  }

  function downloadPdf() {
    if (!report) return;

    setBusy(true);

    try {
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      // Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("Kings Tamil Astro", 20, 22);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("Tamil Astrology Report", 20, 29);

      pdf.line(20, 34, 190, 34);

      // Birth Details
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Birth Details", 20, 44);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const rows = [
        ["Name", report.name],
        ["Date of Birth", report.date],
        ["Time of Birth", report.time],
        ["Place of Birth", report.place],
        ["Gender", report.gender],
      ];

      let y = 54;

      for (const [label, value] of rows) {
        pdf.text(`${label}: ${value}`, 22, y);
        y += 8;
      }

      // Astrology Summary
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Astrology Summary", 20, y + 5);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      y += 15;

      pdf.text(`Rasi: ${report.rasi}`, 22, y);
      pdf.text(`Nakshatra: ${report.nakshatra}`, 22, y + 8);
      pdf.text(`Pada: ${report.pada}`, 22, y + 16);
      pdf.text(`Lagna: ${report.lagna}`, 22, y + 24);

      // Tamil Summary
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Jathaga Summary", 20, y + 40);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      const note =
        "இந்த அறிக்கை தற்போது preview மற்றும் PDF layout-க்காக உருவாக்கப்பட்டுள்ளது. " +
        "உண்மையான ராசி, நட்சத்திரம், லக்னம் மற்றும் கிரக நிலைகள் " +
        "பிறப்பு தேதி, நேரம் மற்றும் இடத்தை அடிப்படையாகக் கொண்ட astrology calculation engine மூலம் நிரப்பப்படும்.";

      const lines = pdf.splitTextToSize(note, 165);

      pdf.text(lines, 22, y + 48);

      // Report information
      pdf.setFontSize(9);

      pdf.text(`Report ID: ${report.id}`, 20, 246);
      pdf.text(`Generated: ${report.generated}`, 20, 253);
      pdf.text("Website: Kings Tamil Astro", 20, 260);

      // Footer
      pdf.line(20, 270, 190, 270);

      pdf.setFontSize(8);
      pdf.text(
        "Kings Tamil Astro - தகவல் நோக்கத்திற்கான ஜோதிட அறிக்கை",
        20,
        280
      );

      pdf.text("Page 1", 174, 280);

      pdf.save(`${report.name}-kings-tamil-astro.pdf`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      {/* Header */}

      <section className="hero">
        <div className="brand-mark">KTA</div>

        <div>
          <div className="eyebrow">KINGS TECHNOLOGY</div>

          <h1>Kings Tamil Astro</h1>

          <p>தமிழில் எளிமையான, அழகான ஜாதக அறிக்கை</p>
        </div>
      </section>

      {/* Input Form */}

      <section className="card form-card">
        <h2>ஜாதக விவரங்கள்</h2>

        <p className="muted">
          பிறந்த தகவல்களை உள்ளிட்டு ஜாதக preview உருவாக்குங்கள்.
        </p>

        <div className="grid">
          <label>
            பெயர்

            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="உங்கள் பெயர்"
            />
          </label>

          <label>
            பிறந்த தேதி

            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>

          <label>
            பிறந்த நேரம்

            <input
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </label>

          <label>
            பிறந்த இடம்

            <input
              value={form.place}
              onChange={(e) => update("place", e.target.value)}
              placeholder="உதா: சென்னை"
            />
          </label>

          <label>
            பாலினம்

            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option>ஆண்</option>
              <option>பெண்</option>
              <option>மற்றவை</option>
            </select>
          </label>
        </div>

        <button className="primary" onClick={generate}>
          ஜாதகம் உருவாக்கு
        </button>
      </section>

      {/* Report Preview */}

      {report && (
        <section className="card report">
          <div className="report-head">
            <div>
              <span className="eyebrow">KINGS TAMIL ASTRO</span>

              <h2>ஒரு பக்க ஜாதகம்</h2>

              <p className="muted">
                Report ID: {report.id}
              </p>
            </div>

            <div className="badge">PREVIEW</div>
          </div>

          {/* Personal Details */}

          <div className="details">
            <div>
              <span>பெயர்</span>
              <strong>{report.name}</strong>
            </div>

            <div>
              <span>பிறந்த தேதி</span>
              <strong>{report.date}</strong>
            </div>

            <div>
              <span>பிறந்த நேரம்</span>
              <strong>{report.time}</strong>
            </div>

            <div>
              <span>பிறந்த இடம்</span>
              <strong>{report.place}</strong>
            </div>
          </div>

          {/* Astrology Details */}

          <div className="astro-grid">
            <div>
              <span>ராசி</span>
              <strong>{report.rasi}</strong>
            </div>

            <div>
              <span>நட்சத்திரம்</span>
              <strong>{report.nakshatra}</strong>
            </div>

            <div>
              <span>பாதம்</span>
              <strong>{report.pada}</strong>
            </div>

            <div>
              <span>லக்னம்</span>
              <strong>{report.lagna}</strong>
            </div>
          </div>

          {/* Summary */}

          <div className="note">
            <h3>ஜாதக சுருக்கம்</h3>

            <p>
              இது தற்போது UI மற்றும் PDF flow-க்கான preview.
              அடுத்த கட்டத்தில் பிறந்த தேதி, நேரம், இடம் ஆகியவற்றை
              வைத்து real astrology calculation engine இணைக்கப்படும்.
            </p>
          </div>

          {/* Footer */}

          <div className="report-footer">
            <span>
              Generated: {report.generated}
            </span>

            <span>
              Kings Tamil Astro
            </span>
          </div>

          {/* PDF */}

          <button
            className="primary"
            onClick={downloadPdf}
            disabled={busy}
          >
            {busy
              ? "PDF உருவாக்கப்படுகிறது..."
              : "PDF Preview / Download"}
          </button>
        </section>
      )}

      <footer>
        © {new Date().getFullYear()} Kings Tamil Astro ·
        தகவல் நோக்கத்திற்கான ஜோதிட கருவி
      </footer>
    </main>
  );
}
