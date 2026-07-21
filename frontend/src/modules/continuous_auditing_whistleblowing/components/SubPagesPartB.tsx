import React from "react";

export interface AuditShellItem {
  id: number;
  screen_key: string;
  title: string;
  category: string;
  status: string;
  details_json: string;
}

export function StandardAuditShellScreen({
  screenKey,
  screenTitle,
  description,
  items,
  onAddItem,
}: {
  screenKey: string;
  screenTitle: string;
  description: string;
  items: AuditShellItem[];
  onAddItem?: (title: string, category: string) => void;
}) {
  const filtered = items.filter((i) => i.screen_key === screenKey || screenKey === "overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>{screenTitle}</h3>
          <p style={{ fontSize: 13, color: "var(--slate)" }}>{description}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const t = prompt(`Enter title for new entry in ${screenTitle}:`);
            if (t && onAddItem) onAddItem(t, screenTitle);
          }}
        >
          Add {screenTitle} Record
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--slate)", fontSize: 14 }}>
          No records registered for {screenTitle} yet. Click above to add one.
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
                <th style={{ padding: 12 }}>ID</th>
                <th style={{ padding: 12 }}>Record Title</th>
                <th style={{ padding: 12 }}>Category / Module</th>
                <th style={{ padding: 12 }}>Details & Metadata</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 12, fontFamily: "monospace", fontSize: 12 }}>#{item.id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: 12 }}><span className="badge">{item.category}</span></td>
                  <td style={{ padding: 12, fontSize: 12, fontFamily: "monospace", color: "var(--slate)" }}>{item.details_json}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ padding: "4px 8px", borderRadius: 12, fontSize: 12, background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
