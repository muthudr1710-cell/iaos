from pydantic import BaseModel
from typing import Optional, List


# ── Rules ──
class RuleCreate(BaseModel):
    rule_code: str
    title: str
    description: str = ""
    stream: str = "General Ledger"
    threshold_value: float = 10000.0
    risk_score: int = 50
    is_active: bool = True
    false_positive_rate: float = 0.0


class RuleOut(RuleCreate):
    id: int
    model_config = {"from_attributes": True}


# ── Ingestion Monitor ──
class IngestionOut(BaseModel):
    id: int
    connector_name: str
    target_stream: str
    status: str
    latency_ms: int
    error_count: int
    last_sync: str
    model_config = {"from_attributes": True}


# ── Whistleblower Tips ──
class TipCreate(BaseModel):
    category: str
    subject: str
    details: str
    is_anonymous: bool = True
    complainant_contact: str = "[Anonymous]"
    credibility_grade: str = "Pending"
    severity: str = "Medium"
    attachment_count: int = 0


class TipOut(TipCreate):
    id: int
    tracking_code: str
    status: str
    model_config = {"from_attributes": True}


# ── Case Workspace ──
class CaseCreate(BaseModel):
    title: str
    lead_investigator: str = "Unassigned"
    stage: str = "Evidence Gathering"
    priority: str = "High"
    findings_summary: str = ""
    status: str = "Active"


class CaseOut(CaseCreate):
    id: int
    case_number: str
    model_config = {"from_attributes": True}


# ── Evidence ──
class EvidenceCreate(BaseModel):
    case_number: str
    evidence_type: str
    title: str
    notes: str = ""


class EvidenceOut(EvidenceCreate):
    id: int
    content_hash: str
    model_config = {"from_attributes": True}


# ── KRIs ──
class KriOut(BaseModel):
    id: int
    kri_name: str
    domain: str
    current_value: float
    tolerance_threshold: float
    unit: str
    status: str
    model_config = {"from_attributes": True}


# ── Audit Shell Item ──
class AuditShellItemCreate(BaseModel):
    screen_key: str
    title: str
    category: str = "General"
    status: str = "Active"
    details_json: str = "{}"


class AuditShellItemOut(AuditShellItemCreate):
    id: int
    model_config = {"from_attributes": True}
