# Contributing to JavaDev Bible

Thanks for your interest in contributing! Here's how you can help.

## Reporting Issues

1. Go to the [Issues](https://github.com/Karlete/javadevbible/issues) tab
2. Click **New Issue**
3. Include:
   - A clear, descriptive title
   - Steps to reproduce (if it's a bug)
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

## Submitting Pull Requests

1. **Fork** the repository
2. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test them locally by opening `javabible/index.html`
4. **Commit** with a clear message:
   ```bash
   git commit -m "Add: description of your change"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a **Pull Request** against the `main` branch

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Indent with 4 spaces
- Keep consistent structure across topic pages
- Include proper `<meta>` tags

### CSS
- Follow the existing naming conventions in `css/main.css`
- Use CSS custom properties (variables) where possible
- Keep styles modular and scoped

### JavaScript
- Use vanilla JS only (no frameworks or libraries)
- Use `const` and `let` — never `var`
- Add comments for non-obvious logic

### Content
- Keep explanations concise and practical
- Include code examples for every concept
- Use consistent formatting across topic pages
- Proofread for grammar and technical accuracy

## Adding a New Topic

1. Create a new `.html` file under the appropriate `javabible/topics/` subdirectory
2. Follow the structure of existing topic files
3. Add the topic to the search index in `javabible/data/search-index.json`
4. Link it from `javabible/index.html` if applicable

## Questions?

Open an issue with the **question** label and we'll get back to you.
