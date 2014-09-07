module.exports = {
    init: function(){
        var _this = this;
        _this.score = 550;
        _this.kinetic = 1;
        _this.w = 5;
        _this.fill = 'orange';
        _this.strokeWidth = _this.w/2;
    },
    tick: function(delta){
        this.stroke = m.round(performance.now()/200)%2 == 0 ? 'orange' : 'yellow';
        this.posInc(0-delta/10,0);
    }
};