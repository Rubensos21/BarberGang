"use client";

import { Button } from '@/components/ui/button';
import { services, barbers } from '@/data/site';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type BookingState = {
  service: string;
  barber: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
};

const initialState: BookingState = {
  service: '',
  barber: '',
  date: '',
  time: '',
  client_name: '',
  client_phone: ''
};

function buildTimeSlots(date: string) {
  if (!date) return [] as string[];
  const selected = new Date(`${date}T00:00:00`);
  if (selected.getDay() === 0) return [] as string[];

  const slots: string[] = [];
  for (let hour = 10; hour <= 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < 20) slots.push(`${String(hour).padStart(2, '0')}:30`);
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (date !== today) return slots;

  return slots.filter((slot) => {
    const [hour, minute] = slot.split(':').map(Number);
    const slotDate = new Date();
    slotDate.setHours(hour, minute, 0, 0);
    return slotDate.getTime() > now.getTime();
  });
}

export function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<BookingState>(initialState);

  const timeSlots = useMemo(() => buildTimeSlots(form.date), [form.date]);

  if (!open) return null;

  const canAdvance = [
    Boolean(form.service),
    Boolean(form.barber),
    Boolean(form.date && form.time),
    Boolean(form.client_name && form.client_phone)
  ];

  async function submitBooking() {
    if (!supabase) {
      setStatus('Faltan variables de Supabase. Configura el entorno para activar las citas.');
      return;
    }

    setSaving(true);
    setStatus(null);

    const selectedService = services.find((item) => item.name === form.service);
    const selectedBarber = barbers.find((item) => item.name === form.barber);

    const appointmentDate = new Date(`${form.date}T${form.time}:00`);

    const { error } = await supabase.from('appointments').insert({
      client_name: form.client_name,
      client_phone: form.client_phone,
      service_id: selectedService?.name,
      barber_id: selectedBarber?.name,
      appointment_date: appointmentDate.toISOString()
    });

    setSaving(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('Cita enviada. Te contactaremos para confirmar.');
    setForm(initialState);
    setStep(0);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0f] shadow-[0_0_60px_rgba(0,0,0,.6)]">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full border border-white/15 p-2 text-white/80 transition hover:border-neon hover:text-neon" aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(163,255,0,.14),rgba(24,227,255,.18),rgba(255,0,110,.12))] px-6 py-5">
          <p className="font-display text-3xl font-black uppercase tracking-[0.3em] text-white">Agendar Cita</p>
          <p className="mt-2 text-sm text-white/70">Reserva tu turno con el estilo urbano de Barber Gang MX.</p>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
              {['Servicio', 'Barber', 'Fecha', 'Datos'].map((label, index) => (
                <span key={label} className={index === step ? 'text-neon' : ''}>
                  {label}
                </span>
              ))}
            </div>

            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.name}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${form.service === service.name ? 'border-neon bg-neon/10 text-white shadow-neon' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30'}`}
                    onClick={() => setForm((current) => ({ ...current, service: service.name }))}
                  >
                    <div className="text-sm font-black uppercase tracking-[0.18em]">{service.name}</div>
                    <div className="mt-2 text-xs text-white/60">Duración estimada {service.duration} min</div>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {barbers.map((barber) => (
                  <button
                    key={barber.name}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${form.barber === barber.name ? 'border-cyan bg-cyan/10 text-white shadow-cyan' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30'}`}
                    onClick={() => setForm((current) => ({ ...current, barber: barber.name }))}
                  >
                    <div className="text-sm font-black uppercase tracking-[0.18em]">{barber.name}</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
                      Barbero de la casa
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">Fecha</label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, time: '' }))}
                  className="w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                />
                <div>
                  <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">Horario disponible</label>
                  <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-auto pr-1">
                    {timeSlots.length ? timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setForm((current) => ({ ...current, time: slot }))}
                        className={`rounded-full border px-3 py-3 text-sm font-bold transition ${form.time === slot ? 'border-neon bg-neon text-black' : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'}`}
                      >
                        {slot}
                      </button>
                    )) : <p className="text-sm text-white/50">Selecciona una fecha válida sin domingo o prueba un horario distinto.</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">Nombre</label>
                  <input
                    value={form.client_name}
                    onChange={(event) => setForm((current) => ({ ...current, client_name: event.target.value }))}
                    className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">Teléfono</label>
                  <input
                    value={form.client_phone}
                    onChange={(event) => setForm((current) => ({ ...current, client_phone: event.target.value }))}
                    className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                    placeholder="782 000 0000"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:border-white/30"
                disabled={step === 0}
              >
                <ChevronLeft size={16} />
                Atrás
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep((current) => Math.min(3, current + 1))}
                  className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black shadow-neon transition hover:scale-[1.01] disabled:opacity-50"
                  disabled={!canAdvance[step]}
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              ) : (
                <Button onClick={submitBooking} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirmar cita
                </Button>
              )}
            </div>

            {status ? <p className="mt-4 text-sm text-white/70">{status}</p> : null}
          </div>

          <aside className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            <p className="font-black uppercase tracking-[0.22em] text-neon">Resumen</p>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-white/45">Servicio</dt>
                <dd className="text-white">{form.service || 'Pendiente'}</dd>
              </div>
              <div>
                <dt className="text-white/45">Barber</dt>
                <dd className="text-white">{form.barber || 'Pendiente'}</dd>
              </div>
              <div>
                <dt className="text-white/45">Fecha</dt>
                <dd className="text-white">{form.date || 'Pendiente'}</dd>
              </div>
              <div>
                <dt className="text-white/45">Hora</dt>
                <dd className="text-white">{form.time || 'Pendiente'}</dd>
              </div>
            </dl>
            <div className="mt-6 rounded-[1.2rem] border border-neon/30 bg-neon/10 p-4 text-white">
              <p className="font-bold uppercase tracking-[0.2em] text-neon">Supabase en tiempo real</p>
              <p className="mt-2 text-sm text-white/75">Las citas nuevas se enviarán a la tabla <span className="font-semibold">appointments</span>.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}