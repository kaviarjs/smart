import * as React from "react";

export type SmartSubscriber = (oldState, newState) => void;
export abstract class Smart<StateModel = any, Config = any> {
  public state: StateModel;
  public config: Config;
  public subscribers: SmartSubscriber[] = [];

  /**
   * This function should be called only once when the state is created
   * @param config
   */
  setConfig(config?: Config) {
    if (!config) {
      config = {} as Config;
    }
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
    const oldState = this.state;
    this.state = newStateModel;
    this.subscribers.forEach((subscriber) => {
      subscriber(oldState, this.state);
    });
  }

  /**
   * @param subscriber
   */
  protected subscribe(subscriber: SmartSubscriber) {
    if (this.subscribers.indexOf(subscriber) === -1) {
      this.subscribers.push(subscriber);
    }
  }

  /**
   * @param subscriber
   */
  protected unsubscribe(subscriber: SmartSubscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
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
