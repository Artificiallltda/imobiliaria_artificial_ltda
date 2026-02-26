import httpx


async def get_geo(ip: str) -> dict:
    if not ip or ip in ("127.0.0.1", "::1", "testclient"):
        return {"city": None, "state": None}
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            r = await client.get(f"https://ipapi.co/{ip}/json/")
            if r.status_code == 200:
                data = r.json()
                return {
                    "city": data.get("city"),
                    "state": data.get("region"),
                }
    except Exception:
        pass
    return {"city": None, "state": None}
