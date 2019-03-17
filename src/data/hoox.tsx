import * as React from 'react';

// TYPE DEFINITIONS

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type Dispatch<Action> = React.Dispatch<Action>;

export type Middleware<State, Action> = (state: State)
	=> (dispatch: React.Dispatch<Action>)
		=> React.Dispatch<Action>;

export type Store<State, Action> = {
	state: State,
	dispatch: React.Dispatch<Action>
}

export type StoreProps<State, DispatchProps> = {
	state: State,
	actions: DispatchProps
}

type StoreContext<State, Action> = React.Context<Store<State, Action>>;

type StoreConfig<State, Action> = {
	reducer: Reducer<State, Action>,
	state: State,
	middleware?: Middleware<State, Action> | Middleware<State, Action>[],
	context: StoreContext<State, Action>
};

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

export function NoOp<Action>(_: Action): void { };

// REDUCER CUSTOM HOOKS

export function useStore<State, Action, DispatchProps = undefined>(
	reducer: Reducer<State, Action>,
	state: State,
	middleware?: Middleware<State, Action> | Middleware<State, Action>[]
): Store<State, Action> {
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
		dispatch,
	};
};

export function useHoox<State, Action, DispatchProps, MappedState = State>(
	store: Store<State, Action> | StoreContext<State, Action>,
	mapStateToProps: (state: State) => MappedState,
	mapDispatchToProps: (dispatch: React.Dispatch<Action>) => DispatchProps
): StoreProps<MappedState, DispatchProps> {
	const hooxStore: Store<State, Action> = (store as StoreContext<State, Action>).Consumer
		? React.useContext(store as StoreContext<State, Action>) as Store<State, Action>
		: store as Store<State, Action>;

	return {
		state: mapStateToProps(hooxStore.state),
		actions: mapDispatchToProps(hooxStore.dispatch)
	}
}

// CONTEXT CUSTOM HOOKS

export function createStore<State, Action>(
	reducer: Reducer<State, Action>,
	state: State,
	middleware?: Middleware<State, Action> | Middleware<State, Action>[]
) {
	const dispatch: React.Dispatch<Action> = NoOp;

	const store: StoreConfig<State, Action> = {
		reducer,
		state,
		middleware,
		context: React.createContext({
			state,
			dispatch
		})
	};

	return {
		store,
		useStore: <MappedState, DispatchProps>(
			mapStateToProps: (state: State) => MappedState,
			mapDispatchToProps: (dispatch: React.Dispatch<Action>) => DispatchProps
		) => useHoox(React.useContext(store.context), mapStateToProps, mapDispatchToProps)
	};
}

type ComponentProps<State, Action> = {
	store: StoreConfig<State, Action>
}

export const HooxProvider: <State, Action>(
	props: ComponentProps<State, Action> & { children?: React.ReactNode }
) => React.ReactElement<any> = (props) => {
	const { reducer, state, middleware, context } = props.store;

	return (
		<context.Provider value={useStore(reducer, state, middleware)}>
			{props.children}
		</context.Provider>
	);
};