"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  Check,
  CheckCheck,
  LogOut,
  MessageCircle,
  Phone,
  RotateCcw,
  Scissors,
  Sparkles,
  Trash2,
  User,
  UserX,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  barber_id: string | null;
  service_id: string | null;
  created_at: string;
  status?: string;
};

type Status = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
type Filter = "today" | "upcoming" | "all";

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const AGENDA_PIN = process.env.NEXT_PUBLIC_AGENDA_PIN ?? "1234";
const DELETED_KEY = "bg_deleted_ids";

function getDeletedIds(): Set<string> {
  try {
    return new Set<string>(
      JSON.parse(localStorage.getItem(DELETED_KEY) ?? "[]"),
    );
  } catch {
    return new Set();
  }
}

const FILTER_TABS: Array<{ key: Filter; label: string }> = [
  { key: "today", label: "Hoy" },
  { key: "upcoming", label: "Próximas" },
  { key: "all", label: "Todas" },
];

// ─────────────────────────────────────────────────────────
// Audio
// ─────────────────────────────────────────────────────────

function playDing(ctx: AudioContext | null) {
  if (!ctx) return;

  try {
    (
      [
        [0, 880],
        [0.18, 1108],
      ] as Array<[number, number]>
    ).forEach(([time, freq]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.22, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + time + 1.4,
      );
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 1.5);
    });
  } catch {
    // Web Audio not available — silent fail
  }
}

// ─────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

function isUpcoming(dateStr: string): boolean {
  const d = new Date(dateStr);
  const n = new Date();
  const tomorrow = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
  return d >= tomorrow;
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayInSpanish(): string {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────
// PIN Screen
// ─────────────────────────────────────────────────────────

function PinScreen({
  onUnlock,
  onInteract,
}: {
  onUnlock: () => void;
  onInteract: () => void;
}) {
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  const handleKey = useCallback(
    (key: string) => {
      if (shake) return;

      onInteract();

      if (key === "back") {
        setDigits((d) => d.slice(0, -1));
        return;
      }

      if (digits.length >= 4) return;

      const next = [...digits, key];
      setDigits(next);

      if (next.length === 4) {
        if (next.join("") === AGENDA_PIN) {
          sessionStorage.setItem("bg_agenda_auth", "1");
          onUnlock();
        } else {
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setDigits([]);
          }, 600);
        }
      }
    },
    [digits, shake, onUnlock, onInteract],
  );

  const PAD_KEYS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "",
    "0",
    "back",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">
      {/* Logo */}
      <div className="mb-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-white/35">
          Panel Admin
        </p>
        <h1 className="mt-2 font-black text-4xl uppercase tracking-[0.18em]">
          Barber Gang <span className="text-neon">MX</span>
        </h1>
        <p className="mt-3 text-xs text-white/30 tracking-widest uppercase">
          Ingresa tu PIN
        </p>
      </div>

      {/* 4-dot indicator */}
      <div className={`mb-10 flex gap-5 ${shake ? "shake" : ""}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-4 w-4 rounded-full transition-all duration-150",
              i < digits.length
                ? "bg-neon shadow-neon scale-110"
                : "bg-white/15",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid w-72 grid-cols-3 gap-3">
        {PAD_KEYS.map((key, i) => {
          if (key === "") return <div key={i} />;

          if (key === "back") {
            return (
              <button
                key={i}
                onClick={() => handleKey("back")}
                aria-label="Borrar"
                className="flex h-16 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white/50 transition active:scale-95 active:bg-white/15 hover:border-white/20 hover:text-white/80"
              >
                ⌫
              </button>
            );
          }

          return (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className="flex h-16 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-bold transition active:scale-95 active:bg-neon active:text-black active:border-neon hover:border-white/20"
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Appointment Card
// ─────────────────────────────────────────────────────────

interface AppointmentCardProps {
  apt: Appointment;
  status: Status;
  isNew: boolean;
  onSetStatus: (id: string, status: Status) => void;
  onReschedule: (id: string, date: string, time: string) => void;
  onDelete: (id: string) => void;
}

function AppointmentCard({
  apt,
  status,
  isNew,
  onSetStatus,
  onReschedule,
  onDelete,
}: AppointmentCardProps) {
  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const past = isPast(apt.appointment_date);
  const isDone =
    status === "completed" || status === "no_show" || status === "cancelled";

  const statusBadgeClass: Record<Status, string> = {
    pending: "border-yellow-400/40 bg-yellow-400/15 text-yellow-300 shadow-sm",
    confirmed: "border-neon/40      bg-neon/15       text-neon shadow-neon/20",
    cancelled: "border-red-500/40   bg-red-500/15    text-red-400 shadow-sm",
    completed: "border-green-400/40 bg-green-400/15 text-green-400 shadow-sm",
    no_show: "border-orange-400/40 bg-orange-400/15 text-orange-400 shadow-sm",
  };
  const statusLabel: Record<Status, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Terminada",
    no_show: "No se presentó",
  };

  const cleanPhone = apt.client_phone?.replace(/\D/g, "") ?? "";
  const waText = encodeURIComponent(
    `Hola ${apt.client_name}, te confirmamos tu cita en Barber Gang MX el ${formatDateTime(apt.appointment_date)}. ¡Te esperamos! ✂️`,
  );
  const waUrl = `https://wa.me/52${cleanPhone}?text=${waText}`;

  return (
    <div
      className={[
        "rounded-[1.6rem] border bg-white/5 p-6 transition-all duration-300 shadow-lg",
        isNew
          ? "border-neon/70 shadow-[0_0_30px_rgba(163,255,0,0.25)] animate-[fadeInUp_0.5s_ease_both]"
          : "border-white/10 hover:border-white/20 hover:shadow-xl",
        past ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Name + new badge */}
        <div className="flex flex-wrap items-center gap-2">
          {isNew && (
            <span className="flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neon shadow-neon/30">
              <Bell className="h-3.5 w-3.5" />
              Nueva Cita
            </span>
          )}
          <p className="text-2xl font-black uppercase tracking-[0.12em]">
            {apt.client_name}
          </p>
        </div>

        {/* Date + status badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-white/50">
            {formatDateTime(apt.appointment_date)}
          </span>
          <span
            className={[
              "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
              statusBadgeClass[status],
            ].join(" ")}
          >
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Detail pills */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-medium text-white/60">
          <Scissors className="h-4 w-4 shrink-0" />
          {apt.service_id ?? "Servicio no especificado"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-medium text-white/60">
          <User className="h-4 w-4 shrink-0" />
          {apt.barber_id ?? "Barbero no asignado"}
        </span>
        {apt.client_phone && (
          <a
            href={`tel:${apt.client_phone}`}
            className="flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/15 px-4 py-2 text-xs font-medium text-cyan transition hover:bg-cyan/25 hover:border-cyan/60 active:scale-95"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {apt.client_phone}
          </a>
        )}
      </div>

      {/* ══ Active appointment actions (pending / confirmed) ══ */}
      {(status === "pending" || status === "confirmed") &&
        !rescheduling &&
        !confirmDelete && (
          <div className="mt-5 space-y-4">
            {/* Row 1 — main controls */}
            <div className="flex flex-wrap gap-2.5">
              {status === "pending" && (
                <button
                  onClick={() => onSetStatus(apt.id, "confirmed")}
                  className="flex min-h-[48px] items-center gap-2 rounded-full bg-neon px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:brightness-110 active:scale-95 shadow-neon/30"
                >
                  <Check className="h-4 w-4" /> Confirmar Cita
                </button>
              )}
              {status === "confirmed" && (
                <span className="flex min-h-[48px] items-center gap-2 rounded-full border border-neon/50 bg-neon/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-neon shadow-neon/20">
                  <Check className="h-4 w-4" /> Cita Confirmada
                </span>
              )}
              <button
                onClick={() => {
                  setNewDate("");
                  setNewTime("");
                  setRescheduling(true);
                }}
                className="flex min-h-[48px] items-center gap-2 rounded-full border border-cyan/40 bg-cyan/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan transition hover:bg-cyan/25 active:scale-95"
              >
                <CalendarClock className="h-4 w-4" /> Reagendar
              </button>
              <button
                onClick={() => onSetStatus(apt.id, "cancelled")}
                className="flex min-h-[48px] items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-400 transition hover:bg-red-500/25 active:scale-95"
              >
                <X className="h-4 w-4" /> Cancelar
              </button>
              {apt.client_phone && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] items-center gap-2 rounded-full border border-green-500/40 bg-green-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-green-400 transition hover:bg-green-500/25 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>

            {/* Row 2 — completion prompt (only when confirmed) */}
            {status === "confirmed" && (
              <div className="rounded-[1.3rem] border border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-4 shadow-inner">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                  ¿Cómo terminó la cita?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => onSetStatus(apt.id, "completed")}
                    className="flex flex-1 min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-green-400/40 bg-gradient-to-r from-green-400/20 to-green-500/20 py-3 text-xs font-black uppercase tracking-[0.24em] text-green-400 transition hover:from-green-400 hover:to-green-500 hover:text-black active:scale-95 shadow-lg hover:shadow-green-400/25"
                  >
                    <CheckCheck className="h-4.5 w-4.5" /> Terminada
                  </button>
                  <button
                    onClick={() => onSetStatus(apt.id, "no_show")}
                    className="flex flex-1 min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-400/20 to-orange-500/20 py-3 text-xs font-black uppercase tracking-[0.24em] text-orange-400 transition hover:from-orange-400 hover:to-orange-500 hover:text-black active:scale-95 shadow-lg hover:shadow-orange-400/25"
                  >
                    <UserX className="h-4.5 w-4.5" /> No se presentó
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {/* ══ Completed / No-show actions ══ */}
      {(status === "completed" || status === "no_show") &&
        !rescheduling &&
        !confirmDelete && (
          <div className="mt-4 flex gap-2.5 border-t border-white/10 pt-4">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex min-h-[48px] items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500/25 active:scale-95"
            >
              <Trash2 className="h-4 w-4" /> Borrar
            </button>
          </div>
        )}

      {/* ══ Cancelled — trash only ══ */}
      {status === "cancelled" && !rescheduling && !confirmDelete && (
        <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex min-h-[48px] items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-red-400 transition hover:border-red-500/60 hover:bg-red-500/25 active:scale-95"
          >
            <Trash2 className="h-4 w-4" /> Borrar Cita
          </button>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {confirmDelete && (
        <div className="mt-4 space-y-3.5 rounded-[1.4rem] border border-red-500/40 bg-gradient-to-br from-red-500/15 to-black/70 p-5 shadow-inner">
          <p className="text-sm font-black uppercase tracking-widest text-red-400">
            ¿Eliminar esta cita?
          </p>
          <p className="text-xs text-white/50">
            {apt.client_name} · {formatDateTime(apt.appointment_date)}
          </p>
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => {
                onDelete(apt.id);
                setConfirmDelete(false);
              }}
              className="flex flex-1 min-h-[48px] items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-600 active:scale-95 shadow-lg"
            >
              <Trash2 className="h-4 w-4" /> Sí, Borrar
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex flex-1 min-h-[48px] items-center justify-center rounded-full border border-white/20 py-3 text-xs font-black uppercase tracking-widest text-white/60 transition hover:border-white/35 hover:text-white active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("today");
  const [sound, setSound] = useState(true);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // mantener el sonido accesible en la func de devolucion de tiempo real
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const unlockAudio = useCallback(() => {
    if (typeof window === "undefined") return;

    const AudioContextCtor =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
  }, []);

  // ── Bootstrap: chequeo de sesion y estado de datos persistentes ──────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("bg_agenda_auth") === "1") {
      setUnlocked(true);
    }

    try {
      const saved = localStorage.getItem("bg_statuses");
      if (saved) setStatuses(JSON.parse(saved) as Record<string, Status>);
    } catch {
      /* ignore corrupt storage */
    }

    try {
      const s = localStorage.getItem("bg_sound");
      if (s !== null) setSound(s === "1");
    } catch {
      /* ignore */
    }
  }, []);

  // ── Supabase: fetch + inicio en tiempo real ──────────────
  useEffect(() => {
    if (!unlocked || !supabase) return;

    const client = supabase;
    let active = true;

    async function loadAppointments() {
      setLoading(true);
      const { data } = await client
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true });
      if (active) {
        const deleted = getDeletedIds();
        setAppointments(
          ((data ?? []) as Appointment[]).filter((a) => !deleted.has(a.id)),
        );
        setLoading(false);
      }
    }

    loadAppointments();

    const channel = client
      .channel("agenda-realtime-v2")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        (payload) => {
          const { eventType } = payload;

          if (eventType === "INSERT") {
            const apt = payload.new as Appointment;
            // Skip if the barber deleted this appointment locally
            if (getDeletedIds().has(apt.id)) return;
            if (soundRef.current) {
              unlockAudio();
              playDing(audioContextRef.current);
              if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate?.([120, 80, 160]);
              }
            }

            setAppointments((prev) => {
              const without = prev.filter((a) => a.id !== apt.id);
              return [apt, ...without];
            });

            setNewIds((prev) => new Set(prev).add(apt.id));
            setTimeout(() => {
              setNewIds((prev) => {
                const next = new Set(prev);
                next.delete(apt.id);
                return next;
              });
            }, 10_000);
          } else if (eventType === "UPDATE") {
            const apt = payload.new as Appointment;
            setAppointments((prev) =>
              prev.map((a) => (a.id === apt.id ? apt : a)),
            );
          } else if (eventType === "DELETE") {
            const old = payload.old as { id: string };
            setAppointments((prev) => prev.filter((a) => a.id !== old.id));
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [unlocked, unlockAudio]);

  // ── Status helpers ───────────────────────────────────────

  const getStatus = (apt: Appointment): Status => {
    const local = statuses[apt.id];
    if (local) return local;
    if (
      apt.status === "confirmed" ||
      apt.status === "cancelled" ||
      apt.status === "pending"
    ) {
      return apt.status;
    }
    return "pending";
  };

  const handleSetStatus = useCallback(
    (id: string, status: Status) => {
      setStatuses((prev) => {
        const next = { ...prev, [id]: status };
        try {
          localStorage.setItem("bg_statuses", JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });

      if (supabase) {
        supabase
          .from("appointments")
          .update({ status })
          .eq("id", id)
          .then(
            () => {},
            () => {},
          );
      }
    },
    [], // setStatuses is stable; supabase is module-level
  );

  const handleReschedule = useCallback(
    (id: string, date: string, time: string) => {
      const newDate = new Date(`${date}T${time}:00`).toISOString();

      // Reset status to pending with the new date
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, appointment_date: newDate } : a,
        ),
      );
      setStatuses((prev) => {
        const next = { ...prev, [id]: "pending" as Status };
        try {
          localStorage.setItem("bg_statuses", JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });

      if (supabase) {
        supabase
          .from("appointments")
          .update({ appointment_date: newDate, status: "pending" })
          .eq("id", id)
          .then(
            () => {},
            () => {},
          );
      }
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    // 1. Remove from local list immediately (optimistic)
    setAppointments((prev) => prev.filter((a) => a.id !== id));

    // 2. Persist deleted ID so it never reappears after refresh
    try {
      const deleted = getDeletedIds();
      deleted.add(id);
      localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));
    } catch {
      /* ignore */
    }

    // 3. Clean up persisted status for this id
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem("bg_statuses", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

    // 4. Delete from Supabase (best-effort)
    if (supabase) {
      supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .then(
          () => {},
          () => {},
        );
    }
  }, []);

  // ── UI helpers ───────────────────────────────────────────

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    unlockAudio();
    try {
      localStorage.setItem("bg_sound", next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const logout = () => {
    sessionStorage.removeItem("bg_agenda_auth");
    setUnlocked(false);
  };

  // ── Filtered list ─────────────────────────────────────────

  const filtered = appointments.filter((apt) => {
    if (filter === "today") return isToday(apt.appointment_date);
    if (filter === "upcoming") return isUpcoming(apt.appointment_date);
    return true;
  });

  // ── Stats ─────────────────────────────────────────────────

  const todayCount = appointments.filter((a) =>
    isToday(a.appointment_date),
  ).length;
  const pendingCount = appointments.filter(
    (a) => getStatus(a) === "pending",
  ).length;
  const confirmedCount = appointments.filter(
    (a) => getStatus(a) === "confirmed",
  ).length;

  // ── PIN gate ──────────────────────────────────────────────

  if (!unlocked) {
    return <PinScreen onUnlock={() => { unlockAudio(); setUnlocked(true); }} onInteract={unlockAudio} />;
  }

  // ── Dashboard ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Sticky header ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          {/* Left: back + branding */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-white/30 hover:text-white hover:bg-white/10"
              aria-label="Inicio"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="truncate font-black text-base uppercase tracking-[0.26em]">
                Barber Gang MX
              </p>
              <p className="truncate text-xs capitalize text-white/45">
                {todayInSpanish()}
              </p>
            </div>
          </div>

          {/* Right: live badge + controls */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 rounded-full border border-neon/40 bg-neon/15 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-neon shadow-neon/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
              </span>
              En vivo
            </span>

            <button
              onClick={toggleSound}
              title={sound ? "Silenciar" : "Activar sonido"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/30 hover:bg-white/10"
            >
              {sound ? (
                <Volume2 className="h-5 w-5 text-neon" />
              ) : (
                <VolumeX className="h-5 w-5 text-white/40" />
              )}
            </button>

            <button
              onClick={logout}
              title="Cerrar sesión"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {/* Supabase missing warning */}
        {!supabase && (
          <div className="rounded-[1.2rem] border border-yellow-400/30 bg-yellow-400/10 p-4">
            <p className="font-black text-xs uppercase tracking-widest text-yellow-300 mb-1.5">
              ⚠ Supabase no configurado
            </p>
            <p className="text-sm text-white/55 leading-relaxed">
              Define{" "}
              <code className="rounded bg-yellow-400/15 px-1 py-0.5 text-yellow-200">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              y{" "}
              <code className="rounded bg-yellow-400/15 px-1 py-0.5 text-yellow-200">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              en tu archivo{" "}
              <code className="rounded bg-yellow-400/15 px-1 py-0.5 text-yellow-200">
                .env.local
              </code>{" "}
              para activar la agenda en tiempo real.
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Hoy */}
          <div className="rounded-[1.6rem] border border-cyan/30 bg-gradient-to-br from-cyan/10 to-cyan/5 p-5 text-center shadow-cyan hover:shadow-xl transition-all">
            <p className="text-4xl font-black text-cyan">{todayCount}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-white/50">
              Citas Hoy
            </p>
          </div>
          {/* Pendientes */}
          <div className="rounded-[1.6rem] border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 p-5 text-center hover:shadow-xl transition-all">
            <p className="text-4xl font-black text-yellow-300">
              {pendingCount}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-white/50">
              Pendientes
            </p>
          </div>
          {/* Confirmadas */}
          <div className="rounded-[1.6rem] border border-neon/30 bg-gradient-to-br from-neon/10 to-neon/5 p-5 text-center shadow-neon hover:shadow-xl transition-all">
            <p className="text-4xl font-black text-neon">{confirmedCount}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-white/50">
              Confirmadas
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 p-1.5 bg-white/5 rounded-[1.4rem] border border-white/10">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                "flex-1 rounded-full py-3 text-xs font-black uppercase tracking-[0.26em] transition-all active:scale-95",
                filter === key
                  ? "bg-neon text-black shadow-neon/40"
                  : "text-white/55 hover:text-white hover:bg-white/10",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Appointment grid */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-white/30">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="text-sm uppercase tracking-widest">
              Cargando citas...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-white/25">
            <Sparkles className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.35em]">
              Sin citas para hoy
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                status={getStatus(apt)}
                isNew={newIds.has(apt.id)}
                onSetStatus={handleSetStatus}
                onReschedule={handleReschedule}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
