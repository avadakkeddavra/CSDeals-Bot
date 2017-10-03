
function send_cs_deals_request()
{
    $.ajax({
                url:"http://bot.poisk.zp.ua/",
                type:'POST',
                dataType:'json',
                success: function(response){
                    if(response['success'] == true)
                    {
                        var data = JSON.stringify(response)
                       localStorage.setItem("cs_deals_json", data);
                        
                    }
                  
                }

            });
}
function send_opskins_request(url)
{
        $.ajax({
                url:url,
                type:'GET',
                dataType: 'json',
                success: function(response_opskins){
                    var data = JSON.stringify(response_opskins)

                        localStorage.setItem("opskins_json", data);
                    
                    
                    
                }
            })
}
/**
*
*    Restoring cs.deals array without wrong types of items and collects the items
*
*
*
*
*
*/
function resort_cs_deals(json, options)
{
    var array = json.response;
    var min_price = options.min_price;
    var max_price = options.max_price;
    var index_for_delete = '';
    var wrong_types = options.black_list.split(';');
    //var wrong_types = ['Music','Sticker','Graffiti','Souvenir','Capsule','Case', 'Legends','Gift','Key'];
    var j = 0;
    var k = 0;
    var cs_deals_cleared = [];
    var quantity_items = [];
    
    console.log(options);
    
    $.each(array,function(i,elem){
            var data = elem;
            data.bots_array = [];
            array[i] = data;
            if($.isNumeric(elem.m))
            {
                if(elem.v < min_price || elem.v > max_price || $.inArray(elem.t,wrong_types) != -1 )
                {

                }
                else{
                  quantity_items[k] = elem;
                  k++;      
                }
              
            }
    })
    console.log(quantity_items);
    

     
    $.each(quantity_items,function(i,elem){
        var id = elem.m;
        var bot = elem.b;
        var current_id = elem.a;
        var bots = [];
        if(array[id])     
        {       
//                Считает полличесвто
                var quant = array[id].quantity;
                array[id].quantity = quant+1;
            
            // собирает массив айдишников
            
//                var string_id = cs_deals_cleared[id].ids_array;
//                if(string_id.length == 0){
//                    cs_deals_cleared[id].ids_array = current_id; 
//                }else{
//                    cs_deals_cleared[id].ids_array = string_id+','+current_id; 
//                }
                var data = new Object;
                data.bot = bot;
                data.id = elem.a;
                //console.log(data);
                //array[id].bots_array = new Array;
                var length = array[id].bots_array.length;
                array[id].bots_array[length]= data;
                
                if(array[id].m == "★ Falchion Knife | Scorched (Battle-Scarred)")
                {console.log(length);
                    console.log(id,array[id].bots_array,data);
                }
        }
                    
    })
    console.log(array);
    
    for(var i = 0; i < array.length;i++){
            if(array[i].m == "★ Falchion Knife | Scorched (Battle-Scarred)")
            {
                console.log(array[i], array[i].bots_array);
            }
    }
    
    $.each(array,function(i,elem){
        var price = elem.v;
        if(elem.v < min_price || elem.v > max_price || $.inArray(elem.t,wrong_types) != -1 )
        {
            index_for_delete += ''+i+','; 
        }else{
            var data = elem;
            if(!$.isNumeric(elem.m))
            {
                cs_deals_cleared[j] = data;
                    if(cs_deals_cleared[j].m == "★ Falchion Knife | Scorched (Battle-Scarred)")
                    {
                        console.log(cs_deals_cleared[j],cs_deals_cleared[j].bots_array);
                    }
                
                  j++;
            }

        }
    });
    console.log(cs_deals_cleared);

    return cs_deals_cleared;
}

/**
*
*   Check has the name of item a some string with wrong type
*   (FOR OPSKINS)
*   
*   @return boolean
*/
function strIndxOf(types, name){
    
    
    for(var i = 0; i < types.length; i++)
    {
        var out = name.indexOf(types[i]);
        if(out != -1)
        {
            return 0;
        }
    }
    
    return 1;
}
/**
*
*   Restoring opskins array without wrong types of items
*
*
*   @return array()
*/
function restore_opskins(json,options)
{
    var array = json.priceList;
    var min_price = options.min_price;
    var max_price = options.max_price;
    var wrong_types = options.black_list.split(';');
    //var wrong_types = ['Music','Sticker','Graffiti','Souvenir','Container','Capsule','Case', 'Legends','Gift','Key'];
    var opskins = [];
    var j = 0;
    console.log(wrong_types);
    for (var i in array)
    {   
        if(wrong_types.length > 1)
        {
                
            if(strIndxOf(wrong_types,i) != 0 )
            {
                if(array[i].price >= min_price && array[i].price <= max_price)
                {
                    
                    opskins[i] = array[i];
                }
                
            }
        }else{
            
            if(array[i].price >= min_price && array[i].price <= max_price)
            {     
                  opskins[i] = array[i];      
            }
        }


    }
    return opskins;
}
/**
*
*   Compares two arrays
*
*   
*
*   @return array() 
*/
function arrays_compare(opskins,cs_deals)
{
    var result_opskins = [];
    var k = 0;
    var leght =  opskins.length
    
    for(var i = 0; i < cs_deals.length; i++)
    {
        var cs_deal_item_name = cs_deals[i].m;
        if(opskins[cs_deal_item_name])
        {
            var data = [];
            data.opskins = opskins[cs_deal_item_name];
            data.cs_deals = cs_deals[i];
            result_opskins[k] = data;
            k++;    
        }
       
    }
        

    
    return result_opskins;
}
/**
*
*   Checking the price by formula
*   
*   @all_in_one -> array(opskins, cs_deals) -> 
*   options -> object of users settings
*
*   @return the array() of items from percent interval
*/
function price_checking(all_in_one,options)
{
    var response = [];
    var min_percent = options.min_percent;
    var max_percent = options.max_percent;
    var final_collection = [];
    var j = 0;
    //console.log(min_percent,max_percent)
    for(var i = 0; i < all_in_one.length; i++)
    {
        var cs_price = all_in_one[i].cs_deals.v;
        var ops_price = all_in_one[i].opskins.price;
        var percent = (ops_price*95)/(cs_price)-100;
        if(percent > min_percent && percent < max_percent)
        {
            if(options.compare == 'on')
            {
                var ops_avp_price = all_in_one[i].opskins.opsExtraPrice;
                var avp_percent = (ops_avp_price*95)/(cs_price)-100;
                if(avp_percent > min_percent && avp_percent < max_percent)
                {
                    final_collection[j] = all_in_one[i].cs_deals;
                    j++;     
                }                    
            }else{
                final_collection[j] = all_in_one[i].cs_deals;
                j++; 
            }


        }
    }
    console.log(final_collection);
    return final_collection;
}

/*

    STARTS THE BOT

*/
function bot_start(options,status){
    localStorage.setItem('status',1);
    
    if(status == 'start')
    {

                          // formating the cs_deals json array
                        var cs_deals_json = JSON.parse(localStorage.getItem("cs_deals_json"));;
                        console.log(cs_deals_json);
                        var cs_deals_cleared = resort_cs_deals(cs_deals_json,options);


                          // fromating the opskins json array
                          var opskins_json = JSON.parse(localStorage.getItem("opskins_json")); 
                          console.log(opskins_json);
                          var opskins_cleared_json = restore_opskins(opskins_json,options);
                          console.log(opskins_cleared_json);

                          // compearing two arrays
                          var all_in_arr = arrays_compare(opskins_cleared_json,cs_deals_cleared);
                         // first checkeng
                         var final = price_checking(all_in_arr,options);
                         //console.log(final);
            var bots = []
                        for(var i = 0; i < final.length; i++)
                        {
                            var length = final[i].bots_array.length
                             bots[i] = final[i].bots_array;
                             bots[i][length] = {bot:final[i].b,id:final[i].a};
                        }
                        console.log(bots);
        
        if(bots.length != 0)
        {
              var bots_sorted = [];
                        for(var i = 1; i < 17;i++)
                        {
                            bots_sorted[i] = "";
                            for(var j = 0; j < bots.length; j++)
                            {
                                for(var k = 0; k < bots[j].length; k++)
                                {
                                    //console.log(bots[j][k].bot);
                                   if(bots[j][k].bot == i)
                                    {
                                        if(bots[j][k].id != null)
                                        {
                                            bots_sorted[i] += bots[j][k].id+','; 
                                        }

                                    }         
                                }

                            }
                        }
            console.log(bots_sorted);
            trade(bots_sorted,options);  
        }else{
            console.log('nothing to trade')
            start(options);
        }
    
    }else{
        localStorage.setItem('status',0);
    }

  
}
/*

    THE MAIN OUTPUT FUNCTION FROM CS.DEALS

*/
function trade(trade_arr,options)
{       
  console.log(trade_arr);
  var rate = options.rate;
  var current_rate = rate;
  if(trade_arr.length != 0)
  {
      console.log(options.rate)
        var i = 1;
        
        var tradeInt = setInterval(function(){  
            if(trade_arr[i] != "")
            {
                console.log(i,trade_arr[i]);              
                $.ajax({
                        url: 'http://bot.poisk.zp.ua/trade.php',
                        data: "token="+options.token+"&bot="+i+"&ids="+trade_arr[i],
                        type: "POST",
                        dataType:'json',
                        success: function(response)
                        {
                            console.log(response);
                            if(response.success == true){
                                getCash();
                                setTimeout(function(){
                                    var current_cash = Number(localStorage.getItem('current_balance'));
                                    var cash = Number(localStorage.getItem('start_balance'));
                                    localStorage.setItem('balance',current_cash);
                                    console.log(cash, current_cash);                                 
                                    localStorage.setItem('output',Number(cash - current_cash).toFixed(3));
                                    localStorage.setItem('output_speed',Number((cash-current_cash)/60).toFixed(3));
                                },1000)
                                
                             }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                })
            }

        i++;
       if(i == trade_arr.length){
           console.log("bot_end");
           localStorage.removeItem('interval')
           clearInterval(tradeInt);
           start(options,'start');
           
       }
    },options.rate);
      localStorage.setItem('interval',tradeInt);
  }

}

/*

    STOPS THE BOT OUTPUT INTERVAL
    
*/
function bot_stop()
{
    localStorage.setItem('status',0);
}

function getCash(){
    
       $.ajax({
        url:'http://bot.poisk.zp.ua/stat.php',
        data:'sessionID='+localStorage.getItem('token'),
        type:"POST",
        success: function(response)
        {
          localStorage.setItem('current_balance',response);
        }
    });
    
}
/*
    
    THIS FUNCTION RETURN THE CUURENT BALANCE OF USER
    
*/
function getStat()
{
    $.ajax({
        url:'http://bot.poisk.zp.ua/stat.php',
        type:"POST",
        data:'sessionID='+localStorage.getItem('token'),
        success: function(response)
        {
           localStorage.setItem('balance',response);
           localStorage.setItem('start_balance',response);
            
        }
    });
    
}
/*
    THIS FUNCTIONS IS A CONTROLLER OF BACKGROUND TIMER

*/
function timer(){
    var valuefd;
    if(localStorage.getItem('bg_timer')){
        var value = localStorage.getItem('bg_timer');
    }else{
        value = 0;
    }
    var bg_timer = setInterval(function(){
        value++;
        localStorage.setItem('bg_timer',value);
    },1000);
    
    localStorage.setItem('bg_indx_timer',bg_timer);
}

/**

    THIS FUNCTION SENDS REQUESTS TO SERVICES AND STARTS A BOT;

*/
function start(options){
    localStorage.setItem('status',1);
    send_cs_deals_request();
    send_opskins_request(options.opskins_url,false);
                      
     setTimeout(function(){
             bot_start(options,'start');
     },10000);
}

/*

    LISTENER OF MESSAGES FROM common.js

*/
var listener = chrome.runtime.onMessage.addListener(
    
  function(request, sender, sendResponse) {
    var options = request.options; // данные о сайте
    var stop = request.options;
    getStat();
    
      if(options == 'give_balance')
        {
            
                    if(request.checkbot == true)
                    {
                        if(localStorage.getItem('status') == 1)
                        {
                            sendResponse({'balance': localStorage.getItem('balance'),'bot_in_work':true});
                        }else{
                            sendResponse({'balance': localStorage.getItem('balance'),'bot_in_work':false});
                        }
                    }
            sendResponse({'balance': localStorage.getItem('balance')});
        }else{
            
                  if(options.stop != 1)
                  { 
                      console.log('BOT START');
                      
                        start(options);
             
                        getStat();
                        timer();
                        sendResponse({'balance': localStorage.getItem('balance'), 'in_work':true});
  
                  }else{
                        var int = localStorage.getItem("interval")
                        clearInterval(int);  
                        localStorage.removeItem('interval');
                        bot_stop();
                        var stop_timer = localStorage.getItem('bg_indx_timer');
                        //localStorage.removeItem('bg_timer');
                        clearInterval(stop_timer);
                        console.log('bot_stop');
                  }
        }

});
