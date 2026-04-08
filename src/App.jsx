import React, { useEffect, useMemo, useRef } from "react";

const WIDTH = 2048;
const HEIGHT = 1280;
const ASPECT = WIDTH / HEIGHT;

export default function CongratulationsPage() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const confettiImgRef = useRef(null);
  const logoImgRef = useRef(null);

  const getParamValue = (key, fallback) => {
    if (typeof window === "undefined") return fallback;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key) || fallback;
    return decodeURIComponent(raw).replace(/^['\"]|['\"]$/g, "").trim() || fallback;
  };

  const name = getParamValue("name", "NAME").toUpperCase();
  const reason = getParamValue("reason", "").toUpperCase();

  const lines = useMemo(() => ({
    eyebrow: "CONGRATULATIONS TO",
    name,
    reason,
  }), [name, reason]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;

    const confettiImg = new Image();
    const logoImg = new Image();
    confettiImg.src = "/confetti.png";
    logoImg.src = "/logo.png";
    confettiImgRef.current = confettiImg;
    logoImgRef.current = logoImg;

    const fitText = (text, maxWidth, startSize, weight = 400) => {
      let size = startSize;
      while (size > 28) {
        ctx.font = `${weight} ${size}px Coolvetica, Arial, sans-serif`;
        if (ctx.measureText(text).width <= maxWidth) return size;
        size -= 4;
      }
      return size;
    };

    const drawWrappedText = ({ text, x, y, maxWidth, initialSize, lineHeight, weight = 400, color = "#0b3558" }) => {
      if (!text) return y;

      const words = text.split(/\s+/).filter(Boolean);
      let size = initialSize;
      let linesOut = [];

      while (size > 24) {
        ctx.font = `${weight} ${size}px Coolvetica, Arial, sans-serif`;
        linesOut = [];
        let current = words[0] || "";

        for (let i = 1; i < words.length; i += 1) {
          const test = `${current} ${words[i]}`;
          if (ctx.measureText(test).width <= maxWidth) {
            current = test;
          } else {
            linesOut.push(current);
            current = words[i];
          }
        }
        if (current) linesOut.push(current);

        const widest = Math.max(...linesOut.map((line) => ctx.measureText(line).width), 0);
        if (widest <= maxWidth && linesOut.length <= 3) break;
        size -= 4;
      }

      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${weight} ${size}px Coolvetica, Arial, sans-serif`;

      const totalHeight = (linesOut.length - 1) * lineHeight;
      let currentY = y - totalHeight / 2;

      linesOut.forEach((line) => {
        ctx.fillText(line, x, currentY, maxWidth);
        currentY += lineHeight;
      });

      return y + totalHeight / 2;
    };

    const draw = () => {
      if (cancelled) return;

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      const gradient = ctx.createLinearGradient(0, HEIGHT, WIDTH, 0);
      gradient.addColorStop(0, "#8fc0e6");
      gradient.addColorStop(0.48, "#f7fbff");
      gradient.addColorStop(1, "#6eaee0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const centreX = WIDTH / 2;
      const navy = "#0b3558";

      if (confettiImg.complete && confettiImg.naturalWidth > 0) {
        const confettiWidth = 230;
        const confettiHeight = (confettiImg.naturalHeight / confettiImg.naturalWidth) * confettiWidth;
        ctx.drawImage(confettiImg, centreX - confettiWidth / 2, 70, confettiWidth, confettiHeight);
      }

      ctx.fillStyle = navy;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const eyebrowSize = fitText(lines.eyebrow, 1500, 74, 400);
      ctx.font = `400 ${eyebrowSize}px Coolvetica, Arial, sans-serif`;
      ctx.fillText(lines.eyebrow, centreX, 345);

      const nameSize = fitText(lines.name, 1780, 200, 400);
      ctx.font = `400 ${nameSize}px Coolvetica, Arial, sans-serif`;
      ctx.fillText(lines.name, centreX, 585, 1780);

      let reasonBottom = 620;
      if (lines.reason) {
        reasonBottom = drawWrappedText({
          text: lines.reason,
          x: centreX,
          y: 790,
          maxWidth: 1500,
          initialSize: 74,
          lineHeight: 82,
          weight: 400,
          color: navy,
        });
      }

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoWidth = 520;
        const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;
        const logoY = Math.min(Math.max(reasonBottom + 150, 1040), 1120);
        ctx.drawImage(logoImg, centreX - logoWidth / 2, logoY - logoHeight / 2, logoWidth, logoHeight);
      }
    };

    const redrawWhenReady = () => draw();
    confettiImg.onload = redrawWhenReady;
    logoImg.onload = redrawWhenReady;
    confettiImg.onerror = redrawWhenReady;
    logoImg.onerror = redrawWhenReady;

    draw();

    return () => {
      cancelled = true;
    };
  }, [lines]);

  useEffect(() => {
    const handleSave = (event) => {
      if (event.key?.toLowerCase() !== "s") return;
      event.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `${name.replace(/[^A-Z0-9]+/g, "-") || "CONGRATULATIONS"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [name]);

  return (
    <>
      <link href="https://fonts.cdnfonts.com/css/coolvetica-2" rel="stylesheet" />

      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          min-height: 100%;
          margin: 0;
        }

        body {
          background: linear-gradient(45deg, #8fc0e6 0%, #f7fbff 48%, #6eaee0 100%);
          font-family: 'Coolvetica', Arial, sans-serif;
        }

        .page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .canvas-wrap {
          width: min(94vw, calc(92vh * ${ASPECT}));
          aspect-ratio: 2048 / 1280;
        }

        .canvas {
          width: 100%;
          height: 100%;
          display: block;
          border: 0;
          box-shadow: 0 10px 35px rgba(11, 53, 88, 0.10);
        }

        @media (max-width: 640px) {
          .page {
            padding: 12px;
          }

          .canvas-wrap {
            width: 100%;
          }
        }
      `}</style>

      <main className="page">
        <div className="canvas-wrap" ref={wrapperRef}>
          <canvas
            ref={canvasRef}
            className="canvas"
            width={WIDTH}
            height={HEIGHT}
            aria-label="Congratulations graphic"
          />
        </div>
      </main>
    </>
  );
}
