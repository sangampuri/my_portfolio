import { useState } from "react";

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

export default function SkillIcon({ skill, size = 40 }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="font-mono font-bold text-electric" style={{ fontSize: size / 2 }}>
        {skill.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  const variant = skill.variant ?? "original";
  return (
    <img
      src={`${CDN}/${skill.icon}/${skill.icon}-${variant}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={skill.invert ? "invert" : ""}
    />
  );
}