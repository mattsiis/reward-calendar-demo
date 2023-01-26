let TODAYCOLLECTED = false;

let GOLD, PREVIOUSLYCOLLECTED, TOTALDAY, MONTH;
let GOLDTIERMAX;

init();

function init() {
    // ---Store Data to local storage---
    // If there is no data store in the local storage, set local storage to the raw data
    if(!localStorage.getItem("gold") || !localStorage.getItem("previousCollected") || !localStorage.getItem('totalDay') || !localStorage.getItem("month") || !localStorage.getItem("goldTierMax")){
        reset();
    };

    // Fetch data from local storage
    GOLD = JSON.parse(localStorage.getItem("gold"));
    PREVIOUSLYCOLLECTED = JSON.parse(localStorage.getItem("previousCollected"));
    TOTALDAY = JSON.parse(localStorage.getItem("totalDay"));
    MONTH = localStorage.getItem("month");
    GOLDTIERMAX = JSON.parse(localStorage.getItem("goldTierMax"));

    createRewardCardList();
    createRightSection();
}

// Reset all to default Data
function reset() {
    let TOTALDAYRAW = 28;
    const GOLDRAW = [1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1];
    let PREVIOUSLYCOLLECTEDRAW = 0;
    localStorage.setItem("gold", JSON.stringify(GOLDRAW));
    localStorage.setItem("previousCollected", JSON.stringify(PREVIOUSLYCOLLECTEDRAW));
    localStorage.setItem("totalDay", JSON.stringify(TOTALDAYRAW))

    let MONTHRAW = "January";
    localStorage.setItem("month", MONTHRAW);

    let GOLDTIERMAXRAW = [4, 9, 19, 29, 49];
    localStorage.setItem("goldTierMax", JSON.stringify(GOLDTIERMAXRAW));
}

// Card clicked to collect reward
function cardCollectRewardHandler() {
    TODAYCOLLECTED = true;
    updateCardCollected();
    updateButton();
}

// Button clicked to collect reward
function buttonCollectRewardHandler() {
    if(document.querySelector(".reward-card.today")){
        TODAYCOLLECTED = true;
        updateCardCollected();
        updateButton();
    }
}

// edit Gold
function editGoldHandler(){
    // re-render the cards
    document.querySelectorAll(".reward-card").forEach((el, index) => {
        el.replaceWith(defaultCard(index+1, GOLD[index], tierHandler(GOLD[index])));
    });
    // replace the input field
    document.querySelectorAll("#reward-name").forEach((el, index) => {
        el.replaceWith(createInputBox(index));
    });

    document.querySelectorAll(".gold-input").forEach((el) => {
        el.addEventListener("keypress", function(e) {
            if(e.key === "Enter") {
                goldInputValueHandler(e)
            }
        })
    })

    // create right confirmation section
    document.querySelector("#exit-button").setAttribute("hidden", "hidden");
    document.querySelector("#learn-more").setAttribute("hidden", "hidden");
    let rightSection = document.querySelector("#top-content");
    if (rightSection) rightSection.replaceWith(editGoldConfirmationElement());
    
    let cancelBtn = document.querySelector("#cancel-setting");
    cancelBtn.addEventListener("click", reloadPageHandler)

    let confirmBtn = document.querySelector("#confirm-gold");
    confirmBtn.addEventListener("click", uploadGoldHandler);
}

// Handle the off-focus event. When the inputbox is unfocused, update the local storage.
function goldInputValueHandler(e) {
    if(e.target.value){
        let value = parseInt(e.target.value);
        let index = e.target.attributes.data.value;
        GOLD[index] = value;
        // updateGold(index, value);
        editGoldHandler();
    }
}

// update gold amount in local storage
function uploadGoldHandler() {
    localStorage.setItem("gold", JSON.stringify(GOLD));
    window.location.reload();
}

// Determin the tier of the reward.
// There are 6 tiers in the current reward. By dividing the total gold by 5, the result can be fall into different categories.
function tierHandler(gold) {
    if(gold <= GOLDTIERMAX[0]) {return 1;}
    else if(gold > GOLDTIERMAX[0] && gold <= GOLDTIERMAX[1]) {return 2;}
    else if(gold > GOLDTIERMAX[1] && gold <= GOLDTIERMAX[2]) {return 3;}
    else if(gold > GOLDTIERMAX[2] && gold <= GOLDTIERMAX[3]) {return 4;}
    else if(gold > GOLDTIERMAX[3] && gold <= GOLDTIERMAX[4]) {return 5;}
    else if(gold > GOLDTIERMAX[4]) {return 6;}
}

// Edit the parameter store in the local storage, then re-render the modal
function editParamHandler () {
    document.querySelector("#exit-button").setAttribute("hidden", "hidden");
    document.querySelector("#learn-more").setAttribute("hidden", "hidden");
    document.querySelector("#top-content").replaceWith(editParamElement());

    let formEl = document.querySelector(".setting-form");
    formEl.addEventListener("submit", settingFromHandler);
    
    let cancelBtn = document.querySelector("#cancel-setting");
    cancelBtn.addEventListener("click", reloadPageHandler)

    document.querySelectorAll(".setting-input.tier.max").forEach((el) => {
        el.addEventListener("blur", updateMinInput)
    })
}


function settingFromHandler (e) {
    e.preventDefault();
    let monthInput = document.getElementById("set-month").value;
    let totaldayInput = document.getElementById("reward-counts").value;
    let prevCollectDaysInput = parseInt(document.getElementById("prev-collected-days").value);

    if (totaldayInput) totaldayInput = parseInt(totaldayInput);
    if (prevCollectDaysInput) prevCollectDaysInput = parseInt(prevCollectDaysInput)
    if (totaldayInput) {
        if (prevCollectDaysInput >= totaldayInput) {
            prevCollectDaysInput = totaldayInput -1;
        }
    } else {
        if (prevCollectDaysInput >= TOTALDAY) {
            prevCollectDaysInput = totaldayInput -1;
        }
    }

    let max1 = parseInt(document.getElementById("max1").value);
    let max2 = parseInt(document.getElementById("max2").value);
    let max3 = parseInt(document.getElementById("max3").value);
    let max4 = parseInt(document.getElementById("max4").value);
    let max5 = parseInt(document.getElementById("max5").value);
    let tierMaxInput = [max1, max2, max3, max4, max5]   
    let goldTierMax = JSON.parse(localStorage.getItem("goldTierMax"));
    
    goldTierMax.forEach((item, index) => {
        if(tierMaxInput[index]) {
            goldTierMax[index] = tierMaxInput[index]
        }
    })

    if (monthInput) localStorage.setItem("month", monthInput);
    if (prevCollectDaysInput >= 0) localStorage.setItem("previousCollected", JSON.stringify(prevCollectDaysInput));
    if (totaldayInput) localStorage.setItem("totalDay", JSON.stringify(totaldayInput));
    if (hasValue(tierMaxInput)) localStorage.setItem("goldTierMax", JSON.stringify(goldTierMax));

    window.location.reload();
}

function reloadPageHandler() {
    window.location.reload();
}


// -------------------------------------

// ---- Element Creator-----
// Create a list of reward cards
function createRewardCardList() {
    for (let i=0; i<TOTALDAY; i++) {
        let tier = tierHandler(GOLD[i]);
        if(i + 1 <= PREVIOUSLYCOLLECTED){
            document.getElementById("card-list").appendChild(previouslyCollectedCard(i + 1));
        } else if (i == PREVIOUSLYCOLLECTED) {
            if (TODAYCOLLECTED) {
                document.getElementById("card-list").appendChild(previouslyCollectedCardToday(i+1));
                document.getElementById("reward-card-content-wrapper").setAttribute("id", "reward-card-content-wrapper-today");
                updateButton();
            } else {
                document.getElementById("card-list").appendChild(defaultCardToday(i+1, GOLD[i], tier));
            }
        } else {
            document.getElementById("card-list").appendChild(defaultCard(i+1, GOLD[i], tier));
        }
    }
}

// Create Right Section
function createRightSection() {
    document.getElementById("right-interactive-area").appendChild(calendarInfoElement());
}

// -----Elements---------
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
    return goldInputBox;
}

// Create right Calendar Info section
function calendarInfoElement() {
    let infoSection = document.createElement("div");
    infoSection.setAttribute("id", "info-section")
    infoSection.innerHTML = `
    <div id="top-content">
        <div id="chibi-img">
            <img src="./assets/imgs/chibi-graphic.png" alt="chibi-graphic">
        </div>
        <div id="text-content">
            <div id="title-wrapper">
                <div class="modal-title">` + MONTH + ` Daily Calendar</div>
                <div id="reset-date">Calendar resets in: <span class="bold-text">10d 9h</span></div>
            </div>
            
            <button id="reward-collect-button">
                <span class="button-text">Claim Reward</span>
            </button>

            <div class="seperator" ></div>

            <div id="timer-wrapper">
                <div id="timer-text">You have <span id="timer">21:48:56</span> left to claim the reward.</div>
                <div id="time-zone-indicator">Days reset at 10pm UTC time</div>
            </div>
        </div>
    </div>
    `
    return infoSection;
}

// Create Parameter Edit Panal
function editParamElement() {
    let settingPanel = document.createElement('div');
    settingPanel.setAttribute("class", "setting-panel");
    settingPanel.innerHTML = `
        <form class="setting-form">
            <div class="setting-container">
                <div class="setting-title">General</div>
                <div class="settings-wrapper">
                    <div class="setting-item">
                        <label class="setting-label" for="set-month">Month</label>
                        <input type="text" class="setting-input general" id="set-month" placeholder="`+ localStorage.getItem("month") +`" >
                    </div>
                    <div class="setting-item">
                        <label class="setting-label" for="reward-counts">Reward Counts</label>
                        <input type="text" class="setting-input general" id="reward-counts" placeholder="`+ localStorage.getItem("totalDay") +`">
                    </div>
                    <div class="setting-item">
                        <label class="setting-label" for="prev-collected-days">Previously Collected Days</label>
                        <input type="text" class="setting-input general" id="prev-collected-days" placeholder="`+ localStorage.getItem("previousCollected") +`">
                    </div>
                </div>
            </div>
            <div class="setting-container">
                <div class="setting-title">Gold Tier Range</div>
                <ul class="tier-option-wrapper">
                    ` + tierOption(6) + `
                </ul>
            </div>
            <button type="submit" class="setting-button confirm" id="confirm-setting">Confirm</button> 
        </form>
        <button class="setting-button cancel" id="cancel-setting">Cancel</button>
    `;
    return settingPanel;
}

// Create Edit Gold Cormation element
function editGoldConfirmationElement(){
    let settingPanel = document.createElement('div');
    settingPanel.setAttribute("class", "setting-panel gold");
    settingPanel.innerHTML = `
        <p class="modal-title"> Confirm the Gold Setting? </p>
        <div class="button-wrapper gold-setting">
            <button class="setting-button confirm" id="confirm-gold">Confirm</button> 
            <button class="setting-button cancel" id="cancel-setting">Cancel</button>
        </div》
    `
    return settingPanel;
}

// Create tier option element
function tierOption (tiers) {
    let tierList = ``
    let goldTier = JSON.parse(localStorage.getItem("goldTierMax"))
    goldTier.unshift(0);
    for(let i=1; i <= tiers; i++) {
        tierList += `
            <li class='tier-option'>
                <label class="setting-label" for="min`+ i + ` max`+ i + `">Tier ` + i + `</label>
                <div class="input-wrapper">
                    <input type="text" class="setting-input tier min" id="min` + i + `" placeholder="` + (goldTier[i-1] + 1) +`" disabled>
        `
        if (i < tiers) {
            tierList += `
                <spam class="setting-label"> - </spam>
                    <input type="text" class="setting-input tier max" id="max` + i + `" placeholder="` + goldTier[i] +`" data="` + i + `">
                </div>
            </li>
        `
        }                 
    }
    return tierList
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

// Update the setting input field - minimum placeholder number style
function updateMinInput(e){
    if(e.target.value) {
        let targetIdIndex = parseInt(e.target.attributes.data.value) + 1;
        let targetMinInputId = "#min" + targetIdIndex;
        let targetEl = document.querySelector(targetMinInputId);
        targetEl.placeholder = parseInt(e.target.value) + 1;
        targetEl.classList.add('edited');
    }
}


// ----Utilities----
// util.setAttributes, Used for setting multiple attributes
function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// Check if an Array has value
function hasValue(array){
    for(let i = 0; i < array.length; i++) {
        if (array[i]) return true;
    }
    return false
}


// ----Listener----
const cardEl = document.querySelector("#reward-card-content-wrapper");
const buttonEl = document.querySelector("#reward-collect-button");
const updateGoldEl = document.querySelector("#learn-more");
const updateParamEl = document.querySelector("#exit-button");

cardEl.addEventListener("click", cardCollectRewardHandler);
buttonEl.addEventListener("click", buttonCollectRewardHandler);
updateGoldEl.addEventListener("click", editGoldHandler);
updateParamEl.addEventListener("click", editParamHandler);
