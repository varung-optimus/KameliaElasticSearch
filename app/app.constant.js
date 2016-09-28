(function(app) {
    var contentTypeQuery = {
        index: 'files',
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "*",
                            "analyze_wildcard": true
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [{
                                "query": {
                                    "query_string": {
                                        "analyze_wildcard": true,
                                        "query": "*"
                                    }
                                }
                            }, {
                                "range": {
                                    "Last_Modified": {
                                        "gte": 1464719400000,
                                        "lte": 1467311399999,
                                        "format": "epoch_millis"
                                    }
                                }
                            }],
                            "must_not": []
                        }
                    }
                }
            },
            "size": 0,
            "aggs": {
                "2": {
                    "terms": {
                        "field": "Content_Type",
                        "size": 5,
                        "order": {
                            "_count": "desc"
                        }
                    }
                }
            }
        }
    };

    var accessQuery = {
        index: 'files',
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "*",
                            "analyze_wildcard": true
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [{
                                "query": {
                                    "query_string": {
                                        "analyze_wildcard": true,
                                        "query": "*"
                                    }
                                }
                            }, {
                                "range": {
                                    "Last_Modified": {
                                        "gte": 1464719400000,
                                        "lte": 1467311399999,
                                        "format": "epoch_millis"
                                    }
                                }
                            }],
                            "must_not": []
                        }
                    }
                }
            },
            "size": 0,
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "Last_Accessed",
                        "interval": "1d",
                        "time_zone": "Asia/Kolkata",
                        "min_doc_count": 1,
                        "extended_bounds": {
                            "min": 1464719400000,
                            "max": 1467311399999
                        }
                    }
                }
            }
        }
    };

    var modificationsQuery = {
        index: 'files',
        body: {
            "query": {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "*",
                            "analyze_wildcard": true
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [{
                                "query": {
                                    "query_string": {
                                        "analyze_wildcard": true,
                                        "query": "*"
                                    }
                                }
                            }, {
                                "range": {
                                    "Last_Modified": {
                                        "gte": 1464719400000,
                                        "lte": 1467311399999,
                                        "format": "epoch_millis"
                                    }
                                }
                            }],
                            "must_not": []
                        }
                    }
                }
            },
            "size": 0,
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "Last_Modified",
                        "interval": "1d",
                        "time_zone": "Asia/Kolkata",
                        "min_doc_count": 1,
                        "extended_bounds": {
                            "min": 1464719400000,
                            "max": 1467311399999
                        }
                    }
                }
            }
        }
    };

    var tagQuery = {
        index: 'test_index',
        body: {
            size: 1000
        }
    };

    var saveQuery = {
        index: 'test_index',
        type: '2',
        body: {
        }
    };

    var browseTagQuery = {
        index: 'test_index',
        body: {
            size: 1000
        }
    };
    var sourcesTagQuery = {
        index: 'sources',
        body: {
            size: 1000
        }
    };

    app.constant('euiHost', 'http://41.106.2.2:9200');
    app.constant('euiContentTypeQuery', contentTypeQuery);
    app.constant('euiAccessQuery', accessQuery);
    app.constant('euiModificationsQuery', modificationsQuery);
    app.constant('euiTagQuery', tagQuery);
    app.constant('euiSaveQuery', saveQuery);
    app.constant('euiBrowseTagQuery', browseTagQuery);
    app.constant('sourcesTagQuery', sourcesTagQuery);
})(angular.module('core.constants', []));
