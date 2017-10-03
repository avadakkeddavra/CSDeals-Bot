chrome.runtime.sendMessage({options:'give_balance'},function(response){
     $('#balance').text(response.balance);
}); 


//chrome.runtime.onMessage.addListener(function(requset,sender,sendResponse){
//    alert(response);
//})
function onClick(options) {
	chrome.runtime.sendMessage({options:options},function(response){
        $('#balance').text(response.balance);
        console.log(response);
    }); // отправка сообщения на background.js
}

  

function stop(opt)
{
    chrome.runtime.sendMessage({options:opt}); // отправка сообщения на background.js
}
function validate(data)
{
   if( $('.success').length >=  7)
   {
       return 1;
   }
}
/*

    FUNCTIONS WHICH VALIDATE THE FORM DATA

*/
$(document).ready(function(){
    $('#percentage_form input').not("[type='checkbox']").unbind().on('blur',function(){
      var type = $(this).attr('type');
      var value = $(this).val();
      var id = $(this).attr('id');
    if(id == 'token')
    {    console.log($(this));
        if(value.length != 0)
        {
            $(this).addClass('success');
            $(this).removeClass('error');
            $(this).parent().find('span').remove();
            $('#start').removeAttr('disabled');
            $('#start').removeClass('disabled');
            $.ajax({
                url:'http://bot.poisk.zp.ua/stat.php',
                type:"POST",
                data:'sessionID='+value,
                success: function(response)
                {
                    
                   localStorage.setItem('balance',response);
                   $('#balance').text(response);

                }
            });
        }else{
            $('#start').attr('disabled','disabled');
            $('#start').addClass('disabled');
            $(this).addClass('error');
            $(this).parent().append('<span style="color:red">Необходимо указать токен</span>');
        }
    }else{
      switch (type)
      {
          case 'number':
            if($.isNumeric(value) && value.length > 0)
            {
                $(this).addClass('success');
                $(this).removeClass('error');
                $(this).parent().find('span').remove();
                $('#start').removeAttr('disabled');
                $('#start').removeClass('disabled');
            }else{
                 $('#start').attr('disabled','disabled');
                $('#start').addClass('disabled');
                $(this).addClass('error');
                $(this).parent().append('<span style="color:red">Это поле обязательно для заполнения</span>');
            }
          break;
      }
    }

    })
})
/*

    FUNCTION WHICH CONTROLS THE INPUT[TYPE="CHECKBOX"]

*/
$(document).ready(function(){
    $('#toggle_exists').on('click',function(e){  
       if($(this).hasClass('active_check'))
        {
            $(this).removeClass('active_check');  
            $(this).children('.icon').html('<i class="fa fa-toggle-off"></i>')
        }else{
            $(this).addClass('active_check');  
            $(this).children('.icon').html('<i class="fa fa-toggle-on"></i>');
        }
    })
})
/*
    FUNCTION WHITCH ONLOAD THE INFO WHILE WINDOW OPENING
*/
$(document).ready(function(){

     chrome.runtime.sendMessage({options:'give_balance',checkbot:true},function(response){     $('#balance').text(localStorage.getItem('balance'));
       
     if(response.bot_in_work == true)
     {
        $('#start').removeClass('start');
         $('#start').addClass('stop');
         $('#start').text('Stop');
          start_timer();
     }
   });
   
    var timer_value = localStorage.getItem('bg_timer');
    var min = parseInt(timer_value/60);
    var sec = timer_value%60;
    if(sec >= 10){
        $('#time number').eq(1).hide();
    }else{
        $('#time number').eq(1).show();
    }
   $('#time span').eq(0).text(parseInt(timer_value/60));
   $('#time span').eq(1).text(timer_value%60);  
    if(localStorage.getItem('token')){
        $('#token').val(localStorage.getItem('token'))
    }
    $('#output').text(localStorage.getItem('output'));
    $('#output_speed').text(localStorage.getItem('output_speed'));
})
/*
    
    STARTS THE COMMON.JS TIMER

*/
function start_timer(){
    var val;
    var current_val = localStorage.getItem('bg_timer');
    var min = $('#time span').eq(0).html();
    if(current_val){
        val = current_val;
    }else{
        val = 0;
    }
    var custom_timer = setInterval(function(){
        var balance = Number(localStorage.getItem('start_balance'));
    
        $('#output').text(localStorage.getItem('output'));
        var output_speed = localStorage.getItem('output_speed');
        $('#output_speed').text(output_speed);
        //localStorage.setItem('output_speed',output_speed);
        $('#balance').text(localStorage.getItem('balance'));
        if(val >= 60){
            var min = parseInt(val/60);
            var sec = val%60;
            if(min >= 10){
               $('#time number').eq(0).hide(); 
            }
            if(sec >= 10){
                $('#time number').eq(1).hide();
            }else{
                $('#time number').eq(1).show();
            }
            $('#time span').eq(0).text(min);
            $('#time span').eq(1).text(sec);    
        }
        else{
            if(val >= 10){
                $('#time number').eq(1).hide();
            }else{
                $('#time number').eq(1).show();
            }
            $('#time span').eq(1).text(val);
        }
       
        val++;
        
    },1000);
    localStorage.setItem('custom_timer',custom_timer);
}
function stop_timer(timerID){
    clearInterval(timerID)
}
$(document).ready(function(){
    $('#backup').click(function(){
            $('#time span').eq(0).text(0);
            $('#time span').eq(1).text(0);    
            $('#time number').eq(1).show();
            localStorage.removeItem('bg_timer');
            
            localStorage.removeItem('output_speed')
            //start_timer();
    })
})
//MAIN BUTTON TRIGGER
$(document).ready(function(){
    $('#start').on('click',function(e){
        e.preventDefault();

        var check = $(this).hasClass('start');
        $('#time').runner('start');
        
        if($(this).hasClass('start'))
        {
            start_timer();
            $(this).addClass('stop');
            $(this).removeClass('start');
            $(this).text('Stop');
            
            var data = $('#percentage_form').serializeArray();

                var quatity_per_week = data[0].value;
                var quantity_sales = data[1].value; 
                var options = new Object;			
                jQuery.each(data, function(i, item){
                    options[item.name] = item.value;

                });

               options['opskins_url'] = "http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com&updateTime=360&opskinsMinSales="+quatity_per_week+"&opskinsOnSales="+quantity_sales+"";
        
               options['opskins_avg_url'] = "http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com_avg&updateTime=360&opskinsMinSales="+quatity_per_week+"&opskinsOnSales="+quantity_sales+"";

              var response = validate(options);
        
                if(response == 1)
                {
                    localStorage.setItem('token',options.token);
                    onClick(options);
                    
                }
            
            console.log(chrome.extension.getBackgroundPage().status)
            if(localStorage.getItem('not_found')){
                
                $(this).removeClass('stop');
                $(this).addClass('start');
                $(this).text('Start')
                alert(localStorage.getItem('not_found') );
            }
            
        }else{
            console.log('stop');
            var st = 1;
            var options = new Object;			
            options.rate = 0;
            options.stop = 1;
            stop(options);
            stop_timer(localStorage.getItem('custom_timer'));
            $(this).removeClass('stop');
            $(this).addClass('start');
            $(this).text('Start')
        }

    })
    $(".stop").click(function(){
        
    })
})

