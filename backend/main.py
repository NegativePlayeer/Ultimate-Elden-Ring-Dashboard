from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routers import classes, magic, weapons

DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

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


if DIST.exists():
    assets_dir = DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_root() -> FileResponse:
        return FileResponse(DIST / "index.html")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str) -> FileResponse:
        if full_path.startswith("api/") or full_path == "api":
            raise HTTPException(status_code=404, detail="Not Found")

        file_path = DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(DIST / "index.html")
