import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, Search, ArrowRight } from "lucide-react";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "../../lib/jobs.js";
import { stagger, item } from "../../lib/motion.js";
function getApplyHref(jobId) {
    return `/careers/apply?jobId=${encodeURIComponent(jobId)}`;
}
export default function JobListings({ jobs, error, }) {
    const [search, setSearch] = useState("");
    const [dept, setDept] = useState("All Departments");
    const [type, setType] = useState("All Types");
    const [mode, setMode] = useState("All Modes");
    const departments = [
        "All Departments",
        ...Array.from(new Set(jobs.map((job) => job.department))).sort(),
    ];
    const types = [
        ["All Types", "All Types"],
        ...Object.entries(EMPLOYMENT_TYPE_LABELS),
    ];
    const modes = [
        ["All Modes", "All Modes"],
        ...Object.entries(WORK_MODE_LABELS),
    ];
    const filtered = jobs.filter(j => {
        const ms = search === "" || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
        return ms &&
            (dept === "All Departments" || j.department === dept) &&
            (type === "All Types" || EMPLOYMENT_TYPE_LABELS[j.employment_type] === type) &&
            (mode === "All Modes" || WORK_MODE_LABELS[j.work_mode] === mode);
    });
    if (error) {
        return (<div role="alert" className="card-glow p-12 text-center">
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 20, color: "var(--ism-slate)", marginBottom: 10 }}>
          Unable to Load Open Positions
        </h3>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 16 }}>{error}</p>
      </div>);
    }
    return (<div>
      {/* Filters */}
      <div className="card-glow p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…" className="field pl-10"/>
          </div>
          {[
            { v: dept, s: setDept, o: departments },
            { v: type, s: setType, o: types.map(([, label]) => label) },
            { v: mode, s: setMode, o: modes.map(([, label]) => label) },
        ].map((f, i) => (<select key={i} value={f.v} onChange={e => f.s(e.target.value)} className="field">
              {f.o.map(o => <option key={o}>{o}</option>)}
            </select>))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (<motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          {filtered.map(job => (<motion.div key={job.id} variants={item} className="card-glow p-6" whileHover={{ y: -3 }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-sm font-bold uppercase tracking-wider" style={{ background: "rgba(0,85,255,0.12)", color: "var(--cyan)", border: "1px solid rgba(0,85,255,0.25)" }}>
                      {job.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-sm" style={{ background: "rgba(1,35,103,0.04)", color: "var(--text2)", border: "1px solid rgba(1,35,103,0.14)" }}>
                      {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-sm" style={{ background: "rgba(1,35,103,0.04)", color: "var(--text2)", border: "1px solid rgba(1,35,103,0.14)" }}>
                      {WORK_MODE_LABELS[job.work_mode]}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 18, color: "var(--ism-slate)", marginBottom: 8 }}>{job.title}</h3>
                  <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, marginBottom: 14 }}>{job.description}</p>
                  <div className="flex flex-wrap gap-5 text-sm" style={{ color: "var(--text2)" }}>
                    <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: "var(--cyan)" }}/>{job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={12} style={{ color: "var(--cyan)" }}/>{job.experience}</span>
                    {job.deadline && <span className="flex items-center gap-1.5"><Clock size={12} style={{ color: "var(--cyan)" }}/>Deadline: {job.deadline}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link to={`/careers/${job.id}`} className="btn-outline" style={{ fontSize: 14, padding: "10px 18px" }}>View Details</Link>
                  <Link to={getApplyHref(job.id)} className="btn-primary" style={{ fontSize: 14, padding: "10px 18px" }}>
                    Apply Now <ArrowRight size={13}/>
                  </Link>
                </div>
              </div>
            </motion.div>))}
        </motion.div>) : jobs.length > 0 ? (<div className="card-glow p-12 text-center">
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 20, color: "var(--ism-slate)", marginBottom: 10 }}>
            No Matching Openings
          </h3>
          <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 16 }}>
            Try changing your search or filters.
          </p>
        </div>) : (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glow p-16 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(0,85,255,0.10)", border: "1px solid rgba(0,85,255,0.2)" }}>
            <Briefcase size={32} style={{ color: "var(--cyan)" }}/>
          </div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 24, color: "var(--ism-slate)", marginBottom: 12 }}>
            No Current Openings
          </h3>
          <p className="max-w-md mx-auto" style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 16 }}>
            We don&apos;t have active vacancies right now. Check back soon — we&apos;re a growing team with opportunities opening regularly.
          </p>
        </motion.div>)}
    </div>);
}
