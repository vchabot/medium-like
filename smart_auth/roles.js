const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .createOwn("article")
 .readAny("article")
 .updateOwn("article")
 .deleteOwn("article")
 .createOwn("reaction")
 .readAny("article_search_by_tag")
 .readAny("article_search_by_keyword")
 .createOwn("comment")

 
ac.grant("admin")
 .extend("user")
 .updateAny("article")
 .deleteOwn("article")
 .updateAny("comment")
 .deleteAny("comment")
 .updateAny("reaction")
 .deleteAny("reaction")
 
return ac;
})();
