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
function cut_for_min_price(json, min_price)
{
    
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var site = request.options; // данные о сайте
      console.log(site.min_price)
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
//
//            $.ajax({
//                url:"http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com&updateTime=360&opskinsMinSales=0&opskinsOnSales=0",
//                type:'GET',
//                dataType: 'json',
//                success: function(response_opskins){
//                    console.log(response);
//                }
//            })
//    

});
