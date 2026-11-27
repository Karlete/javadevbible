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
   - gc-generations (topics/advanced/jvm-internals.html): bursts of request
     objects filling Eden, minor GCs copying survivors between S0 and S1 and
     promoting the long-lived ones to Old.
   - thread-states (topics/advanced/multithreading.html): drive one worker
     thread through Thread.State with the calls that cause each transition.
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
        controls.className = 'demo-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Fetch strategy');

        const counter = document.createElement('p');
        counter.className = 'demo-counter';

        const log = document.createElement('ol');
        log.className = 'demo-log';

        const summary = document.createElement('p');
        summary.className = 'demo-summary';
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
                    item.className = row.cached ? 'demo-row is-muted' : 'demo-row';

                    const sql = document.createElement('code');
                    sql.textContent = row.sql;
                    const note = document.createElement('span');
                    note.className = 'demo-note';
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
            button.className = 'demo-button';
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

    // ── Shared helpers ──────────────────────────────────────────────────────

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function button(label, onClick) {
        const b = el('button', 'demo-button', label);
        b.type = 'button';
        b.addEventListener('click', onClick);
        return b;
    }

    // A log row in the same shape as the SQL log: a code line and a note.
    function logRow(code, note, muted) {
        const item = el('li', muted ? 'demo-row is-muted' : 'demo-row');
        item.appendChild(el('code', null, code));
        item.appendChild(el('span', 'demo-note', note));
        return item;
    }

    // ── GC generations ──────────────────────────────────────────────────────

    // Kept small so a reader sees promotion after a few clicks. HotSpot's
    // MaxTenuringThreshold defaults to 15, and G1 lowers the effective
    // threshold at runtime when survivor space runs short.
    const EDEN_SLOTS = 12;
    const TENURING_THRESHOLD = 3;

    // One burst of traffic: what a dozen checkout requests leave on the heap.
    // `life` is how many minor GCs the object survives before it is garbage.
    const BURST = [
        { kind: 'request', life: 0 }, { kind: 'request', life: 0 }, { kind: 'cart', life: 2 },
        { kind: 'request', life: 0 }, { kind: 'request', life: 0 }, { kind: 'cache', life: Infinity },
        { kind: 'request', life: 0 }, { kind: 'request', life: 0 }, { kind: 'request', life: 0 },
        { kind: 'cart', life: 2 }, { kind: 'request', life: 0 }, { kind: 'request', life: 0 }
    ];

    const KIND_LABEL = {
        request: 'request-scoped (DTO, JSON buffer)',
        cart: 'shopping cart, lives 2 GCs',
        cache: 'product cache entry, lives forever'
    };

    function initGcGenerations(figure) {
        let heap;

        const counter = el('p', 'demo-counter');
        const regions = el('div', 'demo-heap');
        const summary = el('p', 'demo-summary');
        summary.setAttribute('aria-live', 'polite');
        const log = el('ol', 'demo-log');

        const fill = button('Fill Eden (12 requests)', function () {
            heap.s0.concat(heap.s1, heap.old).forEach(function (obj) { obj.fresh = false; });
            BURST.forEach(function (template) {
                heap.eden.push({ kind: template.kind, life: template.life, age: 0, fresh: true });
            });
            summary.textContent = 'Eden is full. The next allocation triggers a minor GC.';
            render();
        });

        const collect = button('Minor GC', function () {
            heap.gcs++;
            const to = heap.from === 's0' ? 's1' : 's0';
            const candidates = heap.eden.concat(heap[heap.from]);
            let dead = 0, copied = 0, promoted = 0;

            heap[to] = [];
            candidates.forEach(function (obj) {
                obj.fresh = false;
                if (obj.age >= obj.life) { dead++; return; }
                obj.age++;
                if (obj.age >= TENURING_THRESHOLD) {
                    obj.fresh = true;
                    heap.old.push(obj);
                    promoted++;
                } else {
                    obj.fresh = true;
                    heap[to].push(obj);
                    copied++;
                }
            });
            heap.eden = [];
            heap[heap.from] = [];
            heap.from = to;
            heap.copiedTotal += copied + promoted;

            log.appendChild(logRow(
                'Minor GC #' + heap.gcs + ': ' + dead + ' reclaimed, ' + copied + ' copied to ' +
                    to.toUpperCase() + ', ' + promoted + ' promoted',
                'Eden and the old survivor space are now empty; only the ' + (copied + promoted) +
                    ' live objects were touched.'
            ));

            summary.textContent = heap.gcs === 1
                ? 'The cost of a minor GC follows the live objects it copies, not the garbage: the ' +
                    dead + ' dead objects were never visited.'
                : 'Old Gen grows only with what really lives long. A cache with no size limit fills it ' +
                    'the same way, one promotion per GC, until a much slower old-generation collection is needed.';
            render();
        });

        const reset = button('Reset', start);

        function regionView(name, objects, note) {
            const box = el('section', 'demo-region');
            const head = el('h4', 'demo-region-name', name);
            if (note) head.appendChild(el('span', 'demo-region-note', note));
            box.appendChild(head);

            const cells = el('ul', 'demo-cells');
            const counts = {};
            objects.forEach(function (obj) {
                counts[obj.kind] = (counts[obj.kind] || 0) + 1;
                const cell = el('li', 'demo-cell is-' + obj.kind + (obj.fresh ? ' is-fresh' : ''), String(obj.age));
                cell.title = KIND_LABEL[obj.kind] + ', age ' + obj.age;
                cells.appendChild(cell);
            });
            const parts = Object.keys(counts).map(function (k) { return counts[k] + ' ' + k; });
            cells.setAttribute('aria-label', name + ': ' + (parts.length ? parts.join(', ') : 'empty'));
            if (!objects.length) cells.appendChild(el('li', 'demo-cell is-empty', 'empty'));
            box.appendChild(cells);
            return box;
        }

        function render() {
            regions.textContent = '';
            regions.appendChild(regionView('Eden', heap.eden, heap.eden.length + ' / ' + EDEN_SLOTS));
            regions.appendChild(regionView('Survivor S0', heap.s0, heap.from === 's0' && heap.gcs ? 'from' : ''));
            regions.appendChild(regionView('Survivor S1', heap.s1, heap.from === 's1' ? 'from' : ''));
            regions.appendChild(regionView('Old Gen', heap.old, 'age ≥ ' + TENURING_THRESHOLD));
            counter.textContent = 'Minor GCs: ' + heap.gcs + ' · objects copied: ' + heap.copiedTotal;
            fill.disabled = heap.eden.length > 0;
            collect.disabled = heap.eden.length === 0;
        }

        function start() {
            heap = { eden: [], s0: [], s1: [], old: [], from: 's0', gcs: 0, copiedTotal: 0 };
            log.textContent = '';
            summary.textContent = 'Each cell is an object and the number is its age (minor GCs survived). ' +
                'Fill Eden, then collect it.';
            render();
        }

        const controls = el('div', 'demo-controls');
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Heap actions');
        controls.appendChild(fill);
        controls.appendChild(collect);
        controls.appendChild(reset);

        const legend = el('ul', 'demo-legend');
        Object.keys(KIND_LABEL).forEach(function (kind) {
            const item = el('li', null, KIND_LABEL[kind]);
            item.insertBefore(el('span', 'demo-cell is-' + kind, ''), item.firstChild);
            legend.appendChild(item);
        });

        figure.textContent = '';
        figure.appendChild(el('figcaption', null,
            'Run it: checkout traffic on a generational heap (tenuring threshold ' + TENURING_THRESHOLD + ')'));
        figure.appendChild(controls);
        figure.appendChild(counter);
        figure.appendChild(regions);
        figure.appendChild(legend);
        figure.appendChild(summary);
        figure.appendChild(log);
        start();
        figure.hidden = false;
    }

    // ── Thread states ───────────────────────────────────────────────────────

    const THREAD_STATES = ['NEW', 'RUNNABLE', 'BLOCKED', 'WAITING', 'TIMED_WAITING', 'TERMINATED'];

    // What a stock-reservation worker can do from each state. `to` equal to
    // the current state is a call that leaves Thread.State unchanged — often
    // the more instructive case.
    const THREAD_ACTIONS = {
        NEW: [
            { call: 'worker.run()', to: 'NEW',
              note: 'run() executes on the CALLER’s thread. No new thread starts; worker stays NEW.' },
            { call: 'worker.start()', to: 'RUNNABLE',
              note: 'Now schedulable. RUNNABLE means running or ready to run: Java does not tell the two apart.' }
        ],
        RUNNABLE: [
            { call: 'jdbc.query(…) waits on the socket', to: 'RUNNABLE',
              note: 'Blocking I/O still reports RUNNABLE. A thread dump full of RUNNABLE threads can be an app stalled on the database.' },
            { call: 'synchronized (reservations) {  // held by another thread', to: 'BLOCKED',
              note: 'Waiting to acquire a monitor someone else holds.' },
            { call: 'reservations.wait()', to: 'WAITING',
              note: 'Releases the monitor and parks with no timeout until notify()/notifyAll() or an interrupt.' },
            { call: 'Thread.sleep(200)  // back off before a retry', to: 'TIMED_WAITING',
              note: 'sleep() releases no locks: any monitor this thread holds stays held for the 200 ms.' },
            { call: 'run() returns', to: 'TERMINATED',
              note: 'Finished. An uncaught exception ends the thread the same way.' }
        ],
        BLOCKED: [
            { call: 'worker.interrupt()', to: 'BLOCKED',
              note: 'Interrupting does not free a thread BLOCKED on synchronized. ReentrantLock.lockInterruptibly() can be interrupted.' },
            { call: 'the holder leaves its synchronized block', to: 'RUNNABLE',
              note: 'Monitor acquired; the thread is schedulable again.' }
        ],
        WAITING: [
            { call: 'reservations.notifyAll()  // from another thread', to: 'BLOCKED',
              note: 'Woken, but it must re-acquire the monitor first: BLOCKED until the notifier leaves its synchronized block.' },
            { call: 'worker.interrupt()', to: 'RUNNABLE',
              note: 'wait() throws InterruptedException once the monitor is re-acquired. Restore the flag or propagate it.' }
        ],
        TIMED_WAITING: [
            { call: '200 ms elapse', to: 'RUNNABLE',
              note: 'The timeout ends the wait without any other thread involved.' },
            { call: 'worker.interrupt()', to: 'RUNNABLE',
              note: 'sleep() throws InterruptedException and clears the flag: call Thread.currentThread().interrupt() in the catch.' }
        ],
        TERMINATED: [
            { call: 'worker.start()  // again', to: 'TERMINATED', error: true,
              note: 'IllegalThreadStateException: a Thread runs once. Submit a new task to an executor instead.' }
        ]
    };

    function initThreadStates(figure) {
        let state;

        const states = el('ol', 'demo-states');
        states.setAttribute('aria-label', 'Thread.State values');
        const stateItems = {};
        THREAD_STATES.forEach(function (name) {
            const item = el('li', 'demo-state', name);
            stateItems[name] = item;
            states.appendChild(item);
        });

        const controls = el('div', 'demo-controls');
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Calls available in the current state');

        const counter = el('p', 'demo-counter');
        const summary = el('p', 'demo-summary');
        summary.setAttribute('aria-live', 'polite');
        const log = el('ol', 'demo-log');

        function render() {
            THREAD_STATES.forEach(function (name) {
                const current = name === state;
                stateItems[name].classList.toggle('is-current', current);
                if (current) stateItems[name].setAttribute('aria-current', 'step');
                else stateItems[name].removeAttribute('aria-current');
            });
            counter.textContent = 'worker.getState() → ' + state;

            controls.textContent = '';
            THREAD_ACTIONS[state].forEach(function (action) {
                const b = button(action.call, function () { apply(action); });
                b.classList.add('is-code');
                controls.appendChild(b);
            });
            controls.appendChild(button('Reset', start));
        }

        function apply(action) {
            const from = state;
            state = action.to;
            const arrow = action.error ? 'throws' : (from === state ? 'stays ' + state : from + ' → ' + state);
            const row = logRow(action.call, arrow + '. ' + action.note, from === state);
            if (action.error) row.classList.add('is-error');
            log.appendChild(row);
            summary.textContent = action.note;
            render();
        }

        function start() {
            state = 'NEW';
            log.textContent = '';
            summary.textContent = 'Thread worker = new Thread(reserveStock); — created, not started. ' +
                'Pick a call to see which state it leads to.';
            render();
        }

        figure.textContent = '';
        figure.appendChild(el('figcaption', null, 'Drive it: one stock-reservation worker thread'));
        figure.appendChild(states);
        figure.appendChild(counter);
        figure.appendChild(controls);
        figure.appendChild(summary);
        figure.appendChild(log);
        start();
        figure.hidden = false;
    }

    // ── Boot ────────────────────────────────────────────────────────────────

    const DEMOS = {
        'n-plus-one': initNPlusOne,
        'gc-generations': initGcGenerations,
        'thread-states': initThreadStates
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-demo]').forEach(function (el) {
            const init = DEMOS[el.dataset.demo];
            if (init) init(el);
        });
    });
}());
