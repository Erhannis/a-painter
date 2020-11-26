/**
 * General info
 * 
 * The size system is based on units of 1.  You can put in other numbers, but I'd expect things to behave pretty erratically.
 */

 /*
UiRoot(
    FoldLayout(
        GridLayout({cols:4},
            UiButton({oncontrollerdown:(function(){this.setAttribute('color', '#88CCAA');}),size:[3,3]}),
            UiButton({oncontrollerdown:(function(){this.setAttribute('visible', false);}),size:[1,2]}),
            UiButton()
        ),
        RowsLayout(),
        UiTabs( //TODO Icons, labels
            GridLayout({rows:4}),
            UiButton()
        )
    )
);
*/

//TODO Man, I should really nail down the name
window.HandMenu = (function() {
    function UiButton({oncontrollerdown, oncontrollerhold, oncontrollerup, size=[1,1]}={}) {
        let plane = UiEntity({type:"a-plane"}); //TODO I don't know how to deal with the maxSize thing
        let s = [...size];
        plane.getSize = function(maxSize) {
            return s; //TODO
        };
        plane.setAttribute('width', size[0]-0.1);
        plane.setAttribute('height', size[1]-0.1);
        plane.setAttribute('color', '#909090');
        //plane.setAttribute('position', '0 0 0');
        plane.oncontrollerdown = oncontrollerdown;
        // Note that oncontrollerhold is NOT called the first time - it's down, THEN hold (many times), THEN up.
        plane.oncontrollerhold = oncontrollerhold;
        plane.oncontrollerup = oncontrollerup;
        //buttons.appendChild(plane);
        //TODO Material?
        return plane;
    }
    
    function UiRoot(layout) {
        let ui = UiEntity();
        ui.setAttribute('rotation', '-90 0 0');
        ui.setAttribute('scale', '0.05 0.05 0.05');
        layout.setAttribute('position', '0 0 0');
        ui.appendChild(layout);
        return ui;
    }
    
    function FoldLayout() {
        let layout = UiEntity();
        //TODO
        return layout;
    }
    
    /**
     * Pick whether you want to constrain rows or cols; leave the other null
     * @param {*} cols 
     * @param {*} rows 
     * @param {*} pack Ignore order in favor of tighter packing
     */
    function GridLayout({cols, rows, pack=true}={}) {
        let layout = UiEntity();
        let buttons = UiEntity();
        let size;
        let fixed;
        let first; // first to be traversed - second coord, really
        let second; // opposite
        let grid = [];
        grid.placementIndex = 0;
        grid.get = function(i) {
            let a = this[i];
            if (a == undefined) {
                a = new Array(size);
                this[i] = a;
            }
            return a;
        };
        grid.add = function(item, pack) {
            let isize = item.getSize();
    
            let start;
            if (pack) {
                start = 0;
            } else {
                start = this.placementIndex; //TODO Test
            }
    
            let placed = false;
            placeLoop:
            for (let b = start; true; b++) {
                if (this.get(b).length+1-first(isize) <= 0) {
                    // Thing is too large
                    let a = 0;
                    let collision = false;
                    checkCollision:
                    for (let n = 0; n < second(isize); n++) {
                        for (let m = 0; m < this.get(b).length; m++) {
                            if (grid.get(b+n)[a+m] != undefined) {
                                collision = true;
                                break checkCollision;
                            }
                        }
                    }
                    if (!collision) {
                        for (let n = 0; n < second(isize); n++) {
                            for (let m = 0; m < this.get(b).length; m++) {
                                grid.get(b+n)[a+m] = item;
                            }
                        }
                        if (fixed == "cols") {
                            item.setAttribute('position', `${a+((first(isize)-1)/2)} ${-b-((second(isize)-1)/2)} 0`);
                        } else {
                            item.setAttribute('position', `${b+((second(isize)-1)/2)} ${-a-((first(isize)-1)/2)} 0`);
                        }
                        this.placementIndex = b;
                        placed = true;
                        break placeLoop;
                    }
                } else { //TODO It's annoying having two near copies
                    for (let a = 0; a < this.get(b).length+1-first(isize); a++) {
                        let collision = false;
                        checkCollision:
                        for (let n = 0; n < second(isize); n++) {
                            for (let m = 0; m < first(isize); m++) {
                                if (grid.get(b+n)[a+m] != undefined) {
                                    collision = true;
                                    break checkCollision;
                                }
                            }
                        }
                        if (!collision) {
                            for (let n = 0; n < second(isize); n++) {
                                for (let m = 0; m < first(isize); m++) {
                                    grid.get(b+n)[a+m] = item;
                                }
                            }
                            if (fixed == "cols") {
                                item.setAttribute('position', `${a+((first(isize)-1)/2)} ${-b-((second(isize)-1)/2)} 0`);
                            } else {
                                item.setAttribute('position', `${b+((second(isize)-1)/2)} ${-a-((first(isize)-1)/2)} 0`);
                            }
                            this.placementIndex = b;
                            placed = true;
                            break placeLoop;
                        }
                    }
                }
            }
            if (!placed) {
                console.error("WAT Didn't place grid item?");
            }
        };
        if (rows == null || rows == undefined) {
            // Many rows
            // fixed cols
            size = cols;
            fixed = "cols";
            first = (s => s[0]);
            second = (s => s[1]);
            buttons.setAttribute('position', `${-cols/2+0.5} ${0-0.5} 0`); //TODO How far up?
        } else {
            // Many cols
            // fixed rows
            size = rows;
            fixed = "rows";
            first = (s => s[1]);
            second = (s => s[0]);
            buttons.setAttribute('position', `${0+0.5} ${rows/2-0.5} 0`);
        }
        let items = [...arguments];
        items.reverse();
        items.pop();
        while (items.length > 0) {
            let item = items.pop();
            grid.add(item, pack);
            buttons.appendChild(item);
        }
        layout.appendChild(buttons);
        return layout;
    }
    
    function RowsLayout() {
        return GridLayout({cols:1}, ...arguments);
    }
    
    function ColsLayout() {
        return GridLayout({rows: 1}, ...arguments);
    }
    
    function UiTabs() {
        let layout = UiEntity();
        //TODO
        return layout;
    }
    
    function PageLayout() { //TODO I'd need to deal with detecting and handling an overflow mechanism, and arrange things; it's like a special GridLayout or something
        let layout = UiEntity();
        //TODO
        return layout;
    }
    
    function UiEntity({type="a-entity", maxSize=[1,1]}={}) { //TODO There's probably a more kosher way of doing this
        let entity = document.createElement(type);
        entity.maxSize = maxSize;
    
        /**
         * Override to return actual size.
         * maxSize is a field on UiEntity.
         * Sizes are in [X,Y]
         */
        entity.getSize = function() { //TODO ??
            return [1,1];
        };
        return entity;
    }

    return {
        UiRoot: UiRoot,
        FoldLayout: FoldLayout,
        GridLayout: GridLayout,
        RowsLayout: RowsLayout,
        ColsLayout: ColsLayout,
        UiTabs: UiTabs,
        PageLayout: PageLayout,
        //UiEntity: UiEntity,
        UiButton: UiButton
    }
}());