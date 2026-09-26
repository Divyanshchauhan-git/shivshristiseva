"""S3-compatible object storage. Uploads go browser → bucket via short-lived presigned URLs, so large files never pass through the API."""
import uuid

from ..config import get_settings

ALLOWED = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "video/mp4": "mp4", "application/pdf": "pdf"}
MAX_BYTES = {"image": 10 * 1024 * 1024, "video": 200 * 1024 * 1024, "application": 25 * 1024 * 1024}


def _client():
    import boto3  # imported lazily so the API boots without storage configured
    s = get_settings()
    return boto3.client("s3", region_name=s.aws_region, endpoint_url=s.storage_endpoint_url or None)


def presign_upload(content_type: str, folder: str, private: bool = False) -> dict:
    if content_type not in ALLOWED:
        raise ValueError("Unsupported file type")
    key = f"{'private' if private else 'public'}/{folder}/{uuid.uuid4().hex}.{ALLOWED[content_type]}"
    limit = MAX_BYTES[content_type.split("/")[0]]
    post = _client().generate_presigned_post(
        get_settings().storage_bucket, key,
        Fields={"Content-Type": content_type},
        Conditions=[{"Content-Type": content_type}, ["content-length-range", 1, limit]],
        ExpiresIn=300,
    )
    return {"key": key, "upload": post}


def public_url(key: str) -> str:
    return f"{get_settings().storage_public_base_url.rstrip('/')}/{key}"


def signed_download(key: str, seconds: int = 300) -> str:
    """For private documents (e.g. consent forms, unpublished reports)."""
    return _client().generate_presigned_url("get_object", Params={"Bucket": get_settings().storage_bucket, "Key": key}, ExpiresIn=seconds)
