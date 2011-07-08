javascript:(function(){
  var traverse = function(task, findMe, root, path){
    var root= root || window;
    var path=path || ((root==window) ? "window" : "");
    var props = Object.keys(root);
    props.forEach(function(each){
      if(tasks[task](root, findMe, each)){
        console.log([path, ".", each].join(""), "->",["(", typeof root[each], ")"].join(""), root[each]);
      }
      if((""+root[each])=="[object Object]" && path.split(".").indexOf(each) == -1){
        traverse(task, findMe, root[each], [path,each].join("."));
      }
    });
  }

  var tasks = {
    'p':function(root, findMe, each) {return findMe == each},
    'i':function(root, findMe, each) {return root[each] instanceof findMe}
  }

  window.find={
    props: function(findMe, root, path) {
      (typeof findMe == 'string') && traverse('p', findMe, root, path);
    },
    instances: function(findMe,root,path) {
      (typeof findMe == 'function') && traverse('i', findMe, root, path);
    }
  }
})();

