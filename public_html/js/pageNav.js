/* 
 * Page NAV Bar - display page names, make selected page visible, hide others
 */
/*global ko, resetMap */
"use strict";
var viewPage;


function ViewPage() {
    var self = this;
    viewPage = this;
    var oldPage;

    // Page menu
    self.pages = ['Map', 'Itinerary', 'Filter'];  // Must match Div tags
    self.chosenPageId = ko.observable();
    self.oldPage = self.pages[0];

    self.goToPage = function (page) {
        location.hash = page;  // Allows bookmarks,etc
        self.chosenPageId(page);

        // Deactivate previous page and activate new page
        if (self.oldPage !== self.pages[0]) {
            document.getElementById(self.oldPage).style.display = "none";
        }

        // Make page visible - first page (background) has special handling in "else" portion
        if (page !== self.pages[0]) {
            document.getElementById(page).style.display = "block";
        }
        else {
            // Repaint background (map) with new itinerary or filter            
            // If we're going to the map and the itinerary had changed, then recreate it
            if (self.oldPage !== self.pages[0] && itinerary.dirty) {
                createMap();
                itinerary.dirty = false;
            }
        }
        self.oldPage = page;
    };

    // Hide all content sections except first (map)
    self.hideAll = function () {
        var id;
        //for (id in self.pages) {
            
        //}
        document.getElementById("Itinerary").style.display = "none";
        document.getElementById("Filter").style.display = "none";
    };

}

ko.applyBindings(new ViewPage(), document.getElementById("navBar"));

// Deactivate other pages and activate first Page 
viewPage.hideAll();

//oldPage = viewPage.pages[1];  
viewPage.goToPage(viewPage.pages[0]);