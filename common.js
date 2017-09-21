
function onClick(options) { // окно теряет фокус
	chrome.runtime.sendMessage({options:options}); // отправка сообщения на background.js
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

$(document).ready(function(){
    $('#start').on('click',function(e){
            e.preventDefault();
        if($(this).hasClass('start'))
        {
                
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
})

