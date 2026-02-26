"""
Serviço de integração com WhatsApp via Z-API.
Configure ZAPI_INSTANCE e ZAPI_TOKEN nas variáveis de ambiente.
"""
import os
import httpx

ZAPI_INSTANCE = os.getenv("ZAPI_INSTANCE", "")
ZAPI_TOKEN = os.getenv("ZAPI_TOKEN", "")


async def send_whatsapp(phone: str, message: str) -> bool:
    if not ZAPI_INSTANCE or not ZAPI_TOKEN:
        return False

    phone_clean = "".join(filter(str.isdigit, phone))
    if not phone_clean:
        return False

    url = f"https://api.z-api.io/instances/{ZAPI_INSTANCE}/token/{ZAPI_TOKEN}/send-text"
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.post(url, json={"phone": phone_clean, "message": message})
            return r.status_code == 200
    except Exception:
        return False
