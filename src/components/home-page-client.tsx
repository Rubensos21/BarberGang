"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { BookingModal } from "@/components/booking-modal";
import { SiteHeader } from "@/components/site-header";
import {
  barbers,
  businessInfo,
  haircutLooks,
  services,
  testimonials,
} from "@/data/site";
import {
  Heart,
  MapPinned,
  Phone,
  Star,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Navigation,
  Calendar,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ─── constants ─── */
const MAPS_URL = "https://maps.app.goo.gl/KUrLGuDRvqoC4rxEA";
const REVIEWS_URL =
  "https://www.google.com/maps/place/Barber+Gang+MX/@20.5414736,-97.4489394,18z/data=!4m8!3m7!1s0x85da6b0326c61be7:0x76e9f930ee70cdc9!8m2!3d20.5416029!4d-97.4490041!9m1!1b1!16s%2Fg%2F11tnc0xt_f?authuser=0&hl=es-419&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";
const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d942.1299!2d-97.4490041!3d20.5416029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85da6b0326c61be7%3A0x76e9f930ee70cdc9!2sBarber%20Gang%20MX!5e0!3m2!1ses-419!2smx!4v1717700000000!5m2!1ses-419!2smx";
const PHONE = "7821724914";
const WHATSAPP_URL = `https://wa.me/52${PHONE}?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20Barber%20Gang%20MX`;

/* ─── scroll-reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.delay ?? 0);
            setTimeout(() => el.classList.add("is-visible"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── sub-components ─── */
function CustomSmiley({
  variant = "smile",
}: {
  variant?: "smile" | "lightning";
}) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <circle
        cx="120"
        cy="120"
        r="96"
        fill="none"
        stroke="#a3ff00"
        strokeWidth="16"
      />
      {variant === "lightning" ? (
        <>
          <path
            d="M85 78 L112 28 L100 78 L130 78 L104 136 L118 86 L88 86 Z"
            fill="#a3ff00"
          />
          <path
            d="M156 78 L182 28 L170 78 L200 78 L174 136 L188 86 L158 86 Z"
            fill="#a3ff00"
          />
        </>
      ) : (
        <>
          <circle cx="90" cy="92" r="10" fill="#a3ff00" />
          <circle cx="150" cy="92" r="10" fill="#a3ff00" />
        </>
      )}
      <path
        d="M66 148 C86 178, 154 178, 174 148"
        fill="none"
        stroke="#a3ff00"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TornDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`relative h-14 overflow-hidden ${dark ? "bg-black" : "bg-[#efefeb]"}`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0 38 C70 20 140 70 210 48 C285 20 350 68 420 44 C500 18 560 78 630 50 C700 24 765 70 840 46 C915 20 980 68 1050 40 C1120 16 1160 48 1200 28 L1200 120 L0 120 Z"
          fill={dark ? "#efefeb" : "#050505"}
        />
      </svg>
    </div>
  );
}

/* ticker strip */
const TICKER_ITEMS = [
  "BUZZ CUT",
  "FADE",
  "MOHICANO",
  "MULLET",
  "UNDERCUT",
  "MILITAR",
  "BARBA",
  "DISEÑO",
];

function TickerStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden border-y border-neon/20 bg-black py-3">
      <div className="flex animate-tickerScroll whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-6 text-[11px] font-black uppercase tracking-[0.36em] text-neon/60"
          >
            {item} <span className="text-white/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ─── */
export default function HomePageClient() {
  useScrollReveal();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="bg-bg text-white">
      <SiteHeader onBooking={() => setBookingOpen(true)} />

      <main id="inicio">
        {/* ══════════════ HERO ══════════════ */}
        <section className="relative overflow-hidden bg-mesh-street">
          <div className="absolute inset-0 bg-grain bg-[length:24px_24px] opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.2),transparent_35%)]" />

          <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-6">
            {/* left – text */}
            <div className="relative z-10 max-w-3xl">
              <div className="hero-text hero-d1 mb-6 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-neon shadow-neon">
                <Sparkles size={14} />
                Barbería premium urbana en Poza Rica, Veracruz
              </div>
              <h1 className="hero-text hero-d2 font-display text-6xl font-black uppercase leading-none tracking-[0.08em] text-white md:text-8xl">
                Barber Gang MX
              </h1>
              <p className="hero-text hero-d3 mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                Corte de alto nivel, energía callejera y una experiencia premium
                con estética graffiti/grunge diseñada para destacar en cada
                detalle.
              </p>
              <div className="hero-text hero-d4 mt-8 flex flex-wrap items-center gap-4">
                <Button onClick={() => setBookingOpen(true)}>
                  Agendar Cita
                </Button>
                <a
                  href="#cortes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white/80 transition hover:border-neon hover:text-neon"
                >
                  Ver cortes <ArrowRight size={16} />
                </a>
              </div>
              <div className="hero-text hero-d5 mt-8 flex items-center gap-6 text-sm text-white/50">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-neon"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <span>·</span>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 transition hover:text-neon"
                >
                  <Phone size={16} /> {businessInfo.phone}
                </a>
              </div>
            </div>

            {/* right – hero card */}
            <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center">
              <div className="absolute left-0 top-8 h-64 w-64 rounded-full bg-neon/15 blur-[80px]" />
              <div className="absolute right-6 top-0 h-72 w-72 rounded-full bg-cyan/20 blur-[90px]" />
              <div className="animate-floaty relative h-[520px] w-full rounded-[2.4rem] border border-white/10 bg-black/35 p-5 shadow-[0_0_50px_rgba(0,0,0,.45)] backdrop-blur-sm">
                <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(10,10,20,.9),rgba(26,15,37,.7))] p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">
                    <span>Ambiente callejero</span>
                    <span className="animate-borderPulse text-neon">
                      Abierto 10:00 – 21:00
                    </span>
                  </div>
                  <div className="grid place-items-center gap-6">
                    <div className="h-44 w-44 drop-shadow-[0_0_30px_rgba(163,255,0,.22)]">
                      <CustomSmiley variant="lightning" />
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-center">
                      <p className="font-display text-3xl uppercase tracking-[0.26em] text-white">
                        Barber Gang
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/55">
                        Precisión graffiti / cortes premium
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Bitácora neón</span>
                    <span className="inline-flex items-center gap-2 text-neon">
                      <Heart size={14} /> 4.8/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ticker */}
        <TickerStrip />

        <TornDivider />

        {/* ══════════════ CATÁLOGO DE CORTES ══════════════ */}
        <section
          id="cortes"
          className="bg-[#efefeb] px-4 py-20 text-black md:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <div
              data-reveal
              className="mb-10 flex items-end justify-between gap-6"
            >
              <div>
                <p className="font-display text-4xl font-black uppercase tracking-[0.18em] md:text-6xl">
                  Catálogo de cortes
                </p>
                <p className="mt-3 max-w-2xl text-sm text-black/65 md:text-base">
                  Referencias visuales para elegir el estilo urbano con el que
                  quieres salir de la silla.
                </p>
              </div>
              <button
                onClick={() => setBookingOpen(true)}
                className="hidden shrink-0 items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-neon hover:text-black md:inline-flex"
              >
                <Calendar size={15} /> Agendar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {haircutLooks.map((look, index) => (
                <div
                  key={look.name}
                  data-reveal="scale"
                  data-delay={index * 80}
                  className="group"
                >
                  <Card className="relative overflow-hidden border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,.18)]">
                    <CardBody className="p-4">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#171717,#4a4a4a)] text-white">
                        <Image
                          src={look.image}
                          alt={look.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* shine sweep */}
                        <div className="shine-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-sm">
                          {look.name}
                        </div>
                        <div className="absolute inset-x-0 bottom-6 flex justify-center">
                          <button
                            onClick={() => setBookingOpen(true)}
                            className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] backdrop-blur-sm transition hover:border-neon hover:bg-neon/20 hover:text-neon"
                          >
                            Elegir este estilo
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>

            {/* services panel */}
            <div
              data-reveal
              className="mt-8 grid gap-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,.08)] md:grid-cols-2"
            >
              <div>
                <p className="font-display text-3xl uppercase tracking-[0.2em]">
                  Menú de servicios
                </p>
                <p className="mt-3 text-sm text-black/65">
                  Desde el clásico corte y diseño hasta tintura, barba y
                  tratamientos capilares.
                </p>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white transition hover:bg-neon hover:text-black"
                >
                  <Calendar size={15} /> Reservar servicio
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setBookingOpen(true)}
                    className="rounded-[1.1rem] border border-black/10 bg-black/5 px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:border-black/30 hover:bg-black hover:text-neon"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TornDivider dark />

        {/* ══════════════ BARBEROS ══════════════ */}
        <section id="barbers" className="bg-black px-4 py-20 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div
              data-reveal
              className="mb-8 flex items-center justify-between rounded-[2rem] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] px-6 py-5 shadow-[0_0_40px_rgba(0,0,0,.4)]"
            >
              <p className="font-display text-4xl font-black uppercase tracking-[0.2em] text-white md:text-6xl">
                Conoce a Nuestros Barberos
              </p>
              <button
                onClick={() => setBookingOpen(true)}
                className="hidden shrink-0 items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-neon transition hover:bg-neon hover:text-black md:inline-flex"
              >
                <Calendar size={15} /> Agendar
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {barbers.map((barber, index) => (
                <div
                  key={barber.name}
                  data-reveal
                  data-delay={index * 90}
                  className="group"
                >
                  <Card className="overflow-hidden border-white/10 bg-[#f1f1ed] text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(163,255,0,.4),0_20px_40px_rgba(0,0,0,.35)]">
                    <CardBody className="p-4">
                      <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan/40 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.04),0_0_30px_rgba(24,227,255,.15)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(24,227,255,.25),transparent_35%),radial-gradient(circle_at_70%_75%,rgba(163,255,0,.18),transparent_30%)]" />
                        <div className="relative aspect-[4/5]">
                          {barber.image ? (
                            <Image
                              src={barber.image}
                              alt={barber.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#111,#303030)] text-white">
                              <div className="text-center">
                                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-neon/35 bg-black/45 text-5xl font-black text-neon shadow-neon">
                                  A
                                </div>
                                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.36em] text-white/65">
                                  Disponible en sucursal
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3 rounded-[1.2rem] border border-black/10 bg-white px-4 py-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neon text-lg font-black text-black transition group-hover:scale-110">
                          →
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">
                            Barber
                          </p>
                          <p className="text-xl font-black uppercase tracking-[0.12em]">
                            {barber.name}
                          </p>
                        </div>
                        <button
                          onClick={() => setBookingOpen(true)}
                          className="rounded-full border border-black/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/60 transition hover:border-neon hover:bg-neon hover:text-black"
                        >
                          Agendar
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>

            {/* barbers CTA */}
            <div data-reveal className="mt-10 text-center">
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-[0.26em] text-white/80 transition hover:border-neon hover:bg-neon hover:text-black"
              >
                <Calendar size={16} /> Reserva tu turno ahora
              </button>
            </div>
          </div>
        </section>

        <TornDivider />

        {/* ══════════════ ENCUÉNTRANOS / RESEÑAS ══════════════ */}
        <section
          id="horarios"
          className="bg-[#efefeb] px-4 py-20 text-black md:px-6"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT CARD – map + info */}
            <div data-reveal="left">
              <Card className="overflow-hidden border-black/10 bg-[#111] text-white">
                <CardBody className="p-0">
                  <div className="grid min-h-[460px] lg:grid-cols-2">
                    {/* Google Maps embed */}
                    <div className="relative overflow-hidden bg-[#0d0d0d]">
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-neon/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-neon backdrop-blur-sm">
                        Ubicación
                      </div>
                      <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm transition hover:text-neon"
                      >
                        <ExternalLink size={11} /> Ver en Maps
                      </a>
                      <iframe
                        src={MAPS_EMBED}
                        className="h-full min-h-[260px] w-full lg:min-h-full"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Barber Gang MX en Google Maps"
                      />
                    </div>

                    {/* Info panel */}
                    <div className="relative flex flex-col justify-between bg-black p-8">
                      <div className="absolute right-6 top-6 h-36 w-36 animate-pulseGlow opacity-80">
                        <CustomSmiley variant="smile" />
                      </div>

                      <div>
                        <p className="font-display text-4xl font-black uppercase tracking-[0.2em] text-white md:text-5xl">
                          Encuéntranos
                        </p>

                        <div className="mt-6 space-y-4">
                          {/* Clickable address */}
                          <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 text-white/75 transition hover:text-neon"
                          >
                            <MapPinned
                              className="mt-0.5 shrink-0 text-neon"
                              size={18}
                            />
                            <span className="group-hover:underline">
                              {businessInfo.address}
                            </span>
                            <ExternalLink
                              size={13}
                              className="mt-1 shrink-0 opacity-50"
                            />
                          </a>

                          {/* Clickable phone */}
                          <a
                            href={`tel:${PHONE}`}
                            className="group flex items-center gap-3 text-white/75 transition hover:text-neon"
                          >
                            <Phone className="shrink-0 text-neon" size={18} />
                            <span className="group-hover:underline">
                              {businessInfo.phone}
                            </span>
                          </a>

                          <p className="flex items-start gap-3 text-white/75">
                            <Sparkles
                              className="mt-0.5 shrink-0 text-neon"
                              size={18}
                            />
                            Plus Code: {businessInfo.plusCode}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-6 space-y-3">
                        <div className="flex gap-3">
                          <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-neon/30 bg-neon/10 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-neon transition hover:bg-neon hover:text-black"
                          >
                            <Navigation size={14} /> Cómo llegar
                          </a>
                          <a
                            href={`tel:${PHONE}`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-white/15 bg-white/5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/80 transition hover:border-neon hover:text-neon"
                          >
                            <Phone size={14} /> Llamar
                          </a>
                        </div>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-[1.1rem] border border-white/10 bg-white/5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/70 transition hover:border-[#25d366]/50 hover:bg-[#25d366]/10 hover:text-[#25d366]"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>

                        {/* schedule cards */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[1.2rem] border border-neon/30 bg-neon/10 px-4 py-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-neon">
                              Horario
                            </p>
                            <p className="mt-2 text-sm font-bold text-white">
                              {businessInfo.hours}
                            </p>
                            <p className="text-sm text-white/75">
                              {businessInfo.closed}
                            </p>
                          </div>
                          <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan">
                              Contacto rápido
                            </p>
                            <a
                              href={`tel:${PHONE}`}
                              className="mt-2 block text-xl font-black tracking-[0.14em] text-white transition hover:text-neon"
                            >
                              {businessInfo.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* RIGHT CARD – reviews */}
            <div data-reveal="right">
              <Card className="border-black/10 bg-white text-black">
                <CardBody>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-4xl uppercase tracking-[0.18em]">
                        Reseñas de Google
                      </p>
                      <p className="mt-1 text-sm text-black/60">
                        4.8/5 basado en 74 reseñas
                      </p>
                    </div>

                    {/* clickable 74 opiniones */}
                    <a
                      href={REVIEWS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group shrink-0 rounded-full border border-black/10 bg-black px-4 py-3 text-white transition hover:border-neon hover:shadow-neon"
                    >
                      <div className="flex items-center gap-1 text-neon">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                      </div>
                      <p className="mt-1 text-center text-xs font-bold uppercase tracking-[0.22em] group-hover:text-neon">
                        74 opiniones
                      </p>
                    </a>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {testimonials.map((review) => (
                      <div
                        key={review}
                        className="rounded-[1.4rem] border border-black/10 bg-[#f6f6f2] p-5 shadow-[0_8px_30px_rgba(0,0,0,.05)]"
                      >
                        <div className="flex items-center gap-1 text-neon">
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                        </div>
                        <p className="mt-3 text-sm leading-7 text-black/75">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* see all reviews */}
                  <a
                    href={REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 rounded-[1.2rem] border border-black/10 bg-black/5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black/70 transition hover:border-black/30 hover:bg-black hover:text-neon"
                  >
                    <ExternalLink size={15} /> Ver todas las reseñas
                  </a>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-white/10 bg-black px-4 py-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <p className="font-display text-lg font-black uppercase tracking-[0.3em] text-white">
              Barber Gang MX
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60 transition hover:border-neon hover:text-neon"
              >
                <Phone size={13} /> Llamar
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60 transition hover:border-[#25d366]/60 hover:text-[#25d366]"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60 transition hover:border-neon hover:text-neon"
              >
                <MapPinned size={13} /> Mapa
              </a>
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:scale-[1.03]"
              >
                <Calendar size={13} /> Agendar Cita
              </button>
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/35">
              Poza Rica, Veracruz
            </p>
          </div>
        </div>
      </footer>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
