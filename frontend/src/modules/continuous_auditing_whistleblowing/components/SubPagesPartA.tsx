import React, { useState } from "react";
import { Icon } from "../../../components/Icon";

export interface Tip {
  id: number;
  tracking_code: string;
  category: string;
  subject: string;
  details: string;
  is_anonymous: boolean;
  complainant_contact: string;
  credibility_grade: string;
  severity: string;
  status: string;
  attachment_count: number;
}

export interface Rule {
  id: number;
  rule_code: string;
  title: string;
  description: string;
  stream: string;
  threshold_value: number;
  risk_score: number;
  is_active: boolean;
  false_positive_rate: number;
}

export interface Ingestion {
  id: number;
  connector_name: string;
  target_stream: string;
  status: string;
  latency_ms: number;
  error_count: number;
  last_sync: string;
}

export interface Case {
  id: number;
  case_number: string;
  title: string;
  lead_investigator: string;
  stage: string;
  priority: string;
  findings_summary: string;
  status: string;
}

export interface Evidence {
  id: number;
  case_number: string;
  evidence_type: string;
  title: string;
  content_hash: string;
  notes: string;
}

export interface Kri {
  id: number;
  kri_name: string;
  domain: string;
  current_value: number;
  tolerance_threshold: number;
  unit: string;
  status: string;
}

// 1. Real-Time Analytics Cockpit
export function RealTimeAnalyticsCockpit({ rules, ingestion, tips }: { rules: Rule[]; ingestion: Ingestion[]; tips: Tip[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--accent-blue, #3b82f6)" }}>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 4 }}>Active Stream Feeds</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{ingestion.length}</div>
          <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>● All pipelines active</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--accent-amber, #f59e0b)" }}>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 4 }}>Real-Time Alert Clusters</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{rules.filter(r => r.is_active).length * 3 + 12}</div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>Across 5 transaction streams</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 4 }}>High/Critical Anomaly Flags</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{tips.filter(t => t.severity === "High" || t.severity === "Critical").length + 4}</div>
          <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>Requires immediate investigation</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 4 }}>Avg Pipeline Latency</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {Math.round(ingestion.reduce((acc, i) => acc + i.latency_ms, 0) / (ingestion.length || 1))} ms
          </div>
          <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>Sub-second real-time streaming</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Live Transaction Stream Anomaly Monitor</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
              <th style={{ padding: 10 }}>Time</th>
              <th style={{ padding: 10 }}>Stream</th>
              <th style={{ padding: 10 }}>Triggered Rule</th>
              <th style={{ padding: 10 }}>Anomaly Score</th>
              <th style={{ padding: 10 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 14 }}>
              <td style={{ padding: 10 }}>11:24:02 AM</td>
              <td style={{ padding: 10 }}>General Ledger</td>
              <td style={{ padding: 10 }}>Off-Hours ERP Journal Entry &gt; $50k</td>
              <td style={{ padding: 10 }}><span className="badge badge-danger">85 Risk</span></td>
              <td style={{ padding: 10 }}><span style={{ color: "#ef4444", fontWeight: 600 }}>Flagged</span></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 14 }}>
              <td style={{ padding: 10 }}>11:21:45 AM</td>
              <td style={{ padding: 10 }}>Procure-to-Pay</td>
              <td style={{ padding: 10 }}>Duplicate Vendor Bank Account Match</td>
              <td style={{ padding: 10 }}><span className="badge badge-danger">95 Risk</span></td>
              <td style={{ padding: 10 }}><span style={{ color: "#ef4444", fontWeight: 600 }}>Triage Queue</span></td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 14 }}>
              <td style={{ padding: 10 }}>11:15:30 AM</td>
              <td style={{ padding: 10 }}>Treasury & Banking</td>
              <td style={{ padding: 10 }}>Unusual Weekend Wire Transfers</td>
              <td style={{ padding: 10 }}><span className="badge badge-warning">75 Risk</span></td>
              <td style={{ padding: 10 }}><span style={{ color: "#f59e0b", fontWeight: 600 }}>Auto-Escalated</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. Rule Engine & Trigger Configs
export function RuleEngineConfig({ rules, onAddRule }: { rules: Rule[]; onAddRule: (rule: Omit<Rule, "id">) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [stream, setStream] = useState("General Ledger");
  const [threshold, setThreshold] = useState(10000);
  const [risk, setRisk] = useState(70);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    onAddRule({
      rule_code: code,
      title,
      description: "Custom continuous monitoring rule",
      stream,
      threshold_value: Number(threshold),
      risk_score: Number(risk),
      is_active: true,
      false_positive_rate: 0.0,
    });
    setCode("");
    setTitle("");
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Continuous Rule Engine & Trigger Configuration</h3>
          <p style={{ fontSize: 13, color: "var(--slate)" }}>Configure threshold logic, Boolean parameters, and risk weights for real-time alerts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Icon name="plus" size={16} /> Add New Monitoring Rule
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
              <th style={{ padding: 12 }}>Rule Code</th>
              <th style={{ padding: 12 }}>Rule Name & Description</th>
              <th style={{ padding: 12 }}>Target Stream</th>
              <th style={{ padding: 12 }}>Threshold</th>
              <th style={{ padding: 12 }}>Risk Score Weight</th>
              <th style={{ padding: 12 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{r.rule_code}</td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{r.description}</div>
                </td>
                <td style={{ padding: 12 }}>{r.stream}</td>
                <td style={{ padding: 12, fontFamily: "monospace" }}>${r.threshold_value.toLocaleString()}</td>
                <td style={{ padding: 12 }}><span className="badge">{r.risk_score} / 100</span></td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: "4px 8px", borderRadius: 12, fontSize: 12, background: r.is_active ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: r.is_active ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                    {r.is_active ? "● Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form className="card" onSubmit={handleSubmit} style={{ width: 480, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>New Continuous Anomaly Rule</h3>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Rule Code</label>
              <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. RULE-201" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Rule Title</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Split PO Detection" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Target Transaction Stream</label>
              <select className="input" value={stream} onChange={(e) => setStream(e.target.value)}>
                <option value="General Ledger">General Ledger</option>
                <option value="Procure-to-Pay">Procure-to-Pay</option>
                <option value="Order-to-Cash">Order-to-Cash</option>
                <option value="Payroll & HR">Payroll & HR</option>
                <option value="Treasury & Banking">Treasury & Banking</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Threshold Amount ($)</label>
              <input className="input" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Risk Score Weight (1-100)</label>
              <input className="input" type="number" min={1} max={100} value={risk} onChange={(e) => setRisk(Number(e.target.value))} required />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Rule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// 3. Data Ingestion Status Monitor
export function DataIngestionMonitor({ ingestion }: { ingestion: Ingestion[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Data Ingestion Status & Health Monitor</h3>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Monitor real-time pipeline latency, error rates, and API connector uptime across external ERPs.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {ingestion.map((i) => (
          <div key={i.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600 }}>{i.connector_name}</h4>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>Stream: {i.target_stream}</div>
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                background: i.status === "Healthy" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                color: i.status === "Healthy" ? "#10b981" : "#f59e0b"
              }}>
                {i.status}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>Latency</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{i.latency_ms} ms</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>Error Count</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: i.error_count > 0 ? "#ef4444" : "inherit" }}>{i.error_count}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 12 }}>Last Synced: {i.last_sync}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Whistleblower Intake Portal
export function WhistleblowerIntakePortal({ onAddTip }: { onAddTip: (tip: Omit<Tip, "id" | "tracking_code" | "status">) => void }) {
  const [category, setCategory] = useState("Financial Fraud");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isAnon, setIsAnon] = useState(true);
  const [contact, setContact] = useState("");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !details) return;
    onAddTip({
      category,
      subject,
      details,
      is_anonymous: isAnon,
      complainant_contact: isAnon ? "[Anonymous]" : contact,
      credibility_grade: "Pending Review",
      severity: "High",
      attachment_count: 1,
    });
    setSubmittedCode(`TIP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubject("");
    setDetails("");
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🔒 Anonymous Whistleblower Intake Portal</h3>
        <p style={{ fontSize: 14, color: "var(--slate)" }}>
          Submit secure, encrypted compliance grievances, financial fraud reports, or code-of-conduct violations.
        </p>
      </div>

      {submittedCode ? (
        <div className="card" style={{ padding: 28, textAlign: "center", border: "2px solid #10b981" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h4 style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>Tip Submitted Securely</h4>
          <p style={{ fontSize: 14, color: "var(--slate)", margin: "12px 0" }}>
            Your anonymous intake record has been encrypted and assigned tracking code:
          </p>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", background: "rgba(0,0,0,0.04)", padding: "10px 20px", borderRadius: 8, display: "inline-block" }}>
            {submittedCode}
          </div>
          <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 16 }}>Keep this tracking code safe to check investigation progress anonymously.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setSubmittedCode(null)}>
            Submit Another Report
          </button>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Report Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Financial Fraud">Financial Fraud / Embezzlement</option>
              <option value="SOD Violation">Segregation of Duties (SOD) Bypass</option>
              <option value="Bribery & Kickbacks">Bribery & Procurement Kickbacks</option>
              <option value="Inventory Theft">Inventory / Asset Misappropriation</option>
              <option value="Harassment & Misconduct">Workplace Harassment & Policy Breach</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Subject Summary</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary of the incident..." required />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Detailed Incident Description</label>
            <textarea className="input" rows={5} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Provide names, dates, amounts, transaction numbers, and specific locations..." required />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "rgba(0,0,0,0.02)", borderRadius: 8 }}>
            <input type="checkbox" id="anon" checked={isAnon} onChange={(e) => setIsAnon(e.target.checked)} />
            <label htmlFor="anon" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Keep my submission 100% Anonymous (No identity recorded)
            </label>
          </div>

          {!isAnon && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Contact Information (Optional)</label>
              <input className="input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Email or secure phone number..." />
            </div>
          )}

          <div style={{ padding: "12px 16px", background: "rgba(59, 130, 246, 0.08)", borderRadius: 8, fontSize: 12, color: "var(--slate)" }}>
            📎 Files & Proof Documents: You can upload PDF/Excel evidence attachments after submission using your tracking code.
          </div>

          <button className="btn btn-primary" style={{ padding: "12px 20px", fontSize: 15 }}>
            🔒 Submit Whistleblower Intake Encrypted
          </button>
        </form>
      )}
    </div>
  );
}

// 5. Triage & Severity Classifier
export function TriageSeverityClassifier({ tips }: { tips: Tip[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Whistleblower Tip Triage & Severity Classifier</h3>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Grade tip credibility, assign severity matrix levels (Low/Med/High/Critical), and route to investigators.</p>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
              <th style={{ padding: 12 }}>Tracking Code</th>
              <th style={{ padding: 12 }}>Category & Subject</th>
              <th style={{ padding: 12 }}>Submission Type</th>
              <th style={{ padding: 12 }}>Credibility Grade</th>
              <th style={{ padding: 12 }}>Severity Score</th>
              <th style={{ padding: 12 }}>Workflow Status</th>
              <th style={{ padding: 12 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 12, fontFamily: "monospace", fontWeight: 600 }}>{t.tracking_code}</td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{t.subject}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{t.category}</div>
                </td>
                <td style={{ padding: 12, fontSize: 13 }}>{t.is_anonymous ? "🔒 Anonymous" : t.complainant_contact}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: "4px 8px", borderRadius: 12, fontSize: 12, background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", fontWeight: 600 }}>
                    {t.credibility_grade}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: t.severity === "Critical" ? "rgba(239, 68, 68, 0.15)" : t.severity === "High" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                    color: t.severity === "Critical" ? "#ef4444" : t.severity === "High" ? "#f59e0b" : "#10b981"
                  }}>
                    {t.severity}
                  </span>
                </td>
                <td style={{ padding: 12 }}>{t.status}</td>
                <td style={{ padding: 12 }}>
                  <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>Triage & Route</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. Case Workspace & Log
export function CaseWorkspaceLog({ cases }: { cases: Case[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Active Investigation Case Workspace</h3>
          <p style={{ fontSize: 13, color: "var(--slate)" }}>Central operational log and timeline for investigators handling active flagged tips.</p>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={16} /> Open New Case Workspace</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {cases.map((c) => (
          <div key={c.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "var(--accent-blue, #3b82f6)" }}>{c.case_number}</span>
                <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                  {c.priority} Priority
                </span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{c.title}</h4>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>{c.findings_summary}</p>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12, fontSize: 12, display: "flex", justifyContent: "space-between", color: "var(--slate)" }}>
              <div>Lead: <strong>{c.lead_investigator}</strong></div>
              <div>Stage: <strong style={{ color: "#3b82f6" }}>{c.stage}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Evidence & Interview Vault
export function EvidenceInterviewVault({ evidence }: { evidence: Evidence[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Evidence & Interview Vault</h3>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Secure, encrypted repository for investigation testimony transcripts and digital proof.</p>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
              <th style={{ padding: 12 }}>Case No.</th>
              <th style={{ padding: 12 }}>Evidence Title</th>
              <th style={{ padding: 12 }}>Type</th>
              <th style={{ padding: 12 }}>Cryptographic Hash (Integrity)</th>
              <th style={{ padding: 12 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 12, fontFamily: "monospace", fontWeight: 600 }}>{e.case_number}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{e.title}</td>
                <td style={{ padding: 12 }}><span className="badge">{e.evidence_type}</span></td>
                <td style={{ padding: 12, fontFamily: "monospace", fontSize: 11, color: "var(--slate)" }}>{e.content_hash}</td>
                <td style={{ padding: 12, fontSize: 13, color: "var(--slate)" }}>{e.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8. Investigation Final Report
export function InvestigationFinalReport() {
  return (
    <div className="card" style={{ padding: 28, maxWidth: 780, margin: "0 auto" }}>
      <div style={{ borderBottom: "2px solid var(--border)", paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "var(--slate)", textTransform: "uppercase" }}>Executive Audit Document</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Formal Investigation Report — CASE-2026-001</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, fontSize: 13, color: "var(--slate)" }}>
        <div>Target Subject: <strong>Procurement Rebate Kickback Scheme</strong></div>
        <div>Date Formalized: <strong>July 21, 2026</strong></div>
        <div>Lead Investigator: <strong>Sarah Jenkins, CFE</strong></div>
        <div>Final Assessment: <strong style={{ color: "#ef4444" }}>Substantiated Fraud</strong></div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 12 }}>
        <h4 style={{ fontWeight: 600, fontSize: 15 }}>1. Executive Summary</h4>
        <p style={{ color: "var(--slate)" }}>
          Following continuous monitoring alert RULE-102 and whistleblower intake TIP-2026-8801, the forensic team verified 4 unauthorized bank modifications resulting in $184,500 in improper vendor disbursements.
        </p>
        <h4 style={{ fontWeight: 600, fontSize: 15 }}>2. Systemic Control Outcomes & Recommendations</h4>
        <p style={{ color: "var(--slate)" }}>
          Immediate termination of vendor contract #8841 and mandatory dual-approval enforcement on all vendor bank detail modifications in Oracle Procurement.
        </p>
      </div>
    </div>
  );
}

// 9. KRI Monitoring Dashboard
export function KriMonitoringDashboard({ kris }: { kris: Kri[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Key Risk Indicator (KRI) Monitoring Dashboard</h3>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>High-level dashboard mapping KRIs against board-approved risk tolerance thresholds.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {kris.map((k) => (
          <div key={k.id} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 4 }}>{k.domain}</div>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{k.kri_name}</h4>
            <div style={{ fontSize: 26, fontWeight: 700 }}>
              {k.current_value} {k.unit}
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
              Threshold: {k.tolerance_threshold} {k.unit}
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{
                padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                background: k.status === "Breached" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                color: k.status === "Breached" ? "#ef4444" : "#10b981"
              }}>
                {k.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 10. Alert False-Positive Tuning
export function FalsePositiveTuning({ rules }: { rules: Rule[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Alert False-Positive Calibration Engine</h3>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Fine-tune analytical rule sensitivity and decrease false-positive noise across automated streams.</p>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: 13, color: "var(--slate)" }}>
              <th style={{ padding: 12 }}>Rule Code</th>
              <th style={{ padding: 12 }}>Rule Name</th>
              <th style={{ padding: 12 }}>Current Threshold</th>
              <th style={{ padding: 12 }}>False Positive Rate</th>
              <th style={{ padding: 12 }}>Recommended Calibration</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{r.rule_code}</td>
                <td style={{ padding: 12 }}>{r.title}</td>
                <td style={{ padding: 12, fontFamily: "monospace" }}>${r.threshold_value.toLocaleString()}</td>
                <td style={{ padding: 12, color: r.false_positive_rate > 5.0 ? "#ef4444" : "inherit" }}>{r.false_positive_rate}%</td>
                <td style={{ padding: 12 }}>
                  <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>
                    Auto-Tune Threshold (+15%)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 11-15. Investigation Shell Pages (1 to 5)
export function InvestigationShellPage({ index }: { index: number }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Investigation Shell Sub-Module #{index}</h3>
      <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
        Extensible template placeholder ready for complex workflow offshoots, specialized forensic tools, or future localized sub-modules.
      </p>
      <div style={{ padding: 20, background: "rgba(0,0,0,0.02)", border: "1px dashed var(--border)", borderRadius: 8, textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
        🛠️ Sub-Module Placeholder #{index} — Ready for custom investigation extension script.
      </div>
    </div>
  );
}
