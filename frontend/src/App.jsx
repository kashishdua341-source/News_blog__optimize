import React, { useCallback, useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const sanitize = (value) => String(value ?? "").replace(/[<>]/g, "").trim();

export default function App() {
  const [articles, setArticles] = useState([]);
  const [analytics, setAnalytics] = useState({ total_articles: 0, total_views: 0, categories: [] });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({ title: "", category: "General", author: "", body: "" });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: sanitize(query), category, per_page: "50" });
      const [articleResponse, analyticsResponse] = await Promise.all([
        fetch(`${API}/articles?${params}`), fetch(`${API}/analytics`)
      ]);
      if (!articleResponse.ok || !analyticsResponse.ok) throw new Error("Unable to load dashboard data.");
      const [articleData, analyticsData] = await Promise.all([articleResponse.json(), analyticsResponse.json()]);
      setArticles(articleData.items || []);
      setAnalytics(analyticsData);
    } catch {
      setError("We couldn't load the dashboard. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => { loadData(); }, [loadData]);

  const categoryOptions = useMemo(() => ["All", ...new Set(articles.map((item) => item.category))], [articles]);
  const averageViews = useMemo(() => analytics.total_articles
    ? Math.round(analytics.total_views / analytics.total_articles) : 0, [analytics]);
  const updateField = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: sanitize(value) }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }, []);

  const submitArticle = useCallback(async (event) => {
    event.preventDefault();
    const errors = {};
    if (form.title.length < 3) errors.title = "Enter a title with at least 3 characters.";
    if (!form.body.trim()) errors.body = "Article content is required.";
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setSaving(true);
    try {
      const response = await fetch(`${API}/articles`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, sanitize(value)])))
      });
      const data = await response.json();
      if (!response.ok) { setFieldErrors(data.errors || {}); return; }
      setForm({ title: "", category: "General", author: "", body: "" });
      await loadData();
      console.log("[Analytics] User interacted with Performance Optimization");
    } catch {
      setError("Your article could not be saved. Please check your connection and retry.");
    } finally { setSaving(false); }
  }, [form, loadData]);

  const refresh = useCallback(() => {
    loadData();
    console.log("[Analytics] User interacted with Performance Optimization");
  }, [loadData]);

  return (
    <main className="shell">
      <header className="topbar">
        <div><p className="eyebrow">NEWSROOM / OPERATIONS</p><h1>Performance Optimization</h1>
          <p className="subheading">Monitor content health and keep the publishing workflow efficient.</p></div>
        <button className="secondary-button" onClick={refresh} aria-label="Refresh dashboard">Refresh data</button>
      </header>

      <section className="metrics" aria-label="Performance summary">
        <article className="metric"><span>Total articles</span><strong>{analytics.total_articles}</strong><small>Published and stored</small></article>
        <article className="metric"><span>Total views</span><strong>{analytics.total_views.toLocaleString()}</strong><small>Across all articles</small></article>
        <article className="metric"><span>Average views</span><strong>{averageViews.toLocaleString()}</strong><small>Per article</small></article>
      </section>

      <section className="panel" aria-labelledby="library-heading">
        <div className="section-heading"><div><p className="eyebrow">CONTENT</p><h2 id="library-heading">Article library</h2></div>
          <span className="count">{articles.length} results</span></div>
        <div className="filters">
          <label className="search-label">Search articles
            <input aria-label="Search articles" value={query} onChange={(e) => setQuery(sanitize(e.target.value))} placeholder="Search title or content" />
          </label>
          <label>Category
            <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        {loading ? <div className="status" role="status" aria-live="polite"><span className="spinner" />Loading articles…</div>
          : error ? <div className="notice error" role="alert">{error}</div>
          : articles.length === 0 ? <div className="empty-state"><strong>No data found</strong><p>Try another search or publish your first article.</p></div>
          : <div className="table-wrap"><table><thead><tr><th scope="col">Article</th><th scope="col">Category</th><th scope="col">Author</th><th scope="col">Views</th><th scope="col">Status</th></tr></thead>
            <tbody>{articles.map((article) => <tr key={article.id}><td><strong>{article.title}</strong></td><td>{article.category}</td><td>{article.author}</td><td>{article.views}</td><td><span className="status-pill">{article.status}</span></td></tr>)}</tbody></table></div>}
      </section>

      <section className="panel" aria-labelledby="create-heading">
        <div className="section-heading"><div><p className="eyebrow">PUBLISHING</p><h2 id="create-heading">Add an article</h2></div></div>
        <form onSubmit={submitArticle} noValidate>
          <div className="form-grid">
            <label>Article title
              <input name="title" value={form.title} onChange={updateField} aria-label="Article title" aria-invalid={Boolean(fieldErrors.title)} aria-describedby={fieldErrors.title ? "title-error" : undefined} className={fieldErrors.title ? "invalid" : ""} />
              {fieldErrors.title && <span className="field-error" id="title-error">{fieldErrors.title}</span>}
            </label>
            <label>Category
              <input name="category" value={form.category} onChange={updateField} aria-label="Article category" />
            </label>
            <label>Author
              <input name="author" value={form.author} onChange={updateField} aria-label="Article author" placeholder="Editorial Team" />
            </label>
            <label className="full">Article content
              <textarea name="body" value={form.body} onChange={updateField} aria-label="Article content" rows="4" aria-invalid={Boolean(fieldErrors.body)} aria-describedby={fieldErrors.body ? "body-error" : undefined} className={fieldErrors.body ? "invalid" : ""} />
              {fieldErrors.body && <span className="field-error" id="body-error">{fieldErrors.body}</span>}
            </label>
          </div>
          <div className="form-actions"><span className="helper">Required: title (3+ characters) and article content.</span>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Publish article"}</button></div>
        </form>
      </section>
      <footer>News Blog Performance Suite <span>Python · MySQL · React</span></footer>
    </main>
  );
}
