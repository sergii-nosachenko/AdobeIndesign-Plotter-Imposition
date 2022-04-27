// Used code from https://gist.github.com/mericson/6509997

function loadUrl(url, callback) {

    if (BridgeTalk.getStatus('bridge') == 'ISNOTINSTALLED') return; // Skip if Bridge is not installed

    if (BridgeTalk.getStatus('bridge') == 'ISNOTRUNNING') BridgeTalk.launch('bridge', 'background'); // Launch Bridge in background

    var bt = new BridgeTalk();
    bt.target = 'bridge';  

    var s = '';
    s += "if (!ExternalObject.webaccesslib) {\n";
    s += "  ExternalObject.webaccesslib = new ExternalObject('lib:webaccesslib');\n";
    s += "}\n";
    s += "var html = '';\n";
    s += "var http = new HttpConnection('" + url + "');\n";
    s += "http.requestheaders = ['Cache-Control', 'no-cache'];\n";
    s += "http.response = html;\n";
    s += "http.execute();\n";
    s += "http.response;\n";

    bt.body = s;

    bt.onResult = function( inBT ) { callback( null, inBT.body );  };
    bt.onError = function( inBT ) { callback( 1, null ); };
    bt.send(50);       
}