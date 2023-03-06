function SlideRight() {
    // Checks to see if the slider is to the left of the div
    if (document.getElementById("slider").style.float !== "right") {
      // If it is we will float the sliderBtn to the right and change the background of the housing to green
      document.getElementById("slider").style.float = "right";
      document.getElementById("slideHousing").style.backgroundColor = "#424449";
  
      // Toggle dark mode on
      document.body.style.backgroundColor = "#595959";
      document.getElementById("header").style.color = "#e6e6e6";
      document.getElementById("press").style.color = "#e6e6e6";
    } else {
      // If clicked again the btn will move back to the left side and change the color back to original
      document.getElementById("slider").style.float = "left";
      document.getElementById("slideHousing").style.backgroundColor = "#e6e6e6";
  
      // Toggle dark mode off
      document.body.style.backgroundColor = "white";
      document.getElementById("header").style.color = "#000";
      document.getElementById("press").style.color = "#000";
    }
  }

  function SlideRightTwo() {
    // Checks to see if the slider is to the left of the div
    if (document.getElementById("sliderTwo").style.float !== "right") {
      // If it is we will float the sliderBtn to the right and change the background of the housing to green
      document.getElementById("sliderTwo").style.float = "right";
      document.getElementById("slideHousingTwo").style.backgroundColor = "#424449";
  
      // Toggle dark mode on
      document.body.style.backgroundColor = "#171719";
      document.getElementById("leftContent").style.backgroundColor = "#232427";
      document.getElementById("changeText").style.color = "#fff";
      document.getElementById("changeTextOne").style.color = "#fff";
      document.getElementById("changeTextTwo").style.color = "#fff";
      
    } else {
      // If clicked again the btn will move back to the left side and change the color back to original
      document.getElementById("sliderTwo").style.float = "left";
      document.getElementById("slideHousingTwo").style.backgroundColor = "#e6e6e6";
  
      // Toggle dark mode off
      document.body.style.backgroundColor = "white";
      document.getElementById("leftContent").style.backgroundColor = "#f5f5f6";
      document.getElementById("changeText").style.color = "#212529";
      document.getElementById("changeTextOne").style.color = "#212529";
      document.getElementById("changeTextTwo").style.color = "#212529";
    }
  }
    