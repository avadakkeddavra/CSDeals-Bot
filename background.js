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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var site = request.site; // данные о сайте
      console.log(sendResponse);
    var json;
    if(site == 'CSDeals') 
    {
            $.ajax({
                url:"http://bot.poisk.zp.ua/",
                type:'POST',
                dataType:'json',
                success: function(response){
                     json = response;
                }

            });

            $.ajax({
                url:"http://csgoback.net/api/extension?extension=csgoroll-bot&type=subscription&subType=loadPrice&service=opskins.com&updateTime=360&opskinsMinSales=0&opskinsOnSales=0",
                type:'GET',
                dataType: 'json',
                success: function(response){
                     json = response;
                }
            })
    }
    console.log(json);
});
