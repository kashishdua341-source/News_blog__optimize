# PROMPTS.md — Antigravity Prompt Traceability

This file records the prompt sequence used to guide the implementation. The sequence follows the requested test-first workflow. It is a reproducible prompt log, not a claim that Antigravity was executed inside this ChatGPT session.

## Prompt 1 — Acceptance criteria and test-first plan

> Act as a senior full-stack engineer. Build a News Blog Performance Optimization project. The backend language must be Python and the database must be MySQL. The frontend may use React because the assignment explicitly requires React performance patterns. Do not implement the final feature yet. First inspect the requirements and write failing backend pytest tests and frontend Vitest/React Testing Library tests for: dashboard access, article search/list, empty-state messaging, loading feedback, invalid/malformed form handling, accessible labels and keyboard-native controls, XSS input sanitization, analytics response shape, and analytics console ping. Use SQLite only as an isolated test database; production configuration must use MySQL. Explain how to run the tests.

## Prompt 2 — Backend implementation after tests

> Implement the Python Flask API to satisfy the backend tests. Use Flask-SQLAlchemy with MySQL/PyMySQL, environment-based configuration, indexed article fields, pagination, search, aggregate analytics, field validation, and server-side plain-text sanitization. Add a health endpoint, rate limiting, and safe defaults. Do not hardcode production secrets. Preserve the test suite and make all backend tests pass.

## Prompt 3 — React implementation after tests

> Implement the React dashboard to satisfy the frontend tests. Use useMemo for derived values and useCallback for stable event handlers/data loading. Include article metrics, search and category filters, loading spinner, connection error state, “No data found” empty state, article creation form, red invalid fields, field-level validation, semantic HTML, ARIA labels, keyboard navigation, visible focus styles, and reduced-motion support. Sanitize input before state updates and API submission. Never render user text as raw HTML.

## Prompt 4 — Telemetry and resilience

> Add the required simulated analytics console message exactly as: [Analytics] User interacted with Performance Optimization. Log it after a successful primary publish action and when the dashboard refresh action is activated. Ensure async operations always show loading/saving feedback and errors are presented accessibly. Do not log sensitive article content.

## Prompt 5 — Performance and design review

> Review the implementation for unnecessary React renders, unbounded API responses, and inefficient data loading. Keep useMemo/useCallback dependencies correct, cap page size, aggregate metrics in SQL, and index relevant MySQL columns. Keep a monochromatic corporate visual system with consistent 16px/32px spacing and no decorative accent colors. Ensure responsive layout.

## Prompt 6 — Final verification

> Run backend tests, frontend tests, lint, and production build. Fix failures without deleting acceptance tests. Verify the empty state, slow/network failure state, invalid input state, and successful publish flow. Check keyboard-only interaction and Lighthouse accessibility in a browser preview. Document any environment-dependent limitation honestly. Confirm PROMPTS.md is in the repository root and scan for secrets before packaging.
## Prompt 7 — XAMPP local MySQL setup

> Adapt the project to run with XAMPP MySQL/MariaDB on Windows, without Docker. Read host, port, username, password, and database name from backend/.env. Use common XAMPP defaults (127.0.0.1:3306, root, blank password, news_blog database). On backend startup, connect to the MySQL server without selecting a database, safely create the configured database if it does not exist, then create the application tables. Do not require the user to create the database manually. Document the exact Windows commands and keep tests using isolated SQLite.
