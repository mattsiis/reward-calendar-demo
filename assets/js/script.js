let GOLD = [2,3,2,3,5,3,10, 2,5,5,2,3,3,20, 2,3,2,3,2,3,30, 2,5,5,3,2,3,50];

rewardCardHandler();

function rewardCardHandler() {
    for (let i=0; i<28; i++) {
        let day = i + 1;
        let tier = tierHandler(GOLD[i]);
        document.getElementById("left-calendar").appendChild(defaultCard(day, GOLD[i], tier));
    }
}

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


