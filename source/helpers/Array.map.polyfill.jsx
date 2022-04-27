/**
 * Array.map() polyfill
 */

if (!Array.prototype.map) {
	Array.prototype.map = function(callback) {
	var arr = [] // since, we need to return an array
	for (var i = 0; i < this.length; i++) {
		arr.push(callback(this[i], i, this)) // pushing currentValue, index, array
	}
	return arr // finally returning the array
	}
}