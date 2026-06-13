from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import classes, magic, weapons

app = FastAPI(title="Elden Ring Ultimate Build Crafter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weapons.router)
app.include_router(classes.router)
app.include_router(magic.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
