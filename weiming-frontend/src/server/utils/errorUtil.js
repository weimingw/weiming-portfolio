export function logError(req, error, errorId) {
    console.error(`  >>> ERROR from ${req.path}`);
    console.error(`    id: ${errorId}`);
    console.error(`    body: ${JSON.stringify(req.body)}`);
    console.error(`    query: ${JSON.stringify(req.query)}`);
    // get first few lines of the stack trace
    console.error(`      ${error.stack.split("\n", 9).join("\n      ")}`); 
    console.error('  === Request End ===  ');
}