$(document).ready(function(){
    $('#start').on('click',function(){
      var xmlHttp = null;
	  xmlHttp = new XMLHttpRequest();

	
		xmlHttp.open("POST","https://ru.cs.deals/ajax/botsinventory",true)		
		xmlHttp.setRequestHeader('accept', 'application/json, text/javascript, */*; q=0.01t');
		xmlHttp.setRequestHeader('x-requested-with', 'XMLHttpRequest');
		
		
		
		xmlHttp.onreadystatechange = function() {
		  if (xmlHttp.readyState == 4) {
			 if(xmlHttp.status == 200) {
			   console.log(xmlHttp.responseText);
			}
		  }
		};
		xmlHttp.send(null);
    })
})