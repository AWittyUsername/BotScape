$(document).ready(function(){
    console.log("Welcome to BotScape.");
    gameData = load();
    init();
    setInterval(gameUpdate,(1000/60));
    setInterval(save, 300000);
})

function init(){
    updatePickaxe();
    updateAxe();
}
//Game data object
function game(){
    this.coins = 0;
    this.cps = 0;
    this.botCount = 1;
    this.pickaxeLevel = 0;
    this.axeLevel = 0;
}
//Game info update functionality
function gameUpdate(){
    addCoins((gameData.cps)/60);
    $("#coinCounter").text(gameData.coins.toFixed(0));
    updateAvailable();
}
function updateCoinsPerSecond(){
    //Pickaxe gives 1 coin per second
    gameData.cps = (gameData.botCount * gameData.pickaxeLevel);
    //Axe gives 10 coins per second
    gameData.cps += (10 * gameData.botCount * gameData.axeLevel);
}
//Transaction functionality
function addCoins(amount){
        gameData.coins += amount;
}
function removeCoins(amount){
    if(gameData.coins >= amount){
        gameData.coins -= amount;
        return true;
    }
    return false;
}
//Save and load functionality
function save(){
    Cookies.set("save-data",JSON.stringify(gameData),{expires: 3650});
    notify("Game saved");
}
function load(){
    try{
    var loadData = JSON.parse(Cookies.get("save-data"));
    }
    catch{
        loadData = new game();
    }
    return loadData;
}
function deleteSavegame(){
    Cookies.set("save-data",JSON.stringify(new game),{expires: 3650});
    gameData = load();
    init();
}
//Clickable events
$("#menuButton").on({"click":function(){
    $("#optionsMenu").toggleClass("show");
}})
$("#saveButton").on({"click":function(){
    save();
    notify("Game saved");
}})
$("#loadButton").on({"click":function(){
    gameData = load();
    init();
    notify("Game loaded");
}})
$("#deleteButton").on({"click":function(){
    if(confirm("Are you sure you want to delete ALL SAVED DATA?\nThere is absolutely no way to undo this later!")){
        deleteSavegame();
    }
}})
$("#coinImage").on({"click":function(){
    gameData.coins += 1;
}});
$("#pickaxeIcon").on({"click":function(){
    if(gameData.pickaxeLevel < 8){
        if((removeCoins((gameData.pickaxeLevel+1)*100))){
        gameData.pickaxeLevel++;
        updatePickaxe();
        updateCoinsPerSecond()
        }
    }
}}); 
$("#axeIcon").on({"click":function(){
    if(gameData.axeLevel < 8){
        if((removeCoins((gameData.axeLevel+1)*300))){
        gameData.axeLevel++;
        updateAxe();
        updateCoinsPerSecond()
        }
    }
}}); 
//UI updates
function updateAvailable(){
    if(gameData.coins > (gameData.pickaxeLevel+1) * 100){
        $("#pickaxeUpgrade").toggleClass("upgradeablesavailable", true);
    }
    else{
        $("#pickaxeUpgrade").toggleClass("upgradeablesavailable", false);
    }
    if(gameData.coins > (gameData.axeLevel+1) * 300){
        $("#axeUpgrade").toggleClass("upgradeablesavailable", true);
    }
    else{
        $("#axeUpgrade").toggleClass("upgradeablesavailable", false);
    }
}
function updatePickaxe(){
    $("#pickaxeLabel").text("Level " + gameData.pickaxeLevel + " Pickaxe");
    $("#pickaxeIcon").attr("src","/botscape/content/pickaxe/" + gameData.pickaxeLevel + ".png");
    $("#pickaxeCost").text("Cost: " + ((gameData.pickaxeLevel+1) * 100));
    if(gameData.pickaxeLevel == 8){
        $("#pickaxeCost").text("Max level");
    }
}
function updateAxe(){
    $("#axeLabel").text("Level " + gameData.axeLevel + " Axe");
    $("#axeIcon").attr("src","/botscape/content/axe/" + gameData.axeLevel + ".png");
    $("#axeCost").text("Cost: " + ((gameData.axeLevel+1) * 300));
    if(gameData.axeLevel == 8){
        $("#axeCost").text("Max level");
    }
}
function notify(message){
    $("#notificationLabel").text(message);
    $("#notificationLabel").addClass("notify");
    setTimeout(function(){
        $("#notificationLabel").removeClass("notify");
    },1000);
}