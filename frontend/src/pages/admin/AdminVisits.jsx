import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Globe,
  MapPin,
  TrendingUp,
  ArrowLeft,
  Monitor,
} from "lucide-react";
import { getVisitStats } from "../../api/visitApi";
import { useAuth } from "../../context/AuthContext";

/* ─────────────────────────────────────────
   Mini bar chart — plain divs, no library
───────────────────────────────────────── */
const MiniBarChart = ({ data }) => {
  if (!data || data.length === 0)
    return <p className="text-sm text-parchment-100/40">No data yet.</p>;

  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex items-end gap-[3px] h-28">
      {data.map((d) => (
        <div
          key={d._id}
          className="group relative flex-1 flex flex-col items-center justify-end"
        >
          <div
            className="w-full rounded-t bg-velvet-light/60 hover:bg-velvet-light transition-all duration-150"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: "3px" }}
          />
          <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
            <span className="bg-graphite-700 text-parchment-50 text-[10px] rounded px-2 py-0.5 whitespace-nowrap shadow-lg">
              {d._id}: {d.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Stat card — same style as AdminDashboard
───────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-graphite-900">
      <Icon size={26} />
    </div>
    <p className="mt-6 text-sm uppercase tracking-[0.3em] text-parchment-100/50">
      {label}
    </p>
    <p className="mt-2 font-display text-5xl italic tracking-tight">
      {value ?? "—"}
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
const AdminVisits = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVisitStats(token)
      .then((data) => setStats(data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load visit data.")
      )
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      {/* ── Header ── */}
      <div className="mb-12">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-parchment-100/50 hover:text-parchment-50 transition"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin Panel
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Visit Analytics
        </h1>

        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Monitor site traffic, geographic reach, and daily visitor trends.
        </p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center gap-3 text-parchment-100/50">
          <span className="h-4 w-4 rounded-full border-2 border-velvet-light border-t-transparent animate-spin" />
          Loading analytics…
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
          {error}
        </div>
      )}

      {/* ── Data ── */}
      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            <StatCard
              icon={TrendingUp}
              label="Total Visits"
              value={stats.totalVisits?.toLocaleString()}
            />
            <StatCard
              icon={Users}
              label="Unique Visitors"
              value={stats.uniqueVisitors?.toLocaleString()}
            />
            <StatCard
              icon={Globe}
              label="Countries Reached"
              value={stats.topCountries?.length}
            />
          </div>

          {/* Chart + Top countries */}
          <div className="grid gap-6 lg:grid-cols-2 mb-10">

            {/* Daily bar chart */}
            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7">
              <h2 className="font-display text-3xl italic tracking-tight mb-1">
                Last 30 Days
              </h2>
              <p className="text-sm text-parchment-100/50 mb-6">
                Daily visit volume
              </p>
              <MiniBarChart data={stats.visitsByDay} />
              {stats.visitsByDay?.length > 0 && (
                <div className="flex justify-between mt-2 text-[11px] text-parchment-100/40">
                  <span>{stats.visitsByDay[0]._id}</span>
                  <span>
                    {stats.visitsByDay[stats.visitsByDay.length - 1]._id}
                  </span>
                </div>
              )}
            </div>

            {/* Top countries */}
            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7">
              <h2 className="font-display text-3xl italic tracking-tight mb-1">
                Top Countries
              </h2>
              <p className="text-sm text-parchment-100/50 mb-6">
                By number of visits
              </p>
              {stats.topCountries?.length === 0 ? (
                <p className="text-sm text-parchment-100/40">No data yet.</p>
              ) : (
                <ul className="space-y-3">
                  {stats.topCountries?.map((c, i) => {
                    const max = stats.topCountries[0].count;
                    return (
                      <li key={c._id} className="flex items-center gap-3">
                        <span className="w-5 text-right text-xs text-parchment-100/30">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{c._id || "Unknown"}</span>
                            <span className="text-parchment-100/50">
                              {c.count}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-graphite-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-velvet-light transition-all"
                              style={{ width: `${(c.count / max) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Top cities */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7 mb-10">
            <h2 className="font-display text-3xl italic tracking-tight mb-1">
              Top Cities
            </h2>
            <p className="text-sm text-parchment-100/50 mb-6">
              Most active locations
            </p>
            {stats.topCities?.length === 0 ? (
              <p className="text-sm text-parchment-100/40">No data yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.topCities?.map((city) => (
                  <div
                    key={city._id}
                    className="flex items-center gap-3 rounded-2xl border border-graphite-700 bg-graphite-900 px-4 py-3"
                  >
                    <MapPin size={15} className="text-velvet-light shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{city._id}</p>
                      <p className="text-xs text-parchment-100/40">
                        {city.country} · {city.count} visits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent visits table */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7">
            <h2 className="font-display text-3xl italic tracking-tight mb-1">
              Recent Visits
            </h2>
            <p className="text-sm text-parchment-100/50 mb-6">
              Last 50 page hits
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-graphite-700 text-left text-xs uppercase tracking-widest text-parchment-100/40">
                    <th className="pb-3 pr-6">IP</th>
                    <th className="pb-3 pr-6">Location</th>
                    <th className="pb-3 pr-6">
                      <span className="inline-flex items-center gap-1">
                        <Monitor size={12} /> Agent
                      </span>
                    </th>
                    <th className="pb-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-700">
                  {stats.recentVisits?.map((v) => (
                    <tr
                      key={v._id}
                      className="hover:bg-graphite-700/30 transition"
                    >
                      <td className="py-3 pr-6 font-mono text-xs text-parchment-100/70">
                        {v.ip}
                      </td>
                      <td className="py-3 pr-6 text-parchment-100/70">
                        {[v.city, v.region, v.country]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>
                      <td className="py-3 pr-6 max-w-[220px] truncate text-parchment-100/40 text-xs">
                        {v.userAgent || "—"}
                      </td>
                      <td className="py-3 text-parchment-100/50 whitespace-nowrap text-xs">
                        {new Date(v.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default AdminVisits;