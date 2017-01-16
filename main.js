var word_entry_container;
var word_results_container;
var word_results_textarea;
var regex;
var synonym_set;

function initialize() {
	word_entry_container = $("#word-entry-container");
	word_results_container = $("#word-results-container");
	word_results_textarea = $("<textarea>", {	"id": "#word-results-container",
												"rows": "10",
												"class": "form-control",
												"placeholder": "Enter a word to get started!",
												"readonly": "readonly"});
	regex = new RegExp("^[A-Za-z]*$");
	synonym_set = new Object();
	word_results_container.append(word_results_textarea);
	addNewInput();
}

var input_index = 0;
function addNewInput() {
	var input = $("<input>", {"id": "input-" + input_index, "type": "text", "class": "form-control"});

	input.keyup(function(e) {
		if(e.keyCode == 13) {
			var text = $.trim($(this).val()).toLowerCase();
			$(this).val(text);

			if(text.length < 2 || !text.match(regex)) {
				$(this).select();
				return; 
			}

			fetchSynonyms(text);
			addNewInput();
		}
	});

	word_entry_container.append(input);
	input.focus();
}

function fetchSynonyms(word) {
	$.get("//words.bighugelabs.com/api/2/ced3808c844ba0603e471983d7c453b8/" + word + "/json", function(data) {
		data = JSON.parse(data);
		for(var part in data) {
			var set = data[part];

			ret_synonyms = (set["syn"] ? set["syn"] : []).concat(set["sim"] ? set["sim"] : [], set["rel"] ? set["rel"] : []);
			var unique = new Object();
			ret_synonyms.map(function(word) {
				if(!(word in unique))
					unique[word] = 1;
				else
					unique[word]++;
			});
			Object.keys(unique).map(function(word) {
				if(!(word in synonym_set))
					synonym_set[word] = 1;
				else
					synonym_set[word]++;
			});
		}
		sortAndDisplay();
	});
}

function sortAndDisplay() {
	var sorted = Object.keys(synonym_set);
	sorted.sort(function(a, b) {
		return synonym_set[b] - synonym_set[a];
	});

	sorted = sorted.slice(0, 10);

	var str = "";
	sorted.map(function(word) {
		str += synonym_set[word] + ": " + word + "\n";
	});

	word_results_textarea.val(str);
}

initialize();