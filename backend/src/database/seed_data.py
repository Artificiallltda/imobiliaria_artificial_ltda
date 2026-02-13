"""
Script para popular o banco de dados com dados de teste
"""
import uuid
from decimal import Decimal

from sqlalchemy.orm import Session

from src.database.db import SessionLocal, engine
from src.database.models import Properties, PropertyStatus, Base


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


if __name__ == "__main__":
    create_sample_properties()
