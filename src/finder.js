import Query from './query';
import Match from './match';

let waldo = {
  byName(searchTerm, options) {
    searchMaybe('propName', 'string', searchTerm, options);
  },
  byType(searchTerm, options) {
    searchMaybe('type', 'function', searchTerm, options);
  },
  byValue(searchTerm, options) {
    searchMaybe('value', null, searchTerm, options);
  },
  byValueCoerced(searchTerm, options) {
    searchMaybe('valueCoerced', null, searchTerm, options);
  },
  custom(fn, options) {
    searchMaybe(fn, null, options);
  }
}

function searchMaybe(util, expected, searchTerm, options) {
  // integrity check arguments
  !expected || typeof searchTerm == expected ?
    search(util, searchTerm, options) :
    console.error(searchTerm, ' must be ', expected);
}

function search(util, searchTerm, {obj = window || global, path} = {}) {
  util = searchBy[util] || util;

  let data;
  let alreadySeen;

  debugger;
  path || (path = (obj == global) ? 'global' : '');
  let queue = [{ obj, path }];
  let seen = [];

  let query = new Query(util, searchTerm, path);

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
            query.addMatch(new Match({path, obj, prop, type}));
            console.log(`${path}.${prop} -> (${type}) ${obj[prop]}`);
          }
        }
      } catch(e) {
        console.warn(e);
      }
    }
  }

  return query;
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

const searchBy = {
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

export default waldo;
