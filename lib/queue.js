
// -----------------------

QUEUE_LOCK = {};
QUEUE_STACK = {};
queue_push = function (_type, _proc) {
    if (typeof(QUEUE_LOCK[_type]) === "undefined") {
        QUEUE_LOCK[_type] = false;
        QUEUE_STACK[_type] = [];
    }
    
    if (typeof(_proc) === "function") {
        QUEUE_STACK[_type].push(_proc);
    }
    queue_start(_type);
};

queue_start = function (_type) {
    if (typeof(QUEUE_LOCK[_type]) === "undefined") {
        QUEUE_LOCK[_type] = false;
        QUEUE_STACK[_type] = [];
    }
    
    if (QUEUE_LOCK[_type] === true || QUEUE_STACK[_type].length === 0) {
        return;
    }
    QUEUE_LOCK[_type] = true;
    
    // ----------------------
    var _proc = QUEUE_STACK[_type].shift();
    _proc();
};