import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Check, X, Edit3, Search, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────
export interface RSVPEntry {
  id: string;
  name: string;
  phone: string;
  attending: boolean;
  events: string[];
  guests: number;
  submitted_at: string;
}

// ── Storage Keys ───────────────────────────────────────────────────────────
const RSVP_STORAGE_KEY = 'wedding_rsvp_id';
const RSVP_DATA_STORAGE_KEY = 'wedding_rsvp_data';

// ── Slide 7 ────────────────────────────────────────────────────────────────
const EVENTS_OPTIONS = [
  { id: 'event1', label: 'RASMO KA RANG,\nKHUSHIYON KE SANG!' },
  { id: 'event2', label: 'THE GREAT\nWEDDING GAME\nCARNIVAL!' },
];

const LOCATION_URL = 'https://maps.app.goo.gl/myz9bAuRhArG69fr7';

export const Slide7: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Identification & Mode
  const [existingId, setExistingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  // Lookup state (for finding RSVP on new device without login)
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Form state
  const [attending, setAttending] = useState<boolean | null>(true);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load existing RSVP from localStorage + sync with Supabase
  useEffect(() => {
    const savedId = localStorage.getItem(RSVP_STORAGE_KEY);
    const cachedData = localStorage.getItem(RSVP_DATA_STORAGE_KEY);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setName(parsed.name || '');
        setPhone(parsed.phone || '');
        setAttending(parsed.attending ?? true);
        setSelectedEvents(parsed.events || []);
        setGuests(parsed.guests || 1);
        setExistingId(parsed.id || savedId);
        setSubmitted(true);
      } catch {
        // ignore
      }
    }

    if (savedId) {
      supabase
        .from('rsvp_entries')
        .select('*')
        .eq('id', savedId)
        .maybeSingle()
        .then(({ data, error: dbErr }) => {
          if (data && !dbErr) {
            setName(data.name || '');
            setPhone(data.phone || '');
            setAttending(data.attending ?? true);
            setSelectedEvents(data.events || []);
            setGuests(data.guests || 1);
            setExistingId(data.id);
            setSubmitted(true);
            localStorage.setItem(RSVP_DATA_STORAGE_KEY, JSON.stringify(data));
          } else if (!data && !dbErr) {
            // Deleted from database
            localStorage.removeItem(RSVP_STORAGE_KEY);
            localStorage.removeItem(RSVP_DATA_STORAGE_KEY);
            setExistingId(null);
            setSubmitted(false);
          }
        });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleEvent = (id: string) => {
    setSelectedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupPhone.trim().replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setLookupError('Please enter a 10-digit mobile number.');
      return;
    }
    setLookupError('');
    setLookupLoading(true);

    try {
      const { data, error: dbErr } = await supabase
        .from('rsvp_entries')
        .select('*')
        .eq('phone', clean)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbErr) throw dbErr;
      if (!data) {
        setLookupError('No RSVP found for +91 ' + clean);
        return;
      }

      setName(data.name || '');
      setPhone(data.phone || '');
      setAttending(data.attending ?? true);
      setSelectedEvents(data.events || []);
      setGuests(data.guests || 1);
      setExistingId(data.id);
      setSubmitted(true);
      setIsEditing(false);
      setLookupOpen(false);

      localStorage.setItem(RSVP_STORAGE_KEY, data.id);
      localStorage.setItem(RSVP_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (err: unknown) {
      setLookupError(err instanceof Error ? err.message : 'Lookup failed. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError('');
    setSubmitting(true);

    try {
      const cleanName = name.trim();
      const cleanPhone = phone.trim() ? phone.trim().slice(-10) : null;
      const payload = {
        name: cleanName,
        phone: cleanPhone,
        attending: attending ?? true,
        events: attending ? selectedEvents : [],
        guests: attending ? guests : 0,
      };

      const wasEditing = Boolean(existingId);

      // Clean up prior entries to guarantee ZERO duplicates in Supabase
      if (existingId) {
        await supabase.from('rsvp_entries').delete().eq('id', existingId);
      }
      if (cleanPhone) {
        await supabase.from('rsvp_entries').delete().eq('phone', cleanPhone);
      }

      // Insert clean single entry
      const { data, error: dbError } = await supabase
        .from('rsvp_entries')
        .insert(payload)
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        setExistingId(data.id);
        localStorage.setItem(RSVP_STORAGE_KEY, data.id);
        localStorage.setItem(RSVP_DATA_STORAGE_KEY, JSON.stringify(data));
      }
      setJustUpdated(wasEditing);

      if (attending) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#6b1d2e', '#d4a853', '#f4e6d1'],
        });
      }

      setSubmitted(true);
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = () => {
    setJustUpdated(false);
    setIsEditing(true);
    setSubmitted(false);
  };

  const handleCancelEdit = () => {
    // Revert form values from cached data
    const cachedData = localStorage.getItem(RSVP_DATA_STORAGE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setName(parsed.name || '');
        setPhone(parsed.phone || '');
        setAttending(parsed.attending ?? true);
        setSelectedEvents(parsed.events || []);
        setGuests(parsed.guests || 1);
      } catch {
        // ignore
      }
    }
    setIsEditing(false);
    setSubmitted(true);
  };

  return (
    <section
      id="slide7"
      ref={sectionRef}
      className="relative w-full overflow-hidden select-none bg-[#FAF2E6]"
    >
      {/* ── Background: couple-bg.webp ── */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img
          src="./media/couple-bg.webp"
          alt="Palace Backdrop"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Soft overlay for legibility */}
      <div className="absolute inset-0 bg-[#FAF2E6]/60 backdrop-blur-[1px] pointer-events-none z-0" aria-hidden="true" />

      {/* ── Top pattern border ── */}
      <div
        className="relative z-10 w-full h-[48px] sm:h-[64px] pointer-events-none"
        style={{
          backgroundImage: "url('./media/pattern.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center top',
        }}
        aria-hidden="true"
      />

      {/* ── Main content area ── */}
      <div className="relative z-10 w-full py-10 sm:py-14 px-4">
        {/* ── Fade-in wrapper ── */}
        <div
          className={`relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="font-script text-2xl sm:text-3xl text-[#d4a853] drop-shadow mb-1">
              Kindly Respond
            </p>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide drop-shadow-lg text-[#6b1d2e]">
              Will You Be Joining Us?
            </h2>
            <p className="mt-2 font-cormorant italic text-sm sm:text-base text-[#531319] tracking-wider">
              We would love to know if you'll be celebrating with us.
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">

            {/* ── RSVP Form / Status Card ── */}
            <div className="flex-1 bg-white/95 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Night palace mini banner */}
              <div
                className="w-full h-36 sm:h-44 bg-cover bg-center shrink-0"
                style={{ backgroundImage: "url('./media/night-palace.webp')" }}
                aria-hidden="true"
              />

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                {submitted ? (
                  /* ── Submitted / Existing RSVP View ── */
                  <div className="py-2 space-y-4">
                    {justUpdated && (
                      <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-cinzel">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RSVP updated successfully!</span>
                      </div>
                    )}

                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-[#6b1d2e] flex items-center justify-center mx-auto shadow-md">
                        <Check className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#6b1d2e]">
                        {attending ? 'RSVP Confirmed 🎉' : 'Response Recorded 💛'}
                      </h3>
                      <p className="font-cormorant text-sm sm:text-base text-[#8b5a2b] italic">
                        {attending
                          ? 'We cannot wait to celebrate together with you!'
                          : 'Thank you for letting us know. You will be in our prayers.'}
                      </p>
                    </div>

                    {/* Summary card */}
                    <div className="bg-[#FAF2E6]/80 rounded-xl p-4 border border-[#d6b08a]/60 text-xs sm:text-sm font-sans space-y-2">
                      <div className="flex justify-between items-center border-b border-[#d6b08a]/30 pb-2">
                        <span className="font-cinzel text-[#8b5a2b] uppercase tracking-wider text-[11px]">Guest Name</span>
                        <span className="font-semibold text-[#6b1d2e]">{name}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#d6b08a]/30 pb-2">
                        <span className="font-cinzel text-[#8b5a2b] uppercase tracking-wider text-[11px]">Status</span>
                        <span className="font-semibold text-[#6b1d2e]">
                          {attending ? `Attending (${guests} ${guests === 1 ? 'Guest' : 'Guests'})` : 'Not Attending'}
                        </span>
                      </div>
                      {attending && selectedEvents.length > 0 && (
                        <div className="border-b border-[#d6b08a]/30 pb-2">
                          <span className="block font-cinzel text-[#8b5a2b] uppercase tracking-wider text-[11px] mb-1">
                            Events Joining
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedEvents.map(evId => {
                              const found = EVENTS_OPTIONS.find(e => e.id === evId);
                              return (
                                <span
                                  key={evId}
                                  className="px-2 py-0.5 rounded-md bg-[#6b1d2e]/10 text-[#6b1d2e] text-[10px] font-cinzel font-semibold tracking-wider"
                                >
                                  {found ? found.label.replace(/\n/g, ' ') : evId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {phone && (
                        <div className="flex justify-between items-center">
                          <span className="font-cinzel text-[#8b5a2b] uppercase tracking-wider text-[11px]">Contact</span>
                          <span className="font-mono text-[#6b1d2e]">+91 {phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="w-full py-2.5 rounded-xl bg-[#6b1d2e] hover:bg-[#531322] text-white font-cinzel font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit My RSVP
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Form View (New or Edit) ── */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header banner if editing */}
                    {isEditing && (
                      <div className="flex items-center justify-between p-2.5 bg-[#fdf5eb] border border-[#d6b08a] rounded-xl text-xs">
                        <span className="font-cinzel font-semibold text-[#6b1d2e] flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-[#9a6b32]" />
                          Editing your RSVP
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-[#8b5a2b] hover:text-[#6b1d2e] font-cinzel font-semibold underline underline-offset-2 cursor-pointer text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Attendance toggle */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAttending(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border-2 text-xs sm:text-sm font-cinzel font-semibold tracking-wide transition-all duration-200 cursor-pointer ${attending === true
                          ? 'bg-[#6b1d2e] border-[#6b1d2e] text-white shadow-md'
                          : 'bg-white border-[#d6b08a] text-[#6b1d2e] hover:border-[#6b1d2e]'
                          }`}
                      >
                        <Check className="w-4 h-4 shrink-0" />
                        <span>With joy, we will be there</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttending(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border-2 text-xs sm:text-sm font-cinzel font-semibold tracking-wide transition-all duration-200 cursor-pointer ${attending === false
                          ? 'bg-[#6b1d2e] border-[#6b1d2e] text-white shadow-md'
                          : 'bg-white border-[#d6b08a] text-[#6b1d2e] hover:border-[#6b1d2e]'
                          }`}
                      >
                        <X className="w-4 h-4 shrink-0" />
                        <span>With regret, we cannot</span>
                      </button>
                    </div>

                    {/* Event checkboxes (only when attending) */}
                    {attending === true && (
                      <div className="space-y-2">
                        <p className="font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-wider uppercase">
                          Which celebration(s) will you join?
                        </p>
                        <div className="flex gap-3 flex-wrap">
                          {EVENTS_OPTIONS.map(ev => (
                            <label
                              key={ev.id}
                              className={`flex items-start gap-2 border-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 text-[11px] font-cinzel font-semibold tracking-wider uppercase leading-tight flex-1 min-w-[120px] ${selectedEvents.includes(ev.id)
                                ? 'border-[#6b1d2e] bg-[#f9f0f2]'
                                : 'border-[#d6b08a] bg-white hover:border-[#6b1d2e]/60'
                                }`}
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 accent-[#6b1d2e] w-3.5 h-3.5 shrink-0"
                                checked={selectedEvents.includes(ev.id)}
                                onChange={() => toggleEvent(ev.id)}
                              />
                              <span className="whitespace-pre-line">{ev.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-wider uppercase mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border border-[#d6b08a] rounded-xl px-4 py-2.5 text-sm font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none focus:border-[#6b1d2e] focus:ring-1 focus:ring-[#6b1d2e]/30 transition bg-white"
                      />
                    </div>

                    {/* Guests + Phone row (attending only) */}
                    {attending === true && (
                      <div className="flex gap-3">
                        <div>
                          <label className="block font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-wider uppercase mb-1.5">
                            Guests <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-2 border border-[#d6b08a] rounded-xl px-3 py-2 w-28 bg-white">
                            <button
                              type="button"
                              onClick={() => setGuests(g => Math.max(1, g - 1))}
                              className="w-6 h-6 rounded-full bg-[#f4e6d1] text-[#6b1d2e] font-bold flex items-center justify-center hover:bg-[#e9d0b5] transition cursor-pointer text-sm"
                            >−</button>
                            <span className="flex-1 text-center font-cinzel text-sm text-[#3a1a1a]">{guests}</span>
                            <button
                              type="button"
                              onClick={() => setGuests(g => Math.min(10, g + 1))}
                              className="w-6 h-6 rounded-full bg-[#f4e6d1] text-[#6b1d2e] font-bold flex items-center justify-center hover:bg-[#e9d0b5] transition cursor-pointer text-sm"
                            >+</button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-wider uppercase mb-1.5">
                            Mobile Number <span className="text-[#c4a882] font-normal">(optional)</span>
                          </label>
                          <div className="flex border border-[#d6b08a] rounded-xl overflow-hidden focus-within:border-[#6b1d2e] focus-within:ring-1 focus-within:ring-[#6b1d2e]/30 transition bg-white">
                            <span className="flex items-center px-3 bg-[#faf5ef] text-[#6b1d2e] font-cinzel text-sm border-r border-[#d6b08a] select-none">+91</span>
                            <input
                              type="tel"
                              placeholder="Enter mobile number"
                              value={phone}
                              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              className="flex-1 px-3 py-2.5 text-sm font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phone only (not attending) */}
                    {attending === false && (
                      <div>
                        <label className="block font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-wider uppercase mb-1.5">
                          Mobile Number <span className="text-[#c4a882] font-normal">(optional)</span>
                        </label>
                        <div className="flex border border-[#d6b08a] rounded-xl overflow-hidden focus-within:border-[#6b1d2e] focus-within:ring-1 focus-within:ring-[#6b1d2e]/30 transition bg-white">
                          <span className="flex items-center px-3 bg-[#faf5ef] text-[#6b1d2e] font-cinzel text-sm border-r border-[#d6b08a] select-none">+91</span>
                          <input
                            type="tel"
                            placeholder="Enter mobile number"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="flex-1 px-3 py-2.5 text-sm font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <p className="text-red-600 text-xs font-sans">{error}</p>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-[#6b1d2e] hover:bg-[#531322] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-cinzel font-semibold text-sm tracking-widest uppercase transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{existingId ? 'Saving Changes…' : 'Sending…'}</span>
                        </>
                      ) : (
                        <span>{existingId ? 'Save & Update RSVP' : 'Send RSVP'}</span>
                      )}
                    </button>

                    {/* Lookup toggle link if not editing */}
                    {!isEditing && (
                      <div className="pt-2 text-center border-t border-[#d6b08a]/40">
                        {!lookupOpen ? (
                          <button
                            type="button"
                            onClick={() => { setLookupOpen(true); setLookupError(''); }}
                            className="text-[11px] font-cinzel tracking-wider text-[#8b5a2b] hover:text-[#6b1d2e] hover:underline cursor-pointer"
                          >
                            Already submitted? Find &amp; edit your RSVP
                          </button>
                        ) : (
                          <div className="space-y-2 pt-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-cinzel text-[11px] font-semibold text-[#6b1d2e] uppercase tracking-wider">
                                Find by mobile number
                              </span>
                              <button
                                type="button"
                                onClick={() => setLookupOpen(false)}
                                className="text-[10px] text-[#8b5a2b] hover:text-[#6b1d2e] font-cinzel"
                              >
                                Close
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex flex-1 border border-[#d6b08a] rounded-xl overflow-hidden focus-within:border-[#6b1d2e] transition bg-white">
                                <span className="flex items-center px-2.5 bg-[#faf5ef] text-[#6b1d2e] font-cinzel text-xs border-r border-[#d6b08a]">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  placeholder="Enter 10-digit number"
                                  value={lookupPhone}
                                  onChange={e => setLookupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  className="flex-1 px-2.5 py-1.5 text-xs font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={handleLookup}
                                disabled={lookupLoading}
                                className="px-3.5 py-1.5 bg-[#6b1d2e] text-white rounded-xl text-xs font-cinzel font-semibold hover:bg-[#531322] disabled:opacity-50 cursor-pointer flex items-center gap-1"
                              >
                                {lookupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                                <span>Find</span>
                              </button>
                            </div>
                            {lookupError && (
                              <p className="text-red-600 text-[11px] font-sans">{lookupError}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* ── Directions Card ── */}
            <div className="md:w-64 lg:w-72 bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 gap-5">
              {/* Decorative lantern */}
              <img
                src="./media/lantern-1.webp"
                alt="Lantern"
                className="w-16 h-auto opacity-70 drop-shadow-lg"
              />

              <div className="text-center space-y-1">
                <p className="font-cinzel text-xs font-semibold text-[#6b1d2e] tracking-widest uppercase">Venue</p>
                <p className="font-cormorant text-sm italic text-[#8b5a2b] leading-snug">
                  The Heritage Royal Palace &amp; Gardens
                </p>
              </div>

              {/* Get Directions Button */}
              <div className="w-full pt-1">
                <a
                  href={LOCATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#6b1d2e] via-[#85233a] to-[#6b1d2e] text-[#fff6e6] font-cinzel font-bold text-sm sm:text-base tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(107,29,46,0.35),0_0_14px_rgba(214,165,92,0.3)] hover:shadow-[0_8px_25px_rgba(107,29,46,0.45),0_0_20px_rgba(214,165,92,0.45)] hover:brightness-110 active:scale-[0.98] border-2 border-[#e6c17b] group transition-all duration-200 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-[#f6d59e] group-hover:scale-110 group-hover:text-amber-200 transition-all shrink-0" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom pattern border ── */}
      <div
        className="relative z-10 w-full h-[48px] sm:h-[64px] pointer-events-none"
        style={{
          backgroundImage: "url('./media/pattern.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center top',
          transform: 'scaleY(-1)',
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Slide7;
