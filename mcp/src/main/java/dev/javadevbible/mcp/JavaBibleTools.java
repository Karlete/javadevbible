package dev.javadevbible.mcp;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * MCP tools that expose JavaDevBible content to AI assistants.
 *
 * <p>The server is designed to run from the root of the JavaDevBible repository,
 * where {@code javabible/} is a sibling directory of the {@code mcp/} folder.
 * The JAR can also be placed anywhere if {@code JAVABIBLE_ROOT} env var is set.
 *
 * <p>Three tools are exposed:
 * <ul>
 *   <li>{@code search_topics} — full-text search over the search index</li>
 *   <li>{@code get_topic_content} — read and clean a specific topic page</li>
 *   <li>{@code list_categories} — list all 13 categories with their topics</li>
 * </ul>
 */
@Component
public class JavaBibleTools {

    private static final Logger log = LoggerFactory.getLogger(JavaBibleTools.class);

    // HTML tag stripper — removes all tags, collapses whitespace
    private static final Pattern TAG_PATTERN       = Pattern.compile("<[^>]+>");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s{2,}");

    // Sections of the HTML we never want to return (nav, scripts, footer)
    private static final Pattern NOISE_PATTERN = Pattern.compile(
        "(?s)<(script|style|nav|footer|header|aside)[^>]*>.*?</\\1>");

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Resolves the root of the {@code javabible/} directory.
     *
     * <p>Resolution order:
     * <ol>
     *   <li>Env var {@code JAVABIBLE_ROOT} if set</li>
     *   <li>{@code ../javabible} relative to the current working directory
     *       (correct when running from the repo root with {@code java -jar mcp/target/...})</li>
     *   <li>{@code ./javabible} (fallback — correct when running from the repo root directly)</li>
     * </ol>
     */
    private Path javabibleRoot() {
        String envRoot = System.getenv("JAVABIBLE_ROOT");
        if (envRoot != null) {
            return Paths.get(envRoot);
        }
        Path sibling = Paths.get("../javabible").normalize().toAbsolutePath();
        if (Files.isDirectory(sibling)) {
            return sibling;
        }
        return Paths.get("javabible").toAbsolutePath();
    }

    // ── Tool 1: search_topics ────────────────────────────────────────────

    @McpTool(description = """
            Search JavaDevBible for topics related to a query.
            Returns matching topics with their title, category, URL path, and description.
            Use this first to find what topics exist before reading their content.
            Examples: "virtual threads", "spring security", "jpa lazy loading", "garbage collection"
            """)
    public List<Map<String, String>> search_topics(
            @McpToolParam(description = "Search query — a Java concept, technology, or keyword")
            String query,
            @McpToolParam(description = "Maximum number of results to return (default 10, max 20)",
                          required = false)
            Integer maxResults) {

        int limit = (maxResults != null) ? Math.min(maxResults, 20) : 10;
        String needle = query.toLowerCase();

        Path indexPath = javabibleRoot().resolve("data/search-index.json");
        log.debug("Searching index at {}", indexPath);

        JsonNode index;
        try {
            index = objectMapper.readTree(indexPath.toFile());
        } catch (JacksonException e) {
            log.error("Failed to read search index at {}", indexPath, e);
            return List.of(Map.of("error",
                "Could not read search index. Is JAVABIBLE_ROOT set correctly? Path tried: "
                + indexPath));
        }

        List<Map<String, String>> results = new ArrayList<>();

        for (JsonNode entry : index) {
            if (results.size() >= limit) break;

            int score = score(entry, needle);
            if (score > 0) {
                Map<String, String> result = new LinkedHashMap<>();
                result.put("title",       textOf(entry, "title"));
                result.put("category",    textOf(entry, "category"));
                result.put("url",         textOf(entry, "url"));
                result.put("description", textOf(entry, "description"));
                results.add(result);
            }
        }

        log.debug("search_topics('{}') → {} results", query, results.size());
        return results;
    }

    private int score(JsonNode entry, String needle) {
        int score = 0;
        if (contains(entry, "title",       needle)) score += 10;
        if (contains(entry, "category",    needle)) score += 5;
        if (contains(entry, "keywords",    needle)) score += 3;
        if (contains(entry, "description", needle)) score += 2;
        return score;
    }

    private boolean contains(JsonNode node, String field, String needle) {
        JsonNode f = node.get(field);
        return f != null && f.asText("").toLowerCase().contains(needle);
    }

    private String textOf(JsonNode node, String field) {
        JsonNode f = node.get(field);
        return f != null ? f.asText("") : "";
    }

    // ── Tool 2: get_topic_content ────────────────────────────────────────

    @McpTool(description = """
            Read the full content of a JavaDevBible topic page.
            Pass the URL path returned by search_topics (e.g. "topics/spring/security.html").
            Returns the cleaned text content of the page — code examples, explanations,
            best practices, and interview questions included.
            """)
    public Map<String, String> get_topic_content(
            @McpToolParam(description = "Topic URL path from search_topics, e.g. 'topics/advanced/multithreading.html'")
            String topicPath) {

        // Sanitise: only allow paths inside topics/
        if (!topicPath.startsWith("topics/") || topicPath.contains("..")) {
            return Map.of("error", "Invalid path. Must start with 'topics/' and contain no '..'");
        }

        Path filePath = javabibleRoot().resolve(topicPath);
        log.debug("Reading topic at {}", filePath);

        if (!Files.exists(filePath)) {
            return Map.of("error", "Topic not found: " + topicPath);
        }

        String html;
        try {
            html = Files.readString(filePath);
        } catch (IOException e) {
            log.error("Failed to read {}", filePath, e);
            return Map.of("error", "Could not read file: " + e.getMessage());
        }

        String content = extractContent(html);
        log.debug("get_topic_content('{}') → {} chars", topicPath, content.length());

        // Trim to ~24000 chars. Measured against every topic page: this covers
        // 88 of 94 pages in full; the 6 largest (jakarta-ee/databases, up to ~27k
        // chars) still hit this as a safety net rather than as normal behavior.
        if (content.length() > 24000) {
            content = content.substring(0, 24000) + "\n\n[Content truncated — page continues]";
        }

        return Map.of(
            "path",    topicPath,
            "content", content
        );
    }

    /**
     * Strips HTML noise and returns readable plain text.
     *
     * <p>Strategy: remove script/style/nav/aside/footer blocks first (they
     * contain no useful content), then strip all remaining tags, then collapse
     * whitespace. This produces prose + code that the model can read cleanly.
     */
    private String extractContent(String html) {
        // 1. Remove noisy blocks entirely
        String cleaned = NOISE_PATTERN.matcher(html).replaceAll(" ");

        // 2. Strip remaining HTML tags
        cleaned = TAG_PATTERN.matcher(cleaned).replaceAll(" ");

        // 3. Decode the most common HTML entities
        cleaned = cleaned
            .replace("&amp;",  "&")
            .replace("&lt;",   "<")
            .replace("&gt;",   ">")
            .replace("&quot;", "\"")
            .replace("&#39;",  "'")
            .replace("&nbsp;", " ");

        // 4. Collapse whitespace — multiple spaces/newlines → single space
        cleaned = WHITESPACE_PATTERN.matcher(cleaned).replaceAll(" ").trim();

        return cleaned;
    }

    // ── Tool 3: list_categories ──────────────────────────────────────────

    @McpTool(description = """
            List all 13 categories in JavaDevBible with their topic pages.
            Use this to explore what content is available before searching,
            or when asked "what topics does JavaDevBible cover?"
            """)
    public List<Map<String, Object>> list_categories() {

        Path indexPath = javabibleRoot().resolve("data/search-index.json");

        JsonNode index;
        try {
            index = objectMapper.readTree(indexPath.toFile());
        } catch (JacksonException e) {
            log.error("Failed to read search index at {}", indexPath, e);
            return List.of(Map.of("error",
                "Could not read search index. Is JAVABIBLE_ROOT set correctly?"));
        }

        // Group topics by category, preserving insertion order
        Map<String, List<String>> byCategory = new LinkedHashMap<>();
        for (JsonNode entry : index) {
            String category = textOf(entry, "category");
            String title    = textOf(entry, "title");
            byCategory.computeIfAbsent(category, k -> new ArrayList<>()).add(title);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<String>> cat : byCategory.entrySet()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("category",   cat.getKey());
            row.put("topicCount", cat.getValue().size());
            row.put("topics",     cat.getValue());
            result.add(row);
        }

        log.debug("list_categories() → {} categories", result.size());
        return result;
    }
}
