import * as React from 'react';

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type Dispatch<Action> = (action: Action) => void;
export type GetDispatchProps<Action, DispatchProps> = (dispatch: Dispatch<Action>) => DispatchProps;

export type Middleware<State, Action> = (state: State)
	=> (dispatch: React.Dispatch<Action>)
		=> React.Dispatch<Action>;

export type Store<State, DispatchProps> = {
	state: State,
	actions: DispatchProps
}

export function combineReducers<S, A>(reducers: { [K in keyof S]: Reducer<S, A> }): Reducer<S, A> {
	return (s: S, a: A) => {
		let state = s;

		for (const k in reducers) {
			state = reducers[k](state, a);
		}

		return state;
	}
}

export function useStore<State, Action, DispatchProps>(
	reducer: Reducer<State, Action>,
	state: State,
	getDispatchProps: GetDispatchProps<Action, DispatchProps>,
	middleware?: Middleware<State, Action> | Middleware<State, Action>[]
): Store<State, DispatchProps> {
	const [currState, defaultDispatch] = React.useReducer(
		reducer,
		state
	);

	const dispatch = middleware
		? (middleware instanceof Array
			? middleware.reduce((p, c) => c(currState)(p), defaultDispatch)
			: middleware(currState)(defaultDispatch)
		)
		: defaultDispatch;

	return {
		state: currState,
		actions: getDispatchProps(dispatch)
	};
};

export function NoOp<Action>(_: Action) { };