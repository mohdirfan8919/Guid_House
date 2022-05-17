import * as defaults from './Defaults';
import * as qs from 'query-string';
import axios from 'axios';
import * as moment from 'moment';
import { history } from '../low_level_components/custom_history';
import _ from 'lodash';

// export var urlParameters = {};
/*
| getSBResponse function checks the url parameters and
- use same paarmaeters to send request to searchblox server
| and returns the 'PROMISE'
- 'AXIOS' library is used for AJAX requests
*/
export const getTrendingData = () => {
  let urlParams = Object.assign({}, qs.parse(window.location.search));
  let cname = defaults.trendingDataSettings.cname;

  let pluginDomain = defaults.pluginDomain;
  let pd = document.getElementById("sb_plugin_domain");
  if (pd !== undefined && pd !== null && pd !== "") {
    pluginDomain = pd.value;
  }
  return axios.get(pluginDomain + "/rest/v2/api/search?query=*&xsl=json&sort=alpha&sortdir=asc&pagesize=" + defaults.trendingDataSettings.limit + "&cname=" + cname, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("searchToken")
      }
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return error;
      }
    });
};


export const getSBResponse = (parameters) => {
  if(Object.keys(parameters).length !== 0){
    // parameters.xsl='json';
    parameters.facet=true;
    parameters.query = encodeURIComponent(parameters.query);
    // let pluginDomain = defaults.pluginDomain;
    let faqPluginDomain = defaults.smartFAQsSettings.pluginDomain;
    let pluginDomain = parameters.isFaq ? faqPluginDomain : defaults.pluginDomain;
    let pd = document.getElementById("sb_plugin_domain");
    if(pd !== undefined && pd !== null && pd !== ""){
      pluginDomain = pd.value;
    }
    let keyRegex = /^f\.[A-z]+\.filter$/g;
    let dateRegex = /^\[[0-9]{4}/g;
    // Object.keys(parameters).map(key => {
    //   if(keyRegex.test(key) && !dateRegex.test(parameters[key])){
    //     if(parameters[key].constructor === Array){
    //         parameters[key] = parameters[key].map(val => {
    //           return encodeURIComponent(val);
    //         });
    //       }else{
    //         parameters[key] = encodeURIComponent(parameters[key]);
    //       }
    //   }
    // });
    if(localStorage.getItem("pcode") !== null && localStorage.getItem("pcode") !== "" && localStorage.getItem("pcode") !== undefined) {
      parameters.pcode = localStorage.getItem("pcode");
    }

    return axios.get(pluginDomain +"/rest/v2/api/search?" + qs.stringify(parameters),{headers:{"Authorization": "Bearer " + localStorage.getItem("searchToken")}})
    .then((response)=>{
      let uidArray = [];
      if(response.data && response.data.ads && response.data.ads.length > 0) {
        let adsResponse = response.data.ads;
          for(let i = 0, len = adsResponse.length; i< len; i++){
            uidArray.push(adsResponse[i].uid);
          }
          let adsObj = {
            uids: uidArray
          };
          axios.post(pluginDomain + "/ui/v1/featured-result/display-count",adsObj);
      }
      return response;
    })
    .catch((error) => {
      if(error.response && error.response.data) {
        return error.response.data;
      }
      else {
        return error;
      }
    });
  }
};

export const getAutoSuggest = (query) => {
  let autosuggestId = "";
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let colArray = [];
  let colString = "";
  if(defaults.defaultCollections.length > 0){
    colArray = defaults.defaultCollections.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === Array) {
    colArray = urlParameters.col.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === String) {
    colArray.push(urlParameters.col);
  }
  if(colArray !== null && colArray !== undefined && colArray !== "" && colArray.length > 0) {
    colArray.map((value,key) => {
      colString = colString + "&col=" + value;
    });
  }
  if(window.smartSuggest.SmartSuggest.length > 0) {
    let smartArray = [];
    for(let i=0;i<window.smartSuggest.SmartSuggest.length;i++) {
      if(window.smartSuggest.SmartSuggest[i].collectionID === parseInt(urlParameters.col)) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
      else if(window.smartSuggest.SmartSuggest[i].collection === urlParameters.cname) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
    }
  }
  if(defaults.smartAutoSuggestSettings.enable !== "" && defaults.smartAutoSuggestSettings.enable && window.smartSuggest.SmartSuggest.length === 0){
    return axios.get(defaults.smartAutoSuggestSettings.pluginDomain+"/SmartSuggest?q=" + query+"&cname="+defaults.smartAutoSuggestSettings.cnameAutoSuggest+"&limit="+defaults.smartAutoSuggestSettings.limit+"&lang="+defaults.smartAutoSuggestSettings.langForSuggest)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
  else {
    return axios.get(defaults.pluginDomain + "/rest/v2/api/autocomplete?limit="+defaults.autoSuggestLimit+"&query=" + query+colString)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getSuggestClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    if(parameters.query.indexOf('"') >= 0) {
      parameters.query = parameters.query.replace(/['"]+/g, '');
    }
    // let colArray = [];
    // let colString = "";
    // if(defaults.defaultCollections.length > 0){
    //   colArray = defaults.defaultCollections.slice();
    // }
    // else if(urlParameters.col && urlParameters.col.constructor === Array) {
    //   colArray = urlParameters.col.slice();
    // }
    // else if(urlParameters.col && urlParameters.col.constructor === String) {
    //   colArray.push(urlParameters.col);
    // }
    // if(colArray !== null && colArray !== undefined && colArray !== "" && colArray.length > 0) {
    //   colArray.map((value,key) => {
    //     colString = colString + "&col=" + value;
    //   });
    // }
    let clickObj = {
        query: decodeURIComponent(parameters.query),
        suggestion:parameters.suggest
    };
    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/suggest",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getFeaturedResultClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;

    let clickObj = {
        uid: parameters.uid,
        query: parameters.query,
    };
      return axios.post(defaults.pluginDomain + "/ui/v1/analytics/fr",clickObj)
      .then((response)=>{
        return response;
      })
      .catch((error)=>{
        return error;
      });
    }
};

export const getInitialUrlParameters = (query) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let col = document.getElementById("sb_col");
  let cname = document.getElementById("sb_cname");
  let filter = document.getElementById("sb_filter");
  let sb_query = document.getElementById("sb_query");
  let sb_page = document.getElementById("sb_page");
  let sb_sort = document.getElementById("sb_sort");
  let sb_default = document.getElementById("sb_default");
  let sb_tunetemplate = document.getElementById("sb_tunetemplate");
  let sb_autosuggest = document.getElementById("sb_autosuggest");
  // let sb_security = document.getElementById("sb_security");

  // Function to parse the facets in facet.json
  let parseFacetsForSearch = ()=>{ // ----------parseFacetsForSearch start ----------------------
    let facets = defaults.facets;
    let advancedFilters = (defaults.advancedFilters)?defaults.advancedFilters:{};
    if(facets.length >= 1){
      urlParameters['facet.field'] = [];
      for(let i in facets){
        urlParameters['facet.field'].push(facets[i].field);
        if(facets[i].dateRange === undefined){
          urlParameters[`f.${facets[i].field}.size`] = facets[i].size;
        }else{
          urlParameters[`f.${facets[i].field}.range`] = [];
          urlParameters[`f.${facets[i].field}.range`] = facets[i].dateRange.map((range)=>{
            return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
          });
        }
      }
    }
    if(advancedFilters.select){
      for(let i in advancedFilters.select){
        if(urlParameters['facet.field'].indexOf(advancedFilters.select[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.select[i].field);
          urlParameters[`f.${advancedFilters.select[i].field}.size`] = advancedFilters.select[i].size;
        }
      }
    }
    if(advancedFilters.input){
      for(let i in advancedFilters.input){
        if(urlParameters['facet.field'].indexOf(advancedFilters.input[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.input[i].field);
          urlParameters[`f.${advancedFilters.input[i].field}.size`] = advancedFilters.input[i].size;
        }
      }
    }
    if(advancedFilters.date){
      for(let i in advancedFilters.date){
        if(urlParameters['facet.field'].indexOf(advancedFilters.date[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.date[i].field);
        }
      }
    }
  }; //------------------------parseFacetsForSearch end --------------------

  // if(urlParameters.mlt_id)urlParameters = {};
  if(Object.keys(urlParameters).length === 0){
    // CONDITION FOR DEFAULT FACETS ON INITIAL PAGE LOAD
    parseFacetsForSearch();
    (query === undefined || query === '' || query === null)?(urlParameters.query = '*'):(urlParameters.query = query);
    urlParameters.page = 1;
    // urlParameters.pagesize = defaults.pageSize;
    if(defaults.defaultCname !== "") {
      urlParameters.cname = defaults.defaultCname;
    }
    urlParameters.adsDisplay = defaults.adsDisplay;
    // urlParameters.adsCount = defaults.featuredResultsCount;
    urlParameters.sortdir = "asc";
    urlParameters.sort = "mrank";
    urlParameters.sortdir1 = defaults.sortDirection;
    urlParameters.sort1 = defaults.sortButtons[2].field;
    urlParameters.relatedQuery = defaults.relatedQuery;
    // urlParameters.security = defaults.security;
    urlParameters.topQuery = defaults.topQuery;
    urlParameters.tunetemplate = defaults.tuneTemplate;
    urlParameters.autoSuggestDisplay = defaults.showAutoSuggest;
    urlParameters.col = defaults.defaultCollections.slice();
    if(defaults.defaultType !== ""){
      urlParameters.default = defaults.defaultType;
    }
    if(localStorage.getItem("searchToken")===null || localStorage.getItem("searchToken")===undefined || localStorage.getItem("searchToken")===""){
      urlParameters.public = true;
    }
    else if(localStorage.getItem("searchToken")!==null && localStorage.getItem("searchToken")!==undefined && localStorage.getItem("searchToken")!==""){
      if(urlParameters.public){
        delete urlParameters.public;
      }
    }
  }else{
    if(sb_query !== undefined && sb_query !== null && sb_query !== ""){
      urlParameters.query = sb_query.value;
    }
    else {
      urlParameters.query = query;

    }
  }
  urlParameters.query = encodeURIComponent(urlParameters.query);
  if(cname !== undefined && cname !== null && cname !== "" && cname.value !== ""){
    urlParameters.cname = [];
    let cnames = cname.value.split(",");
    for(let i = 0, len = cnames.length; i< len; i++){
      urlParameters.cname.push(cnames[i].trim());
    }
  }
  if(col !== undefined && col !== null && col !== "" && col.value !== ""){
    urlParameters.col = [];
    let cols = col.value.split(",");
    for(let i = 0, len = cols.length; i< len; i++){
      urlParameters.col.push(cols[i].trim());
    }
  }
  if(filter !== undefined && filter !== null && filter !== ""){
    urlParameters.filter = filter.value;
  }
  if(sb_page !== undefined && sb_page !== null && sb_page !== ""){
    let pageValues = sb_page.value.split("|");
    urlParameters.page = pageValues[0];
    urlParameters.pagesize = pageValues[1];
  }
  if(sb_default !== undefined && sb_default !== null && sb_default !== ""){
    urlParameters.default = sb_default.value;
  }
  if(sb_tunetemplate !== undefined && sb_tunetemplate !== null && sb_tunetemplate !== ""){
    if(sb_tunetemplate.value.trim()!==""){
      urlParameters.tunetemplate = sb_tunetemplate.value;
    }
  }
  if(sb_autosuggest  !== undefined && sb_autosuggest !== null && sb_autosuggest !== ""){
    urlParameters.autoSuggestDisplay = sb_autosuggest.value;
  }
  // if(sb_security  !== undefined && sb_security !== null && sb_security !== ""){
  //   urlParameters.autoSuggestDisplay = sb_security.value;
  // }
  if(sb_sort !== undefined && sb_sort !== null && sb_sort !== ""){
    let sortValues = sb_sort.value.split("|");
    urlParameters.sort1 = sortValues[0];
    urlParameters.sortdir1 = sortValues[1];
  }
  return urlParameters;
};

export const clearAllFilters = (urlParameters) => {
    let facetFields = [];
    facetFields = Object.assign([], defaults.facets);
    let customDateField = "";
    customDateField = defaults.customDateSettings.customDateField;
    delete urlParameters['facet.field'];
    urlParameters['facet.field'] = [];
    for(let i=0, len = facetFields.length; i<len; i++){
      urlParameters['facet.field'].push(facetFields[i].field);
      if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
        delete urlParameters[`f.${facetFields[i]['field']}.filter`];
      }
      if(urlParameters[`f.${customDateField}.filter`]){
        delete urlParameters[`f.${customDateField}.filter`];
        delete urlParameters[`f.${customDateField}.range`];
      }
      if(facetFields[i].dateRange){
        urlParameters[`f.${facetFields[i].field}.range`] = [];
        urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
          return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
        });
      }
    }

    if(urlParameters.customDate){
      delete urlParameters.customDate;
    }
    urlParameters.page=1;
    return urlParameters;
};

export const getDocumentClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;
    parameters.title = new DOMParser().parseFromString(parameters.title, 'text/html').body.textContent;
    if(localStorage.getItem("pcode") !== null && localStorage.getItem("pcode") !== "" && localStorage.getItem("pcode") !== undefined) {
      parameters.pcode = localStorage.getItem("pcode");
    }
    if(urlParameters.pagesize){
      parameters.pagesize = urlParameters.pagesize;
    }
    else{
      parameters.pagesize = 10;
    }
    let clickObj = {
        collection: parameters.col,
        query: parameters.query,
        title:parameters.title,
        uid:parameters.uid,
        url:parameters.url,
        pcode:parameters.pcode,
        pos:parameters.no,
        page:urlParameters.page,
        pageSize:parameters.pagesize
    };
    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/click",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getEmailViewer = (parameters) => {
  if(Object.keys(parameters).length !== 0){
    return axios.get(defaults.pluginDomain+"/ui/v1/email/view?url="+parameters.url+"&col="+parameters.col)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getResults = (urlParameters) => {
  if(urlParameters.query !== "") {
  let keyRegex = /^f\.[A-z]+\.filter$/g;
  let dateRegex = /^\[[0-9]{4}/g;
  Object.keys(urlParameters).map(key => {
    if(keyRegex.test(key) && !dateRegex.test(urlParameters[key])){
      if(urlParameters[key].constructor === Array){
          urlParameters[key] = urlParameters[key].map(val => {
            return encodeURIComponent(decodeURIComponent(decodeURIComponent(val)));
          });
        }else{
          urlParameters[key] = encodeURIComponent(decodeURIComponent(decodeURIComponent(urlParameters[key])));
        }
    }
  });
  let paramsOrder = ['query', 'page', 'pagesize', 'sort', 'sortdir','language'];
  let firstString = {}, secondString = {};
  for(let param in urlParameters){
    (paramsOrder.indexOf(param) > -1)?(firstString[param] = urlParameters[param]):(secondString[param] = urlParameters[param]);
  }
  let params = qs.stringify(firstString, {sort: (m, n)=>paramsOrder.indexOf(m) >= paramsOrder.indexOf(n)}) + '&' + qs.stringify(secondString);
  let decodedPramsString = decodeURIComponent(params);
   history.push(`?${decodedPramsString}`);
 }
};

export const doAdvancedSearch = (appliedFilterObj) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let advancedString = "(";
  let advancedStringObject = {};
  delete urlParameters['filter'];
  for(let field in appliedFilterObj){
    if(appliedFilterObj[field].constructor === String && appliedFilterObj[field] !== ""){
      advancedString += "(" + field + ":" + encodeURIComponent(appliedFilterObj[field]) + ") AND ";
    }else if(appliedFilterObj[field].constructor === Array && appliedFilterObj[field].length !== 0){
      let len = appliedFilterObj[field].length;
      advancedString += "(" + field + ":(";
      for(let i = 0; i < len; i++){
        advancedString += "\"" + encodeURIComponent(appliedFilterObj[field][i]) + "\"";
        if(i !== len - 1){
          advancedString += " OR ";
        }else{
          advancedString += ")) AND ";
        }
      }
    }else if(appliedFilterObj[field].constructor === Object){
      if(appliedFilterObj[field].from !== "" && appliedFilterObj[field].to !== ""){
        advancedStringObject[`f.${field}.filter`] = "[" + appliedFilterObj[field].from + "T00:00:00TO" + appliedFilterObj[field].to + "T23:59:59]";
      }else if(urlParameters[`f.${field}.filter`]){
        delete urlParameters[`f.${field}.filter`];
      }
    }
  }
  advancedString = advancedString.replace(/( AND )$/, "") + ")";
  if(advancedString !== "()"){
    advancedStringObject['filter'] = advancedString;
  }
  urlParameters = Object.assign({}, urlParameters, advancedStringObject);
  getResults(urlParameters);
};

export const parseAppliedFiltersFromUrl = () => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let stateObj = {
    filters: {},
    checkAdvancedFilters: false
  };
  let dateFiltersLength = defaults.advancedFilters.date.length;
  let dateFiltersArray = Object.assign([], defaults.advancedFilters.date);
  if(urlParameters.filter !== undefined){
    stateObj.checkAdvancedFilters = true;
    let filtersArray = urlParameters.filter.replace(/^(\()/, "").replace(/(\))$/, "").split(" AND ");
    for(let i = 0, len = filtersArray.length; i < len; i++){
      let keyAndVal = filtersArray[i].replace(/^(\()/, "").replace(/(\))$/, "").split(":");
      if(keyAndVal[1].startsWith("(") && keyAndVal[1].startsWith(")", keyAndVal[1].length-1)){
        stateObj.filters[keyAndVal[0]] = JSON.parse(keyAndVal[1].replace(/^(\()/, "[").replace(/(\))$/, "]").replace(/\sOR\s/g, ","));
      }else{
        stateObj.filters[keyAndVal[0]] = keyAndVal[1];
      }
    }
  }
  if(dateFiltersLength > 0){
    for(let i = 0; i < dateFiltersLength; i++){
      if(urlParameters[`f.${dateFiltersArray[i].field}.filter`]){
        stateObj.checkAdvancedFilters = true;
        let filterField = dateFiltersArray[i].field;
        let filterValue = urlParameters[`f.${dateFiltersArray[i].field}.filter`];
        if(filterValue.length === 42){ //HARDCODED VALUE SINCE FORMAT [2018-12-12T00:00:00TO2018-12-12T00:00:00] HAVE 42 CHARACTERS
          stateObj.filters[filterField] = {
            from: filterValue.substr(1, 10),
            to: filterValue.substr(22, 10)
          };
        }
      }
    }
  }
  return stateObj;
};

export function parseSBResponse(response){
  try{
    if(response.status === 200 && response.data){
      let sbResponse = response.data;
      let facets = [];
      let results = [];
      let resultInfo = {};
      let featuredResults = [];

      // REFACTORING FACETS START
        if(sbResponse.facets){ // CHECKING IF FACETS ARE AVAILABLE FOR RESPONSE
          if(sbResponse.facets.constructor === Array){ // CHECKING IF FACET IS AN ARRAY(MORE THAN ONE FACET)
            for(let i = 0, len = sbResponse.facets.length; i < len; i++){
              let sbFacet1 = sbResponse.facets[i]; // PICKING SINGLE FACET TO RESTRUCTURE
              for(let j = 0, len1 = sbFacet1.facet.length; j < len1; j++){
               let sbFacet = sbFacet1.facet[j];
              let facet = {};
              facet[sbFacet["name"]] = [];
              facet["display"] = "";
              let facetHeading = "";
              let facetField = "";

              if(sbFacet["int"]){ // CHECKING IF FACET HAS FILTERS
                let filters = [];
                if(sbFacet["int"].constructor === Array){ //CHECKING IF THERE ARE MORE THAN ON FILTER
                  if(sbFacet["int"].length > 0) {
                    for(let k = 0, len1 = defaults.facets.length; k < len1; k++){
                      let defaultFacets = defaults.facets[k];
                       if(sbFacet['name'] === defaultFacets['field']){
                         facetHeading = defaultFacets['display'];
                         facetField = defaultFacets['field'];
                       }
                     }
                    if(facetHeading === "") {
                      facetHeading = sbFacet['name'];
                      facetField = sbFacet['name'];
                    }
                  }
                  for(let fc = 0, lenfc = sbFacet["int"].length; fc < lenfc; fc++){
                    let sbFilter = sbFacet["int"][fc]; // PICKING SINGLE SB FILTER VALUE TO RESTRUCTURE
                    let rangeFacetValues = "";
                    let rangeFormat = "";
                    let urlParameters = "";
                    let filterValue = "";
                    if(sbFilter["from"] || sbFilter["to"]){  // IF FILTER IS DATE TYPE
                      if(sbFilter["to"]!==null){
                        rangeFacetValues = moment(sbFilter["to"]).format('YYYY-MM-DDTHH:mm:ss') + " TO " +moment(sbFilter["from"]).format('YYYY-MM-DDTHH:mm:ss');
                        //rangeFormat = "[" + moment(sbFilter["to"]).utc().format('YYYY-MM-DDTHH:mm:ss') + "TO" +moment(sbFilter["from"]).utc().format('YYYY-MM-DDTHH:mm:ss') +"]";
                        rangeFormat = "[" + moment(sbFilter["from"]).utc().format('YYYY-MM-DDTHH:mm:ss') + "TO" +moment(sbFilter["to"]).utc().format('YYYY-MM-DDTHH:mm:ss') +"]";
                      }
                      else{
                        rangeFacetValues = moment(sbFilter["from"].replace(/.000Z/g, ""), "YYYY-MM-DDTHH:mm:ss").fromNow();
                        rangeFormat = "[" + moment(sbFilter["from"].replace(/.000Z/g, "")).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
                        //rangeFacetValues = moment(sbFilter["from"]).fromNow();
                        //rangeFormat = "[" + moment(sbFilter["from"]).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
                    }
                   urlParameters = Object.assign({}, qs.parse(window.location.search));
                   if(urlParameters['f.'+sbFacet['name']+'.filter']) {
                     if(urlParameters['f.'+sbFacet['name']+'.filter'].constructor === Array) {
                       for(let i = 0, len = urlParameters['f.'+sbFacet['name']+'.filter'].length; i < len; i++){
                         if(rangeFormat === urlParameters['f.'+sbFacet['name']+'.filter'][i]) {
                            sbFilter["filter"] = "true";
                         }
                       }
                     }
                     else {
                       if(rangeFormat === urlParameters['f.'+sbFacet['name']+'.filter']) {
                       // if(rangeFormat.split('T')[0] === urlParameters['f.'+sbFacet['name']+'.filter'].split('T')[0]) {
                          sbFilter["filter"] = "true";
                       }
                     }
                   }
                    filters.push({
                      filterName: rangeFacetValues,
                      count: sbFilter["count"],
                      filterSelect: sbFilter["filter"],
                      fromValue:rangeFormat,
                      rangeField:sbFacet['name']
                    });
                    }
                    if(sbFilter["name"]){ // IF FILTER IS STRING TYPE AND NOT DATE
                      filters.push({
                        filterName: sbFilter["name"],
                        count: sbFilter["count"],
                        filterSelect: sbFilter["filter"]
                      });
                    }
                  }
                }else if(sbFacet["int"].constructor === Object){
                  if(sbFacet["int"]["name"]){ // IF FILTER IS STRING TYPE AND NOT DATE
                    filters.push({
                      filterName: sbFacet["int"]["name"],
                      count: sbFacet["int"]["count"],
                      filterSelect: sbFacet["int"]["filter"]
                    });
                  }
                }
                filters = _.orderBy(filters, 'filterSelect', 'desc');
                facet[sbFacet["name"]] = filters; // ASSIGNING FILTERS TO FACET NAME NODE OF OBJECT
                facet["display"] = facetHeading;
                facet['facetField'] = facetField;
                }
                facets.push(facet); // APPENDING SINGLE FACET DATA TO ARRAY OF FACETS
            }
            }
          }
        } // REFACTORING FACETS END

      // REFACTORING RESULTS START
      if(sbResponse){
        if(sbResponse.result){
          let sbResults = sbResponse.result;
          if(sbResults.constructor === Array){
            results = sbResults;
          }else if(sbResults.constructor === Object){
            results.push(sbResults);
          }
        }
        if(sbResponse.ads){
          let sbResultAds = sbResponse.ads;
          if(sbResultAds.constructor === Array){
            featuredResults = sbResultAds;
          }else if(sbResultAds.constructor === Object){
            featuredResults.push(sbResultAds);
          }
        }
        if(sbResponse["currentPage"] !== undefined && sbResponse["currentPage"] !== null)resultInfo.currentPage = parseInt(sbResponse["currentPage"]);
        if(sbResponse["filter"] !== undefined && sbResponse["filter"] !== null) resultInfo.filter = sbResponse["filter"];
        if(sbResponse["hits"] !== undefined && sbResponse["hits"] !== null) resultInfo.hits = parseInt(sbResponse["hits"]);
        if(sbResponse["lastPage"] !== undefined && sbResponse["lastPage"] !== null) resultInfo.lastPage = parseInt(sbResponse["lastPage"]);
        if(sbResponse["query"] !== undefined && sbResponse["query"] !== null) resultInfo.query = sbResponse["query"];
        if(sbResponse["sort"] !== undefined && sbResponse["sort"] !== null) resultInfo.sort = sbResponse["sort"];
        if(sbResponse["sortDir"] !== undefined && sbResponse["sortDir"] !== null) resultInfo.sortDirection = sbResponse["sortDir"];
        if(sbResponse["sort1"] !== undefined && sbResponse["sort1"] !== null) resultInfo.sort1 = sbResponse["sort1"];
        if(sbResponse["sortDir1"] !== undefined && sbResponse["sortDir1"] !== null) resultInfo.sortDirection1 = sbResponse["sortDir1"];
        if(sbResponse["suggest"] !== undefined && sbResponse["suggest"] !== null) resultInfo.suggest = sbResponse["suggest"];
        if(sbResponse["time"] !== undefined && sbResponse["time"] !== null) resultInfo.time = sbResponse["time"];
        if(sbResponse["start"] !== undefined && sbResponse["start"] !== null) resultInfo.start = sbResponse["start"];
        if(sbResponse["end"] !== undefined && sbResponse["end"] !== null) resultInfo.end = sbResponse["end"];
        if(sbResponse["highlight"] !== undefined && sbResponse["highlight"] !== null) resultInfo.highlight = sbResponse["highlight"];
      }
      // REFACTORING RESULTS START

      return {
        facets,
        results,
        featuredResults,
        resultInfo
      };
    }
  }catch(e){
    return {
      facets: [],
      results: [],
      featuredResults:[],
      resultInfo: {}
    };
  }
}
