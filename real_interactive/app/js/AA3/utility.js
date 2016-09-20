var AA3 = _.extend({}, AA3, {
	utility: {
		formatType: function (num, type, useShort) {
			var typeSymbol = {
				"percent": "%",
				"hours": " hours",
				"days" : " days",
				"dollars": "$",
				"weeks": " weeks"
			}

			var shortTypeSymbol = {
				"hours": " hr",
				"days": " d",
				"weeks": " wk"
			}

			var symbol = typeSymbol[type];

			if (useShort && shortTypeSymbol[type]) {
				symbol = shortTypeSymbol[type];
			}

			var text = num + symbol

			if ( type === "dollars" ) {
				text = symbol + num;
			}

			return text;
		}
	}
});