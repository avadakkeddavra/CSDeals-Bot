chrome.runtime.sendMessage({options:'give_balance'},function(response){
     $('#balance').text(response.balance);
}); 
$(document).ready(function(){
     chrome.runtime.sendMessage({options:'give_balance',checkbot:true},function(response){
     $('#balance').text(response.balance);
       
     if(response.bot_in_work == true)
     {
        $('#start').removeClass('start');
         $('#start').addClass('stop');
         $('#start').text('Stop')
     }
   }); 
})

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
$(document).ready(function(){
    $('#percentage_form input').not("[type='checkbox']").unbind().on('blur',function(){
      var type = $(this).attr('type');
      var value = $(this).val();
      
      switch (type)
      {
          case 'number':
            if($.isNumeric(value) && value.length > 0)
            {
                $(this).addClass('success');
                $(this).removeClass('error');
                $(this).parent().find('span').remove();
            }else{
                $(this).addClass('error');
                $(this).parent().append('<span style="color:red">Это поле обязательно для заполнения</span>');
            }
          break;
      }
    })
})

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
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}

function formatTime(time) {
    time = time / 10;
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}
function updateTimer() {
    
     var $stopwatch = $('#time');
     var currentTime = 0;
     var incrementTime = 70;
     var timeString = formatTime(currentTime);
        $stopwatch.html(timeString);
        currentTime += incrementTime;
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
$(document).ready(function(){
    $('#start').on('click',function(e){
        e.preventDefault();
       
        var check = $(this).hasClass('start');
        $('#time').runner('start');
        
        if($(this).hasClass('start'))
        {
            //$('#time').runner('start');
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
                    onClick(options);
                }
            if(localStorage.getItem('not_found')){
                
                $(this).removeClass('stop');
                $(this).addClass('start');
                $(this).text('Start')
                alert(localStorage.getItem('not_found') );
            }
            
        }else{
            console.log('func');
            var st = 1;
            var options = new Object;			
            options.rate = 0;
            options.stop = 1;
            stop(options);
            $(this).removeClass('stop');
            $(this).addClass('start');
            $(this).text('Start')
        }

    })
    $(".stop").click(function(){
        
    })
})

