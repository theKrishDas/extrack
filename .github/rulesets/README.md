# GitHub Rulesets

`protect-canary-main-test.json` is the canonical repository ruleset definition for the default branch.

It uses the request body schema from GitHub's repository rulesets API, so it can be applied with the GitHub UI or `gh api`.

## Apply with GitHub CLI

```sh
# Create ruleset
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/OWNER/REPO/rulesets \
  --input .github/rulesets/protect-canary-main-test.json

# Update existing ruleset
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/OWNER/REPO/rulesets/RULESET_ID \
  --input .github/rulesets/protect-canary-main-test.json
```

## Notes

- The ruleset targets `~DEFAULT_BRANCH`, so it follows whichever branch is configured as the repository default.
- The required status check is `Vercel`. If the actual check name in GitHub differs, update the `context` value before applying the ruleset.
- The exported snapshot at the repository root includes GitHub-managed fields like `id` and `source`. Those are omitted here so this file can be used directly with GitHub's API.
