import * as React from "react";

const BasicContext = React.createContext(null);
BasicContext.displayName = "SmartModelContext";

export abstract class Smart<StateModel = any, Config = any> {
  public state: StateModel;
  public stateSetter: (oldState: StateModel) => StateModel;
  public config: Config;
  public static reactContext = React.createContext(null);

  /**
   * This function should be called only once when the state is created
   * @param config
   */
  setConfig(config: Config) {
    this.config = config;
  }

  /**
   * Write code for initialisation like defining your state and others
   */
  init(): void | Promise<void> {}

  static getContext() {
    return BasicContext;
  }

  setState(newStateModel: StateModel) {
    this.stateSetter(newStateModel);
  }
}
