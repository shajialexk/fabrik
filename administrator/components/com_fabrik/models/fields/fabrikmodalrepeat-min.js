/*! fabrik */
var FabrikModalRepeat=new Class({options:{j3:!0},initialize:function(a,b,c,d){this.names=b,this.field=c,this.content=!1,this.setup=!1,this.elid=a,this.win={},this.el={},this.field={},this.options=Object.append(this.options,d),this.ready()?this.setUp():this.timer=this.testReady.periodical(500,this)},ready:function(){return"null"===typeOf(document.id(this.elid))?!1:!0},testReady:function(){this.ready()&&(this.timer&&clearInterval(this.timer),this.setUp())},setUp:function(){this.button=document.id(this.elid+"_button"),this.mask=new Mask(document.body,{style:{"background-color":"#000",opacity:.4,"z-index":9998}}),document.addEvent("click:relay(*[data-modal="+this.elid+"])",function(a,b){a.preventDefault();var c,d=b.getNext("input").id;this.field[d]=b.getNext("input");var e=b.getParent("li");e||(e=b.getParent("div.control-group")),this.origContainer=e,c=e.getElement("table"),"null"!==typeOf(c)&&(this.el[d]=c),this.openWindow(d)}.bind(this))},openWindow:function(a){var b=!1;this.win[a]||(b=!0,this.makeTarget(a)),this.el[a].inject(this.win[a],"top"),this.el[a].show(),(!this.win[a]||b)&&this.makeWin(a),this.win[a].show(),this.win[a].position(),this.resizeWin(!0,a),this.win[a].position(),this.mask.show()},makeTarget:function(a){this.win[a]=new Element("div",{"data-modal-content":a,styles:{padding:"5px","background-color":"#fff",display:"none","z-index":9999}}).inject(document.body)},makeWin:function(a){var b=new Element("button.btn.button.btn-primary").set("text","close");b.addEvent("click",function(b){b.stop(),this.store(a),this.el[a].hide(),this.el[a].inject(this.origContainer),this.close()}.bind(this));var c=new Element("div.controls.form-actions",{styles:{"text-align":"right","margin-bottom":0}}).adopt(b);this.win[a].adopt(c),this.win[a].position(),this.content=this.el[a],this.build(a),this.watchButtons(this.win[a],a)},resizeWin:function(a){Object.each(this.win,function(b,c){var d=this.el[c].getDimensions(!0),e=b.getDimensions(!0);if(b.setStyles({width:d.x+"px"}),"undefined"!=typeof Fabrik&&!Fabrik.bootstrapped){var f=a?e.y:d.y+30;b.setStyle("height",f+"px")}}.bind(this))},close:function(){Object.each(this.win,function(a){a.hide()}),this.mask.hide()},_getRadioValues:function(a){var b=[];return this.getTrs(a).each(function(a){var c=(sel=a.getElement("input[type=radio]:checked"))?sel.get("value"):c="";b.push(c)}),b},_setRadioValues:function(a,b){this.getTrs(b).each(function(b,c){(r=b.getElement("input[type=radio][value="+a[c]+"]"))&&(r.checked="checked")})},watchButtons:function(a,b){a.addEvent("click:relay(a.add)",function(c){if(tr=this.findTr(c)){var d=this._getRadioValues(b),e=tr.getParent("table").getElement("tbody"),f=this.tmpl.clone(!0,!0);f.inject(e),this.stripe(b),this._setRadioValues(d,b),this.resizeWin(!1,b),this.resetChosen(f)}a.position(),c.stop()}.bind(this)),a.addEvent("click:relay(a.remove)",function(c){var d=this.content.getElements("tbody tr");d.length<=1,(tr=this.findTr(c))&&tr.dispose(),this.resizeWin(!1,b),a.position(),c.stop()}.bind(this))},resetChosen:function(a){this.options.j3&&jQuery&&"null"!==typeOf(jQuery("select").chosen)&&(a.getElements("select").removeClass("chzn-done").show(),a.getElements("select").each(function(a){a.id=a.id+"_"+(1e7*Math.random()).toInt()}),a.getElements(".chzn-container").destroy(),jQuery(a).find("select").chosen({disable_search_threshold:10,allow_single_deselect:!0}))},getTrs:function(a){return this.win[a].getElement("tbody").getElements("tr")},stripe:function(a){trs=this.getTrs(a);for(var b=0;b<trs.length;b++){trs[b].removeClass("row1").removeClass("row0"),trs[b].addClass("row"+b%2);var c=trs[b].getElements("input[type=radio]");c.each(function(a){a.name=a.name.replace(/\[([0-9])\]/,"["+b+"]")})}},build:function(a){this.win[a]||this.makeWin(a);var b=JSON.decode(this.field[a].get("value"));"null"===typeOf(b)&&(b={});for(var c=this.win[a].getElement("tbody").getElement("tr"),d=Object.keys(b),e=0===d.length||0===b[d[0]].length?!0:!1,f=e?1:b[d[0]].length,g=1;f>g;g++)clone=c.clone(),clone.inject(c,"after"),this.resetChosen(clone);this.stripe(a);var h=this.getTrs(a);for(g=0;f>g;g++)d.each(function(a){h[g].getElements("*[name*="+a+"]").each(function(c){"radio"===c.get("type")?c.value===b[a][g]&&(c.checked=!0):(c.value=b[a][g],"select"===c.get("tag")&&"undefined"!=typeof jQuery&&jQuery(c).trigger("liszt:updated"))})});this.tmpl=c,e&&c.dispose()},findTr:function(a){var b=a.target.getParents().filter(function(a){return"tr"===a.get("tag")});return 0===b.length?!1:b[0]},store:function(a){var b=this.content;b=this.el[a];for(var c={},d=0;d<this.names.length;d++){var e=this.names[d],f=b.getElements("*[name*="+e+"]");c[e]=[],f.each(function(a){"radio"===a.get("type")?a.get("checked")===!0&&c[e].push(a.get("value")):c[e].push(a.get("value"))}.bind(this))}return this.field[a].value=JSON.encode(c),!0}});