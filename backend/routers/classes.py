from fastapi import APIRouter

from data_loader import build_class_records, load_classes_df

router = APIRouter(prefix="/api/classes", tags=["classes"])


@router.get("")
def list_classes() -> list[dict]:
    df = load_classes_df()
    return build_class_records(df)
