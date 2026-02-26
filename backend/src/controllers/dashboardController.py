from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import Optional


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


def _get_start_date(period: str) -> datetime:
    """Calcula data de início baseada no período"""
    now = datetime.utcnow()
    
    if period == "7d":
        return now - timedelta(days=7)
    elif period == "30d":
        return now - timedelta(days=30)
    elif period == "12m":
        return now - timedelta(days=365)
    else:
        # Default para 30 dias
        return now - timedelta(days=30)


def _get_leads_by_month(db: Session, start_date: datetime) -> list:
    """Busca leads agrupados por mês para o gráfico"""
    rows = db.execute(
        text(
            """
            SELECT
                DATE_TRUNC('month', created_at) AS month,
                COUNT(*) AS total
            FROM leads
            WHERE created_at >= :start_date
            GROUP BY month
            ORDER BY month
            """
        ),
        {"start_date": start_date}
    ).all()
    
    return [
        {"month": str(row[0].date()), "total": int(row[1])}
        for row in rows
    ]


def _get_estimated_revenue(db: Session, start_date: datetime) -> Optional[float]:
    """Calcula receita estimada somando valor dos leads fechados"""
    result = db.execute(
        text(
            """
            SELECT SUM(value)
            FROM leads
            WHERE status = 'fechado'
              AND converted_at IS NOT NULL
              AND converted_at >= :start_date
              AND value IS NOT NULL
            """
        ),
        {"start_date": start_date}
    ).scalar()
    
    return float(result) if result else 0


def _get_conversion_rate(db: Session, start_date: datetime) -> Optional[float]:
    """Calcula taxa de conversão (leads fechados / total leads) * 100"""
    # Total leads no período
    total_leads = db.execute(
        text("SELECT COUNT(*) FROM leads WHERE created_at >= :start_date"),
        {"start_date": start_date}
    ).scalar() or 0
    
    if total_leads == 0:
        return 0
    
    # Leads fechados no período
    closed_leads = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM leads
            WHERE status = 'fechado'
              AND converted_at IS NOT NULL
              AND converted_at >= :start_date
            """
        ),
        {"start_date": start_date}
    ).scalar() or 0
    
    return round((closed_leads / total_leads) * 100, 2)


def _get_corretores_ranking(db: Session, start_date: datetime) -> list:
    """Busca ranking de corretores por valor de negócios fechados"""
    rows = db.execute(
        text(
            """
            SELECT
                "Users".id,
                "Users".full_name,
                COUNT(leads.id) AS closed_deals,
                COALESCE(SUM(leads.value), 0) AS total_value
            FROM leads
            JOIN "Users" ON "Users".id = leads.assigned_to
            WHERE leads.status = 'fechado'
              AND leads.converted_at IS NOT NULL
              AND leads.converted_at >= :start_date
              AND leads.assigned_to IS NOT NULL
            GROUP BY "Users".id, "Users".full_name
            ORDER BY total_value DESC
            """
        ),
        {"start_date": start_date}
    ).all()
    
    return [
        {
            "id": str(row[0]),
            "name": str(row[1]),
            "closedDeals": int(row[2]),
            "totalValue": float(row[3] or 0)
        }
        for row in rows
    ]


def get_dashboard_overview(db: Session, period: str = "30d"):
    # Calcular data de início baseada no período
    start_date = _get_start_date(period)
    
    # Leads por mês (para gráfico)
    leads_by_month = _get_leads_by_month(db, start_date)
    
    # Receita estimada
    estimated_revenue = _get_estimated_revenue(db, start_date)
    
    # Taxa de conversão
    conversion_rate = _get_conversion_rate(db, start_date)
    
    # Ranking de corretores
    ranking = _get_corretores_ranking(db, start_date)
    
    # Totais existentes (mantidos para compatibilidade)
    total_leads = db.execute(text("SELECT COUNT(*) FROM leads WHERE created_at >= :start_date"), {"start_date": start_date}).scalar() or 0

    # Leads por status
    rows = db.execute(
        text(
            """
            SELECT status, COUNT(*)
            FROM leads
            WHERE created_at >= :start_date
            GROUP BY status
            """
        ),
        {"start_date": start_date}
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

    # Conversas não lidas (temporariamente desativado - colunas não existem)
    unread_conversations = 0

    # Convertidos no período
    converted_this_period = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM leads
            WHERE status = 'fechado'
              AND converted_at IS NOT NULL
              AND converted_at >= :start_date
            """
        ),
        {"start_date": start_date}
    ).scalar() or 0

    return {
        "totals": {
            "totalLeads": int(total_leads),
            "leadsByStatus": leads_by_status,
            "totalProperties": int(total_properties),
            "activeProperties": int(active_properties),
            "unreadConversations": int(unread_conversations),
            "convertedThisPeriod": int(converted_this_period),
        },
        "leadsByMonth": leads_by_month,
        "estimatedRevenue": float(estimated_revenue or 0),
        "conversionRate": float(conversion_rate or 0),
        "ranking": ranking
    }