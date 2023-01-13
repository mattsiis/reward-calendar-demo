let TODAYCOLLECTED = false;

let GOLD, PREVIOUSLYCOLLECTED, TOTALDAY;

init();
rewardCardHandler();

function init() {
    // ---Store Data to local storage---
    // If there is no data store in the local storage, set local storage to the raw data
    if(!localStorage.getItem("gold") || !localStorage.getItem("previousCollected") || !localStorage.getItem('totalDay')){
        let TOTALDAYRAW = 28;
        const GOLDRAW = [1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1];
        let PREVIOUSLYCOLLECTEDRAW = 0;
        localStorage.setItem("gold", JSON.stringify(GOLDRAW));
        localStorage.setItem("previousCollected", JSON.stringify(PREVIOUSLYCOLLECTEDRAW));
        localStorage.setItem("totalDay", JSON.stringify(TOTALDAYRAW))
    }
    // Fetch data from local storage
    GOLD = JSON.parse(localStorage.getItem("gold"));
    PREVIOUSLYCOLLECTED = JSON.parse(localStorage.getItem("previousCollected"));
    TOTALDAY = JSON.parse(localStorage.getItem("totalDay"));
}

function rewardCardHandler() {
    
    let dayCounter = 0;
    for (let i=0; i<TOTALDAY; i++) {
        dayCounter = i + 1;
        let tier = tierHandler(GOLD[i]);
        if(dayCounter <= PREVIOUSLYCOLLECTED){
            document.getElementById("left-calendar").appendChild(previouslyCollectedCard(dayCounter));
        } else if (dayCounter == PREVIOUSLYCOLLECTED + 1) {
            if (TODAYCOLLECTED) {
                document.getElementById("left-calendar").appendChild(previouslyCollectedCardToday(dayCounter));
                document.getElementById("reward-card-content-wrapper").setAttribute("id", "reward-card-content-wrapper-today");
                updateButton();
            } else {
                document.getElementById("left-calendar").appendChild(defaultCardToday(dayCounter, GOLD[i], tier));
            }
        } else {
            document.getElementById("left-calendar").appendChild(defaultCard(dayCounter, GOLD[i], tier));
        }
    }
}


// Card clicked to collect reward
function cardCollectRewardHandler() {
    TODAYCOLLECTED = true;
    updateCardCollected();
    updateButton();
}

// Button clicked to collect reward
function buttonCollectRewardHandler() {
    if(document.querySelector("#reward-card-today")){
        TODAYCOLLECTED = true;
        updateCardCollected();
        updateButton();
    }
}

// When exit button is clicked, edit the parameter
function editGoldHandler(){
    // re-render the cards
    document.querySelectorAll(".reward-card").forEach((el, index) => {
        el.replaceWith(defaultCard(index+1, GOLD[index], tierHandler(GOLD[index])));
    });
    document.querySelectorAll("#border").forEach((el) => {
        el.remove();
    } )
    document.querySelectorAll("#reward-name").forEach((el, index) => {
        el.replaceWith(createInputBox(index));
    });

    document.querySelectorAll(".gold-input").forEach((el) => {
        el.addEventListener("blur", goldInputTextHandler);
    })    
}

// Handle the off-focus event. When the inputbox is unfocused, update the local storage.
function goldInputTextHandler(e) {
    if(e.target.value){
        let value = parseInt(e.target.value);
        console.log(value)
        let index = e.target.attributes.data.value;
        updateGold(index, value);
        editGoldHandler();
    }
}


// Determin the tier of the reward.
// There are 6 tiers in the current reward. By dividing the total gold by 5, the result can be fall into different categories.
function tierHandler(gold) {
    switch(parseInt(gold / 5)) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 3;
        case 4: return 4;
        case 5: return 4;
        case 6: return 5;
        case 7: return 5;
        case 8: return 5;
        case 9: return 5;
        case 10: return 6;
        default: return 6;
    }
}

// -------------------------------------

// ---- Element Creator-----
// Create Default Card Element
function defaultCard(day, gold, tier) {
    let card = document.createElement('div');
    card.setAttribute('class', "reward-card");
    card.innerHTML = `    
        <div id="border"></div>
        <div id= "reward-item-wrapper">
            <img id="heart" src="./assets/imgs/svgs/heart.svg" />
            <div id="reward-item">
                <img id="reward-img" src="./assets/imgs/reward-item-tier-` + tier + `.png" />
                <div id="reward-name"><span>` + gold + `</span> Gold</div> 
            </div>
        </div>
        <div id="day-wrapper">
            <div id="day">Day <span>` + day + `</span></div>
        </div>
    `;
    return card;
}

// Add overlay and collected tag to the Default Card
function previouslyCollectedCard(day) {
    let card = document.createElement('div');
    card.setAttribute("class", "reward-card collected");
    // import current day default card
    card.innerHTML += defaultCard(day, GOLD[day-1], tierHandler(GOLD[day-1])).innerHTML;
    // add mask and collected tag
    card.innerHTML += `
        <div id="mask">
            <img id="collected-tag" src="./assets/imgs/svgs/checkmark.svg" />
        </div>
    `;
    return card;
}

// Create Today Card Element
function defaultCardToday(day, gold, tier) {
    let card = document.createElement('div');
    card.setAttribute('class', "reward-card today");
    card.innerHTML = `
        <div id="reward-card-content-wrapper">
            <div id="border-today"></div>
            <div id= "reward-item-today-wrapper">
                <img id="diamond-bg" src="./assets/imgs/diamond-bg.png" />
                <img id="heart-today" src="./assets/imgs/svgs/heart.svg" />
                <div id="reward-item-today">
                    <img id="reward-img-today" src="./assets/imgs/reward-item-tier-` + tier + `.png" />
                    <div id="reward-name-today"><span>` + gold + `</span> Gold</div> 
                </div>
            </div>
            <div id="day-wrapper-today">
                <div id="day-today">Day <span>` + day + `</span></div>
            </div>
        </div>
    `;
    return card;
}

// Add overlay and collected tag to the Default Card
function previouslyCollectedCardToday(today) {
    let card = document.createElement('div');
    card.setAttribute("class", "reward-card collected-today");
    // import current day default card
    card.innerHTML += defaultCardToday(today, GOLD[today-1], tierHandler(GOLD[today-1])).innerHTML;
    // add mask and collected tag
    card.innerHTML += `
        <div id="mask-today">
            <img id="collected-tag-today" src="./assets/imgs/svgs/checkmark.svg" />
        </div>
    `;
    return card;
}

// Create Reward Collected Button
function rewardCollectedButton(){
    let button = document.createElement('div');
    button.setAttribute("id", "reward-collected-button");
    button.innerHTML = `
        <img src="./assets/imgs/svgs/check.svg" />
        <span class="button-text">Reward Claimed Today</span>
    `;
    return button;
}

// Create Input Box Element
function createInputBox(index) {
    let goldInputBox = document.createElement('input');
    setAttributes(goldInputBox, {'type': 'text', "class": "gold-input", "data": index, "placeholder": GOLD[index] });
    // goldInputBox.innerHTML = `
    //     <input type="text" class="gold-input" name="new-gold" data=` + index + ` placeholder= ` + GOLD[index] + `></input>
    // `
    return goldInputBox;
}

// -------------------------------------------------

// ----Update Behaviour----
// Update today's card when reward is collected
function updateCardCollected() {
    document.querySelector(".reward-card.today").replaceWith(previouslyCollectedCardToday(PREVIOUSLYCOLLECTED+1));
    document.getElementById("reward-card-content-wrapper").setAttribute("id", "reward-card-content-wrapper-today");
}

// Update reward Collected Button when reward is collected
function updateButton() {
    document.querySelector("#reward-collect-button").replaceWith(rewardCollectedButton())
}

// update gold amount in local storage
function updateGold(i, amount) {
    GOLD[i] = amount;
    localStorage.setItem("gold", JSON.stringify(GOLD));
}

// ----Utilities----
// util.setAttributes, Used for setting multiple attributes
function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}


// ----Listener----
const cardEl = document.querySelector("#reward-card-content-wrapper");
const buttonEl = document.querySelector("#reward-collect-button");
const exitEl = document.querySelector("#exit-button");

cardEl.addEventListener("click", cardCollectRewardHandler);
buttonEl.addEventListener("click", buttonCollectRewardHandler);
exitEl.addEventListener("click", editGoldHandler);