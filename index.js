import { reviewsArr } from "./reviewsArr.js"

const submitBtn = document.getElementById("submit-btn")
const emojiReaction = document.getElementById("emoji-reaction")
const allReviewsSection = document.getElementById("all-reviews-section")
const userName = document.getElementById("user-name")
const userReview = document.getElementById("user-review")
const toggleMode = document.getElementById("mode")
let starsGiven = 0
// let oneStars = 0
// let twoStars = 0
// let threeStars = 0
// let fourStars = 1
// let fiveStars = 1
const stars = [0, 0, 0, 1, 1]
const starsPercentage = [0, 0, 0, 50, 50]

// let oneStarsPercentage = 0
// let twoStarsPercentage = 0
// let threeStarsPercentage = 0
// let fourStarsPercentage = 0
// let fiveStarsPercentage = 0

let darkMode = true


//  Preloading gifs to avoid lag while loading the gifs in app

const emojiGifs = {
    "one-star": "./emoji/one-star.gif",
    "two-star": "./emoji/two-star.gif",
    "three-star": "./emoji/three-star.gif",
    "four-star": "./emoji/four-star.gif",
    "five-star": "./emoji/five-star.gif"
}


const preloadedEmojis = {};

for (let key in emojiGifs) {
    preloadedEmojis[key] = new Image();
    preloadedEmojis[key].src = emojiGifs[key];
}


document.addEventListener("click", function(e){
    if(e.target.parentElement.id === "star-rating"){
         let emojiText = ""
        switch(e.target.id){
            case "one-star" : emojiText = "Oh No!", starsGiven = 1
            break
            case "two-star" : emojiText = "We didn't expect this!", starsGiven = 2
            break
            case "three-star" : emojiText = "Hmm! what can we improve", starsGiven = 3
            break
            case "four-star" : emojiText = "Glad You liked!", starsGiven = 4
            break
            case "five-star" : emojiText = "We are on cloud 9", starsGiven = 5
            break
        }

        emojiReaction.innerHTML = `
            <img class="emoji" src="${preloadedEmojis[e.target.id].src}" alt="emoji">
            <p class="emoji-caption" id="emoji-caption">${emojiText}</p>
        `
    }
   
    starRatingFill(starsGiven)
})






function starRatingFill(starsGiven) {
    const allStars = document.querySelectorAll(".fa-regular")
// First we remove solid from all stars
    for(let i = 0; i < allStars.length; i++) {
        allStars[i].classList.remove("fa-solid")
    }

//Then add solid to stars upto the number of stars user clicked
    for(let i = 0; i < starsGiven; i++){
        allStars[i].classList.add("fa-solid")
    }
}




// On submit this function process the data and calls the renderReviews function
submitBtn.addEventListener("click", function(){
    if(starsGiven > 0){
        const starRatings = new Array(5).fill(null).map((star, index) => {
            if(index < starsGiven){
                return `<i class="fa-solid fa-star"></i>`
             } else {
                 return `<i class="fa-regular fa-star"></i>`
             }
        })
    
        const timeStamp = new Date()
        const date = timeStamp.toLocaleDateString()
        const time = timeStamp.toLocaleTimeString()
        
        reviewsArr.unshift({
                starsGiven: starRatings,
                starCount: starsGiven,
                userName: userName.value ? userName.value : "Anonymous",
                comment: userReview.value,
                timeStamp: `<p>${date} | ${time} </p>`
    
        })

        updateProgressBar(starsGiven)
        starsGiven = 0
        userName.value = ""
        userReview.value = ""
        emojiReaction.innerHTML = ""
        starRatingFill()
        calculateOverallRating()
        renderReviews()
    }
    
})

// Toggle Dark Mode
toggleMode.addEventListener("click", function(){
    darkMode ? darkMode = false : darkMode = true
    darkMode ? toggleMode.textContent = "Light Mode" : toggleMode.textContent = "Dark Mode"
    if(!darkMode){
        document.body.style.backgroundColor = "#aaa6a6"
        document.getElementById("main").style.backgroundColor = "#ffffff"
        document.getElementById("user-input-section").style.backgroundColor = "#aaa6a6"
        document.getElementById("user-input").style.color = "#000000"
        document.getElementById("emoji-display").style.color = "#000000"
        userName.style.backgroundColor = "#ffffff"
        userReview.style.backgroundColor = "#ffffff"
        userName.style.color = "#151515"
        userReview.style.color = "#151515"
        document.getElementById("rating-status-section").style.backgroundColor = "#aaa6a6"
        document.getElementById("rating-status-section").style.color = "#151515"
        
    } else{
        document.body.style.backgroundColor = "#222222"
        document.getElementById("main").style.backgroundColor = "#151515"
        document.getElementById("user-input-section").style.backgroundColor = "#222222"
        document.getElementById("user-input").style.color = "#ffffff"
        document.getElementById("emoji-display").style.color = "#ffffff"
        userName.style.backgroundColor = "rgb(87, 83, 83)"
        userReview.style.backgroundColor = "rgb(87, 83, 83)"
        userName.style.color = "#ffffff"
        userReview.style.color = "#ffffff"
        document.getElementById("rating-status-section").style.backgroundColor = "#222222"
        document.getElementById("rating-status-section").style.color = "#ffffff"
        
    }

    renderReviews()
})


// function to set the progress bars percentage
function updateProgressBar(starCount){
    stars[starCount-1]++
    calculateBarPercentage()
    fillProgressBar()
}

// Helper functions for updateProgressBar
function calculateBarPercentage() {
    for(let i = 0; i < stars.length; i++){
        starsPercentage[i] = stars[i] / reviewsArr.length * 100
    }
}

function calculateOverallRating() {
    const ratingsDenominator = reviewsArr.map(function(rating) {
        return rating.starCount
    }).reduce(function(total, current){
        return total + current
    })

    const ratingsNumerator = stars.reduce(function(total, current) {
        return total + current
    })

    const overallRating = ratingsDenominator / ratingsNumerator

    document.getElementById("overall-rating-span").textContent = overallRating.toPrecision(2)
}



function fillProgressBar() {
    const allStatusBars = document.querySelectorAll(".progress-inner-bar")
    const allStatusPercentage = document.querySelectorAll(".star-percentage")
    for(let i = 1; i <= allStatusBars.length; i++) {
        allStatusBars[i-1].style.width = `${starsPercentage[starsPercentage.length-i]}%`
        allStatusPercentage[i-1].textContent = `${stars[stars.length-i]}`
    }
}




// This function renders reviews to the DOM
function renderReviews() {
        const backgroundColor = darkMode ? "#222222" : "#aaa6a6"
        const color = darkMode ? "#ffffff" : "#000000"
    const allReviews = reviewsArr.map(function(review){
        return  `<div class="review-container" id="review-container" style="background-color: ${backgroundColor}; color: ${color}">
                    <div class="top-section">
                        <div class="top-section-rating-container">
                            <div class="review-stars">
                                ${review.starsGiven.map(star => star).join("")}
                            </div>
                            <p class="rating-number">(${review.starCount})</p>
                        </div>

                    </div>
                    <p class="comment">${review.comment}</p>
                    <p class="user-name">- ${review.userName[0].toUpperCase()}${review.userName.slice(1)}</p>
                    <div class="time-stamp">
                        ${review.timeStamp}
                    </div>
                </div>`
    }).join("")

    allReviewsSection.innerHTML = allReviews

}

// calculateBarPercentage()
fillProgressBar()
calculateOverallRating()
renderReviews()


