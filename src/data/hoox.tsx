import * as React from 'react';

// TYPE DEFINITIONS

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

type StoreContext<State, DispatchProps> = React.Context<Store<State, DispatchProps>>

// UTIL

export function combineReducers<S, A>(reducers: { [K in keyof S]: Reducer<S, A> }): Reducer<S, A> {
	return (s: S, a: A) => {
		let state = s;

		for (const k in reducers) {
			state = reducers[k](state, a);
		}

		return state;
	}
}

export function NoOp<Action>(_: Action) { };

// REDUCER CUSTOM HOOKS

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

// CONTEXT CUSTOM HOOKS

export function createStore<State, Action, DispatchProps>(
	state: State,
	getDispatchProps: GetDispatchProps<Action, DispatchProps>,
): StoreContext<State, DispatchProps> {
	return React.createContext({
		state,
		actions: getDispatchProps(NoOp)
	});
}

type ComponentProps<State, DispatchProps> = {
	context: StoreContext<State, DispatchProps>,
	store: Store<State, DispatchProps>
}

export const HooxProvider: <State, DispatchProps>(
	props: ComponentProps<State, DispatchProps> & { children?: React.ReactNode }
) => React.ReactElement<any> = (props) => (
	<props.context.Provider value={props.store}>
		{props.children}
	</props.context.Provider>
);

export function useHoox<State, DispatchProps, MappedState = State, MappedDispatch = DispatchProps>(
	context: StoreContext<State, DispatchProps>,
	mapStateToProps: (state: State) => MappedState,
	mapDispatchToProps: (dispatch: DispatchProps) => MappedDispatch
): Store<MappedState, MappedDispatch> {
	const store = React.useContext(context);

	return {
		state: mapStateToProps(store.state),
		actions: mapDispatchToProps(store.actions)
	}
}