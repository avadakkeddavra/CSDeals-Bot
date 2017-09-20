//$(document).ready(function(){
//    $('#start').on('click',function(){
//        $.ajax({
//            url:"http://bot.poisk.zp.ua/",
//            type:'POST',
//            dataType:'json',
//            success: function(response){
//                console.log(response);
//            }
//            
//        })
//
//    })
//    $('#opskins').click(function(){
//        $.ajax({
//            url:"http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com&updateTime=360&opskinsMinSales=0&opskinsOnSales=0",
//            type:'GET',
//            dataType: 'json',
//            success: function(response){
//                console.log(response);
//            }
//        })
//    })
//    
//})
function resort_cs_deals(json, options)
{
    var array = json.response;
    var min_price = options.min_price;
    var index_for_delete = '';
    var wrong_types = ['Music','Sticker','Graffiti','Souvenir','Capsule','Case', 'Legends','Gift','Key'];
    var j = 0;
    var k = 0;
    var cs_deals_cleared = [];
    var quantity_items = [];
    $.each(array,function(i,elem){
        var price = elem.v;
        if(elem.v <= min_price || $.inArray(elem.t,wrong_types) != -1 )
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
function restore_opskins(json,options)
{
    var array = json.priceList;
    var min_price = options.min_price;
    var wrong_types = ['Music','Sticker','Graffiti','Souvenir','Container','Capsule','Case', 'Legends','Gift','Key'];
    var opsiks = [];
    var j = 0;
    for (var i in array)
    {   
        if(strIndxOf(wrong_types,i) != 0 || array.price >= min_price)
        {
            opsiks[i] = array[i];
        }

    }
    return opsiks;
}
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
        }else{
            console.log(cs_deals[i]);
        }
       
    }
        

    
    return result_opskins;
}
function price_checking(all_in_one,options)
{
    var response = [];
    var min_percent = options.min_percent;
    var max_percent = options.max_percent;
    //console.log(min_percent,max_percent)
    for(var i = 0; i < all_in_one.length; i++)
    {
        var cs_price = all_in_one[i].cs_deals.v;
        var ops_price = all_in_one[i].opskins.price;
        var percent = (ops_price*95)/(cs_price)-100;
        if(percent > min_percent && percent < max_percent)
        {
            console.log(all_in_one[i],percent);
        }
    }
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var options = request.options; // данные о сайте
      console.log(options)
      
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
      
      
      
    var cs_deals_json = JSON.parse(localStorage.getItem("cs_deals_json"));
        //console.log(cs_deals_json);
      var cs_deals_cleared = resort_cs_deals(cs_deals_json,options);
      
      //console.log(cs_deals_cleared);

            $.ajax({
                url:options.opskins_url,
                type:'GET',
                dataType: 'json',
                success: function(response_opskins){
    
                    var data = JSON.stringify(response_opskins)
                    localStorage.setItem("opskins_json", data);
                }
            })
      var opskins_json = JSON.parse(localStorage.getItem("opskins_json"));
     // console.log(opskins_json["★ Karambit | Case Hardened (Well-Worn)"]);
      var opskins_cleared_json = restore_opskins(opskins_json,options);
      //console.log(opskins_cleared_json);
      //console.log('compare');
      var all_in_arr = arrays_compare(opskins_cleared_json,cs_deals_cleared);
     // console.log(all_in_arr);
      price_checking(all_in_arr,options);

});
