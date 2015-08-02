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
  
  layout: {
    name: 'cola',
	nodeSpacing: 50,
  },
  
  // on graph initial layout done (could be async depending on layout...)
  ready: function(){
	  
	function reload_graph(){
	    document.getElementById("blue-switch").checked = true;
	    document.getElementById("red-switch").checked = true;
	    document.getElementById("green-switch").checked = true;
	    document.getElementById("gadag-switch").checked = true;
	    document.getElementById("link-switch").checked = true;
	    
		$.getJSON(NETWORK_FILE_NAME).success(function(network) {
			cy.load(network.elements);
		})
	    cy.elements().unselectify();
	
		cy.layout({
			name : 'cola',
			nodeSpacing: 50,
		});
	};
	
	var current_dest;
	var current_failed;
	
    window.cy = this;
    
    reload_graph();

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
					|| edge.hasClass('edge-link-labeled')){
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
	
	$("#cola-layout-button").bind("click", function(){
		cy.layout({
			name : 'cola',
			nodeSpacing: 50,
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