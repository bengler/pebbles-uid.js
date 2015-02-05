
module.exports = prop;

function createSetter(name) {
  return function set(val) {
    this['_'+name] = val;
  };
}

function createGetter(name) {
  return function get() {
    return this['_'+name];
  };
}

function parseConfig(name, config) {
  if (config === '_') {
    return { get: createGetter(name), set: createGetter(name) };
  }

  if (config.set === '_') {
    config.set = createSetter(name)
  }

  if (config.get === '_') {
    config.get = createGetter(name)
  }
  return config;
}

function prop(target) {
  var self = {
    prop: function (name, config) {
      if (typeof name === 'function') {
        return this.method(name);
      }
      if (typeof config === 'function') {
        return this.method(name, config);
      }
      Object.defineProperty(target, name, parseConfig(name, config))
      return self;
    },
    method: function (name, method) {
      if (typeof name === 'function') {
        method = name;
        name = method.name;
      }
      if (!name) {
        throw new TypeError("Anonymous functions cannot be used as methods, please convert method to a named function or provide a name as first parameter..")
      }
      target[name] = method;

      return self;
    },
    getter: function (name, getter) {
      if (typeof name === 'function') {
        getter = name;
        name = getter.name;
      }

      if (!name) {
        throw new TypeError("Anonymous functions cannot be used as getters, please convert method to a named function or provide a name as first parameter.")
      }

      if (getter === '_') {
        getter = createGetter(name)
      }

      Object.defineProperty(target, name, { get: getter });
      return self;
    },
    setter: function (name, setter) {
      if (typeof name === 'function') {
        setter = name;
        name = setter.name;
      }

      if (!name) {
        throw new TypeError("Anonymous functions cannot be used as setters, please convert method to a named function or provide a name as first parameter.")
      }

      if (setter === '_') {
        setter = createSetter(name)
      }

      Object.defineProperty(target, name, { set: setter });
      return self;
    },
    alias: function (to, from) {
      target[to] = target[from];
      return self;
    }
  };
  return self;
}