
# Weekly Recommendations — Heuristic v1
Inputs: last 14 days of Daily + Weekly logs; active projects by goal; repeat signals in `curated_list.md`.

Algorithm:
1) Score each Project = (recent mentions * 2) + (status:Active ? 3 : 0) + streak
2) Pick top Project per Goal (cap to 2 goals/week)
3) For each selected Project:
   - Suggest: 1 article, 1 video, 1 practice/idea
   - Pull from adaptive_suggestions.md; if empty, call Oracle/AI to fetch public items
4) Write Top 3 to `curated_list.md` with a one-line reason.
