from fastapi import APIRouter, Query

from data_loader import (
    build_magic_records,
    get_requirement_values,
    get_top_fp_spells,
    load_magic_df,
)

router = APIRouter(prefix="/api/magic", tags=["magic"])


@router.get("/top-fp")
def top_fp(
    school: str = Query(..., pattern="^(sorceries|incantations)$"),
    limit: int = Query(default=10, ge=1, le=50),
) -> list[dict]:
    df = load_magic_df(school)
    records = build_magic_records(df, school)
    return get_top_fp_spells(records, limit)


@router.get("/requirements")
def requirements(
    school: str = Query(..., pattern="^(sorceries|incantations)$"),
    attribute: str = Query(..., description="Intelligence, Faith, or Arcane"),
) -> list[int]:
    df = load_magic_df(school)
    records = build_magic_records(df, school)
    return get_requirement_values(records, attribute)
