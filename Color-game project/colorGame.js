var current = {num: 6, visible: "block", check: false}
var colors = GenerateRandomColors(current.num);
var squares = document.getElementsByClassName("square");
var h1text = document.querySelector("#clrDisplay");
var h1 = document.querySelector("h1");
var resultDisplay = document.querySelector("#result");
var resetBtn = document.querySelector("#reset");
var easyBtn = document.querySelector("#easy");
var hardBtn = document.querySelector("#hard");
var pickedColor = pickColor();
h1text.textContent = pickedColor;
hardBtn.addEventListener("click", function(){
	easyBtn.classList.remove("selected");
	this.classList.add("selected");
	reset(6,"block",true);
	current.num = 6;
	current.visible = "block"
	current.check = false;
});
easyBtn.addEventListener("click", function(){
	hardBtn.classList.remove("selected");
	this.classList.add("selected");
	reset(3,"none",false);
	current.num = 3;
	current.visible = "none"
	current.check = false;
})
resetBtn.addEventListener("click", function(){
		reset(current.num, current.visible, current.check)
	})
for(var i = 0; i < squares.length;i++)
{
	squares[i].style.backgroundColor = colors[i];
	squares[i].addEventListener("click", function(){
		var currentSquareColor = this.style.backgroundColor;
		if (currentSquareColor === pickedColor)
		{
			resultDisplay.textContent = "Correct";
			resetBtn.textContent = "Play Again?";
			h1.style.backgroundColor = currentSquareColor;
			ChangeColors(currentSquareColor);

		}
		else{
			resultDisplay.textContent = "Try Again";
			this.style.backgroundColor = "#232323";
		}})};
	function reset(n, visible,check){
		colors = GenerateRandomColors(n);
		pickedColor = pickColor();
		h1text.textContent = pickedColor;
		h1.style.backgroundColor = "steelblue";
		resultDisplay.textContent = "";
		resetBtn.textContent = "New Color";
		for(var i = 0; i < squares.length;i++)
		{
			squares[i].style.backgroundColor = colors[i];
			if (!colors[i])
			{
				squares[i].style.display = visible;
			}
			else if (check)
			{
				squares[i].style.display = visible;
			}
		}
		};
	function GenerateRandomColors(num){
		var arr = new Array()
		for(var i = 0; i < num; i++){
			arr[i] = randomColor();
		}
		return arr;
	}
	function randomColor(){
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);
		var rgb = "rgb("+r+", " +g+", "+b+")"
		return rgb
	}
	function pickColor()
	{
		var randomNumber = Math.floor(Math.random() * colors.length);
		return colors[randomNumber];
	}
	function ChangeColors(color)
	{	
		for(var i = 0; i < squares.length; i++){
			squares[i].style.backgroundColor = color;
		}
	}