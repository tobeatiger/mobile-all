/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var container = container,
        currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page,cb) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page,null,cb);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left', cb);
        } else if (stateHistory[l-1] && stateHistory[l-1].length > state.length && stateHistory[l-1].indexOf(state) > -1) {  //todo: logic to be verified - 影响左右效果
            while(stateHistory.length > 1 && stateHistory.pop() !== state) {
                angular.noop();
            }
            stateHistory.push(state);
            this.slidePageFrom(page, 'left', cb);
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right', cb);
        }
    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from, cb) {

        container.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + from);

        currentPage.one('webkitTransitionEnd', function(e) {
            if($(e.target).attr('data-not-to-keep-events')) {
                $(e.target).remove();
            } else {
                $(e.target).detach();  //keep events
            }
            if(cb) {  // add callback when animation end
                cb();
            }
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;
    };

}