import * as React from "react";

export abstract class Smart<StateModel = any, Config = any> {
  public state: StateModel;
  public stateSetter: (oldState: StateModel) => StateModel;
  public config: Config;

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
  async init(): Promise<void> {}

  /**
   * Write code for initialisation like defining your state and others
   */
  async destroy(): Promise<void> {}

  static getContext() {
    throw new Error(
      "Please implement the static getContext() method which returns a React context object."
    );
  }

  /**
   * Overrides the whole state with a new model.
   * @param newStateModel
   */
  setState(newStateModel: StateModel) {
    this.state = newStateModel;
    this.stateSetter(newStateModel);
  }

  /**
   * Updates the state while preserving the other top-level variables
   * @param updateStateModel
   */
  updateState(updateStateModel: Partial<StateModel>) {
    this.setState({
      ...this.state,
      ...updateStateModel,
    });
  }
}
