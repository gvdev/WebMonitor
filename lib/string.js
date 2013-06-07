/**
 * Custom functions for working with string.
 */

module.exports = {

	/**
	 * Change a specific character given the position that is within the string.
	 *
	 * @param str	Is the string in which the replacement must be made.
	 * @param index	Is the index of the character to be replaced.
	 * @param chr	Is the new character that should be inserted.
	 */
	set_char_at	: function (str,index,chr) {
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

};