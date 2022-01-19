
function getPDFInfo(theFile) { 
	var flag = 0; // used to keep track if the %EOF line was encountered

	// The array to hold return values
	var pgCount = false;

	// Open the PDF file for reading
	theFile.open("r");

	// Search for %EOF line
	// This skips any garbage at the end of the file
	// if FOE% is encountered (%EOF read backwards), flag will be 15
	for(i=0; flag != 15; i++)
	{
		theFile.seek(i,2);
		switch(theFile.readch())
		{
			case "F":
				flag|=1;
				break;
			case "O":
				flag|=2;
				break;
			case "E":
				flag|=4;
				break;
			case "%":
				flag|=8;
				break;
			default:
				flag=0;
				break;
		}
	}
	// Jump back a small distance to allow going forward more easily
	theFile.seek(theFile.tell()-100);

	// Read until startxref section is reached
	while(theFile.readln() != "startxref");

	// Set the position of the first xref section
	var xrefPos = parseInt(theFile.readln(), 10);

	// The array for all the xref sections
	var	xrefArray = new Array();

	// Go to the xref section
	theFile.seek(xrefPos);

	// Determine length of xref entries
	// (not all PDFs are compliant with the requirement of 20 char/entry)
	xrefArray["lineLen"] = determineLineLen(theFile);

	// Get all the xref sections
	while(xrefPos != -1)
	{
		// Go to next section
		theFile.seek(xrefPos);

		// Make sure it's an xref line we went to, otherwise PDF is no good
		if (theFile.readln() != "xref") {
			theFile.close();
			var pageCountAlternative = getPDFPageCount(theFile);
			if (pageCountAlternative != -1) {
				pgCount = pageCountAlternative;			
				return pgCount;				
			} else {
				return false;			
			}
		}

		// Add the current xref section into the main array
		xrefArray[xrefArray.length] = makeXrefEntry(theFile, xrefArray.lineLen);

		// See if there are any more xref sections
		xrefPos = xrefArray[xrefArray.length-1].prevXref;
	}

	// Go get the location of the /Catalog section (the /Root obj)
	var objRef = -1;
	for(i=0; i < xrefArray.length; i++)
	{
		objRef = xrefArray[i].rootObj;
		if(objRef != -1)
		{
			i = xrefArray.length;
		}
	}

	// Double check root obj was found
	if(objRef == -1)
	{
		throwError("Unable to find Root object.", true, 98, theFile);
	}

	// Get the offset of the root section and set file position to it
	var theOffset = getByteOffset(theFile, objRef, xrefArray);
	theFile.seek(theOffset);

	// Determine the obj where the first page is located
	objRef = getRootPageNode(theFile);

	// Get the offset where the root page nod is located and set the file position to it
	theOffset = getByteOffset(theFile, objRef, xrefArray);
	theFile.seek(theOffset);
	
	// Get the page count info from the root page tree node section
	pgCount = readPageCount(theFile);	

	// Close the PDF file, finally all done!
	theFile.close();

	return pgCount;
}

function getPDFPageCount(f) {

  if(f.alias){f = f.resolve();}

  if(f == null){return -1;}

  if(f.hidden){f.hidden = false;}

  if(f.readonly){f.readonly = false;}

  f = new File(f.fsName);

  f.encoding = "Binary";

  if(!f.open("r","TEXT","R*ch")){return -1;}

  f.seek(0, 0); var str = f.read(); f.close();

  if(!str){return -1;}

  //f = new File(Folder.temp+"/123.TXT");

  //writeFile(f, str.toSource()); f.execute();

  var ix, _ix, lim, ps;



  ix = str.indexOf("/N ");

  if(ix == -1){

    var src = str.toSource();

    _ix = src.indexOf("<< /Type /Pages /Kids [");

    if(_ix == -1){

      ps = src.match(/<<\/Count (\d+)\/Type\/Pages\/Kids\[/);

      if(ps == null){

        ps = src.match(/obj <<\\n\/Type \/Pages\\n\/Count (\d+)\\n\/Kids \[/);

        if(ps == null){

          ps = src.match(/obj\\n<<\\n\/Type \/Pages\\n\/Kids \[.+\]\\n\/Count (\d+)\\n\//);

          if(ps == null){return -1;}

          lim = parseInt(ps[1]);

          if(isNaN(lim)){return -1;}

          return lim;

        }

        lim = parseInt(ps[1]);

        if(isNaN(lim)){return -1;}

        return lim;

      }

      lim = parseInt(ps[1]);

      if(isNaN(lim)){return -1;}

      return lim;

    }

    ix = src.indexOf("] /Count ", _ix);

    if(ix == -1){return -1;}

    _ix = src.indexOf(">>", ix);

    if(_ix == -1){return -1;}

    lim = parseInt(src.substring(ix+9, _ix));

    if(isNaN(lim)){return -1;}

    return lim;

  }

  _ix = str.indexOf("/T", ix);

  if(_ix == -1){

    ps = str.match(/<<\/Count (\d+)\/Type\/Pages\/Kids\[/);

    if(ps == null){return -1;}

    lim = parseInt(ps[1]);

    if(isNaN(lim)){return -1;}

    return lim;

  }

  lim = parseInt(str.substring(ix+3, _ix));

  if(isNaN(lim)){return -1;}

  return lim;

}

// Function to create an array of xref info
// File position must be set to second line of xref section
// *** File position changes in this function. ***
function makeXrefEntry(theFile, lineLen) {
	var newEntry = new Array();
	newEntry["theSects"] = new Array();
	var tempLine = theFile.readln();

	// Save info
	newEntry.theSects[0] = makeXrefSection(tempLine, theFile.tell());

	// Try to get to trailer line
	var xrefSec = newEntry.theSects[newEntry.theSects.length-1].refPos;
	var numObjs = newEntry.theSects[newEntry.theSects.length-1].numObjs;
	do
	{
		var getOut = true;
		for(i=0; i<numObjs;i++)
		{
			theFile.readln(); // get past the objects: tell( ) method is all screwed up in CS4
		}
		tempLine = theFile.readln();
		if(tempLine.indexOf("trailer") == -1)
		{ 
			// Found another xref section, create an entry for it
			var tempArray = makeXrefSection(tempLine, theFile.tell());
			newEntry.theSects[newEntry.theSects.length] = tempArray;
			xrefSec = tempArray.refPos;
			numObjs = tempArray.numObjs;
			getOut = false;
		}
	}while(!getOut);

	// Read line with trailer dict info in it
	// Need to get /Root object ref
	newEntry["rootObj"] = -1;
	newEntry["prevXref"] = -1;
	do
	{
		tempLine = theFile.readln();
		if(tempLine.indexOf("/Root") != -1)
		{			
			// Extract the obj location where the root of the page tree is located:
			newEntry.rootObj = parseInt(tempLine.substring(tempLine.indexOf("/Root") + 5), 10);
		}
		if(tempLine.indexOf("/Prev") != -1)
		{
			newEntry.prevXref = parseInt(tempLine.substring(tempLine.indexOf("/Prev") + 5), 10);
		}

	}while(tempLine.indexOf(">>") == -1);

	return newEntry;
}

// Function to save xref info to a given array
function makeXrefSection(theLine, thePos) {
	var tempArray = new Array();
	var temp = theLine.split(" ");
	tempArray["startObj"] = parseInt(temp[0], 10);
	tempArray["numObjs"] = parseInt(temp[1], 10);
	tempArray["refPos"] = thePos;
	return tempArray;
}

// Function that gets the page count form a root page section
// *** File position changes in this function. ***
function readPageCount(theFile) {
	// Read in first line of section
	var theLine = theFile.readln();

	// Locate the line containing the /Count entry
	while(theLine.indexOf("/Count") == -1)
	{
		theLine = theFile.readln();
	}

	// Extract the page count
	return parseInt(theLine.substring(theLine.indexOf("/Count") +6), 10);
}

// Function to determine length of xref entries
// Not all PDFs conform to the 20 char/entry requirement
// *** File position changes in this function. ***
function determineLineLen(theFile) {
	// Skip xref line
	theFile.readln();
	var lineLen = -1;

	// Loop trying to find lineLen
	do
	{
		var getOut = true;
		 var tempLine = theFile.readln();
		if(tempLine != "trailer")
		{
			// Get the number of object enteries in this section
			var numObj = parseInt(tempLine.split(" ")[1]);

			// If there is more than one entry in this section, use them to determime lineLen
			if(numObj > 1)
			{
				theFile.readln();
				var tempPos = theFile.tell();
				theFile.readln();
				lineLen = theFile.tell() - tempPos;
			}
			else
			{
				if(numObj == 1)
				{
					// Skip the single entry
					theFile.readln();
				}
				getOut = false;
			}
		}
		else
		{
			// Read next line(s) and extract previous xref section
			var getOut = false;
			do
			{
				tempLine = theFile.readln();
				if(tempLine.indexOf("/Prev") != -1)
				{
					theFile.seek(parseInt(tempLine.substring(tempLine.indexOf("/Prev") + 5)));
					getOut = true;
				}
			}while(tempLine.indexOf(">>") == -1 && !getOut);
			theFile.readln(); // Skip the xref line
			getOut = false;
		}
	}while(!getOut);

	// Check if there was a problem determining the line length
	if(lineLen == -1)
	{
		throwError("Unable to determine xref dictionary line length.", true, 97, theFile);
	}

	return lineLen;
}

// Function that determines the byte offset of an object number
// Searches the built array of xref sections and reads the offset for theObj
// *** File position changes in this function. ***
function getByteOffset(theFile, theObj, xrefArray) {
	var theOffset = -1;

	// Look for the theObj in all sections found previously
	for(i = 0; i < xrefArray.length; i++)
	{
		var tempArray = xrefArray[i];
		for(j=0; j < tempArray.theSects.length; j++)
		{
			 var tempArray2 = tempArray.theSects[j];

			// See if theObj falls within this section
			if(tempArray2.startObj <= theObj && theObj <= tempArray2.startObj + tempArray2.numObjs -1)
			{
				theFile.seek((tempArray2.refPos + ((theObj - tempArray2.startObj) * xrefArray.lineLen)));

				// Get the location of the obj
				var tempLine = theFile.readln();

				// Check if this is an old obj, if so ignore it
				// An xref entry with n is live, with f is not
				if(tempLine.indexOf("n") != -1)
				{
					theOffset = parseInt(tempLine, 10);

					// Cleanly get out of both loops
					j = tempArray.theSects.length;
					i = xrefArray.length;
				}
			}
		}
	}

	return theOffset;
}

// Function to extract the root page node object from a section
// File position must be at the start of the root page node
// *** File position changes in this function. ***
function getRootPageNode(theFile) {
	var tempLine = theFile.readln();

	// Go to line with /Page token in it
	while(tempLine.indexOf("/Pages") == -1)
	{
		tempLine = theFile.readln();
	}

	// Extract the root page obj number
	return parseInt(tempLine.substring(tempLine.indexOf("/Pages") + 6), 10);
}

// Error function
function throwError(msg, pdfError, idNum, fileToClose) {	

	if(fileToClose != null)
	{
		fileToClose.close();
	}
	
	if(pdfError)
	{
		// Throw err to be able to turn page numbering off
		throw Error(msg);
	}
	else
	{
		alert("ERROR: " + msg + " (" + idNum + ")", "MultiPageImporter Script Error");
		exit(idNum);
	}
}