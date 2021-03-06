let autocomplete = (function () {
	let _inp = null;
	let _arr = [];
	let _currentFocus;

	let _setAutocomplete = function(inp, arr) {
		//autoComplete 배열
		_arr = arr;
		if(_inp === inp) {
			return;
		}
		_removeListener();

		_inp = inp;
		_inp.addEventListener("input", inputEvent);
		_inp.addEventListener("keydown", keydownEvent);
	}

	let inputEvent = function(e) {
		console.log('occur inputEvent');
		var a, b, i, val = this.value;
		closeAllLists();

		if(!val) {
			return false;
		}

		_currentFoucs = -1;

		a = document.createElement("div");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");

		this.parentNode.appendChild(a);
		console.log(this.parentNode);

		for(i=0; i<_arr.length; i++) {
			if(_arr[i].includes(val)) {
				b = document.createElement("div");
				startIndex = _arr[i].indexOf(val);
				b.innerHTML = _arr[i].substr(0, startIndex);
				b.innerHTML += "<b>" + _arr[i].substr(startIndex, val.length) + "</b>";
				b.innerHTML += _arr[i].substr(startIndex + val.length);
				if(_arr[i].includes("'")) {
					b.innerHTML += "<input type='hidden' value=\"" + _arr[i] + "\">";
				} else {
					b.innerHTML += "<input type='hidden' value=\'" + _arr[i] + "\''>";
				}
				b.addEventListener("click", function(e) {
					_inp.value = this.getElementsByTagName("input")[0].value;
					onSearch();
					closeAllLists();
				})
				a.appendChild(b);
			}
		}
	}

	let keydownEvent = function(e) {
		console.log('occur keyEvent');
		console.log(e.keyCode);
		var x = document.getElementById(this.id + "autocomplete-list");
		console.log(x);
		if(x) {
			x = x.getElementsByTagName("div");
			console.log(x);
		}
		if (e.keyCode == 40) {
			_currentFoucs++;
			addActive(x);
		} else if(e.keyCode == 38) {
			_currentFoucs--;
			addActive(x);
		} else if(e.keyCode == 13) {
			e.preventDefault();
			if(_currentFoucs > -1) {
				if(x)
					x[_currentFoucs].click();
			}
		}
	}

	let addActive = function(x) {
		if(!x)
			return false;
		removeActive(x);
		if(_currentFoucs >= x.length)
			_currentFoucs = 0;
		if(_currentFoucs < 0)
			_currentFoucs = x.length - 1;
		x[_currentFoucs].classList.add("autocomplete-active");
	}

	let removeActive = function(x) {
		for(var i=0; i<x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	let closeAllLists = function(element) {
		var x = document.getElementsByClassName("autocomplete-items");
		for(var i=0; i<x.length; i++) {
			if(element != x[i] && element != _inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}

	let _removeListener = function() {
		if(_inp !== null) {
			_inp.removeEventListener("input", inputEvent, false);
			_inp.removeEventListener("keydown", keydownEvent, false);
		}
	}
	return {
		setAutocomplete: function(inp, arr) {
			_setAutocomplete(inp, arr);
		},
	}
})();