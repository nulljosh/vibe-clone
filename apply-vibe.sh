#!/bin/bash
# Apply stolen vibe to all Code projects automatically

VIBE_SOURCE="$HOME/Documents/Code/nulljosh.github.io/design-tokens.css"
PROJECTS_DIR="$HOME/Documents/Code"

# Web projects that need the vibe
TARGETS=(
  "bread/src"
  "wikiscroll/src"
  "checkcheck/web"
  "ideasia"
  "finn"
  "portfolio"
  "books"
  "bcgd"
  "journal"
)

echo "Applying tryalcove vibe to all projects..."
echo "Source: $VIBE_SOURCE"
echo ""

for target in "${TARGETS[@]}"; do
  project=$(echo "$target" | cut -d'/' -f1)
  dest_dir="$PROJECTS_DIR/$target"

  if [ -d "$dest_dir" ]; then
    cp "$VIBE_SOURCE" "$dest_dir/design-tokens.css"
    echo "✓ Applied to $project"
  else
    echo "✗ Skipped $project (not found)"
  fi
done

echo ""
echo "Next steps:"
echo "1. Add <link rel=\"stylesheet\" href=\"design-tokens.css\"> to each project"
echo "2. Replace hardcoded colors with var(--color-primary), etc."
echo "3. Use var(--space-*) for spacing, var(--text-*) for typography"
echo "4. Apply var(--glass-bg-light) + var(--glass-blur) for glass morphism"
