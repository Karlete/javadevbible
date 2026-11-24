/* ==========================================================================
   JavaDev Bible — interactive demos (topic pages that opt in)
   ==========================================================================

   Each demo is a static placeholder in the page, <figure data-demo="…" hidden>,
   that this script fills in and reveals. Without JavaScript the placeholder
   stays hidden and the page reads exactly as before: the demos illustrate
   the text, they never replace it.

   Demos animate only when the reader presses a button, and render every step
   at once under prefers-reduced-motion. DOM is built with createElement and
   textContent only.

   Demos:
   - n-plus-one (topics/databases/relationships.html): the SQL that one loop
     over 10 orders sends with a lazy association, batch fetching and
     JOIN FETCH.
   ========================================================================== */

(function () {
    'use strict';

    const STEP_MS = 140;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── N+1 ─────────────────────────────────────────────────────────────────

    // Ten orders; customer 17 placed two of them (orders 1001 and 1005).
    const ORDERS = [
        { id: 1001, customer: 17 }, { id: 1002, customer: 4 }, { id: 1003, customer: 23 },
        { id: 1004, customer: 8 }, { id: 1005, customer: 17 }, { id: 1006, customer: 31 },
        { id: 1007, customer: 12 }, { id: 1008, customer: 5 }, { id: 1009, customer: 40 },
        { id: 1010, customer: 9 }
    ];

    function distinctCustomers() {
        const seen = [];
        ORDERS.forEach(function (o) {
            if (seen.indexOf(o.customer) === -1) seen.push(o.customer);
        });
        return seen;
    }

    const ORDERS_SQL = 'SELECT o.id, o.status, o.customer_id FROM orders o';

    // Each strategy returns the rows of its SQL log. A row is either a query
    // sent to the database or a lookup Hibernate answered from the
    // persistence context without one.
    const STRATEGIES = {
        lazy: {
            label: 'Lazy association (N+1)',
            rows: function () {
                const rows = [{ sql: ORDERS_SQL, note: '10 rows; each order.customer is an uninitialised proxy' }];
                const loaded = [];
                ORDERS.forEach(function (o) {
                    if (loaded.indexOf(o.customer) !== -1) {
                        rows.push({
                            cached: true,
                            sql: 'order ' + o.id + ' → customer ' + o.customer,
                            note: 'already in the persistence context: no query'
                        });
                        return;
                    }
                    loaded.push(o.customer);
                    rows.push({
                        sql: 'SELECT c.id, c.email FROM customers c WHERE c.id = ' + o.customer,
                        note: 'order ' + o.id + ': first call to getCustomer().getEmail()'
                    });
                });
                return rows;
            },
            summary: function (queries) {
                return queries + ' queries for 10 orders: 1 for the orders + 1 per distinct customer (' +
                    distinctCustomers().length + '). With 1,000 orders from 900 customers: 901 queries.';
            }
        },
        batch: {
            label: 'Batch fetching',
            rows: function () {
                return [
                    { sql: ORDERS_SQL, note: '10 rows; customers are proxies' },
                    {
                        sql: 'SELECT c.id, c.email FROM customers c WHERE c.id IN (' + distinctCustomers().join(', ') + ')',
                        note: 'first getCustomer(): Hibernate initialises up to 16 pending proxies at once'
                    }
                ];
            },
            summary: function (queries) {
                return queries + ' queries with default_batch_fetch_size = 16. With 1,000 orders from 900 ' +
                    'customers: 1 + ⌈900 / 16⌉ = 58. A safety net, not a substitute for fetching what the use case needs.';
            }
        },
        join: {
            label: 'JOIN FETCH',
            rows: function () {
                return [{
                    sql: 'SELECT o.id, o.status, c.id, c.email FROM orders o JOIN customers c ON c.id = o.customer_id',
                    note: '10 rows; every order arrives with its customer already initialised'
                }];
            },
            summary: function (queries) {
                return queries + ' query, however many orders: the customers come in the same result set. ' +
                    'The cost moves to wider rows — the right trade for a page that always shows the email.';
            }
        }
    };

    function initNPlusOne(figure) {
        const caption = document.createElement('figcaption');
        caption.textContent = 'Run it: list 10 orders with each customer’s email';

        const controls = document.createElement('div');
        controls.className = 'sql-demo-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Fetch strategy');

        const counter = document.createElement('p');
        counter.className = 'sql-demo-counter';

        const log = document.createElement('ol');
        log.className = 'sql-demo-log';

        const summary = document.createElement('p');
        summary.className = 'sql-demo-summary';
        summary.setAttribute('aria-live', 'polite');

        const buttons = [];
        let timers = [];

        function stop() {
            timers.forEach(clearTimeout);
            timers = [];
        }

        function setCounter(queries) {
            counter.textContent = 'Queries sent: ' + queries;
        }

        function run(key) {
            stop();
            const strategy = STRATEGIES[key];
            buttons.forEach(function (b) {
                b.setAttribute('aria-pressed', String(b.dataset.strategy === key));
            });
            log.textContent = '';
            summary.textContent = '';
            setCounter(0);

            const rows = strategy.rows();
            let queries = 0;

            rows.forEach(function (row, i) {
                function show() {
                    const item = document.createElement('li');
                    item.className = row.cached ? 'sql-demo-row is-cached' : 'sql-demo-row';

                    const sql = document.createElement('code');
                    sql.textContent = row.sql;
                    const note = document.createElement('span');
                    note.className = 'sql-demo-note';
                    note.textContent = row.note;

                    item.appendChild(sql);
                    item.appendChild(note);
                    log.appendChild(item);

                    if (!row.cached) queries++;
                    setCounter(queries);
                    if (i === rows.length - 1) summary.textContent = strategy.summary(queries);
                }

                if (reduceMotion) show();
                else timers.push(setTimeout(show, i * STEP_MS));
            });
        }

        Object.keys(STRATEGIES).forEach(function (key) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'sql-demo-button';
            button.dataset.strategy = key;
            button.textContent = STRATEGIES[key].label;
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', function () { run(key); });
            buttons.push(button);
            controls.appendChild(button);
        });

        figure.textContent = '';
        figure.appendChild(caption);
        figure.appendChild(controls);
        figure.appendChild(counter);
        figure.appendChild(log);
        figure.appendChild(summary);
        summary.textContent = 'Pick a strategy to see the SQL that the same loop sends.';
        setCounter(0);
        figure.hidden = false;
    }

    // ── Boot ────────────────────────────────────────────────────────────────

    const DEMOS = { 'n-plus-one': initNPlusOne };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-demo]').forEach(function (el) {
            const init = DEMOS[el.dataset.demo];
            if (init) init(el);
        });
    });
}());
