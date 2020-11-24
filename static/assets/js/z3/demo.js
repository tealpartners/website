// Copyright (c) 2018 Clément Pit-Claudel
// https://github.com/cpitclaudel/z3.wasm/blob/master/html/demo.js

/* exported makeZ3Demo */
function makeZ3Demo(window, queries, responses) {
    var worker;
    var verification_start;

    var console = window.console;
    var document = window.document;
    var run_button = document.getElementById("run");
    var netto = document.getElementById("netto");
    var mc = document.getElementById("mc");
    var result = document.getElementById("result");
    var output = document.getElementById("output");

    function postZ3Message(query, payload) {
        console.info("[Window] → Z3 (" + query + "):", payload);
        worker.postMessage({ kind: query, payload: payload });
    }

    function clear(node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    function disableButton(message) {
        run_button.disabled = true;
        run_button.value = message;
    }

    function enableButton() {
        run_button.disabled = false;
        run_button.value = "Run Z3!";
    }

    function verifyCurrentInput(_event) {
        let netto_value = netto.value;
        let mc_value = mc.checked ? "1" : "0";

        let input = `(declare-const bruto Real )
        (declare-const netto Real )
        (declare-const mc Int)
        
        (assert (= mc ${mc_value}))
        (assert (= netto ${netto_value}))
        
        (assert (> bruto 0.0))
        (assert (= netto (- (* bruto (- 1 0.537)) (* mc (* 6.5 22)))))
        
        (check-sat)
        (get-value(bruto))
        
        (exit)`;

        clear(output);
        disableButton("Running…");
        verification_start = window.performance.now();
        postZ3Message(queries.VERIFY, { args: ["-smt2"], input: input });
    }

    function logOutput(message, cssClass) {
        var span_node = window.document.createElement("span");
        span_node.className = cssClass;
        span_node.appendChild(window.document.createTextNode(message + "\n"));
        output.appendChild(span_node);
    }

    function setResult(message){
        var bruto_regex = /\(\(bruto \((.*)\)\)\)/g;
        var match = bruto_regex.exec(message);
        if (match && match.length > 1) {
            let expr = match[1]
            console.log(expr);
            if (expr[0] == "/") {
                var frac_expr = /\/\s+(\d+.?\d*)\s+(\d+.?\d*)/g
                var frac_parts = frac_expr.exec(expr);
                if (frac_parts.length == 3) {
                    let frac_result = frac_parts[1] / frac_parts[2];
                    expr = Math.round(frac_result * 100) / 100;
                } else {
                    expr = 0;
                }
            }
            result.innerText = expr;
        }
    }

    function onZ3Message(event) {
        console.info("Z3 → [Window]:", event);
        var kind = event.data.kind;
        var payload = event.data.payload;
        switch (kind) {
            case responses.PROGRESS:
                disableButton(payload);
                break;
            case responses.READY:
                enableButton();
                break;
            case responses.STDOUT:
                logOutput(payload, "stdout-msg");
                setResult(payload);
                break;
            case responses.STDERR:
                logOutput(payload, "stderr-msg")
                break;
            case responses.VERIFICATION_COMPLETE:
                enableButton();
                var elapsed = Math.round(window.performance.now() - verification_start);
                logOutput("-- Verification complete (" + elapsed + "ms)", "info-msg");
                break;
        }
    }

    function setupZ3Worker() {
        worker = new window.Worker("/assets/js/z3/worker.js");
        worker.onmessage = onZ3Message;
    }

    function init() {
        setupZ3Worker();
        clear(output);
        run_button.onclick = verifyCurrentInput;
    }

    return { init: init };
}
