from fastapi import APIRouter, Query

from data_loader import build_weapons_records, get_weapon_categories, load_weapons_df

router = APIRouter(prefix="/api/weapons", tags=["weapons"])


@router.get("/categories")
def list_categories() -> list[str]:
    df = load_weapons_df()
    records = build_weapons_records(df)
    return get_weapon_categories(records)


@router.get("")
def list_weapons(
    category: str | None = Query(default=None),
) -> list[dict]:
    df = load_weapons_df()
    records = build_weapons_records(df)
    if category and category.lower() != "all":
        records = [r for r in records if r["category"] == category]
    return records
