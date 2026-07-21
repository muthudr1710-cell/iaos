"""Module API. Mounted automatically at /api/modules/continuous_auditing_whistleblowing.

Every route is tenant-isolated via `tenant_scoped()` + `CurrentUser`.
"""
import random
import uuid
from fastapi import APIRouter, HTTPException
from typing import List

from app.api.deps import CurrentUser, DbSession
from app.core.tenancy import tenant_scoped

from .models import (
    CawRule,
    CawIngestionMonitor,
    CawTip,
    CawCase,
    CawEvidence,
    CawKriMetric,
    CawAuditShellItem,
)
from .schemas import (
    RuleCreate,
    RuleOut,
    IngestionOut,
    TipCreate,
    TipOut,
    CaseCreate,
    CaseOut,
    EvidenceCreate,
    EvidenceOut,
    KriOut,
    AuditShellItemCreate,
    AuditShellItemOut,
)

MANIFEST = {
    "name": "continuous_auditing_whistleblowing",
    "title": "Continuous Auditing & Whistleblowing",
    "description": "Real-time anomaly detection, whistleblower tip ingestion engine, and investigation case workflow.",
    "icon": "shield",
    "group": "Governance & Audit Management",
    "industry": "",
    "version": "1.0.0",
    "owner": "intern-13",
}

router = APIRouter()


# Helper to seed default data if empty for a tenant
def seed_demo_data_if_needed(db: DbSession, tenant_id: int):
    # Seed Rules
    rule_count = db.query(CawRule).filter(CawRule.tenant_id == tenant_id).count()
    if rule_count == 0:
        demo_rules = [
            CawRule(tenant_id=tenant_id, rule_code="RULE-101", title="Off-Hours ERP Journal Entry > $50k", stream="General Ledger", threshold_value=50000.0, risk_score=85, false_positive_rate=4.2),
            CawRule(tenant_id=tenant_id, rule_code="RULE-102", title="Duplicate Vendor Bank Account Match", stream="Procure-to-Pay", threshold_value=0.0, risk_score=95, false_positive_rate=1.5),
            CawRule(tenant_id=tenant_id, rule_code="RULE-103", title="Split PO Below Approval Limit ($10k)", stream="Purchase Orders", threshold_value=9900.0, risk_score=75, false_positive_rate=6.8),
            CawRule(tenant_id=tenant_id, rule_code="RULE-104", title="Unusual Weekend Wire Transfers", stream="Treasury & Banking", threshold_value=25000.0, risk_score=90, false_positive_rate=2.1),
            CawRule(tenant_id=tenant_id, rule_code="RULE-105", title="Inactive Employee Payroll Disbursement", stream="Payroll & HR", threshold_value=1.0, risk_score=98, false_positive_rate=0.5),
        ]
        db.add_all(demo_rules)

    # Seed Ingestion Monitors
    ing_count = db.query(CawIngestionMonitor).filter(CawIngestionMonitor.tenant_id == tenant_id).count()
    if ing_count == 0:
        demo_ings = [
            CawIngestionMonitor(tenant_id=tenant_id, connector_name="SAP ECC Financials", target_stream="GL_POSTINGS_STREAM", status="Healthy", latency_ms=32, error_count=0, last_sync="2 mins ago"),
            CawIngestionMonitor(tenant_id=tenant_id, connector_name="Oracle Cloud Procurement", target_stream="P2P_PO_STREAM", status="Healthy", latency_ms=48, error_count=0, last_sync="5 mins ago"),
            CawIngestionMonitor(tenant_id=tenant_id, connector_name="Workday Payroll Webhook", target_stream="PAYROLL_DISBURSEMENT", status="Degraded", latency_ms=420, error_count=3, last_sync="12 mins ago"),
            CawIngestionMonitor(tenant_id=tenant_id, connector_name="Salesforce CRM Invoicing", target_stream="O2C_INVOICE_STREAM", status="Healthy", latency_ms=28, error_count=0, last_sync="1 min ago"),
        ]
        db.add_all(demo_ings)

    # Seed Whistleblower Tips
    tip_count = db.query(CawTip).filter(CawTip.tenant_id == tenant_id).count()
    if tip_count == 0:
        demo_tips = [
            CawTip(tenant_id=tenant_id, tracking_code="TIP-2026-8801", category="Financial Fraud", subject="Off-book rebates arranged by Regional Procurement Director", details="Vendor X was paid inflated rates in exchange for cash kickbacks to personal account.", is_anonymous=True, complainant_contact="[Anonymous]", credibility_grade="Critical", severity="Critical", status="In Case", attachment_count=3),
            CawTip(tenant_id=tenant_id, tracking_code="TIP-2026-8802", category="SOD Violation", subject="Finance Lead approving their own expense vouchers", details="User J. Doe bypassed two-factor authorization to approve personal travel expenses.", is_anonymous=False, complainant_contact="internal.whistleblower@corp.org", credibility_grade="Credible", severity="High", status="Triaged", attachment_count=1),
            CawTip(tenant_id=tenant_id, tracking_code="TIP-2026-8803", category="Inventory Misstatement", subject="Warehouse scrap material diverted and sold off-record", details="Scrap metals from Plant B are being loaded into unlisted trucks every Friday evening.", is_anonymous=True, complainant_contact="[Anonymous]", credibility_grade="Medium Risk", severity="Medium", status="New Intake", attachment_count=2),
        ]
        db.add_all(demo_tips)

    # Seed Cases
    case_count = db.query(CawCase).filter(CawCase.tenant_id == tenant_id).count()
    if case_count == 0:
        demo_cases = [
            CawCase(tenant_id=tenant_id, case_number="CASE-2026-001", title="Procurement Rebate Kickback Investigation", lead_investigator="Sarah Jenkins (Senior Forensic Auditor)", stage="Interview Phase", priority="Critical", findings_summary="Initial cross-referencing of wire logs confirms 4 suspect payments matching tip TIP-2026-8801.", status="Active"),
            CawCase(tenant_id=tenant_id, case_number="CASE-2026-002", title="Expense Voucher SOD Bypass Audit", lead_investigator="David Ross (IT Audit Specialist)", stage="Evidence Gathering", priority="High", findings_summary="Audit trail indicates SAP role override executed on 3 consecutive weekends.", status="Active"),
        ]
        db.add_all(demo_cases)

    # Seed Evidence
    ev_count = db.query(CawEvidence).filter(CawEvidence.tenant_id == tenant_id).count()
    if ev_count == 0:
        demo_ev = [
            CawEvidence(tenant_id=tenant_id, case_number="CASE-2026-001", evidence_type="Transcript", title="Interview Transcript — Senior Buyer J. Smith", content_hash="SHA256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", notes="Witness confirmed unusual override requests from department head."),
            CawEvidence(tenant_id=tenant_id, case_number="CASE-2026-001", evidence_type="Ledger Export", title="Bank Wire Transaction Extract Q1-2026", content_hash="SHA256-8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4", notes="Highlights 4 payments totaling $184,500."),
        ]
        db.add_all(demo_ev)

    # Seed KRIs
    kri_count = db.query(CawKriMetric).filter(CawKriMetric.tenant_id == tenant_id).count()
    if kri_count == 0:
        demo_kris = [
            CawKriMetric(tenant_id=tenant_id, kri_name="Continuous Monitoring Exception Rate", domain="Transactions", current_value=2.4, tolerance_threshold=1.5, unit="%", status="Breached"),
            CawKriMetric(tenant_id=tenant_id, kri_name="Whistleblower Tip Triage SLA", domain="Governance", current_value=18.0, tolerance_threshold=24.0, unit="Hours", status="Normal"),
            CawKriMetric(tenant_id=tenant_id, kri_name="Unresolved High-Severity Cases", domain="Investigations", current_value=3.0, tolerance_threshold=5.0, unit="Cases", status="Normal"),
            CawKriMetric(tenant_id=tenant_id, kri_name="Connector Pipeline Down-Time", domain="Data Health", current_value=0.04, tolerance_threshold=0.1, unit="%", status="Normal"),
        ]
        db.add_all(demo_kris)

    # Seed Audit Shell Items
    shell_count = db.query(CawAuditShellItem).filter(CawAuditShellItem.tenant_id == tenant_id).count()
    if shell_count == 0:
        demo_shell = [
            CawAuditShellItem(tenant_id=tenant_id, screen_key="scope", title="Enterprise Continuous Auditing Universe FY26", category="Scope", status="Approved", details_json='{"units": 18, "transactions_coverage": "94.2%"}'),
            CawAuditShellItem(tenant_id=tenant_id, screen_key="rcm", title="RCM-CAW-01: Unauthorized Manual GL Postings", category="Risk & Control", status="Active", details_json='{"risk_rating": "High", "control_owner": "Controller"}'),
            CawAuditShellItem(tenant_id=tenant_id, screen_key="sampling", title="Benford Law High Risk Sample Population", category="Sampling", status="Executed", details_json='{"population": 45000, "sample_size": 150}'),
            CawAuditShellItem(tenant_id=tenant_id, screen_key="red_flags", title="Red Flag Exception #4092: Vendor Tax ID Altered", category="Exception Queue", status="Under Review", details_json='{"vendor": "Acme Industrial", "changed_by": "J. Doe"}'),
            CawAuditShellItem(tenant_id=tenant_id, screen_key="observations", title="OBS-2026-03: Lack of dual authorization for emergency wire transfers", category="Observation Log", status="Open", details_json='{"severity": "High", "target_date": "2026-08-30"}'),
            CawAuditShellItem(tenant_id=tenant_id, screen_key="remediation", title="ACT-2026-11: Enforce mandatory 2FA on Workday Payroll Webhook", category="Action Tracker", status="In Progress", details_json='{"assigned_to": "InfoSec Team", "due": "2026-08-15"}'),
        ]
        db.add_all(demo_shell)

    db.commit()


# ── Rules API ──
@router.get("/rules", response_model=List[RuleOut])
def get_rules(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawRule), current_user)
    return [RuleOut.model_validate(r) for r in q.order_by(CawRule.id.desc()).all()]


@router.post("/rules", response_model=RuleOut, status_code=201)
def create_rule(body: RuleCreate, current_user: CurrentUser, db: DbSession):
    rule = CawRule(
        tenant_id=current_user.tenant_id,
        rule_code=body.rule_code,
        title=body.title,
        description=body.description,
        stream=body.stream,
        threshold_value=body.threshold_value,
        risk_score=body.risk_score,
        is_active=body.is_active,
        false_positive_rate=body.false_positive_rate,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return RuleOut.model_validate(rule)


# ── Ingestion API ──
@router.get("/ingestion", response_model=List[IngestionOut])
def get_ingestion_monitors(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawIngestionMonitor), current_user)
    return [IngestionOut.model_validate(i) for i in q.order_by(CawIngestionMonitor.id).all()]


# ── Tips API ──
@router.get("/whistleblower", response_model=List[TipOut])
def get_tips(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawTip), current_user)
    return [TipOut.model_validate(t) for t in q.order_by(CawTip.id.desc()).all()]


@router.post("/whistleblower", response_model=TipOut, status_code=201)
def create_tip(body: TipCreate, current_user: CurrentUser, db: DbSession):
    code = f"TIP-2026-{random.randint(1000, 9999)}"
    tip = CawTip(
        tenant_id=current_user.tenant_id,
        tracking_code=code,
        category=body.category,
        subject=body.subject,
        details=body.details,
        is_anonymous=body.is_anonymous,
        complainant_contact=body.complainant_contact if not body.is_anonymous else "[Anonymous]",
        credibility_grade=body.credibility_grade,
        severity=body.severity,
        status="New Intake",
        attachment_count=body.attachment_count,
    )
    db.add(tip)
    db.commit()
    db.refresh(tip)
    return TipOut.model_validate(tip)


# ── Cases API ──
@router.get("/cases", response_model=List[CaseOut])
def get_cases(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawCase), current_user)
    return [CaseOut.model_validate(c) for c in q.order_by(CawCase.id.desc()).all()]


@router.post("/cases", response_model=CaseOut, status_code=201)
def create_case(body: CaseCreate, current_user: CurrentUser, db: DbSession):
    num = f"CASE-2026-{random.randint(100, 999)}"
    c = CawCase(
        tenant_id=current_user.tenant_id,
        case_number=num,
        title=body.title,
        lead_investigator=body.lead_investigator,
        stage=body.stage,
        priority=body.priority,
        findings_summary=body.findings_summary,
        status=body.status,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return CaseOut.model_validate(c)


# ── Evidence API ──
@router.get("/evidence", response_model=List[EvidenceOut])
def get_evidence(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawEvidence), current_user)
    return [EvidenceOut.model_validate(e) for e in q.order_by(CawEvidence.id.desc()).all()]


@router.post("/evidence", response_model=EvidenceOut, status_code=201)
def create_evidence(body: EvidenceCreate, current_user: CurrentUser, db: DbSession):
    hash_val = f"SHA256-{uuid.uuid4().hex[:16]}"
    ev = CawEvidence(
        tenant_id=current_user.tenant_id,
        case_number=body.case_number,
        evidence_type=body.evidence_type,
        title=body.title,
        content_hash=hash_val,
        notes=body.notes,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return EvidenceOut.model_validate(ev)


# ── KRIs API ──
@router.get("/kris", response_model=List[KriOut])
def get_kris(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawKriMetric), current_user)
    return [KriOut.model_validate(k) for k in q.order_by(CawKriMetric.id).all()]


# ── Audit Shell API ──
@router.get("/shell-items", response_model=List[AuditShellItemOut])
def get_shell_items(current_user: CurrentUser, db: DbSession):
    seed_demo_data_if_needed(db, current_user.tenant_id)
    q = tenant_scoped(db.query(CawAuditShellItem), current_user)
    return [AuditShellItemOut.model_validate(s) for s in q.order_by(CawAuditShellItem.id.desc()).all()]


@router.post("/shell-items", response_model=AuditShellItemOut, status_code=201)
def create_shell_item(body: AuditShellItemCreate, current_user: CurrentUser, db: DbSession):
    item = CawAuditShellItem(
        tenant_id=current_user.tenant_id,
        screen_key=body.screen_key,
        title=body.title,
        category=body.category,
        status=body.status,
        details_json=body.details_json,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return AuditShellItemOut.model_validate(item)
