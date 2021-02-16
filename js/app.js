/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */

//this object will hold the options for the mutation observer 
const config = {
  attributes: false,
  childList: true,
  subtree: false
};
let mutationObserver;


let main = document.querySelector("main");
const navBar = document.getElementById("navbar__list")
const sectionsList = Array.from(document.querySelectorAll("[data-nav]"))


/**
 * End Global Variables
 * Start Helper Functions
 *
 */

 //this function will add the predefined sections to the navbar
const addSections = function () {
  const fragment = document.createDocumentFragment()
  sectionsList.forEach(function (section) {
    const liElement = document.createElement("li")
    const aElement = document.createElement("a")
    aElement.setAttribute("href", "#"+section.id)
    if(section.id === "section1") {
      aElement.setAttribute("class","active")
    }
    aElement.textContent = section.getAttribute("data-nav")
    liElement.appendChild(aElement);
    fragment.appendChild(liElement)
  })
  navBar.appendChild(fragment)
}

//this function will check which section is active 
const isActiveInViewPort = function (element, percentVisible) {
  let rect = element.getBoundingClientRect();
  windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  return !(
    Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1)) * 100)) < percentVisible ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
  )
}

//this function will append any dynmically allocated sections to the navbar
function mutated(mutationList) {
  const fragment = document.createDocumentFragment()
  for(let mutation of mutationList) {
    if(mutation.addedNodes["0"].id.includes("section")) {
      const section = document.getElementById(mutation.addedNodes["0"].id);
      const liElement = document.createElement("li");
      liElement.textContent = section.getAttribute("data-nav");
      fragment.appendChild(liElement);
      sectionsList.push(section);
    }
  }
  navBar.appendChild(fragment);
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
addSections();


// Add class 'active' to section when near top of viewport
function setActive(env) {
  sectionsList.forEach(section => {
    const prevActiveSection = document.querySelector(".active-section");
    if(isActiveInViewPort(section, 55) && prevActiveSection.id !== section.id) {
      const prevActiveLi = document.querySelector(".navbar__menu li a.active");
      prevActiveLi.classList.remove("active");
      prevActiveSection.classList.remove("active-section");
      section.classList.add("active-section")
      document.querySelector(`a[href="${"#" + section.id}"]`).classList.add("active")
    }
  })
}

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
mutationObserver = new MutationObserver(mutated);
mutationObserver.observe(main, config);

// Scroll to section on link click
navBar.addEventListener("click", event => {
  event.preventDefault();
  const targetSectionId = event.target.getAttribute("href");
  const targetSection = document.querySelector(targetSectionId);
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'end' })
})
// Set sections as active
document.addEventListener("scroll", setActive)
