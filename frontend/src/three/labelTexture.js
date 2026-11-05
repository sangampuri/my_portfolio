import * as THREE from "three";

export function makeLabelTexture(text, { fg = "#00D9FF", bg = "#10121C" } = {}) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 240, 240);
  ctx.fillStyle = fg;
  ctx.font = "bold 110px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = fg;
  ctx.shadowBlur = 24;
  ctx.fillText(text, 128, 138);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeScreenTexture() {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 360;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0b0d16";
  ctx.fillRect(0, 0, 640, 360);
  const lines = [
    ["#9D4EDD", "from django.db import models"],
    ["#A5A8B5", ""],
    ["#00D9FF", "class Project(models.Model):"],
    ["#F5F5F7", "    title = models.CharField()"],
    ["#F5F5F7", "    stack = models.JSONField()"],
    ["#A5A8B5", ""],
    ["#00F5D4", "def build(idea):"],
    ["#F5F5F7", "    return idea.ship()"],
    ["#FF2E93", "# build. learn. explore."],
  ];
  ctx.font = "22px monospace";
  lines.forEach(([color, text], i) => {
    ctx.fillStyle = color;
    ctx.fillText(text, 28, 50 + i * 34);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}