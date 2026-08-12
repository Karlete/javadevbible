# JavaDevBible MCP Server

Exposes the content of [JavaDevBible](../javabible/index.html) to any
MCP-compatible AI assistant. Add it to Claude Desktop or Claude Code and ask
your assistant Java questions backed by the Bible's 90+ topic pages.

No API keys. No network. No ports. The host launches this JAR as a subprocess
and communicates through stdin/stdout.

---

## What it exposes

| Tool | What it does |
|---|---|
| `search_topics` | Search across all 90+ pages by keyword or concept |
| `get_topic_content` | Read the full content of a specific topic page |
| `list_categories` | List all 13 categories and their topics |

---

## Requirements

- Java 17 or higher
- Maven 3.9+
- This repo cloned locally

---

## Build

Run from the `mcp/` directory:

```bash
cd mcp
./mvnw clean package -DskipTests
```

This produces `mcp/target/javadevbible-mcp-1.0.0.jar`.

---

## Register in Claude Desktop

Open your Claude Desktop config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this entry (replace the path with your actual path):

```json
{
  "mcpServers": {
    "javadevbible": {
      "command": "java",
      "args": ["-jar", "/absolute/path/to/mcp/target/javadevbible-mcp-1.0.0.jar"],
      "env": {
        "JAVABIBLE_ROOT": "/absolute/path/to/javabible"
      }
    }
  }
}
```

Restart Claude Desktop. The tools appear automatically — no further setup needed.

**Verify it works:** ask Claude Desktop "What topics does JavaDevBible cover on
Spring Security?" It should list the relevant pages.

---

## Register in Claude Code

```bash
claude mcp add javadevbible \
  --command java \
  --args "-jar,/absolute/path/to/mcp/target/javadevbible-mcp-1.0.0.jar" \
  --env "JAVABIBLE_ROOT=/absolute/path/to/javabible"
```

---

## Troubleshooting

**The server does not appear in Claude Desktop.**
Check that the JAR path is absolute (not relative) and that the file exists at
that path. Relative paths silently fail.

**Tools appear but return "Could not read search index".**
Set `JAVABIBLE_ROOT` to the absolute path of the `javabible/` directory.
The server tries `../javabible` relative to its working directory by default,
which only works if you launch it from the repo root.

**Connection drops immediately.**
Check `javadevbible-mcp.log` in the directory where the JAR runs. If the log
shows a startup error, fix that first. If the log is empty, something is printing
to stdout before the MCP handshake — check that no shell profile or JVM agent
is writing to stdout on startup.

**Windows path separators.**
In `claude_desktop_config.json` on Windows, use forward slashes or escaped
backslashes: `C:/Users/me/repo/mcp/target/...` or
`C:\\Users\\me\\repo\\mcp\\target\\...`.

---

## How it works

The server is a standard Spring Boot application with one difference:
`spring.main.web-application-type=none`. No HTTP server starts. Instead,
`spring.ai.mcp.server.stdio=true` wires the MCP protocol to stdin/stdout.
The host (Claude Desktop) launches the JAR, performs the MCP handshake, and
from that point forwards every tool call is a JSON-RPC message over stdio.

The three tools read directly from the `javabible/` directory on disk:
`search_topics` parses `data/search-index.json`, `get_topic_content` reads
and strips the relevant HTML file, and `list_categories` groups the index by
category. No database, no network, no state.
