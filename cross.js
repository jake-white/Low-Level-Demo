function Cross(gridX, gridY, radius) {
    let cross = new Object();
    cross.gridX = gridX;
    cross.gridY = gridY;
    cross.radius = radius;
    cross.x = gridToX(gridX);
    cross.y = gridToY(gridY);
    return cross;
}