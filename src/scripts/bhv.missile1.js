module.exports = {
    init: function(){
        this.kinetic = 1;
        this.src = 'missile1';
        this.w = 10;
    },
    tick: function(delta){
        this.posInc(delta/5,0);
    }
};