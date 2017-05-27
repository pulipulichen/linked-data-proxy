
PROCESS_QUEUE_PROCESS = {};
PROCESS_QUEUE_LOCK = {};
process_queue = function (_type, _process) {
    
    if (typeof(PROCESS_QUEUE_LOCK[_type]) === "undefined") {
        PROCESS_QUEUE_LOCK[_type] = false;
        PROCESS_QUEUE_PROCESS[_type] = [];
    }
    
    if (PROCESS_QUEUE_LOCK[_type] === false) {
        if (PROCESS_QUEUE_PROCESS[_type].length === 0) {
            // 那就直接執行吧
            if (typeof(_process) === "function") {
                _process();
            }
        }
        else {
            if (typeof(_process) === "function") {
                PROCESS_QUEUE_PROCESS[_type].push(_process);
            }
            var _p = PROCESS_QUEUE_PROCESS[_type].shift();
            _p();
        }
        
        PROCESS_QUEUE_LOCK[_type] = true;
    }
    else {
        if (typeof(_process) === "function") {
            PROCESS_QUEUE_PROCESS[_type].push(_process);
        }
    }
    
    if (PROCESS_QUEUE_PROCESS[_type].length > 0) {
        setTimeout(function () {
            
        });
    }
};