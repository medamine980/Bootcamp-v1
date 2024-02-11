var value = "";
$("ul").on("click", "li", function(){
	$(this).toggleClass("checked");
})
$("h1 i").click(function(){
	$("input[type='text']").fadeToggle(300);	
})
$("ul").on("click", "li span",function(event){
	$(this).parent().fadeOut(1000, function(){
		$(this).remove();
	})
	event.stopPropagation();
});
$("input[type='text'").keypress(function(event){
	if (event.which == "13")
	{
		value = $(this).val()		
		$("ul").append("<li><span><i class='fa fa-trash'></i></span>" + value + "</li>")
		$(this).val("");
	}
})