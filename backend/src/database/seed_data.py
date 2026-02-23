"""
Script para popular o banco de dados com dados de teste
"""
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from src.database.db import SessionLocal, engine
from src.database.models import Properties, PropertyStatus, Base, Leads, LeadMessages, LeadStatus


def create_sample_properties():
    """Cria imóveis de exemplo para testes"""
    
    # Criar tabelas se não existirem
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar se já existem imóveis
        existing_count = db.query(Properties).count()
        if existing_count > 0:
            print(f"Já existem {existing_count} imóveis no banco. Nenhum dado de teste será criado.")
            return
        
        # Lista de imóveis de exemplo
        sample_properties = [
            {
                "id": uuid.uuid4(),
                "title": "Apartamento Moderno no Centro",
                "description": "Excelente apartamento com 2 quartos, sala ampla, cozinha planejada e vista panorâmica. Próximo a comércios e transporte público.",
                "price": Decimal("450000.00"),
                "city": "São Paulo",
                "bedrooms": 2,
                "bathrooms": 2,
                "area": Decimal("85.50"),
                "status": PropertyStatus.AVAILABLE
            },
            {
                "id": uuid.uuid4(),
                "title": "Casa de Vila em Bairro Tranquilo",
                "description": "Casa com 3 quartos, quintal com churrasqueira, garagem para 2 carros. Bairro familiar e seguro.",
                "price": Decimal("680000.00"),
                "city": "São Paulo",
                "bedrooms": 3,
                "bathrooms": 2,
                "area": Decimal("120.00"),
                "status": PropertyStatus.AVAILABLE
            },
            {
                "id": uuid.uuid4(),
                "title": "Studio Compacto e Aconchegante",
                "description": "Studio otimizado com mobília planejada, cozinha americana e varanda. Ideal para solteiros ou casais.",
                "price": Decimal("280000.00"),
                "city": "Rio de Janeiro",
                "bedrooms": 1,
                "bathrooms": 1,
                "area": Decimal("45.00"),
                "status": PropertyStatus.AVAILABLE
            },
            {
                "id": uuid.uuid4(),
                "title": "Cobertura de Luxo com Piscina",
                "description": "Cobertura exclusiva com 4 suítes, piscina privativa, sauna e vista 360°. Condomínio com infraestrutura completa.",
                "price": Decimal("2500000.00"),
                "city": "Rio de Janeiro",
                "bedrooms": 4,
                "bathrooms": 5,
                "area": Decimal("350.00"),
                "status": PropertyStatus.RESERVED
            },
            {
                "id": uuid.uuid4(),
                "title": "Casa de Campo com Lago",
                "description": "Propriedade rural com casa principal, 2 hectares, lago para pesca e estábulo. Perfeito para quem busca tranquilidade.",
                "price": Decimal("1200000.00"),
                "city": "Belo Horizonte",
                "bedrooms": 5,
                "bathrooms": 4,
                "area": Decimal("450.00"),
                "status": PropertyStatus.AVAILABLE
            },
            {
                "id": uuid.uuid4(),
                "title": "Apartamento Padrão em Zona Sul",
                "description": "Apartamento bem localizado perto do metrô, com 2 quartos, dependências completas e área de lazer no condomínio.",
                "price": Decimal("520000.00"),
                "city": "São Paulo",
                "bedrooms": 2,
                "bathrooms": 1,
                "area": Decimal("75.00"),
                "status": PropertyStatus.SOLD
            },
            {
                "id": uuid.uuid4(),
                "title": "Loft Industrial no Centro",
                "description": "Loft com pé-direito duplo, mezanino, cozinha aberta e acabamento industrial. Ideal para artistas e criativos.",
                "price": Decimal("380000.00"),
                "city": "Curitiba",
                "bedrooms": 1,
                "bathrooms": 1,
                "area": Decimal("95.00"),
                "status": PropertyStatus.AVAILABLE
            },
            {
                "id": uuid.uuid4(),
                "title": "Casa Geminada em Condomínio Fechado",
                "description": "Casa com 3 quartos, jardim, garagem coberta e segurança 24h. Condomínio com playground e campo de futebol.",
                "price": Decimal("420000.00"),
                "city": "Porto Alegre",
                "bedrooms": 3,
                "bathrooms": 2,
                "area": Decimal("150.00"),
                "status": PropertyStatus.AVAILABLE
            }
        ]
        
        # Inserir no banco
        for prop_data in sample_properties:
            property_obj = Properties(**prop_data)
            db.add(property_obj)
        
        db.commit()
        print(f"✅ {len(sample_properties)} imóveis de exemplo criados com sucesso!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao criar dados de teste: {e}")
        raise
    finally:
        db.close()


def create_sample_leads():
    """Cria leads de exemplo para testes"""
    
    db = SessionLocal()
    
    try:
        # Verificar se já existem leads
        existing_count = db.query(Leads).count()
        if existing_count > 0:
            print(f"Já existem {existing_count} leads no banco. Nenhum dado de teste será criado.")
            return
        
        # Pegar alguns imóveis existentes para vincular aos leads
        properties = db.query(Properties).limit(3).all()
        property_ids = [p.id for p in properties] if properties else []
        
        # Lista de leads de exemplo
        sample_leads = [
            {
                "id": uuid.uuid4(),
                "name": "Gean Carlos",
                "email": "gean.carlos@exemplo.com",
                "phone": "11999999999",
                "status": LeadStatus.novo,
                "source": "SITE",
                "property_id": property_ids[0] if len(property_ids) > 0 else None,
            },
            {
                "id": uuid.uuid4(),
                "name": "Deborah Victoria",
                "email": "deborah.victoria@exemplo.com",
                "phone": "11888888888",
                "status": LeadStatus.em_atendimento,
                "source": "FACEBOOK",
                "property_id": property_ids[1] if len(property_ids) > 1 else None,
            },
            {
                "id": uuid.uuid4(),
                "name": "João Silva",
                "email": "joao.silva@email.com",
                "phone": "11777777777",
                "status": LeadStatus.proposta_enviada,
                "source": "SITE",
                "property_id": property_ids[2] if len(property_ids) > 2 else None,
            },
            {
                "id": uuid.uuid4(),
                "name": "Maria Oliveira",
                "email": "maria.oliveira@email.com",
                "phone": None,
                "status": LeadStatus.perdido,
                "source": "GOOGLE",
                "property_id": None,
            },
            {
                "id": uuid.uuid4(),
                "name": "Pedro Santos",
                "email": "pedro.santos@email.com",
                "phone": "11666666666",
                "status": LeadStatus.fechado,
                "source": "INDICAÇÃO",
                "property_id": property_ids[0] if len(property_ids) > 0 else None,
                "converted_at": datetime.utcnow()  # Lead já convertido
            },
            {
                "id": uuid.uuid4(),
                "name": "Ana Costa",
                "email": "ana.costa@email.com",
                "phone": "11555555555",
                "status": LeadStatus.novo,
                "source": "INSTAGRAM",
                "property_id": None,
                "is_archived": True  # Lead arquivado
            },
        ]
        
        # Inserir leads no banco
        created_leads = []
        for lead_data in sample_leads:
            lead_obj = Leads(**lead_data)
            db.add(lead_obj)
            created_leads.append(lead_obj)
        
        db.commit()
        print(f"✅ {len(sample_leads)} leads de exemplo criados com sucesso!")
        
        # Criar algumas mensagens de exemplo para os leads
        sample_messages = [
            {
                "id": uuid.uuid4(),
                "lead_id": created_leads[0].id,
                "sender": "USER",
                "message": "Olá, estou interessado no apartamento no centro.",
            },
            {
                "id": uuid.uuid4(),
                "lead_id": created_leads[0].id,
                "sender": "AGENT",
                "message": "Oi Gean! Claro, posso te ajudar. Vamos marcar uma visita?",
            },
            {
                "id": uuid.uuid4(),
                "lead_id": created_leads[1].id,
                "sender": "USER",
                "message": "Gostaria de saber mais sobre a casa na vila.",
            },
        ]
        
        # Inserir mensagens no banco
        for msg_data in sample_messages:
            msg_obj = LeadMessages(**msg_data)
            db.add(msg_obj)
        
        db.commit()
        print(f"✅ {len(sample_messages)} mensagens de exemplo criadas com sucesso!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao criar dados de teste: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_properties()
    create_sample_leads()
