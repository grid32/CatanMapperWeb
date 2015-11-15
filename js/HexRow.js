function HexRow(len)
{
	this.len = len;

	this.hexes = [];
	for(var i = 0; i < len; i++)
	{
		var newHex = new Hex(-1, 0, i, 0);
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