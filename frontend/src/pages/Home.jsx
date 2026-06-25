import { useState } from "react";
import axios from "axios";
import UploadZone from "../components/UploadZone";
import ResultCard from "../components/ResultCard";
import { Sparkles, Loader2, Briefcase, AlertCircle } from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [seats, setSeats] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!files.length || !jd.trim()) {
      setError("Please upload resumes and enter a job description.");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("resumes", f));
      formData.append("job_description", jd);
      formData.append("open_seats", seats);
      const { data } = await axios.post("http://localhost:8000/rank", formData);
      setResults(data);
    } catch {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        background: "#fff", borderBottom: "1.5px solid #e8e0d5",
        padding: "14px 28px", display: "flex", alignItems: "center", gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px", height: "38px", background: "#5c35f5",
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="9" cy="7.5" r="4" stroke="#fff" strokeWidth="1.7"/>
              <path d="M3 19c0-3.3 2.5-5.5 6-5.5h1.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
              <path d="M14 14l2 2 3.5-3.5" stroke="#f0997b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="4" stroke="#f0997b" strokeWidth="1.5"/>
            </svg>
          </div>
          <span style={{ fontSize: "20px", fontWeight: 500, color: "#1a1333", letterSpacing: "-0.4px" }}>
            Hire<span style={{ color: "#d85a30" }}>IQ</span>
          </span>
        </div>
        <span style={{
          marginLeft: "auto", fontSize: "11px", background: "#1a1333",
          color: "#fff", padding: "5px 12px", borderRadius: "20px"
        }}>XGBoost + LightGBM + Llama 3.1</span>
      </nav>

      {/* Hero */}
      <div style={{ padding: "42px 28px 26px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "#f5c4b3", color: "#712b13", fontSize: "12px",
          padding: "5px 12px", borderRadius: "20px", marginBottom: "14px", fontWeight: 500
        }}>
          <Sparkles size={12} /> AI-powered hiring
        </div>
        <h1 style={{ fontSize: "31px", fontWeight: 500, color: "#1a1333", lineHeight: 1.22, maxWidth: "460px", letterSpacing: "-0.5px" }}>
          Rank candidates the way a <span style={{ color: "#5c35f5" }}>great recruiter</span> would.
        </h1>
        <p style={{ fontSize: "14px", color: "#5f5e5a", marginTop: "10px", maxWidth: "390px", lineHeight: 1.65 }}>
          Upload resumes, paste a job description, set open seats — get a trusted shortlist in seconds.
        </p>
      </div>

      {/* Upload + JD */}
      <div style={{ padding: "0 28px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ background: "#fff", border: "1.5px solid #e8e0d5", borderRadius: "14px", padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "#993c1d", fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
            Resumes
          </div>
          <UploadZone files={files} setFiles={setFiles} />
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e8e0d5", borderRadius: "14px", padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "#993c1d", fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Briefcase size={13} /> Job details
          </div>
          <textarea
            rows={5}
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: "100%", border: "1.5px solid #e8e0d5", borderRadius: "9px",
              padding: "11px", fontSize: "13px", color: "#1a1333",
              background: "#fdfcfa", resize: "none", outline: "none",
              fontFamily: "sans-serif", height: "108px"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
            <span style={{ fontSize: "13px", color: "#5f5e5a" }}>Open seats</span>
            <input
              type="number" min={1} value={seats}
              onChange={e => setSeats(Number(e.target.value))}
              style={{
                width: "68px", border: "1.5px solid #e8e0d5", borderRadius: "8px",
                padding: "8px 12px", fontSize: "14px", fontWeight: 500,
                textAlign: "center", background: "#fff", color: "#1a1333", outline: "none"
              }}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div style={{ padding: "0 28px 20px" }}>
        {error && <p style={{ color: "#a32d2d", fontSize: "13px", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#9c86ee" : "#5c35f5",
            color: "#fff", border: "none", borderRadius: "11px", padding: "14px",
            fontSize: "15px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Analyzing...</> : <><Sparkles size={18} /> Rank candidates</>}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div style={{ padding: "0 28px 32px" }}>
          <div style={{ height: "1.5px", background: "#f0e8df", marginBottom: "20px" }} />
          <div style={{ fontSize: "11px", color: "#993c1d", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500, marginBottom: "12px" }}>Results</div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "Analyzed", value: results.selected.length + results.waitlist.length + results.ineligible.length, color: "#5c35f5" },
              { label: "Eligible", value: results.total_eligible, color: "#0f6e56" },
              { label: "Selected", value: results.selected.length, color: "#d85a30" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #e8e0d5", borderRadius: "11px", padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: 500, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#888780", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {results.selected.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#0f6e56", fontWeight: 500, marginBottom: "10px" }}>Selected candidates</p>
              {results.selected.map((c, i) => <ResultCard key={i} candidate={c} status="selected" rank={c.rank} />)}
            </div>
          )}

          {results.waitlist.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#993c1d", fontWeight: 500, marginBottom: "10px" }}>Waitlisted</p>
              {results.waitlist.map((c, i) => <ResultCard key={i} candidate={c} status="waitlist" />)}
            </div>
          )}

          {results.ineligible.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#a32d2d", fontWeight: 500, marginBottom: "10px" }}>Not eligible</p>
              {results.ineligible.map((c, i) => <ResultCard key={i} candidate={c} status="ineligible" />)}
            </div>
          )}

          {results.total_eligible === 0 && (
            <div style={{ textAlign: "center", padding: "48px 16px", background: "#fff", border: "1.5px solid #e8e0d5", borderRadius: "14px" }}>
              <AlertCircle size={40} color="#a32d2d" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1a1333" }}>Nobody is eligible</h3>
              <p style={{ fontSize: "13px", color: "#888780", marginTop: "6px" }}>No candidate met the minimum threshold for this role.</p>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}