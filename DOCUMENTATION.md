Smart is a very small library which helps decouple state management and non-ui-related actions to separate classes. Behind the scenes it's just hooks, nothing fancy.

Let us a imagine a counter model:

```ts
import { Smart } from "@kaviar/smart";

interface IState {
  count: number;
}

class CounterModel extends Smart<IState> {
  state: IState = {
    count: 1,
  };

  increment() {
    // Imutable state
    this.setState({ count: this.state.count + 1 });
  }
}
```

Above we see that our model only has an initial state, and then it exposes certain actions and uses `setState` to introduce the new `immutable` state.

Using it can be done like this:

```tsx
function Basic() {
  // Api here will be a fresh instance of CounterModel + full autocompletion
  const api = useSmart(CounterModel);
  // Note that you can have multiple "smarts" with different models

  // You'll have autocompletion on api.state
  // This will be re-rendered when state changes
  const { state } = api;
  return (
    <div>
      Count: {state.count}
      <br />
      <button onClick={() => api.increment()}>Increment</button>
    </div>
  );
}

const Component = smart(CounterModel)(Basic);
```

Another, more verbose way to create it would be like this:

```tsx
const Component = () => {
  const [api, Provider] = newSmart(CounterModel);

  return (
    <Provider>
      <Basic />
    </Provider>
  );
};
```

This would be helpful when you want to have multiple `hooks` in the same component.

The model can be configured and act differently based on a configuration it receives:

```ts
import { Smart } from "@kaviar/smart";

interface IState {
  loading: boolean;
  results: any[];
}

interface IConfig {
  endpoint: string;
}

class HTTPLoader extends Smart<IState, IConfig> {
  state: IState = {
    loading: true,
    results: [],
  };

  async init() {
    this.load();
  }

  load() {
    fetch(this.config.endpoint).then((results) => {
      this.setState({
        loading: false,
        results,
      });
    });
  }
}
```

Using this is super easy:

```tsx
const endpoint = "https://donuts.com/api/flavors";

// You benefit of autocompletion
const Component = smart(HTTPLoader, { endpoint })(Donuts);
const [api, Provider] = newSmart(HTTPLoader, { endpoint });
```

There is another argument called `options` when creating a smart:

```tsx
smart(CustomModel, config, {
  factory(classType, configuration) {
    // you can create the class via a container maybe
    // default it's just
    new classType();

    // Configuration is set later via `setConfig()`
  },
  useState: // You can use the state from `reinspect` to hook ReduxDev Tools
);
```

To be able to use Redux DevTools:

```tsx
import { setDefaults } from "@kaviar/smart";
import { useState } from "reinspect";

setDefaults({
  useState,
  devTools: true,
});

// You can add your own custom model name:
smart(
  CounterModel,
  {},
  {
    devTools: "Counter",
  }
);
```

More information here: https://github.com/troch/reinspect

To be able to properly manipulate complex models with state, we recommend [immer](https://immerjs.github.io/immer/docs/introduction)
