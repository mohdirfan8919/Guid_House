let facetSettings = document.getElementById("sb_facet_settings");
window.autoSuggestObject = {};
let autoSuggestSettings = document.getElementById("sb_autosuggest");
if(autoSuggestSettings){
  window.autoSuggestObject.showAutoSuggest = autoSuggestSettings.value;
}
window.inputFacets = [];
if (facetSettings) {
    let requiredFacetsFields = Object.keys(facetSettings.dataset);
    let facetFilters = [];
    let filterDisplay = {};
    for (let i = 0, len = requiredFacetsFields.length; i < len; i++) {
        let facetFilter = {};
        let fieldValue = facetSettings.dataset[requiredFacetsFields[i]];
        let field = requiredFacetsFields[i];
        let fieldValuesArray = fieldValue.split("|");
        facetFilter["field"] = field;
        if (fieldValuesArray[0]) {
            facetFilter["display"] = fieldValuesArray[0];
            filterDisplay[field] = fieldValuesArray[0];
        } else {
            facetFilter["display"] = "";
            filterDisplay[field] = "";
        }
        if (fieldValuesArray[1]) {
            if (parseInt(fieldValuesArray[1]) > 0) {
                facetFilter["size"] = fieldValuesArray[1];
            } else {
                facetFilter["dateRange"] = [{
                        "name": "Last 24 hours",
                        "calendar": "days",
                        "value": "1"
                    },
                    {
                        "name": "Past Week",
                        "calendar": "days",
                        "value": "7"
                    },
                    {
                        "name": "Past Month",
                        "calendar": "months",
                        "value": "1"
                    },
                    {
                        "name": "Past Year",
                        "calendar": "years",
                        "value": "1"
                    }
                ];
            }
        }
        facetFilters.push(facetFilter);
    }
    window.inputFacets = facetFilters;
}

window.facets = {
    "facets": [{
            "field": "colname",
            "display": "Collection Name",
            "size": "100"
        },
        {
            "field": "contenttype",
            "display": "File Type",
            "size": "100"
        },
        {
            "field": "keywords",
            "display": "keywords",
            "size": "100"
        },
        {
            "field": "lastmodified",
            "display": "Last Modified",
            "dateRange": [{
                    "name": "Last 24 hours",
                    "calendar": "days",
                    "value": "1"
                },
                {
                    "name": "Past Week",
                    "calendar": "days",
                    "value": "7"
                },
                {
                    "name": "Past Month",
                    "calendar": "months",
                    "value": "1"
                },
                {
                    "name": "Past Year",
                    "calendar": "years",
                    "value": "1"
                }
            ]
        }
    ],
    "customDateSettings": {
        "customDateField": "lastmodified",
        "customDateEnable": true,
        "customDateDisplayText": "Filter By Date"
    },
    "collection": [39],
    "sortBtns": [{
            "field": "date",
            "display": "Sort By Date"
        },
        {
            "field": "relevance",
            "display": "Sort By Relevance"
        },
        {
            "field": "mrank",
            "display": "Sort By Relevance with MRank"
        }
    ],
    "facetFiltersOrder": [
        "colname", "contenttype", "keywords"
    ],
    "facetsFiltersDisplay": true,
    "facetFiltersType": "AND",
    "sortDir": "desc",
    "matchAny": "off",
    "pageSize": "10",
    "showAutoSuggest": true,
    "autoSuggestLimit": "5",
    "suggestSearch": true,
    "smartAutoSuggestSettings": {
        "enable": true,
        "pluginDomain": "https://smartsuggest.searchblox.com",
        "cnameAutoSuggest": "guidehouse",
        "limit": "5",
        "langForSuggest": "en"
    },
    "smartFAQsSettings": {
        "enable": true,
        "pluginDomain": "https://44.204.168.9:8443",
        "cnameAutoSuggest": "FAQs_bluecross",
        "limit": "5",
        "langForSuggest": "en"
    },
    "showTrendingData": true,
	"trendingDataSettings": {
		"cname":"Guidehouse_trending",
		"limit": "5"
	},
    "defaultCname": "",
    "adsDisplay": true,
    "featuredResultsCount": "3",
    "urlDisplay": false,
    "relatedQuery": false,
    "relatedQueryFields": {
        "apikey": "",
        "field": "content",
        "operator": "and",
        "limit": "5",
        "terms": "10",
        "type": "phrase",
        "col": "",
    },
    "topQuery": true,
    "topQueryFields": {
        "apikey": "",
        "col": "",
        "limit": "5",
    },
    "dataToBeDisplayed": {
        "1": {
            "title": "Title",
            "description": "Description"
        },
        "other": {
            "description": "Description"
        },
        "displayAll": true
    },
    "tuneTemplate": "WEB",
    "voiceSearch": false,
    "voiceSearchAPI": "",
    "debug": false,
    "defaultType": "AND",
    "apikey": "",
    "autologout": true,
    "pluginDomain": "https://ui.searchblox.com:8443"
};
