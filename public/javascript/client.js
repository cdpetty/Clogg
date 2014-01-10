$(document).ready(function(){
    $('.submit-button').click(function(){
        $.post('/login', {'user':$('.user').val(), 'pass':$('.pass').val()}, function(data){
            $('.content-wrapper').html(data);
            console.log('login submitted');
        });
    });
    $('#posts').click(function(){
        $.post('/posts', {'ajax':true}, function(data){
            $('.content-wrapper').html(data);
            console.log('This was the data: ' + data);
            console.log('posts ajax request sent submitted');
        });
    });
    $('#me').click(function(){
        
    });
    $('#projects').click(function(){
        
    });
    $('#git').click(function(){
        
    });
});
