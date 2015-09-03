//////////////////////////////////////////////////////////
// Hex 													//
//////////////////////////////////////////////////////////
function Hex(resource, rarity, xPos, yPos)
{
	this.resource = resource;
	this.rarity = rarity;
	this.xPos = xPos;
	this.yPos = yPos;
}

Hex.prototype.setY = function(y)
{
	this.yPos = y;
}

//////////////////////////////////////////////////////////
// HexRow												//
//////////////////////////////////////////////////////////
function HexRow(len)
{
	this.len = len;

	this.hexes = [];
	for(var i = 0; i < len; i++)
	{
		var newHex = new Hex(0, 0, i, 0);
		this.hexes.push(newHex);
	}
}

HexRow.prototype.setY = function(y)
{
	for(var i = 0; i < this.len; i++)
	{
		this.hexes[i].setY = y;
	}
}

HexRow.prototype.toString = function(width)
{
	var out = "";
	for(var i = 0; i < (width - this.len); i++)
	{
		out += " ";
	}
	for(var i = 0; i < this.len; i++)
	{
		out += this.hexes[i].resource + " ";
	}
	return out;
}

//////////////////////////////////////////////////////////
// Map 													//
//////////////////////////////////////////////////////////
function Map(height, width)
{
	this.height = height;
	this.width = width;

	this.rows = [];
	var change = (height - 3) / 2;
	for(var i = 0; i < height; i++)
	{
		var myWidth = width;
		if(i < (height - 1) / 2)
		{
			myWidth -= (change - i) + 1;
		}
		else if(i > (height - 1) / 2)
		{
			myWidth += (((height - (2 * i)) + 1) / 2) - 1;
		}
		var newRow = new HexRow(myWidth);
		newRow.setY = i;
		this.rows.push(newRow);
	}
}

Map.prototype.toString = function()
{
	var out = "";
	for(var i = 0; i < this.height; i++)
	{
		out += this.rows[i].toString(this.width) + "\n";
	}
	return out;
}

Map.prototype.randomiseResources = function()
{
	for(var y = 0; y < this.rows.length; y++)
	{
		for(var x = 0; x < this.rows[y].len; x++)
		{
			this.rows[y].hexes[x].resource = Math.floor((Math.random() * 5) + 1);
		}
	}
}

Map.prototype.draw = function(ctx)
{
	for(var y = 0; y < this.rows.length; y++)
	{
		for(var x = 0; x < this.rows[y].len; x++)
		{
			var currentTile = this.rows[y].hexes[x];
			var	myX;
			var myY;

			var diff = this.width - this.rows[y].len;
			myX = (x + (diff / 2)) * s_desert.width;
			myY = y * (s_desert.height - (0.246 * s_desert.height));
			
			if(currentTile.resource == 0)
			{
				s_desert.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 1)
			{
				s_sheep.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 2)
			{
				s_ore.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 3)
			{
				s_clay.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 4)
			{
				s_wheat.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 5)
			{
				s_wood.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 6)
			{
				s_sea.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 7)
			{
				s_gold.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 8)
			{
				s_council.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 9)
			{
				s_sea.draw(ctx, myX, myY);
				s_moon.draw(ctx, myX + s_sea.width/2 - s_moon.width/2, myY + s_sea.height/2 - s_moon.width/2);
			}
			else if(currentTile.resource == 10)
			{
				s_sea.draw(ctx, myX, myY);
				s_sun.draw(ctx, myX + s_sea.width/2 - s_sun.width/2, myY + s_sea.height/2 - s_sun.width/2);
			}
		}
	}
}