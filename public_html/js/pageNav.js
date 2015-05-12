/* 
 * Page NAV Bar - display page names, make selected page visible, hide others
 */
/*global ko */
"use strict";
var viewPage;
var oldPage;

function ViewPage() {
    var self = this;
    viewPage = this;

    // Page menu
    self.pages = ['Map', 'Itinerary', 'Filter'];  // Must match Div tags
    self.chosenPageId = ko.observable();
    self.oldPage = self.pages[0];

    self.goToPage = function (page) {
        location.hash = page;  // Allows bookmarks,etc
        self.chosenPageId(page);

        // Deactivate previous page and activate new page
        if (oldPage !== "Map")
            document.getElementById(oldPage).style.display = "none";

        if (page !== "Map")
            document.getElementById(page).style.display = "block";
        else {
            // Repaint map with new itinerary or filter
            console.log("new map");
            
        };
        

        oldPage = page;
    };
}
;

ko.applyBindings(new ViewPage(), document.getElementById("navBar"));

// Deactivate other pages and activate first Page 
document.getElementById("Itinerary").style.display = "none";
document.getElementById("Filter").style.display = "none";

oldPage = "Itinerary";
viewPage.goToPage(viewPage.pages[0]);