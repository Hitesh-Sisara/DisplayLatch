import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap center" style={{ position: "relative" }}>
        <p className="eyebrow">404</p>
        <h1 className="display">
          This page went <span className="accent">dark.</span>
        </h1>
        <p className="lede">Unlike your monitors, we can't bring it back. Try the home page or one of the guides.</p>
        <div className="btn-row">
          <Link className="btn btn-dark" href="/">Go home</Link>
          <Link className="btn btn-light" href="/control-external-monitor-brightness-mac/">Brightness guide</Link>
        </div>
      </div>
    </section>
  );
}
