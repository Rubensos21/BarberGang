"use client";

import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { BookingModal } from '@/components/booking-modal';
import { SiteHeader } from '@/components/site-header';
import { barbers, businessInfo, haircutLooks, services, testimonials } from '@/data/site';
import { Heart, MapPinned, Phone, Star, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function CustomSmiley({ variant = 'smile' }: { variant?: 'smile' | 'lightning' }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <circle cx="120" cy="120" r="96" fill="none" stroke="#a3ff00" strokeWidth="16" />
      {variant === 'lightning' ? (
        <>
          <path d="M85 78 L112 28 L100 78 L130 78 L104 136 L118 86 L88 86 Z" fill="#a3ff00" />
          <path d="M156 78 L182 28 L170 78 L200 78 L174 136 L188 86 L158 86 Z" fill="#a3ff00" />
        </>
      ) : (
        <>
          <circle cx="90" cy="92" r="10" fill="#a3ff00" />
          <circle cx="150" cy="92" r="10" fill="#a3ff00" />
        </>
      )}
      <path d="M66 148 C86 178, 154 178, 174 148" fill="none" stroke="#a3ff00" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

function TornDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`relative h-14 overflow-hidden ${dark ? 'bg-black' : 'bg-[#efefeb]'}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M0 38 C70 20 140 70 210 48 C285 20 350 68 420 44 C500 18 560 78 630 50 C700 24 765 70 840 46 C915 20 980 68 1050 40 C1120 16 1160 48 1200 28 L1200 120 L0 120 Z"
          fill={dark ? '#efefeb' : '#050505'}
        />
      </svg>
    </div>
  );
}

export default function HomePageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="bg-bg text-white">
      <SiteHeader onBooking={() => setBookingOpen(true)} />

      <main id="inicio">
        <section className="relative overflow-hidden bg-mesh-street">
          <div className="absolute inset-0 bg-grain bg-[length:24px_24px] opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.2),transparent_35%)]" />
          <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-6">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-neon shadow-neon">
                <Sparkles size={14} />
                Barbería premium urbana en Poza Rica, Veracruz
              </div>
              <h1 className="font-display text-6xl font-black uppercase leading-none tracking-[0.08em] text-white md:text-8xl">
                Barber Gang MX
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                Corte de alto nivel, energía callejera y una experiencia premium con estética graffiti/grunge diseñada para destacar en cada detalle.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button onClick={() => setBookingOpen(true)}>Agendar Cita</Button>
                <a href="#barbers" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white/80 transition hover:border-neon hover:text-neon">
                  Conoce al equipo <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center">
              <div className="absolute left-0 top-8 h-64 w-64 rounded-full bg-neon/15 blur-[80px]" />
              <div className="absolute right-6 top-0 h-72 w-72 rounded-full bg-cyan/20 blur-[90px]" />
              <div className="relative h-[520px] w-full rounded-[2.4rem] border border-white/10 bg-black/35 p-5 shadow-[0_0_50px_rgba(0,0,0,.45)] backdrop-blur-sm">
                <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(10,10,20,.9),rgba(26,15,37,.7))] p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">
                    <span>Ambiente callejero</span>
                    <span className="text-neon">Abierto 10:00 - 21:00</span>
                  </div>
                  <div className="grid place-items-center gap-6">
                    <div className="h-44 w-44 drop-shadow-[0_0_30px_rgba(163,255,0,.22)]">
                      <CustomSmiley variant="lightning" />
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-center">
                      <p className="font-display text-3xl uppercase tracking-[0.26em] text-white">Barber Gang</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/55">Precisión graffiti / cortes premium</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Bitácora neón</span>
                    <span className="inline-flex items-center gap-2 text-neon"><Heart size={14} /> 4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TornDivider />

        <section id="cortes" className="bg-[#efefeb] px-4 py-20 text-black md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-display text-4xl font-black uppercase tracking-[0.18em] md:text-6xl">Catálogo de cortes</p>
                <p className="mt-3 max-w-2xl text-sm text-black/65 md:text-base">Referencias visuales para elegir el estilo urbano con el que quieres salir de la silla.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {haircutLooks.map((look, index) => (
                <Card key={look} className={`relative overflow-hidden border-black/10 bg-white ${index % 2 === 0 ? 'md:col-span-1' : ''}`}>
                  <CardBody className="p-4">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#171717,#4a4a4a)] p-4 text-white">
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,.2) 0, transparent 65%)' }} />
                      <div className="absolute left-3 top-3 rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">{look}</div>
                      <div className="absolute inset-x-0 bottom-6 flex justify-center">
                        <div className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em]">Estilo urbano</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,.08)] md:grid-cols-2">
              <div>
                <p className="font-display text-3xl uppercase tracking-[0.2em]">Menú de servicios</p>
                <p className="mt-3 text-sm text-black/65">Diseño limpio, textura editorial y energía de calle sobre collage periodístico y bordes rasgados.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service.name} className="rounded-[1.1rem] border border-black/10 bg-black/5 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black">
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TornDivider dark />

        <section id="barbers" className="bg-black px-4 py-20 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] px-6 py-5 shadow-[0_0_40px_rgba(0,0,0,.4)]">
              <p className="font-display text-4xl font-black uppercase tracking-[0.2em] text-white md:text-6xl">Conoce a Nuestros Barberos</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {barbers.map((barber) => (
                <Card key={barber.name} className="overflow-hidden border-white/10 bg-[#f1f1ed] text-black">
                  <CardBody className="p-4">
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan/40 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.04),0_0_30px_rgba(24,227,255,.15)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(24,227,255,.25),transparent_35%),radial-gradient(circle_at_70%_75%,rgba(163,255,0,.18),transparent_30%)]" />
                      <div className="relative aspect-[4/5]">
                        {barber.image ? (
                          <Image src={barber.image} alt={barber.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#111,#303030)] text-white">
                            <div className="text-center">
                              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-neon/35 bg-black/45 text-5xl font-black text-neon shadow-neon">
                                A
                              </div>
                              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.36em] text-white/65">Disponible en sucursal</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 rounded-[1.2rem] border border-black/10 bg-white px-4 py-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-neon text-lg font-black text-black">→</div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">Barber</p>
                        <p className="text-xl font-black uppercase tracking-[0.12em]">{barber.name}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <TornDivider />

        <section id="horarios" className="bg-[#efefeb] px-4 py-20 text-black md:px-6">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="overflow-hidden border-black/10 bg-[#111] text-white">
              <CardBody className="p-0">
                <div className="grid min-h-[460px] lg:grid-cols-2">
                  <div className="relative flex items-center justify-center bg-[#0d0d0d] p-6">
                    <div className="absolute left-6 top-6 rounded-full bg-neon/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-neon">Mapa conceptual</div>
                    <div className="relative h-72 w-72 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#1a1a1a,#080808)] p-6 shadow-[inset_0_0_120px_rgba(255,255,255,.04)]">
                      <div className="absolute left-14 top-20 h-40 w-[3px] rotate-12 bg-white/8" />
                      <div className="absolute left-44 top-14 h-56 w-[3px] -rotate-12 bg-white/8" />
                      <div className="absolute left-10 top-38 h-[3px] w-56 bg-white/8" />
                      <div className="absolute left-18 top-32 rounded-full border border-neon bg-[#050505] p-3 shadow-neon">
                        <div className="grid h-16 w-16 place-items-center rounded-full bg-neon text-2xl font-black text-black">B</div>
                      </div>
                      <div className="absolute bottom-10 left-8 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Av. 20 de Noviembre</div>
                      <div className="absolute right-6 top-8 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Calle 10</div>
                    </div>
                  </div>
                  <div className="relative flex flex-col justify-between bg-black p-8">
                    <div className="absolute right-6 top-6 h-44 w-44 animate-pulseGlow opacity-95">
                      <CustomSmiley variant="smile" />
                    </div>
                    <div>
                      <p className="font-display text-4xl font-black uppercase tracking-[0.2em] text-white md:text-5xl">Encuéntranos</p>
                      <div className="mt-6 space-y-4 text-white/75">
                        <p className="flex items-start gap-3"><MapPinned className="mt-1 text-neon" size={18} />{businessInfo.address}</p>
                        <p className="flex items-start gap-3"><Phone className="mt-1 text-neon" size={18} />{businessInfo.phone}</p>
                        <p className="flex items-start gap-3"><Sparkles className="mt-1 text-neon" size={18} />Plus Code: {businessInfo.plusCode}</p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-neon/30 bg-neon/10 px-4 py-4 text-black">
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-neon">Horario</p>
                        <p className="mt-2 text-sm font-bold text-white">{businessInfo.hours}</p>
                        <p className="text-sm text-white/75">{businessInfo.closed}</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-white">
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan">Contacto rápido</p>
                        <p className="mt-2 text-xl font-black tracking-[0.14em]">782 172 4914</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-black/10 bg-white text-black">
              <CardBody>
                <div className="flex items-center justify-between gap-4">
                  <div>
                      <p className="font-display text-4xl uppercase tracking-[0.18em]">Reseñas de Google</p>
                    <p className="mt-1 text-sm text-black/60">4.8/5 basado en 74 reseñas</p>
                  </div>
                  <div className="rounded-full border border-black/10 bg-black px-4 py-3 text-white">
                    <div className="flex items-center gap-1 text-neon">
                      <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                    </div>
                    <p className="mt-1 text-center text-xs font-bold uppercase tracking-[0.22em]">74 opiniones</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {testimonials.map((review) => (
                    <div key={review} className="rounded-[1.4rem] border border-black/10 bg-[#f6f6f2] p-5 shadow-[0_8px_30px_rgba(0,0,0,.05)]">
                      <div className="flex items-center gap-1 text-neon">
                        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-black/75">{review}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black px-4 py-8 text-center text-xs uppercase tracking-[0.28em] text-white/55 md:px-6">
        Barber Gang MX · Poza Rica, Veracruz · Cortes premium urbanos
      </footer>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}