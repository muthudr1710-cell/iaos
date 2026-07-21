"""Module data models for Continuous Auditing & Whistleblowing.

All tables are prefixed with `mod_caw_` and inherit `TenantMixin`.
"""
from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.core.database import Base
from app.core.tenancy import TenantMixin


class CawRule(Base, TenantMixin):
    """Continuous monitoring rule configuration & risk scoring logic."""
    __tablename__ = "mod_caw_rules"

    id: Mapped[int] = mapped_column(primary_key=True)
    rule_code: Mapped[str] = mapped_column(String(50), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    stream: Mapped[str] = mapped_column(String(100), default="General Ledger")
    threshold_value: Mapped[float] = mapped_column(Float, default=10000.0)
    risk_score: Mapped[int] = mapped_column(Integer, default=50)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    false_positive_rate: Mapped[float] = mapped_column(Float, default=0.0)


class CawIngestionMonitor(Base, TenantMixin):
    """Data ingestion health, pipeline latency, and API status."""
    __tablename__ = "mod_caw_ingestion_monitors"

    id: Mapped[int] = mapped_column(primary_key=True)
    connector_name: Mapped[str] = mapped_column(String(100))
    target_stream: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), default="Healthy")  # Healthy, Degraded, Failed
    latency_ms: Mapped[int] = mapped_column(Integer, default=45)
    error_count: Mapped[int] = mapped_column(Integer, default=0)
    last_sync: Mapped[str] = mapped_column(String(100), default="Just now")


class CawTip(Base, TenantMixin):
    """Whistleblower tips & compliance intake complaints."""
    __tablename__ = "mod_caw_tips"

    id: Mapped[int] = mapped_column(primary_key=True)
    tracking_code: Mapped[str] = mapped_column(String(50), index=True)
    category: Mapped[str] = mapped_column(String(100)) # Financial Fraud, SOD Violation, Harassment, etc.
    subject: Mapped[str] = mapped_column(String(255))
    details: Mapped[str] = mapped_column(Text)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=True)
    complainant_contact: Mapped[str] = mapped_column(String(255), default="[Anonymous]")
    credibility_grade: Mapped[str] = mapped_column(String(20), default="Pending") # Credible, Low Risk, Critical
    severity: Mapped[str] = mapped_column(String(20), default="Medium") # Low, Medium, High, Critical
    status: Mapped[str] = mapped_column(String(50), default="New Intake") # New Intake, Triaged, In Case, Closed
    attachment_count: Mapped[int] = mapped_column(Integer, default=0)


class CawCase(Base, TenantMixin):
    """Active investigation workspace case."""
    __tablename__ = "mod_caw_cases"

    id: Mapped[int] = mapped_column(primary_key=True)
    case_number: Mapped[str] = mapped_column(String(50), index=True)
    title: Mapped[str] = mapped_column(String(255))
    lead_investigator: Mapped[str] = mapped_column(String(100), default="Unassigned")
    stage: Mapped[str] = mapped_column(String(50), default="Evidence Gathering") # Triage, Evidence, Interview, Final Report, Closed
    priority: Mapped[str] = mapped_column(String(20), default="High")
    findings_summary: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(50), default="Active")


class CawEvidence(Base, TenantMixin):
    """Encrypted proof, testimony transcripts, cross-references."""
    __tablename__ = "mod_caw_evidence"

    id: Mapped[int] = mapped_column(primary_key=True)
    case_number: Mapped[str] = mapped_column(String(50), index=True)
    evidence_type: Mapped[str] = mapped_column(String(100)) # Transcript, Ledger Export, Audit Log, Interview Notes
    title: Mapped[str] = mapped_column(String(255))
    content_hash: Mapped[str] = mapped_column(String(100), default="SHA256-OK")
    notes: Mapped[str] = mapped_column(Text, default="")


class CawKriMetric(Base, TenantMixin):
    """Key Risk Indicators against risk tolerance thresholds."""
    __tablename__ = "mod_caw_kri_metrics"

    id: Mapped[int] = mapped_column(primary_key=True)
    kri_name: Mapped[str] = mapped_column(String(150))
    domain: Mapped[str] = mapped_column(String(100))
    current_value: Mapped[float] = mapped_column(Float)
    tolerance_threshold: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(50), default="%")
    status: Mapped[str] = mapped_column(String(50), default="Normal") # Normal, Warning, Breached


class CawAuditShellItem(Base, TenantMixin):
    """Generic audit shell items (Scope, RCM, Sampling, Observations, Actions)."""
    __tablename__ = "mod_caw_audit_shell_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    screen_key: Mapped[str] = mapped_column(String(50), index=True) # scope, rcm, sampling, red_flags, workpapers, observations, remediation
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(100), default="General")
    status: Mapped[str] = mapped_column(String(50), default="Active")
    details_json: Mapped[str] = mapped_column(Text, default="{}")
