function drawMap(width, height)
{
	var map = new Map(width, height);
	map.randomiseResources();
	map.draw(ctx);
	console.log(map.toString());
}