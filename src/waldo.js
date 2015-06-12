const GLOBAL = (typeof window == 'object') ? window : global;

const find = {
  byName(searchTerm, options) {
    return this.searchMaybe('propName', 'string', searchTerm, options);
  },
  byType(searchTerm, options) {
    return this.searchMaybe('type', 'function', searchTerm, options);
  },
  byValue(searchTerm, options) {
    return this.searchMaybe('value', null, searchTerm, options);
  },
  byValueCoerced(searchTerm, options) {
    return this.searchMaybe('valueCoerced', null, searchTerm, options);
  },
  custom(fn, options) {
    return this.searchMaybe(fn, null, options);
  },
  searchMaybe(util, expected, searchTerm, options) {
    // integrity check arguments
    if (expected && typeof searchTerm != expected) {
      throw new Error(`${searchTerm} must be ${expected}`);
    }
    // only console.log if we are the global function
    if (this === GLOBAL.waldo) {
      GLOBAL.DEBUG = true;
    }
    return search(util, searchTerm, options);
  }
}

function search(util, searchTerm, {obj = GLOBAL, path} = {}) {
  util = searchBy[util] || util;

  let data;
  let alreadySeen;

  path || (path = (obj == GLOBAL) ? 'GLOBAL' : '');
  let queue = [{ obj, path }];
  let seen = [];

  let matches = [];

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
            const match = new Match({path, obj, prop, type});
            matches.push(match);
            GLOBAL.DEBUG && match.log();
          }
        }
      } catch(e) {}
    }
  }

  return matches;
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

class Match {
  constructor(props) {
    Object.assign(this, props);
  }

  toString() {
    let {path, prop, type} = this;
    return `${path}.${prop} -> (${type}) ${this.getValue()}`;
  }

  getValue() {
    let {obj, prop} = this;
    return obj[prop];
  }

  log() {
    console.log(this.toString());
  }
}

// for console running
GLOBAL.waldo = Object.assign({}, find, {debug: true});

export default find;
