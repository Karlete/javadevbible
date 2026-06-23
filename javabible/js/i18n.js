// ========================================
// JAVDEV BIBLE - INTERNATIONALISATION (i18n)
// ========================================
// Translations are embedded directly — no network requests, works on file://
// Add data-i18n="key" to any translatable element.
// Add data-i18n-placeholder="key" to <input> elements.
// Add data-i18n-root="../.." and data-i18n-title="key" to <html> on topic pages.

(function () {
    'use strict';

    // ── Spanish translations ───────────────────────────────────────────────
    var ES = {
        // Page title
        'page.title': 'JavaDev Bible - Base de Conocimiento Integral para Desarrolladores Java',

        // Hero
        'hero.subtitle': 'Tu Base de Conocimiento Integral para Desarrolladores Java',

        // Search
        'search.placeholder': 'Buscar temas, conceptos o palabras clave...',
        'search.btn': 'Buscar',

        // Intro section
        'intro.title': 'Bienvenido a JavaDev Bible',
        'intro.text': 'Una base de conocimiento completa y organizada que cubre todo, desde los fundamentos de Java hasta el desarrollo empresarial. Navega por los temas a continuación o usa la barra de búsqueda para encontrar lo que necesitas.',

        // Category titles & descriptions
        'cat.fundamentals.title': 'Fundamentos de Java',
        'cat.fundamentals.desc':  'Conceptos básicos y bloques de construcción',
        'cat.advanced.title':     'Conceptos Avanzados de Java',
        'cat.advanced.desc':      'Análisis profundo de temas avanzados',
        'cat.jakarta.title':      'Jakarta EE y Java Empresarial',
        'cat.jakarta.desc':       'Desarrollo de aplicaciones empresariales',
        'cat.spring.title':       'Framework Spring',
        'cat.spring.desc':        'Framework moderno para aplicaciones Java',
        'cat.build.title':        'Herramientas de Construcción y Gestión de Proyectos',
        'cat.build.desc':         'Gestión de dependencias y construcción',
        'cat.web.title':          'Conceptos Web y Arquitectura',
        'cat.web.desc':           'Comprensión del desarrollo web',
        'cat.servers.title':      'Servidores de Aplicaciones y Despliegue',
        'cat.servers.desc':       'Gestión de servidores y despliegue',
        'cat.databases.title':    'Bases de Datos y Persistencia',
        'cat.databases.desc':     'Almacenamiento y gestión de datos',
        'cat.security.title':     'Seguridad y Autenticación',
        'cat.security.desc':      'Protegiendo tus aplicaciones',
        'cat.versions.title':     'Versiones de Java y Compatibilidad',
        'cat.versions.desc':      'Comprendiendo las versiones de Java',
        'cat.tools.title':        'Herramientas y Ecosistema',
        'cat.tools.desc':         'Herramientas y utilidades de desarrollo',
        'cat.bestpractices.title':'Buenas Prácticas',
        'cat.bestpractices.desc': 'Escribiendo mejor código Java',

        // Topic links — Fundamentals
        'link.what-is-java':       '¿Qué es Java?',
        'link.variables-datatypes':'Variables y Tipos de Datos',
        'link.methods':            'Métodos y Funciones',
        'link.access-modifiers':   'Modificadores de Acceso',
        'link.oop-principles':     'Principios de POO',
        'link.interfaces-abstract':'Interfaces vs Clases Abstractas',
        'link.static-instance':    'Estático vs Instancia',
        'link.constructors':       'Constructores',
        'link.exceptions':         'Manejo de Excepciones',
        'link.collections':        'Framework de Colecciones',
        'link.generics':           'Genéricos',
        'link.lambda-streams':     'Lambda y Streams',
        'link.optional':           'Clase Optional',

        // Topic links — Advanced
        'link.multithreading':     'Multihilo y Concurrencia',
        'link.thread-pools':       'Grupos de Hilos y ExecutorService',
        'link.synchronization':    'Mecanismos de Sincronización',
        'link.jvm-internals':      'Internos de la JVM',
        'link.garbage-collection': 'Recolección de Basura',
        'link.reflection':         'API de Reflexión',
        'link.annotations':        'Anotaciones',
        'link.design-patterns':    'Patrones de Diseño',

        // Topic links — Jakarta EE
        'link.jakarta-overview':   'Visión General de Jakarta EE 11',
        'link.servlets-jsp':       'Servlets y JSP',
        'link.cdi':                'CDI (Contextos e Inyección de Dependencias)',
        'link.beans':              '¿Qué es un Bean?',
        'link.ejb':                'EJB (Enterprise JavaBeans)',
        'link.jpa':                'JPA (API de Persistencia Java)',
        'link.bean-validation':    'Validación de Beans',
        'link.jax-rs':             'JAX-RS (Servicios RESTful)',
        'link.websocket':          'WebSocket',
        'link.json-processing':    'Procesamiento y Enlace JSON',
        'link.transactions':       'Transacciones',
        'link.jakarta-security':   'Seguridad y Autenticación',

        // Topic links — Spring
        'link.spring-core':        'Spring Core (IoC y DI)',
        'link.spring-boot':        'Fundamentos de Spring Boot',
        'link.spring-mvc':         'Arquitectura Spring MVC',
        'link.spring-data-jpa':    'Spring Data JPA',
        'link.spring-security':    'Spring Security',
        'link.spring-rest':        'Spring REST',
        'link.app-properties':     'Propiedades de Aplicación',
        'link.profiles':           'Perfiles y Entornos',
        'link.starters':           'Starters de Spring Boot',

        // Topic links — Build Tools
        'link.maven':              '¿Qué es Maven?',
        'link.pom':                'Estructura del POM.xml',
        'link.dependencies':       'Gestión de Dependencias',
        'link.lifecycle':          'Fases del Ciclo de Vida de Maven',
        'link.gradle':             'Fundamentos de Gradle',
        'link.versions':           'Gestión de Versiones',
        'link.scopes':             'Alcances de Dependencias',

        // Topic links — Web Concepts
        'link.client-server':      'Arquitectura Cliente-Servidor',
        'link.server-vs-client':   'Ejecución Servidor vs Cliente',
        'link.http':               'Protocolo HTTP y Métodos',
        'link.rest-principles':    'Principios de API RESTful',
        'link.request-response':   'Ciclo Petición/Respuesta',
        'link.sessions-cookies':   'Sesiones y Cookies',
        'link.cors':               'CORS',
        'link.websockets':         'WebSockets',

        // Topic links — Servers
        'link.app-server':         '¿Qué es un Servidor de Aplicaciones?',
        'link.tomcat':             'Visión General de Tomcat',
        'link.servlet-container':  'Contenedores de Servlets',
        'link.war-jar':            'Archivos WAR vs JAR',
        'link.web-xml':            'Descriptores de Despliegue',
        'link.context':            'Contexto y Despliegue',

        // Topic links — Databases
        'link.sql':                'Fundamentos de SQL',
        'link.jdbc':               'JDBC',
        'link.jpa-hibernate':      'JPA e Hibernate',
        'link.relationships':      'Relaciones entre Entidades',
        'link.db-transactions':    'Transacciones (ACID)',
        'link.connection-pooling': 'Agrupación de Conexiones',
        'link.orms':               'ORMs',

        // Topic links — Security
        'link.auth-vs-authz':      'Autenticación vs Autorización',
        'link.jwt':                'JWT (Tokens Web JSON)',
        'link.oauth':              'OAuth 2.0',
        'link.session-mgmt':       'Gestión de Sesiones',
        'link.password-hashing':   'Hash de Contraseñas',
        'link.https-ssl':          'HTTPS y SSL/TLS',

        // Topic links — Java Versions
        'link.jdk-jre-jvm':        'JDK vs JRE vs JVM',
        'link.version-history':    'Historia de Versiones de Java',
        'link.version-compatibility':'Compatibilidad de Versiones',
        'link.source-target':      'Compatibilidad Fuente/Destino',
        'link.runtime-compile':    'Tiempo de Ejecución vs Compilación',
        'link.backward-compat':    'Compatibilidad hacia Atrás',

        // Topic links — Tools
        'link.ides':               'IDEs (IntelliJ, Eclipse)',
        'link.git':                'Control de Versiones (Git)',
        'link.cicd':               'Fundamentos de CI/CD',
        'link.logging':            'Frameworks de Registro',
        'link.testing':            'Pruebas (JUnit, Mockito)',
        'link.code-quality':       'Herramientas de Calidad de Código',

        // Topic links — Best Practices
        'link.sonarqube':          'SonarQube y Calidad de Código',
        'link.code-conventions':   'Convenciones de Código',
        'link.solid':              'Principios SOLID',
        'link.clean-code':         'Principios de Código Limpio',
        'link.error-handling':     'Patrones de Manejo de Errores',
        'link.performance':        'Optimización de Rendimiento',
        'link.security-practices': 'Buenas Prácticas de Seguridad',

        // Shared navigation (used by topic pages)
        'nav.home':           'Inicio',
        'nav.back-to-index':  '\u2190 Volver al \u00cdndice',
        'nav.fundamentals':   'Fundamentos de Java',
        'nav.advanced':       'Conceptos Avanzados de Java',
        'nav.jakarta':        'Jakarta EE y Java Empresarial',
        'nav.spring':         'Framework Spring',
        'nav.build-tools':    'Herramientas de Construcci\u00f3n',
        'nav.web-concepts':   'Conceptos Web y Arquitectura',
        'nav.servers':        'Servidores de Aplicaciones',
        'nav.databases':      'Bases de Datos y Persistencia',
        'nav.security':       'Seguridad y Autenticaci\u00f3n',
        'nav.java-versions':  'Versiones de Java',
        'nav.tools':          'Herramientas y Ecosistema',
        'nav.best-practices': 'Buenas Pr\u00e1cticas',

        // Table of Contents (generated by navigation.js)
        'toc.title': 'Tabla de Contenidos',

        // Footer
        'footer.copyright': '\u00a9 2026 JavaDev Bible - Base de Conocimiento Integral para Desarrolladores Java',
        'footer.built':     'Construido con HTML, CSS y JavaScript puro por Claude y Sanprieto',

        // ── Fundamentals: h1 (page titles shown in <h1>) ─────────────────
        'topic.wij.h1': '¿Qué es Java?',
        'topic.vdt.h1': 'Variables y Tipos de Datos',
        'topic.mth.h1': 'Métodos y Funciones',
        'topic.am.h1':  'Modificadores de Acceso',
        'topic.oop.h1': 'Principios de POO',
        'topic.ia.h1':  'Interfaces vs Clases Abstractas',
        'topic.si.h1':  'Miembros Estáticos vs de Instancia',
        'topic.con.h1': 'Constructores',
        'topic.exc.h1': 'Manejo de Excepciones',
        'topic.col.h1': 'Framework de Colecciones',
        'topic.gen.h1': 'Genéricos',
        'topic.ls.h1':  'Expresiones Lambda y Streams',
        'topic.opt.h1': 'Clase Optional',

        // ── Fundamentals: What is Java (wij) ──────────────────────────────
        'topic.wij.page-title': '¿Qué es Java? - JavaDev Bible',
        'topic.wij.subtitle':   'Comprendiendo el Lenguaje de Programación y la Plataforma Java',
        'topic.wij.h2.1':  'Introducción a Java',
        'topic.wij.h2.2':  'Contexto Histórico: El Nacimiento de Java',
        'topic.wij.h2.3':  'Cómo Funciona Java: Por Dentro',
        'topic.wij.h2.4':  '¿Qué Puedes Construir con Java?',
        'topic.wij.h2.5':  'Ediciones de Java Explicadas',
        'topic.wij.h2.6':  'Historia de Versiones de Java',
        'topic.wij.h2.7':  'Java vs Otros Lenguajes',
        'topic.wij.h2.8':  'Cuándo Usar Java (y Cuándo No)',
        'topic.wij.h2.9':  'Tu Primer Programa en Java',
        'topic.wij.h2.10': 'Errores Comunes para Principiantes',
        'topic.wij.h2.11': 'Solución de Problemas Comunes',
        'topic.wij.h2.12': 'Preguntas Frecuentes de Entrevistas',
        'topic.wij.h2.13': 'Primeros Pasos: Próximas Acciones',
        'topic.wij.h2.14': 'Ver También',
        'topic.wij.h3.1':  'El Proyecto Green (1991-1995)',
        'topic.wij.h3.2':  'La Revolución de Internet',
        'topic.wij.h3.3':  'Adopción Empresarial',
        'topic.wij.h3.4':  'El Proceso de Compilación y Ejecución de Java',
        'topic.wij.h3.5':  'Paso 1: Escribir el Código Fuente',
        'topic.wij.h3.6':  'Paso 2: Compilación a Bytecode',
        'topic.wij.h3.7':  'Paso 3: Ejecución por la JVM',
        'topic.wij.h3.8':  'La Arquitectura de la JVM',
        'topic.wij.h3.9':  'Compilación Just-In-Time (JIT)',
        'topic.wij.h3.10': '1. Aplicaciones Empresariales',
        'topic.wij.h3.11': '2. Aplicaciones Web',
        'topic.wij.h3.12': '3. Aplicaciones Móviles (Android)',
        'topic.wij.h3.13': '4. Big Data y Sistemas Distribuidos',
        'topic.wij.h3.14': '5. Cloud y Microservicios',
        'topic.wij.h3.15': '6. Aplicaciones Científicas e Investigación',
        'topic.wij.h3.16': '7. Aplicaciones de Escritorio',
        'topic.wij.h3.17': 'Java SE (Edición Estándar)',
        'topic.wij.h3.18': 'Jakarta EE (Edición Empresarial)',
        'topic.wij.h3.19': 'Java ME (Edición Micro)',
        'topic.wij.h3.20': 'Las Versiones Principales',
        'topic.wij.h3.21': 'Java Destaca En:',
        'topic.wij.h3.22': 'Considera Alternativas Para:',
        'topic.wij.h3.23': 'Entendiendo Cada Parte',
        'topic.wij.h3.24': 'Compilar y Ejecutar',
        'topic.wij.h3.25': '\'javac\' no se reconoce',
        'topic.wij.h3.26': 'Error: No se puede encontrar ni cargar la clase principal',
        'topic.wij.h3.27': 'Error: La clase X es pública, debe declararse en un archivo llamado X.java',
        'topic.wij.h3.28': 'Error: Se llegó al final del archivo mientras se analizaba',
        'topic.wij.h3.29': 'Lo que Necesitas Instalar',
        'topic.wij.h3.30': 'Ruta de Aprendizaje Recomendada',
        'topic.wij.h3.31': 'Temas Relacionados',

        // ── Fundamentals: Variables & Data Types (vdt) ────────────────────
        'topic.vdt.page-title': 'Variables y Tipos de Datos - JavaDev Bible',
        'topic.vdt.subtitle':   'Comprendiendo el Sistema de Tipos y las Variables en Java',
        'topic.vdt.h2.1':  '¿Qué Son las Variables?',
        'topic.vdt.h2.2':  'Por Dentro: Cómo Funcionan las Variables en Memoria',
        'topic.vdt.h2.3':  'Tipos de Datos Primitivos',
        'topic.vdt.h2.4':  'Tipos por Referencia',
        'topic.vdt.h2.5':  'Declaración e Inicialización de Variables',
        'topic.vdt.h2.6':  'Conversión de Tipos (Casting)',
        'topic.vdt.h2.7':  'Constantes y Variables Finales',
        'topic.vdt.h2.8':  'Convenciones de Nomenclatura y Buenas Prácticas',
        'topic.vdt.h2.9':  'Errores Comunes y Cómo Evitarlos',
        'topic.vdt.h2.10': 'Consideraciones de Rendimiento',
        'topic.vdt.h2.11': 'Preguntas Frecuentes de Entrevistas',
        'topic.vdt.h2.12': 'Guía de Solución de Problemas',
        'topic.vdt.h2.13': 'Ver También',
        'topic.vdt.h3.1':  'Analogía del Mundo Real',
        'topic.vdt.h3.2':  'Primitivos vs Referencia: Comportamiento en Memoria',
        'topic.vdt.h3.3':  'Tipos Enteros: byte, short, int, long',
        'topic.vdt.h3.4':  'Tipos de Punto Flotante: float, double',
        'topic.vdt.h3.5':  'Tipo Carácter: char',
        'topic.vdt.h3.6':  'Tipo Booleano: boolean',
        'topic.vdt.h3.7':  'Tabla de Referencia Completa de Tipos Primitivos',
        'topic.vdt.h3.8':  'Strings: El Tipo por Referencia Más Común',
        'topic.vdt.h3.9':  'Arrays: Colecciones de Tamaño Fijo',
        'topic.vdt.h3.10': 'Clases Wrapper: Primitivos como Objetos',
        'topic.vdt.h3.11': 'Patrones Básicos de Declaración',
        'topic.vdt.h3.12': 'Inferencia de Tipo de Variable Local (var) - Java 10+',
        'topic.vdt.h3.13': 'Ámbito de Variables',
        'topic.vdt.h3.14': 'Conversión Implícita (Ampliación)',
        'topic.vdt.h3.15': 'Conversión Explícita (Reducción)',
        'topic.vdt.h3.16': 'Conversiones de String',
        'topic.vdt.h3.17': 'Convenciones Oficiales de Nomenclatura Java',
        'topic.vdt.h3.18': 'Buenos vs Malos Nombres de Variables',
        'topic.vdt.h3.19': 'Rendimiento: Primitivos vs Wrapper',
        'topic.vdt.h3.20': 'Concatenación de Strings en Bucles',
        'topic.vdt.h3.21': 'Error: "la variable puede no haber sido inicializada"',
        'topic.vdt.h3.22': 'Error: "tipos incompatibles: posible conversión con pérdida"',
        'topic.vdt.h3.23': 'Error: "número entero demasiado grande"',
        'topic.vdt.h3.24': 'Error: "tipos de operandos incorrectos para el operador binario"',
        'topic.vdt.h3.25': 'En Ejecución: NumberFormatException',
        'topic.vdt.h3.26': 'Temas Relacionados',

        // ── Fundamentals: Methods (mth) ───────────────────────────────────
        'topic.mth.page-title': 'Métodos y Funciones - JavaDev Bible',
        'topic.mth.subtitle':   'Definición y Uso de Métodos en Java',
        'topic.mth.h2.1':  '¿Qué Son los Métodos?',
        'topic.mth.h2.2':  'Por Dentro: Cómo Funcionan las Llamadas a Métodos',
        'topic.mth.h2.3':  'Anatomía de un Método: Desglose Completo',
        'topic.mth.h2.4':  'Parámetros de Métodos: Análisis Profundo',
        'topic.mth.h2.5':  'Sobrecarga de Métodos',
        'topic.mth.h2.6':  'Métodos Estáticos vs de Instancia',
        'topic.mth.h2.7':  'Buenas Prácticas en Métodos',
        'topic.mth.h2.8':  'Errores Comunes y Cómo Evitarlos',
        'topic.mth.h2.9':  'Preguntas Frecuentes de Entrevistas',
        'topic.mth.h2.10': 'Guía de Solución de Problemas',
        'topic.mth.h2.11': 'Ver También',
        'topic.mth.h3.1':  'Analogía del Mundo Real',
        'topic.mth.h3.2':  'Paso por Valor: La Convención de Llamada en Java',
        'topic.mth.h3.3':  'Modificadores de Acceso en Métodos',
        'topic.mth.h3.4':  'Tipos de Retorno',
        'topic.mth.h3.5':  'Parámetros Básicos',
        'topic.mth.h3.6':  'Argumentos Variables (Varargs)',
        'topic.mth.h3.7':  'Parámetros Finales',
        'topic.mth.h3.8':  'Reglas de Resolución de Sobrecarga',
        'topic.mth.h3.9':  'Cuándo Usar Static',
        'topic.mth.h3.10': 'Diseño de Métodos: Bueno vs Malo',
        'topic.mth.h3.11': 'Error: "Falta la sentencia return"',
        'topic.mth.h3.12': 'Error: "No se puede referenciar un método no estático desde un contexto estático"',
        'topic.mth.h3.13': 'Error: "Sentencia inalcanzable"',
        'topic.mth.h3.14': 'En Ejecución: StackOverflowError',
        'topic.mth.h3.15': 'Temas Relacionados',

        // ── Fundamentals: Access Modifiers (am) ──────────────────────────
        'topic.am.page-title': 'Modificadores de Acceso - JavaDev Bible',
        'topic.am.subtitle':   'Controlando el Acceso a Clases, Métodos y Variables',
        'topic.am.h2.1':  '¿Qué Son los Modificadores de Acceso?',
        'topic.am.h2.2':  'Por Dentro: Cómo Funciona el Control de Acceso',
        'topic.am.h2.3':  'Acceso Private',
        'topic.am.h2.4':  'Acceso por Defecto (Package-Private)',
        'topic.am.h2.5':  'Acceso Protected',
        'topic.am.h2.6':  'Acceso Public',
        'topic.am.h2.7':  'Comparativa Completa de Niveles de Acceso',
        'topic.am.h2.8':  'Buenas Prácticas y Directrices de Diseño',
        'topic.am.h2.9':  'Errores Comunes',
        'topic.am.h2.10': 'Preguntas Frecuentes de Entrevistas',
        'topic.am.h2.11': 'Guía de Solución de Problemas',
        'topic.am.h2.12': 'Ver También',
        'topic.am.h3.1':  'Analogía del Mundo Real: Zonas de Seguridad',
        'topic.am.h3.2':  'Aplicación en la JVM',
        'topic.am.h3.3':  'Constructores Privados',
        'topic.am.h3.4':  'Package-Private para Diseño de APIs',
        'topic.am.h3.5':  'Reglas de Acceso Protected',
        'topic.am.h3.6':  'Modificadores de Acceso para Diferentes Elementos',
        'topic.am.h3.7':  'Error: "X tiene acceso private en Y"',
        'topic.am.h3.8':  'Error: "X no es público en Y; no se puede acceder desde fuera del paquete"',
        'topic.am.h3.9':  'Error: "se intenta asignar privilegios de acceso más débiles"',
        'topic.am.h3.10': 'Temas Relacionados',

        // ── Fundamentals: OOP Principles (oop) ───────────────────────────
        'topic.oop.page-title': 'Principios de POO - JavaDev Bible',
        'topic.oop.subtitle':   'Los Cuatro Pilares de la Programación Orientada a Objetos',
        'topic.oop.h2.1':  '¿Qué es la Programación Orientada a Objetos (POO)?',
        'topic.oop.h2.2':  'Los Cuatro Pilares de la POO',
        'topic.oop.h2.3':  '1. Encapsulamiento',
        'topic.oop.h2.4':  '2. Herencia',
        'topic.oop.h2.5':  '3. Polimorfismo',
        'topic.oop.h2.6':  '4. Abstracción',
        'topic.oop.h2.7':  'Por Dentro: Cómo Funciona la POO en la JVM',
        'topic.oop.h2.8':  'Buenas Prácticas',
        'topic.oop.h2.9':  'Errores Comunes',
        'topic.oop.h2.10': 'Consideraciones de Rendimiento',
        'topic.oop.h2.11': 'En la Práctica: Aplicaciones del Mundo Real',
        'topic.oop.h2.12': 'Guía de Solución de Problemas',
        'topic.oop.h2.13': 'Preguntas de Entrevista',
        'topic.oop.h2.14': 'Ver También',
        'topic.oop.h3.1':  'Contexto Histórico: La Evolución de la POO',
        'topic.oop.h3.2':  'El Panorama General: La POO en el Ecosistema Java',
        'topic.oop.h3.3':  'Analogía del Mundo Real: Construir con LEGO',
        'topic.oop.h3.4':  'Un Ejemplo Concreto: Modelando un Coche',
        'topic.oop.h3.5':  '¿Por Qué Usar POO?',
        'topic.oop.h3.6':  'El Problema que Resuelve el Encapsulamiento',
        'topic.oop.h3.7':  'Ejemplo de Código: Encapsulamiento Correcto',
        'topic.oop.h3.8':  'Entendiendo la Relación "es-un"',
        'topic.oop.h3.9':  'Ejemplo de Código',
        'topic.oop.h3.10': 'Polimorfismo en Tiempo de Ejecución',
        'topic.oop.h3.11': 'Polimorfismo en Tiempo de Compilación (Sobrecarga de Métodos)',
        'topic.oop.h3.12': 'Abstracción en Java',
        'topic.oop.h3.13': 'Ejemplo de Código: Sistema de Procesamiento de Pagos',
        'topic.oop.h3.14': 'Despacho de Métodos: Cómo Funciona el Polimorfismo',
        'topic.oop.h3.15': 'Disposición de Objetos en Memoria',
        'topic.oop.h3.16': 'Buenas Prácticas de Encapsulamiento',
        'topic.oop.h3.17': 'Buenas Prácticas de Herencia',
        'topic.oop.h3.18': 'Buenas Prácticas de Polimorfismo',
        'topic.oop.h3.19': 'Buenas Prácticas de Abstracción',
        'topic.oop.h3.20': 'Java Collections Framework',
        'topic.oop.h3.21': 'Framework Spring',
        'topic.oop.h3.22': 'Error: "No se puede instanciar una clase abstracta"',
        'topic.oop.h3.23': 'Error: "El método no sobreescribe un método de la superclase"',
        'topic.oop.h3.24': 'Error: "La llamada al constructor debe ser la primera sentencia"',
        'topic.oop.h3.25': 'Problema: Se llama al método incorrecto (polimorfismo erróneo)',
        'topic.oop.h3.26': 'Temas Relacionados',

        // ── Fundamentals: Interfaces vs Abstract Classes (ia) ─────────────
        'topic.ia.page-title': 'Interfaces vs Clases Abstractas - JavaDev Bible',
        'topic.ia.subtitle':   'Entendiendo las Diferencias y Cuándo Usar Cada Una',
        'topic.ia.h2.1':  '¿Qué Son las Interfaces y las Clases Abstractas?',
        'topic.ia.h2.2':  'Interfaces en Profundidad',
        'topic.ia.h2.3':  'Clases Abstractas en Profundidad',
        'topic.ia.h2.4':  'Combinando Interfaces y Clases Abstractas',
        'topic.ia.h2.5':  'El Problema del Diamante y los Métodos Default',
        'topic.ia.h2.6':  'Buenas Prácticas',
        'topic.ia.h2.7':  'Errores Comunes',
        'topic.ia.h2.8':  'Guía de Solución de Problemas',
        'topic.ia.h2.9':  'Preguntas de Entrevista',
        'topic.ia.h2.10': 'Ver También',
        'topic.ia.h3.1':  'Contexto Histórico: La Evolución de las Interfaces',
        'topic.ia.h3.2':  'El Panorama General: Su Lugar en el Diseño Java',
        'topic.ia.h3.3':  'Analogías del Mundo Real',
        'topic.ia.h3.4':  'Evolución de la Sintaxis de Interfaces',
        'topic.ia.h3.5':  'Implementación de Múltiples Interfaces',
        'topic.ia.h3.6':  'Interfaces Funcionales y Lambdas',
        'topic.ia.h3.7':  'Sintaxis de Clases Abstractas',
        'topic.ia.h3.8':  'Patrón Template Method',
        'topic.ia.h3.9':  'Directrices de Diseño de Interfaces',
        'topic.ia.h3.10': 'Directrices de Diseño de Clases Abstractas',
        'topic.ia.h3.11': 'Error: "La clase no es abstracta y no sobreescribe el método abstracto"',
        'topic.ia.h3.12': 'Error: "La llamada al constructor debe ser la primera sentencia"',
        'topic.ia.h3.13': 'Error: "Métodos default duplicados"',
        'topic.ia.h3.14': 'Temas Relacionados',

        // ── Fundamentals: Static vs Instance (si) ────────────────────────
        'topic.si.page-title': 'Estático vs Instancia - JavaDev Bible',
        'topic.si.subtitle':   'Comprendiendo los Miembros a Nivel de Clase vs a Nivel de Objeto',
        'topic.si.h2.1':  '¿Qué es Estático vs Instancia?',
        'topic.si.h2.2':  'Miembros Estáticos en Profundidad',
        'topic.si.h2.3':  'Miembros de Instancia en Profundidad',
        'topic.si.h2.4':  'Reglas de Acceso',
        'topic.si.h2.5':  'Casos de Uso Habituales',
        'topic.si.h2.6':  'Buenas Prácticas',
        'topic.si.h2.7':  'Errores Comunes',
        'topic.si.h2.8':  'Guía de Solución de Problemas',
        'topic.si.h2.9':  'Preguntas de Entrevista',
        'topic.si.h2.10': 'Ver También',
        'topic.si.h3.1':  'Contexto Histórico: Por Qué Existe Static',
        'topic.si.h3.2':  'El Panorama General: Cómo Encaja Static en el Diseño Java',
        'topic.si.h3.3':  'Analogía del Mundo Real: Un Colegio',
        'topic.si.h3.4':  'Visualización de Memoria',
        'topic.si.h3.5':  'Variables Estáticas (Variables de Clase)',
        'topic.si.h3.6':  'Constantes Estáticas',
        'topic.si.h3.7':  'Métodos Estáticos',
        'topic.si.h3.8':  'Bloques Estáticos (Inicializadores Estáticos)',
        'topic.si.h3.9':  'La Palabra Clave \'this\'',
        'topic.si.h3.10': 'Cuándo Usar Static',
        'topic.si.h3.11': 'Cuándo Usar Instancia',
        'topic.si.h3.12': 'Error: "No se puede referenciar un campo no estático desde un contexto estático"',
        'topic.si.h3.13': 'Error: "\'this\' no puede ser referenciado desde un contexto estático"',
        'topic.si.h3.14': 'Problema: La variable estática retiene datos obsoletos entre pruebas',
        'topic.si.h3.15': 'Temas Relacionados',

        // ── Fundamentals: Constructors (con) ─────────────────────────────
        'topic.con.page-title': 'Constructores - JavaDev Bible',
        'topic.con.subtitle':   'Inicialización de Objetos en Java',
        'topic.con.h2.1':  '¿Qué es un Constructor?',
        'topic.con.h2.2':  'Por Dentro: Creación de Objetos en la JVM',
        'topic.con.h2.3':  'Constructor por Defecto',
        'topic.con.h2.4':  'Constructores Personalizados',
        'topic.con.h2.5':  'Constructor de Copia',
        'topic.con.h2.6':  'Sobrecarga de Constructores',
        'topic.con.h2.7':  'Encadenamiento de Constructores',
        'topic.con.h2.8':  'Llamando a Constructores del Padre',
        'topic.con.h2.9':  'Constructores Privados',
        'topic.con.h2.10': 'En la Práctica: Patrones del Mundo Real',
        'topic.con.h2.11': 'Buenas Prácticas',
        'topic.con.h2.12': 'Errores Comunes',
        'topic.con.h2.13': 'Consideraciones de Rendimiento',
        'topic.con.h2.14': 'Guía de Solución de Problemas',
        'topic.con.h2.15': 'Preguntas de Entrevista',
        'topic.con.h3.1':  'Analogía del Mundo Real',
        'topic.con.h3.2':  'Ejemplo Simple: Véalo en Acción',
        'topic.con.h3.3':  '¿Qué Ocurre Paso a Paso?',
        'topic.con.h3.4':  'Constructor vs Método Regular',
        'topic.con.h3.5':  'Asignación de Memoria y Secuencia de Inicialización',
        'topic.con.h3.6':  'El Orden Completo de Inicialización',
        'topic.con.h3.7':  'Vista del Bytecode: Lo que Hace Realmente \'new\'',
        'topic.con.h3.8':  'Valores por Defecto de los Campos',
        'topic.con.h3.9':  'Constructor Sin Argumentos',
        'topic.con.h3.10': 'Constructor con Parámetros',
        'topic.con.h3.11': 'Ejemplo del Mundo Real: Configuración de Conexión',
        'topic.con.h3.12': 'Visualización de la Cadena de Constructores',
        'topic.con.h3.13': 'Reglas de Constructores en Herencia',
        'topic.con.h3.14': 'Herencia Multinivel',
        'topic.con.h3.15': 'Patrón Singleton',
        'topic.con.h3.16': 'Clases de Utilidad',
        'topic.con.h3.17': 'Patrón Factory con Métodos de Fábrica Estáticos',
        'topic.con.h3.18': 'Patrón Builder (Alternativa a Múltiples Constructores)',
        'topic.con.h3.19': 'Clases Record (Java 16+)',
        'topic.con.h3.20': 'Coste de Creación de Objetos',
        'topic.con.h3.21': 'Sobrecarga del Encadenamiento de Constructores',
        'topic.con.h3.22': 'Métodos de Fábrica Estáticos vs Constructores',
        'topic.con.h3.23': 'Errores de Compilación Comunes',
        'topic.con.h3.24': 'Temas Relacionados',

        // ── Fundamentals: Exceptions (exc) ───────────────────────────────
        'topic.exc.page-title': 'Manejo de Excepciones - JavaDev Bible',
        'topic.exc.subtitle':   'Gestionando Errores de Forma Elegante en Java',
        'topic.exc.h2.1':  '¿Qué Son las Excepciones?',
        'topic.exc.h2.2':  '¿Qué Ocurre Cuando se Lanza una Excepción?',
        'topic.exc.h2.3':  'Try-Catch: Capturando Excepciones',
        'topic.exc.h2.4':  'Comprendiendo los Objetos de Excepción',
        'topic.exc.h2.5':  'Múltiples Bloques Catch',
        'topic.exc.h2.6':  'El Bloque Finally',
        'topic.exc.h2.7':  'Excepciones Verificadas vs No Verificadas',
        'topic.exc.h2.8':  'Lanzando tus Propias Excepciones',
        'topic.exc.h2.9':  'Try-With-Resources (Limpieza Automática)',
        'topic.exc.h2.10': 'Excepciones Comunes que Encontrarás',
        'topic.exc.h2.11': 'Buenas Prácticas',
        'topic.exc.h3.1':  'Ejemplo: División por Cero (Sin Manejo de Excepciones)',
        'topic.exc.h3.2':  'Lo Que Realmente Ocurre:',
        'topic.exc.h3.3':  'Ejemplo: Manejo de División por Cero',
        'topic.exc.h3.4':  'Lo Que Realmente Ocurre:',
        'topic.exc.h3.5':  'Métodos Comunes de Excepción',
        'topic.exc.h3.6':  'Ejemplos de Ejecución:',
        'topic.exc.h3.7':  'Salida:',
        'topic.exc.h3.8':  '1. Excepciones Verificadas (en Tiempo de Compilación)',
        'topic.exc.h3.9':  '2. Excepciones No Verificadas (en Tiempo de Ejecución)',
        'topic.exc.h3.10': 'Temas Relacionados',

        // ── Fundamentals: Collections (col) ──────────────────────────────
        'topic.col.page-title': 'Framework de Colecciones - JavaDev Bible',
        'topic.col.subtitle':   'Gestionando Grupos de Objetos de Forma Eficiente',
        'topic.col.h2.1':  '¿Qué Son las Colecciones?',
        'topic.col.h2.2':  'El Framework de Colecciones',
        'topic.col.h2.3':  'Interfaz List',
        'topic.col.h2.4':  'Interfaz Set',
        'topic.col.h2.5':  'Interfaz Map',
        'topic.col.h2.6':  'Operaciones Comunes con Colecciones',
        'topic.col.h2.7':  'Por Qué Importa el Framework de Colecciones',
        'topic.col.h2.8':  'Errores Comunes',
        'topic.col.h3.1':  'Analogías del Mundo Real',
        'topic.col.h3.2':  '¿Por Qué Usar Colecciones?',
        'topic.col.h3.3':  'Arrays vs Colecciones: ¿Cuál es la Diferencia?',
        'topic.col.h3.4':  'ArrayList: Implementación de Array Dinámico',
        'topic.col.h3.5':  'LinkedList: Implementación de Lista Doblemente Enlazada',
        'topic.col.h3.6':  'HashSet: El Más Rápido, Sin Garantía de Orden',
        'topic.col.h3.7':  'TreeSet: Orden Clasificado',
        'topic.col.h3.8':  'LinkedHashSet: Conserva el Orden de Inserción',
        'topic.col.h3.9':  'HashMap: Almacenamiento Rápido Clave-Valor',
        'topic.col.h3.10': 'TreeMap: Ordenado por Claves',
        'topic.col.h3.11': 'LinkedHashMap: Conserva el Orden de Inserción',
        'topic.col.h3.12': 'Ejemplo Práctico: Contador de Frecuencia de Palabras',
        'topic.col.h3.13': 'Ordenación de Colecciones',
        'topic.col.h3.14': 'Búsqueda en Colecciones',
        'topic.col.h3.15': 'Conversión entre Colecciones',
        'topic.col.h3.16': 'Temas Relacionados',

        // ── Fundamentals: Generics (gen) ──────────────────────────────────
        'topic.gen.page-title': 'Genéricos - JavaDev Bible',
        'topic.gen.subtitle':   'Programación Tipada de Forma Segura con Tipos Parametrizados',
        'topic.gen.h2.1':  'Introducción a los Genéricos',
        'topic.gen.h2.2':  'El Problema que Resuelven los Genéricos',
        'topic.gen.h2.3':  'Clases Genéricas',
        'topic.gen.h2.4':  'Métodos Genéricos',
        'topic.gen.h2.5':  'Parámetros de Tipo Acotados',
        'topic.gen.h2.6':  'Wildcards (Comodines)',
        'topic.gen.h2.7':  'Borrado de Tipos',
        'topic.gen.h2.8':  'Interfaces Genéricas',
        'topic.gen.h2.9':  'Errores Comunes',
        'topic.gen.h2.10': 'Preguntas de Entrevista',
        'topic.gen.h2.11': 'Buenas Prácticas',
        'topic.gen.h2.12': 'Ver También',
        'topic.gen.h3.1':  'Antes de los Genéricos (La Época Oscura)',
        'topic.gen.h3.2':  'Con Genéricos (La Forma Moderna)',
        'topic.gen.h3.3':  'Definiendo una Clase Genérica',
        'topic.gen.h3.4':  'Múltiples Parámetros de Tipo',
        'topic.gen.h3.5':  'Ejemplo del Mundo Real: Tipo Result',
        'topic.gen.h3.6':  'Definiendo Métodos Genéricos',
        'topic.gen.h3.7':  'Métodos Genéricos en Clases Genéricas',
        'topic.gen.h3.8':  'Límites Superiores (extends)',
        'topic.gen.h3.9':  'Límites Múltiples',
        'topic.gen.h3.10': 'Parámetros de Tipo Acotados en Métodos',
        'topic.gen.h3.11': 'Wildcard Sin Acotar (?)',
        'topic.gen.h3.12': 'Wildcard Acotado Superiormente (? extends)',
        'topic.gen.h3.13': 'Wildcard Acotado Inferiormente (? super)',
        'topic.gen.h3.14': 'Principio PECS: Producer Extends, Consumer Super',
        'topic.gen.h3.15': 'Temas Relacionados',

        // ── Fundamentals: Lambda & Streams (ls) ──────────────────────────
        'topic.ls.page-title': 'Lambda y Streams - JavaDev Bible',
        'topic.ls.subtitle':   'Programación Funcional en Java',
        'topic.ls.h2.1':  'Introducción',
        'topic.ls.h2.2':  'El Problema que Resuelven las Lambdas',
        'topic.ls.h2.3':  'Expresiones Lambda',
        'topic.ls.h2.4':  'Interfaces Funcionales',
        'topic.ls.h2.5':  'Referencias a Métodos',
        'topic.ls.h2.6':  'Stream API',
        'topic.ls.h2.7':  'Análisis Profundo de Collectors',
        'topic.ls.h2.8':  'Streams Paralelos',
        'topic.ls.h2.9':  'Ejemplos Prácticos',
        'topic.ls.h2.10': 'Errores Comunes',
        'topic.ls.h2.11': 'Preguntas de Entrevista',
        'topic.ls.h2.12': 'Buenas Prácticas',
        'topic.ls.h2.13': 'Por Qué Es Importante',
        'topic.ls.h2.14': 'Ver También',
        'topic.ls.h3.1':  'Sintaxis de Lambda',
        'topic.ls.h3.2':  'Antes vs Después: Ejemplos Reales',
        'topic.ls.h3.3':  'Captura de Variables y Efectivamente Final',
        'topic.ls.h3.4':  'Interfaces Funcionales Integradas (java.util.function)',
        'topic.ls.h3.5':  'Creando Streams',
        'topic.ls.h3.6':  'Operaciones Intermedias (Perezosas)',
        'topic.ls.h3.7':  'Operaciones Terminales (Desencadenan la Ejecución)',
        'topic.ls.h3.8':  'Ejemplo 1: Procesando Datos de Usuarios',
        'topic.ls.h3.9':  'Ejemplo 2: Procesamiento de Archivos',
        'topic.ls.h3.10': 'Ejemplo 3: Procesamiento de Pedidos en E-commerce',
        'topic.ls.h3.11': 'Temas Relacionados',

        // ── Fundamentals: Optional (opt) ──────────────────────────────────
        'topic.opt.page-title': 'Clase Optional - JavaDev Bible',
        'topic.opt.subtitle':   'Gestión Elegante de Valores Nulos',
        'topic.opt.h2.1':  'Introducción',
        'topic.opt.h2.2':  'El Problema que Resuelve Optional',
        'topic.opt.h2.3':  'Creando Objetos Optional',
        'topic.opt.h2.4':  'Comprobando y Extrayendo Valores',
        'topic.opt.h2.5':  'Acciones Condicionales',
        'topic.opt.h2.6':  'Transformando Valores',
        'topic.opt.h2.7':  'Filtrando Valores',
        'topic.opt.h2.8':  'Convirtiendo a Stream (Java 9+)',
        'topic.opt.h2.9':  'Ejemplos Prácticos',
        'topic.opt.h2.10': 'Errores Comunes',
        'topic.opt.h2.11': 'Preguntas de Entrevista',
        'topic.opt.h2.12': 'Buenas Prácticas',
        'topic.opt.h2.13': 'Por Qué Es Importante',
        'topic.opt.h2.14': 'Ver También',
        'topic.opt.h3.1':  'Por Qué null es Problemático',
        'topic.opt.h3.2':  'Qué Ofrece Optional',
        'topic.opt.h3.3':  'Optional.empty() — Explícitamente Vacío',
        'topic.opt.h3.4':  'Optional.of() — Requiere Valor No Nulo',
        'topic.opt.h3.5':  'Optional.ofNullable() — Creación Segura ante Nulos',
        'topic.opt.h3.6':  'isPresent() e isEmpty()',
        'topic.opt.h3.7':  'get() — Acceso Directo (¡Usar con Precaución!)',
        'topic.opt.h3.8':  'orElse() — Valor por Defecto',
        'topic.opt.h3.9':  'orElseGet() — Valor por Defecto Perezoso (Supplier)',
        'topic.opt.h3.10': 'orElseThrow() — Lanzar Excepción si Vacío',
        'topic.opt.h3.11': 'or() — Optional Alternativo (Java 9+)',
        'topic.opt.h3.12': 'ifPresent() — Ejecutar si el Valor Existe',
        'topic.opt.h3.13': 'ifPresentOrElse() — Manejar Ambos Casos (Java 9+)',
        'topic.opt.h3.14': 'map() — Transformar el Valor Contenido',
        'topic.opt.h3.15': 'flatMap() — Evitar Optionals Anidados',
        'topic.opt.h3.16': 'Ejemplo 1: Patrón Repository',
        'topic.opt.h3.17': 'Ejemplo 2: Configuración con Valores por Defecto',
        'topic.opt.h3.18': 'Ejemplo 3: Búsquedas en Cascada',
        'topic.opt.h3.19': 'Temas Relacionados',

        // ── wij: h4, info-box-titles, table headers ───────────────────────
        'topic.wij.h4.1': 'Java 1.0 - 1.4: Los A\u00f1os Fundacionales (1996-2002)',
        'topic.wij.h4.2': 'Java 5 (2004) - El Inicio del Java Moderno',
        'topic.wij.h4.3': 'Java 7 (2011)',
        'topic.wij.h4.4': 'Java 8 (2014) - Lanzamiento Revolucionario',
        'topic.wij.h4.5': 'Java 11 (2018) - LTS',
        'topic.wij.h4.6': 'Java 17 (2021) - LTS',
        'topic.wij.h4.7': 'Java 21 (2023) - LTS m\u00e1s Reciente',
        'topic.wij.ibt.1':  'Por Qu\u00e9 Java es Especial',
        'topic.wij.ibt.2':  'Hitos Hist\u00f3ricos Clave',
        'topic.wij.ibt.3':  'La Magia de la Independencia de Plataforma',
        'topic.wij.ibt.4':  'Java en Cifras',
        'topic.wij.ibt.5':  'Comprendiendo el LTS (Soporte a Largo Plazo)',
        'topic.wij.ibt.6':  'Java \u2260 JavaScript',
        'topic.wij.ibt.7':  'El Nombre del Archivo Debe Coincidir con la Clase',
        'topic.wij.ibt.8':  'Las May\u00fasculas y Min\u00fasculas Importan',
        'topic.wij.ibt.9':  'Los Puntos y Coma Son Obligatorios',
        'topic.wij.ibt.10': 'Firma del M\u00e9todo main',
        'topic.wij.ibt.11': 'Preguntas de Entrevista: \u00bfQu\u00e9 es Java?',
        'topic.wij.th.1': 'Edici\u00f3n',
        'topic.wij.th.2': 'Caso de Uso',
        'topic.wij.th.3': 'Tecnolog\u00edas Clave',
        'topic.wij.th.4': 'Aspecto',
        'topic.wij.th.5': 'Java',
        'topic.wij.th.6': 'Python',
        'topic.wij.th.7': 'C++',
        'topic.wij.th.8': 'JavaScript',
        'topic.wij.th.9': 'Java',
        'topic.wij.th.10': 'JavaScript',

        // ── vdt: info-box-titles, table headers ───────────────────────────
        'topic.vdt.ibt.1':  'Conceptos Clave',
        'topic.vdt.ibt.2':  'Dato de Rendimiento',
        'topic.vdt.ibt.3':  '\u00a1No Olvides el Sufijo L!',
        'topic.vdt.ibt.4':  '\u00a1Nunca Uses float/double para Dinero!',
        'topic.vdt.ibt.5':  'Comparaci\u00f3n de Strings: Usa equals(), No ==',
        'topic.vdt.ibt.6':  'Cu\u00e1ndo Usar var',
        'topic.vdt.ibt.7':  'Error Com\u00fan 1: Variables Locales No Inicializadas',
        'topic.vdt.ibt.8':  'Error Com\u00fan 2: Truncamiento en Divisi\u00f3n Entera',
        'topic.vdt.ibt.9':  'Error Com\u00fan 3: Desbordamiento de Entero',
        'topic.vdt.ibt.10': 'Error Com\u00fan 4: Comparaci\u00f3n de Strings con ==',
        'topic.vdt.ibt.11': 'Error Com\u00fan 5: NullPointerException al Desempaquetar Wrapper',
        'topic.vdt.ibt.12': 'Error Com\u00fan 6: Precisi\u00f3n en Punto Flotante',
        'topic.vdt.ibt.13': 'Impacto en Memoria seg\u00fan el Tipo',
        'topic.vdt.ibt.14': 'P1: \u00bfCu\u00e1l es la diferencia entre tipos primitivos y por referencia?',
        'topic.vdt.ibt.15': 'P2: \u00bfPor qu\u00e9 0.1 + 0.2 \u2260 0.3 en Java?',
        'topic.vdt.ibt.16': 'P3: \u00bfQu\u00e9 es el autoboxing y unboxing?',
        'topic.vdt.ibt.17': 'P4: \u00bfCu\u00e1l es la diferencia entre == y equals()?',
        'topic.vdt.ibt.18': 'P5: \u00bfQu\u00e9 pasa cuando un int desborda?',
        'topic.vdt.ibt.19': 'P6: \u00bfPuedes explicar la palabra clave var introducida en Java 10?',
        'topic.vdt.th.1':  'Tipo',
        'topic.vdt.th.2':  'Tama\u00f1o',
        'topic.vdt.th.3':  'Valor M\u00ednimo',
        'topic.vdt.th.4':  'Valor M\u00e1ximo',
        'topic.vdt.th.5':  'Por Defecto',
        'topic.vdt.th.6':  'Caso de Uso',
        'topic.vdt.th.7':  'Primitivo',
        'topic.vdt.th.8':  'Clase Wrapper',
        'topic.vdt.th.9':  'Ejemplo de Uso',
        'topic.vdt.th.10': 'Elemento',
        'topic.vdt.th.11': 'Convenci\u00f3n',
        'topic.vdt.th.12': 'Ejemplos',
        'topic.vdt.th.13': 'Tipo',
        'topic.vdt.th.14': 'Memoria',
        'topic.vdt.th.15': 'Notas',

        // ── mth: info-box-titles, table headers ───────────────────────────
        'topic.mth.ibt.1':  'Terminolog\u00eda Clave',
        'topic.mth.ibt.2':  'Comprendiendo el Paso por Valor',
        'topic.mth.ibt.3':  'Reglas de Varargs',
        'topic.mth.ibt.4':  'Qu\u00e9 NO Puede Diferenciar las Sobrecargas',
        'topic.mth.ibt.5':  'Directrices de Dise\u00f1o de M\u00e9todos',
        'topic.mth.ibt.6':  'Error Com\u00fan 1: Falta la Sentencia return',
        'topic.mth.ibt.7':  'Error Com\u00fan 2: Modificar Par\u00e1metros (Efectos Secundarios Inesperados)',
        'topic.mth.ibt.8':  'Error Com\u00fan 3: Retornar null en Lugar de Vac\u00edo',
        'topic.mth.ibt.9':  'Error Com\u00fan 4: Recursi\u00f3n Infinita',
        'topic.mth.ibt.10': 'Error Com\u00fan 5: Confusi\u00f3n en Sobrecargas con Nulos y Varargs',
        'topic.mth.ibt.11': 'P1: \u00bfCu\u00e1l es la diferencia entre sobrecarga y sobreescritura de m\u00e9todos?',
        'topic.mth.ibt.12': 'P2: \u00bfJava usa paso por valor o paso por referencia?',
        'topic.mth.ibt.13': 'P3: \u00bfPodemos sobrecargar el m\u00e9todo main()?',
        'topic.mth.ibt.14': 'P4: \u00bfQu\u00e9 es un m\u00e9todo est\u00e1tico y cu\u00e1ndo deber\u00edas usarlo?',
        'topic.mth.ibt.15': 'P5: \u00bfPuede un m\u00e9todo devolver m\u00faltiples valores?',
        'topic.mth.ibt.16': 'P6: \u00bfQu\u00e9 es el tipo de retorno covariante?',
        'topic.mth.th.1': 'Modificador',
        'topic.mth.th.2': 'Misma Clase',
        'topic.mth.th.3': 'Mismo Paquete',
        'topic.mth.th.4': 'Subclase',
        'topic.mth.th.5': 'En Todo Lugar',
        'topic.mth.th.6': 'Usa Static Cuando\u2026',
        'topic.mth.th.7': 'Usa Instancia Cuando\u2026',

        // ── am: info-box-titles, table headers ────────────────────────────
        'topic.am.ibt.1':  'Los Cuatro Niveles de Acceso (De M\u00e1s a Menos Restrictivo)',
        'topic.am.ibt.2':  'Reflexi\u00f3n y Seguridad',
        'topic.am.ibt.3':  'Cu\u00e1ndo Usar Private',
        'topic.am.ibt.4':  'Cu\u00e1ndo Usar Acceso por Defecto',
        'topic.am.ibt.5':  'Cu\u00e1ndo Usar Protected',
        'topic.am.ibt.6':  'Campos P\u00fablicos - Generalmente una Mala Idea',
        'topic.am.ibt.7':  'Lista de Verificaci\u00f3n de Modificadores de Acceso',
        'topic.am.ibt.8':  'Error Com\u00fan 1: Exponer Objetos Mutables',
        'topic.am.ibt.9':  'Error Com\u00fan 2: Estructura de Paquetes Incorrecta',
        'topic.am.ibt.10': 'Error Com\u00fan 3: Protected No Significa Lo Que Crees',
        'topic.am.ibt.11': 'P1: \u00bfCu\u00e1les son los cuatro modificadores de acceso en Java?',
        'topic.am.ibt.12': 'P2: \u00bfPuede una clase de nivel superior ser private o protected?',
        'topic.am.ibt.13': 'P3: \u00bfCu\u00e1l es la diferencia entre acceso protected y por defecto?',
        'topic.am.ibt.14': 'P4: \u00bfPodemos acceder a miembros privados usando reflexi\u00f3n?',
        'topic.am.ibt.15': 'P5: \u00bfQu\u00e9 modificador de acceso deber\u00edas usar para variables de instancia?',
        'topic.am.ibt.16': 'P6: \u00bfPuede un m\u00e9todo sobreescritor tener acceso m\u00e1s restrictivo?',
        'topic.am.th.1':  'Modificador',
        'topic.am.th.2':  'Misma Clase',
        'topic.am.th.3':  'Mismo Paquete',
        'topic.am.th.4':  'Subclase (distinto paquete)',
        'topic.am.th.5':  'En Todo Lugar',
        'topic.am.th.6':  'Elemento',
        'topic.am.th.7':  'public',
        'topic.am.th.8':  'protected',
        'topic.am.th.9':  'por defecto',
        'topic.am.th.10': 'private',

        // ── oop: info-box-titles, table headers ───────────────────────────
        'topic.oop.ibt.1':  'Los Cuatro Pilares - Explicaciones Simples',
        'topic.oop.ibt.2':  'Beneficios del Encapsulamiento',
        'topic.oop.ibt.3':  'Precauci\u00f3n con Herencia: Prefiere Composici\u00f3n sobre Herencia',
        'topic.oop.ibt.4':  'Reglas Clave de Herencia en Java',
        'topic.oop.ibt.5':  'Caso de Uso Real: Arquitectura de Plugins',
        'topic.oop.ibt.6':  'Clase Abstracta vs Interfaz',
        'topic.oop.ibt.7':  'Error Com\u00fan 1: Sobreingenier\u00eda con Herencia',
        'topic.oop.ibt.8':  'Error Com\u00fan 2: Romper el Encapsulamiento',
        'topic.oop.ibt.9':  'Error Com\u00fan 3: Violar el Principio de Sustituci\u00f3n de Liskov',
        'topic.oop.ibt.10': 'Error Com\u00fan 4: Olvidar @Override',
        'topic.oop.ibt.11': 'POO y Rendimiento',
        'topic.oop.ibt.12': 'P1: \u00bfCu\u00e1les son los cuatro pilares de la POO?',
        'topic.oop.ibt.13': 'P2: \u00bfCu\u00e1l es la diferencia entre sobrecarga y sobreescritura?',
        'topic.oop.ibt.14': 'P3: \u00bfPor qu\u00e9 deber\u00edamos "preferir composici\u00f3n sobre herencia"?',
        'topic.oop.ibt.15': 'P4: Explica el Principio de Sustituci\u00f3n de Liskov.',
        'topic.oop.ibt.16': 'P5: \u00bfPodemos sobreescribir m\u00e9todos est\u00e1ticos?',
        'topic.oop.ibt.17': 'P6: \u00bfQu\u00e9 es el problema del diamante y c\u00f3mo lo resuelve Java?',
        'topic.oop.ibt.18': 'P7: \u00bfCu\u00e1l es la diferencia entre abstracci\u00f3n y encapsulamiento?',
        'topic.oop.ibt.19': 'P8: \u00bfCu\u00e1ndo usar\u00edas una clase abstracta vs. una interfaz?',
        'topic.oop.th.1': 'Usa Clase Abstracta Cuando',
        'topic.oop.th.2': 'Usa Interfaz Cuando',

        // ── ia: info-box-titles, table headers ────────────────────────────
        'topic.ia.ibt.1':  'Diferencias Clave de un Vistazo',
        'topic.ia.ibt.2':  'Cu\u00e1ndo Usar Interfaces',
        'topic.ia.ibt.3':  'Cu\u00e1ndo Usar Clases Abstractas',
        'topic.ia.ibt.4':  'Error Com\u00fan 1: No se Pueden Instanciar Tipos Abstractos',
        'topic.ia.ibt.5':  'Error Com\u00fan 2: Olvidar Llamar al Constructor super',
        'topic.ia.ibt.6':  'Error Com\u00fan 3: No Implementar el M\u00e9todo Abstracto',
        'topic.ia.ibt.7':  'Error Com\u00fan 4: Modificador de Acceso Incorrecto en Sobreescritura',
        'topic.ia.ibt.8':  'P1: \u00bfCu\u00e1l es la diferencia entre una interfaz y una clase abstracta?',
        'topic.ia.ibt.9':  'P2: \u00bfPuede una interfaz extender otra? \u00bfPuede extender m\u00faltiples?',
        'topic.ia.ibt.10': 'P3: \u00bfQu\u00e9 son los m\u00e9todos default y por qu\u00e9 se a\u00f1adieron?',
        'topic.ia.ibt.11': 'P4: \u00bfPodemos tener m\u00e9todos est\u00e1ticos en una interfaz?',
        'topic.ia.ibt.12': 'P5: \u00bfQu\u00e9 pasa cuando una clase implementa dos interfaces con el mismo m\u00e9todo default?',
        'topic.ia.ibt.13': 'P6: \u00bfPuede una clase abstracta tener constructor?',
        'topic.ia.ibt.14': 'P7: \u00bfCu\u00e1ndo usar\u00edas una clase abstracta con solo m\u00e9todos abstractos?',
        'topic.ia.ibt.15': 'P8: \u00bfQu\u00e9 es una interfaz funcional?',
        'topic.ia.th.1': 'Caracter\u00edstica',
        'topic.ia.th.2': 'Interfaz',
        'topic.ia.th.3': 'Clase Abstracta',

        // ── si: h4, info-box-titles, table headers ────────────────────────
        'topic.si.h4.1': '1. M\u00e9todos de Utilidad/Ayudantes',
        'topic.si.h4.2': '2. M\u00e9todos Factory',
        'topic.si.h4.3': '3. Patr\u00f3n Singleton',
        'topic.si.h4.4': '4. Contadores y Estado Compartido',
        'topic.si.ibt.1':  'Resumen de Diferencias Clave',
        'topic.si.ibt.2':  'Reglas de Acceso Cr\u00edticas',
        'topic.si.ibt.3':  'Buenas Pr\u00e1cticas con Static',
        'topic.si.ibt.4':  'Buenas Pr\u00e1cticas con Instancia',
        'topic.si.ibt.5':  'Error Com\u00fan 1: Acceder a Instancia desde Contexto Est\u00e1tico',
        'topic.si.ibt.6':  'Error Com\u00fan 2: Usar \'this\' en Contexto Est\u00e1tico',
        'topic.si.ibt.7':  'Error Com\u00fan 3: Estado Est\u00e1tico Mutable (Seguridad en Hilos)',
        'topic.si.ibt.8':  'Error Com\u00fan 4: Los M\u00e9todos Est\u00e1ticos No Se Pueden Sobreescribir',
        'topic.si.ibt.9':  'P1: \u00bfCu\u00e1l es la diferencia entre miembros est\u00e1ticos y de instancia?',
        'topic.si.ibt.10': 'P2: \u00bfPor qu\u00e9 los m\u00e9todos est\u00e1ticos no pueden acceder a variables de instancia?',
        'topic.si.ibt.11': 'P3: \u00bfPodemos sobreescribir m\u00e9todos est\u00e1ticos?',
        'topic.si.ibt.12': 'P4: \u00bfQu\u00e9 es un bloque est\u00e1tico y cu\u00e1ndo se ejecuta?',
        'topic.si.ibt.13': 'P5: \u00bfPor qu\u00e9 el m\u00e9todo main es est\u00e1tico?',
        'topic.si.ibt.14': 'P6: \u00bfPueden los m\u00e9todos est\u00e1ticos usar \'this\' o \'super\'?',
        'topic.si.ibt.15': 'P7: \u00bfEs buena pr\u00e1ctica acceder a miembros est\u00e1ticos a trav\u00e9s de instancias?',
        'topic.si.ibt.16': 'P8: \u00bfCu\u00e1les son las implicaciones de seguridad en hilos con variables est\u00e1ticas?',
        'topic.si.th.1': 'Aspecto',
        'topic.si.th.2': 'Est\u00e1tico',
        'topic.si.th.3': 'Instancia',

        // ── con: info-box-titles ──────────────────────────────────────────
        'topic.con.ibt.1':  'Reglas Especiales de los Constructores',
        'topic.con.ibt.2':  'El M\u00e9todo &lt;init&gt;',
        'topic.con.ibt.3':  '\u00a1El Constructor por Defecto Desaparece!',
        'topic.con.ibt.4':  'Copia Superficial vs Copia Profunda',
        'topic.con.ibt.5':  'Reglas de this()',
        'topic.con.ibt.6':  'Reglas de super()',
        'topic.con.ibt.7':  'Buenas Pr\u00e1cticas en Constructores',
        'topic.con.ibt.8':  'Error Com\u00fan 1: Olvidar super() Cuando el Padre No Tiene Constructor por Defecto',
        'topic.con.ibt.9':  'Error Com\u00fan 2: Llamar a M\u00e9todos Sobreescribibles en el Constructor',
        'topic.con.ibt.10': 'Error Com\u00fan 3: Almacenar Par\u00e1metros Mutables Directamente',
        'topic.con.ibt.11': 'Error Com\u00fan 4: Excepci\u00f3n en el Constructor Deja un Objeto Parcial',
        'topic.con.ibt.12': '"constructor X en clase Y no se puede aplicar a los tipos dados"',
        'topic.con.ibt.13': '"la llamada a this debe ser la primera sentencia en el constructor"',
        'topic.con.ibt.14': '"la variable x puede no haber sido inicializada"',
        'topic.con.ibt.15': '"invocaci\u00f3n recursiva del constructor"',
        'topic.con.ibt.16': 'P1: \u00bfCu\u00e1l es la diferencia entre un constructor y un m\u00e9todo?',
        'topic.con.ibt.17': 'P2: \u00bfPuede un constructor ser private? \u00bfCu\u00e1ndo lo usar\u00edas?',
        'topic.con.ibt.18': 'P3: \u00bfQu\u00e9 pasa si no llamas a super() en un constructor de subclase?',
        'topic.con.ibt.19': 'P4: \u00bfPuedes llamar a this() y super() en el mismo constructor?',
        'topic.con.ibt.20': 'P5: \u00bfQu\u00e9 es el encadenamiento de constructores y para qu\u00e9 sirve?',
        'topic.con.ibt.21': 'P6: \u00bfCu\u00e1l es el orden de inicializaci\u00f3n al crear un objeto?',
        'topic.con.ibt.22': 'P7: \u00bfQu\u00e9 es un constructor de copia? \u00bfC\u00f3mo implementas una copia profunda?',
        'topic.con.ibt.23': 'P8: \u00bfCu\u00e1ndo deber\u00edas usar el patr\u00f3n Builder en lugar de constructores con muchos par\u00e1metros?',

        // ── exc: info-box-titles, table headers ───────────────────────────
        'topic.exc.ibt.1': 'Por Qu\u00e9 Importa el Manejo de Excepciones',
        'topic.exc.ibt.2': 'Flujo del Try-Catch',
        'topic.exc.ibt.3': 'Importante: Orden de los Bloques Catch',
        'topic.exc.ibt.4': 'Cu\u00e1ndo Usar Cada Uno',
        'topic.exc.ibt.5': 'Buenas Pr\u00e1cticas en el Manejo de Excepciones',
        'topic.exc.th.1': 'Excepci\u00f3n',
        'topic.exc.th.2': 'Cu\u00e1ndo Ocurre',
        'topic.exc.th.3': 'Ejemplo',

        // ── col: info-box-titles, table headers ───────────────────────────
        'topic.col.ibt.1': 'Interfaces Principales - Referencia R\u00e1pida',
        'topic.col.ibt.2': 'Cu\u00e1ndo Usar',
        'topic.col.ibt.3': 'Comparativa de Set',
        'topic.col.ibt.4': 'ConcurrentModificationException',
        'topic.col.ibt.5': 'Claves y Valores Nulos',
        'topic.col.th.1': 'Caracter\u00edstica',
        'topic.col.th.2': 'Array',
        'topic.col.th.3': 'Colecci\u00f3n (p.ej., ArrayList)',
        'topic.col.th.4': 'Tipo',
        'topic.col.th.5': 'Orden',
        'topic.col.th.6': 'Rendimiento',
        'topic.col.th.7': 'Usar Cuando',

        // ── gen: info-box-titles ──────────────────────────────────────────
        'topic.gen.ibt.1': 'Por Qu\u00e9 Importan los Gen\u00e9ricos',
        'topic.gen.ibt.2': 'Error Com\u00fan 1: Usar Tipos Crudos (Raw Types)',
        'topic.gen.ibt.3': 'Error Com\u00fan 2: Creaci\u00f3n de Arrays Gen\u00e9ricos',
        'topic.gen.ibt.4': 'Error Com\u00fan 3: Comparar Tipos Gen\u00e9ricos',
        'topic.gen.ibt.5': 'Error Com\u00fan 4: Confundir extends/super',
        'topic.gen.ibt.6': 'Preguntas Frecuentes de Entrevista',
        'topic.gen.ibt.7': 'Buenas Pr\u00e1cticas con Gen\u00e9ricos',

        // ── ls: h4 ────────────────────────────────────────────────────────
        'topic.ls.h4.1':  '\u26a0\ufe0f Error Com\u00fan 1: Reutilizar Streams',
        'topic.ls.h4.2':  '\u26a0\ufe0f Error Com\u00fan 2: Efectos Secundarios en Streams',
        'topic.ls.h4.3':  '\u26a0\ufe0f Error Com\u00fan 3: Streams Infinitos Sin L\u00edmite',
        'topic.ls.h4.4':  '\u26a0\ufe0f Error Com\u00fan 4: Olvidar que los Streams Son Perezosos',
        'topic.ls.h4.5':  '\u26a0\ufe0f Error Com\u00fan 5: NullPointerException en Streams',
        'topic.ls.h4.6':  'P1: \u00bfCu\u00e1l es la diferencia entre operaciones intermedias y terminales?',
        'topic.ls.h4.7':  'P2: \u00bfQu\u00e9 es una interfaz funcional? Nombra algunas integradas.',
        'topic.ls.h4.8':  'P3: \u00bfQu\u00e9 significa "efectivamente final"?',
        'topic.ls.h4.9':  'P4: Explica flatMap vs map.',
        'topic.ls.h4.10': 'P5: \u00bfCu\u00e1ndo deber\u00edas usar streams paralelos?',
        'topic.ls.h4.11': 'P6: \u00bfCu\u00e1les son los cuatro tipos de referencias a m\u00e9todos?',
        'topic.ls.h4.12': 'P7: \u00bfC\u00f3mo beneficia la evaluaci\u00f3n perezosa a los streams?',

        // ── opt: h4 ───────────────────────────────────────────────────────
        'topic.opt.h4.1':  '\u26a0\ufe0f Error Com\u00fan 1: Usar isPresent() + get()',
        'topic.opt.h4.2':  '\u26a0\ufe0f Error Com\u00fan 2: Usar Optional como Campo',
        'topic.opt.h4.3':  '\u26a0\ufe0f Error Com\u00fan 3: Usar Optional como Par\u00e1metro de M\u00e9todo',
        'topic.opt.h4.4':  '\u26a0\ufe0f Error Com\u00fan 4: Retornar Optional de una Colecci\u00f3n',
        'topic.opt.h4.5':  '\u26a0\ufe0f Error Com\u00fan 5: orElse() con un Valor por Defecto Costoso',
        'topic.opt.h4.6':  '\u26a0\ufe0f Error Com\u00fan 6: Optional Anidado',
        'topic.opt.h4.7':  'P1: \u00bfQu\u00e9 es Optional y por qu\u00e9 se introdujo?',
        'topic.opt.h4.8':  'P2: \u00bfCu\u00e1l es la diferencia entre Optional.of() y Optional.ofNullable()?',
        'topic.opt.h4.9':  'P3: \u00bfCu\u00e1l es la diferencia entre orElse() y orElseGet()?',
        'topic.opt.h4.10': 'P4: \u00bfCu\u00e1ndo NO deber\u00edas usar Optional?',
        'topic.opt.h4.11': 'P5: \u00bfCu\u00e1l es la diferencia entre map() y flatMap() en Optional?',
        'topic.opt.h4.12': 'P6: \u00bfC\u00f3mo manejas m\u00faltiples Optionals encadenados?',
        'topic.opt.h4.13': 'P7: \u00bfPor qu\u00e9 el patr\u00f3n isPresent() + get() se considera mala pr\u00e1ctica?'
    };

    // ── State ──────────────────────────────────────────────────────────────
    var STORAGE_KEY = 'javabible-lang';
    var currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
    var originalsStored = false;

    // ── Store originals before first Spanish apply ─────────────────────────
    function storeOriginals() {
        if (originalsStored) return;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            if (!el.hasAttribute('data-i18n-en')) {
                el.setAttribute('data-i18n-en', el.innerHTML);
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            if (!el.hasAttribute('data-i18n-en-placeholder')) {
                el.setAttribute('data-i18n-en-placeholder', el.placeholder || '');
            }
        });
        var titleKey = document.documentElement.dataset.i18nTitle;
        if (titleKey && !document.documentElement.dataset.i18nEnTitle) {
            document.documentElement.dataset.i18nEnTitle = document.title;
        }
        originalsStored = true;
    }

    // ── Apply Spanish ──────────────────────────────────────────────────────
    function applySpanish() {
        storeOriginals();

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var val = ES[el.getAttribute('data-i18n')];
            if (val === undefined) return;
            el.textContent = val;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var val = ES[el.getAttribute('data-i18n-placeholder')];
            if (val !== undefined) el.placeholder = val;
        });

        var titleKey = document.documentElement.dataset.i18nTitle;
        if (titleKey && ES[titleKey]) document.title = ES[titleKey];

        document.documentElement.lang = 'es';
        if (window.rebuildTOC) window.rebuildTOC();
    }

    // ── Restore English ────────────────────────────────────────────────────
    function restoreEnglish() {
        document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
            el.innerHTML = el.getAttribute('data-i18n-en');
        });
        document.querySelectorAll('[data-i18n-en-placeholder]').forEach(function (el) {
            el.placeholder = el.getAttribute('data-i18n-en-placeholder');
        });
        var enTitle = document.documentElement.dataset.i18nEnTitle;
        if (enTitle) document.title = enTitle;
        document.documentElement.lang = 'en';
        if (window.rebuildTOC) window.rebuildTOC();
    }

    // ── Toggle Button ──────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('i18n-styles')) return;
        var style = document.createElement('style');
        style.id = 'i18n-styles';
        style.textContent =
            '#langToggle{' +
                'position:fixed;top:1rem;right:1rem;z-index:9999;' +
                'background:#088395;border:none;color:#fff;' +
                'padding:0.4rem 0.9rem;border-radius:20px;' +
                'cursor:pointer;font-size:0.82rem;' +
                'font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;' +
                'font-weight:600;letter-spacing:0.02em;' +
                'box-shadow:0 2px 10px rgba(0,0,0,.3);' +
                'transition:background .2s,transform .12s,box-shadow .2s;' +
                'white-space:nowrap;user-select:none;' +
            '}' +
            '#langToggle:hover{' +
                'background:#0A4D68;transform:translateY(-1px);' +
                'box-shadow:0 4px 14px rgba(0,0,0,.35);' +
            '}' +
            '#langToggle:active{transform:translateY(0);box-shadow:0 2px 6px rgba(0,0,0,.25);}';
        document.head.appendChild(style);
    }

    function updateButton() {
        var btn = document.getElementById('langToggle');
        if (!btn) return;
        if (currentLang === 'en') {
            btn.textContent = '\uD83C\uDDEA\uD83C\uDDF8 Español';
            btn.title = 'Cambiar a Español';
        } else {
            btn.textContent = '\uD83C\uDDEC\uD83C\uDDE7 English';
            btn.title = 'Switch to English';
        }
    }

    function injectButton() {
        if (document.getElementById('langToggle')) return;
        var btn = document.createElement('button');
        btn.id = 'langToggle';
        btn.addEventListener('click', toggleLanguage);
        document.body.appendChild(btn);
        updateButton();
    }

    function toggleLanguage() {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        localStorage.setItem(STORAGE_KEY, currentLang);
        if (currentLang === 'es') {
            applySpanish();
        } else {
            restoreEnglish();
        }
        updateButton();
    }

    // ── Init ───────────────────────────────────────────────────────────────
    function init() {
        injectStyles();
        injectButton();
        if (currentLang === 'es') {
            applySpanish();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
