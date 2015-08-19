$(function(){ // on dom ready
	
//var NETWORK_FILE_NAME = 'example_topo_gadag.json';
var NETWORK_FILE_NAME = 'topo-15a_graph.json';

$('#cy').cytoscape({
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'background-color': 'black',
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
    .selector('.node-named-proxy')
      .css({
        'background-color': 'DarkViolet',
    	'border-color': 'DarkViolet',
    	'border-width': 2,
    	'width': 45,
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
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'DarkViolet',
        'line-style': 'solid',
      })
    .selector('.edge-pnar2')
      .css({
        'line-color': 'DarkViolet',
        'target-arrow-shape': 'circle',
        'target-arrow-color': 'DarkViolet',
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
	
	function node_spacing_func(node){
		if (node.hasClass('node-named-proxy')) {
			return 500;
		} else {
			return node_spacing;
		}
	}
	
	function edge_length_func(edge){
		if (edge.hasClass('edge-to-prefix-adv')) {
			return 500;
		} else {
			return 100;
		}
	}
	  
	function reload_graph(){
		cy.batch(function(){
		    document.getElementById("blue-switch").checked = true;
		    document.getElementById("red-switch").checked = true;
		    document.getElementById("green-switch").checked = true;
		    document.getElementById("gadag-switch").checked = true;
		    document.getElementById("link-switch").checked = true;
		    
			$.getJSON(graph_file).success(function(network) {
				cy.load(network.elements);
			})		
		});
	};
	
    window.cy = this;
    
	var current_dest;
	var current_failed;
	
	var graph_files = {
	           	    'a': {'graph_file':'example_topo_graph.json', 'node_spacing': 10},
	           	    'b':{'graph_file':'topo-15a_graph.json', 'node_spacing': 100},
	           	 	'c':{'graph_file':'topo-15b_graph.json', 'node_spacing': 100},
	           	 	'd':{'graph_file':'random22_topology.json', 'node_spacing': 10},
	           	 	'e':{'graph_file':'random22_graph.json', 'node_spacing': 10 },
	           	 	'f':{'graph_file':'random100_topology.json', 'node_spacing': 10},
	}	
	
	for (graph in graph_files) {
		$("#graph-select").append( '<option value="' + graph + '">' + graph_files[graph].graph_file);
	}

	var graph_file = graph_files['a'].graph_file;
	var node_spacing = graph_files['a'].node_spacing;
	
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

	cy.on('tap', 'node', function(e){
	  var node = e.cyTarget; 
	  current_dest = node.id();
	  var dest_class = 'edge-dest-' + current_dest;
	  cy.batch(function(){
		  cy.nodes().removeClass('node-current-dest');
		  cy.elements('node#'+current_dest).addClass('node-current-dest');
		  cy.nodes().removeClass('node-current-failed');
		  cy.edges().addClass('hidden-edge');
		  cy.edges().forEach(function (edge){
			if ( edge.hasClass(dest_class) 
					|| edge.hasClass('edge-gadag')
					|| edge.hasClass('edge-link-labeled')
					|| edge.hasClass('edge-to-prefix-adv')){
				edge.removeClass('hidden-edge')
			}
		  });
	  });
	});
	
	cy.on('cxttap', 'node', function(e){
		  var node = e.cyTarget;
		  current_failed = node.id();
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
	});	
	
	$("#load-graph-button").bind("click", function(){
		reload_graph();
	});
    
	$("#cose-layout-button").bind("click", function(){
		cy.layout({
			name : 'cose',
		});
	});
	
	$("#cola1-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			edgeLength: edge_length_func,
		});
	});
	
	$("#cola2-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			nodeSpacing: node_spacing_func,
		});
	});
	
	$("#unhide-edges-button").bind("click", function(){
		cy.edges().removeClass('hidden-edge');
	});
	
	$("#blue-switch").bind("click", function(){
		if (this.checked){
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-mrt-blue') ){
						edge.removeClass('blue-hidden-edge');
					}
				});
			});
		} else {
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-mrt-blue') ){
						edge.addClass('blue-hidden-edge');
					}
				});
			});
		}
	});

	$("#red-switch").bind("click", function(){
		if (this.checked){
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-mrt-red') ){
						edge.removeClass('red-hidden-edge');
					}
				});
			});
		} else {
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-mrt-red') ){
						edge.addClass('red-hidden-edge');
					}
				});
			});
		}
	});
	
	$("#green-switch").bind("click", function(){
		if (this.checked){
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-spf-green') ){
						edge.removeClass('green-hidden-edge');
					}
				});
			});
		} else {
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-spf-green') ){
						edge.addClass('green-hidden-edge');
					}
				});
			});
		}
	});
	
	$("#gadag-switch").bind("click", function(){
		if (this.checked){
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-gadag') ){
						edge.removeClass('gadag-hidden-edge');
					}
				});
			});
		} else {
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-gadag') ){
						edge.addClass('gadag-hidden-edge');
					}
				});
			});
		}
	});
	
	$("#link-switch").bind("click", function(){
		if (this.checked){
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-link-labeled') ){
						edge.removeClass('link-hidden-edge');
					}
				});
			});
		} else {
			cy.batch(function(){
				cy.edges().forEach(function (edge){
					if ( edge.hasClass('edge-link-labeled') ){
						edge.addClass('link-hidden-edge');
					}
				});
			});
		}
	});
	
  }
});

}); // on dom ready