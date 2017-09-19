
function onClick(sait) { // окно теряет фокус
	chrome.runtime.sendMessage({site:sait}); // отправка сообщения на background.js
}


$(document).ready(function(){
    $('#start').on('click',function(){
    var data = $('#percentage_form').serializeArray();
    })
    

})

