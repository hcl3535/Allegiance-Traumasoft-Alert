let notAdded;
let added;

let prev = [];
let next = [];

var alertSound = new Audio(chrome.runtime.getURL("sounds/bloop.mp3"));


//gets filter data when page loads
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


//gets new filter data when its changed
chrome.storage.onChanged.addListener((changes, namespace) => {
    if(changes.notAddedCitys){
        notAdded = changes.notAddedCitys.newValue
        
    }
    if(changes.addedCitys){
        added = changes.addedCitys.newValue
        
    }
  });


//map of regions corresponding colors  
const cityMap = {
    "FFFF00" : "Austin",
    "0A00DA" : "Carrollton",
    "AA6700" : "CorpusChristi",
    "FFFFFF" : "No Zone",
    "F80025" : "Ellis",
    "EFFF55" : "Houston",
    "127F00" : "Jasper",
    "089600" : "Livingston",
    "00D617" : "Matagorda",
    "2F5AFF" : "Navarro",
    "F6DC00" : "SanAntonio",
    "0E3B00" : "Shelby",
    "146300" : "Vidor"
}


//gets the unassigned work table element from dom
let unassignedWorkTable
if(document.getElementById("unassignedWorkGrid")?.childNodes[0]){
    unassignedWorkTable = document.getElementById("unassignedWorkGrid").childNodes[0];
}


//watches the unassigned work table and triggers when it changes
const observer = new MutationObserver( mutation => {

    const listOfNodes = mutation[mutation.length - 1 ].addedNodes;

    
    if(mutation[mutation.length - 1 ].addedNodes && listOfNodes.length > 1){

        prev = next;
        next = [];

        createAndAddCallToNextList(listOfNodes, next);

    }

    // checks if prev and next are diffrent , that prev is not empty(on first load), and that next has a call that prev does not
    // if(JSON.stringify(next) !== JSON.stringify(prev) && prev.length > 0 && next.length > prev.length){
    //     const newCalls = next.filter(({ tripNumber: id1 }) => !prev.some(({ tripNumber: id2 }) => id2 === id1));
    //     console.log("newCalls",newCalls)
    //     checkIfCallIsNewAndInFilter(newCalls)
    // }

    if(JSON.stringify(next) !== JSON.stringify(prev) && prev.length > 0){
        const newCalls = next.filter(({ tripNumber: id1 }) => !prev.some(({ tripNumber: id2 }) => id2 === id1));
        console.log(prev)
        console.log(next)
        console.log("newCalls",newCalls)
        checkIfCallIsNewAndInFilter(newCalls)
    }
    

})


//takes list of calls, grabs info needed(trip color, trip number, trip pickup, and trip drop off) and adds it the the next array
function createAndAddCallToNextList(listOfNodes, next){
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


//checks if there are any new calls and then checks if new calls are in your filter
function checkIfCallIsNewAndInFilter(newCalls){
    for(const call of newCalls){
        const callsTripColor = call.tripColor
        
        const newCallsregion = cityMap[callsTripColor]
        checkNewCallToFilter(newCallsregion)
    }
}

//converts rgb to hex
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


//checks if new call is in your reigon filter
function checkNewCallToFilter(newCall){
    
    if(added.indexOf(newCall) > -1){
        console.log("alert!")
        alertSound.play()
    }

}

//unasigned work table observer settings
if(unassignedWorkTable){
    observer.observe(unassignedWorkTable,{
        childList:true
    })
}