var map = null,
	typeCount = [0, 4, 3, 3, 4, 4, 0, 0, 0, 0, 0];

//Creates a new map.
function drawMap(ctx, width, height)
{
	if(map == null || map.height != height || map.width != width || !compareTypeCounts())
	{
		map = new Map(width, height, typeCount);
	}
	map.draw(ctx);
}

function compareTypeCounts()
{
	var newType = typeCount,
		oldType = map.typeCount;
	var keys = Object.keys(newType);
	var out = true;
	for(var i = 0; i < keys.length; i++)
	{
		if(newType[keys[i]] != oldType[keys[i]])
		{
			out = false;
		}
	}
	return out;
}

//////////////////////////////////////////////////////////////////////////////////
// Checkbox change functions 													//
//////////////////////////////////////////////////////////////////////////////////
function sizeClick(value)
{
	showMe("size", value);
	setMapSize();
	update();
}
function desertClick(value)
{
	showMe("desert", value);
	update();
}
function goldClick(value)
{
	showMe("gold", value);
	update();
}
function playersClick(value)
{
	setMapSize();
	update();
}
function seaClick(value)
{
	setMapSize();
	showMe("sea", value);
	update();
}
function explorersClick(value)
{
	setMapSize();
	showMe("explorers", value);
	update();
}

function redrawClick()
{
	map = null;
	update();
}

//Show/Hide divs
function showMe(section, checked)
{
	if(checked)
	{
		document.getElementById(section + "Div").style.display = "inline-block";
	}
	else
	{
		document.getElementById(section + "Div").style.display = "none";
	}
}

//////////////////////////////////////////////////////////////////////////////////
// Slider updating functions 													//
//////////////////////////////////////////////////////////////////////////////////
function updateDesertSld()
{
	var desertMax = 1;

	if(document.getElementById("playerChk").checked)
	{
		desertMax++;
	}
	if(document.getElementById("seaChk").checked)
	{
		desertMax += 2;
		if(document.getElementById("playerChk").checked)
		{
			desertMax++;
		}
	}

	document.getElementById("desertSld").max = desertMax;
	document.getElementById("desert").innerHTML = document.getElementById("desertSld").value;
	document.getElementById("desertMax").innerHTML = desertMax;
}
function updateGoldSld()
{
	//Count max deserts.
	var goldMax = 0;

	if(document.getElementById("seaChk").checked)
	{
		goldMax += 2;
		if(document.getElementById("playerChk").checked)
		{
			goldMax += 2;
		}
	}
	if(goldMax == 0)
	{
		document.getElementById("goldSld").min = goldMax;
	}
	else
	{
		document.getElementById("goldSld").min = 1;
	}
	
	document.getElementById("goldSld").max = goldMax;
	document.getElementById("gold").innerHTML = document.getElementById("goldSld").value;
	document.getElementById("goldMax").innerHTML = goldMax;
}
function updateSeaSld()
{
	var seaSld = document.getElementById("seaSld");
	if(document.getElementById("playerChk").checked)
	{
		seaSld.max = 26;
	}
	else
	{
		seaSld.max = 19;
	}

	document.getElementById("sea").innerHTML = seaSld.value;
	document.getElementById("seaMax").innerHTML = seaSld.max;
}
function updateSunMoonSld()
{
	var sunSld = document.getElementById("sunSld");
	var moonSld = document.getElementById("moonSld");
	if(document.getElementById("playerChk").checked)
	{
		sunSld.max = 20;
		moonSld.max = 20;
	}
	else
	{
		sunSld.max = 15;
		moonSld.max = 15;
	}
	
	document.getElementById("moons").innerHTML = moonSld.value;
	document.getElementById("moonMax").innerHTML = moonSld.max;

	document.getElementById("suns").innerHTML = sunSld.value;
	document.getElementById("sunMax").innerHTML = sunSld.max;
}


//TODO: Check tileCount to maxTileCount.
function setHeight(inHeight)
{
	if(Math.floor(document.getElementById("width").innerHTML) - (inHeight - 1)/2 < 1)
	{
		window.alert("Height is too large for width.");
		document.getElementById("heightSld").value -= 2;
		inHeight  -= 2;
		// Super hacky way to deselect.
		document.getElementById("sizeChk").click();
		document.getElementById("sizeChk").click();
	}
		inHeight = Math.floor(inHeight);
		mapHeight = inHeight;
		document.getElementById("height").innerHTML = inHeight;
		update()
	
}
function setWidth(inWidth)
{
	if(inWidth - (Math.floor(document.getElementById("height").innerHTML) - 1)/2 < 1)
	{
		window.alert("Width is too small for height.");
		document.getElementById("widthSld").value++;
		inWidth++;
		// Super hacky way to deselect.
		document.getElementById("sizeChk").click();
		document.getElementById("sizeChk").click();
	}
	
		inWidth = Math.floor(inWidth);
		mapWidth = inWidth;
		document.getElementById("width").innerHTML = inWidth;
		update()
	
}

//Sets map size based on settings.
function setMapSize()
{
	var playerChk = document.getElementById("playerChk").checked;

	if(document.getElementById("sizeChk").checked)
	{
		mapHeight = Math.floor(document.getElementById("height").innerHTML);
		mapWidth = Math.floor(document.getElementById("width").innerHTML);
	}
	else
	{
		//Vanilla
		mapWidth = 5;
		mapHeight = 5;
		if(playerChk)
		{
			mapWidth = 6;
			mapHeight = 7;
		}

		//Seafarers
		if(document.getElementById("seaChk").checked)
		{
			mapWidth = 8;
			mapHeight = 7;
			if(playerChk)
			{
				mapWidth = 10;
				mapHeight = 7;
			}
		}

		//Explorers and Pirates
		if(document.getElementById("explorersChk").checked)
		{
			mapWidth = 9;
			mapHeight = 7;
			if(playerChk)
			{
				mapWidth = 11;
				mapHeight = 9;
			}
		}
	}
}

function run()
{
	update(5, 5);
	window.addEventListener("resize", resize, false);
}

function resize()
{
	update();
}

function render(mapCanvas, scaledMapCanvas, windowWidth, windowHeight, mapWidth, mapHeight)
{
	var heightMod = mapHeight/mapWidth, widthMod = mapWidth/mapHeight;

	//Resize canvas based on window size.
	if(windowWidth < windowHeight)
	{
		windowHeight = windowWidth;
	}
	else
	{
		windowWidth = windowHeight;
	}

	//Resize canvas to correct shape
	if(mapWidth > mapHeight)
	{
		windowHeight /= widthMod;
	}
	else
	{
		windowWidth /= heightMod;
	}

	mapCanvas.width = s_resources[0].width * mapWidth;
	mapCanvas.height = ((s_resources[0].height - (0.246 * s_resources[0].height)) * (mapHeight - 1)) + s_resources[0].height;

	var ctx = mapCanvas.getContext("2d");
	drawMap(ctx, mapWidth, mapHeight);

	var scaledCtx = scaledMapCanvas.getContext("2d");
	scaledMapCanvas.width = windowWidth - 20;
	scaledMapCanvas.height = windowHeight - 20;
	scaledCtx.drawImage(mapCanvas, 	0, 0, mapCanvas.width, mapCanvas.height, 
									0, 0, scaledMapCanvas.width, scaledMapCanvas.height);
}

function update()
{
	var mapCanvas, scaledMapCanvas;

	mapCanvas = document.createElement("canvas");
	scaledMapCanvas = document.getElementById("right");

	//Get window size.
	var width = window.innerWidth;
	var height = window.innerHeight;

	//Update sliders
	updateDesertSld();
	updateGoldSld();
	updateSeaSld();
	updateSunMoonSld();

	//Make scaledMapCanvas fill bottom or right half of the window.
	if(height > width)
	{
		height /= 2;
		scaledMapCanvas.style.top = height + "px";
		scaledMapCanvas.style.left = "10px";
		if(document.getElementById("bodyDiv").style.height > height - 20)
		{
			document.getElementById("bodyDiv").style.overflowY = "hidden";
		}
		else
		{
			document.getElementById("bodyDiv").style.overflowY = "scroll";
		}
	}
	else
	{
		width /= 2;
		scaledMapCanvas.style.left = width + "px";
		scaledMapCanvas.style.top = "10px";
	}	

	document.getElementById("bodyDiv").style.height = (height - 20) + "px";

	calculateTypeCount();

	//Redraw map.
	render(mapCanvas, scaledMapCanvas, width, height, mapWidth, mapHeight);
}

function calculateTypeCount()
{
	typeCount = [0, 4, 3, 3, 4, 4, 0, 0, 0, 0, 0];
	
	if(document.getElementById("desertChk").checked)
	{
		typeCount[0] += Math.floor(document.getElementById("desertSld").value);
	}
	if(document.getElementById("goldChk").checked)
	{
		typeCount[7] += Math.floor(document.getElementById("goldSld").value);
	}
	if(document.getElementById("playerChk").checked)
	{
		typeCount[1] += 2;
		typeCount[2] += 2;
		typeCount[3] += 2;
		typeCount[4] += 2;
		typeCount[5] += 2;
	}
	if(document.getElementById("seaChk").checked)
	{
		typeCount[6] += Math.floor(document.getElementById("seaSld").value);
		typeCount[1] += 1;
		typeCount[2] += 2;
		typeCount[3] += 2;
		typeCount[4] += 1;
		typeCount[5] += 1;
	}
	if(document.getElementById("explorersChk").checked)
	{
		typeCount[8] += Math.floor(document.getElementById("moonSld").value);
		typeCount[9] += Math.floor(document.getElementById("sunSld").value);
		typeCount[10] = 1;
	}
}