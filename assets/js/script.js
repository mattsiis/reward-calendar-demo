var createRewardCardHandler = function() {

};



var defaultCard = function(day) {
    var card = document.createElement('div');
    card.setAttribute('id', "reward-card");
    card.innerHTML = `    
    <div id="border"></div>
    <div id= "reward-item-wrapper">
        <img id="heart" src="./assets/imgs/svgs/heart.svg" />
        <div id="reward-item">
            <img id="reward-img" src="./assets/imgs/reward-item-tier-1.png" />
            <div id="reward-name"><span>2</span> Gold</div> 
        </div>
    </div>
    <div id="day-wrapper">
        <div id="day">Day <span>` + day + `</span></div>
    </div>
`;
    return card;
}

for (let i=1; i<=28; i++) {
    console.log(defaultCard(1).innerHTML);
    document.getElementById("left-calendar").appendChild(defaultCard(i));
}