$(function(){ // on dom ready

	
var allcy = cytoscape({
//    layout: 'random',
	headless: true,
});

var handler = function(){
		console.log("called handler");
};

var handler2 = function(){
	console.log("from handler2: allcy has this many edges: " + allcy.edges().size());
};

var reset_switches = function(){
	    document.getElementById("blue-switch").checked = true;
	    document.getElementById("red-switch").checked = true;
	    document.getElementById("green-switch").checked = true;
	    document.getElementById("gadag-switch").checked = true;
	    document.getElementById("link-switch").checked = true;
}

var cy = cytoscape({
  container: document.getElementById('cy'),
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'background-color': 'black',
      })
    .selector('.node-named-proxy')
      .css({
        'background-color': 'DarkViolet',
    	'border-color': 'DarkViolet',
    	'border-width': 2,
    	'width': 45,
      })
    .selector('edge')
      .css({
    	'line-color': 'black',
    	'target-arrow-color': 'black', 
        'target-arrow-shape': 'triangle',
        'width': 2,
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0,
      })
    .selector('.hidden-edge')
      .css({
        'display': 'none',
      })
    .selector('.edge-link-labeled')
      .css({
      	'content':'data(label)',
      	'text-background-color':'white',
      	'text-background-opacity':'1',
      	'color':'black',
        'line-color': 'black',
        'target-arrow-shape': 'none',
      })
    .selector('.edge-alt-fec-blue')
      .css({
        'line-color': 'blue',
        'target-arrow-color': 'blue',
      }) 
    .selector('.edge-alt-fec-red')
      .css({
        'line-color': 'red',
        'target-arrow-color': 'red',
      })
     .selector('.edge-alt-prot-node_protection')
      .css({
        'line-style': 'dashed',
      })
     .selector('.edge-alt-prot-link_protection')
      .css({
        'line-style': 'dashed',
        'content':'LP',
      	'text-background-color':'white',
      	'text-background-opacity':'1',
      	'color':'black',
      })
     .selector('.edge-alt-fec-no_alternate')
      .css({
        'line-color': 'purple',
        'target-arrow-color': 'purple',
        'line-style': 'dashed',
        'content':'none',
      	'color':'black',
      })
    .selector('.edge-mrt-blue')
      .css({
        'line-color': 'blue',
        'target-arrow-color': 'blue',
      }) 
    .selector('.edge-mrt-red')
      .css({
        'line-color': 'red',
        'target-arrow-color': 'red',
      })
     .selector('.edge-spf-green')
      .css({
        'line-color': 'green',
        'target-arrow-color': 'green',
      })
     .selector('.edge-gadag')
      .css({
        'line-color': 'orange',
        'target-arrow-color': 'orange',
      })
    .selector('.node-gadag-root')
      .css({
        'background-color': 'orange',
      })
    .selector('.node-current-failed')
      .css({
        'background-color': 'purple',
      })
    .selector('.node-current-dest')
      .css({
        'background-color': 'green',
    	'border-color': 'green',
    	'border-width': 2,
      })
    .selector('.edge-to-prefix-adv')
      .css({
        'line-color': 'DarkViolet',
        'target-arrow-shape': 'none',
        'line-style': 'dashed',
      	'content':'data(label)',
      	'text-background-color':'white',
      	'text-background-opacity':'1',
      	'color':'black',
      })
    .selector('.edge-pnar1')
      .css({
        'line-color': 'DarkViolet',
        'source-arrow-shape': 'triangle',
        'source-arrow-color': 'DarkViolet',
        'line-style': 'solid',
      })
    .selector('.edge-pnar2')
      .css({
        'line-color': 'DarkViolet',
        'source-arrow-shape': 'circle',
        'source-arrow-color': 'DarkViolet',
        'line-style': 'solid',
      }) 
    .selector('.blue-hidden-edge')
      .css({
    	'display': 'none'
      })
    .selector('.red-hidden-edge')
      .css({
    	'display': 'none'
      })
    .selector('.green-hidden-edge')
      .css({
    	'display': 'none'
      })
    .selector('.gadag-hidden-edge')
      .css({
    	'display': 'none'
      })
    .selector('.link-hidden-edge')
      .css({
    	'display': 'none'
      })
    .selector('.alt-hidden-edge')
      .css({
    	'display': 'none'
      })
      ,

  wheelSensitivity: 0.25,
  
  layout: {
    name: 'cola',
  },
  
  // on graph initial layout done (could be async depending on layout...)
  ready: function(){
	  
	var excess_edges;
	  
	function reload_graph(){
		cy.batch(function(){
			reset_switches();
			$.getJSON(graph_file+'/graph_basic.json').success(function(network) {
				cy.load(network.elements);
			})
		});
	};
	
	function reload_graph2(){
//		cy.batch(function(){
			reset_switches();
		    
			$.getJSON(graph_file+'.json').success(function(network) {
				allcy.load(network.elements);
			})
			// We need to use a callback for the done event on allcy,
			// because without this, actions taken immediately
			// after allcy.load yield no nodes or edges.
			allcy.one("done",
				function (){
					console.log('from done callback allcy.one: allcy has this many edges: ' + allcy.edges().size());
				  	var link_edges = cy.edges().filterFn(function( ele ){
				  		if ( ele.hasClass('edge-link-labeled') ){
				  			return true;
				  		} else {
				  			return false;
				  		}
					});
					cy.remove(cy.edges());
					cy.add(link_edges);
				}
			);
//		});
			
	};
	
	function reload_graph3(){
		reset_switches();
		allcy.remove(allcy.nodes());
		console.log('emptied cyall');
		$.getJSON(graph_file+'_basic.json').success(function(network) {
			cy.load(network.elements);
		});
		console.log('loaded cy');
		$.getJSON(graph_file+'.json').success(function(network) {
			allcy.load(network.elements);
		});
		console.log('loaded allcy');
		$("#messages").html("<p>The full graph is loading.  Layout should work on the partial graph." +
				"Wait until the full graph is completely loaded for full interactive functionality.");
		allcy.one("done",
			function (){
				console.log('from done callback allcy.one: allcy has this many edges: ' + allcy.edges().size());
				$("#messages").html("<p>The full graph has been loaded.");
			}
		);
	};
	
	function reload_graph4(){
		reset_switches();
		allcy.remove(allcy.nodes());
		console.log('emptied cyall');

	};
	
    window.cy = this;
    
   
	var current_dest;
	var current_failed;
	
	var graph_files = {
//	           	    'a': {'graph_file':'example_topo_graph', 'node_spacing': 10},
//	           	    'b':{'graph_file':'topo-15a_graph', 'node_spacing': 100},
//	           	 	'c':{'graph_file':'topo-15b_graph', 'node_spacing': 100},
//	           	 	'd':{'graph_file':'random22_topology', 'node_spacing': 10},
//	           	 	'e':{'graph_file':'random22_graph', 'node_spacing': 10 },
//	           	 	'f':{'graph_file':'random100_topology', 'node_spacing': 10},
//	           	 	'g':{'graph_file':'random50_graph', 'node_spacing': 10},
//	           	 	'h':{'graph_file':'random23_graph', 'node_spacing': 10},
//	           	 	'i':{'graph_file':'random23_graph_basic', 'node_spacing': 10},
//	           	 	'j':{'graph_file':'random100_graph', 'node_spacing': 10},
	           	 	'k':{'graph_file':'random24', 'node_spacing': 10},
	           	 	'l':{'graph_file':'random101', 'node_spacing': 10},	
	}
	
	for (graph in graph_files) {
		$("#graph-select").append( '<option value="' + graph + '">' + graph_files[graph].graph_file);
	}

	var graph_file = graph_files['k'].graph_file;
	var node_spacing = graph_files['k'].node_spacing;
	
	$("#graph-select").bind("change", function(){
		console.log('from inside change event handler, val=' + $("#graph-select").val())
		graph_file = graph_files[$("#graph-select").val()].graph_file;
		node_spacing = graph_files[$("#graph-select").val()].node_spacing;
		reload_graph();
	});

	console.log('testing console');
	console.log('url(id) = ' + $.url('?id') );

	// if ?id=a parameter in url is in the graph_files dictionary, then
	// change the value of the graph selection and trigger a change event.
	if ($.url('?id') in graph_files){
		console.log('url(id) in graph_files');
		$("#graph-select")
			.val($.url('?id'))
			.trigger('change');
	} else {
		reload_graph();
	}

	cy.on('tap', function(event){
		var old_dest = current_dest;
		var old_dest_class = 'edge-dest-' + old_dest;
		var old_edges = cy.edges().filterFn(function( ele ){
			if ( ele.hasClass(old_dest_class) ){
				return true;
			} else {
				return false;
			}
		});

		var evtTarget = event.cyTarget;
		if( evtTarget === cy ){
		    console.log('tap on background');
		    old_edges.remove()
		    current_dest = undefined
		} else {
			console.log('tap on some element');
			if (evtTarget.isNode()){
			  console.log('tap on node');
			  current_dest = evtTarget.id();
			  cy.batch(function(){
				console.log('cy has this many edges: ' + cy.edges().size());
				$.getJSON(graph_file + '/dest_' + current_dest  +'.json').success(function(network) {
					console.log('file loaded successfully');
				  	console.log('cy has this many edges: ' + cy.edges().size());
				  	old_edges.remove()
					cy.add(network.elements);
				});
				console.log('cy has this many edges: ' + cy.edges().size());
				  
			  });
			}
		}		
	});
	
//	cy.on('tap', 'node', function(e){
//	  var node = e.cyTarget;
//	  var old_dest = current_dest;
//	  current_dest = node.id();
//	  var old_dest_class = 'edge-dest-' + old_dest;
//	  var curr_dest_class = 'edge-dest-' + current_dest;
//
//	  cy.batch(function(){
//
//		console.log('cy has this many edges: ' + cy.edges().size());
//		$.getJSON(graph_file + '/dest_' + current_dest  +'.json').success(function(network) {
//			console.log('file loaded successfully');
//			console.log('old_dest_class = ' + old_dest_class)
//			
//		  	var old_edges = cy.edges().filterFn(function( ele ){
//		  		if ( ele.hasClass(old_dest_class) ){
//		  			return true;
//		  		} else {
//		  			return false;
//		  		}
//			});
//			
//		  	console.log("old_edges has len = " + old_edges.size())
//		  	old_edges.remove()
//		  	console.log('cy has this many edges: ' + cy.edges().size());
//			cy.add(network.elements);
//		});
//		console.log('cy has this many edges: ' + cy.edges().size());
//		  
//	  });
//	  
//	});
	
	cy.on('cxttap', 'node', function(e){
		  var node = e.cyTarget;
		  rclick_node = node.id();
		  if ( cy.elements('node#'+rclick_node).hasClass('node-named-proxy') ){
			  var prefix_class = 'edge-prefix-'+rclick_node;
			  cy.batch(function(){
				  cy.edges().forEach(function (edge){
					if ( edge.hasClass(prefix_class) ){
						if (edge.hasClass('hidden-edge')){
							edge.removeClass('hidden-edge')
						} else {
							edge.addClass('hidden-edge')
						}
					}
				  });
			  });
		  } else {
			  current_failed = rclick_node;
			  cy.batch(function(){
				  cy.nodes().removeClass('node-current-failed');
				  cy.elements('node#'+current_failed).addClass('node-current-failed');
				  var alt_failed_class = 'edge-alt-failed-node-' + current_failed;
				  var alt_dest_class = 'edge-alt-dest-' + current_dest;
				  cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-alt')){
						if ( edge.hasClass(alt_dest_class) 
								&& edge.hasClass(alt_failed_class) ){
							edge.removeClass('hidden-edge')
						} else {
							edge.addClass('hidden-edge')
						} 
					}
				  });
			  });
		  }
	});	
	
	$("#load-graph-button").bind("click", function(){
		reload_graph();
	});
	
	$("#load2-graph-button").bind("click", function(){
		reload_graph2();
	});
	
	$("#load3-graph-button").bind("click", function(){
		reload_graph3();
	});
	
	$("#load4-graph-button").bind("click", function(){
		reload_graph4();
	});
    
	$("#cose-layout-button").bind("click", function(){
		cy.layout({
			name : 'cose',
		});
	});
	
	$("#cola1-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			edgeLength: 
				function (edge){
					if (edge.hasClass('edge-to-prefix-adv')) {
						return 500;
					} else {
						return 100;
					}
				},
		});
	});
	
	$("#cola2-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			nodeSpacing: 	
				function (node){
					if (node.hasClass('node-named-proxy')) {
						return 500;
					} else {
						return node_spacing;
					}
				},
		});
	});
	
	$("#cola3-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			alignment: 	
				function (node){
					if (node.hasClass('node-named-proxy')) {
						return {x:500};
					} else {
						return {x:0};
					}
				},
		});
	});
	
	$("#cola4-layout-button").bind("click", function(){
		  cy.batch(function(){
				cy.layout({
					name : 'cola',
					maxSimulationTime: 1000,
					edgeLength: 
						function (edge){
							if (edge.hasClass('edge-to-prefix-adv')) {
								return 700;
							} else {
								return 50;
							}
						},
				});
		  });
	});
	
	$("#cola5-layout-button").bind("click", function(){
		  cy.batch(function(){
			  	var named_proxy_nodes = cy.nodes().filterFn(function( ele ){
			  	  return ele.hasClass('node-named-proxy');
			  	});
			  	var named_proxy_edges = cy.edges().filterFn(function( ele ){
				  	  return ele.hasClass('edge-to-prefix-adv');
				});
			  	named_proxy_edges.remove()
			  	named_proxy_nodes.remove()
				cy.layout({
					name : 'cola',
					maxSimulationTime: 8000,
					nodeSpacing: 	
						function (node){
							return 10;
						},
				});
			  	named_proxy_nodes.restore()
			  	named_proxy_edges.restore()
		  });
	});	
	
	$("#cola6-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			alignment: 	
				function (node){
					if (node.hasClass('node-named-proxy')) {
						return {x:600};
					} else {
						var x_pos = Math.floor((Math.random() * 300) + 1)-150; 
						return {x:x_pos};
					}
				},
		});
	});
	
	$("#unhide-edges-button").bind("click", function(){
		cy.edges().removeClass('hidden-edge');
	});
	
	$("#blue-switch").bind("click", function(){
		if (this.checked){
			cy.style()
				.selector('.edge-mrt-blue')
					.style({
						'display': 'element'
					})
				.update()
			;
		} else {
			cy.style()
				.selector('.edge-mrt-blue')
					.style({
						'display': 'none'
					})
				.update()
			;
		}
	});

	$("#red-switch").bind("click", function(){
		if (this.checked){
			cy.style()
				.selector('.edge-mrt-red')
					.style({
						'display': 'element'
					})
				.update()
			;
		} else {
			cy.style()
				.selector('.edge-mrt-red')
					.style({
						'display': 'none'
					})
				.update()
			;
		}
	});	
	
	$("#green-switch").bind("click", function(){
		if (this.checked){
			cy.style()
				.selector('.edge-spf-green')
					.style({
						'display': 'element'
					})
				.update()
			;
		} else {
			cy.style()
				.selector('.edge-spf-green')
					.style({
						'display': 'none'
					})
				.update()
			;
		}
	});		
	
	$("#gadag-switch").bind("click", function(){
		if (this.checked){
			cy.style()
				.selector('.edge-gadag')
					.style({
						'display': 'element'
					})
				.update()
			;
		} else {
			cy.style()
				.selector('.edge-gadag')
					.style({
						'display': 'none'
					})
				.update()
			;
		}
	});
	
	$("#link-switch").bind("click", function(){
		if (this.checked){
			cy.style()
				.selector('.edge-link-labeled')
					.style({
						'display': 'element'
					})
				.update()
			;
		} else {
			cy.style()
				.selector('.edge-link-labeled')
					.style({
						'display': 'none'
					})
				.update()
			;
		}
	});	
	
//	$("#blue-switch").bind("click", function(){
//		if (this.checked){
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-mrt-blue') ){
//						edge.removeClass('blue-hidden-edge');
//					}
//				});
//			});
//		} else {
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-mrt-blue') ){
//						edge.addClass('blue-hidden-edge');
//					}
//				});
//			});
//		}
//	});
//
//	$("#red-switch").bind("click", function(){
//		if (this.checked){
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-mrt-red') ){
//						edge.removeClass('red-hidden-edge');
//					}
//				});
//			});
//		} else {
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-mrt-red') ){
//						edge.addClass('red-hidden-edge');
//					}
//				});
//			});
//		}
//	});
	
//	$("#green-switch").bind("click", function(){
//		if (this.checked){
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-spf-green') ){
//						edge.removeClass('green-hidden-edge');
//					}
//				});
//			});
//		} else {
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-spf-green') ){
//						edge.addClass('green-hidden-edge');
//					}
//				});
//			});
//		}
//	});
	
//	$("#gadag-switch").bind("click", function(){
//		if (this.checked){
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-gadag') ){
//						edge.removeClass('gadag-hidden-edge');
//					}
//				});
//			});
//		} else {
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-gadag') ){
//						edge.addClass('gadag-hidden-edge');
//					}
//				});
//			});
//		}
//	});
//	
//	$("#link-switch").bind("click", function(){
//		if (this.checked){
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-link-labeled') ){
//						edge.removeClass('link-hidden-edge');
//					}
//				});
//			});
//		} else {
//			cy.batch(function(){
//				cy.edges().forEach(function (edge){
//					if ( edge.hasClass('edge-link-labeled') ){
//						edge.addClass('link-hidden-edge');
//					}
//				});
//			});
//		}
//	});
	
  }
});

}); // on dom ready