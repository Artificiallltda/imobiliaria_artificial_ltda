from datetime import datetime
from typing import Optional
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from decimal import Decimal


def generate_dashboard_report(data: dict, period: str, user_name: Optional[str] = None) -> BytesIO:
    """Gera relatório PDF do dashboard"""
    
    # Configurar o documento
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    # Estilos
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1e293b')
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=20,
        textColor=colors.HexColor('#64748b')
    )
    
    normal_style = styles['BodyText']
    header_style = ParagraphStyle(
        'TableHeader',
        parent=normal_style,
        fontSize=12,
        textColor=colors.white,
        alignment=TA_CENTER
    )
    
    # Conteúdo do PDF
    story = []
    
    # Título
    title = "Relatório de Dashboard"
    if user_name:
        title += f" - {user_name}"
    story.append(Paragraph(title, title_style))
    
    # Período
    period_text = {
        "7d": "Últimos 7 dias",
        "30d": "Últimos 30 dias", 
        "12m": "Últimos 12 meses"
    }.get(period, period)
    
    story.append(Paragraph(f"Período: {period_text}", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Métricas Principais
    totals = data.get('totals', {})
    metrics_data = [
        ['Métrica', 'Valor'],
        ['Total de Leads', str(totals.get('totalLeads', 0))],
        ['Receita Estimada', f"R$ {data.get('estimatedRevenue', 0):,.2f}".replace('.', ',').replace(',', 'temp').replace('.', ',').replace('temp', '.')],
        ['Taxa de Conversão', f"{data.get('conversionRate', 0):.1f}%"],
        ['Imóveis Ativos', str(totals.get('activeProperties', 0))],
        ['Convertidos no Período', str(totals.get('convertedThisPeriod', 0))]
    ]
    
    metrics_table = Table(metrics_data, colWidths=[3*inch, 2*inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
    ]))
    
    story.append(metrics_table)
    story.append(Spacer(1, 20))
    
    # Crescimento
    growth = data.get('growth', {})
    if growth:
        story.append(Paragraph("Crescimento Percentual", subtitle_style))
        
        growth_data = [
            ['Indicador', 'Crescimento'],
            ['Leads', f"{growth.get('leads', 0):+.1f}%"],
            ['Receita', f"{growth.get('revenue', 0):+.1f}%"],
            ['Negócios Fechados', f"{growth.get('closed_deals', 0):+.1f}%"]
        ]
        
        growth_table = Table(growth_data, colWidths=[3*inch, 2*inch])
        growth_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
        ]))
        
        story.append(growth_table)
        story.append(Spacer(1, 20))
    
    # Metas (se existirem)
    goals = data.get('goals')
    if goals:
        story.append(Paragraph("Metas do Mês", subtitle_style))
        
        goals_data = [
            ['Meta', 'Atual', 'Progresso'],
            ['Receita', f"R$ {goals.get('currentValue', 0):,.2f}".replace('.', ',').replace(',', 'temp').replace('.', ',').replace('temp', '.'), 
             f"{goals.get('progressPercent', 0):.1f}%"],
            ['Negócios', f"{goals.get('currentDeals', 0)} / {goals.get('targetDeals', 0)}",
             f"{(goals.get('currentDeals', 0) / max(goals.get('targetDeals', 1), 1)) * 100:.1f}%"]
        ]
        
        goals_table = Table(goals_data, colWidths=[2*inch, 2*inch, 2*inch])
        goals_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f59e0b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
        ]))
        
        story.append(goals_table)
        story.append(Spacer(1, 20))
    
    # Ranking de Corretores (se não for dashboard individual)
    ranking = data.get('ranking', [])
    if ranking:
        story.append(Paragraph("Ranking de Corretores", subtitle_style))
        
        ranking_data = [['Corretor', 'Negócios', 'Receita']]
        for item in ranking[:5]:  # Top 5
            revenue_formatted = f"R$ {item.get('totalValue', 0):,.2f}".replace('.', ',').replace(',', 'temp').replace('.', ',').replace('temp', '.')
            ranking_data.append([
                item.get('name', 'N/A'),
                str(item.get('closedDeals', 0)),
                revenue_formatted
            ])
        
        ranking_table = Table(ranking_data, colWidths=[3*inch, 1.5*inch, 2*inch])
        ranking_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0'))
        ]))
        
        story.append(ranking_table)
    
    # Rodapé
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        f"Relatório gerado em {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", 
        ParagraphStyle('Footer', parent=normal_style, fontSize=10, textColor=colors.HexColor('#94a3b8'))
    ))
    
    # Gerar PDF
    doc.build(story)
    buffer.seek(0)
    
    return buffer
