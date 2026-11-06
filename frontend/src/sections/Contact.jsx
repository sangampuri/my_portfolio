import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Envelope from "../components/Envelope";
import { sendContact } from "../services/api";
import { usePortfolio } from "../context/PortfolioData";


const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : null);
const strip = (u) => (u || "").replace(/^https?:\/\//i, "").replace(/\/$/, "");

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your name (2+ characters).";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email.";
  if (v.subject.trim().length < 3) e.subject = "Subject needs 3+ characters.";
  if (v.message.trim().length < 10) e.message = "Message needs 10+ characters.";
  return e;
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.25em] text-muted">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-hot">{error}</span>}
    </label>
  );
}

const inputCls =
  "mt-2 w-full bg-bg2 border border-white/10 px-4 py-3 text-text placeholder:text-muted/50 outline-none focus:border-electric focus:shadow-[0_0_0_1px_#00D9FF] transition";

export default function Contact() {
    const { profile } = usePortfolio();
const contactLinks = [
  { label: "EMAIL", href: profile.email ? `mailto:${profile.email}` : null, display: profile.email },
  { label: "GITHUB", href: safeUrl(profile.github_url), display: strip(profile.github_url) },
  { label: "LINKEDIN", href: safeUrl(profile.linkedin_url), display: strip(profile.linkedin_url) },
];
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [notice, setNotice] = useState("");

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    if (values.website) return; // honeypot: bots fill this, humans never see it

    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    setNotice("");
    try {
      await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
      });
      setStatus("success");
      setNotice("Message received. Thank you, I will reply soon.");
      setValues(EMPTY);
    } catch (err) {
      setStatus("error");
      if (err.status === 400 && err.fields) {
        const fe = {};
        Object.entries(err.fields).forEach(([k, msg]) => {
          fe[k] = Array.isArray(msg) ? msg[0] : String(msg);
        });
        setErrors(fe);
        setNotice("Please fix the highlighted fields.");
      } else if (err.status === 429) {
        setNotice("Too many messages. Try again later.");
      } else {
        setNotice("Could not reach the server. Message was NOT sent. Try again later.");
      }
    }
  }

  return (
    <section id="contact" className="px-5 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHeading num="08" label="CONTACT" title="LET'S BUILD SOMETHING EXTRAORDINARY." />

          <Envelope open={status === "success"} />

          <ul className="mt-14 space-y-3">
            {contactLinks.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-card border border-white/10 px-4 py-3 hover:border-electric transition-colors"
                  >
                    <span className="font-mono text-[11px] tracking-[0.25em] text-electric">{c.label}</span>
                    <span className="text-sm text-muted">{c.display}</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-between border border-dashed border-white/15 px-4 py-3 opacity-60">
                    <span className="font-mono text-[11px] tracking-[0.25em] text-muted">{c.label}</span>
                    <span className="font-mono text-[11px] text-muted">ADD IN data/contact.js</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="lg:col-span-7" y={48}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-card border border-white/10 p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] space-y-6"
            style={{ borderTop: "2px solid #9D4EDD" }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="NAME" error={errors.name}>
                <input name="name" value={values.name} onChange={onChange} className={inputCls} placeholder="Your name" autoComplete="name" />
              </Field>
              <Field label="EMAIL" error={errors.email}>
                <input name="email" type="email" value={values.email} onChange={onChange} className={inputCls} placeholder="you@example.com" autoComplete="email" />
              </Field>
            </div>

            <Field label="SUBJECT" error={errors.subject}>
              <input name="subject" value={values.subject} onChange={onChange} className={inputCls} placeholder="What is this about?" />
            </Field>

            <Field label="MESSAGE" error={errors.message}>
              <textarea name="message" rows={6} value={values.message} onChange={onChange} className={`${inputCls} resize-y`} placeholder="Tell me about your idea..." />
            </Field>

            {/* honeypot */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-3 bg-electric text-bg font-display font-bold text-sm tracking-widest px-8 py-4 [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)] hover:bg-cyan transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
              <Send size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div aria-live="polite">
              <AnimatePresence>
                {notice && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-2 text-sm px-4 py-3 border ${
                      status === "success"
                        ? "border-cyan/60 text-cyan"
                        : "border-hot/60 text-hot"
                    }`}
                  >
                    {status === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}