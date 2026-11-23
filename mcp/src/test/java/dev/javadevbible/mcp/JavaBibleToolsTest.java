package dev.javadevbible.mcp;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Ranking regressions for {@code search_topics}, run against the real
 * {@code javabible/data/search-index.json}. Maven runs tests with {@code mcp/}
 * as the working directory, so {@code ../javabible} resolves without
 * {@code JAVABIBLE_ROOT}.
 *
 * <p>Each case is a query that the previous implementation got wrong. The same
 * queries are the manual check for {@code javabible/js/search.js}, which must
 * rank identically.
 */
class JavaBibleToolsTest {

    private final JavaBibleTools tools = new JavaBibleTools();

    private List<String> titles(String query) {
        return tools.search_topics(query, 20).stream()
                .map(r -> r.get("title"))
                .toList();
    }

    @Test
    void multiWordQueryMatchesWordsThatAreNotAdjacent() {
        // Used to return nothing: "jpa lazy" never appears as one substring.
        assertThat(titles("jpa lazy")).isNotEmpty();
    }

    @Test
    void pluralMatchesSingularInTitle() {
        // "threads" must match the titles "Multithreading & Concurrency" and
        // "Thread Pools & ExecutorService", which must outrank pages (Tomcat,
        // Performance Optimization) that merely mention virtual threads.
        assertThat(titles("virtual threads").subList(0, 2))
                .containsExactlyInAnyOrder("Multithreading & Concurrency", "Thread Pools & ExecutorService");
    }

    @Test
    void oneCharacterWordsDoNotFilterEverythingOut() {
        assertThat(titles("spring boot 4")).contains("Spring Boot Basics");
    }

    @Test
    void resultsAreSortedByScoreNotByFileOrder() {
        // A title match must outrank pages that only mention the word.
        assertThat(titles("security")).first().asString().containsIgnoringCase("security");
    }

    @Test
    void neverReturnsMoreThanRequested() {
        List<Map<String, String>> results = tools.search_topics("java", 5);
        assertThat(results).hasSizeLessThanOrEqualTo(5);
    }
}
