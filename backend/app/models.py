from datetime import datetime, timezone
from . import db

class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False, index=True)
    category = db.Column(db.String(80), nullable=False, default="General", index=True)
    author = db.Column(db.String(100), nullable=False, default="Editorial Team")
    body = db.Column(db.Text, nullable=False)
    views = db.Column(db.Integer, nullable=False, default=0, index=True)
    status = db.Column(db.String(20), nullable=False, default="published", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "category": self.category,
            "author": self.author, "body": self.body, "views": self.views,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
