Let's get more clarity on what I want exactly from Life-OS.
# System flow overview
1) User connects their local AI to the MCP server.
2) On connect to the MCP server:
  a) Users HAS already a created Life-OS instance:
    - The AI is given
      - the user's AI persona artifact.
      - the user's persona artifact.
      - MCP server capabilities.
    - MCP server sends greeting prompt
  b) User HAS NOT created a Life-OS Instance:
    - MCP server
      - sends greeting prompt.
      - prompts user questions to create a user's persona.
      - has user select the Life-OS theme.
      - creates the user's AI persona artifact based on selected theme.
      - stores user person and AI persona artifacts into expressions.
    - The AI is given
      - the user's AI persona artifact.
      - the user's persona artifact.
      - MCP server capabilities.

3) As the AI persona, AI Guides user through:
  a) Completing the rest of their Life-OS instance by asking questions.
    - Questions should help AI understand what the user wants to accomplish long and short term, giving AI the context to create meaningful visions, goals, categories, tasks, reflections and artifacts (like schedules, etc.).
  b) Gathering at least 1 vision, 1 category, or 1 goal from the user, or as an AI suggestion:
    - Store the "seed" for the user.
    - Gather any other required information to build good personalized recommendations for the artifacts.
    - Create the full Life-OS instance.
  c) Through the day-to-day — updating quests, journaling wins, and evolving their world — all while the MCP orchestrates data flow, saving state, and rendering UI.

### Constraints:
- Each user has their own Life-OS instance.
- Life-OS instances require:
  + Both User and AI personas.
  + At least 1 vision, 1 category, 1 goal, and tasks; both daily and goal specific tasks.
  + This can be suggested by AI if the user is stuck.
  + default suggestion: 1 category from [health, wealth, love, evolution] and create the rest or the requirements from this if user accepts suggestion, e.g. health suggested and accepted, so AI creates a vision, goal, and some tasks from that. AI can ask more questions to the user to better construct the others.
  + A Theme, which is either [selected, created, or the default]
    - Theme fallback is the neutral language AI persona (the default).
    - Themes can be created by the user. AI can ask if they have an idea for a theme and if not suggests from a saved collection of themes.
    - Themes will be something we can store to later re-use or recommend to others.

- AI should incorporate some base line characteristics and qualities to all personas:
  + Operate as a top tier psychologist and motivational coach.
    - The AI should take into account user behavior's, motivation, and patterns gathered from the user created artifacts (journal entries, accomplishements, etc.) to customize AI's recommendations, suggestions, and artifacts. AI should make the artifacts feel personal to the users' driving and motivational factors.
    - The AI should use the latest phsycological tools to construct artifacts like quests, etc. that resonate deeply with the user and aligns with ways that cause action to be taken.

- DNA is:
  + Collections of different contexts
    - As to avoid loading too much context all at once
    - Contexts should be distilled down to just what's needed to help AI when needed.
  + Collections of different examples called templates
    - Templates are examples of what the artifacts should look like when AI is creating it. It does not HAVE to be markdown. Just what easiest for AI to consume quickly, precisely and with the least required overhead.

- RNA is:
  + the logic and tooling to process and integrate:
  [DNA, the user's persona, the theme, AI, user's history]
    - to create expressions.
    - to update experessions.
    - to trigger the evolution model.
    - to create Types for Typescript and zod schemas for tooling.

- Expression is:
  + Expressions are meant to avoid AI having to process everything to come up with the same artifacts, if the user has not yet completed current active tasks, goals, visions, etc. or made progress.
  + The user's CURRENT personalized artifacts; all in the theme's tone and style.
    - An example of this would be "Realms" which contain "Arcs" which contain "Quests". "Quests" which are expressed in the theme; the "Health Realm" might have a "Quest" where the user could "gain winged sneakers" on completing a "5k trek through the fields of doom against the hand of time", where AI would have recommended a run in a local park with a map of the run to the user, all suggested with enough "lore" to make it interesting and a clear direction of the task underneath as "5k run under 30 minutes".
    - The user's CURRENT content references such as recommended artifacts [video links, trail map links, article links, images, videos, audio, etc.]
  + Expressions also contain CURRENT content like the weekly schedule artifact, where the schedule artifact will re-compiled weekly.

- Life-OS's Evolution Model:
  + **Micro‑edit** which are small journal/task updates as in‑place mutations.
  + **Macro‑regen**	for goal or task restructuring to rebuild subtree via synthesis
  + **Reflection** on a weekly or monthly basis to summarize into learning/archive
    - Reflections will be used for AI to consume and iterate on the future artifacts.

- MCP server
  + orchestrates data flow.
  + renders UI components/widgets.
  + provides the capabilities to the AI to:
    - create, read, and update user state.
    - read, modify, and regenerate portions of the expression as user states evolve.
    - create, read, update, and or regenerate specific user expression artifacts.
  + for v1, this server also provides the api the tools leverage.

Please ask more questions so we can clarify how I want to use the AI throughout the project. What DNA should encapsulate, what RNA should encapsulate, and what Expression should encapsulate.