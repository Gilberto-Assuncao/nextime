# Documentation Standards

Documentation is part of delivery, not an optional follow-up. No Sprint is complete until its required documentation is current.

## Required Sprint updates

Evaluate and update:

- the roadmap and current/next Sprint state;
- the Sprint document and acceptance results;
- architecture documentation for structural decisions;
- relevant README indexes;
- feature documentation for behavior, permissions, states, and limitations;
- database, authentication, security, or design documentation when affected.

## Writing rules

- Use kebab-case filenames and descriptive headings.
- Keep one canonical source for each subject; link instead of duplicating.
- Separate implemented, experimental, deprecated, and planned behavior.
- Include scope, exclusions, ownership, dependencies, security, accessibility, validation, and known limitations where relevant.
- Use repository-relative Markdown links and verify moved files do not break navigation.
- Never include credentials, personal data, production identifiers, or unsupported promises.

## Status integrity

Mark work “Completed” only after acceptance checks pass. Use “Completed with observations” when usable work has documented limitations, and “Blocked” only when completion is impossible without external input or state change.
