import React, { useEffect, useState } from "react";
import { get, post } from "../../lib/api";
import { Icon } from "../../components/Icon";
import {
  RealTimeAnalyticsCockpit,
  RuleEngineConfig,
  DataIngestionMonitor,
  WhistleblowerIntakePortal,
  TriageSeverityClassifier,
  CaseWorkspaceLog,
  EvidenceInterviewVault,
  InvestigationFinalReport,
  KriMonitoringDashboard,
  FalsePositiveTuning,
  InvestigationShellPage,
  Tip,
  Rule,
  Ingestion,
  Case,
  Evidence,
  Kri,
} from "./components/SubPagesPartA";
import { StandardAuditShellScreen, AuditShellItem } from "./components/SubPagesPartB";

const SLUG = "continuous_auditing_whistleblowing";

export default function ContinuousAuditingWhistleblowingPage() {
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [rules, setRules] = useState<Rule[]>([]);
  const [ingestion, setIngestion] = useState<Ingestion[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [kris, setKris] = useState<Kri[]>([]);
  const [shellItems, setShellItems] = useState<AuditShellItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadData() {
    try {
      setLoading(true);
      const [rData, iData, tData, cData, eData, kData, sData] = await Promise.all([
        get<Rule[]>(`/api/modules/${SLUG}/rules`),
        get<Ingestion[]>(`/api/modules/${SLUG}/ingestion`),
        get<Tip[]>(`/api/modules/${SLUG}/whistleblower`),
        get<Case[]>(`/api/modules/${SLUG}/cases`),
        get<Evidence[]>(`/api/modules/${SLUG}/evidence`),
        get<Kri[]>(`/api/modules/${SLUG}/kris`),
        get<AuditShellItem[]>(`/api/modules/${SLUG}/shell-items`),
      ]);
      setRules(rData);
      setIngestion(iData);
      setTips(tData);
      setCases(cData);
      setEvidence(eData);
      setKris(kData);
      setShellItems(sData);
    } catch (err) {
      console.error("Failed to load module data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddRule(newRule: Omit<Rule, "id">) {
    await post(`/api/modules/${SLUG}/rules`, newRule);
    loadData();
  }

  async function handleAddTip(newTip: Omit<Tip, "id" | "tracking_code" | "status">) {
    await post(`/api/modules/${SLUG}/whistleblower`, newTip);
    loadData();
  }

  async function handleAddShellItem(title: string, category: string) {
    let key = "scope";
    if (activeScreen === 17) key = "scope";
    else if (activeScreen === 18) key = "rcm";
    else if (activeScreen === 21) key = "sampling";
    else if (activeScreen === 22) key = "red_flags";
    else if (activeScreen === 24) key = "observations";
    else if (activeScreen === 25) key = "remediation";

    await post(`/api/modules/${SLUG}/shell-items`, {
      screen_key: key,
      title,
      category,
      status: "Active",
      details_json: JSON.stringify({ created: new Date().toISOString().split("T")[0] }),
    });
    loadData();
  }

  const screenGroups = [
    {
      group: "1. Real-Time Analytics & Monitoring",
      screens: [
        { id: 1, name: "1. Real-Time Analytics Cockpit" },
        { id: 2, name: "2. Rule Engine & Trigger Configs" },
        { id: 3, name: "3. Data Ingestion Status Monitor" },
        { id: 9, name: "9. KRI Monitoring Dashboard" },
        { id: 10, name: "10. Alert False-Positive Tuning" },
      ],
    },
    {
      group: "2. Whistleblower & Case Investigation",
      screens: [
        { id: 4, name: "4. Whistleblower Intake Portal" },
        { id: 5, name: "5. Triage & Severity Classifier" },
        { id: 6, name: "6. Case Workspace & Log" },
        { id: 7, name: "7. Evidence & Interview Vault" },
        { id: 8, name: "8. Investigation Final Report" },
        { id: 11, name: "11. Investigation Shell #1" },
        { id: 12, name: "12. Investigation Shell #2" },
        { id: 13, name: "13. Investigation Shell #3" },
        { id: 14, name: "14. Investigation Shell #4" },
        { id: 15, name: "15. Investigation Shell #5" },
      ],
    },
    {
      group: "3. Audit Shell & Core Controls",
      screens: [
        { id: 16, name: "16. Module Overview Dashboard" },
        { id: 17, name: "17. Scope & Audit Universe" },
        { id: 18, name: "18. Risk & Control Matrix (RCM)" },
        { id: 19, name: "19. Test & Analytics Rule Library" },
        { id: 20, name: "20. Data Source & Connector Setup" },
        { id: 21, name: "21. Sampling & Population Builder" },
      ],
    },
    {
      group: "4. Fieldwork, Exceptions & Remediation",
      screens: [
        { id: 22, name: "22. Exception & Red-Flag Queue" },
        { id: 23, name: "23. Working Papers & Evidence" },
        { id: 24, name: "24. Observation & Finding Log" },
        { id: 25, name: "25. Remediation / Action Tracker" },
      ],
    },
  ];

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#3b82f6", textTransform: "uppercase" }}>Module 13 • Governance & Audit Management</span>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 4, margin: 0, color: "#fff" }}>Continuous Auditing & Whistleblowing</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, margin: 0 }}>
              Automated real-time anomaly detection, encrypted tip ingestion engine, and complete 25-screen case investigation suite.
            </p>
          </div>
          <button className="btn btn-ghost" style={{ color: "#fff", borderColor: "#475569" }} onClick={loadData}>
            <Icon name="activity" size={16} /> Refresh Feeds
          </button>
        </div>
      </div>

      {/* Sub-Navigation Selector (25 Screens) */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", marginBottom: 12 }}>
          Sub-Page Selector (25 Specification Screens)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {screenGroups.map((grp) => (
            <div key={grp.group} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-blue, #3b82f6)" }}>{grp.group}</div>
              <select
                className="input"
                style={{ fontSize: 12, padding: "6px 8px" }}
                value={grp.screens.some((s) => s.id === activeScreen) ? activeScreen : ""}
                onChange={(e) => {
                  if (e.target.value) setActiveScreen(Number(e.target.value));
                }}
              >
                <option value="" disabled>-- Select Screen --</option>
                {grp.screens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--slate)" }}>
          Loading Continuous Auditing & Whistleblowing feeds...
        </div>
      ) : (
        <div>
          {/* Part A Screens */}
          {activeScreen === 1 && <RealTimeAnalyticsCockpit rules={rules} ingestion={ingestion} tips={tips} />}
          {activeScreen === 2 && <RuleEngineConfig rules={rules} onAddRule={handleAddRule} />}
          {activeScreen === 3 && <DataIngestionMonitor ingestion={ingestion} />}
          {activeScreen === 4 && <WhistleblowerIntakePortal onAddTip={handleAddTip} />}
          {activeScreen === 5 && <TriageSeverityClassifier tips={tips} />}
          {activeScreen === 6 && <CaseWorkspaceLog cases={cases} />}
          {activeScreen === 7 && <EvidenceInterviewVault evidence={evidence} />}
          {activeScreen === 8 && <InvestigationFinalReport />}
          {activeScreen === 9 && <KriMonitoringDashboard kris={kris} />}
          {activeScreen === 10 && <FalsePositiveTuning rules={rules} />}
          {activeScreen >= 11 && activeScreen <= 15 && <InvestigationShellPage index={activeScreen - 10} />}

          {/* Part B Screens */}
          {activeScreen === 16 && (
            <StandardAuditShellScreen
              screenKey="overview"
              screenTitle="16. Module Overview Dashboard"
              description="High-level executive summary of active continuous monitoring alerts and whistleblower cases."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 17 && (
            <StandardAuditShellScreen
              screenKey="scope"
              screenTitle="17. Scope & Audit Universe"
              description="Define target transaction streams, legal entities, and auditable units under real-time monitoring."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 18 && (
            <StandardAuditShellScreen
              screenKey="rcm"
              screenTitle="18. Risk & Control Matrix (RCM)"
              description="Central catalog defining continuous risks, internal controls, financial assertions, and system owners."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 19 && (
            <StandardAuditShellScreen
              screenKey="rcm"
              screenTitle="19. Test & Analytics Rule Library"
              description="Central library to manage and configure automated red-flag rules and custom script repositories."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 20 && (
            <StandardAuditShellScreen
              screenKey="scope"
              screenTitle="20. Data Source & Connector Setup"
              description="Data mapping interface connecting target tables, external ERP databases, and webhooks."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 21 && (
            <StandardAuditShellScreen
              screenKey="sampling"
              screenTitle="21. Sampling & Population Builder"
              description="Tooling to pull statistical, targeted, or Benford-law transaction samples out of the total population."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 22 && (
            <StandardAuditShellScreen
              screenKey="red_flags"
              screenTitle="22. Exception & Red-Flag Queue"
              description="Actionable workspace triage queue for manual review, allocation, and disposition of alerts."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 23 && (
            <StandardAuditShellScreen
              screenKey="red_flags"
              screenTitle="23. Working Papers & Evidence"
              description="Workpaper attachment panel with integrated digital review sign-offs and reviewer tags."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 24 && (
            <StandardAuditShellScreen
              screenKey="observations"
              screenTitle="24. Observation & Finding Log"
              description="Incident tracker to raise, grade, and route newly exposed process vulnerabilities or audit observations."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
          {activeScreen === 25 && (
            <StandardAuditShellScreen
              screenKey="remediation"
              screenTitle="25. Remediation / Action Tracker"
              description="Verification console to track corrective actions and management implementation timelines."
              items={shellItems}
              onAddItem={handleAddShellItem}
            />
          )}
        </div>
      )}
    </div>
  );
}
