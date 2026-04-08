import React, { useEffect, useRef } from "react";
import { toPng } from "html-to-image";

export default function CongratulationsPage() {
  const exportRef = useRef(null);

  const getParamValue = (key, fallback) => {
    if (typeof window === "undefined") return fallback;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key) || fallback;
    return decodeURIComponent(raw).replace(/^['\"]|['\"]$/g, "").trim() || fallback;
  };

  const name = getParamValue("name", "NAME").toUpperCase();
  const reason = getParamValue("reason", "").toUpperCase();

  useEffect(() => {
    const handleSave = async (event) => {
      if (event.key?.toLowerCase() !== "s") return;
      if (!exportRef.current) return;

      event.preventDefault();

      try {
        const dataUrl = await toPng(exportRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          canvasWidth: 2048,
          canvasHeight: 1280,
          backgroundColor: "#ffffff",
        });

        const link = document.createElement("a");
        link.download = `${name.replace(/[^A-Z0-9]+/g, "-") || "CONGRATULATIONS"}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("PNG export failed", error);
        window.print();
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [name]);

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

        .export-frame {
          width: min(94vw, calc(94vh * 1.6));
          aspect-ratio: 1024 / 640;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, var(--blue-mid) 0%, var(--white-soft) 48%, var(--blue-deep) 100%);
          overflow: hidden;
          position: relative;
        }

        .card {
          width: 100%;
          height: 100%;
          padding: 52px 56px;
          text-align: center;
          color: var(--navy);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }

        .emoji {
          width: clamp(120px, 18vw, 220px);
          height: auto;
          line-height: 1;
          object-fit: contain;
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
          width: min(280px, 30vw);
          height: auto;
          margin-top: 12px;
          user-select: none;
          -webkit-user-drag: none;
        }

        @media (max-width: 640px) {
          .page {
            padding: 16px;
          }

          .export-frame {
            width: 100%;
          }

          .card {
            padding: 28px 20px;
            gap: 10px;
          }

          .logo {
            width: min(180px, 42vw);
            margin-top: 8px;
          }
        }
      `}</style>

      <main className="page">
        <div className="export-frame" ref={exportRef}>
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
        </div>
      </main>
    </>
  );
}
