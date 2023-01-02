let DAY = 0;
let GOLD = [2,3,2,3,5,3,10, 2,5,5,2,3,3,20, 2,3,2,3,2,3,30, 2,5,5,3,2,3,50];
let COLLECTED = 5;
let TODAYCOLLECTED = false;

rewardCardHandler();

function rewardCardHandler() {
    for (let i=0; i<28; i++) {
        DAY = i + 1;
        let tier = tierHandler(GOLD[i]);
        if(DAY <= COLLECTED){
            document.getElementById("left-calendar").appendChild(previouslyCollectedCard());
        } else if (DAY == COLLECTED + 1) {
            if (TODAYCOLLECTED) {
                document.getElementById("left-calendar").appendChild(previouslyCollectedCardToday());
                document.getElementById("reward-card-content-wrapper").setAttribute("id", "reward-card-content-wrapper-today");
            } else {
                document.getElementById("left-calendar").appendChild(defaultCardToday(DAY, GOLD[i], tier));
            }
        } else {
            document.getElementById("left-calendar").appendChild(defaultCard(DAY, GOLD[i], tier));
        }
    }

}

// Determin the tier of the reward.
// There are 6 tiers in the current reward. By dividing the total gold by 5, the result can be fall into different categories.
function tierHandler(gold) {
    switch(gold / 5) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 4: return 4;
        case 6: return 5;
        case 10: return 6;
        default: return 1;
    }
}

function defaultCard(day, gold, tier) {
    let card = document.createElement('div');
    card.setAttribute('id', "reward-card");
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

function previouslyCollectedCard() {
    let card = document.createElement('div');
    card.setAttribute("id", "reward-card-collected");
    // import current day default card
    card.innerHTML += defaultCard(DAY, GOLD[DAY-1], tierHandler(GOLD[DAY-1])).innerHTML;
    // add mask and collected tag
    card.innerHTML += `
        <div id="mask">
            <img id="collected-tag" src="./assets/imgs/svgs/checkmark.svg" />
        </div>
    `;
    return card;
}

function defaultCardToday(day, gold, tier) {
    let card = document.createElement('div');
    card.setAttribute('id', "reward-card-today");
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

function previouslyCollectedCardToday() {
    let card = document.createElement('div');
    card.setAttribute("id", "reward-card-collected-today");
    // import current day default card
    card.innerHTML += defaultCardToday(DAY, GOLD[DAY-1], tierHandler(GOLD[DAY-1])).innerHTML;
    // add mask and collected tag
    card.innerHTML += `
        <div id="mask-today">
            <img id="collected-tag-today" src="./assets/imgs/svgs/checkmark.svg" />
        </div>
    `;
    return card;
}

