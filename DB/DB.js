String.prototype.capitalize = function(){
    // if(typeof String != "string") throw new Error("argument given is not a string");
    let arr = this.split(" ");
    let arr2 = [];
    for(let i=0;i<arr.length;i++){
        arr2.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase())
    }
    return arr2.join(" ");
};
let importer = document.getElementById("importOldV");
let errorDisplayer =  document.querySelector("#error-displayer");
importer.addEventListener("change",function(event){
    if(!"FileReader" in window)return
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onprogress = function(e){
        // let int = setInterval(console.log((e.loaded/e.total)*100),1)
        // if((e.loaded/e.total) * 100 == 100)clearInterval(int);
    }
    fileReader.onload = function(e){
        try{
            errorDisplayer.innerHTML = "";
            let result = JSON.parse(fileReader.result);
            if(!typeof result == "object" && Array.isArray(result)){return}
            let listOfProperties = [mainSymKey,secSymKey,rfKey,treatmentKey];
            for(let disease in result){
                if(!result[disease].hasOwnProperty(mainSymKey)){
                    throw new Error(mainSymKey," is missing");
                }
                for(let key in result[disease]){
                    let subList = [...listOfProperties];
                    if(listOfProperties.includes(key)){
                        
                        subList.splice(subList.indexOf(key),1);
                        continue;
                    }
                    else{
                        throw new Error(key + " is not included");
                    }
                }
            }
            // usage example:
            var symArray = [];
            var rfArray = [];
            var trtArray = [];
            var diseaseArray = [];

            for(let disease in result){
                if(result[disease]){
                    diseaseArray.push(disease)
                }
                for(let key in result[disease]){
                    if(result[disease][key]){
                        
                        if(key == mainSymKey || key == secSymKey){
                            symArray = symArray.concat(result[disease][key])
                        }
                        else if(key == rfKey){
                            rfArray = rfArray.concat(result[disease][key])
                        }
                        else if(key == treatmentKey){
                            trtArray = trtArray.concat(result[disease][key])
                        }
                    }
                }
            }
            symptoms.value = [...new Set(symArray)]
            rf.value = [... new Set(rfArray)]
            treatment.value = [... new Set(trtArray)];
            diseases.value = diseaseArray;
            symptoms.updateItem();
            rf.updateItem();
            treatment.updateItem();
            diseases.updateItem();
            errorDisplayer.innerHTML = "IMPORTED"
            localStorage["ds_db"] = JSON.stringify(result)
        }
        catch(e){
            console.warn(e)
            errorDisplayer.innerHTML = 
            "<p><img width='20rem' height='20rem' src='error-img.png'></img>"+
            "ERROR : "+e+"</p>"
        }
        // importer.value = null

    }
    fileReader.readAsText(file,'UTF-8')
})
window.addEventListener("storage",function(event){
    console.log(event);
},false)
class TagsInput{
    #parent;
    #tagsContainer;
    constructor({parent_class="input_div_parent",parent_id,input_class="input",input_id="",
    input_data_tags="tagsContainer",tagsStorage=[],tag_class="categorie",tag_close_class="close",tag_span_class="tag"
    ,regExp=/\s/g,multipleWSpaces=false,tagsep=[","],minChar=1,maxChar=524288,repeat=false,focusout=false,ignoreFocusIds,
    whiteList,blackList}){
    this.#errorHandler(["parent_class","parent_id","input_class","input_id","input_data_tags","tagsStorage","tag_class",
        "tag_close_class","tag_span_class","regExp","multipleWSpaces","tagsep","minChar","maxChar",
        "repeat","focusout","whiteList","blackList"],
        [parent_class,parent_id,input_class,input_id,input_data_tags,tagsStorage,tag_class,tag_close_class,tag_span_class,
        regExp,multipleWSpaces,tagsep,minChar,maxChar,repeat,focusout,whiteList,blackList],
        ["string","string","string","string","string","array","string","string","string",
        "regexp","boolean","array","number","number","boolean","boolean","array","array"]);
    this.parent_class = parent_class;
    this.parent_id = parent_id;
    this.input_class = input_class;
    this.input_data_tags = input_data_tags;
    this.tagsStorage = tagsStorage;
    this.tag_class = tag_class;
    this.tag_span_class = tag_span_class;
    this.tag_close_class = tag_close_class;
    this.regExp = regExp;
    this.multipleWSpaces = multipleWSpaces;
    this.tagsep = tagsep;
    this.repeat = repeat;
    this.focusout = focusout;
    this.blackList = blackList;
    this.whiteList = whiteList;
    this.ignoreFocusIds = ignoreFocusIds
    this.#parent = document.querySelector("#"+this.parent_id);
    this.#parent.classList.add(this.parent_class);
    this.input = document.createElement("input");
    this.input.className = input_class;
    this.input.id = input_id
    this.input.type = "text";
    this.input.setAttribute("data-tags",input_data_tags);
    this.input.maxLength = maxChar;
    this.input.minLength = minChar;
    this.#tagsContainer = document.createElement("input");
    this.#tagsContainer.type = "hidden";
    this.#tagsContainer.id = this.input.getAttribute("data-tags")
    this.#parent.appendChild(this.input);
    this.#parent.insertBefore(this.#tagsContainer,this.input.nextSibling);
    this.#addEvents();
    if(this.ignoreFocusIds)this.#returnIgnoredTargets();
    }
    #returnIgnoredTargets(){
        let returnedList = [];
        for(let i in this.ignoreFocusIds){
            let item = this.ignoreFocusIds[i];
            returnedList.push(document.getElementById(item))
        }
        return returnedList;
    }
    #errorHandler(arg,variables,type){
        if(variables.length != type.length && variables.length != arg.length && variables.length != null) 
        throw new Error("error: variables and type"
        +" and arg don't have the same length")
        else{
            for(let i =0;i<variables.length;i++){
                if(variables[i] == null){}
                else if(type[i] == "array"){
                    if(!Array.isArray(variables[i])){
                        throw new Error(arg[i]+" have to be an array");
                    }
                }
                else if(type[i] == "object"){
                    if(Array.isArray(variables[i])){
                        throw new Error(arg[i]+" have to be an object");
                    }
                }
                else if(type[i] == "regexp"){
                    if(!variables[i] instanceof RegExp){
                        throw new Error(arg[i]+" have to be a RegExp")
                    }
                }
                else{
                        if(typeof(variables[i]) != type[i]){
                            throw new Error(arg+" have to be "+type[i]);
                    }
                }
            }
        }
    }
    #addEvents(){
        // this.input.addEventListener("blur",e=>{console.log(e)})
        let [listenedInput_sep,unlistenedInput_sep] = this.#tagSeperatorHandler();
        this.input.addEventListener("input",async e=>{
            this.#resizeInput(e.currentTarget);
            // let j = await new Promise(res=>(setTimeout(()=>{res(that.#returnIgnoredTargets())},5)))
            // console.log(j)
            let clearedInputValue = this.#filterText(this.input.value);
            // clear input value
            this.input.value = clearedInputValue;
            if(listenedInput_sep.includes(e.data)){
                if(this.#checkTagList(clearedInputValue)){
                    this.addTag(this.input.value);
                }
            }
        });
        let that = this;
        this.input.addEventListener("keydown",function(e){
            let clearedInputValue = that.#filterText(that.input.value);
            let lastTag = that.tagsStorage[that.tagsStorage.length-1];
            if(e.key == "Backspace" && lastTag && that.input.value == ""){
                that.removeTag(lastTag);
            }
            else if(unlistenedInput_sep.includes(e.key)){
                if(that.#checkTagList(clearedInputValue)){
                    that.addTag(that.input.value);
                }
            }
        })
        this.input.addEventListener("submit",function(e){
            e.preventDefault();
        })
        this.#parent.addEventListener("click",function(e){
            that.input.focus();
        })
        if(this.focusout)
        {
            document.addEventListener("click",event=>{
                // if(this !== this) return
                var noneIgnoredElements = this.#returnIgnoredTargets();
                var readyToFocusOut = false;
                // console.log(target)
                for(let i=0;i<noneIgnoredElements.length;i++){
                    let target = event.target;
                    if(target == noneIgnoredElements[i] || target == this.input || target == this.#parent){
                        readyToFocusOut = true;
                        break;
                    }
                }
                
                if(readyToFocusOut) return
                let clearedInputValue = this.#filterText(that.input.value);
                if(this.#checkTagList(clearedInputValue)){
                    this.addTag(that.input.value);
                }
            })
            // that.input.addEventListener('focusout', (event) => {
            //     let clearedInputValue = this.#filterText(that.input.value);
            //     if(this.#checkTagList(clearedInputValue)){
            //         this.addTag(that.input.value);
            //     }
            // });
        }
    }
    #checkTagList(clearedInputValue){
        if(this.whiteList&&!this.blackList){
                if(this.whiteList.includes(clearedInputValue))
                    return true;
                }
        else if(!this.whiteList&&this.blackList){
                    if(!this.blackList.includes(clearedInputValue))
                        return true;
                    }
        else if(this.whiteList&&this.blackList){
                    if(this.whiteList.includes(clearedInputValue)&&!this.blackList.includes(clearedInputValue)){
                        return true;
                    }
                }
        else if(!this.whiteList&&!this.blackList){
                    return true;
        }
        
    }
    addTag(text){
        var clearedInputValue = this.#filterText(text);
        if(!this.multipleWSpaces) clearedInputValue = this.#multipleWSpacesFilter(clearedInputValue);
        var div = document.createElement('div');
        var span = document.createElement("span");
        var close = document.createElement("span");
        if((this.#repeatedTags(clearedInputValue,this.tagsStorage))
            || clearedInputValue.length < this.input.minLength){
            this.input.value = ""
            return;
        }
        close.innerHTML = "&times;"
        close.className = this.tag_close_class;
        close.setAttribute("aria-selected","false");
        div.className = this.tag_class;
        span.className = this.tag_span_class;
        span.textContent = clearedInputValue;
        var tag = {text:span.textContent,element:div}
        this.input.value = "";
        this.#parent.insertBefore(div,this.input);
        this.tagsStorage.push(tag);
        close.addEventListener("click",e=>{
            this.removeTag(tag);
        });
        this.refreshTags()
        div.appendChild(span);
        div.appendChild(close);
    }
    #filterText(text){
        return text.replace(this.regExp,"")
    };
    #multipleWSpacesFilter(text){
        return text.replace(/\s{2,}/g," ")
    }
    #repeatedTags(text,tagsStorage){
        if(!this.repeat){
        for(let i = 0;i<tagsStorage.length;i++){
            let tagsStorageText = tagsStorage[i].text;
            if(tagsStorageText == text){
                tagsStorage[i].element.classList.remove("flash");
                setTimeout(()=>{tagsStorage[i].element.classList.add("flash");},10);
                return true
            }
            // for(let d=0;d<list_.length;d++){
            //     if(text == list_[d]){
            //         tagsStorage[i].element.classList.remove("flash");
            //         setTimeout(()=>{tagsStorage[i].element.classList.add("flash");},10)
            //         return true
            //         }
            //     }
            }
        return false;
        }}
    refreshTags(){
        let list = [];
        this.tagsStorage.forEach(function(i){
            list.push(i.text);
        });
        this.#tagsContainer.value = list.join(",");
    }
    removeTag(tag){
        let index = this.tagsStorage.indexOf(tag);
        this.#parent.removeChild(tag.element);
        this.tagsStorage.splice(index,1);
        this.refreshTags();
    }
    removeAllTags(){
        this.tagsStorage.forEach(function(i){
            i.element.remove();
        });
        this.tagsStorage.splice(0,this.tagsStorage.length);
    }
    #resizeInput = (this_) =>{
        this_.style.width = (this_.value.length + 1.35) + "ch";
    };
    #tagSeperatorHandler(){
        let special_keys = ["Enter","Backspace"]
        let tagsep = [...this.tagsep];
        let Input_list = [];
        let UInput_list = [];
        for(let i = 0;i<tagsep.length;i++){
            if(special_keys.includes(tagsep[i].capitalize()))
            {
                    UInput_list.push(tagsep[i].capitalize());
            }
            else{
                Input_list.push(tagsep[i])
            }
        }
        return [Input_list,UInput_list];
    }
}
function autocomplete({input,input_id="",parent,arr,
        autocomplete_container_class="autocomplete-items",
        active_items_class="autocomplete-active",funcOnClicking}){
    let E;
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    input.id = input_id;
    input.addEventListener("submit",function(e){
        e.preventDefault();
    });
    input.addEventListener("input",function(e){
        E = e;
        addAutoCompeleteAndUpdateArray({});
    });
    input.addEventListener("keydown",function(e){
        let acholder = document.getElementById(this.id+"_"+autocomplete_container_class);
        removeActive(acholder);
        if(e.which == 40 && acholder){
            checkActive(acholder,1);
        }
        else if(e.which == 38 && acholder){
            checkActive(acholder,-1);
        }
        else if(e.which == 13&& currentFocus > -1){
            // input.value = acholder.children[currentFocus].children[1].value
            // closeLists();
            acholder.children[currentFocus].children[1].click("hey");
            e.preventDefault();
        }
    });
    function addAutoCompeleteAndUpdateArray({ev=E,array=arr}){
            input.removeEventListener("input",addAutoCompeleteAndUpdateArray);
            arr = array;
            var a, b, value = ev.target.value;
            closeLists();
            if(!value){return}
            a = document.createElement("div");
            a.id = ev.target.id + "_" +autocomplete_container_class;
            a.className = autocomplete_container_class;
            currentFocus = -1;
            if(!parent){
                ev.target.parentNode.style.position = "relative";
                ev.target.parentNode.appendChild(a);
            }
            else{
                parent.style.position = "relative";
                parent.appendChild(a);
            }
            
            for(let i = 0;i<arr.length;i++){
                // if input value matches with an element in the array, with create and show all matched elements
                if(arr[i].substr(0,value.length).toLowerCase() == value.toLowerCase()){
                    b = document.createElement("div");
                    b.innerHTML = `<strong>${arr[i].substr(0,value.length)}</strong>${arr[i].substr(value.length)}`;
                    b.innerHTML += `<input type="hidden" value="${arr[i]}">`;
                    b.addEventListener("click",function(e){0
                        e.stopPropagation();
                        e.preventDefault();
                        input.focus();
                        if(e.target != this && e.x != 0) return
                        input.value = this.children[1].value;
                        closeLists();
                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("input", false, true);
                            input.dispatchEvent(evt);
                        }
                        else
                            input.fireEvent("input");
                        if(funcOnClicking) funcOnClicking(this);
                    })
                    a.appendChild(b);
                }
            }
        }
    function checkActive(a,num){
        // a function to classify an item as "active"
        let l = a.children.length;
            currentFocus += num;
            if(currentFocus < 0){
                currentFocus = l-1;
            }
            else if(currentFocus >= l){
                currentFocus = 0
            }
        
        a.children[currentFocus].classList.add(active_items_class);
    }
    function removeActive(a){
        // remove the activation class from non selected elements (with arrows)
        if(!a){return;}
        for(let i = 0;i<a.children.length;i++){
            a.children[i].classList.remove(active_items_class);
        }
    }
    document.addEventListener("click",function(e){
        // if(e.target != this)return
        closeLists();
    });
    function closeLists(){
        // this function closes all the autocomplete containers
        var div = document.getElementsByClassName(autocomplete_container_class);
        if(!div) return
        for(let i =0;i<div.length;i++){
            div[i].remove();
        }
    }
    return addAutoCompeleteAndUpdateArray;
}
class ProgressBar{
    constructor({shape="default",parent,current_value,total_value,outerDiv_class="outerDiv",
    innerDiv_class="innerDiv",innerSpanId="filledNumber",percentSpanId="percent"}){
        this.parent = parent;
        this.outerDiv = document.createElement("div");
        this.innerDiv = document.createElement("div");
        this.current_value = current_value;
        this.total_value = total_value;
        this.innerSpanId = innerSpanId;
        this.percentSpanId = percentSpanId;
        this.outerDiv.style.display = "inline-block"
        this.innerDiv.style.display = "block"
        this.outerDiv.className = outerDiv_class;
        this.innerDiv.className = innerDiv_class;
        this.parent.appendChild(this.outerDiv);
        this.outerDiv.appendChild(this.innerDiv);
        this.updateValue();
        this.#text("add");
    }
    updateValue(update_value=0){
    this.current_value+=update_value;
    if(this.current_value > this.total_value)this.current_value=this.total_value;
    this.innerDiv.style.width = (this.current_value/this.total_value)*100+"%";
    this.colorUpdater();
    }
    colorUpdater(){
        let colorHue = ((parseFloat(this.innerDiv.style.width)* 255)/100).toFixed(2);
        this.innerDiv.style.background = `rgb(${colorHue},${255 - colorHue},0)`;
        // this.innerDiv.style.background = `rgb(${colorHue},0,0)`
    }
    #text(mode){
        if(mode == "update"){
            let span = document.querySelector("#"+this.percentSpanId);
            let innerSpan = document.querySelector("#"+this.innerSpanId);
            let percent = parseFloat(this.innerDiv.style.width).toFixed(2)+"%";
            let txt = `(${(TotalUsedKB/1024).toFixed(1)}/${(localStorageMax/1024).toFixed(1)} Mb)`;
            innerSpan.textContent = txt;
            span.textContent = percent;
        }
        else if(mode === "add"){
            let span = document.createElement("span");
            let innerSpan = document.createElement("span");
            let percent = parseFloat(this.innerDiv.style.width).toFixed(2) +"%"
            let txt = `(${(TotalUsedKB/1024).toFixed(1)}/${(localStorageMax/1024).toFixed(1)} Mb)`;
            innerSpan.textContent = txt;
            innerSpan.id = this.innerSpanId;
            this.outerDiv.insertBefore(innerSpan,this.innerDiv);
            
            span.id = this.percentSpanId;
            span.textContent = percent;
            this.parent.appendChild(span);
        }
        
    }
    
}
class HandleLocalStorage{
    constructor({key,value}){
        this.key = key;
        this.value = value;
        this.checkLS() ? this.value = this.getValue : this.updateItem();
    }
    updateItem(){
        window.localStorage.setItem(this.key,JSON.stringify(this.value));
    }
    addItem_Object(key,value){
        if(Array.isArray(this.getValue)) throw new Error(this.key+" is not an Object!")
        this.value[key.toLowerCase()] = value;
        this.updateItem();
    }
    addItem_Array(...element){
        let value = this.value;
        if(!Array.isArray(this.getValue)) throw new Error(this.key+" is not an Array!")
        element.forEach(function(i){
            typeof i == "string" ? value.push(i.toLowerCase()):value.push(i)
        });
        this.updateItem();
    }
    removeFromObject(...property){
        try{
            if(Array.isArray(this.getValue)) throw new Error(this.key+" is not an Object!")
            let value = this.value;
            property.forEach(function(i){
                delete value[property];
            });
            this.updateItem()
        }
        catch(err){
            console.warn(err);
        }
    }
    removeFromArray(...items){
        try{
            if(!Array.isArray(this.getValue)) throw new Error(this.key+" is not an Array!")
            let value = this.value;
            items.forEach(function(i){
                value.splice(value.indexOf(i),1);
            });
            this.updateItem();
        }
        catch(err){
            console.warn(err)
        }
    }
    checkLS(funcOnError,funcOnSuccess){
        if(JSON.parse(window.localStorage.getItem(this.key))){
            return true;
        }
        else{
            return false;
        }
    }
    get getValue(){
        return JSON.parse(window.localStorage.getItem(this.key)) || undefined;
    }
}
let toggleButton = document.querySelector(".nav-toggle");
toggleButton.addEventListener("click",function(e){
    let navlinks = document.getElementsByClassName("nav-links");
    for(let i=0;i<navlinks.length;i++){
        navlinks[i].classList.toggle("nav-active");
    }
})

let mainSymTags = [];
let secSymTags = [];
let rfTags = [];
let treatmentTags = [];
var sym_tagInput = new TagsInput({
    parent_class:"input_div_parent",
    parent_id:"symptom_taginput",
    input_class:"Input",
    input_id:"sym_input",
    tagsStorage:mainSymTags,
    maxChar: 35,
    tagsep:[",","."],
    ignoreFocusIds:["symptoms_autocomplete-items"],
    focusout: true,
    regExp:/[.,]/g
});
var sym2_tagInput = new TagsInput({
    parent_class:"input_div_parent",
    parent_id:"symptom2_taginput",
    input_class:"Input",
    input_id:"sym2_input",
    tagsStorage:secSymTags,
    maxChar: 35,
    tagsep:[",","."],
    regExp:/[.,]/g,
    focusout:true,
    ignoreFocusIds:["symptoms2_autocomplete-items"]
})
var rf_tagInput = new TagsInput({
    parent_class:"input_div_parent",
    parent_id:"rf_taginput",
    input_class:"Input",
    input_id:"rfInput",
    tagsStorage: rfTags,
    maxChar:20,
    tagsep:[",","."],
    focusout:true,
    regExp:/[.,]/g,
    ignoreFocusIds:["rf_autocomplete-items"]
});
var treatment_tagInput = new TagsInput({
    parent_class:"input_div_parent",
    parent_id:"treatment_taginput",
    input_class:"Input",
    tagsStorage: treatmentTags,
    maxChar:40,
    tagsep:[",","."],
    focusout:true,
    regExp:/[.,]/g,
    ignoreFocusIds:["trt_autocomplete-items"]
})
const mainSymKey = "Main symptoms";
const secSymKey = "Secondary symptoms";
const rfKey = "Risk factor";
const treatmentKey = "Treatments"
let diseasesInput = document.getElementsByClassName("Diseases_input")[0];
let symptomsInput = document.getElementById("sym_input");
let symptoms2Input = document.getElementById("sym2_input");
let rfInput = rf_tagInput.input;
let AddButton = document.getElementById("Add");
let ds_db = new HandleLocalStorage({key:"ds_db",value:{}});
let diseases = new HandleLocalStorage({key:"disease",value:[]});
let symptoms = new HandleLocalStorage({key:"symptoms",value:[]});
let treatment = new HandleLocalStorage({key:"treatment",value:[]})
let navDisease = document.querySelector("#nav-disease");
let navSymptoms = document.querySelector("#nav-symptoms");
let navRf = document.querySelector("#nav-risk-factor");
let navTreatment = document.getElementById("nav-treatment");
let rf = new HandleLocalStorage({key:"riskFactor",value:[]});
navRf.textContent = "Risk factor: "+rf.getValue.length;
navDisease.textContent = "Disease: "+diseases.getValue.length;
navSymptoms.textContent = "Symptoms: "+symptoms.getValue.length;
navTreatment.textContent = "Treatment: "+treatment.getValue.length;
let deleteButton = document.getElementById("dlt_disease")
const sortingDbs = ()=>{
    let keys = [];
    for(let key in ds_db.getValue){
        keys.push(key);
    }
    keys.sort()
    for(let key in ds_db){
        for(let i in keys){
            key = keys[i];
        }
    }
    diseases.value.sort();
    diseases.updateItem();
    symptoms.value.sort();
    symptoms.updateItem();
    rf.value.sort();
    rf.updateItem();
    treatment.value.sort();
    treatment.updateItem();
    ds_db.updateItem();
}
AddButton.addEventListener("click",function(e){
    sym_tagInput.addTag(symptomsInput.value);
    sym2_tagInput.addTag(symptoms2Input.value);
    rf_tagInput.addTag(rfInput.value);
    treatment_tagInput.addTag(treatment_tagInput.input.value);
    let mainSymTagsText = [];
    let secSymTagsText = [];
    let rfTagsText = [];
    let trtTagsText = [];
    for(let i=0;i<mainSymTags.length;i++){mainSymTagsText.push(mainSymTags[i].text.toLowerCase())}
    for(let i=0;i<secSymTags.length;i++){secSymTagsText.push(secSymTags[i].text.toLowerCase())}
    for(let i=0;i<rfTags.length;i++){rfTagsText.push(rfTags[i].text.toLowerCase())}
    for(let i=0;i<treatmentTags.length;i++){trtTagsText.push(treatmentTags[i].text.toLowerCase())}
    if(diseasesInput.value == "" || mainSymTagsText.length <= 0) {
        return
    }
    // else if(ds_db.getValue.hasOwnProperty(diseasesInput.value)) {
    //     return
    // }
    let obj = {};
    obj[mainSymKey] = mainSymTagsText;
    if(secSymTagsText.length > 0)  obj[secSymKey] = secSymTagsText;
    if(rfTagsText.length > 0)      obj[rfKey] = rfTagsText;
    if(trtTagsText.length > 0)      obj[treatmentKey] = trtTagsText;
    ds_db.addItem_Object(diseasesInput.value,obj);
    if(!diseases.getValue.includes(diseasesInput.value)){
        diseases.addItem_Array(diseasesInput.value);
    }
    for(let i=0;i<mainSymTagsText.length;i++){
        if(!symptoms.getValue.includes(mainSymTagsText[i])){
            symptoms.addItem_Array(mainSymTagsText[i]);
        }}
    for(let i=0;i<secSymTagsText.length;i++){
        if(!symptoms.getValue.includes(secSymTagsText[i])){
            symptoms.addItem_Array(secSymTagsText[i]);
        }}
    for(let i=0;i<rfTagsText.length;i++){
        if(!rf.getValue.includes(rfTagsText[i])){
            rf.addItem_Array(rfTagsText[i]);
        }}
        for(let i=0;i<trtTagsText.length;i++){
            if(!treatment.getValue.includes(trtTagsText[i])){
            treatment.addItem_Array(trtTagsText[i]);
        }}
    ds_db.updateItem();
    sortingDbs();
    location.reload();
});
var TotalUsedKB=0,x,x_bytes,x_kb;
var localStorageMax = (1024 * 10);
for(x in localStorage){
    if(!localStorage.hasOwnProperty(x))continue;
    x_bytes = (localStorage[x].length + x.length) * 2;
    x_kb = x_bytes/1024;
    if(!isNaN(x_bytes)){
        TotalUsedKB += x_kb;
    }
    console.log(x,"has",x_kb.toFixed(2),"KB")
}
let localStoragePB = new ProgressBar({
    parent:document.querySelector("#progressBar"),
    current_value:TotalUsedKB,
    total_value: localStorageMax
});
let acSym = autocomplete({input:symptomsInput,arr:symptoms.getValue,input_id:"symptoms"})
let acSym2 = autocomplete({input:symptoms2Input,arr:symptoms.getValue,input_id:"symtoms2"});
let acRf = autocomplete({input:rfInput,arr:rf.getValue,input_id:"rf"});

let acTrt = autocomplete({input:treatment_tagInput.input,arr:treatment.getValue,input_id:"trt"})
let acDisease = autocomplete({input:diseasesInput,arr:diseases.getValue,input_id:"disease",funcOnClicking:function(item){
    diseases.getValue.includes(diseasesInput.value)?deleteButton.disabled = false:
    deleteButton.disabled = true;
    
    sym_tagInput.removeAllTags();
    sym2_tagInput.removeAllTags();
    rf_tagInput.removeAllTags();
    treatment_tagInput.removeAllTags();
    for(let i=0;i<ds_db.getValue[item.children[1].value][mainSymKey].length;i++){
        sym_tagInput.addTag(ds_db.getValue[item.children[1].value][mainSymKey][i])
    }
    if(ds_db.getValue[item.children[1].value][secSymKey]){
    for(let i=0;i<ds_db.getValue[item.children[1].value][secSymKey].length;i++){
        sym2_tagInput.addTag(ds_db.getValue[item.children[1].value][secSymKey][i])
    }}
    if(ds_db.getValue[item.children[1].value][rfKey]){
    for(let i=0;i<ds_db.getValue[item.children[1].value][rfKey].length;i++){
        rf_tagInput.addTag(ds_db.getValue[item.children[1].value][rfKey][i])
    }};
    if(ds_db.getValue[item.children[1].value][treatmentKey]){
    for(let i=0;i<ds_db.getValue[item.children[1].value][treatmentKey].length;i++){
        treatment_tagInput.addTag(ds_db.getValue[item.children[1].value][treatmentKey][i])
    }}
}});
console.log("TotalUsedKB",TotalUsedKB,"KB")
function deleteAllLS(){
    let confirm = window.confirm("Wanna delete everything in your Local Storage?");
    if(!confirm)return
    window.localStorage.removeItem(diseases.key);
    window.localStorage.removeItem(symptoms.key);
    window.localStorage.removeItem(rf.key);
    window.localStorage.removeItem(ds_db.key);
    window.localStorage.removeItem(treatmentKey);
    location.reload();
}
function check(){
    if(ds_db.getValue[diseasesInput.value]){
        sym_tagInput.removeAllTags();
        sym2_tagInput.removeAllTags();
        rf_tagInput.removeAllTags();
        treatment_tagInput.removeAllTags();
        for(let i =0;i<ds_db.getValue[diseasesInput.value][mainSymKey].length;i++){
            sym_tagInput.addTag(ds_db.getValue[diseasesInput.value][mainSymKey][i])
        }
        if(ds_db.getValue[diseasesInput.value][secSymKey]){
        for(let i =0;i<ds_db.getValue[diseasesInput.value][secSymKey].length;i++){
            sym2_tagInput.addTag(ds_db.getValue[diseasesInput.value][secSymKey][i])
        }}
        if(ds_db.getValue[diseasesInput.value][rfKey]){
        for(let i =0;i<ds_db.getValue[diseasesInput.value][rfKey].length;i++){
            rf_tagInput.addTag(ds_db.getValue[diseasesInput.value][rfKey][i])
        }}
        if(ds_db.getValue[diseasesInput.value][treatmentKey]){
        for(let i=0;i<ds_db.getValue[diseasesInput.value][treatmentKey].length;i++){
            treatment_tagInput.addTag(ds_db.getValue[diseasesInput.value][treatmentKey][i])
        }}
    }
}
var deleted = false;
var container = document.querySelector("#table-container");
var deleteSomething = (event,item,key,isDisease)=>{
    var currentDbItem = JSON.parse(localStorage[key]);
    if(Array.isArray(currentDbItem) && typeof currentDbItem == "object"){
        if(isDisease){
            let confirm = window.confirm("you sure you wanna delete the '"+item+"' disease?");
            if(!confirm){return}
        }
        currentDbItem.splice(currentDbItem.indexOf(item),1);
        if(isDisease){
            let dsDb = JSON.parse(localStorage['ds_db']);
            delete dsDb[item];
            localStorage['ds_db'] = JSON.stringify(dsDb);
        }
    }
    else if(!Array.isArray(currentDbItem) & typeof currentDbItem == "object"){
        delete currentDbItem[key];
    }
    localStorage[key] = JSON.stringify(currentDbItem);
    event.currentTarget.parentNode.remove();
    deleted = true;
}
function createTable(target){
    container.style.display = "block";
    var table = document.createElement("table");
    var tableHead = document.createElement("thead");
    var tableBody = document.createElement("tbody");
    var Str = "";
    var targetStorage,
        isDisease;
    if(target=="symptoms"){targetStorage=symptoms;}else if(target=="diseases"){targetStorage=diseases;isDisease=true}
    else if(target=="risk factors"){targetStorage=rf}else if(target=="treatments"){targetStorage=treatment}
    targetStorage.getValue.forEach(function(i){Str += `<tr><td  class='row-in-body'>${i}
    <span class='closeTable' onclick='deleteSomething(event,"${i}","${targetStorage.key}",${isDisease})'>&times;</span></td></tr>`})
    tableHead.innerHTML += `<tr><th>${target.capitalize()}
                            <span class="closeTable" onclick='for(let i=0;i<container.children.length;i++){
                                container.children[i].remove();
                            }
                            container.style.display = "none";if(deleted){location.reload();}'>
                            &times</span></th></tr>`
    tableBody.innerHTML += Str;
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    container.appendChild(table);
    }
    window.onclick=function(event){
        if(event.target == container){
            for(let i=0;i<container.children.length;i++){
                container.children[i].remove();
            }
            container.style.display = "none";
            if(deleted){location.reload();}
        }
    }

function copy_dsdb(){
    let tempInput = document.createElement("textarea");
    document.body.appendChild(tempInput);
    tempInput.textContent = JSON.stringify(ds_db.getValue);
    tempInput.select();
    tempInput.setSelectionRange(0,tempInput.textContent.length);
    document.execCommand("copy");
    tempInput.remove();
}
function deleteDisease(e,span){
    e.preventDefault();
        if(span){
                let confirm_ = confirm(`Wanna delete "${e.target.parentNode.children[1].value}" disease?`)
                if(confirm_){
                    diseases.removeFromArray(e.target.parentElement.children[1].value);
                    ds_db.removeFromObject(e.target.parentNode.children[1].value);
                    location.reload();
                }else{return}
        }
        else{
            let confirm_ = confirm(`Wanna delete "${diseasesInput.value}" disease?`)
            if(confirm_){
                diseases.removeFromArray(diseasesInput.value);
                ds_db.removeFromObject(diseasesInput.value);
                location.reload();
            }else{return}
        }
        db_textarea.textContent = JSON.stringify(ds_db.getValue);
        acdisease({array:diseases.getValue});
        diseasesInput.value = "";
}
deleteButton.addEventListener("click",function(e){deleteDisease(e,false)});
diseasesInput.addEventListener("input",function(e){
    diseases.getValue.includes(diseasesInput.value)?deleteButton.disabled = false:
    deleteButton.disabled = true;
    var accontainer = document.getElementById("disease_autocomplete-items"); 
    if(!accontainer){
        return
    }
    for(let i=0;i<accontainer.children.length;i++){
        var close = document.createElement("span");
        close.innerHTML = "&times;"
        close.style.float = "right";
        close.className = "dlt_disease_span"
        close.addEventListener("click",function(e){deleteDisease(e,true)});
        accontainer.children[i].appendChild(close);
    }

})