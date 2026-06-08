/**
 * Downloads brand assets from Figma MCP export URLs and writes Expo-ready PNGs.
 *
 * Re-run after refreshing URLs via Figma MCP get_screenshot / get_design_context
 * on nodes: logo 1:7118, onboarding frame 1:6693.
 *
 * Usage: node scripts/export-figma-assets.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const assetsDir = join(root, "assets/images");
const sourceDir = join(root, "assets/source");

/** Figma MCP asset URLs — refresh via MCP when expired (~7 days). */
const FIGMA = {
  logoSvg: "https://www.figma.com/api/mcp/asset/9f90be06-73df-464b-b050-3c3a3ce16178",
  onboardingFramePng:
    "https://www.figma.com/api/mcp/asset/9bdbb0c2-fb21-4e5c-b161-c0a322dc4de3",
};

/** Illustration crop on 393×852 onboarding frame (matches Figma `1:6693`). */
const ONBOARDING_CROP = {
  left: 31,
  top: 183,
  width: 340,
  height: 197,
};

mkdirSync(assetsDir, { recursive: true });
mkdirSync(sourceDir, { recursive: true });

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function renderSvgToPng(svg, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });
  const buffer = resvg.render().asPng();
  if (!height) {
    return buffer;
  }
  return sharp(buffer)
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function exportBrandIcons(logoSvg) {
  writeFileSync(join(sourceDir, "noblocks-logo-figma.svg"), logoSvg);

  const splashBuffer = await renderSvgToPng(logoSvg, 200, 200);
  writeFileSync(join(assetsDir, "splash-icon.png"), splashBuffer);

  const iconBuffer = await renderSvgToPng(logoSvg, 1024, 1024);
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
        input: await renderSvgToPng(logoSvg, 620, 620),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
  writeFileSync(join(assetsDir, "adaptive-icon.png"), adaptiveBuffer);

  const faviconBuffer = await renderSvgToPng(logoSvg, 48, 48);
  writeFileSync(join(assetsDir, "favicon.png"), faviconBuffer);
}

async function exportOnboardingHero(framePng) {
  writeFileSync(join(sourceDir, "onboarding-frame-figma.png"), framePng);

  const meta = await sharp(framePng).metadata();
  const scaleX = meta.width / 393;
  const scaleY = meta.height / 852;

  const heroBuffer = await sharp(framePng)
    .extract({
      left: Math.round(ONBOARDING_CROP.left * scaleX),
      top: Math.round(ONBOARDING_CROP.top * scaleY),
      width: Math.round(ONBOARDING_CROP.width * scaleX),
      height: Math.round(ONBOARDING_CROP.height * scaleY),
    })
    .png()
    .toBuffer();

  writeFileSync(join(assetsDir, "onboarding-hero.png"), heroBuffer);

  const hero2xBuffer = await sharp(heroBuffer)
    .resize(680, 394, { fit: "inside" })
    .png()
    .toBuffer();
  writeFileSync(join(assetsDir, "onboarding-hero@2x.png"), hero2xBuffer);
}

async function main() {
  console.log("Downloading Figma logo SVG…");
  const logoBytes = await download(FIGMA.logoSvg);
  const logoSvg = logoBytes.toString("utf8");

  console.log("Downloading onboarding frame PNG…");
  const framePng = await download(FIGMA.onboardingFramePng);

  console.log("Generating icon / splash / favicon…");
  await exportBrandIcons(logoSvg);

  console.log("Cropping onboarding illustration…");
  await exportOnboardingHero(framePng);

  console.log("Done. Assets written to assets/images/ and assets/source/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
