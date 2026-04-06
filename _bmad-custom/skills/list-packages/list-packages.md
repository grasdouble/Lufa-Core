# List Packages

Run the package inventory script and display results as a markdown table grouped by category.

## Instructions

1. Execute the script:
   ```
   node scripts/list-packages.mjs --root {project_root} --packages-root {packages_root} --project-name "{project_name}"
   ```

2. Display the output directly in the chat — it is already formatted as markdown tables grouped by category.

3. After displaying, report the total package and category counts from the last line of the output.

## Script location
`scripts/list-packages.mjs` (relative to this skill folder)

## Error handling
If the script fails, report the error message and suggest running `node --version` to verify Node.js is available.
