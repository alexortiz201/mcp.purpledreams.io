
# RNA Wiring (Starter)

- Services
  - `schedule-service.ts`: generates weekly schedules from reflections + active projects
  - `suggestions-service.ts`: produces Adaptive Suggestions for the week
- Adapter
  - `context-cloudflare.ts`: wraps handlers to provide { env, ctx }

**Next steps**
1. Implement storage readers for `/private/logs/**` and `/core-system/wealth/**`.
2. Write a small compiler that loads DNA templates, injects token payloads, and writes to `life-os-expression`.
3. (Optional) Create Worker routes `/api/schedule` and `/api/suggestions/update` that call these services.
