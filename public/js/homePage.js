// Redirect function for heart icon
function redirectToSignUp(event) {
    event.stopPropagation();  // Prevent the click from reaching the <a> tag
    event.preventDefault();   // Prevent the default behavior of the anchor link

    // Redirect to the sign-up page
    window.location.href = 'http://localhost:3000/listings/heart';
}

// Logic for toggle button of tax
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (const info of taxInfo) {
        if (info.style.display !== "inline") {
            info.style.display = "inline";
        } else {
            info.style.display = "none";
        }
    }
});

// Functions for scrolling content
function scrollContentLeft() {
    const scrollableDiv = document.getElementById("scrollable-div");
    scrollableDiv.scrollBy({
        left: -200,
        behavior: "smooth"
    });
}

function scrollContentRight() {
    const scrollableDiv = document.getElementById("scrollable-div");
    scrollableDiv.scrollBy({
        left: 200,
        behavior: "smooth"
    });
}

