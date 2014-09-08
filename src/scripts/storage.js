var standards = 0;
var cache = {};
try{
    localStorage.i = 'y';
    standards = localStorage.i === 'y';
} catch(e){
    // console.log('no dom store')
}
if(standards && localStorage.pd){
    cache = JSON.parse(localStorage.pd);
}

module.exports = {
    set: function(thisKey,val){
        cache[thisKey] = val;
        var strCache = JSON.stringify(cache);
        if(standards){
            localStorage.pd = strCache;
        }
    },
    cache: cache
}