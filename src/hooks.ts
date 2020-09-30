import * as React from "react";
import { useContext, useEffect, useState, useMemo } from "react";
import { Smart } from "./Smart";

const SmartOptionsDefaults = {
  useState,
  devTools: false,
};

export function setDefaults(defaults: INewSmartOptions) {
  Object.assign(SmartOptionsDefaults, defaults);
}

export interface INewSmartOptions {
  factory?<T extends Smart<S, U>, S, U>(targetType: new () => T, config: U): T;
  useState?: any;
  devTools?: boolean | string;
}

export const newSmart = <T extends Smart<S, U>, S, U>(
  targetType: new () => T,
  config?: U,
  options?: INewSmartOptions
): [T, React.ComponentType<any>] => {
  options = Object.assign({}, options, SmartOptionsDefaults);

  // We are using memo values here to avoid redoing this on every rerender
  const model = useMemo(() => {
    let model;
    if (options?.factory) {
      model = options.factory(targetType, config);
    } else {
      model = new targetType();
    }
    model.setConfig(config);

    return model;
  }, []);

  const Provider = useMemo(() => {
    return ({ children }) => {
      return React.createElement((targetType as any).getContext().Provider, {
        value: model,
        children,
      });
    };
  }, []);

  // Each time we render we need to ensure this is set ok
  // We use the initial state from the model
  const useStateArguments = [model.state];
  if (options.devTools) {
    if (typeof options.devTools === "string") {
      useStateArguments.push(options.devTools);
    } else {
      // We are adding some randomness to it to avoid collision and confusion when more models are used that have the same name.
      useStateArguments.push(
        targetType.name + `(${Math.random().toString(36).slice(-6)})`
      );
    }
  }
  const [state, setState] = options.useState(...useStateArguments);

  // Ensure we are looking at the propper states.
  model.state = state;
  model.stateSetter = setState;

  useEffect(() => {
    model.init();
  }, []);

  return [model, Provider];
};

type Returnable<T> = (...args: any[]) => T;

/**
 * Smart creates a wrapper function which accepts a Component as argument
 * @param targetType
 * @param config
 * @param options
 */
export function smart<T extends Smart<S, U>, S, U>(
  targetType: new () => T,
  config?: U,
  options?: INewSmartOptions
): Returnable<React.ComponentType<any>> {
  return function (Component) {
    const Container = function (props) {
      const [api, Provider] = newSmart(targetType, config, options);

      return React.createElement(Provider, {
        children: React.createElement(Component, props),
      });
    };

    Container.displayName = `SmartComponent(${getDisplayName(Component)})`;

    return Container;
  };
}

export const useSmart = <T>(modelClass: { new (...args: any[]): T }): T => {
  return useContext((modelClass as any).getContext());
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
