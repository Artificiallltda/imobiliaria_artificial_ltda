import httpx

SOCKET_SERVER_URL = "http://localhost:3000"

async def emit_new_message(conversation_id: int, message: dict, conversation: dict | None = None):
    payload = {
        "conversationId": conversation_id,
        "message": message,
        "conversation": conversation,
    }
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            await client.post(f"{SOCKET_SERVER_URL}/emit/new-message", json=payload)
    except Exception:
        # não quebra o backend se o realtime cair
        pass