var map = null;

function drawMap(ctx, width, height)
{
	if(map == null || map.height != height || map.width != width)
	{
		map = new Map(width, height);
		map.randomiseResources();
	}
	map.draw(ctx);
}