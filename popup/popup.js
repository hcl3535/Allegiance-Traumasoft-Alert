//LIST ELEMENTS
const addedAlertsList = document.getElementById('addedallerts')
const notAddedAlertsList = document.getElementById('notaddedalerts')

//BUTTON ELEMENTS

const saveButton = document.getElementById("savechangesbutton")

const listOfCitys = ['Austin', 'Carrollton', 'CorpusChristi', 'Ellis', 'Houston','Jasper', 'Livingston', 'Matagorda', 'Navarro', 'SanAntonio', 'Shelby', 'Vidor', 'No Zone']
let notAdded = []
let added = []
const elements = []

//gets data from storage, and adds the cities to their respective lists
chrome.storage.sync.get("notAddedCitys",(result) => {
    if(result.notAddedCitys){
        notAdded = result.notAddedCitys
        
        if(notAdded){

            for(const city of notAdded){
                const item = document.createElement('li')
                item.appendChild(document.createTextNode(city))
                item.setAttribute('id', city)
                item.setAttribute("class","city")
                notAddedAlertsList.append(item)
                elements.push(item)
            }

        }   

        chrome.storage.sync.get('addedCitys',(result) =>{

            if(result.addedCitys){
                added = result.addedCitys
            }

            if(added){

                for(const city of added){
                    const item = document.createElement('li')
                    item.appendChild(document.createTextNode(city))
                    item.setAttribute('id', city)
                    addedAlertsList.append(item)
                    elements.push(item)
                }

                
            }
        
            addOnClicks()

        })
    } else {
        chrome.storage.sync.set({"notAddedCitys": listOfCitys},(result) => {
            
            if(result.notAdded){
                notAdded = result.notAddedCitys;
            }

            if(notAdded){

                for(const city of notAdded){
                    const item = document.createElement('li')
                    item.appendChild(document.createTextNode(city))
                    item.setAttribute('id', city)
                    notAddedAlertsList.append(item)
                    elements.push(item)
                }
    
            }  
            
        })
        chrome.storage.sync.set({"addedCitys": []},(result) => {
            
            added = result.addedCitys;

            if(added){

                for(const city of added){
                    const item = document.createElement('li')
                    item.appendChild(document.createTextNode(city))
                    item.setAttribute('id', city)
                    addedAlertsList.append(item)
                    elements.push(item)
                }

                
            }

            addOnClicks()

        })
    }
})


//removes element from notAdded and puts it on added
function toAdded(element){
    
    const index = notAdded.indexOf(element.textContent)
    notAdded.splice(index, 1)
    
    
    added.push(element.textContent)
    
    added = sortAlphabeticaly(added)
    
    addedAlertsList.append(element)
    
    console.log(added)
}

//removes element from added and puts it on notAdded
function toNotAdded(element){
    notAddedAlertsList.append(element)
        
    const index = added.indexOf(element.textContent)
    added.splice(index, 1)

    notAdded.push(element.textContent)    

    notAdded = sortAlphabeticaly(notAdded)

    console.log(notAdded)
}


//saves your changes
saveButton.onclick = function(){
    chrome.storage.sync.set({"notAddedCitys": notAdded},(result) => {
        console.log("saved", result)
        notAdded = result.notAddedCitys;
    })

    chrome.storage.sync.set({"addedCitys": added},(result) => {
        console.log("saved", result)
        added = result.addedCitys;
    })


}

//adds onclicks to all elements that should be clicked
function addOnClicks(){

    for(const element of elements){
        element.onclick = function(){    
            if(notAdded.includes(element.textContent)){
                toAdded(element)
            } else {
                toNotAdded(element)     
            }
        }
    }

}    

//sorts lists alphabeticaly
function sortAlphabeticaly(list){
    return list.sort()
}

// chrome.storage.sync.clear()

