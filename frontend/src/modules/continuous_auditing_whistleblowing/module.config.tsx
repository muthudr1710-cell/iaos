import type { ModuleConfig } from "../registry";
import ContinuousAuditingWhistleblowingPage from "./ContinuousAuditingWhistleblowingPage";

const config: ModuleConfig = {
  slug: "continuous_auditing_whistleblowing",
  title: "Continuous Auditing & Whistleblowing",
  description: "Automates real-time anomaly detection across transaction streams, ingests anonymous whistleblower tips, and orchestrates case investigations.",
  icon: "shield",
  group: "Governance & Audit Management",
  component: ContinuousAuditingWhistleblowingPage,
};

export default config;
