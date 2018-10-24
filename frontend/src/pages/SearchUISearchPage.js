// @flow
import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import {
  SimpleQueryRequest,
  AuthUtils,
  Configurable,
  SearchBar,
  MastheadNavTabs,
  SecondaryNavBar,
  SearchResultsCount,
  SpellCheckMessage,
  SearchResultsFacetFilters,
  SearchResults,
  PlacementResults,
  SearchResultsPager,
  SearchRelevancyModel,
  SearchDebugToggle,
  FacetResults,
  NavbarSort,
  Masthead,
} from '@attivio/suit';

import SearchUIApp from '../SearchUIApp';

type SearchUISearchPageProps = {
  /**
   * Optional. The location of the node through which to interact with Attivio.
   * Defaults to the value in the configuration.
   */
  baseUri: string;

  /**
   * The list of relevancy models to show that will be availale for the user
   * to choose from. If this is set to a single-element array, then that one
   * relevancy model will be used for all queries and the user will not see
   * a menu for choosing the model. If this is not set (and the value is the
   * default, empty array, then the back-end will be queried to obtain the list
   * of known model names.
   */
  relevancyModels: Array<string>;

  /**
   * Whether or not the documents’ relevancy scores should be displayed.
   * Defaults to false.
   */
  showScores: boolean;
  /**
   * A map of the field names to the label to use for any entity fields.
   * Defaults to show the people, locations, and companies entities.
   */
  entityFields: Map<string, string>;
  /**
   * Whether or not to display a toggle for switching the search results
   * to debug format.
   */
  debugViewToggle: boolean;
  /** The names of the fields to include in the sort menu. */
  sortableFields: Array<string>;
  /** The facet field names that should be displayed as pie charts */
  pieChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as bar charts */
  barChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as column charts */
  columnChartFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as lists with bars */
  barListFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as tag clouds */
  tagCloudFacets: Array<string> | string | null;
  /** The facet field names that should be displayed as time series */
  timeSeriesFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a sentiment bar */
  sentimentFacets: Array<string> | string | null;
  /** The facet field names that should be displayed with a geographic map */
  geoMapFacets: Array<string> | string | null;
  /**
   * The maximum number of items to show in a facet. If there
   * are more than this many buckets for the facet, only this many, with
   * the highest counts, will be shown. Defaults to 15.
   */
  maxFacetBuckets: number;
  /**
   * An optional list of facet field names which will be used to determine
   * the order in which the facets are shown. Any facets not named here will
   * appear after the called-out ones, in the order they are in in the
   * response.facets array of the parent Searcher component.
   */
  orderHint: Array<string>;
  /** Controls the colors used to show various entity types (the value can be any valid CSS color) */
  entityColors: Map<string, string>;
  /**
   * The type of engine being used to do the searching. This will affect the way the
   * search results are rendered.
   */
  searchEngineType: 'attivio' | 'solr' | 'elastic';
};

/**
 * Page for doing a simple search using a <Searcher> component.
 */
class SearchUISearchPage extends React.Component<SearchUISearchPageProps, SearchUISearchPageProps, void> {
  static defaultProps = {
    baseUri: '',
    searchEngineType: 'attivio',
    relevancyModels: [],
    showScores: false,
    entityFields: new Map([['people', 'People'], ['locations', 'Locations'], ['companies', 'Companies']]),
    debugViewToggle: false,
    sortableFields: [
      'title',
      'table',
      'size',
      'creationdate',
      'date',
      'guid',
      'linkcount',
      'socialsecurity',
      'zipcode',
    ],
    pieChartFacets: null,
    barChartFacets: null,
    columnChartFacets: null,
    barListFacets: null,
    tagCloudFacets: null,
    timeSeriesFacets: null,
    sentimentFacets: null,
    geoMapFacets: null,
    maxFacetBuckets: 15,
    orderHint: [],
    entityColors: new Map(),
  };

  static contextTypes = {
    searcher: PropTypes.any,
    app: PropTypes.shape({ type: PropTypes.oneOf([SearchUIApp]) }),
  };
  
  componentWillMount() {
  // console("baseUri1:"+${config.baseUri})
    this.context.searcher.doSearch();
  }
  
 handleClick = () => {	
    	var attivioProtocol = this.context.app.state.config.ALL.attivioProtocol;
	    var attivioHostname = this.context.app.state.config.ALL.attivioHostname;
	    var attivioPort = this.context.app.state.config.ALL.attivioPort;
		var fieldValue = this.context.app.state.config.ALL.fieldValue;
		var rows = this.context.app.state.config.ALL.rows;
		var webplayerURL = this.context.app.state.config.ALL.webplayerURL;
		var query = {
		"query": "",
		"workflow": "search",
		"queryLanguage": "simple",
		"locale": "en",
		"rows": rows,
		"filters": [],
		"facets": [],
		"sort": [
		  ".score:DESC"
		],
		"fields": [
		 fieldValue
		],
		"facetFilters": [],
		"restParams": {
			"offset": [
			  "0"
			],
			"relevancymodelnames": [
			  "default"
			],
			"includemetadatainresponse": [
			  "true"
			],
			"highlight": [
			  "false"
			],
			"highlight.mode": [
			  "HTML"
			],
			"facet.ff": [
			  "RESULTS"
			],
			"facet.ffcount": [
			  "20"
			],
			"join.rollup": [
			  "tree"
			],
			"abc.enabled": [
			  "true"
			],
			"searchProfile": [
			  "Attivio"
			]
		},
		"realm": "aie"
	};
	 query.query = this.context.searcher.state.query;
	 if (this.context.searcher.state.geoFilters) {
      query.filters = this.context.searcher.state.geoFilters;
    } else {
      query.filters = [];
    }
    if (this.props.queryFilter) {
      query.filters.push(this.context.searcher.props.queryFilter);
    }
	var url = attivioProtocol+"://"+attivioHostname+":"+attivioPort+"/rest/searchApi/search";
	console.log(attivioProtocol+"://"+attivioHostname+":"+attivioPort+"/rest/searchApi/search");
    query.facetFilters = this.context.searcher.state.facetFilters;
		$.ajax({
			url: url,			
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(query),
			success: function (result) {			 
				var resultArray = [];
				resultArray.push(query.query);
				$.each(result.documents, function (index, value) {
					var title = value.fields ? value.fields[fieldValue]: "";								
					resultArray.push(title.toString().replace(",", "，").replace(";", "；"));
				});
				var result = resultArray.join(",");
				console.log("result:"+result);
				
				try
				{
					parent.postMessage(result, webplayerURL);
				}
				catch (e)
				{
				}
				
				for (var i = 8000; i < 8500; i ++)
				{
					try 
					{
						parent.postMessage(result, "http://localhost:" + i + "/");
					}
					catch (e)
					{
					}
				}
			},
            error:function (e) {
　　　　　　　　　　//返回500错误 或者其他 http状态码错误时 需要在error 回调函数中处理了
				console.log("e.responseText:"+e.responseText);
            }
		});
  }
  
   downloadClick = () => {	
   	var queryStr = this.context.searcher.state.query;
	if(queryStr == "*:*"){
		alert("Please enter keywords!!!");
		return;
	}
	var attivioProtocol = this.context.app.state.config.ALL.attivioProtocol;
	var attivioHostname = this.context.app.state.config.ALL.attivioHostname;
	var attivioPort = this.context.app.state.config.ALL.attivioPort;
	var workflow = this.context.app.state.config.ALL.workflow;
	var rows = this.context.app.state.config.ALL.rows;
	var qr = new SimpleQueryRequest();
    qr.workflow = workflow;
    qr.query = queryStr;
	var queryString = queryStr;
	if(queryStr.indexOf(":") != -1){
    	queryString =queryStr.substring(queryStr.indexOf(":")+1);
	}
    qr.queryLanguage = this.context.searcher.state.queryLanguage;
    qr.rows = rows;
	qr.username = AuthUtils.getLoggedInUserId();
    if (this.context.searcher.state.geoFilters) {
      qr.filters = this.context.searcher.state.geoFilters;
    } else {
      qr.filters = [];
    }
    if (this.context.searcher.props.queryFilter) {
      qr.filters.push(this.context.searcher.props.queryFilter);
    }
    if (this.context.searcher.props.locale) {
      qr.locale = this.context.searcher.props.locale;
    }
    qr.facets = this.context.searcher.props.facets;
    qr.sort = this.context.searcher.state.sort;
    qr.fields = this.context.searcher.getFieldList();
    qr.facetFilters = this.context.searcher.state.facetFilters;
	qr.restParams ={
			"offset": [
			  "0"
			],
			"relevancymodelnames": [
			  "default"
			],
			"includemetadatainresponse": [
			  "true"
			],
			"highlight": [
			  "false"
			],
			"highlight.mode": [
			  "HTML"
			],
			"facet.ff": [
			  "RESULTS"
			],
			"facet.ffcount": [
			  "20"
			],
			"join.rollup": [
			  "tree"
			],
			"abc.enabled": [
			  "true"
			],
			"searchProfile": [
			  "Attivio"
			]
		};
	var url = attivioProtocol+"://"+attivioHostname+":"+attivioPort+"/rest/searchApi/search";
	console.log(attivioProtocol+"://"+attivioHostname+":"+attivioPort+"/rest/searchApi/search");
	$.ajax({
		url: url,			
		method: "POST",
		contentType: "application/json",
		data: JSON.stringify(qr),
		success: function (result) {			      
			var datas =[];
			var sss = result.documents;				
			console.log(result.documents);
			if(result.documents != null){
				$.each(result.documents, function (index, value) {								
					var id = value.fields ? value.fields[".id"]: "";//inpatientid_s
					$.each(value.fields,function(key1,val1){											
						if(val1.length >0){
							if(key1!=".id" && key1!="inpatientid_s"){
								for ( var i = 0; i <val1.length; i++){										
									var data = {};
									data["inpatientid_s"] = id;
									data["field"] = key1;
									data["value"] = val1[i];
									datas.push(data);												
								}
							}
						}
					})							
				});
			}
			var JSonToCSV = {
			  /*
			   * obj是一个对象，其中包含有：
			   * ## data 是导出的具体数据
			   * ## fileName 是导出时保存的文件名称 是string格式
			   * ## showLabel 表示是否显示表头 默认显示 是布尔格式
			   * ## columns 是表头对象，且title和key必须一一对应，包含有
					title:[], // 表头展示的文字
					key:[], // 获取数据的Key
					formatter: function() // 自定义设置当前数据的 传入(key, value)
			   */
				setDataConver: function(obj) {
					var bw = this.browser();
						if(bw['ie'] < 9) return; // IE9以下的
						var data = obj['data'],
						ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
						fileName = (obj['fileName'] || 'UserExport') + '.csv',
						columns = obj['columns'] || {
						title: [],
						key: [],
						formatter: undefined
					};
					var ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
					var row = "", CSV = '', key;
					// 如果要现实表头文字
					if (ShowLabel) {
						// 如果有传入自定义的表头文字
						if (columns.title.length) {
							columns.title.map(function(n) {
							row += n + ',';
						});
					} else {
						// 如果没有，就直接取数据第一条的对象的属性
						for (key in data[0]) row += key + ',';
					}
					row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
					CSV += row + '\r\n'; // 添加换行符号
				}
				// 具体的数据处理
				data.map(function(n) {
				row = '';
				// 如果存在自定义key值
				if (columns.key.length) {
					columns.key.map(function(m) {
					row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) + '",';
					});
				} else {
					for (key in n) {
						row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) + '",';
					}
				}
				row.slice(0, row.length - 1); // 删除最后一个,
				CSV += row + '\r\n'; // 添加换行符号
				});
				if(!CSV) return;
				this.SaveAs(fileName, CSV);
			},
			SaveAs: function(fileName, csvData) {
				var bw = this.browser();
				if(!bw['edge'] || !bw['ie']) {
					var alink = document.createElement("a");
					alink.id = "linkDwnldLink";
					alink.href = this.getDownloadUrl(csvData);
					document.body.appendChild(alink);
					var linkDom = document.getElementById('linkDwnldLink');
					linkDom.setAttribute('download', fileName);
					linkDom.click();
					document.body.removeChild(linkDom);
				}
				else if(bw['ie'] >= 10 || bw['edge'] == 'edge') {
					var _utf = "\uFEFF";
					var _csvData = new Blob([_utf + csvData], {
					type: 'text/csv'
				});
				navigator.msSaveBlob(_csvData, fileName);
				}
				else {
					var oWin = window.top.open("about:blank", "_blank");
					oWin.document.write('sep=,\r\n' + csvData);
					oWin.document.close();
					oWin.document.execCommand('SaveAs', true, fileName);
					oWin.close();
				}
			},
			getDownloadUrl: function(csvData) {
				var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
				if (window.Blob && window.URL && window.URL.createObjectURL) {
					var csvData = new Blob([_utf + csvData], {
					type: 'text/csv'
					});
				return URL.createObjectURL(csvData);
				}
				// return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
			},
			browser: function() {
				var Sys = {};
				var ua = navigator.userAgent.toLowerCase();
				var s;
				(s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
				(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
				(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
				(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
				(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
				(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
				return Sys;
				}
			};
										
			// 测试
			JSonToCSV.setDataConver({
			data:datas,
			fileName: queryString,
			columns: {
				title: ['inpatientid_s', 'field', 'value'],
				key: ['inpatientid_s', 'field', 'value'],
				formatter: undefined
				}
			});
		},
		error:function (e) {
			console.log("e.responseText:"+e.responseText);
		}
	});
		
  }
  
  
  
  
  renderSecondaryNavBar() {
    return (
      <SecondaryNavBar>
        <SearchResultsCount />
        <SearchResultsFacetFilters />
        <SearchResultsPager right />
        <SearchRelevancyModel
          right
          baseUri={this.props.baseUri}
          models={this.props.relevancyModels}
        />
        <NavbarSort
          fieldNames={this.props.sortableFields}
          includeRelevancy
          right
        />
        <SearchDebugToggle right />
      </SecondaryNavBar>
    );
  }

  render() {
    const showScores = this.props.showScores && this.props.searchEngineType === 'attivio';
    const showTags = this.props.searchEngineType === 'attivio';
    return (
      <DocumentTitle title="Search: Attivio Cognitive Search">
        <div>
          <Masthead multiline homeRoute="/landing">
            <MastheadNavTabs initialTab="/results" tabInfo={this.context.app.getMastheadNavTabs()} />           
			<div className="attivio-tabpanel-radio attivio-tabpanel-radio-navbar attivio-globalmast-tabpanel">
			<ul className="nav nav-tabs"><li className="active">
				<a role="button" tabindex="0" onClick={this.handleClick}>Export</a>			
			</li>
		    </ul>
			</div>
			<SearchBar
              inMasthead
            />
			<div className="attivio-tabpanel-radio attivio-tabpanel-radio-navbar attivio-globalmast-tabpanel">
			<ul className="nav nav-tabs"><li className="active">
				<a role="button" tabindex="0" onClick={this.downloadClick}>Download</a>									
			</li>
		    </ul>
			</div>
          </Masthead>
          {this.renderSecondaryNavBar()}
          <div style={{ padding: '10px' }}>
            <Grid fluid>
              <Row>
                <Col xs={12} sm={5} md={4} lg={3}>
                  <FacetResults
                    pieChartFacets={this.props.pieChartFacets}
                    barChartFacets={this.props.barChartFacets}
                    columnChartFacets={this.props.columnChartFacets}
                    barListFacets={this.props.barListFacets}
                    tagCloudFacets={this.props.tagCloudFacets}
                    timeSeriesFacets={this.props.timeSeriesFacets}
                    sentimentFacets={this.props.sentimentFacets}
                    geoMapFacets={this.props.geoMapFacets}
                    maxFacetBuckets={this.props.maxFacetBuckets}
                    orderHint={this.props.orderHint}
                    entityColors={this.props.entityColors}
                  />
                </Col>
                <Col xs={12} sm={7} md={8} lg={9}>
                  <PlacementResults />
                  <SpellCheckMessage />
                  <SearchResults
                    format={this.context.searcher.state.format}
                    entityFields={this.props.entityFields}
                    baseUri={this.props.baseUri}
                    showScores={showScores}
                    showTags={showTags}
                  />
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default Configurable(SearchUISearchPage);
