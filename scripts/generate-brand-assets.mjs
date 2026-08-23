import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const assetsDir = join(root, "assets/images");
const iconSvgPath = join(
  root,
  "agentic-web/public/logos/noblocks-logo-icon.svg",
);

mkdirSync(assetsDir, { recursive: true });

function renderSvgToPng(svg, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });
  const pngData = resvg.render();
  const buffer = pngData.asPng();
  if (height) {
    return sharp(buffer)
      .resize(width, height, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  }
  return buffer;
}

async function main() {
  const iconSvg = readFileSync(iconSvgPath, "utf8");

  const splashBuffer = await renderSvgToPng(iconSvg, 200, 200);
  writeFileSync(join(assetsDir, "splash-icon.png"), splashBuffer);

  const iconBuffer = await renderSvgToPng(iconSvg, 1024, 1024);
  writeFileSync(join(assetsDir, "icon.png"), iconBuffer);

  const adaptiveBuffer = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: "#141414",
    },
  })
    .composite([
      {
        input: await renderSvgToPng(iconSvg, 620, 620),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
  writeFileSync(join(assetsDir, "adaptive-icon.png"), adaptiveBuffer);

  const faviconBuffer = await renderSvgToPng(iconSvg, 48, 48);
  writeFileSync(join(assetsDir, "favicon.png"), faviconBuffer);

  console.log("Generated brand assets in assets/images/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
