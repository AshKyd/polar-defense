module.exports = {
    init: function(){
        var _this = this;
        _this.score = 550;
        _this.kinetic = 1;
        _this.w = 5;
        _this.fill = 'orange';
        _this.stroke = 'red';
    },
    tick: function(delta){
        this.posInc(0-delta/10,0);
    }
};