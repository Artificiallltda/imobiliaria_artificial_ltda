from datetime import datetime


KEYWORD_RESPONSES = {
    ("valor", "preço", "preco", "quanto custa", "custo"): "O valor do imóvel está disponível na página de detalhes. Posso conectar você com um corretor para mais informações!",
    ("entrada", "parcela", "financiamento", "financiar"): "Trabalhamos com diversas opções de financiamento. Um corretor entrará em contato para apresentar as melhores condições.",
    ("visita", "visitar", "agendar", "conhecer"): "Podemos agendar uma visita presencial ou virtual. Qual horário seria melhor para você?",
    ("disponível", "disponivel", "vendido", "ainda"): "Para confirmar a disponibilidade atual, um de nossos corretores entrará em contato em breve.",
    ("foto", "fotos", "imagem", "imagens"): "Temos um galeria completa de fotos do imóvel disponível no site. Quer que eu envie o link?",
}


def is_business_hours(start: int = 8, end: int = 18) -> bool:
    now = datetime.now()
    return start <= now.hour < end and now.weekday() < 5


def get_auto_response(content: str, bot_enabled: bool, away_enabled: bool,
                      welcome_msg: str, away_msg: str,
                      business_start: int = 8, business_end: int = 18) -> str | None:
    if not bot_enabled:
        return None

    text = content.lower()

    for keywords, response in KEYWORD_RESPONSES.items():
        if any(k in text for k in keywords):
            return response

    if away_enabled and not is_business_hours(business_start, business_end):
        return away_msg

    return None
