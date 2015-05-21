/* 
 * Page NAV Bar - display page names, make selected page (div) visible, hide others
 *   First page is background and always visible
 */
/*global ko */
"use strict";
var viewPage;

function ViewPage(pageList) {
    var self = this;
    viewPage = this;
    var oldPage;

    self.goToPage = function (page) {
        location.hash = page;  // Allows bookmarks,etc
        self.chosenPageId(page);

        // Deactivate previous page and activate new page
        if (self.oldPage !== self.pages[0]) {
            document.getElementById(self.oldPage).style.display = "none";
        }

        // Make page visible -  page 0 (background) has special handling in "else" portion
        if (page !== self.pages[0]) {
            document.getElementById(page).style.display = "block";  // Enable page
        }
        else {
            self.handleBackground();  // Special handling for page 0
        }
        self.oldPage = page;
    };

    // Special handling for page 0 (background)
    self.handleBackground = function () {
        // Repaint background (map) with new itinerary or filter            
        // If we're going to the map and the itinerary had changed, then recreate it
        if (self.oldPage !== self.pages[0] && itinerary.dirty) {
            createMap();
        }
    };

    // Hide all content divs except page 0
    self.hideAll = function () {
        var id;
        for (id in self.pages) {
            if (id != 0)
                document.getElementById(self.pages[id]).style.display = "none";
        }
    };

    // Initialize
    self.pages = pageList;  // Must match Div tags
    self.chosenPageId = ko.observable();
    self.oldPage = self.pages[0];

    // Deactivate other pages 
    self.hideAll();

    // Go to page
    self.goToPage(viewPage.pages[0]);
}

// Initial View with KO bindings
ko.applyBindings(new ViewPage(['Map', 'Itinerary', 'Filter']), document.getElementById("navBar"));