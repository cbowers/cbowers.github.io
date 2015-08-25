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
    name: 'preset',
  },
  
  // on graph initial layout done (could be async depending on layout...)
  ready: function(){
	  
	function convert_zlib_b64_to_json_object(b64_data){
		console.log('b64_data file loaded successfully');
		console.log(b64_data);
		var zlib_data = atob(b64_data);
		console.log('atob converted b64 data: ' + zlib_data);
		var char_data    = zlib_data.split('').map(function(x){return x.charCodeAt(0);});
		console.log('char_data: ' + char_data);
		var bin_data     = new Uint8Array(char_data);
		console.log('bin_data: ' + bin_data);
		var data        = pako.inflate(bin_data);
		var str_data     = String.fromCharCode.apply(null, new Uint16Array(data));
		console.log("str_data:" + str_data);
		var json_object =  JSON.parse(str_data);	
		return json_object;
	}
	
	  
	function reload_graph(){
		cy.batch(function(){
			reset_switches();
			$.ajax({
				url: graph_file+'/graph_basic.json.gz.b64',
				type: "GET",
				dataType: "text",
				success: function(b64_data) {
					var network = convert_zlib_b64_to_json_object(b64_data);
					cy.load(network.elements);
					cy.layout({
						name : 'cola',
						nodeSpacing: 	
							function (node){
								return 10;
							},
					});	
				}
			});
			$.ajax({
				url: graph_file+'/gadag.json.gz.b64',
				type: "GET",
				dataType: "text",
				success: function(b64_data) {
					var network = convert_zlib_b64_to_json_object(b64_data);
					cy.add(network.elements);	
				}
			});
		});
	};
	
	function reload_graph2(){
		cy.batch(function(){
			reset_switches();
			$.getJSON(graph_file+'/graph_basic_positioned.json').success(function(network) {
				cy.load(network.elements);
				$.getJSON(graph_file+'/gadag.json').success(function(network) {
					console.log('gadag file loaded successfully');
					cy.add(network.elements);
				});
				current_dest = null;
			})
		});
	};
	
	function reload_graph3()
	{
		var textToWrite = JSON.stringify(cy.json());
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = 'graph_basic_positioned.json';
		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null)
		{
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else
		{
			// Firefox requires the link to be added to the DOM before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = function(event) { document.body.removeChild(event.target);};
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	};
	
	function reload_graph4(){
		reset_switches();
		allcy.remove(allcy.nodes());
		console.log('emptied cyall');
	};
	
	function fail_node(failed_node)
	  cy.batch(function(){
		  cy.nodes().removeClass('node-current-failed');
		  cy.elements('node#'+failed_node).addClass('node-current-failed');
		  var alt_failed_class = 'edge-alt-failed-node-' + failed_node;
		  cy.edges().forEach(function (edge){
			if ( edge.hasClass('edge-alt')){
				if ( edge.hasClass(alt_failed_class) ){
					edge.removeClass('hidden-edge')
				} else {
					edge.addClass('hidden-edge')
				} 
			}
		  });
	  });
	
	function toggle_prefix(click_node){
		  var prefix_class = 'edge-prefix-'+click_node;
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
	}
	
	function update_dest_data(old_dest, new_dest){
	    cy.batch(function(){
			var full_file;
			if (current_gadag_root == null){
				full_file = graph_file + '/dest_' + current_dest  +'.json'
			} else { 
				full_file = graph_file + '/gr_'+ current_gadag_root + '/dest_' + current_dest  +'.json';
			}
			var old_dest_class = 'edge-dest-' + old_dest;
			var old_edges = cy.edges().filterFn(function( ele ){
				if ( ele.hasClass(old_dest_class) ){
					return true;
				} else {
					return false;
				}
			});
			cy.elements('node#'+current_dest).addClass('node-current-dest');
			console.log("full file = " + full_file)
			$.ajax({
				url: full_file+'.gz.b64',
				type: "GET",
				dataType: "text",
				success: function(b64_data) {
					var network = convert_zlib_b64_to_json_object(b64_data);
					old_edges.remove()
					cy.add(network.elements);
				}
			});
		});
		
	}
	
	
    window.cy = this;
    
   
	var current_dest;
	var current_failed;
	var current_gadag_root = null;
	
	var graph_files = {
					'a':{'graph_file':'example_topo', 'node_spacing': 10},
	           	 	'k':{'graph_file':'random24', 'node_spacing': 10},
	           	 	'l':{'graph_file':'random101', 'node_spacing': 10},	
	}
	
	document.getElementById('lc_destination').checked = true;
	
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

	cy.on('tap', function(event){
		if ( document.getElementById('lc_destination').checked ){
			console.log("left_click is lc_destination")
			cy.nodes().removeClass('node-current-failed');
			cy.nodes().removeClass('node-current-dest');
			
			var old_dest = current_dest;
			var old_dest_class = 'edge-dest-' + old_dest;

			var evtTarget = event.cyTarget;
			if( evtTarget === cy ){
			    console.log('tap on background');
				var old_edges = cy.edges().filterFn(function( ele ){
					if ( ele.hasClass(old_dest_class) ){
						return true;
					} else {
						return false;
					}
				});
			    old_edges.remove()
			    current_dest = null
			    
			} else {
				console.log('tap on some element');
				if (evtTarget.isNode()){
				  console.log('tap on node');
				  current_dest = evtTarget.id();
				  update_dest_data(old_dest, current_dest)
				}
			}
		} else if (document.getElementById('lc_gadag_root').checked ){
			var evtTarget = event.cyTarget;
			if (evtTarget.isNode()){
				if (evtTarget.hasClass('node-named-proxy')) {
					$("#messages").html("<p>A named-proxy node representing a prefix node cannot be the GADAG root.");
					return;
				}
				var gadag_root = evtTarget.id();
				var old_edges = cy.edges().filterFn(function( ele ){
					if ( ele.hasClass('element-basic') ){
						return false;
					} else {
						return true;
					}
				});
			  
			  console.log('trying to change the gadag root')
			  
			$.ajax({
				url: graph_file +'/gr_'+ gadag_root  + '/gadag.json.gz.b64',
				type: "GET",
				dataType: "text",
				success: function(b64_data) {
					var network = convert_zlib_b64_to_json_object(b64_data);
					current_gadag_root = gadag_root;
					cy.nodes().removeClass('node-gadag-root');
					cy.elements('node#'+gadag_root).addClass('node-gadag-root');
					old_edges.remove();
					cy.add(network.elements);
					$("#messages").html("<p>Showing data using new GADAG root = " + gadag_root);
					update_dest_data(current_dest, current_dest);
						
				}
			}).fail( function() {
				$("#messages").html("<p>There is no data available for GADAG root = " + gadag_root);
			}); 
			}
		} else if (document.getElementById('lc_failed_node').checked ){
			var evtTarget = event.cyTarget;
			if (evtTarget.isNode()){
			  current_failed = evtTarget.id();
			  fail_node(current_failed);
			}
		} else if (document.getElementById('lc_prefix_toggle').checked ){
			var evtTarget = event.cyTarget;
			if (evtTarget.isNode()){
			  lclick_node = evtTarget.id();
			  if ( cy.elements('node#'+lclick_node).hasClass('node-named-proxy') ){
				  toggle_prefix(lclick_node);
			  }
			}
		} 
	});
	
	cy.on('cxttap', 'node', function(e){
		  var node = e.cyTarget;
		  rclick_node = node.id();
		  if ( cy.elements('node#'+rclick_node).hasClass('node-named-proxy') ){
			  toggle_prefix(rclick_node);
		  } else {
			  current_failed = rclick_node;
			  fail_node(current_failed);
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
	
  }
});

}); // on dom ready