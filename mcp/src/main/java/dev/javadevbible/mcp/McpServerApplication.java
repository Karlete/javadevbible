package dev.javadevbible.mcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * JavaDevBible MCP Server.
 *
 * <p>Exposes the content of JavaDevBible (90+ topic pages across 13 categories)
 * to any MCP-compatible AI assistant via the STDIO transport.
 *
 * <p>Run via Claude Desktop or Claude Code — the host launches this JAR
 * as a subprocess and communicates through stdin/stdout. No HTTP port,
 * no authentication, no network configuration required.
 *
 * <p>See README.md in this directory for setup instructions.
 */
@SpringBootApplication
public class McpServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(McpServerApplication.class, args);
    }
}
