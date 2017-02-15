var json_sel_book = [
	{"index": false, "name": false, "chapters": false, "chapter": false, "verses": false, "verse": false}
	];

var json_panel = [
	{"id": "change_language", "callback": "getBibleAux"},
	{"id": "change_version"},
	{"id": "mark_sel"},
	{"id": "edit_sel"},
	{"id": "share_sel"},
	];

var json_language = [
	{"id": "pt_aa", "idiom": "Portugues (BR)", "desc": "Almeida Revisada Imprensa Bíblica"},
	{"id": "pt_acf","idiom": "Portugues (BR)", "desc": "Almeida Corrigida e Revisada Fiel"},
	{"id": "pt_nvi","idiom": "Portugues (BR)", "desc": "Nova Versão Internacional"},
	{"id": "en_bbe","idiom": "English", "desc": "Basic English"},
	{"id": "en_kjv","idiom": "English", "desc": "King James Version English"},
	{"id": "de_schlachter","idiom": "Deutschland", "desc": "Schlachter"},
	{"id": "es_rvr","idiom": "Espanhol", "desc": "Reina Valera"}
	];

var sumary = [
	[0,"G&ecirc;nesis",50],[1,"&ecirc;xodo",40],[2,"Lev&iacute;tico",27],[3,"N&uacute;meros",36],[4,"Deuteron&ocirc;mio",34],[5,"Josu&eacute;",24],[6,"Ju&iacute;zes",21],[7,"Rute",4],[8,"1 Samuel",31],[9,"2 Samuel",24],[10,"1 Reis",22],[11,"2 Reis",25],[12,"1 Cr&ocirc;nicas",29],[13,"2 Cr&ocirc;nicas",36],[14,"Esdras",10],[15,"Neemias",13],[16,"Ester",10],[17,"J&oacute;",42],[18,"Salmos",150],[19,"Prov&eacute;rbios",31],[20,"Eclesiastes",12],[21,"Cânticos",8],[22,"Isa&iacute;as",66],[23,"Jeremias",52],[24,"Lamentaç&otilde;es de Jeremias",5],[25,"Ezequiel",48],[26,"Daniel",12],[27,"Os&eacute;ias",14],[28,"Joel",3],[29,"Am&oacute;s",9],[30,"Obadias",1],[31,"Jonas",4],[32,"Miqu&eacute;ias",7],[33,"Naum",3],[34,"Habacuque",3],[35,"Sofonias",3],[36,"Ageu",2],[37,"Zacarias",14],[38,"Malaquias",4],[39,"Mateus",28],[40,"Marcos",16],[41,"Lucas",24],[42,"Jo&atilde;o",21],[43,"Atos",28],[44,"Romanos",16],[45,"1 Cor&iacute;ntios",16],[46,"2 Cor&iacute;ntios",13],[47,"Gálatas",6],[48,"Ef&eacute;sios",6],[49,"Filipenses",4],[50,"Colossenses",4],[51,"1 Tessalonicenses",5],[52,"2 Tessalonicenses",3],[53,"1 Tim&oacute;teo",6],[54,"2 Tim&oacute;teo",4],[55,"Tito",3],[56,"Filemom",1],[57,"Hebreus",13],[58,"Tiago",5],[59,"1 Pedro",5],[60,"2 Pedro",3],[61,"1 Jo&atilde;o",3],[62,"2 Jo&atilde;o",1],[63,"3 Jo&atilde;o",1],[64,"Judas",1],[65,"Apocalipse",22]];

var json_marked = [];

var json_planreader = false;
 			
var shelf=false;

		$(document).ready(function(e) {
			
			shelf = Snap("#shelf");
			var bible = Snap.load("images/shelf_pt_br.svg", 
				function ( loadedFragment ) {                                                shelf.append( loadedFragment ); 
					var gs = shelf.selectAll('text');
					gs.forEach(function(el) {
						//console.log(el);
						//console.log(el.attr('id'), el.innerHTML);
						el.click(function() { 
							getChapters( (Number(this.attr('id').substring(4))-1) );
						});
					});	
					
					var ws = window.screen.width;
					var hs = window.screen.height;
					console.log(ws, hs);
					//ws *= ( ws < 550  )?3:1;
					//hs *= ( ws < 680  )?3:2.5;;
								
					//if ( isMobile() ) alert ("width: "+ws+" height: "+hs);
										
					shelf.attr({
					  //viewBox: "0 0 "+(ws)+" "+(hs),
					  width: (ws*0.9),
					  height: (hs*1)
					});				
					
					});
			

			$('#menu-verse').on('click', function() { showPanel(this);	});
			
			var url = "json/pt_aa.json";
			 loadBible (url);
			 setBibleInfo('pt_aa');

		});

		function loadBible (url) {
			var jqxhr = $.getJSON(url, function(data) {
			  //console.log( "success" );
			})
			  .done(function(data) {
				//console.log( "second success" );
				livros = data;
				getShelf();
			  })
			  .fail(function() {
				console.log( "error" );
				return false;
			  })
			  .always(function() {
				//console.log( "complete" );
			  });			
		}
		
		function loadPlanReader () {
			var url = "json/planreader.json";
			var jqxhr = $.getJSON(url, function(data) {
			  //console.log( "success" );
			})
			  .done(function(data) {
				//console.log( "second success" );
				json_planreader = data;
				getPlanReader();
			  })
			  .fail(function() {
				console.log( "error" );
				return false;
			  })
			  .always(function() {
				//console.log( "complete" );
			  });			
		}
		
		function getPlanReader () {
			var menu = "<br><A href='' onclick='getShelf()' >Voltar</A>";

			for (m=1; m < 12; m++){
				var placesData = SQLike.q({
				 Select: ['*'],  From: json_planreader ,Where: function(){return this.MES==m}
				});
				if ( placesData.length ) {
					//console.log(m, placesData.length );
					var tbody = menu+"<tr><th colspan='4' style='background-color: grey;' >"+$('#'+m).attr('name').toUpperCase()+"</th></tr><tr><th>Dia</th><th rowspan='1'>Livro</th><th>Capitulos</th><th>Lido</th></tr>";
					$(placesData).each(function (places, data) {
						//console.log(data.LIVRO );
						var readed = (data.LIDO)?"checked":"";
						var strike = (data.LIDO)?"class='readed'":"";
						tbody += "<tr "+strike+" ><td>"+data.DIA+"</td><th>"+sumary[Number(data.LIVRO)-1][1]+"</th><td>"+data.CAPITULOS+"</td><td><input type='checkbox' value='"+places+"' "+readed+" /></td></tr>";
						
					});
					$('#'+m).html(tbody);
					//MergeCommonRows(elem(''+m), 1);
				}
			}
			showPlanReader();
		}	
		
		function showPlanReader () {
			$('input[type=checkbox]').each(function () {
				$(this).click (function () { setAsRead (this); });
			});			
			hideAllDivs();
			$('#content-planreader').show();
			window.scrollTo(0, 0);
			closeNav();
		}
		
		function getBibleAux (lang) {
			var url = "json/"+lang+".json"; 
			var jqxhr = $.getJSON(url, function(data) {
			  //console.log( "success" );
			})
			  .done(function(data) {
				//console.log( "second success" );
				changeSelectedVerses(data);
			  })
			  .fail(function() {
				console.log( "error" );
				return false;
			  })
			  .always(function() {
				//console.log( "complete" );
			  });
		}
		
		function showHistory(data) {
			var list = "<br><A href='' onclick='getShelf()' >Voltar</A>"+data;
			//eval ("var placesData = ["+data+"]");
			//$(placesData).each(function (places, data) {
				//list += "<br>"+data.date+"&nbsp;<A href='' onclick='' >"+data.book+"&nbsp"+data.chapter+":"+data.verse+"</A>";
			//});
			hideAllDivs();
			$('#content-history').load("json/history.html");
			$('#content-history').show();
			closeNav();

		}
		
		function getHistory () {
			var url = "json/markedverses.json"; 
			var jqxhr = $.get(url, function(data) {
			  //console.log( "success" );
			})
			  .done(function(data) {
				//console.log( "second success" );
				showHistory(data);
			  })
			  .fail(function(error) {
				console.log("error: ", error );
				return false;
			  })
			  .always(function() {
				//console.log( "complete" );
			  });
		}

		
		function getVerses (book, chapter, verses) {
			json_sel_book.chapter = chapter; 
			json_sel_book.verses = livros[book]['chapters'][chapter];
			var olchptrs = "<center><h1>"+json_sel_book.name+"</h1><h2>Capitulo: "+(chapter+1)+"</h2><h3></h3></center><ol class='circles-list'>";
			for (var p in json_sel_book.verses )  
				for (var v in json_sel_book.verses[p] ) 
					olchptrs += "<li id='"+v+"' class='text-verse' onclick='VerseHighlight(this)'>"+json_sel_book.verses[p][v]+"</li><br>";
			olchptrs += "<ol>";
			olchptrs += "<center><br><br>";
			
			olchptrs += (chapter>0)?"<img onclick='getVerses("+book+", "+(chapter-1)+")' src='images/e-book-with-left-arrow.png' class='img-verse-action' />&nbsp;&nbsp;":"";
			
			olchptrs += "<img onclick='getShelf()' src='images/library_books_shelf.png' class='img-verse-action' />&nbsp;&nbsp;";
			
			olchptrs += "<img onclick='getChapters("+book+")' src='images/book.png' class='img-verse-action' />&nbsp;&nbsp;";
			
			olchptrs += ((chapter+1)<json_sel_book.chapters)?"<img onclick='getVerses("+book+", "+(chapter+1)+")' src='images/e-book-with-right-arrow.jpg' class='img-verse-action' />":"";
			
			olchptrs += "</center>";
			
			hideAllDivs();
			$('#content-verses').html(olchptrs);
			$('#content-verses').show();
			window.scrollTo(0, 0);
		}
		
		function getChapters (index) { 
			json_sel_book.index = index;
			json_sel_book.chapters =  livros[index]['chapters'].length;
			json_sel_book.name = livros[index]['book'];
			var olchptrs = "<center><h1>"+json_sel_book.name+"</h1><h3></h3></center>";
			for (i=1; i <= json_sel_book.chapters; i++ )
				olchptrs += "<span id='olbook"+i+"' class='numberCircle' onclick='getVerses("+index+","+(i-1)+")'>"+(i)+"</span>";
				olchptrs += "<br><br><center><img onclick='getShelf()' 				src='images/library_books_shelf.png' class='arrows_read'  /></center>";
				hideAllDivs();
				
				$('#content-chapter').html(olchptrs);
				$('#content-chapter').show();
				if ( json_sel_book.chapter )
					$('#olbook'+(json_sel_book.chapter)).css('background-color', 'yellow');
				window.scrollTo(0, 0);
		}
		
		function getShelf() {
			hideAllDivs();
			$('#content-shelf').show();
			window.scrollTo(0, 0);
		}	
		
		function isMobile(){
			var a = navigator.userAgent||navigator.vendor||window.opera;
			if(/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile|o2|opera m(ob|in)i|palm( os)?|p(ixi|re)\/|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a))
				return true;
			else
				return false;
		}

		function elem (id) { return document.getElementById(id); }
		
		function showDiv (id) { 
			if ( $('#'+id).is(':hidden') )
				$("#"+id).show();
			else
				$("#"+id).hide();
		}
		
		 function showPanel (img) {  
			var visble = false;
			var action = '';
			action += '<span class="action" onclick="markVerses()" ><label class="label">Marcar</label></span><br>';
			action += '<span class="action" onclick="showDiv(\'panellanguage\')" ><label class="label">Traduzir</label></span><br>&nbsp;&nbsp;<div id="panellanguage" style="display: none" ></div>';
			action += '<br><span class="action" onclick="showDiv(\'panelversion\')" ><label class="label" >Alterar Vers&atilde;o</label></span><br>&nbsp;&nbsp;<div id="panelversion" style="display: none" ></div>';
			
			 
			if ( img.src.indexOf("plus")>1 ) {
				img.src="images/cancel.jpg";
				visible = true;
				$("#panel").html(action);
				var menulang =  $("#language").html().replace(/changeSource/g,'getBibleAux');
				var menuvers =  $("#version").html().replace(/changeSource/g,'getBibleAux');
				var menuvers =  menuvers.replace(/white/g,'black');
				$("#panel").css('bottom', '100px');
				$("#panellanguage").html( menulang );
				$("#panelversion").html( menuvers );
				$("#panel").slideToggle("slow");			
				$('#panel').show();
			}
			else {
				img.src= "images/plus.png";
				$('#panel').hide();
			}
		}

		function hideAllDivs() { 
			$('div').each(function (index, div) {
				if ( div.id.indexOf('content')>=0 )
					$('#'+div.id).hide();
			});	
		}
	
		function VerseHighlight (li) { 
			var bgcolor = "";
			if (  $(li).css("background-color")=="rgb(255, 255, 0)") {
				bgcolor = "white";
				$('#menu-verse').hide();
			}
			else {
				bgcolor = "yellow";
				$('#menu-verse').show();
			}
			$(li).delay(30000).css("background-color", bgcolor);
		}

		function markVerses () { 
			$('.text-verse').each (function () { 
				if ( $(this).css("background-color")=="rgb(255, 255, 0)") {
					var v = this.id;
					var now =  showLocalDate();
					//var placesData = SQLike.q({			 InsertInto: json_marked,Values: {
					//	book: json_sel_book.index,
					//	chapter: json_sel_book.chapter,
					//	verse: v,
					//	date: now}
					//});
					var book = json_sel_book.index;
					var chapter = json_sel_book.chapter;
					var placesData = "<br>"+now+"&nbsp;<A href='' onclick='getVerses ("+book+","+chapter+")'>"+sumary[book][1]+"&nbsp;"+(chapter+1)+":"+v+"</A>";
	
					//alert (JSON.stringify(placesData));
					
				var params = {file:"history.html",mode: "a", placesdata: placesData};

				$.post("writejson.php", params).done(function( data ) { console.log(data); });		
					
				}
			});
			elem('menu-verse').src="images/plus.png";
			$("#panel").slideToggle("slow");
		}	
		
		function changeSelectedVerses (data) { 
			$('.text-verse').each (function () { 
				if ( $(this).css("background-color")=="rgb(255, 255, 0)") {
					var v = this.id;
					var text =  data[json_sel_book.index]['chapters'][json_sel_book.chapter][json_sel_book.chapter+1][v];	
					$(this).html( text );	
				}
			});
			elem('menu-verse').src="images/plus.png";
			$("#panel").slideToggle("slow");
		}	
		function openNav() {
			elem("mySidenav").style.width = "250px";
			elem("main").style.marginLeft = "250px";
			document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
		}

		function closeNav() {
			elem("mySidenav").style.width = "0";
			elem("main").style.marginLeft= "0";
			document.body.style.backgroundColor = "white";
		}

		function setBibleInfo (lang) {
			var placesData = SQLike.q( {
				 Select: ['*'],  From: json_language ,Where: function(){return this.id==lang}
			});

			$('#lbllanguage').html(placesData[0].idiom);
			$('#lblversion').html(placesData[0].desc);
		}
		
		function changeSource (source) { 
			var url = "json/"+source+".json";
			 loadBible (url);
			 setBibleInfo(source);
			closeNav();
		}

		function setAsRead (chk) {
			var row = chk.parentElement.parentElement;
			if (chk.checked) {
				row.style.textDecoration = "line-through";
				row.style.color = "red";
				var now =  showLocalDate();
				
				var placesData = SQLike.q({
					 Update: json_planreader,Set: function(){this.LIDO=true, this.DATA=now},Where: function(){return this.DIA==row.cells[0].innerHTML && this.CAPITULOS==row.cells[2].innerHTML}
					 });
					 //alert (JSON.stringify(placesData));
				
				var params = {file:"planreader.json",mode: "w", placesdata: JSON.stringify(placesData)};

				$.post("writejson.php", params).done(function( data ) { var x=0; });		
			}					 
			else {
				row.style.textDecoration = "none";
				row.style.color = "black";
			}
		}

	function MergeCommonRows(table, column) {
		var result = SQLike.q({
			Select: ['|count|','LIVRO','LIVRO'],
			From: json_planreader,
			GroupBy: ['LIVRO'],
			Having: function(){return this.count_LIVRO>1},
			OrderBy: ['LIVRO']
		});
		
		//alert (JSON.stringify(placesData));
		$(result).each(function (places, data) {
			var getin = false;
			for (var r=1; r < table.rows.length-2; r++ ){
				if (table.rows[r].cells[column].innerHTML == sumary[Number(data.LIVRO)-1][1] ) {
					if ( !getin ) {
						table.rows[r].cells[column].rowSpan=data.count_LIVRO;		
						getin = true;
					}
					else	
						table.rows[r].deleteCell(column);
				}
			}
		});
	}
	
	
	function showLocalDate(){
		var dNow = new Date();
		var localdate= (dNow.getDate() + '-' +dNow.getMonth()+1) + '-' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes() + ":" + dNow.getSeconds();
		
		return (localdate);
	}
	
