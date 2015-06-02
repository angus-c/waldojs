function dealWithIt(util, expected, searchTerm, options) {
  // integrity check arguments
  !expected || typeof searchTerm == expected ?
    traverse(util, searchTerm, options) :
    console.error(searchTerm, ' must be ', expected);
}

function traverse(util, searchTerm, {obj = window || global, path} = {}) {
  util = tests[util] || util;

  let data;
  let alreadySeen;

  path || (path = (obj == global) ? 'global' : '');
  let queue = [{ obj, path }];
  let seen = [];

  // a non-recursive solution to avoid call stack limits
  // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
  while ((data = queue.pop())) {
    let {obj, path} = data;

    for (const prop in obj) {
      // IE may throw errors when accessing/coercing some properties
      try {
        if (obj.hasOwnProperty(prop)) {
          // inspect objects
          if ([obj[prop]] == '[object Object]') {
            // check if already searched (prevents circular references)
            for (
              var i = -1;
              seen[++i] && !(alreadySeen = like(seen[i].obj, obj[prop]) && seen[i]);
            );
            // add to stack
            if (!alreadySeen) {
              data = { 'obj': obj[prop], 'path': `${path}.${prop}`};
              queue.push(data);
              seen.push(data);
            }
          }
          // if match detected, log it
          if (util(searchTerm, obj, prop)) {
            const type = alreadySeen ? `<${alreadySeen.path}>` : typeof obj[prop];
            console.log(`${path}.${prop} -> (${type}) ${obj[prop]}`);
          }
        }
      } catch(e) { }
    }
  }
}

// based on http://stackoverflow.com/a/6713782
function like(x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    if (!y.hasOwnProperty(p)) {
      return false;
    }
    if (x[p] === y[p]) continue;
    if (typeof x[p] != 'object') {
      return false;
    }
    if (!like(x[p], y[p])) {
      return false;
    }
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
}

const tests = {
  propName(searchTerm, obj, prop) {
    return searchTerm == prop;
  },
  type(searchTerm, obj, prop) {
    return obj[prop] instanceof searchTerm;
  },
  value(searchTerm, obj, prop) {
    return obj[prop] === searchTerm;
  },
  valueCoerced(searchTerm, obj, prop) {
    return obj[prop] == searchTerm;
  }
};

// public methods
const find = {
  byName(searchTerm, options) {
    dealWithIt('propName', 'string', searchTerm, options);
  },
  byType(searchTerm, options) {
    dealWithIt('type', 'function', searchTerm, options);
  },
  byValue(searchTerm, options) {
    dealWithIt('value', null, searchTerm, options);
  },
  byValueCoerced(searchTerm, options) {
    dealWithIt('valueCoerced', null, searchTerm, options);
  },
  custom(fn, options) {
    traverse(fn, null, options);
  }
}

export default find;
