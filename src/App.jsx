import React from "react";

export default function CongratulationsPage() {
  const getParamValue = (key, fallback) => {
    if (typeof window === "undefined") return fallback;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key) || fallback;
    return decodeURIComponent(raw).replace(/^['\"]|['\"]$/g, "").trim() || fallback;
  };

  const name = getParamValue("name", "NAME").toUpperCase();
  const reason = getParamValue("reason", "").toUpperCase();

  return (
    <>
      <link href="https://fonts.cdnfonts.com/css/coolvetica-2" rel="stylesheet" />
      <style>{`
        

        :root {
          --navy: #0b3558;
          --blue-soft: #b7d8f2;
          --blue-mid: #8fc0e6;
          --blue-deep: #6eaee0;
          --white-soft: #f7fbff;
        }

        * {
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          min-height: 100%;
          margin: 0;
        }

        body {
          font-family: 'Coolvetica', Arial, sans-serif;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, var(--blue-mid) 0%, var(--white-soft) 48%, var(--blue-deep) 100%);
          padding: 32px;
        }

        .card {
          width: 100%;
          max-width: 1100px;
          text-align: center;
          color: var(--navy);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .emoji {
          width: clamp(120px, 18vw, 220px);
          height: auto;
          line-height: 1;
        }

        .eyebrow {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 3rem);
          letter-spacing: 0.03em;
          font-weight: 400;
          text-transform: uppercase;
        }

        .name {
          margin: 0;
          font-size: clamp(4rem, 10vw, 8.5rem);
          line-height: 0.95;
          letter-spacing: 0.01em;
          font-weight: 400;
          text-wrap: balance;
          text-transform: uppercase;
        }

        .reason {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 3rem);
          line-height: 1;
          letter-spacing: 0.03em;
          font-weight: 400;
          text-transform: uppercase;
          text-wrap: balance;
          max-width: 900px;
        }

        .logo {
          width: min(320px, 42vw);
          height: auto;
          margin-top: 18px;
          user-select: none;
          -webkit-user-drag: none;
        }

        @media (max-width: 640px) {
          .page {
            padding: 24px;
          }

          .card {
            gap: 14px;
          }

          .logo {
            width: min(240px, 55vw);
            margin-top: 12px;
          }
        }
      `}</style>

      <main className="page">
        <section className="card">
          <img
            className="emoji"
            src="/tada.png"
            alt="celebration"
          />

          <h1 className="eyebrow">CONGRATULATIONS TO</h1>
          <p className="name">{name}</p>
          {reason ? <p className="reason">{reason}</p> : null}

          <img
            className="logo"
            src="https://images.squarespace-cdn.com/content/v1/56282670e4b0177c9d35a3be/1450058017378-0668CL2PJOL7HN7IX9SB/macquarie-ice-rink-front-page-logo.png?format=1500w"
            alt="Macquarie Ice Rink logo"
          />
        </section>
      </main>
    </>
  );
}
