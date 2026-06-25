import { Trophy, Clock, AlertCircle } from "lucide-react";

const config = {
  selected: { icon: Trophy, color: "#0f6e56", bg: "#E1F5EE", border: "#9FE1CB", label: "Selected" },
  waitlist: { icon: Clock, color: "#993c1d", bg: "#FAECE7", border: "#f5c4b3", label: "Waitlisted" },
  ineligible: { icon: AlertCircle, color: "#791f1f", bg: "#FCEBEB", border: "#F7C1C1", label: "Not eligible" },
};

const scoreColor = { selected: "#0f6e56", waitlist: "#993c1d", ineligible: "#a32d2d" };

export default function ResultCard({ candidate, status, rank }) {
  const { icon: Icon, color, bg, border, label } = config[status];
  const initials = candidate.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  return (
    <div style={{
      background: "#fff", border: "1.5px solid #e8e0d5", borderRadius: "11px",
      padding: "13px 16px", display: "flex", alignItems: "center", gap: "12px",
      marginBottom: "10px"
    }}>
      {rank && (
        <div style={{ fontSize: "18px", fontWeight: 500, color: "#5c35f5", width: "26px", textAlign: "center" }}>
          #{rank}
        </div>
      )}
      {!rank && (
        <div style={{ fontSize: "18px", fontWeight: 500, color: "#a32d2d", width: "26px", textAlign: "center" }}>—</div>
      )}
      <div style={{
        width: "38px", height: "38px", borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: 500, color, flexShrink: 0
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#1a1333" }}>{candidate.name}</div>
        <div style={{ fontSize: "12px", color: "#888780" }}>{candidate.email || candidate.filename}</div>
      </div>
      <span style={{
        fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
        fontWeight: 500, background: bg, color, border: `1px solid ${border}`, whiteSpace: "nowrap"
      }}>{label}</span>
      <span style={{ fontSize: "17px", fontWeight: 500, color: scoreColor[status], marginLeft: "10px" }}>
        {candidate.score}%
      </span>
      <Icon size={18} color={color} />
    </div>
  );
}