/* v1.3: trust evidence module. */
(function(){
'use strict';
function store(){
 if(!db.trust)db.trust={schema:1,answers:{},paper:{}};
 db.trust.answers=db.trust.answers||{};
 db.trust.paper=db.trust.paper||{};
 return db.trust;
}
window.TakumiTrust={store};
})();