class Location {
    constructor(floor, hex_num, wall, shelf, volume, page) {
        this.floor = floor;
        this.hex = hex_num;
        this.wall = wall;
        this.shelf = shelf;
        this.volume = volume;
        this.page = page;
    }
}

class Page {
    constructor(loc, search, text) {
        this.loc = loc;
        this.search = search;
        this.text = text;
    }
}