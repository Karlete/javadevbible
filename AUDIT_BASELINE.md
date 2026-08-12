# Audit Baseline — Fase 0

Generado: 2026-08-11 19:15

## Resumen (tamaño real del problema)

| Grep | Ficheros afectados |
|---|---|
| `Spring Boot 3` | 15 |
| `Java 21` | 18 |
| `com\.fasterxml` | 5 |
| `Spring Security 6` | 1 |
| `RestTemplate` | 7 |
| `Undertow` | 6 |
| `MockBean` | 2 |
| `spring\.factories` | 3 |
| `WebSecurityConfigurerAdapter` | 1 |

**Total de ficheros únicos que aparecen en al menos uno de los greps de versión: 38** (de 90 páginas).

## Claims de versión que caducan

### grep "Spring Boot 3"
javabible/topics/advanced/multithreading.html
javabible/topics/best-practices/performance-optimization.html
javabible/topics/fundamentals/what-is-java.html
javabible/topics/jakarta-ee/overview.html
javabible/topics/java-versions/jdk-jre-jvm.html
javabible/topics/servers/app-server.html
javabible/topics/servers/servlet-container.html
javabible/topics/servers/tomcat.html
javabible/topics/spring/core.html
javabible/topics/spring/mvc.html
javabible/topics/spring/security.html
javabible/topics/tools/logging.html
javabible/topics/web-concepts/client-server.html
javabible/topics/web-concepts/http.html
javabible/topics/web-concepts/rest-principles.html

### grep "Java 21"
javabible/topics/advanced/design-patterns.html
javabible/topics/advanced/jvm-internals.html
javabible/topics/advanced/multithreading.html
javabible/topics/advanced/thread-pools.html
javabible/topics/best-practices/code-conventions.html
javabible/topics/best-practices/performance-optimization.html
javabible/topics/databases/connection-pooling.html
javabible/topics/fundamentals/exceptions.html
javabible/topics/fundamentals/oop-principles.html
javabible/topics/fundamentals/what-is-java.html
javabible/topics/jakarta-ee/jax-rs.html
javabible/topics/jakarta-ee/overview.html
javabible/topics/java-versions/version-compatibility.html
javabible/topics/java-versions/version-history.html
javabible/topics/servers/app-server.html
javabible/topics/servers/servlet-container.html
javabible/topics/servers/tomcat.html
javabible/topics/web-concepts/request-response.html

### grep "com\.fasterxml"
javabible/topics/advanced/reflection.html
javabible/topics/build-tools/dependencies.html
javabible/topics/build-tools/maven.html
javabible/topics/build-tools/versions.html
javabible/topics/tools/jackson.html

### grep "Spring Security 6"
javabible/topics/spring/security.html

### grep "RestTemplate"
javabible/topics/advanced/design-patterns.html
javabible/topics/fundamentals/generics.html
javabible/topics/spring/core.html
javabible/topics/spring/rest.html
javabible/topics/tools/logging.html
javabible/topics/tools/testing.html
javabible/topics/web-concepts/client-server.html

### grep "Undertow"
javabible/topics/build-tools/dependencies.html
javabible/topics/jakarta-ee/jax-rs.html
javabible/topics/jakarta-ee/overview.html
javabible/topics/jakarta-ee/servlets-jsp.html
javabible/topics/servers/app-server.html
javabible/topics/servers/servlet-container.html

### grep "MockBean"
javabible/topics/spring/core.html
javabible/topics/spring/rest.html

### grep "spring\.factories"
javabible/topics/servers/war-jar.html
javabible/topics/spring/boot.html
javabible/topics/spring/starters.html

### grep "WebSecurityConfigurerAdapter"
javabible/topics/spring/security.html

## Versiones mencionadas — para dimensionar

### grep "Java 2[0-9]" (excluyendo Java 25/26)
javabible/topics/advanced/design-patterns.html:432:                        <td>Replaced by pattern matching (Java 21)</td>
javabible/topics/advanced/design-patterns.html:451:                <h3>Visitor pattern, the old way vs sealed types (Java 21)</h3>
javabible/topics/advanced/design-patterns.html:554:                    Java 21, achieve the same double-dispatch goal with compiler-verified
javabible/topics/advanced/jvm-internals.html:532:                    <strong>Virtual threads (Java 21):</strong> More short-lived objects from continuations — ZGC handles this better than G1 at scale.</p>
javabible/topics/advanced/jvm-internals.html:549:-XX:+UseZGC            <span class="comment"># Low-latency GC (Java 15+ production, Java 21 gen ZGC)</span>
javabible/topics/advanced/jvm-internals.html:613:                    with CRaC (Checkpoint/Restore, Java 21+).</p>
javabible/topics/advanced/multithreading.html:91:                    <div class="info-box-title">Platform threads vs virtual threads (Java 21)</div>
javabible/topics/advanced/multithreading.html:93:                        1:1 to an OS thread (~1MB stack, limited to ~thousands per JVM). Java 21
javabible/topics/advanced/multithreading.html:135: *  Virtual threads (Java 21) add a MOUNTED/UNMOUNTED distinction:
javabible/topics/advanced/multithreading.html:230:                        <td>One virtual thread per task (Java 21)</td>
javabible/topics/advanced/multithreading.html:240:                        queue and rejection policy, or virtual threads (Java 21).</p>
javabible/topics/advanced/multithreading.html:481:                <h2>Virtual Threads (Java 21) — The Game Changer</h2>
javabible/topics/advanced/multithreading.html:532:                        For new projects on Java 21+, virtual threads are the simpler choice.
javabible/topics/advanced/multithreading.html:541:                <h2>Structured Concurrency (Java 21 Preview)</h2>
javabible/topics/advanced/thread-pools.html:259: *  Java 21 virtual threads remove this calculation for I/O-bound work.
javabible/topics/advanced/thread-pools.html:270:<span class="comment">// Or for I/O-bound on Java 21: virtual threads eliminate the guessing</span>
javabible/topics/best-practices/code-conventions.html:384:<span class="comment">// pattern matching for switch + record patterns (Java 21+) —
javabible/topics/best-practices/code-conventions.html:524:                    <p><strong>Q: Why does a sealed interface with an exhaustive pattern-matching switch (Java 21) provide a genuine safety guarantee that a regular interface with an if/else chain and a <code>default</code> case doesn't?</strong><br>
javabible/topics/best-practices/performance-optimization.html:247:                <h2>Virtual Threads (Java 21+) — the Biggest Throughput Change in Years for I/O-Bound Apps</h2>
javabible/topics/best-practices/performance-optimization.html:466:                        <li>Enable virtual threads (<code>spring.threads.virtual.enabled=true</code>) for I/O-bound services on Java 21+ — it's close to a free throughput win for typical blocking web/database code</li>
javabible/topics/databases/connection-pooling.html:272:                    <div class="info-box-title">Virtual Threads (Java 21+) change the sizing calculus</div>
javabible/topics/fundamentals/exceptions.html:566:<span class="comment">// Option 3 (Java 21+): use vavr or Result types for functional error handling</span></code></pre>
javabible/topics/fundamentals/oop-principles.html:525:<span class="comment">// ✅ OR — Java 21 pattern matching in switch (sealed types)</span>
javabible/topics/fundamentals/oop-principles.html:594:                    pattern matching in switch (Java 21), they restore the closed-world assumption that
javabible/topics/fundamentals/what-is-java.html:242:                        <td><strong>Java 21</strong></td>
javabible/topics/fundamentals/what-is-java.html:264:                        <strong>Learning:</strong> Java 21 or 25 so you learn modern syntax (records, var, text blocks,
javabible/topics/fundamentals/what-is-java.html:372:<span class="comment">// Virtual threads — the biggest concurrency change since Java 5 (Java 21+)</span>
javabible/topics/jakarta-ee/jax-rs.html:650:                    integrates with virtual threads in Java 21.</p>
javabible/topics/jakarta-ee/overview.html:106: * 2024  Jakarta EE 11 — Java 21+, Virtual Threads, JPA 3.2
javabible/topics/java-versions/backward-compatibility.html:155:                            <td>Permanently disabled in Java 24 (JEP 486) — the API classes still exist for compile-time compatibility but every operation now throws or no-ops</td>
javabible/topics/java-versions/backward-compatibility.html:427:                    <code>UnsupportedOperationException</code>" stage in Java 20 before
javabible/topics/java-versions/backward-compatibility.html:451:                    <p><strong>Q: The Security Manager was "deprecated for removal" in Java 17 but only "permanently disabled" — not fully removed — in Java 24. What's the practical difference for code that still references the Security Manager API?</strong><br>
javabible/topics/java-versions/version-compatibility.html:73:<span class="comment">// 65 means Java 21+ only. Compare directly against `java -version` on the
javabible/topics/java-versions/version-compatibility.html:120:                        for Java 21 (major version 65), regardless of whether the actual
javabible/topics/java-versions/version-compatibility.html:121:                        code inside that class uses any Java 21-specific language feature at
javabible/topics/java-versions/version-history.html:95:                        <tr><td>Java 21</td><td>Sep 2023</td><td>Previous LTS; still receiving updates</td></tr>
javabible/topics/java-versions/version-history.html:114:                    <p><strong>Production:</strong> an LTS version — Java 21 or 25 today.
javabible/topics/java-versions/version-history.html:310:                <h3>Java 21 (September 2023) — LTS</h3>
javabible/topics/java-versions/version-history.html:334:                    <p>Java 21 shipped a preview of string interpolation
javabible/topics/java-versions/version-history.html:351:                <h2>Java 22 to Today (2024–2026)</h2>
javabible/topics/java-versions/version-history.html:353:                <h3>Java 22–24 (2024) — non-LTS, notable groundwork</h3>
javabible/topics/java-versions/version-history.html:400:                    <div class="info-box-title">What's next: Java 27 (September 2026)</div>
javabible/topics/java-versions/version-history.html:471:                <h3>Java 21 → 25</h3>
javabible/topics/java-versions/version-history.html:504:                        Code compiled targeting Java 21 will not run on a Java 17 runtime.
javabible/topics/java-versions/version-history.html:551:                    <p><strong>Q: Why is it notable that String Templates were withdrawn in Java 23 rather than simply delayed again?</strong><br>
javabible/topics/java-versions/version-history.html:555:                    Templates had been previewed across Java 21 and 22, but extended
javabible/topics/java-versions/version-history.html:567:                    Java 8 is 52, and each subsequent version adds one (Java 21 is 65, Java
javabible/topics/servers/app-server.html:265:                <h3>Virtual Threads (Java 21+) rewrite the oldest Tomcat tuning problem</h3>
javabible/topics/servers/app-server.html:276: * Virtual threads (Project Loom, standard since Java 21) are cheap enough —
javabible/topics/servers/app-server.html:285:# request-handling executor (Spring Boot 3.2+, requires Java 21+)</span>
