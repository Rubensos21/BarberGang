"use client";

import { Button } from "@/components/ui/button";
import { services, barbers, businessInfo } from "@/data/site";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BookingState = {
  service: string;
  barber: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
};

type Appointment = {
  id: string;
  barber_id: string | null;
  appointment_date: string;
  status: string;
};

const initialState: BookingState = {
  service: "",
  barber: "",
  date: "",
  time: "",
  client_name: "",
  client_phone: "",
};

function buildTimeSlots(date: string, existingAppointments: Appointment[], selectedBarber: string) {
  if (!date) return [] as string[];
  const selected = new Date(`${date}T00:00:00`);
  if (selected.getDay() === 0) return [] as string[];

  const slots: string[] = [];
  for (let hour = 10; hour <= 20; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    if (hour < 20) slots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  let availableSlots = slots;
  if (date === today) {
    availableSlots = slots.filter((slot) => {
      const [hour, minute] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(hour, minute, 0, 0);
      return slotDate.getTime() > now.getTime();
    });
  }

  // Filter out slots already taken by the selected barber (excluding cancelled ones)
  if (selectedBarber) {
    const takenSlots = existingAppointments
      .filter(apt => apt.barber_id === selectedBarber && apt.status !== "cancelled")
      .map(apt => {
        const aptDate = new Date(apt.appointment_date);
        // Convert to same date string as form.date to compare only the time
        const aptDateStr = aptDate.toISOString().slice(0, 10);
        if (aptDateStr === date) {
          return aptDate.toTimeString().slice(0, 5);
        }
        return null;
      })
      .filter(Boolean) as string[];

    availableSlots = availableSlots.filter(slot => !takenSlots.includes(slot));
  }

  return availableSlots;
}

export function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<BookingState>(initialState);
  const [succeeded, setSucceeded] = useState(false);
  const [savedForm, setSavedForm] = useState<BookingState>(initialState);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch existing appointments
  useEffect(() => {
    if (!supabase || !open) return;

    const fetchAppointments = async () => {
        if (!supabase) return;
        const { data } = await supabase
          .from("appointments")
          .select("id, barber_id, appointment_date, status");
        if (data) setAppointments(data as Appointment[]);
      };

    fetchAppointments();
  }, [open]);

  const timeSlots = useMemo(() => buildTimeSlots(form.date, appointments, form.barber), [form.date, appointments, form.barber]);

  if (!open) return null;

  function handleClose() {
    setSucceeded(false);
    onClose();
  }

  const canAdvance = [
    Boolean(form.service),
    Boolean(form.barber),
    Boolean(form.date && form.time),
    Boolean(form.client_name && form.client_phone),
  ];

  async function submitBooking() {
    if (!supabase) {
      setStatus(
        "Por el momento no podemos agendar tu cita. Contacta al negocio para agendar tu cita: 782 172 4914",
      );
      return;
    }

    // Validate name and phone
    if (!form.client_name.trim() || !form.client_phone.trim()) {
      setStatus("Por favor completa tu nombre y número de teléfono.");
      return;
    }

    setSaving(true);
    setStatus(null);

    const selectedService = services.find((item) => item.name === form.service);
    const selectedBarber = barbers.find((item) => item.name === form.barber);

    const appointmentDate = new Date(`${form.date}T${form.time}:00`);

    try {
      // First check if the slot is still available
      const { data: existingApts } = await supabase
        .from("appointments")
        .select("id, status")
        .eq("barber_id", form.barber)
        .eq("appointment_date", appointmentDate.toISOString());

      const isSlotTaken = existingApts?.some(apt => apt.status !== "cancelled");
      if (isSlotTaken) {
        setSaving(false);
        setStatus("Lo sentimos, este horario ya fue reservado. Por favor selecciona otro.");
        // Refresh appointments
        if (supabase) {
          const { data: refreshData } = await supabase
            .from("appointments")
            .select("id, barber_id, appointment_date, status");
          if (refreshData) setAppointments(refreshData as Appointment[]);
        }
        return;
      }

      const { error } = await supabase.from("appointments").insert({
        client_name: form.client_name.trim(),
        client_phone: form.client_phone.trim(),
        service_id: selectedService?.name,
        barber_id: selectedBarber?.name,
        appointment_date: appointmentDate.toISOString(),
      });

      setSaving(false);

      if (error) {
        setStatus(`Error al guardar la cita: ${error.message}`);
        return;
      }

      setSavedForm({ ...form });
      setSucceeded(true);
      setForm(initialState);
      setStep(0);
    } catch {
      setSaving(false);
      setStatus(
        "No se pudo conectar con el servidor. Verifica tu conexión o contacta al negocio: 782 172 4914",
      );
    }
  }

  const formattedDate =
    savedForm.date && savedForm.time
      ? new Date(`${savedForm.date}T${savedForm.time}`).toLocaleString(
          "es-MX",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          },
        )
      : "";

  const whatsappMessage = encodeURIComponent(
    `Hola! Acabo de agendar una cita en Barber Gang MX 💈\n\n📅 ${formattedDate}\n✂️ Servicio: ${savedForm.service}\n💈 Barber: ${savedForm.barber}\n👤 ${savedForm.client_name}\n📱 ${savedForm.client_phone}\n\nPor favor confirmar mi cita. ¡Gracias!`,
  );
  const whatsappUrl = `https://wa.me/52${businessInfo.phone.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0f] shadow-[0_0_60px_rgba(0,0,0,.6)] max-h-[90vh]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/15 p-2 text-white/80 transition hover:border-neon hover:text-neon"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {succeeded ? (
          <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
            <div className="animate-[scaleIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">
              <CheckCircle2 size={64} className="text-neon" />
            </div>

            <h2 className="font-display mt-6 text-3xl font-black uppercase tracking-[0.3em] text-white">
              ¡Cita Agendada!
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Tu reserva fue enviada exitosamente.
            </p>

            <div className="mt-6 w-full rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-left text-sm text-white/80">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-base">📅</span>
                  <span className="capitalize text-white">{formattedDate}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">✂️</span>
                  <span>
                    <span className="text-white/45">Servicio: </span>
                    <span className="text-white">{savedForm.service}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">💈</span>
                  <span>
                    <span className="text-white/45">Barber: </span>
                    <span className="text-white">{savedForm.barber}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base">👤</span>
                  <span className="text-white">{savedForm.client_name}</span>
                  <span className="text-base">📱</span>
                  <span className="text-white">{savedForm.client_phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] transition hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
              >
                <MessageCircle size={18} />
                Confirmar por WhatsApp
              </a>
              <button
                onClick={handleClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(163,255,0,.14),rgba(24,227,255,.18),rgba(255,0,110,.12))] px-6 py-5">
              <p className="font-display text-3xl font-black uppercase tracking-[0.3em] text-white">
                Agendar Cita
              </p>
              <p className="mt-2 text-sm text-white/70">
                Reserva tu turno con el estilo urbano de Barber Gang MX.
              </p>
            </div>

            <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-4 flex gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
                  {["Servicio", "Barber", "Fecha", "Datos"].map(
                    (label, index) => (
                      <span
                        key={label}
                        className={index === step ? "text-neon" : ""}
                      >
                        {label}
                      </span>
                    ),
                  )}
                </div>

                {step === 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {services.map((service) => (
                      <button
                        key={service.name}
                        className={`rounded-[1.4rem] border p-4 text-left transition ${form.service === service.name ? "border-neon bg-neon/10 text-white shadow-neon" : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"}`}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            service: service.name,
                          }))
                        }
                      >
                        <div className="text-sm font-black uppercase tracking-[0.18em]">
                          {service.name}
                        </div>
                        <div className="mt-2 text-xs text-white/60">
                          Duración estimada {service.duration} min
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {barbers.map((barber) => (
                      <button
                        key={barber.name}
                        className={`rounded-[1.4rem] border p-4 text-left transition ${form.barber === barber.name ? "border-cyan bg-cyan/10 text-white shadow-cyan" : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"}`}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            barber: barber.name,
                          }))
                        }
                      >
                        <div className="text-sm font-black uppercase tracking-[0.18em]">
                          {barber.name}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
                          Barbero de la casa
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                      Fecha
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={form.date}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          date: event.target.value,
                          time: "",
                        }))
                      }
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                    />
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                        Horario disponible
                      </label>
                      <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-auto pr-1">
                        {timeSlots.length ? (
                          timeSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  time: slot,
                                }))
                              }
                              className={`rounded-full border px-3 py-3 text-sm font-bold transition ${form.time === slot ? "border-neon bg-neon text-black" : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"}`}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-white/50">
                            {!form.barber ? "Primero selecciona un barbero" : "No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha o barbero."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={form.client_name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            client_name: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.client_phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            client_phone: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/50 px-4 py-4 text-white outline-none transition focus:border-neon"
                        placeholder="782 000 0000"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      setStep((current) => Math.max(0, current - 1))
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:border-white/30"
                    disabled={step === 0}
                  >
                    <ChevronLeft size={16} />
                    Atrás
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() =>
                        setStep((current) => Math.min(3, current + 1))
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black shadow-neon transition hover:scale-[1.01] disabled:opacity-50"
                      disabled={!canAdvance[step]}
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <Button onClick={submitBooking} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Confirmar cita
                    </Button>
                  )}
                </div>

                {status ? (
                  <p className="mt-4 text-sm text-white/70">{status}</p>
                ) : null}
              </div>

              <aside className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                <p className="font-black uppercase tracking-[0.22em] text-neon">
                  Resumen
                </p>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-white/45">Servicio</dt>
                    <dd className="text-white">
                      {form.service || "Pendiente"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Barber</dt>
                    <dd className="text-white">{form.barber || "Pendiente"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Fecha</dt>
                    <dd className="text-white">{form.date || "Pendiente"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/45">Hora</dt>
                    <dd className="text-white">{form.time || "Pendiente"}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
