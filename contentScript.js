let notAdded;
let added;

let prev = [];
let next = [];

var alertSound = new Audio(chrome.runtime.getURL("sounds/bloop.mp3"));

chrome.storage.sync.get("notAddedCitys",(result) => {
    if(result.notAddedCitys){
        notAdded = result.notAddedCitys

    }
})
chrome.storage.sync.get("addedCitys",(result) => {
    if(result.addedCitys){
        added = result.addedCitys

    }
})    

chrome.storage.onChanged.addListener((changes, namespace) => {
    if(changes.notAddedCitys){
        notAdded = changes.notAddedCitys.newValue
        
    }
    if(changes.addedCitys){
        added = changes.addedCitys.newValue
        
    }
  });

const cityMap = {
    "FFFF00" : "Austin",
    "0A00DA" : "Carrollton",
    "AA6700" : "CorpusChristi",
    "FFFFFF" : "NO Zone",
    "F80025" : "Ellis",
    "EFFF55" : "Houston",
    "127F00" : "jasper",
    "089600" : "Livingston",
    "00D617" : "Matagorda",
    "2F5AFF" : "Navarro",
    "F6DC00" : "SanAntonio",
    "0E3B00" : "Shelby",
    "146300" : "vidor"
}

let unassignedWorkTable
if(document.getElementById("unassignedWorkGrid").childNodes[0]){
    unassignedWorkTable = document.getElementById("unassignedWorkGrid").childNodes[0];
}

const observer = new MutationObserver( mutation => {

    const listOfNodes = mutation[mutation.length - 1 ].addedNodes;

    
    if(mutation[mutation.length - 1 ].addedNodes && listOfNodes.length > 1){

        prev = next;
        next = [];

        for(const node of listOfNodes){

                const call = {
                    tripColor: RGBToHex(node.childNodes[0].style.backgroundColor),
                    tripNumber: node.childNodes[0].firstChild.innerText,
                    tripPickup: node.childNodes[9].innerHTML,
                    tripDropOff: node.childNodes[10].innerHTML
                }
            
                next.push(call)
            }

    }

    // checks if prev and next are diffrent , that prev is not empty(on first load), and that next has a call that prev does not
    if(JSON.stringify(next) !== JSON.stringify(prev) && prev.length > 0 && next.length > prev.length){
        const results = next.filter(({ tripNumber: id1 }) => !prev.some(({ tripNumber: id2 }) => id2 === id1));
        for(const call of results){
            const callsTripColor = call.tripColor
            
            const newCallsregion = cityMap[callsTripColor]
            checkNewCallToFilter(newCallsregion)
        }
    }

})

function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1){
      r = "0" + r;
    }
    if (g.length == 1){
      g = "0" + g;
    }
    if (b.length == 1){
      b = "0" + b;
    }

    const hex = r + g + b
  
    return hex.toUpperCase();
}

function checkNewCallToFilter(newCall){

    if(added.indexOf(newCall) > -1){
        console.log("alert!")
        alertSound.play()
    }

}


observer.observe(unassignedWorkTable,{
    childList:true
})