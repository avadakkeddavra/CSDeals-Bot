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
        if(cs_deals_cleared[id])
        {
                var quant = cs_deals_cleared[id].quantity;
                cs_deals_cleared[id].quantity = quant+1;
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
    return final_collection;
}

function bot_start(options){
    send_cs_deals_request();
                  // formating the cs_deals json array
                    var cs_deals_json = JSON.parse(localStorage.getItem("cs_deals_json"));
                    var cs_deals_cleared = resort_cs_deals(cs_deals_json,options); 
                    console.log(cs_deals_cleared);
                    for(var i = 0; i < cs_deals_cleared.length; i++)
                    {
                        if(cs_deals_cleared[i].m == '★ Karambit | Doppler (Factory New)')
                            {
                                console.log(cs_deals_cleared[i]);
                            }
                    }
            send_opskins_request(options.opskins_url,false);

                  // fromating the opskins json array
                  var opskins_json = JSON.parse(localStorage.getItem("opskins_json")); 
                   console.log(opskins_json);
                  var opskins_cleared_json = restore_opskins(opskins_json,options);
                  console.log(opskins_cleared_json);

                  // compearing two arrays
                  var all_in_arr = arrays_compare(opskins_cleared_json,cs_deals_cleared);
                 // first checkeng
                 var final = price_checking(all_in_arr,options);
                  console.log(final);
}
function bot_stop(init)
{
    clearInterval(init);
    
}
chrome.runtime.onMessage.addListener(
    
  function(request, sender, sendResponse) {
    var options = request.options; // данные о сайте
    var stop = request.options;
    console.log(options.stop != 1)
      
      if(options.stop != 1)
        {
          var init = setInterval(function(){
                
                bot_start(options);
                //console.log('bot_start');
            },options.rate);
            
            localStorage.setItem("interval", init);
        }else{
         var int = localStorage.getItem("interval")
                clearInterval(int);  
            console.log('bot_stop');
        }
            [8,"nc86m9snsn4vkcmupf0jh7eg1v",{"type":"offchange","id":"2516947375","msg":"Trade completed","class":"success","accepted":true,"pricein":0}]

           
        [8,"nc86m9snsn4vkcmupf0jh7eg1v",{"type":"offers","msg":[{"id":"2516947375","conf":0,"btcamount":"0.00000000","usdamount":"0.00","btcaddress":"","u":0,"b":1}]}]
      
      
    [8,"nc86m9snsn4vkcmupf0jh7eg1v",{"type":"offers","msg":[{"id":"2516947375","conf":1,"btcamount":"0.00000000","usdamount":"0.00","btcaddress":"","u":0,"b":1}]}]
        
  

});
