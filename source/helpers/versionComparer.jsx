/**
  Compares two software version numbers (e.g. "1.7.1" or "1.2b").

   Forked from: https://gist.githubusercontent.com/TheDistantSea/8021359

   @param {string} v1 The first version to be compared.

   @param {string} v2 The second version to be compared.

   @param {object} [options] Optional flags that affect comparison behavior:

   lexicographical: (true/[false]) compares each part of the version strings lexicographically instead of naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than "1.2".
   zeroExtend: ([true]/false) changes the result if one version string has less parts than the other. In this case the shorter string will be padded with "zero" parts instead of being considered smaller.
   @returns {number|NaN}

   0 if the versions are equal
   a negative integer if v1 < v2
   a positive integer if v1 > v2
   NaN if either version string is in the wrong format
*/

function versionCompare(v1, v2, options) {
  var lexicographical = (options && options.lexicographical) || false,
      zeroExtend = (options && options.zeroExtend) || true,
      v1parts = (v1 || "0").split('.'),
      v2parts = (v2 || "0").split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-zαß]*$/ : /^\d+[A-Za-zαß]?$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(function(x){
     var match = (/[A-Za-zαß]/).exec(x);  
     return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)):x);
    });
    v2parts = v2parts.map(function(x){
     var match = (/[A-Za-zαß]/).exec(x);  
     return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)):x);
    });
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    }
    else if (v1parts[i] > v2parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}