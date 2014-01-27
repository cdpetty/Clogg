console.log('Loaded');

function mode(initial){
    this.mode = 's';
    this.setMode = function(newMode){
        this.mode = newMode;
    }
    this.convertTo = function(topOrBottom){
        if (this.mode === 's'){
            if (topOrBottom === 'top') return 'mi';
            else if (topOrBottom === 'bottom') return 'km';
        }
        else if (this.mode ==='w'){
            if (topOrBottom === 'top') return 'lb';
            else if (topOrBottom === 'bottom') return 'kg';
        }
        else if (this.mode ==='c'){
            if (topOrBottom === 'top') return '$';
            else if (topOrBottom === 'bottom') return '£';
        }
    }
}

var mode = new mode('s');


function speed(input, to){
    if (to === 'mi') return (input * 0.6213712);
    else if (to === 'km') return (input / 0.6213712);
}

function weight(input, to){
    if (to === 'lb') return (input * 2.20462);
    else if (to === 'kg') return (input / 2.20462);
}

function cost(input, to){
    if (to === '$') return (1.65 * input);
    else if (to === '£') return (input / 1.65);
}

function calculate(input, to, m){
    if(m == 's') return speed(input, to);
    else if (m == 'w') return weight(input, to);
    else if (m == 'c') return cost(input, to);
}

function clear(){
    $('#top-input').val('');
    $('#bottom-input').val('');
}

function configureUnits(){
    $('#top').text(mode.convertTo('bottom'));
    $('#bottom').text(mode.convertTo('top'));
}

function colorNav(mode){
    if (mode === 's'){
        $('.speed').css('background-color', 'rgba(0, 0, 255, 0.74)');
        $('.weight').removeAttr('style');
        $('.cost').removeAttr('style');
    }
    else if (mode === 'c'){
        $('.cost').css('background-color', 'rgba(0, 0, 255, 0.74)');
        $('.weight').removeAttr('style');
        $('.speed').removeAttr('style');
    }
    else if (mode === 'w'){
        $('.weight').css('background-color', 'rgba(0, 0, 255, 0.74)');
        $('.speed').removeAttr('style');
        $('.cost').removeAttr('style');
    }
}

$(document).ready(function(){
    
    configureUnits();
    colorNav(mode.mode); 
    
    $('#top-input').keypress(function(event){
        if(event.which >= 48 && event.which <= 57 || event.which === 8 || event.which === 46) return true;
        else return false;
    });
    
    $('#bottom-input').keypress(function(event){
        if(event.which >= 48 && event.which <= 57 || event.which === 8 || event.which === 46) return true;
        else return false;
    });
    
    $('#top-input').keyup(function(event){
        if ($('#top-input').val() !== ''){
            var input = $('#top-input').val();
            var converted = calculate(input, mode.convertTo('top'), mode.mode);
            console.log(converted);
            var convertedRounded = converted.toFixed(2);
            $('#bottom-input').val(convertedRounded);
        }
        else{
            $('#bottom-input').val('');
        }
    });
    
    $('#bottom-input').keyup(function(event){
        if ($('#bottom-input').val() !== ''){
            var input = $('#bottom-input').val();
            var converted = calculate(input, mode.convertTo('bottom'), mode.mode);
            console.log(converted);
            var convertedRounded = converted.toFixed(2);
            $('#top-input').val(convertedRounded);
        }
        else{
            $('#top-input').val('');
        }
    });
    
    $('.speed').click(function(){
        mode.setMode('s');
        configureUnits();
        colorNav(mode.mode);
    });
    $('.weight').click(function(){
        mode.setMode('w'); 
        configureUnits();
        colorNav(mode.mode);
    });
    $('.cost').click(function(){
        mode.setMode('c');
        configureUnits();
        colorNav(mode.mode);
    });
    
    $('.nav-bar').click(function(){
        clear();

    });
    
    
});

