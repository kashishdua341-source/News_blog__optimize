def test_empty_articles_returns_friendly_empty_collection(client):
    response = client.get("/api/articles")
    assert response.status_code == 200
    assert response.json["items"] == []
    assert response.json["total"] == 0

def test_create_and_search_article(client):
    created = client.post("/api/articles", json={
        "title": "Python performance tips", "category": "Engineering",
        "author": "Editor", "body": "Use indexes and pagination."
    })
    assert created.status_code == 201
    found = client.get("/api/articles?q=performance")
    assert found.status_code == 200
    assert found.json["total"] == 1
    assert found.json["items"][0]["title"] == "Python performance tips"

def test_invalid_article_has_field_errors(client):
    response = client.post("/api/articles", json={"title": "  ", "body": ""})
    assert response.status_code == 400
    assert "title" in response.json["errors"]
    assert "body" in response.json["errors"]

def test_markup_is_removed_before_storage(client):
    response = client.post("/api/articles", json={
        "title": "<script>alert(1)</script>Safe title",
        "body": "<img src=x onerror=alert(1)>Safe body"
    })
    assert response.status_code == 201
    assert "<script>" not in response.json["title"]
    assert "<img" not in response.json["body"]

def test_analytics_returns_consistent_shape(client):
    response = client.get("/api/analytics")
    assert response.status_code == 200
    assert response.json["total_articles"] == 0
    assert response.json["total_views"] == 0
    assert isinstance(response.json["categories"], list)
