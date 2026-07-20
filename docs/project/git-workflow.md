# Git Workflow

## Starting a Sprint

1. Confirm repository root and read repository instructions.
2. Run `git status`, `git branch --show-current`, and inspect recent history.
3. Synchronize only when authorized and the working tree is safe.
4. Preserve all existing changes; never reset, clean, restore, stash, or overwrite them without explicit direction.

## Implementation and validation

Keep the diff scoped and review it continuously. Before delivery run, as applicable:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
git status
```

Run only scripts that exist. Record missing scripts rather than inventing successful results.

## Commit and push policy

Never commit automatically. Never push automatically. A Sprint specification may explicitly authorize commit and push; otherwise stop after validation and report the working tree. When authorized, stage only scoped files, use Conventional Commits, verify the commit, push the intended branch, and confirm remote synchronization.

## Pull requests

When the workflow uses pull requests, create a focused branch, provide objective and validation evidence, identify migrations and risks, and keep unrelated work out. Review feedback is addressed deliberately; threads are resolved only when the underlying issue is actually handled.
