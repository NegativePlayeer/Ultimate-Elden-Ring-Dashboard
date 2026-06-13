"""Load and parse Elden Ring CSVs from backend/data/."""

import ast
from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parent / "data"

# Map CSV short names -> API / chart labels
ATTACK_NAME_MAP = {
    "Phy": "Physical",
    "Mag": "Magic",
    "Fire": "Fire",
    "Ligt": "Lightning",
    "Holy": "Holy",
}
DAMAGE_TYPES = set(ATTACK_NAME_MAP.keys())  # exclude Crit

STAT_NAME_MAP = {
    "Str": "Strength",
    "Dex": "Dexterity",
    "Int": "Intelligence",
    "Faith": "Faith",
    "Arcane": "Arcane",
}


def load_weapons_df() -> pd.DataFrame:
    """Load weapons.csv."""
    return pd.read_csv(DATA_DIR / "weapons.csv")


def parse_attack_list(attack_str: str) -> dict[str, float]:
    profile: dict[str, float] = {}

    attack_entries = ast.literal_eval(attack_str)
    for attack in attack_entries:
        if attack["name"] in DAMAGE_TYPES:
            label = ATTACK_NAME_MAP[attack["name"]]
            profile[label] = attack["amount"]

    return profile


def parse_scales_with(scales_str: str) -> list[dict]:
    """Parse scalesWith column -> [{stat, grade}, ...]; skip malformed entries."""
    entries = ast.literal_eval(scales_str)
    result = []
    for e in entries:
        if "scaling" not in e:
            continue
        raw_name = e.get("name", "")
        if raw_name in ("-", "", None):
            continue
        stat = STAT_NAME_MAP.get(raw_name, raw_name)
        result.append({"stat": stat, "grade": e["scaling"]})
    return result


def format_scales(scales: list[dict]) -> str:
    """Human-readable for table column, e.g. 'Strength D / Dexterity E'"""
    return " / ".join(f"{s['stat']} {s['grade']}" for s in scales)


def build_weapons_records(df: pd.DataFrame) -> list[dict]:
    records = []
    for _, row in df.iterrows():
        profile = parse_attack_list(row["attack"])
        scales = parse_scales_with(row["scalesWith"])
        records.append(
            {
                "id": row["id"],
                "name": row["name"],
                "category": row["category"],
                "weight": float(row["weight"]),
                "image": row["image"],
                "damageProfile": profile,
                "totalDamage": sum(profile.values()),
                "scalesWith": scales,
                "scalesLabel": format_scales(scales),
            }
        )
    return records


def load_classes_df() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "classes.csv")


def build_class_records(df: pd.DataFrame) -> list[dict]:
    """Parse row['stats'] with ast.literal_eval; return id, name, stats (ints)."""
    records = []
    for _, row in df.iterrows():
        raw = ast.literal_eval(row["stats"])
        stats = {k: int(v) for k, v in raw.items()}
        records.append(
            {
                "id": row["id"],
                "name": row["name"],
                "image": row["image"],
                "stats": stats,
            }
        )
    return records


DEFAULT_REQUIRES = {"Intelligence": 0, "Faith": 0, "Arcane": 0}


def parse_requires(requires_str) -> dict[str, int]:
    """literal_eval list -> {Intelligence: 34, Faith: 0, ...}"""
    if requires_str is None or (isinstance(requires_str, float) and pd.isna(requires_str)):
        return DEFAULT_REQUIRES.copy()
    if not isinstance(requires_str, str) or not requires_str.strip():
        return DEFAULT_REQUIRES.copy()
    try:
        entries = ast.literal_eval(requires_str)
    except (ValueError, SyntaxError):
        return DEFAULT_REQUIRES.copy()
    return {e["name"]: int(e["amount"]) for e in entries}


def build_magic_records(df: pd.DataFrame, school: str) -> list[dict]:
    """name, cost (int), requirements dict, school."""
    records = []
    for _, row in df.iterrows():
        records.append(
            {
                "id": row["id"],
                "name": row["name"],
                "cost": int(row["cost"]),
                "requirements": parse_requires(row["requires"]),
                "school": school,
            }
        )
    return records


def get_weapon_categories(records: list[dict]) -> list[str]:
    """Sorted unique category strings."""
    return sorted({r["category"] for r in records})


def get_top_fp_spells(records: list[dict], limit: int = 10) -> list[dict]:
    """Top N by FP cost for bar chart."""
    sorted_spells = sorted(records, key=lambda r: r["cost"], reverse=True)
    return [{"name": r["name"], "cost": r["cost"]} for r in sorted_spells[:limit]]


def get_requirement_values(records: list[dict], attribute: str) -> list[int]:
    """Values for one attribute (box plot). attribute: Intelligence, Faith, or Arcane."""
    return [r["requirements"].get(attribute, 0) for r in records]


def load_magic_df(school: str) -> pd.DataFrame:
    filename = "sorceries.csv" if school == "sorceries" else "incantations.csv"
    return pd.read_csv(DATA_DIR / filename)


if __name__ == "__main__":
    weapons = build_weapons_records(load_weapons_df())
    print("weapons:", len(weapons))

    classes = build_class_records(load_classes_df())
    print("classes:", len(classes), classes[0]["name"], classes[0]["stats"]["vigor"])

    sorc = build_magic_records(load_magic_df("sorceries"), "sorceries")
    print("top fp:", get_top_fp_spells(sorc, 3))
    print("faith reqs sample:", get_requirement_values(sorc, "Faith")[:5])
