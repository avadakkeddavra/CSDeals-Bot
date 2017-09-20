
function onClick(options) { // окно теряет фокус
	chrome.runtime.sendMessage({options:options}); // отправка сообщения на background.js
}
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
            var data = $('#percentage_form').serializeArray();
            console.log(data);

            var quatity_per_week = data[0].value;
            var options = new Object;			
            jQuery.each(data, function(i, item){
                options[item.name] = item.value;
            
			});
					options['opskins_url'] = "http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com&updateTime=360&opskinsMinSales="+quatity_per_week+"&opskinsOnSales=0";
					
					console.log(options);

                    onClick(options);

    })
})

