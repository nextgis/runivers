(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{91:function(t,e,r){"use strict";r.d(e,"b",(function(){return i})),r.d(e,"c",(function(){return h}));var a=65,n=73,o=79;function i(t,e){return e=e||5,function(t,e){var r="00000"+t.easting,i="00000"+t.northing;return t.zoneNumber+t.zoneLetter+(d=t.easting,k=t.northing,A=t.zoneNumber,w=l(A),m=Math.floor(d/1e5),p=Math.floor(k/1e5)%20,h=m,s=p,c=w,u=c-1,f="AJSAJS".charCodeAt(u),M="AFAFAF".charCodeAt(u),b=f+h-1,g=M+s,v=!1,b>90&&(b=b-90+a-1,v=!0),(b===n||f<n&&b>n||(b>n||f<n)&&v)&&b++,(b===o||f<o&&b>o||(b>o||f<o)&&v)&&++b===n&&b++,b>90&&(b=b-90+a-1),g>86?(g=g-86+a-1,v=!0):v=!1,(g===n||M<n&&g>n||(g>n||M<n)&&v)&&g++,(g===o||M<o&&g>o||(g>o||M<o)&&v)&&++g===n&&g++,g>86&&(g=g-86+a-1),String.fromCharCode(b)+String.fromCharCode(g))+r.substr(r.length-5,e)+i.substr(i.length-5,e);var h,s,c,u,f,M,b,g,v;var d,k,A,w,m,p}(function(t){var e,r,a,n,o,i,h,c=t.lat,u=t.lon,l=6378137,M=s(c),b=s(u);h=Math.floor((u+180)/6)+1,180===u&&(h=60);c>=56&&c<64&&u>=3&&u<12&&(h=32);c>=72&&c<84&&(u>=0&&u<9?h=31:u>=9&&u<21?h=33:u>=21&&u<33?h=35:u>=33&&u<42&&(h=37));i=s(6*(h-1)-180+3),.006739496752268451,e=l/Math.sqrt(1-.00669438*Math.sin(M)*Math.sin(M)),r=Math.tan(M)*Math.tan(M),a=.006739496752268451*Math.cos(M)*Math.cos(M),n=Math.cos(M)*(b-i),o=l*(.9983242984503243*M-.002514607064228144*Math.sin(2*M)+2639046602129982e-21*Math.sin(4*M)-3.418046101696858e-9*Math.sin(6*M));var g=.9996*e*(n+(1-r+a)*n*n*n/6+(5-18*r+r*r+72*a-.39089081163157013)*n*n*n*n*n/120)+5e5,v=.9996*(o+e*Math.tan(M)*(n*n/2+(5-r+9*a+4*a*a)*n*n*n*n/24+(61-58*r+r*r+600*a-2.2240339282485886)*n*n*n*n*n*n/720));c<0&&(v+=1e7);return{northing:Math.round(v),easting:Math.round(g),zoneNumber:h,zoneLetter:f(c)}}({lat:t[1],lon:t[0]}),e)}function h(t){var e=u(M(t.toUpperCase()));return e.lat&&e.lon?[e.lon,e.lat]:[(e.left+e.right)/2,(e.top+e.bottom)/2]}function s(t){return t*(Math.PI/180)}function c(t){return t/Math.PI*180}function u(t){var e=t.northing,r=t.easting,a=t.zoneLetter,n=t.zoneNumber;if(n<0||n>60)return null;var o,i,h,s,f,l,M,b,g=6378137,v=(1-Math.sqrt(.99330562))/(1+Math.sqrt(.99330562)),d=r-5e5,k=e;a<"N"&&(k-=1e7),l=6*(n-1)-180+3,b=(M=k/.9996/6367449.145945056)+(3*v/2-27*v*v*v/32)*Math.sin(2*M)+(21*v*v/16-55*v*v*v*v/32)*Math.sin(4*M)+151*v*v*v/96*Math.sin(6*M),o=g/Math.sqrt(1-.00669438*Math.sin(b)*Math.sin(b)),i=Math.tan(b)*Math.tan(b),h=.006739496752268451*Math.cos(b)*Math.cos(b),s=.99330562*g/Math.pow(1-.00669438*Math.sin(b)*Math.sin(b),1.5),f=d/(.9996*o);var A=b-o*Math.tan(b)/s*(f*f/2-(5+3*i+10*h-4*h*h-.06065547077041606)*f*f*f*f/24+(61+90*i+298*h+45*i*i-1.6983531815716497-3*h*h)*f*f*f*f*f*f/720);A=c(A);var w,m=(f-(1+2*i+h)*f*f*f/6+(5-2*h+28*i-3*h*h+.05391597401814761+24*i*i)*f*f*f*f*f/120)/Math.cos(b);if(m=l+c(m),t.accuracy){var p=u({northing:t.northing+t.accuracy,easting:t.easting+t.accuracy,zoneLetter:t.zoneLetter,zoneNumber:t.zoneNumber});w={top:p.lat,right:p.lon,bottom:A,left:m}}else w={lat:A,lon:m};return w}function f(t){var e="Z";return 84>=t&&t>=72?e="X":72>t&&t>=64?e="W":64>t&&t>=56?e="V":56>t&&t>=48?e="U":48>t&&t>=40?e="T":40>t&&t>=32?e="S":32>t&&t>=24?e="R":24>t&&t>=16?e="Q":16>t&&t>=8?e="P":8>t&&t>=0?e="N":0>t&&t>=-8?e="M":-8>t&&t>=-16?e="L":-16>t&&t>=-24?e="K":-24>t&&t>=-32?e="J":-32>t&&t>=-40?e="H":-40>t&&t>=-48?e="G":-48>t&&t>=-56?e="F":-56>t&&t>=-64?e="E":-64>t&&t>=-72?e="D":-72>t&&t>=-80&&(e="C"),e}function l(t){var e=t%6;return 0===e&&(e=6),e}function M(t){if(t&&0===t.length)throw"MGRSPoint coverting from nothing";for(var e,r=t.length,i=null,h="",s=0;!/[A-Z]/.test(e=t.charAt(s));){if(s>=2)throw"MGRSPoint bad conversion from: "+t;h+=e,s++}var c=parseInt(h,10);if(0===s||s+3>r)throw"MGRSPoint bad conversion from: "+t;var u=t.charAt(s++);if(u<="A"||"B"===u||"Y"===u||u>="Z"||"I"===u||"O"===u)throw"MGRSPoint zone letter "+u+" not handled: "+t;i=t.substring(s,s+=2);for(var f=l(c),M=function(t,e){var r="AJSAJS".charCodeAt(e-1),i=1e5,h=!1;for(;r!==t.charCodeAt(0);){if(++r===n&&r++,r===o&&r++,r>90){if(h)throw"Bad character: "+t;r=a,h=!0}i+=1e5}return i}(i.charAt(0),f),g=function(t,e){if(t>"V")throw"MGRSPoint given invalid Northing "+t;var r="AFAFAF".charCodeAt(e-1),i=0,h=!1;for(;r!==t.charCodeAt(0);){if(++r===n&&r++,r===o&&r++,r>86){if(h)throw"Bad character: "+t;r=a,h=!0}i+=1e5}return i}(i.charAt(1),f);g<b(u);)g+=2e6;var v=r-s;if(v%2!=0)throw"MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters"+t;var d,k,A,w=v/2,m=0,p=0;return w>0&&(d=1e5/Math.pow(10,w),k=t.substring(s,s+w),m=parseFloat(k)*d,A=t.substring(s+w),p=parseFloat(A)*d),{easting:m+M,northing:p+g,zoneLetter:u,zoneNumber:c,accuracy:d}}function b(t){var e;switch(t){case"C":e=11e5;break;case"D":e=2e6;break;case"E":e=28e5;break;case"F":e=37e5;break;case"G":e=46e5;break;case"H":e=55e5;break;case"J":e=64e5;break;case"K":e=73e5;break;case"L":e=82e5;break;case"M":e=91e5;break;case"N":e=0;break;case"P":e=8e5;break;case"Q":e=17e5;break;case"R":e=26e5;break;case"S":e=35e5;break;case"T":e=44e5;break;case"U":e=53e5;break;case"V":e=62e5;break;case"W":e=7e6;break;case"X":e=79e5;break;default:e=-1}if(e>=0)return e;throw"Invalid zone letter: "+t}e.a={forward:i,inverse:function(t){var e=u(M(t.toUpperCase()));if(e.lat&&e.lon)return[e.lon,e.lat,e.lon,e.lat];return[e.left,e.bottom,e.right,e.top]},toPoint:h}}}]);