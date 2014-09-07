var globalKey = 'pd';
var standards = 0;
var cache = {};
try{
    localStorage.i = 'y';
    standards = localStorage.i === 'y';
} catch(e){
    // console.log('no dom store')
}
if(standards && localStorage[globalKey]){
    cache = JSON.parse(localStorage[globalKey]);
}

var chrome = 0;
try{
    chrome = typeof chrome.storage.sync != 'undefined';
    cache = chrome.storage.sync.get(globalKey,function(store){
        if(store){
            cache = JSON.parse(store);
        }
    });
} catch(e) {
    // console.log('no chrome store')
}

module.exports = {
    set: function(thisKey,val){
        cache[thisKey] = val;
        var strCache = JSON.stringify(cache);
        if(standards){
            localStorage[globalKey] = strCache;
        } else if(chrome) {
            chrome.storage.sync.set(globalKey,strCache);
        }
    },
    cache: cache
}