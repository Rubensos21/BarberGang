"use client";

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  barber_id: string | null;
  service_id: string | null;
  created_at: string;
};

const password = process.env.NEXT_PUBLIC_AGENDA_PASSWORD ?? 'barbergang';

export default function AgendaPage() {
  const [authorized, setAuthorized] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const upcoming = useMemo(
    () => [...appointments].sort((a, b) => a.appointment_date.localeCompare(b.appointment_date)),
    [appointments]
  );

  useEffect(() => {
    if (!authorized || !supabase) return;

    let active = true;
    const client = supabase;

    if (!client) {
      return;
    }

    async function loadAppointments() {
      setLoading(true);
      const { data } = await client.from('appointments').select('*').order('appointment_date', { ascending: true });
      if (active) {
        setAppointments((data ?? []) as Appointment[]);
        setLoading(false);
      }
    }

    loadAppointments();

    const channel = client
      .channel('agenda-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        const next = payload.new as Appointment;
        setAppointments((current) => {
          const filtered = current.filter((item) => item.id !== next.id);
          return [next, ...filtered];
        });
      })
      .subscribe();

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [authorized]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center gap-3 text-neon">
            <Shield />
            <p className="font-black uppercase tracking-[0.24em]">Acceso al panel</p>
          </div>
          <p className="text-sm text-white/65">Ingresa la contraseña para abrir la agenda interna de Barber Gang MX.</p>
          <input value={attempt} onChange={(event) => setAttempt(event.target.value)} className="mt-5 w-full rounded-[1.2rem] border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-neon" placeholder="Contraseña" type="password" />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setAuthorized(attempt === password)}>Entrar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(163,255,0,.12),rgba(24,227,255,.08),rgba(255,255,255,.03))] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-black uppercase tracking-[0.28em] text-neon">Agenda Realtime</p>
              <h1 className="font-display mt-2 text-5xl uppercase tracking-[0.16em] md:text-7xl">Barber Gang MX</h1>
            </div>
            <div className="rounded-full border border-neon/30 bg-neon/10 px-4 py-3 text-sm font-black uppercase tracking-[0.22em] text-neon">
              {loading ? <Loader2 className="inline-block h-4 w-4 animate-spin" /> : <Sparkles className="inline-block h-4 w-4" />} Actualización en tiempo real
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {upcoming.map((appointment, index) => (
            <div key={appointment.id} className={`rounded-[1.4rem] border border-white/10 bg-white/5 p-5 transition ${index === 0 ? 'shadow-neon' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Nueva cita</p>
                  <p className="mt-2 text-2xl font-black uppercase tracking-[0.12em]">{appointment.client_name}</p>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{new Date(appointment.appointment_date).toLocaleString('es-MX')}</div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-3">
                <div className="rounded-[1rem] bg-black/40 p-4">Servicio: {appointment.service_id ?? 'Pendiente'}</div>
                <div className="rounded-[1rem] bg-black/40 p-4">Barber: {appointment.barber_id ?? 'Pendiente'}</div>
                <div className="rounded-[1rem] bg-black/40 p-4">Teléfono: {appointment.client_phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}