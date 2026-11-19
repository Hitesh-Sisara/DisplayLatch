"use client";

import { useState } from "react";
import { Check, Display, Displays, Laptop, Sun, SunLow } from "./icons";

type Screen = { id: string; name: string; sub: string; main?: boolean; builtin?: boolean; res: string };

const SCREENS: Screen[] = [
  { id: "mbp", name: "Built-in Display", sub: "MacBook Pro", builtin: true, res: "1512 × 982 HiDPI" },
  { id: "s27", name: "Studio 27 4K", sub: "ABC1234567", main: true, res: "2560 × 1440 HiDPI" },
  { id: "o24", name: "Office 24 FHD", sub: "XYZ7654321", res: "1920 × 1080" },
];

function Range({
  value,
  onChange,
  label,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="slider-row">
      <SunLow />
      <input
        className="range"
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        aria-label={label}
        style={{ ["--v" as string]: `${value}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}%</output>
    </div>
  );
}

/** Hero: a working replica of the DisplayLatch menu-bar popover. */
export function HeroPopover() {
  const [levels, setLevels] = useState<Record<string, number>>({ mbp: 62, s27: 70, o24: 55 });
  const [online, setOnline] = useState<Record<string, boolean>>({ mbp: true, s27: true, o24: true });
  const [keep, setKeep] = useState(true);

  const live = SCREENS.filter((s) => online[s.id]);
  const all = Math.round(live.reduce((n, s) => n + levels[s.id], 0) / Math.max(live.length, 1));
  const setAll = (v: number) =>
    setLevels((l) => Object.fromEntries(Object.entries(l).map(([k, x]) => [k, online[k] ? v : x])));

  return (
    <div className="stage" aria-label="Interactive preview of the DisplayLatch menu">
      <div className="menubar" aria-hidden>
        <span>Wed 9:41</span>
        <span className="mb-icon">
          <Displays />
        </span>
      </div>

      <div className="popover">
        {live.length > 1 && (
          <div className="pop-card all">
            <div className="pop-head">
              <Displays />
              <span className="pop-name">All displays</span>
              <span className="pop-sub">{live.length} screens</span>
            </div>
            <Range value={all} onChange={setAll} label="Brightness for all displays" />
          </div>
        )}
        {SCREENS.map((s) => (
          <div key={s.id} className={`pop-card${online[s.id] ? "" : " off"}`}>
            <div className="pop-head">
              {s.builtin ? <Laptop /> : <Display />}
              <span className="pop-name">{s.name}</span>
              {s.main && <span className="badge-m">M</span>}
              <span className="pop-sub">{s.sub}</span>
              {!s.builtin && (
                <button
                  type="button"
                  className="toggle"
                  role="switch"
                  aria-checked={online[s.id]}
                  aria-label={`Connect ${s.name}`}
                  onClick={() => setOnline((o) => ({ ...o, [s.id]: !o[s.id] }))}
                />
              )}
            </div>
            <Range
              value={levels[s.id]}
              disabled={!online[s.id]}
              label={`Brightness for ${s.name}`}
              onChange={(v) => setLevels((l) => ({ ...l, [s.id]: v }))}
            />
            <div className="pop-res">
              <span>{online[s.id] ? s.res : "Disconnected, still plugged in"}</span>
              <span>{s.builtin ? "Built-in" : "DDC/CI"}</span>
            </div>
          </div>
        ))}
        <div className="pop-foot">
          <button
            type="button"
            className="toggle"
            role="switch"
            aria-checked={keep}
            aria-label="Keep monitors connected"
            onClick={() => setKeep((k) => !k)}
          />
          Keep monitors connected
        </div>
      </div>

      <div className="chip c1">
        <span className="tick">
          <Check />
        </span>
        <span>
          <b>Reconnected</b>
          <small>after wake · 0.9 s</small>
        </span>
      </div>
      <div className="chip c2">
        <span className="tick">
          <Check />
        </span>
        <span>
          <b>Real backlight</b>
          <small>DDC/CI, no overlay</small>
        </span>
      </div>
      <div className="chip c3">
        <span className="tick">
          <Check />
        </span>
        <span>
          <b>Position restored</b>
          <small>same spot, every time</small>
        </span>
      </div>
    </div>
  );
}

/** Brightness section: the master slider drives every monitor preview. */
export function BrightnessDemo() {
  const [a, setA] = useState(80);
  const [b, setB] = useState(60);
  const [c, setC] = useState(70);
  const master = Math.round((a + b + c) / 3);
  const setMaster = (v: number) => {
    setA(v);
    setB(v);
    setC(v);
  };
  const dim = (v: number) => ({ filter: `brightness(${0.25 + (v / 100) * 0.85})` });

  return (
    <div className="panel warm">
      <div className="monitors">
        <div className="monitor">
          <div className="screen" style={dim(a)} />
          <div className="stand" />
          <div className="monitor-label">
            <b>Studio 27 4K</b>
            <span>{a}%</span>
          </div>
          <Range value={a} onChange={setA} label="Studio 27 brightness" />
        </div>
        <div className="monitor">
          <div className="screen b" style={dim(b)} />
          <div className="stand" />
          <div className="monitor-label">
            <b>Office 24 FHD</b>
            <span>{b}%</span>
          </div>
          <Range value={b} onChange={setB} label="Office 24 brightness" />
        </div>
      </div>
      <div className="monitor" style={{ marginTop: 16 }}>
        <div className="monitor-label" style={{ marginTop: 0, marginBottom: 8 }}>
          <b>MacBook Pro built-in</b>
          <span>{c}%</span>
        </div>
        <Range value={c} onChange={setC} label="Built-in display brightness" />
      </div>
      <div className="master">
        <label htmlFor="master-range">All displays</label>
        <div className="slider-row">
          <SunLow />
          <input
            id="master-range"
            className="range"
            type="range"
            min={0}
            max={100}
            value={master}
            style={{ ["--v" as string]: `${master}%` }}
            onChange={(e) => setMaster(Number(e.target.value))}
          />
          <Sun />
          <output>{master}%</output>
        </div>
      </div>
    </div>
  );
}
