import bleach

def clean_text(value, max_length=None):
    """Allow plain text only; strip markup and control unwanted HTML."""
    if not isinstance(value, str):
        return ""
    cleaned = bleach.clean(value, tags=[], attributes={}, strip=True).strip()
    if max_length:
        cleaned = cleaned[:max_length]
    return cleaned
