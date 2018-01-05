// "success" or "failure" - anything else cancels autocrit
let AUTOCRIT = "";

function sendMessage(from, to, msg){
    let whisper = "";
    if(to) whisper = "/w " + to.get("name").split(" ")[0];
    sendChat("character|" + from.get("id"), whisper + " " + msg);
}

function getChar(charName){
    let character = findObjs({
        _type: "character",
        name: charName,
    })[0];
    if(character) return character;
    switch(charName){
        case 'Player Account': 
            return findObjs({_type: "character",name: "Teste McButtface",})[0];
        case 'Rogue Physicist':
            return findObjs({_type: "character",name: "Riemann 2",})[0];
        case 'Logan G.':
            return findObjs({_type: "character",name: "Delta 1",})[0];
        case 'Josh F.':
            return findObjs({_type: "character",name: "Leb",})[0];
        case 'Ryan K.':
            return findObjs({_type: "character",name: "Roze",})[0];
        default:
            return null;
    }
}

on("chat:message", function(msg){
    if(msg.type != "api") return;
    
    if(msg.content.indexOf("!roll") !== -1){
        let chatBonus = 0;

        // Remove the !roll text from the command
        log("StandardDice / main / msg: " + msg.content);
        let rawInput = msg.content.replace("!roll ","").replace("!roll","");
        
        // Split the paramaters by spaces
        let input = rawInput.split(" ");
        log("StandardDice / main / params: " + input);
        
        // Check parameters for bonus or penalty
        _.each(input, function(param){
            if (parseInt(param)) chatBonus = parseInt(param);
        });
        log("StandardDice / main / chatBonus: " + chatBonus);
        
        // Roll dice
        let blackDie = 0;
        let redDie = 0;
        if (AUTOCRIT === "success"){
            blackDie = 6;
            redDie = 6;
        }else if (AUTOCRIT === "failure"){
            blackDie = 5; 
            redDie = 5;
        }else{
            blackDie = randomInteger(10);
            redDie = randomInteger(10);
        }
        log("black / red: " + blackDie + " / " + redDie);
        
        // Check for Criticals
        let resultString = "";
        if (blackDie === redDie){
            if (blackDie % 2 === 0) resultString = "{{Critical Success!}}";
            else resultString = "{{Critical Failure!}}";
        }else{
            if ((blackDie + chatBonus) > redDie) resultString = "{{Success!}}";
            else resultString = "{{Failure!}}";
        }
        
        chatMessage = "&{template:default} {{name=" + msg.who + "}} " + "{{Black Die=[[" + 
            blackDie + " + " + chatBonus + "]]}} {{Red Die=[[" + redDie + "]]}} " + resultString;
        
        sendMessage(getChar("Market"), null, chatMessage)
    }
    
});
