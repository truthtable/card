import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RSVPEntry } from './Slide7';
import { useDashboardAuth, DashboardLogin } from './DashboardLogin';
import { Users, CheckCircle, XCircle, Trash2, Download, RefreshCw, Loader2, LogOut, Search, X } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function exportCSV(entries: RSVPEntry[]) {
  const header = ['Name', 'Phone', 'Attending', 'Events', 'Guests', 'Submitted At'];
  const rows = entries.map(e => [
    e.name,
    e.phone ? `+91${e.phone}` : '—',
    e.attending ? 'Yes' : 'No',
    e.events.join(' + '),
    e.guests,
    formatDate(e.submitted_at),
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rsvp-data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export const Dashboard: React.FC = () => {
  const { authed, login, logout } = useDashboardAuth();
  const [entries, setEntries] = useState<RSVPEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [search, setSearch] = useState('');

  const refresh = async () => {
    setLoading(true);
    setDbError('');
    try {
      const { data, error } = await supabase
        .from('rsvp_entries')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      setEntries(data ?? []);
    } catch (err: unknown) {
      setDbError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Auth gate — pass hook's login fn so setAuthed(true) fires on success
  if (!authed) return <DashboardLogin onLogin={login} />;

  const deleteEntry = async (id: string) => {
    await supabase.from('rsvp_entries').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = async () => {
    if (!window.confirm('Delete ALL RSVP entries? This cannot be undone.')) return;
    await supabase.from('rsvp_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setEntries([]);
  };
  void clearAll;

  const attending = entries.filter(e => e.attending);
  const notAttending = entries.filter(e => !e.attending);
  const totalGuests = attending.reduce((s, e) => s + e.guests, 0);

  // Apply filter then search
  const filtered = filter === 'all' ? entries : filter === 'yes' ? attending : notAttending;
  const q = search.trim().toLowerCase();
  const visible = q
    ? filtered.filter(e =>
      e.name.toLowerCase().includes(q) ||
      (e.phone && e.phone.includes(q))
    )
    : filtered;

  return (
    <div className="min-h-screen bg-[#f7ebe4]" style={{
      backgroundImage: "url('/media/perr-tile-83d714.svg')",
      backgroundRepeat: 'repeat',
      backgroundSize: '128px auto',
    }}>
      {/* Header */}
      <div className="bg-[#6b1d2e] text-white px-4 sm:px-8 py-5 flex items-center justify-between shadow-lg">
        <div>
          <p className="font-script text-xl text-[#d4a853]">Taha & Zainab</p>
          <h1 className="font-cinzel text-lg sm:text-2xl font-semibold tracking-wide">RSVP Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            title="Refresh"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportCSV(entries)}
            disabled={entries.length === 0}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4a853] text-[#6b1d2e] font-cinzel text-xs font-bold tracking-wider hover:bg-[#c49543] disabled:opacity-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <a
            href="#/"
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-cinzel text-xs tracking-wider transition"
          >
            ← Back
          </a>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Error banner */}
        {dbError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 font-sans text-sm">
            ⚠️ {dbError}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total RSVPs', value: entries.length, Icon: Users, color: 'text-[#6b1d2e]' },
            { label: 'Attending', value: attending.length, Icon: CheckCircle, color: 'text-emerald-700' },
            { label: 'Not Attending', value: notAttending.length, Icon: XCircle, color: 'text-rose-700' },
            { label: 'Total Guests', value: totalGuests, Icon: Users, color: 'text-[#9a6b32]' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white/90 rounded-2xl p-4 shadow flex flex-col items-center gap-1 border border-[#dfc39a]/60">
              <Icon className={`w-6 h-6 ${color}`} />
              <p className={`font-cinzel text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
              <p className="font-cinzel text-[10px] tracking-widest uppercase text-[#8b5a2b] text-center">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4a882] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full border border-[#d6b08a] bg-white/90 text-sm font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none focus:border-[#6b1d2e] focus:ring-1 focus:ring-[#6b1d2e]/30 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4a882] hover:text-[#6b1d2e] transition cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap items-center">
            {(['all', 'yes', 'no'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full font-cinzel text-xs tracking-wider font-semibold transition cursor-pointer border ${filter === f
                  ? 'bg-[#6b1d2e] text-white border-[#6b1d2e]'
                  : 'bg-white text-[#6b1d2e] border-[#d6b08a] hover:border-[#6b1d2e]'
                  }`}
              >
                {f === 'all' ? 'All' : f === 'yes' ? '✓ Attending' : '✗ Not Attending'}
              </button>
            ))}
            <div className="flex-1" />
            {/* keep in comments */}
            {/* {entries.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-cinzel text-xs tracking-wider hover:bg-rose-100 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )} */}
          </div>
        </div>

        {/* Result count hint when searching */}
        {q && (
          <p className="font-cinzel text-[11px] text-[#8b5a2b] tracking-wide">
            {visible.length} result{visible.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {/* Table */}
        {loading ? (
          <div className="bg-white/80 rounded-2xl p-10 flex items-center justify-center gap-3 text-[#8b5a2b] shadow">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-cormorant italic text-lg">Loading responses…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-10 text-center text-[#8b5a2b] font-cormorant italic text-lg shadow">
            No RSVP entries yet.
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow overflow-hidden border border-[#dfc39a]/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#6b1d2e]/90 text-white">
                    {['Name', 'Phone', 'Attending', 'Events', 'Guests', 'Submitted At', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-cinzel text-[10px] tracking-widest uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((e, i) => (
                    <tr
                      key={e.id}
                      className={`border-t border-[#f0e0cc] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fdf8f2]'} hover:bg-[#fdf0e4] transition-colors`}
                    >
                      <td className="px-4 py-3 font-cinzel text-[#3a1a1a] text-xs font-semibold whitespace-nowrap">{e.name}</td>
                      <td className="px-4 py-3 font-sans text-[#5a3a3a] text-xs whitespace-nowrap">
                        {e.phone ? `+91 ${e.phone}` : <span className="text-[#c4a882]">—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {e.attending
                          ? <span className="inline-flex items-center gap-1 text-emerald-700 font-cinzel text-[10px] font-bold tracking-wider"><CheckCircle className="w-3.5 h-3.5" />Yes</span>
                          : <span className="inline-flex items-center gap-1 text-rose-600 font-cinzel text-[10px] font-bold tracking-wider"><XCircle className="w-3.5 h-3.5" />No</span>
                        }
                      </td>
                      <td className="px-4 py-3 font-sans text-[#6b4a2a] text-[11px] max-w-[180px]">
                        {e.events.length > 0
                          ? e.events.map(ev => ev === 'event1' ? 'Rasmo Ka Rang' : 'Wedding Carnival').join(', ')
                          : <span className="text-[#c4a882]">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 font-cinzel text-[#3a1a1a] text-xs text-center">{e.guests || '—'}</td>
                      <td className="px-4 py-3 font-sans text-[#8b5a2b] text-[10px] whitespace-nowrap">{formatDate(e.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteEntry(e.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
