from sqlalchemy.orm import Session
from sqlalchemy import text


def _column_exists(db: Session, table_name: str, column_name: str) -> bool:
    q = text(
        """
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = :table_name
          AND column_name = :column_name
        LIMIT 1
        """
    )
    return db.execute(q, {"table_name": table_name, "column_name": column_name}).first() is not None


def get_dashboard_overview(db: Session):
    # Total de Leads
    total_leads = db.execute(text("SELECT COUNT(*) FROM leads")).scalar() or 0

    # Leads por status
    rows = db.execute(
        text(
            """
            SELECT status, COUNT(*)
            FROM leads
            GROUP BY status
            """
        )
    ).all()

    leads_by_status = {
        "novo": 0,
        "em_atendimento": 0,
        "proposta_enviada": 0,
        "fechado": 0,
        "perdido": 0,
    }

    for status, count in rows:
        if status:
            leads_by_status[str(status)] = int(count or 0)

    # Total de Imóveis
    total_properties = db.execute(text("SELECT COUNT(*) FROM properties")).scalar() or 0

    # Imóveis ativos (auto-detect)
    active_properties = 0

    # Caso 1: booleanos comuns
    if _column_exists(db, "properties", "is_active"):
        active_properties = db.execute(
            text("SELECT COUNT(*) FROM properties WHERE is_active = true")
        ).scalar() or 0

    elif _column_exists(db, "properties", "active"):
        active_properties = db.execute(
            text("SELECT COUNT(*) FROM properties WHERE active = true")
        ).scalar() or 0

    elif _column_exists(db, "properties", "is_available"):
        active_properties = db.execute(
            text("SELECT COUNT(*) FROM properties WHERE is_available = true")
        ).scalar() or 0

    # Caso 2: status (ENUM ou TEXT) -> comparar como texto para não explodir enum
    elif _column_exists(db, "properties", "status"):
        active_properties = db.execute(
            text(
                """
                SELECT COUNT(*)
                FROM properties
                WHERE status::text IN ('ativo', 'active', 'published', 'disponivel', 'disponível')
                """
            )
        ).scalar() or 0

    # Caso 3: fallback sem quebrar
    else:
        active_properties = 0

    # Conversas não lidas
    unread_conversations = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM conversations
            WHERE unread_count > 0
              AND is_archived = false
            """
        )
    ).scalar() or 0

    # Convertidos no mês
    converted_this_month = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM leads
            WHERE status = 'fechado'
              AND converted_at IS NOT NULL
              AND DATE_TRUNC('month', converted_at) = DATE_TRUNC('month', NOW())
            """
        )
    ).scalar() or 0

    return {
        "totalLeads": int(total_leads),
        "leadsByStatus": leads_by_status,
        "totalProperties": int(total_properties),
        "activeProperties": int(active_properties),
        "unreadConversations": int(unread_conversations),
        "convertedThisMonth": int(converted_this_month),
    }