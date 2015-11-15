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