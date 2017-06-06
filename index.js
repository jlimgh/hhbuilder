var household = [];
var age;
var smoker;
var relationship;
var form;
var formNodes;
var count = 1;
var ageApproved = false;
var relApproved = false;


init();

function init() {
	addRequired();
	validateForm();
	addMember();
}

function addMember() {
	var addButton = document.querySelector('button.add');
	var ageError = document.querySelectorAll(".error")
	var qContainer;
	var addFormLocation;

	addButton.addEventListener("click", function() {
		validateAge();
		addRequired();
		validateRelationship();

		if (ageApproved && relApproved) {
			formNodes = document.querySelectorAll("form")[0];
			//find/create placement location for questions container
			addFormLocation = formNodes.children[formNodes.children.length - 2];
			//new questions div container
			qContainer = document.createElement("div");
			qContainer.className = "questions";
			qContainer.className += " q-block-" + count;

			//insert questions container
			formNodes.insertBefore(qContainer, addFormLocation);
			//add new questions to new container
			addNewQuestions("div", "age", '<br/><label> Age <input type="text" name="age" required> </label>');
			addNewQuestions("div", "relationship", '<label>Relationship <select name="rel" required> <option value="">---</option><option value="self">Self</option><option value="spouse">Spouse</option><option value="child">Child</option><option value="parent">Parent</option><option value="grandparent">Grandparent</option><option value="other">Other</option></select></label>')
			addNewQuestions("div", "smoker", '<label>Smoker?<input type="checkbox" name="smoker"></label>');
			//add count to distinguish questions container
			count += 1;
			createRemoveButton();
		}
	})
}

function validateForm() {
	form = document.querySelector("form");
    form.addEventListener("submit", function(e){
		validateAge();
		validateRelationship();

		if (ageApproved && relApproved) {
			submitMember();
			serializeData(household);
		}

	    e.preventDefault();
	});
}


function validateAge() {
	var ageInputs = document.querySelectorAll('[name="age"]');
	var message;
	//add age error messages
	for (var i = 0; i < ageInputs.length; i++) {
		if (isNaN(ageInputs[i].value) || ageInputs[i].value < 1 || ageInputs[i].value === "") {
			message = "Please enter a valid age";
			ageApproved = false;

			if (ageInputs[i].parentNode.nextElementSibling == null) {
				ageInputs[i].parentNode.parentNode.appendChild(createErrorMsg(message));
			}
		} else if (Number(ageInputs[i].value) > 200) {
			message = "Please enter a reasonable age less than 200";
			ageApproved = false;

			if (ageInputs[i].parentNode.nextElementSibling == null) {
				ageInputs[i].parentNode.parentNode.appendChild(createErrorMsg(message));
			}
		} else {
			ageApproved = true;
		}
		//remove error message on input click
		ageInputs[i].addEventListener("focus", function() {
				if (this.parentNode.nextElementSibling) {
					this.parentNode.nextElementSibling.remove();
				}
		});	
	}
}

function createErrorMsg(message) {
	var errorTag = document.createElement("span");
	var textnode = document.createTextNode(message);
	errorTag.className = "error";
	errorTag.style.color = "red";
	errorTag.appendChild(textnode);

	return errorTag;
}

function validateRelationship() {
	var relInputs = document.querySelectorAll('[name="rel"]');
	relApproved = true;

	for (var i = 0; i < relInputs.length; i++) {
		if (relInputs[i].value === "") {
			relApproved = false;
		}
	} 
	return relApproved;
}

function addRequired() {
	var nameInputs = document.querySelectorAll('[name="age"]');
	var relaInputs = document.querySelectorAll('[name="rel"]');
	var setAgeRequired = nameInputs[nameInputs.length - 1].required = true;
	var setRelationshipRequired = relaInputs[relaInputs.length - 1].required = true;
}

function submitMember() {
	//Store values data for submission
	totalAges();
	totalRelationships();
	totalSmokers();
}

//create new question divs and classes
function addNewQuestions(tagName, className, innerHTML) {
	var newEl = document.createElement(tagName);
	newEl.className = className + "-" + count;
	document.querySelector(".q-block-" + count).appendChild(newEl);
	document.querySelector("div." + className + "-" + count).insertAdjacentHTML("beforeend", innerHTML);
}

function totalAges() {
	var allAges = document.querySelectorAll('[name="age"]');
	//loop through total # of ages and object storage into array
	for (var i = 0; i < allAges.length; i++) {
		household[i] = ({age: allAges[i].value});
	}
}

function totalRelationships() {
	var allRelationships = document.querySelectorAll('option:checked');
	//add into data into objects
	for (var i = 0; i < allRelationships.length; i++) {
		household[i]["relationship"] = allRelationships[i].value;
	}
}

function totalSmokers() {
	var allSmokers = document.querySelectorAll('[name="smoker"]');
	var smoker;
	for (var i = 0; i < allSmokers.length; i++) {
		smoker = allSmokers[i].checked ? "yes" : "no";
		household[i]["smoker"] = smoker;
	}
}

function createRemoveButton() {
	var parentNode = document.querySelectorAll("form")[0];
	var rLocation = parentNode.children[parentNode.children.length - 2];
	var rButton = document.createElement("button");
	var rTitle = document.createTextNode("remove");
	var rDiv = document.createElement("div");
	rDiv.className = "remove";
	rButton.className = "remove";
	rButton.appendChild(rTitle);
	rDiv.appendChild(rButton);

	parentNode.insertBefore(rDiv, rLocation);

	rButton.addEventListener("click", function() {
		this.parentNode.previousElementSibling.remove();
		this.parentNode.remove();
	});
}

function serializeData(data) {
	var jsonLocation = document.querySelector(".debug");
	jsonLocation.innerHTML = JSON.stringify(data, undefined, 2);
	jsonLocation.style.display = "inline-block";
	jsonLocation.style.wordWrap = "break-word";
}
