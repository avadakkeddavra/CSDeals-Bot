
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
function send_opskins_request(url,avg)
{
        $.ajax({
                url:url,
                type:'GET',
                dataType: 'json',
                success: function(response_opskins){
                    var data = JSON.stringify(response_opskins)
                    if(avg == true)
                    {
                        localStorage.setItem("opskins_avg_json", data);    
                    }else{
                        localStorage.setItem("opskins_json", data);
                    }
                    
                    
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
    $.each(array,function(i,elem){
        var price = elem.v;
        if(elem.v < min_price || elem.v > max_price || $.inArray(elem.t,wrong_types) != -1 )
        {
            index_for_delete += ''+i+','; 
        }else{
            var data = elem;
            if(!$.isNumeric(elem.m))
            {
                data.quantity = 1;
                data.ids_array = '';
                cs_deals_cleared[j] = data;
                j++;
            }else{
               quantity_items[k] = elem;
                k++;
            }

        }
    });
    
    
    $.each(quantity_items,function(i,elem){
        var id = elem.m;
        var current_id = elem.a;
        var z = 0;
        if(cs_deals_cleared[id])
            console.log(id);
        {       console.log(elem,cs_deals_cleared[id]);
                
                var quant = cs_deals_cleared[id].quantity;
                cs_deals_cleared[id].quantity = quant+1;
                var string_id = cs_deals_cleared[id].ids_array;
                if(string_id.length == 0){
                    cs_deals_cleared[id].ids_array = current_id; 
                }else{
                    cs_deals_cleared[id].ids_array = string_id+','+current_id; 
                }
                
                z++;
        }
                    
    })

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

function bot_start(options){
            send_cs_deals_request();
                  // formating the cs_deals json array
                    var cs_deals_json = JSON.parse(localStorage.getItem("cs_deals_json"));
                console.log(cs_deals_json);
                    var cs_deals_cleared = resort_cs_deals(cs_deals_json,options); 
                    console.log(cs_deals_cleared);
            for(var i = 0 ; i  < cs_deals_cleared.length; i++)
                {
                    if(cs_deals_cleared[i].m == 'UMP-45 | Corporal (Minimal Wear)')
                        {
                            console.log(cs_deals_cleared[i]);
                        }else{
                            console.log('not_found')
                        }
                }
            send_opskins_request(options.opskins_url,false);

                  // fromating the opskins json array
                  var opskins_json = JSON.parse(localStorage.getItem("opskins_json")); 
                   //console.log(opskins_json);
                  var opskins_cleared_json = restore_opskins(opskins_json,options);
                  //console.log(opskins_cleared_json);

                  // compearing two arrays
                  var all_in_arr = arrays_compare(opskins_cleared_json,cs_deals_cleared);
                 // first checkeng
                 var final = price_checking(all_in_arr,options);
                  //console.log(final);
                var bots = [];
                
                var k = 0; 
                for(var i = 1; i < 16; i++)
                {
                    var bot = i;
                    for(var j = 0; j < final.length; j++)
                    {
                        if(final[j].b == i)
                        {
                            var data =  new Array;
                            data.bot = bot;
                            if(final[j].ids_array)
                            {
                                data.ids = final[j].a+','+final[j].ids_array;
                            }else{
//                                var ids_arr = final[j].a;
//                                
//                                if($.isArray(ids_arr) == true){
//                                   
//                                   var ids_string = '';
//                                    for(var z = 0; z < ids_arr.length; z++)
//                                    {
//                                        ids_string += ids_arr[z]+','; 
//                                    }
//                                    data.ids = ids_string;
//                                }else{
//                                    
//                                }
                                data.ids = final[j].a;
                            }
                           
                            bots[k] = data;
                         
                           k++
                        }
                    }
                }
    var data  = new Array;
    var  k = 0;
    for(var i = 0; i < 15; i++)
    { 
        data[i] = '';
        for(var j = 0; j < bots.length; j++)
        {
            if(bots[j].bot == i+1)
            {
                //console.log(bots[j].ids);
                data[i] += bots[j].ids+',';        
            }
        }
        
    }
    var trade_arr = [];
    var j = 0;
    for(var i = 0;i < data.length; i++)
    {
        if(data[i] != '')
            {
                var data_arr =[];
                data_arr.bot = i;
                data_arr.ids = data[i];
                trade_arr[j] = data_arr;
                //console.log(data_arr);
                j++;
            }
    }
    
       
    
   
        
        //trade(trade_arr,options);
    
}
function trade(trade_arr,options)
{       
   console.log(trade_arr);
  if(trade_arr.length != 0)
  {
        var i = 0;
        var tradeInt = setInterval(function(){  
            console.log(trade_arr[i]);
        $.ajax({
                url: 'http://bot.poisk.zp.ua/trade.php',
                data: "bot="+trade_arr[i].bot+"&ids="+trade_arr[i].ids,
                type: "POST",
                success: function(response)
                {
                    console.log(response);
                }
        })
        i++;
       if(i == trade_arr.length){
           clearInterval(tradeInt);
       }
    },options.rate);
  }else{
      bot_start();
  }

}
function bot_stop(init)
{
    clearInterval(init);
    
}
function getStat()
{
    $.ajax({
        url:'http://bot.poisk.zp.ua/stat.php',
        type:"POST",
        success: function(response)
        {
           localStorage.setItem('balance',response);
        }
    });
    
}
var listener = chrome.runtime.onMessage.addListener(
    
  function(request, sender, sendResponse) {
    var options = request.options; // данные о сайте
    var stop = request.options;
    getStat();

      if(options == 'give_balance')
        {
            
                    if(request.checkbot == true)
                    {
                        if(localStorage.getItem('interval'))
                        {
                            sendResponse({'bot_in_work':true});
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

                        bot_start(options);
                            
                        getStat();
                        sendResponse({'balance': localStorage.getItem('balance'), 'in_work':true});
  
                  }else{
                        var int = localStorage.getItem("interval")
                        clearInterval(int);  
                        localStorage.removeItem('interval');
                        console.log('bot_stop');
                  }
        }

      

        
  

});
