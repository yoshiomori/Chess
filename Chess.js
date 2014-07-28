/**
 * Main Chess Code
 */
function chess(){
	var canvas = document.getElementById("window");
	var errorInfo = "";
	function onContextCreationError(event) {

		canvas.removeEventListener(
				"webglcontextcreationerror",
				onContextCreationError, false);

		errorInfo = e.statusMessage || "Unknown";
	}

	canvas.addEventListener(
			"webglcontextcreationerror",
			onContextCreationError, false);

	var gl = canvas.getContext("webgl"||"experimental-webgl");
	if(!gl) {
		alert("A WebGL context could not be created.\nReason: " +
				errorInfo);
	}

	/**
	 * Load obj files
	 */
	var xmlhttp;
	if(window.XMLHttpRequest) xmlhttp = new XMLHttpRequest;
	else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var vertices = new Array;
			var normals = new Array;
			var faces = new Array;
			xmlhttp.responseText.split("\n").forEach(function(line){
				if(/^v (.*) (.*) (.*)$/g.test(line))
					vertices.push([parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)]);
				else if(/^vn (.*) (.*) (.*)$/g.test(line))
					normals.push([parseFloat(RegExp.$1), parseFloat(RegExp.$2), parseFloat(RegExp.$3)]);
				else if(/^f (\d*)\/\/(\d*) (\d*)\/\/(\d*) (\d*)\/\/(\d*)$/g.test(line))
					faces.push([
					            [parseInt(RegExp.$1), parseInt(RegExp.$2)],
					            [parseInt(RegExp.$3), parseInt(RegExp.$4)],
					            [parseInt(RegExp.$5), parseInt(RegExp.$6)]
					            ]);
			});
			var verticeNormalSearch = new Array;
			var verticeNormalIndexData = new Array;
			var verticeNormalData = new Array;
			var counter = 0;
			faces.forEach(function(face){
				face.forEach(function(verticeNormal){
					if(verticeNormalSearch[verticeNormal] != undefined)
						verticeNormalIndexData.push(verticeNormalSearch[verticeNormal]);
					else{
						verticeNormalIndexData.push(verticeNormalSearch[verticeNormal] = counter++);
						verticeNormalData = verticeNormalData.concat(verticeNormal);
					}
				});
			});
			var verticeNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, verticeNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticeNormalData), gl.STATIC_DRAW);
			var verticeNormalIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticeNormalIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(verticeNormalIndexData), gl.STATIC_DRAW);
			// TODO: Criar Shaders e fazer a ligação entre os shaders criados e os buffers
		}
	};
	xmlhttp.open("GET", "objects/bispo.obj", true);
	xmlhttp.send();
}