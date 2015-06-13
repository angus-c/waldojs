const GLOBAL = (typeof window == 'object') ? window : global;

const find = {
  byName(what, where) {
    return this.searchMaybe('propName', 'string', what, where);
  },
  byType(what, where) {
    return this.searchMaybe('type', 'function', what, where);
  },
  byValue(what, where) {
    return this.searchMaybe('value', null, what, where);
  },
  byValueCoerced(what, where) {
    return this.searchMaybe('valueCoerced', null, what, where);
  },
  custom(fn, where) {
    return this.searchMaybe(fn, null, where);
  },
  searchMaybe(util, expected, what, where) {
    // integrity check arguments
    if (expected && typeof what != expected) {
      throw new Error(`${what} must be ${expected}`);
    }
    // only console.log if we are the global function
    if (this === GLOBAL.waldo) {
      GLOBAL.DEBUG = true;
    }
    return search(util, what, where);
  }
}

function search(util, what, where = GLOBAL) {
  util = searchBy[util] || util;

  let data;
  let alreadySeen;

  const path = (where == GLOBAL) ? 'GLOBAL' : 'SRC';
  let queue = [{ where, path }];
  let seen = [];

  let matches = [];

  // a non-recursive solution to avoid call stack limits
  // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
  while ((data = queue.pop())) {
    let {where, path} = data;

    for (const prop in where) {
      // IE may throw errors when accessing/coercing some properties
      try {
        if (where.hasOwnProperty(prop)) {
          // inspect objects
          if ([where[prop]] == '[object Object]') {
            // check if already searched (prevents circular references)
            for (
              var i = -1;
              seen[++i] && !(alreadySeen = like(seen[i].where, where[prop]) && seen[i]);
            );
            // add to stack
            if (!alreadySeen) {
              data = { where: where[prop], path: `${path}.${prop}`};
              queue.push(data);
              seen.push(data);
            }
          }
          // if match detected, push it.
          if (util(what, where, prop)) {
            const type = alreadySeen ? `<${alreadySeen.path}>` : typeof where[prop];
            const match = new Match(
              {path: `${path}.${prop}`, obj: where, prop, type});
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
  propName(what, where, prop) {
    return what == prop;
  },
  type(what, where, prop) {
    return where[prop] instanceof what;
  },
  value(what, where, prop) {
    return where[prop] === what;
  },
  valueCoerced(what, where, prop) {
    return where[prop] == what;
  }
};

class Match {
  constructor(props) {
    Object.assign(this, props);
  }

  toString() {
    let {path, type} = this;
    return `${path} -> (${type}) ${this.getValue()}`;
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
