// Redirect function for heart icon
// function redirectToSignUp(event) {
//     event.stopPropagation();  // Prevent the click from reaching the <a> tag
//     event.preventDefault();   // Prevent the default behavior of the anchor link

//     // Redirect to the sign-up page
//     window.location.href = 'http://localhost:3000/listings/heart';
// }

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


// Like functionality logic
// async function toggleLike(event, listingId) {
//   event.preventDefault(); // Prevent default behavior (e.g., link navigation)

//   const heartIcon = event.target;

//   // Determine current like state
//   const isLiked = heartIcon.classList.contains('fa-solid'); // Solid = Liked
//   const action = isLiked ? 'unlike' : 'like';

//   try {
//     // Send API request to update likes
//     const response = await fetch(`/listings/${listingId}/${action}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       // Toggle heart icon class based on the action
//       if (action === 'like') {
//         heartIcon.classList.remove('fa-regular'); // Hollow
//         heartIcon.classList.add('fa-solid'); // Solid
//       } else {
//         heartIcon.classList.remove('fa-solid'); // Solid
//         heartIcon.classList.add('fa-regular'); // Hollow
//       }
//     } else {
//       console.error('Failed to update like status');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

async function toggleLike(event, listingId) {
  event.preventDefault(); // Prevent default behavior (e.g., link navigation)

  const heartIcon = event.target;

  // Determine current like state
  const isLiked = heartIcon.classList.contains('fa-solid'); // Solid = Liked
  const action = isLiked ? 'unlike' : 'like';

  try {
    // Send API request to update likes
    const response = await fetch(`/listings/${listingId}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Toggle heart icon class based on the action
      if (action === 'like') {
        heartIcon.classList.remove('fa-regular'); // Hollow
        heartIcon.classList.add('fa-solid'); // Solid
      } else {
        heartIcon.classList.remove('fa-solid'); // Solid
        heartIcon.classList.add('fa-regular'); // Hollow
      }
    } else if (response.status === 401) {
      // If the user is not authenticated
      const data = await response.json();
      if (data.redirectUrl) {
        // Redirect to the login page, where the flash message will show
        window.location.href = data.redirectUrl;
      }
    } else {
      console.error("Failed to update like status");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

