from flask import Blueprint, jsonify, request
from sqlalchemy import or_, func
from . import db
from .models import Article
from .sanitize import clean_text

api = Blueprint("api", __name__)

@api.get("/articles")
def list_articles():
    query = clean_text(request.args.get("q", ""), 120)
    category = clean_text(request.args.get("category", ""), 80)
    page = max(request.args.get("page", 1, type=int), 1)
    per_page = min(max(request.args.get("per_page", 10, type=int), 1), 50)
    stmt = Article.query
    if query:
        pattern = f"%{query}%"
        stmt = stmt.filter(or_(Article.title.ilike(pattern), Article.body.ilike(pattern)))
    if category and category.lower() != "all":
        stmt = stmt.filter(Article.category == category)
    pagination = stmt.order_by(Article.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        "items": [article.to_dict() for article in pagination.items],
        "total": pagination.total, "page": page, "pages": pagination.pages
    })

@api.post("/articles")
def create_article():
    data = request.get_json(silent=True) or {}
    title = clean_text(data.get("title"), 180)
    category = clean_text(data.get("category") or "General", 80)
    author = clean_text(data.get("author") or "Editorial Team", 100)
    body = clean_text(data.get("body"), 20000)
    errors = {}
    if not title:
        errors["title"] = "Title is required."
    if len(title) < 3:
        errors["title"] = "Title must contain at least 3 characters."
    if not body:
        errors["body"] = "Article content is required."
    if errors:
        return jsonify({"message": "Please correct the highlighted fields.", "errors": errors}), 400
    article = Article(title=title, category=category or "General",
                      author=author or "Editorial Team", body=body)
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201

@api.get("/analytics")
def analytics():
    total = db.session.query(func.count(Article.id)).scalar() or 0
    views = db.session.query(func.coalesce(func.sum(Article.views), 0)).scalar()
    categories = db.session.query(Article.category, func.count(Article.id)).group_by(
        Article.category
    ).all()
    return jsonify({
        "total_articles": total, "total_views": int(views),
        "categories": [{"name": name, "count": count} for name, count in categories]
    })
